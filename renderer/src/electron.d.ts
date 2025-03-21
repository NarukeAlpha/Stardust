import { ChatMessage, Session, Agent, MCPConnection } from './services/DatabaseService';
import { Message } from './services/AIService';

declare global {
  interface Window {
    electron: {
      db: {
        // Session methods
        getSessions: () => Promise<Session[]>;
        createSession: (session: Partial<Session>) => Promise<Session>;
        deleteSessions: (sessionIds: string[]) => Promise<boolean>;
        archiveSessions: () => Promise<boolean>;
        
        // Message methods
        getSessionMessages: (sessionId: string) => Promise<ChatMessage[]>;
        sendMessage: (
          sessionId: string, 
          message: Partial<ChatMessage>, 
          modelId: string, 
          flowId: string
        ) => Promise<ChatMessage>;
        
        // Agent methods
        getAgents: () => Promise<Agent[]>;
        saveAgent: (agent: Agent) => Promise<Agent>;
        deleteAgent: (id: number) => Promise<boolean>;
        
        // MCP Connection methods
        getMCPConnections: () => Promise<MCPConnection[]>;
        saveMCPConnection: (connection: MCPConnection) => Promise<MCPConnection>;
        deleteMCPConnection: (id: number) => Promise<boolean>;
        
        // Settings methods
        getOpenRouterApiKey: () => Promise<string>;
        saveOpenRouterApiKey: (key: string) => Promise<boolean>;
      },
      
      api: {
        callExternalApi: (
          messages: Message[], 
          modelId?: string
        ) => Promise<string>;
      }
    }
  }
}

export {};