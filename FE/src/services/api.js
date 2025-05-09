import axios from 'axios';
import { toast } from 'react-toastify';

const ADMIN_USER_MANAGEMENT_URL = 'http://localhost:8080/api/admin';
const API_BASE_URL = 'http://localhost:8080/api';

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

// API chung
const commonApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho commonApi
commonApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lấy danh sách tất cả đơn hàng (cho admin)
export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
  }
};

// Lọc đơn hàng theo trạng thái
export const getOrdersByStatus_Admin = async (status) => {
  try {
    const response = await api.get(`/orders/status?status=${status}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách đơn hàng theo trạng thái.');
  }
}

// Lọc đơn hàng theo tháng và năm
export const getOrdersByMonthAndYear_Admin = async (month, year) => {
  try {
    const response = await api.get(`/orders/month-year?month=${month}&year=${year}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải đơn hàng theo tháng/năm');
  }
};

// Lấy danh sách user
export const getAllUsers = () => api.get('/users');

// Lấy thông tin người dùng theo ID (cho admin)
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải thông tin người dùng');
  }
};

export const getAddressByIdAndUserId = async(userId, addressId) => {
  try {
    const res = await api.get(`/users/${userId}/addresses/${addressId}`)
    return res.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải địa chỉ.');
  }
}

// Lấy danh sách địa chỉ của user
export const getUserAddresses = (userId) => api.get(`/users/${userId}/addresses`);

// Lấy danh sách đơn hàng của user
export const getUserOrders = (userId) => api.get(`/orders/${userId}`);

// Xóa User
export const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    toast.success("Xóa người dùng thành công");
  } catch (error) {
    let errMsg = "Xóa người dùng thất bại";
    if (error.response && error.response.data) {
      errMsg = error.response.data.message || 
               error.response.data.error || 
               error.response.data || 
               "Xóa người dùng thất bại";
    }

    toast.error(errMsg);
    throw error;
  }
};


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
    url = `/products/search?keyword=${encodeURIComponent(keyword)}`;
  } else if (brand && brand !== "All" && sortBy) {
    // Lọc theo hãng và sắp xếp
    url = `/products/by-brand?brandName=${encodeURIComponent(brand)}&sortOrder=${sortBy}`;
  } else if (brand && brand !== "All") {
    // Chỉ lọc theo hãng, không sắp xếp
    url = `/products/brand/${encodeURIComponent(brand)}`;
  } else if (sortBy) {
    // Chỉ sắp xếp, không lọc
    url = `/products/sort?order=${sortBy}`;
    console.log("Sorting URL:", API_BASE_URL + url);
  } else {
    // Lấy tất cả sản phẩm, không lọc, không sắp xếp
    url = `/products`;
  }

  try {
    const config = {};
    if (requiresAuth) {
      // Token sẽ được thêm tự động bởi interceptor
      return (await commonApi.get(url, config)).data;
    } else {
      // Không cần token, tạo một axios request riêng
      return (await axios.get(API_BASE_URL + url, {
        headers: { 'Content-Type': 'application/json' }
      })).data;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    if (error.response && error.response.status === 404) {
      throw new Error("Hãng không tồn tại!");
    }
    throw new Error("Không thể tải sản phẩm!");
  }
};

export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/brands`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error response:", error.response?.data);
    throw new Error("Không thể tải danh sách hãng!");
  }
};

export const fetchCart = async () => {
  try {
    const response = await commonApi.get('/cart');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Vui lòng đăng nhập để xem giỏ hàng');
  }
};

export const addToCart = async (variantId, quantity) => {
  try {
    const response = await commonApi.post('/cart/items', { variantId, quantity });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const response = await commonApi.put(`/cart/items/${cartItemId}`, { quantity });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật số lượng');
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    await commonApi.delete(`/cart/items/${cartItemId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa sản phẩm');
  }
};

export const getAddresses = async () => {
  try {
    const response = await commonApi.get('/users/addresses');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải địa chỉ');
  }
};

