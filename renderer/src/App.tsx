import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import MCPPage from './pages/MCPPage';
import FlowPage from './pages/FlowPage';
import AgentsPage from './pages/AgentsPage';

export default function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                {/* Right side = our main route views */}
                <div style={{ flex: 1, background: '#191919' }}>
                    <Routes>
                        <Route path="/" element={<ChatPage />} />
                        <Route path="/flow" element={<FlowPage />} />
                        <Route path="/agents" element={<AgentsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/mcp" element={<MCPPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}