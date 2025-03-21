import React, { useState } from 'react';

interface MCPConnection {
    id: number;
    name: string;
    type: string;
    status: 'connected' | 'disconnected';
    createdAt: string;
}

export default function MCPPage() {
    const [connections, setConnections] = useState<MCPConnection[]>([
        {
            id: 1,
            name: 'GitHub Integration',
            type: 'GitHub',
            status: 'connected',
            createdAt: new Date().toLocaleDateString()
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newConnection, setNewConnection] = useState({
        name: '',
        type: 'github'
    });

    const connectionTypes = [
        { id: 'github', name: 'GitHub' },
        { id: 'webcrawler', name: 'Web Crawler' },
        { id: 'vscode', name: 'VS Code' }
    ];

    const addConnection = () => {
        if (newConnection.name.trim() === '') return;

        const connection: MCPConnection = {
            id: Date.now(),
            name: newConnection.name,
            type: connectionTypes.find(t => t.id === newConnection.type)?.name || 'Unknown',
            status: 'disconnected',
            createdAt: new Date().toLocaleDateString()
        };

        setConnections([...connections, connection]);
        setNewConnection({ name: '', type: 'github' });
        setShowAddModal(false);
    };

    const removeConnection = (id: number) => {
        setConnections(connections.filter(conn => conn.id !== id));
    };

    const toggleConnectionStatus = (id: number) => {
        setConnections(connections.map(conn => 
            conn.id === id 
                ? { ...conn, status: conn.status === 'connected' ? 'disconnected' : 'connected' } 
                : conn
        ));
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>MCP Connections</h2>
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
                    Add Connection
                </button>
            </div>

            {/* Connections Table */}
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
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Created</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {connections.map(conn => (
                            <tr key={conn.id} style={{ borderBottom: '1px solid #2f2f2f' }}>
                                <td style={{ padding: '0.5rem' }}>{conn.name}</td>
                                <td style={{ padding: '0.5rem' }}>{conn.type}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <span style={{ 
                                        color: conn.status === 'connected' ? '#4ade80' : '#ef4444',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <span style={{ 
                                            width: '0.5rem', 
                                            height: '0.5rem', 
                                            borderRadius: '50%', 
                                            backgroundColor: conn.status === 'connected' ? '#4ade80' : '#ef4444',
                                            display: 'inline-block'
                                        }}></span>
                                        {conn.status}
                                    </span>
                                </td>
                                <td style={{ padding: '0.5rem' }}>{conn.createdAt}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => toggleConnectionStatus(conn.id)}
                                        style={{
                                            backgroundColor: conn.status === 'connected' ? '#ef4444' : '#4ade80',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            padding: '0.25rem 0.5rem',
                                            marginRight: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {conn.status === 'connected' ? 'Disconnect' : 'Connect'}
                                    </button>
                                    <button
                                        onClick={() => removeConnection(conn.id)}
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
                        {connections.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '1rem', textAlign: 'center' }}>
                                    No connections added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Connection Modal */}
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
                        width: '400px',
                        maxWidth: '90%'
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>Add MCP Connection</h3>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Connection Name</label>
                            <input
                                type="text"
                                value={newConnection.name}
                                onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                                placeholder="Enter connection name"
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
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Connection Type</label>
                            <select
                                value={newConnection.type}
                                onChange={(e) => setNewConnection({...newConnection, type: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: '#2a2a2a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem'
                                }}
                            >
                                {connectionTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
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
                                onClick={addConnection}
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
        </div>
    );
}