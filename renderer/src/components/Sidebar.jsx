import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

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
                            Tasks
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
                            onClick={() => navigate('/proxies')}
                            className={isActive('/proxies')}
                        >
                            Proxies
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}