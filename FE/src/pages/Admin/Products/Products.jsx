import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import ProductEditModal from "./ProductEditModal";
import ProductAddModal from "./ProductAddModal";
import  {fetchProducts, fetchBrands } from './../../../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [sortBy, setSortBy] = useState(""); // Thêm sortBy
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const productsPerPage = 10

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

  const handleDelete = async (productId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Không thể xóa sản phẩm!");
    }
  };

  const handleEdit = (product) =>{
    setEditProduct(product);
  }

  const handleSaveEdit = () => {
    setEditProduct(null)
    loadProducts()
  }

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = () => {
    setIsAddModalOpen(false);
    loadProducts();
  };

  return (
    <div className="px-40 z-1">
        <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
        <div className="flex justify-between mb-3">
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

          <div>
            <button
              onClick={handleAddProduct}
              className="bg-violet-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-violet-600"
            >
              Add Product
            </button>
          </div>
        </div>
        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}

      <div className="flex justify-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <ProductEditModal product={editProduct} brands={brands} onSave={handleSaveEdit} onClose={() => setEditProduct(null)}/>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <ProductAddModal
          brands={brands}
          onSave={handleSaveAdd}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}