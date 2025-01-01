import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import ProxiesPage from './pages/ProxiesPage';

export default function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                {/* Right side = our main route views */}
                <div style={{ flex: 1, background: '#191919' }}>
                    <Routes>
                        <Route path="/" element={<TasksPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/proxies" element={<ProxiesPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
