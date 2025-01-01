import React from 'react';

export default function MainContent() {
    return (
        <div className="main-content">
            <header className="tasks-header">
                <h2>Tasks</h2>
                <button className="create-task-btn">Create Task</button>
            </header>
            <div className="tasks-table">
                <table>
                    <thead>
                    <tr>
                        <th>Mode</th>
                        <th>Product</th>
                        <th>Profile</th>
                        <th>Monitor Set</th>
                        <th>Checkout Set</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Rows go here */}
                    </tbody>
                </table>
            </div>
            <div className="tasks-controls">
                <button>Start</button>
                <button>Stop</button>
                <button>Edit</button>
                <button>Delete</button>
                <button>Product Monitor</button>
                <button>Import</button>
                <button>Export</button>
            </div>
        </div>
    );
}
