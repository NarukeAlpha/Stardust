// Since we're using Electron IPC for database access, this file now serves
// primarily as a type definition file and convenience wrapper for the Electron API

export interface ChatMessage {
    id: number;
    sessionId: string;
    content: string;
    isUser: boolean;
    agentId?: string;
    flowId: string;
    timestamp: string;
}

export interface Session {
    id: number;
    sessionId: string;
    name: string;
    modelId: string;
    flowId: string;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}

export interface Agent {
    id: number;
    name: string;
    api: string;
    role: string;
    systemPrompt: string;
    isLocked: boolean;
    createdAt: string;
}

export interface MCPConnection {
    id: number;
    name: string;
    type: string;
    status: 'connected' | 'disconnected';
    createdAt: string;
}

// Backend API URL
const API_URL = 'http://localhost:85395/api';

// Database service that uses Electron IPC or direct API calls
export class DatabaseService {
    // Check if Electron is available (for use in development with browser previews)
    private static isElectronAvailable(): boolean {
        return window.electron !== undefined;
    }

    // Fallback storage using localStorage when Electron is not available
    private static getLocalStorage(key: string): any {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    private static setLocalStorage(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Helper method for API calls
    private static async apiCall(endpoint: string, method: string, data?: any): Promise<any> {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data ? JSON.stringify(data) : undefined,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Unknown API error');
            }

            return result.data;
        } catch (error) {
            console.error(`API error (${endpoint}):`, error);
            throw error;
        }
    }

    // Session methods
    static async getSessions(): Promise<Session[]> {
        if (this.isElectronAvailable()) {
            return window.electron.db.getSessions();
        }
        
        try {
            return await this.apiCall('/sessions', 'GET');
        } catch (error) {
            console.error('Failed to get sessions:', error);
            // Fallback to localStorage in case API is unavailable
            return this.getLocalStorage('sessions') || [];
        }
    }

    static async createSession(session: Partial<Session>): Promise<Session> {
        if (this.isElectronAvailable()) {
            return window.electron.db.createSession(session);
        }
        
        try {
            return await this.apiCall('/sessions', 'POST', session);
        } catch (error) {
            console.error('Failed to create session:', error);
            
            // Fallback to localStorage
            const sessions = await this.getSessions();
            const newSession: Session = {
                id: Date.now(),
                sessionId: crypto.randomUUID(),
                name: session.name || 'New Chat',
                modelId: session.modelId || 'gpt-4o',
                flowId: session.flowId || 'default',
                messageCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isDeleted: false,
                ...session
            };
            
            sessions.push(newSession);
            this.setLocalStorage('sessions', sessions);
            return newSession;
        }
    }

    static async deleteSessions(sessionIds: string[]): Promise<void> {
        if (this.isElectronAvailable()) {
            await window.electron.db.deleteSessions(sessionIds);
            return;
        }
        
        try {
            await this.apiCall('/sessions/delete', 'POST', { sessionIds });
        } catch (error) {
            console.error('Failed to delete sessions:', error);
            
            // Fallback to localStorage
            const sessions = await this.getSessions();
            const updatedSessions = sessions.map(session => 
                sessionIds.includes(session.sessionId) 
                    ? { ...session, isDeleted: true, updatedAt: new Date().toISOString() }
                    : session
            );
            this.setLocalStorage('sessions', updatedSessions);
        }
    }

    static async archiveSessions(): Promise<void> {
        if (this.isElectronAvailable()) {
            await window.electron.db.archiveSessions();
            return;
        }
        
        try {
            await this.apiCall('/sessions/archive', 'POST');
        } catch (error) {
            console.error('Failed to archive sessions:', error);
            
            // For localStorage, we'll actually remove the deleted sessions
            const sessions = await this.getSessions();
            const activeSessions = sessions.filter(session => !session.isDeleted);
            this.setLocalStorage('sessions', activeSessions);
            
            // And store archived ones separately
            const archivedSessions = sessions.filter(session => session.isDeleted);
            const currentArchive = this.getLocalStorage('archivedSessions') || [];
            this.setLocalStorage('archivedSessions', [...currentArchive, ...archivedSessions]);
        }
    }

