import React, { useState, useEffect } from "react";
import { fetchProducts, fetchBrands } from "../../../services/api";
import ProductList from "./ProductList";
import ProductEditModal from "./ProductEditModal";
import ProductAddModal from "./ProductAddModal";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Box,
  Typography,
  Pagination,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const productsPerPage = 10;

  useEffect(() => {
    loadBrands();
    loadProducts();
  }, [page, filterBrand, sortBy]);

  const loadBrands = async () => {
    try {
      const response = await fetchBrands();
      setBrands(response);
    } catch (error) {
      toast.error("Không thể tải danh sách hãng!");
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
      setProducts(response);
      setTotalPages(Math.ceil(response.length / productsPerPage));
    } catch (error) {
      toast.error("Không thể tải sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      loadProducts();
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    loadProducts("");
  };

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
      toast.error("Không thể xóa sản phẩm!");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleSaveEdit = () => {
    setEditProduct(null);
    loadProducts();
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = () => {
    setIsAddModalOpen(false);
    loadProducts();
  };

  return (
    <Box sx={{ px: 20, py: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom className="px-5">
        Quản lý sản phẩm
      </Typography>
      <Box className="flex flex-col px-5 sm:flex-row justify-between gap-4 mb-6">
        <Box className="flex flex-col sm:flex-row gap-4">
          <TextField
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            size="small"
            sx={{ maxWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <ClearIcon
                    className="cursor-pointer"
                    onClick={handleClearSearch}
                  />
                </InputAdornment>
              ),
            }}
          />
          <Select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            displayEmpty
            size="small"
            disabled={search.trim() !== ""}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Tất cả hãng</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.name}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
            size="small"
            disabled={search.trim() !== ""}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Mặc định</MenuItem>
            <MenuItem value="asc">Giá thấp → cao</MenuItem>
            <MenuItem value="desc">Giá cao → thấp</MenuItem>
          </Select>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct}
          className="bg-violet-500 hover:bg-violet-600"
        >
          Add Product
        </Button>
      </Box>

      {isLoading ? (
        <Box className="flex justify-center py-5">
          <CircularProgress />
        </Box>
      ) : (
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Box className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {editProduct && (
        <ProductEditModal
          product={editProduct}
          brands={brands}
          onSave={handleSaveEdit}
          onClose={() => setEditProduct(null)}
        />
      )}

      {isAddModalOpen && (
        <ProductAddModal
          brands={brands}
          onSave={handleSaveAdd}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </Box>
  );
}