import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BasicTab from "./ProductTabs/BasicTab.jsx";
import VariantsTab from "./ProductTabs/VariantsTab.jsx";
import SpecsTab from "./ProductTabs/SpecsTab.jsx";
import ImagesTab from "./ProductTabs/ImagesTab.jsx";

export default function ProductEditModal({ product, brands, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    productId: product.productId,
    name: product.name || "",
    model: product.model || "",
    slug: product.slug || "",
    basePrice: product.basePrice ? Number(product.basePrice) : "",
    oldPrice: product.oldPrice ? Number(product.oldPrice) : "",
    brandName: product.brandName || "",
    variants: Array.isArray(product.variants) ? product.variants : [],
    specs: [],
    images: [],
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
    mainImageUrl: product.mainImageUrl || "",
    isOutOfStock: product.isOutOfStock || false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "basePrice" || name === "oldPrice") {
      updatedValue = value === "" ? "" : Number(value);
    }
    setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
    setErrors({ ...errors, [name]: "" });
  };

  const handleVariantsChange = (variants) => {
    setFormData((prevData) => ({ ...prevData, variants }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Tên sản phẩm không được để trống";
    if (!formData.model) newErrors.model = "Model không được để trống";
    if (!formData.slug) newErrors.slug = "Slug không được để trống";
    else if (!/^[a-z0-9-]+$/.test(formData.slug))
      newErrors.slug = "Slug chỉ chứa chữ thường, số, dấu gạch ngang";
    if (!formData.basePrice || formData.basePrice < 500000)
      newErrors.basePrice = "Giá cơ bản phải từ 500,000 trở lên";
    if (formData.oldPrice && formData.oldPrice < 500000)
      newErrors.oldPrice = "Giá cũ phải từ 500,000 trở lên";
    if (!formData.brandName) newErrors.brandName = "Hãy chọn hãng";
    if (formData.variants.length === 0)
      newErrors.variants = "Cần ít nhất một biến thể";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${formData.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...formData,
            basePrice: formData.basePrice ? Number(formData.basePrice) : null,
            oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể lưu sản phẩm!");
      }

      alert("Đã lưu sản phẩm thành công!");
      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message || "Không thể lưu sản phẩm!");
    }
  };

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  return (
    <Modal open={!!product} onClose={onClose}>
      <Box
        className="bg-white rounded-lg w-full max-w-2xl p-6 mx-auto mt-20"
        sx={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" fontWeight="bold">
            Edit Product
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className="mb-4"
        >
          {["basic", "variants", "specs", "images"].map((tab) => (
            <Tab
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              value={tab}
              className="capitalize"
            />
          ))}
        </Tabs>

        {activeTab === "basic" && (
          <BasicTab
            formData={formData}
            brands={brands}
            errors={errors}
            onChange={handleChange}
          />
        )}
        {activeTab === "variants" && (
          <VariantsTab
            variants={formData.variants}
            onChange={handleVariantsChange}
            errors={errors}
          />
        )}
        {activeTab === "specs" && <SpecsTab specs={product.specs} />}
        {activeTab === "images" && <ImagesTab images={product.images} />}

        {activeTab === "basic" && (
          <Box className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              className="bg-violet-500 hover:bg-violet-600"
            >
              Save
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
}