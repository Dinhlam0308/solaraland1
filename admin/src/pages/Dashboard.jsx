import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Spinner } from "react-bootstrap";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { getDashboardStats } from "../api/dashboard"; // import file bạn vừa tạo

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // gọi API lấy dữ liệu
        getDashboardStats() // có thể truyền {from, to, groupBy} nếu cần
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh" }}
            >
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!stats) {
        return <p className="text-center mt-5">Không lấy được dữ liệu</p>;
    }

    const visitsChartData = (stats.visits || []).map((v) => ({
        name: `${v._id.day ?? ""}/${v._id.month ?? ""}`,
        total: v.total
    }));

    return (
        <div
            className="p-4 bg-light"
            style={{
                minHeight: "100vh",
                width: "85vw",
                overflowX: "hidden"
            }}
        >
            {/* 3 card thống kê */}
            <Row className="g-4 mb-4 w-100">
                <Col sm={12} md={4}>
                    <Card className="text-center shadow rounded-3 border-0 bg-primary text-white h-100 w-100">
                        <Card.Body className="d-flex flex-column justify-content-center">
                            <Card.Title className="fw-bold">Lượt truy cập hôm nay</Card.Title>
                            <h1 className="mb-0">{stats.todayVisits}</h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={4}>
                    <Card className="text-center shadow rounded-3 border-0 bg-success text-white h-100 w-100">
                        <Card.Body className="d-flex flex-column justify-content-center">
                            <Card.Title className="fw-bold">Liên hệ hôm nay</Card.Title>
                            <h1 className="mb-0">{stats.todayContacts}</h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={4}>
                    <Card className="text-center shadow rounded-3 border-0 bg-info text-white h-100 w-100">
                        <Card.Body className="d-flex flex-column justify-content-center">
                            <Card.Title className="fw-bold">Tổng sản phẩm</Card.Title>
                            <h1 className="mb-0">
                                {stats.products.reduce((acc, p) => acc + p.total, 0)}
                            </h1>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Hàng dưới: biểu đồ & bảng */}
            <Row className="g-4 w-100">
                {/* Biểu đồ bên trái */}
                <Col lg={9} md={8}>
                    <Card className="shadow rounded-3 border-0 h-100">
                        <Card.Header className="bg-white fw-bold border-0">
                            Biểu đồ lượt truy cập
                        </Card.Header>
                        <Card.Body style={{ padding: "2rem" }}>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={visitsChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#0d6efd"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Bảng bên phải */}
                <Col lg={3} md={4}>
                    <Card className="shadow rounded-3 border-0 h-100">
                        <Card.Header className="bg-white fw-bold border-0">
                            Sản phẩm theo dự án
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table striped hover responsive className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th>Dự án</th>
                                    <th>Tổng</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(stats.products || []).map((p, idx) => (
                                    <tr key={idx}>
                                        <td>{p._id}</td>
                                        <td>{p.total}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
