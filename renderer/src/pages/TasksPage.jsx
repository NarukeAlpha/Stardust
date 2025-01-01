import React from 'react';
import TaskGroupsSidebar from '../components/TaskGroupsSidebar';
import MainContent from '../components/MainContent';

export default function TasksPage() {
    return (
        <div className="tasks-page-container">
            {/* Middle sidebar for task groups */}
            <TaskGroupsSidebar />

            {/* Actual tasks content (existing code) */}
            <MainContent />
        </div>
    );
}