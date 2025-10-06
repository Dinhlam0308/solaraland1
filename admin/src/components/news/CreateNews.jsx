import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createNews } from '../../api/news';

// Plugin upload ảnh cho CKEditor
function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => ({
        upload: () =>
            loader.file.then((file) => {
                const data = new FormData();
                data.append('upload', file); // field khớp backend

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
                        return { default: res.url };
                    });
            }),
        abort: () => {},
    });
}

export default function CreateNews({ onSaved, onCancel }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        content: '',
        tags: '',
        keywords: '',
        thumbnail: '', // chứa URL ảnh sau khi upload
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    // upload file thumbnail lên server và set URL vào state
    async function handleThumbnailUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append('upload', file);
        const res = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: data,
        });
        if (!res.ok) {
            alert('Upload ảnh thất bại');
            return;
        }
        const json = await res.json();
        setForm({ ...form, thumbnail: json.url }); // lưu URL trả về
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            ...form,
            tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
            keywords: form.keywords ? form.keywords.split(',').map((k) => k.trim()) : [],
        };
        await createNews(payload); // gửi JSON với thumbnail là URL
        if (onSaved) onSaved();
        navigate('/news');
    }

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <h2 className="mb-3">Tạo Tin mới</h2>

                <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input
                        name="title"
                        className="form-control"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Tags (cách nhau dấu phẩy)</label>
                    <input
                        name="tags"
                        className="form-control"
                        placeholder="Ví dụ: BĐS, Dự án, Khuyến mãi"
                        value={form.tags}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Keywords (SEO – cách nhau dấu phẩy)</label>
                    <input
                        name="keywords"
                        className="form-control"
                        placeholder="Ví dụ: bất động sản, dự án, quận 7"
                        value={form.keywords}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Ảnh đại diện (Thumbnail)</label>
                    <input type="file" className="form-control" onChange={handleThumbnailUpload} />
                    {form.thumbnail && (
                        <img
                            src={form.thumbnail}
                            alt="Thumbnail preview"
                            className="img-thumbnail mt-2"
                            style={{ maxWidth: '200px' }}
                        />
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Nội dung</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={form.content}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setForm({ ...form, content: data });
                        }}
                        config={{ extraPlugins: [CustomUploadAdapterPlugin] }}
                    />
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                        Tạo mới
                    </button>
                    {onCancel && (
                        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                            ← Quay lại danh sách
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
