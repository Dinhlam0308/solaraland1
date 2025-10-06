import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConsign, updateConsignStatus } from '../../api/consign';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ConsignDetails = () => {
    const { id } = useParams();
    const [consign, setConsign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchConsign = async () => {
            try {
                setLoading(true);
                const data = await getConsign(id);
                setConsign(data);
            } catch (err) {
                console.error('Error fetching consign', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConsign();
    }, [id]);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            setUpdating(true);
            const updated = await updateConsignStatus(id, newStatus);
            setConsign(updated);
            alert('Cập nhật trạng thái thành công!');
        } catch (err) {
            console.error('Error updating status', err);
            alert('Có lỗi khi cập nhật trạng thái');
        } finally {
            setUpdating(false);
        }
    };

    // Tải toàn bộ ảnh thành 1 file zip
    const handleDownloadAll = async () => {
        if (!consign?.images || consign.images.length === 0) return;
        try {
            setDownloading(true);
            const zip = new JSZip();
            const promises = consign.images.map(async (url, idx) => {
                const res = await fetch(url);
                const blob = await res.blob();
                const ext = url.split('.').pop().split('?')[0]; // lấy phần mở rộng file
                zip.file(`image_${idx + 1}.${ext}`, blob);
            });
            await Promise.all(promises);
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `consign_${id}_images.zip`);
        } catch (err) {
            console.error('Error downloading images', err);
            alert('Có lỗi khi tải ảnh');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <p className="text-center mt-4">Đang tải chi tiết...</p>;
    if (!consign) return <p className="text-center mt-4">Không tìm thấy consign</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Chi tiết Consign</h2>
                <button onClick={() => navigate('/consign')} className="btn btn-secondary">
                    ⬅ Quay lại danh sách
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-bordered">
                        <tbody>
                        <tr>
                            <th width="200">Tên</th>
                            <td>{consign.name}</td>
                        </tr>
                        <tr>
                            <th>Điện thoại</th>
                            <td>{consign.phone}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{consign.email}</td>
                        </tr>
                        <tr>
                            <th>Dự án</th>
                            <td>{consign.project}</td>
                        </tr>
                        <tr>
                            <th>Loại căn hộ</th>
                            <td>{consign.apartmentType}</td>
                        </tr>
                        <tr>
                            <th>Số phòng ngủ</th>
                            <td>{consign.bedrooms}</td>
                        </tr>
                        <tr>
                            <th>Giá mong đợi</th>
                            <td>{consign.expectedPrice}</td>
                        </tr>
                        <tr>
                            <th>Trạng thái giao dịch</th>
                            <td>
                                <select
                                    className="form-select w-auto d-inline-block"
                                    value={consign.transactionStatus}
                                    onChange={handleStatusChange}
                                    disabled={updating}
                                >
                                    <option value="available">Còn hàng</option>
                                    <option value="sold">Đã bán</option>
                                    <option value="rented">Đã cho thuê</option>
                                </select>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    {consign.images && consign.images.length > 0 && (
                        <div className="mt-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5>Hình ảnh:</h5>
                                <button
                                    onClick={handleDownloadAll}
                                    className="btn btn-success btn-sm"
                                    disabled={downloading}
                                >
                                    {downloading ? 'Đang tải...' : '⬇ Tải toàn bộ ảnh'}
                                </button>
                            </div>

                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {consign.images.map((img, index) => (
                                    <div key={index} className="text-center">
                                        <a href={img} download target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={img}
                                                alt={`Consign ${index}`}
                                                width="150"
                                                className="img-thumbnail"
                                            />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsignDetails;
