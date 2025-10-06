import React, { useState } from 'react';
import ProductList from '../../components/product/ProductList';
import CreateProduct from '../../components/product/CreateProduct';
import EditProduct from '../../components/product/EditProduct';

const ProductManager = () => {
    const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit'
    const [editId, setEditId] = useState(null);

    const handleCreateClick = () => {
        setMode('create');
    };

    const handleEditClick = (id) => {
        setEditId(id);
        setMode('edit');
    };

    const handleBack = () => {
        setEditId(null);
        setMode('list');
    };

    return (
        <div className="container mt-4">
            {/* tiêu đề động */}
            <h2 className="mb-4">
                {mode === 'create' && 'Tạo sản phẩm mới'}
                {mode === 'edit' && 'Sửa sản phẩm'}
            </h2>

            {/* list */}
            {mode === 'list' && (
                <ProductList
                />
            )}

            {/* create */}
            {mode === 'create' && (
                <div className="card p-3">
                    <CreateProduct onBack={handleBack} />
                </div>
            )}

            {/* edit */}
            {mode === 'edit' && (
                <div className="card p-3">
                    <EditProduct id={editId} onBack={handleBack} />
                </div>
            )}
        </div>
    );
};

export default ProductManager;