    // Message methods
    static async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
        if (this.isElectronAvailable()) {
            return window.electron.db.getSessionMessages(sessionId);
        }
        
        try {
            return await this.apiCall(`/sessions/${sessionId}/messages`, 'GET');
        } catch (error) {
            console.error('Failed to get messages:', error);
            
            // Fallback to localStorage
            const messages = this.getLocalStorage('messages') || [];
            return messages.filter((msg: ChatMessage) => msg.sessionId === sessionId);
        }
    }

    static async sendMessage(sessionId: string, message: Partial<ChatMessage>, modelId: string, flowId: string): Promise<ChatMessage> {
        if (this.isElectronAvailable()) {
            return window.electron.db.sendMessage(sessionId, message, modelId, flowId);
        }
        
        try {
            const request = {
                sessionId,
                message: {
                    id: Date.now(),
                    sessionId,
                    content: message.content || '',
                    isUser: true,
                    agentId: message.agentId || '',
                    flowId: flowId || 'default',
                    timestamp: new Date().toISOString(),
                    ...message
                },
                modelId,
                flowId
            };
            
            return await this.apiCall('/messages', 'POST', request);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }

    // Agent methods
    static async getAgents(): Promise<Agent[]> {
        if (this.isElectronAvailable()) {
            return window.electron.db.getAgents();
        }
        
        // Fallback to localStorage
        return this.getLocalStorage('agents') || [];
    }

    static async saveAgent(agent: Agent): Promise<Agent> {
        if (this.isElectronAvailable()) {
            return window.electron.db.saveAgent(agent);
        }
        
        // Fallback to localStorage
        const agents = await this.getAgents();
        const existingIndex = agents.findIndex(a => a.id === agent.id);
        
        if (existingIndex >= 0) {
            agents[existingIndex] = agent;
        } else {
            agents.push(agent);
        }
        
        this.setLocalStorage('agents', agents);
        return agent;
    }

    static async deleteAgent(id: number): Promise<void> {
        if (this.isElectronAvailable()) {
            await window.electron.db.deleteAgent(id);
            return;
        }
        
        // Fallback to localStorage
        const agents = await this.getAgents();
        const filtered = agents.filter(agent => agent.id !== id);
        this.setLocalStorage('agents', filtered);
    }

    // MCP Connection methods
    static async getMCPConnections(): Promise<MCPConnection[]> {
        if (this.isElectronAvailable()) {
            return window.electron.db.getMCPConnections();
        }
        
        // Fallback to localStorage
        return this.getLocalStorage('mcpConnections') || [];
    }

    static async saveMCPConnection(connection: MCPConnection): Promise<MCPConnection> {
        if (this.isElectronAvailable()) {
            return window.electron.db.saveMCPConnection(connection);
        }
        
        // Fallback to localStorage
        const connections = await this.getMCPConnections();
        const existingIndex = connections.findIndex(c => c.id === connection.id);
        
        if (existingIndex >= 0) {
            connections[existingIndex] = connection;
        } else {
            connections.push(connection);
        }
        
        this.setLocalStorage('mcpConnections', connections);
        return connection;
    }

    static async deleteMCPConnection(id: number): Promise<void> {
        if (this.isElectronAvailable()) {
            await window.electron.db.deleteMCPConnection(id);
            return;
        }
        
        // Fallback to localStorage
        const connections = await this.getMCPConnections();
        const filtered = connections.filter(connection => connection.id !== id);
        this.setLocalStorage('mcpConnections', filtered);
    }

    // Settings methods
    static async getOpenRouterApiKey(): Promise<string> {
        if (this.isElectronAvailable()) {
            return window.electron.db.getOpenRouterApiKey();
        }
        
        // Fallback to localStorage
        return localStorage.getItem('openRouterApiKey') || '';
    }

    static async saveOpenRouterApiKey(key: string): Promise<void> {
        if (this.isElectronAvailable()) {
            await window.electron.db.saveOpenRouterApiKey(key);
            return;
        }
        
        // Fallback to localStorage
        localStorage.setItem('openRouterApiKey', key);
    }
}