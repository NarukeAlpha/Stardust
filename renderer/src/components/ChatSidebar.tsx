import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Trash2, Archive } from 'lucide-react';
import { DatabaseService, Session } from '../services/DatabaseService';

interface ChatSidebarProps {
    onSelectChat: (sessionId: string) => void;
    selectedSessionId?: string;
}

// New Chat Modal Component
interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, flowId: string) => void;
}

function NewChatModal({ isOpen, onClose, onSubmit }: NewChatModalProps) {
    const [name, setName] = useState(`Chat ${new Date().toLocaleString()}`);
    const [selectedFlow, setSelectedFlow] = useState('default');
    const modalRef = useRef<HTMLDivElement>(null);
    
    const flows = [
        { id: 'default', name: 'Default Flow' },
        { id: 'creative', name: 'Creative Assistant' },
        { id: 'coding', name: 'Coding Assistant' },
    ];
    
    useEffect(() => {
        if (isOpen) {
            setName(`Chat ${new Date().toLocaleString()}`);
            setSelectedFlow('default');
        }
    }, [isOpen]);
    
    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div ref={modalRef} className="modal-content" style={{
                backgroundColor: '#1c1c1c',
                borderRadius: '8px',
                padding: '24px',
                width: '400px',
                maxWidth: '90%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                position: 'relative'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>New Chat</h3>
                
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Chat Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#2a2a2a',
                            color: 'white',
                            border: '1px solid #3a3a3a',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                        autoFocus
                    />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Flow Type</label>
                    <select
                        value={selectedFlow}
                        onChange={(e) => setSelectedFlow(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#2a2a2a',
                            color: 'white',
                            border: '1px solid #3a3a3a',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    >
                        {flows.map(flow => (
                            <option key={flow.id} value={flow.id}>
                                {flow.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button 
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid #3a3a3a',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            if (name.trim()) {
                                onSubmit(name.trim(), selectedFlow);
                                onClose();
                            }
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#5e5eff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

// Error Modal Component
interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorMessage: string;
    technicalError?: string;
    onRetry?: () => void;
}

function ErrorModal({ isOpen, onClose, errorMessage, technicalError, onRetry }: ErrorModalProps) {
    const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    
    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div ref={modalRef} className="modal-content" style={{
                backgroundColor: '#1c1c1c',
                borderRadius: '8px',
                padding: '24px',
                width: '400px',
                maxWidth: '90%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}>
                <h3 style={{ marginTop: 0, color: '#ff5e5e' }}>Error</h3>
                
                <p>{errorMessage}</p>
                
                {technicalError && (
                    <div>
                        <button 
                            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#5e5eff',
                                cursor: 'pointer',
                                padding: '4px 0',
                                textDecoration: 'underline',
                                fontSize: '14px'
                            }}
                        >
                            {showTechnicalDetails ? 'Hide details' : 'See more'}
                        </button>
                        
                        {showTechnicalDetails && (
                            <pre style={{
                                backgroundColor: '#2a2a2a',
                                padding: '12px',
                                borderRadius: '4px',
                                overflowX: 'auto',
                                fontSize: '12px',
                                marginTop: '8px'
                            }}>
                                {technicalError}
                            </pre>
                        )}
                    </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                    <button 
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid #3a3a3a',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Close
                    </button>
                    
                    {onRetry && (
                        <button 
                            onClick={() => {
                                onRetry();
                                onClose();
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#5e5eff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ChatSidebar({ onSelectChat, selectedSessionId }: ChatSidebarProps) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [technicalError, setTechnicalError] = useState('');
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
    const [lastActionCallback, setLastActionCallback] = useState<(() => void) | null>(null);

    // Load sessions from database on component mount
    useEffect(() => {
        loadSessions();
    }, []);
    
    const loadSessions = async () => {
        try {
            const loadedSessions = await DatabaseService.getSessions();
            // Filter out deleted sessions
            const activeSessions = loadedSessions.filter(session => !session.isDeleted);
            setSessions(activeSessions);
            
            // If no session is selected and we have sessions, select the first one
            if (!selectedSessionId && activeSessions.length > 0) {
                onSelectChat(activeSessions[0].sessionId);
            }
        } catch (error) {
            console.error('Failed to load sessions:', error);
            showError('Failed to load chats', error instanceof Error ? error.message : String(error));
        }
    };

    const createNewChat = async (name: string, flowId: string) => {
        try {
            const newSession: Partial<Session> = {
                name,
                flowId,
                modelId: flowId === 'coding' ? 'claude-3-7-sonnet' : 
                         flowId === 'creative' ? 'claude-3-opus' : 'gpt-4o',
            };
            
            // Create session in database
            const savedSession = await DatabaseService.createSession(newSession);
            
            // Update local state
            setSessions(prev => [...prev, savedSession]);
            
            // Select the new session
            onSelectChat(savedSession.sessionId);
        } catch (error) {
            console.error('Failed to create session:', error);
            showError('Failed to create chat', error instanceof Error ? error.message : String(error));
        }
    };

    const deleteSession = async (sessionId: string) => {
        try {
            // Soft delete in database
            await DatabaseService.deleteSessions([sessionId]);
            
            // Update local state
            const updatedSessions = sessions.filter(session => session.sessionId !== sessionId);
            setSessions(updatedSessions);
            
            // If the deleted session was selected, select another one
            if (selectedSessionId === sessionId) {
                if (updatedSessions.length > 0) {
                    onSelectChat(updatedSessions[0].sessionId);
                } else {
                    onSelectChat(''); // No session selected
                }
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
            showError('Failed to delete chat', error instanceof Error ? error.message : String(error));
        }
    };
    
    const deleteSelectedSessions = async () => {
        if (selectedSessions.length === 0) return;
        
        try {
            // Confirm deletion
            if (!confirm(`Are you sure you want to delete ${selectedSessions.length} chats?`)) {
                return;
            }
            
            // Soft delete in database
            await DatabaseService.deleteSessions(selectedSessions);
            
            // Update local state
            const updatedSessions = sessions.filter(
                session => !selectedSessions.includes(session.sessionId)
            );
            setSessions(updatedSessions);
            
            // If the current session was deleted, select another one
            if (selectedSessionId && selectedSessions.includes(selectedSessionId)) {
                if (updatedSessions.length > 0) {
                    onSelectChat(updatedSessions[0].sessionId);
                } else {
                    onSelectChat(''); // No session selected
                }
            }
            
            // Exit multi-select mode
            setIsMultiSelectMode(false);
            setSelectedSessions([]);
        } catch (error) {
            console.error('Failed to delete sessions:', error);
            showError('Failed to delete chats', error instanceof Error ? error.message : String(error));
        }
    };
    
    const archiveDeletedSessions = async () => {
        try {
            await DatabaseService.archiveSessions();
            // No need to update UI as we're only showing non-deleted sessions
        } catch (error) {
            console.error('Failed to archive sessions:', error);
            showError('Failed to archive chats', error instanceof Error ? error.message : String(error));
        }
    };
    
    const toggleSessionSelection = (sessionId: string) => {
        setSelectedSessions(prev => {
            if (prev.includes(sessionId)) {
                return prev.filter(id => id !== sessionId);
            } else {
                return [...prev, sessionId];
            }
        });
    };
    
    const showError = (message: string, technicalDetails: string, retryCallback?: () => void) => {
        setErrorMessage(message);
        setTechnicalError(technicalDetails);
        setLastActionCallback(retryCallback || null);
        setIsErrorModalOpen(true);
    };

    return (
        <div className="task-groups-sidebar">
            <h4 className="sidebar-heading">MY CHATS</h4>
            
            <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                <button 
                    className="create-group-btn" 
                    onClick={() => setIsNewChatModalOpen(true)}
                    style={{ flex: 1 }}
                >
                    + New Chat
                </button>
                
                <button 
                    onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
                    style={{
                        backgroundColor: isMultiSelectMode ? '#5e5eff' : '#2a2a2a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px',
                        cursor: 'pointer'
                    }}
                    title={isMultiSelectMode ? 'Exit selection mode' : 'Select multiple chats'}
                >
                    <Check size={16} />
                </button>
            </div>
            
            {isMultiSelectMode && (
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginBottom: '12px',
                    padding: '8px',
                    backgroundColor: '#2a2a2a',
                    borderRadius: '4px'
                }}>
                    <div style={{ flex: 1 }}>
                        Selected: {selectedSessions.length}
                    </div>
                    <button 
                        onClick={deleteSelectedSessions}
                        disabled={selectedSessions.length === 0}
                        style={{
                            backgroundColor: selectedSessions.length === 0 ? '#3e3e3e' : '#ff5e5e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: selectedSessions.length === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
            
            {sessions.length > 0 && (
                <button 
                    onClick={archiveDeletedSessions}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#888',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <Archive size={12} />
                    Archive deleted chats
                </button>
            )}
            
            <ul>
                {sessions.map((session) => (
                    <li 
                        key={session.sessionId} 
                        className={`group-item ${selectedSessionId === session.sessionId ? 'active' : ''}`} 
                        onClick={() => isMultiSelectMode 
                            ? toggleSessionSelection(session.sessionId) 
                            : onSelectChat(session.sessionId)
                        }
                        style={{
                            backgroundColor: isMultiSelectMode && selectedSessions.includes(session.sessionId)
                                ? '#3e3e7e'
                                : selectedSessionId === session.sessionId ? '#3a3a3a' : '#2a2a2a',
                            border: selectedSessionId === session.sessionId ? '1px solid #5e5eff' : 'none',
                            position: 'relative'
                        }}
                    >
                        {isMultiSelectMode && (
                            <div style={{
                                position: 'absolute',
                                left: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}>
                                <input 
                                    type="checkbox"
                                    checked={selectedSessions.includes(session.sessionId)}
                                    onChange={() => toggleSessionSelection(session.sessionId)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                        )}
                        
                        <div className="group-content" style={{ 
                            marginLeft: isMultiSelectMode ? '28px' : '0'
                        }}>
                            <span>{session.name}</span>
                            <span className="group-count">
                                {new Date(session.createdAt).toLocaleDateString()}&nbsp;
                                <span style={{ 
                                    fontSize: '0.8em', 
                                    opacity: 0.7, 
                                    backgroundColor: '#444',
                                    padding: '2px 4px',
                                    borderRadius: '4px'
                                }}>
                                    {session.flowId === 'default' ? 'Default' : 
                                     session.flowId === 'creative' ? 'Creative' : 'Code'}
                                </span>
                            </span>
                        </div>
                        
                        {!isMultiSelectMode && (
                            <button
                                className="remove-group-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Are you sure you want to delete the chat "${session.name}"?`)) {
                                        deleteSession(session.sessionId);
                                    }
                                }}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </li>
                ))}
                {sessions.length === 0 && (
                    <li style={{ 
                        textAlign: 'center', 
                        padding: '1rem', 
                        color: '#666',
                        fontSize: '0.9rem'
                    }}>
                        No chats yet. Click "+ New Chat" to create one.
                    </li>
                )}
            </ul>
            
            {/* Modals */}
            <NewChatModal 
                isOpen={isNewChatModalOpen}
                onClose={() => setIsNewChatModalOpen(false)}
                onSubmit={createNewChat}
            />
            
            <ErrorModal 
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                errorMessage={errorMessage}
                technicalError={technicalError}
                onRetry={lastActionCallback || undefined}
            />
        </div>
    );
}