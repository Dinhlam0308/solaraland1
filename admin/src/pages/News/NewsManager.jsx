import React, { useState } from 'react';
import NewsList from '../../components/news/NewsList';
import CreateNews from '../../components/news/CreateNews';
import EditNews from '../../components/news/EditNews';

export default function NewsManager() {
    const [view, setView] = useState('list'); // list | create | edit
    const [currentNews, setCurrentNews] = useState(null);
    const [refresh, setRefresh] = useState(false);

    // mở form tạo mới
    function handleCreateNew() {
        setCurrentNews(null);
        setView('create');
    }

    // mở form sửa
    function handleEdit(newsItem) {
        setCurrentNews(newsItem);
        setView('edit');
    }

    // sau khi tạo/sửa xong quay lại list
    function handleSaved() {
        setRefresh(prev => !prev); // trigger reload list
        setView('list');
    }

    function handleCancel() {
        setView('list');
    }

    return (
        <div className="container mt-4">
            {view === 'list' && (
                <NewsList
                    onCreateNew={handleCreateNew}
                    onEdit={handleEdit}
                    refresh={refresh}
                />
            )}

            {view === 'create' && (
                <CreateNews onSaved={handleSaved} onCancel={handleCancel} />
            )}

            {view === 'edit' && currentNews && (
                <EditNews
                    currentNews={currentNews}
                    onSaved={handleSaved}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}
