import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  TextField,
  Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BasicTab from "./ProductTabs/BasicTab";
import VariantsTab from "./ProductTabs/VariantsTab";

export default function ProductAddModal({ brands, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    slug: "",
    basePrice: "",
    oldPrice: "",
    brandName: "",
    variants: [],
    screen: "",
    ram: "",
    frontCamera: "",
    rearCamera: "",
    pin: "",
    imageFiles: [],
    displayOrders: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleVariantsChange = (variants) => {
    setFormData({ ...formData, variants });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newDisplayOrders = files.map(
      (_, index) => formData.imageFiles.length + index
    );
    setFormData({
      ...formData,
      imageFiles: [...formData.imageFiles, ...files],
      displayOrders: [...formData.displayOrders, ...newDisplayOrders],
    });
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
    if (!formData.screen || isNaN(formData.screen) || formData.screen <= 0)
      newErrors.screen = "Màn hình phải là số lớn hơn 0";
    if (!formData.ram || isNaN(formData.ram) || formData.ram <= 0)
      newErrors.ram = "RAM phải là số lớn hơn 0";
    if (!formData.frontCamera || isNaN(formData.frontCamera))
      newErrors.frontCamera = "Camera trước phải là số";
    if (!formData.rearCamera)
      newErrors.rearCamera = "Camera sau không được để trống";
    if (!formData.pin || isNaN(formData.pin) || formData.pin < 1000)
      newErrors.pin = "Pin phải là số từ 1000 trở lên";
    if (formData.imageFiles.length === 0)
      newErrors.imageFiles = "Cần ít nhất một ảnh";
    if (formData.imageFiles.length !== formData.displayOrders.length)
      newErrors.imageFiles = "Số ảnh và display orders phải khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("model", formData.model);
    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("basePrice", formData.basePrice);
    if (formData.oldPrice)
      formDataToSend.append("oldPrice", formData.oldPrice);
    formDataToSend.append("brandName", formData.brandName);
    formDataToSend.append("screen", formData.screen);
    formDataToSend.append("ram", formData.ram);
    formDataToSend.append("frontCamera", formData.frontCamera);
    formDataToSend.append("rearCamera", formData.rearCamera);
    formDataToSend.append("pin", formData.pin);
    formDataToSend.append("variants", JSON.stringify(formData.variants));
    formData.imageFiles.forEach((file) =>
      formDataToSend.append("imageFiles", file)
    );
    formData.displayOrders.forEach((order) =>
      formDataToSend.append("displayOrders", order)
    );

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể thêm sản phẩm!");
      } else {
        alert("Thêm sản phẩm thành công");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        className="bg-white rounded-lg w-full max-w-2xl p-6 mx-auto mt-20"
        sx={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" fontWeight="bold">
            Add Product
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
        {activeTab === "specs" && (
          <Stack spacing={2}>
            <TextField
              label="Screen"
              type="number"
              name="screen"
              value={formData.screen}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.screen}
              helperText={errors.screen}
            />
            <TextField
              label="RAM"
              type="number"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.ram}
              helperText={errors.ram}
            />
            <TextField
              label="Front Camera"
              type="number"
              name="frontCamera"
              value={formData.frontCamera}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.frontCamera}
              helperText={errors.frontCamera}
            />
            <TextField
              label="Rear Camera"
              name="rearCamera"
              value={formData.rearCamera}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.rearCamera}
              helperText={errors.rearCamera}
            />
            <TextField
              label="Pin"
              type="number"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.pin}
              helperText={errors.pin}
            />
          </Stack>
        )}
        {activeTab === "images" && (
          <Box className="space-y-4">
            <Box className="flex justify-center">
              <Button
                variant="contained"
                component="label"
                className="bg-violet-500 hover:bg-violet-600"
              >
                Chọn ảnh
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
            <Box className="grid grid-cols-2 gap-4 p-2 border rounded max-h-64 overflow-y-auto">
              {formData.imageFiles.length > 0 ? (
                formData.imageFiles.map((file, index) => (
                  <Box key={index} className="p-2 border rounded">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-24 object-contain"
                    />
                    <Typography variant="caption" className="text-center block">
                      Order: {formData.displayOrders[index]}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" className="col-span-2 text-center">
                  Chưa có hình ảnh nào.
                </Typography>
              )}
            </Box>
            {errors.imageFiles && (
              <Typography variant="body2" color="error">
                {errors.imageFiles}
              </Typography>
            )}
          </Box>
        )}

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