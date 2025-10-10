// src/components/project/EditProject.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getProject, updateProject } from '../../api/project';

// ✅ Cập nhật upload ảnh cho CKEditor dùng domain thật
function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => ({
        upload: () =>
            loader.file.then((file) => {
                const data = new FormData();
                data.append('upload', file);

                // ✅ Đổi URL này sang API domain thật
                return fetch('https://api.solaraland.vn/api/upload', {
                    method: 'POST',
                    body: data,
                })
                    .then((res) => {
                        if (!res.ok) throw new Error('Upload ảnh thất bại');
                        return res.json();
                    })
                    .then((res) => {
                        console.log('Upload ảnh CKEditor:', res);
                        return { default: res.url }; // CKEditor nhận URL ảnh ở đây
                    });
            }),
        abort: () => {},
    });
}

export default function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        location: '',
        status: 'ongoing',
        amenities: '',
        investor: '',
        description: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await getProject(id);
                const project = res.data ? res.data : res;
                setForm({
                    name: project.name || '',
                    location: project.location || '',
                    status: project.status || 'ongoing',
                    amenities: project.amenities ? project.amenities.join(', ') : '',
                    investor: project.investor || '',
                    description: project.description || '',
                });
            } catch (err) {
                console.error(err);
                alert('Không tải được dự án');
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [id]);

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
        await updateProject(id, payload);
        alert('Cập nhật dự án thành công');
        navigate('/projects');
    }

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <h2 className="mb-3">Cập nhật Dự án</h2>

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
                        Lưu thay đổi
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/projects')}
                    >
                        ← Quay lại danh sách
                    </button>
                </div>
            </form>
        </div>
    );
}
