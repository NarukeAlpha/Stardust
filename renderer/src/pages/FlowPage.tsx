import React from 'react';

export default function FlowPage() {
    return (
        <div style={{ 
            padding: '1rem', 
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 2rem)'
        }}>
            <h2 style={{ marginBottom: '1rem' }}>Flow</h2>
            <div style={{ 
                backgroundColor: '#1c1c1c', 
                borderRadius: '0.5rem',
                padding: '2rem',
                maxWidth: '600px',
                textAlign: 'center'
            }}>
                <p style={{ marginBottom: '1rem' }}>
                    The Flow feature is coming soon. This will allow you to interconnect different chats and assign different roles.
                </p>
                <p>
                    Stay tuned for updates!
                </p>
            </div>
        </div>
    );
}