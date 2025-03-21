import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [openRouterKey, setOpenRouterKey] = useState('');
    const [saved, setSaved] = useState(false);

    // Load the API key from storage when component mounts
    useEffect(() => {
        // This would be replaced with actual database access
        const storedKey = localStorage.getItem('openRouterApiKey') || '';
        setOpenRouterKey(storedKey);
    }, []);

    const saveSettings = () => {
        // This would be replaced with actual database access
        localStorage.setItem('openRouterApiKey', openRouterKey);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Settings</h2>
            </div>
            
            <div style={{ 
                backgroundColor: '#1c1c1c', 
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1rem',
                maxWidth: '600px'
            }}>
                <h3 style={{ marginBottom: '1.5rem' }}>API Settings</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>OpenRouter API Key</label>
                    <input
                        type="password"
                        value={openRouterKey}
                        onChange={(e) => setOpenRouterKey(e.target.value)}
                        placeholder="Enter your OpenRouter API key"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            backgroundColor: '#2a2a2a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem'
                        }}
                    />
                    <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
                        Get your API key from <a href="https://openrouter.ai/keys" style={{ color: '#5e5eff' }} target="_blank" rel="noopener noreferrer">OpenRouter</a>
                    </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={saveSettings}
                        style={{
                            backgroundColor: '#5e5eff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Save Settings
                    </button>
                    
                    {saved && (
                        <span style={{ marginLeft: '1rem', color: '#4ade80' }}>
                            Settings saved!
                        </span>
                    )}
                </div>
            </div>
            
            <div style={{ 
                backgroundColor: '#1c1c1c', 
                borderRadius: '0.5rem',
                padding: '1.5rem',
                maxWidth: '600px'
            }}>
                <h3 style={{ marginBottom: '1rem' }}>About Stardust</h3>
                <p style={{ marginBottom: '0.5rem' }}>
                    Stardust is an application that handles different AI chats in an agentic manner.
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                    Version: 1.0.0
                </p>
                <p>
                    © 2025 Stardust
                </p>
            </div>
        </div>
    );
}