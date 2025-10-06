import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createProject } from '../../api/project';

// Plugin upload ảnh cho CKEditor
function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => ({
        upload: () =>
            loader.file.then((file) => {
                const data = new FormData();
                data.append('upload', file); // field backend nhận

                return fetch('http://localhost:3001/api/upload', {
                    method: 'POST',
                    body: data,
                })
                    .then((res) => {
                        if (!res.ok) throw new Error('Upload ảnh thất bại');
                        return res.json();
                    })
                    .then((res) => {
                        console.log('Upload ảnh CKEditor:', res);
                        // Trả về object { default: url } để CKEditor hiển thị ảnh
                        return { default: res.url };
                    });
            }),
        abort: () => {},
    });
}

export default function CreateProject({ onSaved, onCancel }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        location: '',
        status: 'ongoing',
        amenities: '',
        investor: '',
        description: '',
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            ...form,
            amenities: form.amenities
                ? form.amenities.split(',').map((a) => a.trim())
                : [],
        };

        await createProject(payload);
        if (onSaved) onSaved();
        navigate('/projects'); // chuyển về list project
    }

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <h2 className="mb-3">Tạo Dự án mới</h2>

                <div className="mb-3">
                    <label className="form-label">Tên dự án *</label>
                    <input
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Địa điểm</label>
                    <input
                        name="location"
                        className="form-control"
                        value={form.location}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <select
                        name="status"
                        className="form-select"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="ongoing">Đang triển khai</option>
                        <option value="upcoming">Sắp triển khai</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Tiện ích (cách nhau dấu phẩy)</label>
                    <input
                        name="amenities"
                        className="form-control"
                        placeholder="Ví dụ: hồ bơi, phòng gym, công viên"
                        value={form.amenities}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Chủ đầu tư</label>
                    <input
                        name="investor"
                        className="form-control"
                        value={form.investor}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={form.description}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setForm({ ...form, description: data });
                        }}
                        config={{ extraPlugins: [CustomUploadAdapterPlugin] }}
                    />
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                        Tạo dự án
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onCancel}
                        >
                            ← Quay lại danh sách
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
