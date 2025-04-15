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

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchCart = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để xem giỏ hàng');
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể tải giỏ hàng');
  }

  return response.json();
};

export const addToCart = async (variantId, quantity) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để thêm vào giỏ hàng');
  }

  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ variantId, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể thêm vào giỏ hàng');
  }

  return response.json();
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để cập nhật giỏ hàng');
  }

  const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể cập nhật số lượng');
  }

  return response.json(); // Trả về CartItemDTO
};

export const removeCartItem = async (cartItemId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để xóa sản phẩm');
  }

  const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể xóa sản phẩm');
  }

  return true; // DELETE trả về 204, không có body
};

export const getAddresses = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để xem địa chỉ');
  }

  const response = await fetch(`${API_BASE_URL}/users/addresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể tải địa chỉ');
  }

  return response.json();
};

export const createOrder = async (orderCreateDTO) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để tạo đơn hàng');
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderCreateDTO),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể tạo đơn hàng');
  }

  return response.json();
};

export const sendOTP = async (email) => {
  const response = await fetch(`${API_BASE_URL}/otp?email=${email}`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể gửi email');
  }

  return response.json();
}

export const verifyOTP = async (enteredOtp, email) => {
  const response = await fetch(`${API_BASE_URL}/otp?enteredOtp=${enteredOtp}&email=${email}`,{
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  });
  if(!response.ok){
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể gửi xác thực otp');
  }
  return response.data === "Valid";
}