import axios from 'axios';

const ADMIN_USER_MANAGEMENT_URL = 'http://localhost:8080/api/admin';

const api = axios.create({
  baseURL: ADMIN_USER_MANAGEMENT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lấy danh sách user
export const getAllUsers = () => api.get('/users');

// Lấy danh sách địa chỉ của user
export const getUserAddresses = (userId) => api.get(`/users/${userId}/addresses`);

// Lấy danh sách đơn hàng của user
export const getUserOrders = (userId) => api.get(`/orders/${userId}`);

// Xóa user
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

// Thay đổi trạng thái đơn hàng
export const changeOrderStatus = (userId, orderId, status) => api.put('/orders', { userId, orderId, status });

export const fetchProducts = async (
  params = {},
  requiresAuth = false,
  options = {}
) => {
  let url;
  const { brand, keyword, sortBy } = params;

  if (keyword) {
    // Tìm kiếm theo từ khóa
    url = new URL(`http://localhost:8080/api/products/search`);
    url.searchParams.append("keyword", encodeURIComponent(keyword));
  } else if (brand && brand !== "All" && sortBy) {
    // Lọc theo hãng và sắp xếp
    url = new URL(`http://localhost:8080/api/products/by-brand`);
    url.searchParams.append("brandName", encodeURIComponent(brand));
    url.searchParams.append("sortOrder", sortBy);
  } else if (brand && brand !== "All") {
    // Chỉ lọc theo hãng, không sắp xếp
    url = new URL(`http://localhost:8080/api/products/brand/${encodeURIComponent(brand)}`);
  } else if (sortBy) {
    // Chỉ sắp xếp, không lọc
    url = new URL(`http://localhost:8080/api/products/sort`);
    url.searchParams.append("order", sortBy);
    console.log("Sorting URL:", url.toString());
  } else {
    // Lấy tất cả sản phẩm, không lọc, không sắp xếp
    url = new URL(`http://localhost:8080/api/products`);
  }

  const headers = {
    "Content-Type": "application/json",
  };
  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error status:", response.status);
      console.log("Error response:", errorText);
      throw new Error(
        response.status === 404 ? "Hãng không tồn tại!" : "Không thể tải sản phẩm!"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const fetchBrands = async () => {
  const response = await fetch("http://localhost:8080/api/brands", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.log("Error response:", await response.text());
    throw new Error("Không thể tải danh sách hãng!");
  }
  return response.json();
};