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
  Stack,
  Card,
  CardMedia,
  CardActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import BasicTab from "./ProductTabs/BasicTab";
import VariantsTab from "./ProductTabs/VariantsTab";
import { toast } from "react-toastify";

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

  const handleDeleteImage = (index) => {
    const updatedImageFiles = [...formData.imageFiles];
    
    updatedImageFiles.splice(index, 1);
    
    const updatedDisplayOrders = updatedImageFiles.map((_, idx) => idx);
    
    setFormData({
      ...formData,
      imageFiles: updatedImageFiles,
      displayOrders: updatedDisplayOrders,
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

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(errorData.message || "Không thể thêm sản phẩm!");
      } else {
        toast.success("Thêm sản phẩm thành công");
      }

      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Images Tab Component
  const ImagesTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          component="label"
          sx={{ bgcolor: 'rgb(139, 92, 246)', '&:hover': { bgcolor: 'rgb(124, 58, 237)' } }}
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
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        maxHeight: '16rem',
        overflowY: 'auto'
      }}>
        {formData.imageFiles.length > 0 ? (
          formData.imageFiles.map((file, index) => (
            <Card key={index} sx={{ p: 1 }} elevation={1}>
              <CardMedia
                component="img"
                src={URL.createObjectURL(file)}
                alt="Preview"
                sx={{ height: '6rem', objectFit: 'contain' }}
              />
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                Order: {formData.displayOrders[index]}
              </Typography>
              <CardActions sx={{ justifyContent: 'center', p: 0, mt: 1 }}>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDeleteImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ gridColumn: 'span 2', textAlign: 'center' }}>
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
  );

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 1,
          width: '100%',
          maxWidth: '42rem',
          p: 3,
          mx: 'auto',
          mt: '5rem',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
          sx={{ mb: 2 }}
        >
          {["basic", "variants", "specs", "images"].map((tab) => (
            <Tab
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              value={tab}
              sx={{ textTransform: 'capitalize' }}
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
        {activeTab === "images" && <ImagesTab />}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ bgcolor: 'rgb(139, 92, 246)', '&:hover': { bgcolor: 'rgb(124, 58, 237)' } }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}