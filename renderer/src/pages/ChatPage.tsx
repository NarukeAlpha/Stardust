import React, { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatContent from '../components/ChatContent';

export default function ChatPage() {
    const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined);

    const handleSelectChat = (sessionId: string) => {
        setSelectedSessionId(sessionId ? sessionId : undefined);
    };

    return (
        <div className="tasks-page-container">
            {/* Chat sidebar for listing available chats */}
            <ChatSidebar 
                onSelectChat={handleSelectChat} 
                selectedSessionId={selectedSessionId} 
            />

            {/* Chat content area */}
            <ChatContent sessionId={selectedSessionId} />
        </div>
    );
}