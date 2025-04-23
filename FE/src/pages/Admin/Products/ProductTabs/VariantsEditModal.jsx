import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

export default function VariantEditModal({ open, variant, storageOptions, onSave, onClose }) {
  const [formData, setFormData] = useState({
    variantId: null,
    color: '',
    storage: storageOptions[0],
    priceAdjustment: 0,
    stockQuantity: 0,
    default: false,
    isDeleted: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (variant) {
      setFormData({
        variantId: variant.variantId || null,
        color: variant.color || '',
        storage: variant.storage || storageOptions[0],
        priceAdjustment: variant.priceAdjustment || 0,
        stockQuantity: variant.stockQuantity || 0,
        default: variant.default || false,
        isDeleted: variant.isDeleted || false,
      });
      setErrors({});
    }
  }, [variant, storageOptions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priceAdjustment' ? parseFloat(value) || 0 : 
              name === 'stockQuantity' ? parseInt(value) || 0 : updatedValue,
    }));
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.color) newErrors.color = 'Màu sắc không được để trống';
    if (!formData.storage) newErrors.storage = 'Dung lượng không được để trống';
    if (formData.stockQuantity < 0) newErrors.stockQuantity = 'Số lượng tồn kho phải lớn hơn hoặc bằng 0';
    if (formData.priceAdjustment < -10000000 || formData.priceAdjustment > 10000000) {
      newErrors.priceAdjustment = 'Điều chỉnh giá phải nằm trong khoảng -10,000,000 đến 10,000,000';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra các trường thông tin!');
      return;
    }
    onSave(formData);
    toast.success('Đã cập nhật biến thể!');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="bg-white rounded-lg w-full max-w-md p-6 mx-auto mt-20"
        sx={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" fontWeight="bold">
            Chỉnh sửa biến thể
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <TextField
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.color}
            helperText={errors.color}
          />
          <Select
            label="Storage"
            name="storage"
            value={formData.storage}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.storage}
          >
            {storageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Price Adjustment (VND)"
            type="number"
            name="priceAdjustment"
            value={formData.priceAdjustment}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.priceAdjustment}
            helperText={errors.priceAdjustment}
          />
          <TextField
            label="Stock Quantity"
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.stockQuantity}
            helperText={errors.stockQuantity}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="default"
                checked={formData.default}
                onChange={handleChange}
              />
            }
            label="Default"
          />
        </Stack>

        <Box className="flex justify-end gap-2 mt-4">
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className="bg-violet-500 hover:bg-violet-600"
          >
            Lưu
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}