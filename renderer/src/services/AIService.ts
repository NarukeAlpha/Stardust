import { ChatMessage, DatabaseService } from './DatabaseService';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export class AIService {
    // Check if Electron is available (for use in development with browser previews)
    private static isElectronAvailable(): boolean {
        return window.electron !== undefined;
    }
    
    // Convert internal messages to OpenRouter API format
    private static convertToApiMessages(messages: ChatMessage[]): Message[] {
        return messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
        }));
    }
    
    // This method now uses the DatabaseService to send messages through the backend
    static async sendMessage(sessionId: string, content: string, flowId: string, modelId: string = 'gpt-4o'): Promise<ChatMessage> {
        try {
            // Prepare the message
            const message: Partial<ChatMessage> = {
                content,
                isUser: true,
                flowId,
                timestamp: new Date().toISOString()
            };
            
            // Send the message through the database service, which will handle the API call
            return await DatabaseService.sendMessage(sessionId, message, modelId, flowId);
        } catch (error) {
            console.error('Error in AI service:', error);
            throw error;
        }
    }
    
    // For direct API calls (when needed)
    static async callExternalApi(messages: Message[], modelId: string = 'gpt-4o'): Promise<string> {
        try {
            // Get the API key from database
            const apiKey = await DatabaseService.getOpenRouterApiKey();
            
            if (!apiKey) {
                throw new Error('API key not found. Please add your OpenRouter API key in Settings.');
            }
            
            // If in Electron, use the IPC bridge
            if (this.isElectronAvailable()) {
                return window.electron.api.callExternalApi(messages, modelId);
            }
            
            // In production, use the OpenRouter API
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: modelId,
                    messages,
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Error connecting to AI service');
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling external API:', error);
            throw error;
        }
    }
}