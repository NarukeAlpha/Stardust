import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TaskGroupsSidebar() {
    const [groups, setGroups] = useState([
        { id: 1, name: 'Favorites', count: { done: 1, total: 0 } }
    ]);

    const addGroup = () => {
        const newGroup = {
            id: Date.now(),
            name: `Group ${groups.length + 1}`,
            count: { done: 0, total: 0 }
        };
        setGroups([...groups, newGroup]);
    };

    const removeGroup = (id) => {
        setGroups(groups.filter(group => group.id !== id));
    };

    const navigateToGroup = (id) => {
        // Handle navigation to specific group
        console.log(`Navigating to group ${id}`);
    };

    return (
        <div className="task-groups-sidebar">
            <h4 className="sidebar-heading">MY TASK GROUPS</h4>
            <button className="create-group-btn" onClick={addGroup}>+</button>
            <ul>
                {groups.map((group) => (
                    <li key={group.id} className="group-item" onClick={() => navigateToGroup(group.id)}>
                        <div className="group-content">
                            <span>{group.name}</span>
                            <span className="group-count">{group.count.done} / {group.count.total}</span>
                        </div>
                        <button
                            className="remove-group-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeGroup(group.id);
                            }}
                        >
                            <X size={16} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

