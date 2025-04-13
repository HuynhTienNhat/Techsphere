// src/services/api.js
export const fetchProducts = async (
    params = {},
    requiresAuth = false,
    options = {}
  ) => {
    let url;
    const { brand, keyword, sortBy } = params;
  
    if (keyword) {
      url = new URL(`http://localhost:8080/api/products/search`);
      url.searchParams.append("keyword", encodeURIComponent(keyword));
    } else if (brand && brand !== "All") {
      url = new URL(`http://localhost:8080/api/products/brand/${encodeURIComponent(brand)}`);
    } else {
      url = new URL("http://localhost:8080/api/products");
    }
  
    if (sortBy) {
      url.searchParams.append("sortBy", sortBy);
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
  
    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      console.log("Error response:", await response.text());
      throw new Error("Không thể tải sản phẩm!");
    }
    return response.json();
  };
  
  // fetchBrands giữ nguyên
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