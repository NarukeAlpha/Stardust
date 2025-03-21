import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string): string => location.pathname === path ? 'active' : '';

    return (
        <div className="sidebar">
            <div className="sidebar-title">Stardust</div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <button
                            onClick={() => navigate('/')}
                            className={isActive('/')}
                        >
                            Chat
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/flow')}
                            className={isActive('/flow')}
                        >
                            Flow
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/agents')}
                            className={isActive('/agents')}
                        >
                            Agents
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/settings')}
                            className={isActive('/settings')}
                        >
                            Settings
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/mcp')}
                            className={isActive('/mcp')}
                        >
                            MCP
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}