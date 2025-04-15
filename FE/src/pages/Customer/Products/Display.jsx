import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {fetchProducts} from './../../../services/api.js';

export default function ProductDisplay({ selectedBrand, keyword }) {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [sortOrder, selectedBrand, keyword]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (keyword) {
        params.keyword = keyword;
      } else if (selectedBrand && selectedBrand !== "All") {
        params.brand = selectedBrand;
      }
      if (sortOrder && !keyword) {
        params.sortBy = sortOrder;
      }

      const data = await fetchProducts(params);
      console.log(data);
      
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (slug) => {
    navigate(`/products/${slug}`);
  };

  // Fix the product card layout to ensure consistent text alignment
  const productElements = products.map((product) => (
    <div
      key={product.productId}
      onClick={() => handleClick(product.slug)}
      className="transition-transform transform hover:-translate-y-2 max-w-50 max-h-74 hover:shadow-lg px-1 pt-2 flex flex-col justify-between rounded-md shadow-md bg-white border-[0.5px] border-gray-100 cursor-pointer"
    >
      {/* Container with fixed height for image */}
      <div className="h-40 flex items-center justify-center mb-2">
        <img
          src={product.mainImageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
          className="max-w-full max-h-40 object-contain rounded-md"
          loading="lazy"
        />
      </div>
      <hr className="my-2 border-gray-200" />
      {/* Container with fixed height for product info */}
      <div className="flex flex-col justify-between flex-grow">
        {/* Title with fixed height */}
        <div className="h-6 overflow-hidden">
          <h2 className="text-sm font-semibold line-clamp-2">{product.name}</h2>
        </div>
        {/* Price container with consistent spacing */}
        <div className="mt-1">
          <p className="text-violet-500 font-bold">
            {product.basePrice.toLocaleString("vi-VN")} đ
          </p>
          {product.oldPrice && (
            <p className="text-gray-500 line-through text-sm">
              {product.oldPrice.toLocaleString("vi-VN")} đ
            </p>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <div
      className="product-display mt-10 py-5 md:mx-10 lg:mx-20 rounded-lg bg-gray-50"
      style={{ boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" , marginLeft:"120px", marginRight:"120px"}}
    >
      <div className="mb-4 px-6 md:px-10 border-b border-gray-200 pb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : "Danh sách sản phẩm"}
        </h3>
        <div>
          <label className="mr-2 text-sm font-medium">Sắp xếp theo: </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={keyword} // Chỉ vô hiệu hóa khi có keyword
          >
            <option value="">Mặc định</option>
            <option value="asc">Giá thấp → cao</option>
            <option value="desc">Giá cao → thấp</option>
          </select>
        </div>
      </div>

      <div className="px-6 md:px-10">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length > 0 ? (
          // Thêm cột thứ 6 cho màn hình lớn và giảm khoảng cách
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
            {productElements}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {keyword ? "Không tìm thấy sản phẩm nào" : "Hiện chưa có sản phẩm nào"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}