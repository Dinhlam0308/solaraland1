import { api } from './api';

export async function getProducts() {
    const res = await api.get('/api/products');
    return res.data;
}

export async function getProduct(id) {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
}

// Lấy danh sách sản phẩm cho thuê
export async function getProductsForRent() {
    const res = await api.get('/api/products/rent');
    return res.data;
}

// Lấy danh sách sản phẩm đang bán
export async function getProductsForSale() {
    const res = await api.get('/api/products/sale');
    return res.data;
}
export async function getProjectWithSaleProducts(projectId) {
    const res = await api.get(`/api/products/project/${projectId}/sale`);
    return res.data; // {project: {...}, products: [...]}
}

export async function getProductsByType(type) {
    const res = await api.get(`/api/products/type/${type}`);
    return res.data;
}

export async function advancedFilterProducts(params) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/api/products/advanced-filter?${query}`);
    return res.data;
}
export async function getProductByName(name) {
    const res = await api.get(`/api/products/name/${encodeURIComponent(name)}`);
    return res.data;
}