// Thêm địa chỉ mới
export const addAddress = async (addressData) => {
  try {
    const response = await commonApi.post('/users/addresses', addressData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thêm địa chỉ');
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await commonApi.put(`/users/addresses/${addressId}`, addressData); // Sử dụng commonApi
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật địa chỉ');
  }
};

// Xóa địa chỉ
export const deleteAddress = async (addressId) => {
  try {
    const response = await commonApi.delete(`/users/addresses/${addressId}`); // Sử dụng commonApi
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa địa chỉ');
  }
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
  try {
    const response = await commonApi.put(`/users/addresses/${addressId}/default`); // Sử dụng commonApi
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể đặt địa chỉ mặc định');
  }
};

export const createOrder = async (orderCreateDTO) => {
  try {
    const response = await commonApi.post('/orders', orderCreateDTO);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tạo đơn hàng');
  }
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
  const response = await fetch(`${API_BASE_URL}/otp?enteredOtp=${enteredOtp}&email=${email}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể gửi xác thực otp');
  }

  const data = await response.text();
  return data === "Valid";
};

// Lấy thông tin profile
export const getProfile = async () => {
  try {
    const response = await commonApi.get('/users/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải thông tin profile');
  }
};

// Cập nhật thông tin profile
export const updateProfile = async (profileData) => {
  try {
    console.log('Updating profile with data:', profileData);
    const response = await commonApi.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể cập nhật profile');
  }
};

// Lấy danh sách đơn hàng của khách hàng hiện tại
export const getCustomerOrders = async () => {
  try {
    const response = await commonApi.get('/orders');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
  }
};

// Lấy danh sách đơn hàng theo trạng thái
export const getOrdersByStatus = async (status) => {
  try {
    const response = await commonApi.get(`/orders/status?status=${status}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải đơn hàng theo trạng thái');
  }
};

// Lọc đơn hàng theo tháng/năm
export const getOrdersByMonthAndYear = async (month, year) => {
  try {
    const response = await commonApi.get(`/orders/month-year?month=${month}&year=${year}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải đơn hàng theo tháng/năm');
  }
};

// Hủy đơn hàng
export const cancelOrder = async (orderId) => {
  try {
    const response = await commonApi.put(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể hủy đơn hàng');
  }
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (orderId) => {
  try {
    const response = await commonApi.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
  }
};

// Lấy chi tiết địa chỉ
export const getAddressById = async (addressId) => {
  try {
    const response = await commonApi.get(`/users/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải chi tiết địa chỉ');
  }
};

export const getDashboardInformation = async (year) => {
  try{
    const response = await commonApi.get(`/admin/orders/getInfor/${year}`);
    return response.data;
  }catch(error){
    throw new Error(error.response?.data?.message || 'Không thể load thông tin thống kê');
  }
}

export const getYears = async () => {
  try{
    const response = await commonApi.get(`/admin/orders/getYears`);
    return response.data;
  }catch(error){
    throw new Error(error.response?.data?.message || 'Không thể load năm');
  }
}

export const changePassword = async (oldPassword, newPassword, showToast = true) => {
  try {
    const response = await commonApi.put('/users/password', {
      oldPassword,
      newPassword
    });
    
    if (showToast) {
      toast.success('Đổi mật khẩu thành công!');
    }
    
    return {
      success: true,
      message: response.data
    };
  } catch (error) {
    console.error('Password change error:', error);
    
    let errorMessage = 'Có lỗi xảy ra khi thay đổi mật khẩu';
    
    if (error.response) {
      console.log('Error response status:', error.response.status);
      console.log('Error response data:', error.response.data);
      
      if (error.response.status === 400) {
        errorMessage = 'Mật khẩu hiện tại không chính xác';
      } else if (error.response.data) {
        errorMessage = error.response.data;
      }
    }
    
    if (showToast) {
      toast.error(errorMessage);
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const createReview = async (rating, comment, orderId, productId, variantName) => {
  try {
    const reviewData = {
      rating,
      comment,
      productId,
      orderId,
      variantName
    };
    const response = await commonApi.post("/reviews", reviewData);

    if (response.status == 200) {
      toast.success("Đánh giá thành công!");
    }
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đánh giá:", error);
    throw new Error(error.response?.data?.message || "Không thể tạo đánh giá!");
  }
};

export const getTop6BestSellingProducts = async() =>{
  try{
    const res = await commonApi.get("/products/top-6-best-selling")
    return res.data
  } catch(error){
    throw new Error(error.message) 
  }
}

export const getRatingInformation = async (productId) => {
  try{
    const response = await commonApi.get(`/products/reviews/${productId}/rating`);
    return response.data;
  }
  catch(error){
    throw new Error(error.message);
  }
}

export const getReviewsOfProduct = async (productId) => {
  try{
    const response = await commonApi.get(`/products/reviews/${productId}`);
    return response.data;
  }
  catch(error){
    throw new Error(error.message);
  }
}

export const getReviewsOfUserByOrderId = async (orderId) => {
  try{
    const response = await commonApi.get(`/reviews/order/${orderId}`);
    return response.data;
  }
  catch(error){
    throw new Error(error.message);
  }
}

export const handlePayment = async (amount, order, url) => {
    try {
      console.log(order);
      const response = await commonApi.get("/payment/create", {
        params: {
          amount: amount,
          orderInfor: JSON.stringify(order),
          urlReturn: url
        }
      });

      const paymentUrl = response.data;
      window.location.href = paymentUrl; // Chuyển hướng đến cổng thanh toán VNPay
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán VNPay:", error);
      alert("Có lỗi xảy ra khi tạo yêu cầu thanh toán.");
    }
  };