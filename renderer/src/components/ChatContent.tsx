import React, { useState, useRef, useEffect } from 'react';
import { AIService } from '../services/AIService';
import { DatabaseService, ChatMessage, Session } from '../services/DatabaseService';
import { Loader2 } from 'lucide-react';

interface ChatContentProps {
    sessionId?: string;
}

export default function ChatContent({ sessionId }: ChatContentProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Tracks if there are any pending responses for this chat
    // even when the user switches to another chat
    const pendingRequestRef = useRef<boolean>(false);
    
    // Load messages for the current session
    useEffect(() => {
        if (sessionId) {
            loadMessages(sessionId);
        } else {
            // Clear messages if no session is selected
            setMessages([]);
        }
    }, [sessionId]);

    // Load session information
    useEffect(() => {
        if (sessionId) {
            loadSessionInfo(sessionId);
        } else {
            setSessionInfo(null);
        }
    }, [sessionId]);

    // Auto-scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadSessionInfo = async (sid: string) => {
        try {
            const sessions = await DatabaseService.getSessions();
            const session = sessions.find(s => s.sessionId === sid);
            if (session) {
                setSessionInfo(session);
            }
        } catch (error) {
            console.error('Failed to load session info:', error);
            setError('Failed to load chat information');
        }
    };
    
    const loadMessages = async (sid: string) => {
        try {
            setIsLoading(true);
            const sessionMessages = await DatabaseService.getSessionMessages(sid);
            setMessages(sessionMessages);
            setError(null);
        } catch (error) {
            console.error('Failed to load messages:', error);
            setError('Failed to load chat messages');
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!sessionId || inputValue.trim() === '' || isLoading) return;

        setIsLoading(true);
        pendingRequestRef.current = true;
        
        // Save current input and reset for better UX
        const currentInput = inputValue;
        setInputValue('');
        
        // Create an optimistic user message to show immediately
        const tempUserMessage: ChatMessage = {
            id: Date.now(),
            sessionId,
            content: currentInput,
            isUser: true,
            flowId: sessionInfo?.flowId || 'default',
            timestamp: new Date().toISOString()
        };
        
        // Update UI with the user message
        setMessages(prev => [...prev, tempUserMessage]);

        try {
            // Send the message to the backend
            const response = await AIService.sendMessage(
                sessionId, 
                currentInput, 
                sessionInfo?.flowId || 'default',
                sessionInfo?.modelId || 'gpt-4o'
            );
            
            // If the user is still on this session, update the messages state
            if (sessionId) {
                setMessages(prev => {
                    // First check if the message we received is already in the list
                    // (could happen if there was a race condition)
                    if (!prev.some(msg => msg.id === response.id)) {
                        return [...prev, response];
                    }
                    return prev;
                });
            }
            
            setError(null);
        } catch (error) {
            console.error('Error getting AI response:', error);
            
            // Add error message that's only visible to the user
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                sessionId,
                content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
                isUser: false,
                flowId: sessionInfo?.flowId || 'default',
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, errorMessage]);
            setError('Failed to get AI response. Please try again.');
        } finally {
            setIsLoading(false);
            pendingRequestRef.current = false;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="main-content">
            <header className="tasks-header">
                <h2>{sessionInfo ? sessionInfo.name : 'Chat'}</h2>
                {sessionInfo && (
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        Flow: {sessionInfo.flowId === 'default' ? 'Default' : 
                                sessionInfo.flowId === 'creative' ? 'Creative' : 'Coding'} | 
                        Model: {sessionInfo.modelId === 'gpt-4o' ? 'GPT-4o' : 
                                sessionInfo.modelId === 'claude-3-opus' ? 'Claude 3 Opus' : 
                                sessionInfo.modelId === 'claude-3-7-sonnet' ? 'Claude 3.7 Sonnet' : 
                                sessionInfo.modelId}
                    </div>
                )}
            </header>
            
            <div className="chat-messages-container" style={{ 
                flex: 1, 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column',
                padding: '1rem',
                gap: '1rem'
            }}>
                {messages.length === 0 && !isLoading && !error && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '2rem', 
                        color: '#666',
                        marginTop: '2rem'
                    }}>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}
                
                {error && (
                    <div style={{ 
                        backgroundColor: '#5e1f1f', 
                        padding: '1rem', 
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        color: '#ffcccc'
                    }}>
                        <p>{error}</p>
                    </div>
                )}
                
                {messages.map(message => (
                    <div 
                        key={message.id} 
                        className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                        style={{
                            alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                            backgroundColor: message.isUser ? '#5e5eff' : '#2a2a2a',
                            padding: '0.75rem 1rem',
                            borderRadius: '1rem',
                            maxWidth: '70%',
                            wordBreak: 'break-word'
                        }}
                    >
                        <div>{message.content}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem' }}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div 
                        className="message bot-message"
                        style={{
                            alignSelf: 'flex-start',
                            backgroundColor: '#2a2a2a',
                            padding: '0.75rem 1rem',
                            borderRadius: '1rem',
                            maxWidth: '70%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Loader2 size={16} className="animate-spin" />
                        <div>Thinking...</div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input-container" style={{
                padding: '1rem',
                backgroundColor: '#1c1c1c',
                borderTop: '1px solid #2f2f2f',
                position: 'relative',
                margin: '0 1rem 1rem 1rem',
                borderRadius: '0.5rem'
            }}>
                {/* Loading spinner for bottom right corner */}
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        backgroundColor: '#2a2a2a',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 5
                    }}>
                        <Loader2 size={16} className="animate-spin" color="#5e5eff" />
                    </div>
                )}
                
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={sessionId ? "Type your message..." : "Select a chat to start messaging"}
                    disabled={isLoading || !sessionId}
                    style={{
                        width: '100%',
                        backgroundColor: '#2a2a2a',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        resize: 'none',
                        minHeight: '50px',
                        maxHeight: '150px'
                    }}
                />
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    marginTop: '0.5rem'
                }}>
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || inputValue.trim() === '' || !sessionId}
                        style={{
                            backgroundColor: isLoading || inputValue.trim() === '' || !sessionId 
                                ? '#3e3e99' 
                                : '#5e5eff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            cursor: isLoading || inputValue.trim() === '' || !sessionId 
                                ? 'not-allowed' 
                                : 'pointer'
                        }}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}