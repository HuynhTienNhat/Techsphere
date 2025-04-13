import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
// import ProductEditModal from "./ProductEditModal";
// import ProductAddModal from "./ProductAddModal";
import  {fetchProducts, fetchBrands } from './../../../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [sortBy, setSortBy] = useState(""); // Thêm sortBy
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBrands();
    loadProducts();
  }, [page, filterBrand, sortBy]);

  const loadBrands = async () => {
    try {
      const response = await fetchBrands();
      setBrands(response);
    } catch (error) {
      console.error("Error loading brands:", error);
      alert("Không thể tải danh sách hãng!");
    }
  };

  const loadProducts = async (customSearch = null) => {
    setIsLoading(true);
    try {
        const params = {
            page: page - 1,
            size: productsPerPage,
        };
        
        const searchTerm = customSearch !== null ? customSearch : search;
        
        if (searchTerm) params.keyword = encodeURIComponent(searchTerm);
        if (filterBrand) params.brand = encodeURIComponent(filterBrand);
        if (sortBy) params.sortBy = sortBy; 
        const response = await fetchProducts(params, true);
        console.log("Products loaded:", response);
        setProducts(response);
        setTotalPages(Math.ceil(response.length / productsPerPage)); 
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Không thể tải sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      loadProducts(); // Chỉ tìm kiếm khi nhấn Enter
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    loadProducts("");
  }

  return (
    <div className="px-30">
        <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="border p-2 rounded-md w-full pr-8"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="border p-2 rounded-md"
          disabled={search.trim() !== ""}
        >
          <option value="">Tất cả hãng</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded-md"
          disabled={search.trim() !== ""}
        >
          <option value="">Mặc định</option>
          <option value="asc">Giá thấp → cao</option>
          <option value="desc">Giá cao → thấp</option>
        </select>
      </div>
      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        <ProductList
          products={products}
          onEdit={() => {}} 
          onDelete={() => {}} 
        />
      )}
    </div>
  );
}