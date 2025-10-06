import React, { useState } from 'react';
import ProjectList from '../../components/project/ProjectList';
import CreateProject from '../../components/project/CreateProject';
import EditProject from '../../components/project/EditProject';

export default function ProjectManager() {
    const [view, setView] = useState('list'); // list | create | edit
    const [currentProject, setCurrentProject] = useState(null);
    const [refresh, setRefresh] = useState(false);

    // mở form tạo mới
    function handleCreateNew() {
        setCurrentProject(null);
        setView('create');
    }

    // mở form sửa
    function handleEdit(project) {
        setCurrentProject(project);
        setView('edit');
    }

    // sau khi tạo/sửa xong quay lại list
    function handleSaved() {
        setRefresh((prev) => !prev); // trigger reload list
        setView('list');
    }

    function handleCancel() {
        setView('list');
    }

    return (
        <div className="container mt-4">
            {view === 'list' && (
                <ProjectList
                    onCreateNew={handleCreateNew}
                    onEdit={handleEdit}
                    refresh={refresh}
                />
            )}

            {view === 'create' && (
                <CreateProject onSaved={handleSaved} onCancel={handleCancel} />
            )}

            {view === 'edit' && currentProject && (
                <EditProject
                    currentProject={currentProject}
                    onSaved={handleSaved}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}
