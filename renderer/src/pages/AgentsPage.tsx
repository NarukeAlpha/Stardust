import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface Agent {
    id: number;
    name: string;
    api: string;
    role: string;
    systemPrompt: string;
    isLocked: boolean;
    createdAt: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([
        {
            id: 1,
            name: 'General Assistant',
            api: 'Claude 3.7 Sonnet',
            role: 'Senior SWE',
            systemPrompt: 'You are a helpful AI assistant.',
            isLocked: true,
            createdAt: new Date().toLocaleDateString()
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [newAgent, setNewAgent] = useState({
        name: '',
        api: 'gpt-4o',
        role: '',
        systemPrompt: ''
    });

    const apiOptions = [
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet' },
        { id: 'claude-3-opus', name: 'Claude 3 Opus' },
        { id: 'mistral-large', name: 'Mistral Large' }
    ];

    const addAgent = () => {
        if (newAgent.name.trim() === '') return;

        const agent: Agent = {
            id: Date.now(),
            name: newAgent.name,
            api: apiOptions.find(api => api.id === newAgent.api)?.name || newAgent.api,
            role: newAgent.role,
            systemPrompt: newAgent.systemPrompt,
            isLocked: false,
            createdAt: new Date().toLocaleDateString()
        };

        setAgents([...agents, agent]);
        setNewAgent({ name: '', api: 'gpt-4o', role: '', systemPrompt: '' });
        setShowAddModal(false);
    };

    const updateAgent = () => {
        if (!editingAgent) return;
        
        setAgents(agents.map(agent => 
            agent.id === editingAgent.id ? editingAgent : agent
        ));
        
        setEditingAgent(null);
    };

    const removeAgent = (id: number) => {
        const agent = agents.find(a => a.id === id);
        if (agent && agent.isLocked) {
            alert('This agent is locked. Unlock it first to delete.');
            return;
        }
        setAgents(agents.filter(agent => agent.id !== id));
    };

    const toggleLock = (id: number) => {
        setAgents(agents.map(agent => 
            agent.id === id ? { ...agent, isLocked: !agent.isLocked } : agent
        ));
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Agents</h2>
                <button 
                    onClick={() => setShowAddModal(true)}
                    style={{
                        backgroundColor: '#5e5eff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer'
                    }}
                >
                    Add Agent
                </button>
            </div>

            {/* Agents Table */}
            <div style={{ 
                backgroundColor: '#1c1c1c', 
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #2f2f2f' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>API</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Role</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Created</th>
                            <th style={{ textAlign: 'center', padding: '0.5rem' }}>Locked</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map(agent => (
                            <tr key={agent.id} style={{ borderBottom: '1px solid #2f2f2f' }}>
                                <td style={{ padding: '0.5rem' }}>{agent.name}</td>
                                <td style={{ padding: '0.5rem' }}>{agent.api}</td>
                                <td style={{ padding: '0.5rem' }}>{agent.role}</td>
                                <td style={{ padding: '0.5rem' }}>{agent.createdAt}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => toggleLock(agent.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: agent.isLocked ? '#4ade80' : '#6b7280'
                                        }}
                                    >
                                        {agent.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                                    </button>
                                </td>
                                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => setEditingAgent(agent)}
                                        style={{
                                            backgroundColor: '#5e5eff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            padding: '0.25rem 0.5rem',
                                            marginRight: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => removeAgent(agent.id)}
                                        style={{
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            padding: '0.25rem 0.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {agents.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: '1rem', textAlign: 'center' }}>
                                    No agents added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Agent Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#1c1c1c',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        width: '500px',
                        maxWidth: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>Add Agent</h3>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Agent Name</label>
                            <input
                                type="text"
                                value={newAgent.name}
                                onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                                placeholder="Enter agent name"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem'
                                }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>API</label>
                            <select
                                value={newAgent.api}
                                onChange={(e) => setNewAgent({...newAgent, api: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem'
                                }}
                            >
                                {apiOptions.map(api => (
                                    <option key={api.id} value={api.id}>{api.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                            <input
                                type="text"
                                value={newAgent.role}
                                onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                                placeholder="e.g., Senior SWE, Creative Writer"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem'
                                }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>System Prompt</label>
                            <textarea
                                value={newAgent.systemPrompt}
                                onChange={(e) => setNewAgent({...newAgent, systemPrompt: e.target.value})}
                                placeholder="Enter system prompt instructions"
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    resize: 'vertical'
                                }}
                            ></textarea>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addAgent}
                                style={{
                                    backgroundColor: '#5e5eff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Agent Modal */}
            {editingAgent && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#1c1c1c',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        width: '500px',
                        maxWidth: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>Edit Agent</h3>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Agent Name</label>
                            <input
                                type="text"
                                value={editingAgent.name}
                                onChange={(e) => setEditingAgent({...editingAgent, name: e.target.value})}
                                placeholder="Enter agent name"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem'
                                }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>API</label>
                            <select
                                value={apiOptions.find(api => api.name === editingAgent.api)?.id || 'gpt-4o'}
                                onChange={(e) => {
                                    const selectedApi = apiOptions.find(api => api.id === e.target.value);
                                    setEditingAgent({
                                        ...editingAgent, 
                                        api: selectedApi ? selectedApi.name : e.target.value
                                    });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem'
                                }}
                            >
                                {apiOptions.map(api => (
                                    <option key={api.id} value={api.id}>{api.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                            <input
                                type="text"
                                value={editingAgent.role}
                                onChange={(e) => setEditingAgent({...editingAgent, role: e.target.value})}
                                placeholder="e.g., Senior SWE, Creative Writer"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem'
                                }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>System Prompt</label>
                            <textarea
                                value={editingAgent.systemPrompt}
                                onChange={(e) => setEditingAgent({...editingAgent, systemPrompt: e.target.value})}
                                placeholder="Enter system prompt instructions"
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    resize: 'vertical'
                                }}
                            ></textarea>
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="checkbox" 
                                id="lockAgent"
                                checked={editingAgent.isLocked}
                                onChange={() => setEditingAgent({...editingAgent, isLocked: !editingAgent.isLocked})}
                                style={{ marginRight: '0.5rem' }}
                            />
                            <label htmlFor="lockAgent">Lock agent (prevent accidental deletion)</label>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button
                                onClick={() => setEditingAgent(null)}
                                style={{
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateAgent}
                                style={{
                                    backgroundColor: '#5e5eff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}