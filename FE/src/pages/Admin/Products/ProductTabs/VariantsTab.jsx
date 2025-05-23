import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import VariantEditModal from './VariantsEditModal'; 

export default function VariantsTab({ variants, onChange, errors }) {
  const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"];
  const [newVariant, setNewVariant] = useState({
    color: "",
    storage: storageOptions[0],
    priceAdjustment: 0,
    stockQuantity: 0,
    default: false,
  });
  const [editVariantIndex, setEditVariantIndex] = useState(null); // State để mở modal chỉnh sửa
  const [openEditModal, setOpenEditModal] = useState(false); // State để kiểm soát modal

  const handleAddVariant = () => {
    const exists = variants.some(
      (v) => v.color === newVariant.color && v.storage === newVariant.storage
    );
    if (exists) {
      toast.warning("Biến thể với màu và bộ nhớ này đã tồn tại!");
      return;
    }
    const updatedVariants = newVariant.default
      ? variants.map((v) => ({ ...v, default: false }))
      : variants;
    onChange([...updatedVariants, { ...newVariant, isDeleted: false }]);
    setNewVariant({
      color: "",
      storage: storageOptions[0],
      priceAdjustment: 0,
      stockQuantity: 0,
      default: false,
    });
  };

  const handleDeleteVariant = (index) => {
    const variant = variants[index];
    if (variant.variantId) {
      // Nếu variant đã có variantId, đánh dấu isDeleted: true
      const updatedVariants = variants.map((v, i) =>
        i === index ? { ...v, isDeleted: true } : v
      );
      onChange(updatedVariants);
    } else {
      // Nếu variant chưa có variantId, xóa trực tiếp khỏi danh sách
      onChange(variants.filter((_, i) => i !== index));
    }
  };

  const handleToggleDefault = (index) => {
    const updatedVariants = variants.map((v, i) => ({
      ...v,
      default: i === index,
    }));
    onChange(updatedVariants);
  };

  const handleEditVariant = (index) => {
    setEditVariantIndex(index);
    setOpenEditModal(true);
  };

  const handleSaveVariant = (updatedVariant) => {
    const updatedVariants = [...variants];
    updatedVariants[editVariantIndex] = { ...updatedVariant, isDeleted: false };
    onChange(updatedVariants);
    setOpenEditModal(false);
    setEditVariantIndex(null);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditVariantIndex(null);
  };

  return (
    <Box className="space-y-4">
      <Card className="p-4">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thêm biến thể
          </Typography>
          <Box className="grid grid-cols-2 gap-4">
            <TextField
              label="Color"
              value={newVariant.color}
              onChange={(e) =>
                setNewVariant({ ...newVariant, color: e.target.value })
              }
              fullWidth
              size="small"
            />
            <Select
              label="Storage"
              value={newVariant.storage}
              onChange={(e) =>
                setNewVariant({ ...newVariant, storage: e.target.value })
              }
              fullWidth
              size="small"
            >
              {storageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Price Adjustment"
              type="number"
              value={newVariant.priceAdjustment}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  priceAdjustment: parseFloat(e.target.value) || 0,
                })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Stock Quantity"
              type="number"
              value={newVariant.stockQuantity}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  stockQuantity: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newVariant.default}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, default: e.target.checked })
                  }
                />
              }
              label="Default"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddVariant}
            className="mt-4 bg-violet-500 hover:bg-violet-600"
          >
            Add Variant
          </Button>
        </CardContent>
      </Card>

      {variants.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chưa có biến thể nào.
        </Typography>
      ) : (
        <Box className="max-h-64 overflow-y-auto space-y-2 p-2 border rounded">
          {variants
            .map((variant, index) => ({ variant, index }))
            .filter(({ variant }) => !variant.isDeleted) // Chỉ hiển thị variant chưa bị xóa
            .map(({ variant, index }) => (
              <Card key={index} className="flex items-center justify-between p-2">
                <CardContent>
                  <Typography variant="body2">
                    <strong>Color:</strong> {variant.color}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Storage:</strong> {variant.storage}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Price Adjustment:</strong>{" "}
                    {variant.priceAdjustment.toLocaleString("vi-VN")} VND
                  </Typography>
                  <Typography variant="body2">
                    <strong>Stock:</strong> {variant.stockQuantity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Default:</strong> {variant.default ? "Yes" : "No"}
                  </Typography>
                </CardContent>
                <Box className="flex gap-2 mr-4">
                  <Button
                    color="primary"
                    onClick={() => handleEditVariant(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteVariant(index)}
                  >
                    Delete
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => handleToggleDefault(index)}
                  >
                    Set Default
                  </Button>
                </Box>
              </Card>
            ))}
        </Box>
      )}
      {errors.variants && (
        <Typography variant="body2" color="error">
          {errors.variants}
        </Typography>
      )}

      <VariantEditModal
        open={openEditModal}
        variant={editVariantIndex !== null ? variants[editVariantIndex] : null}
        storageOptions={storageOptions}
        onSave={handleSaveVariant}
        onClose={handleCloseEditModal}
      />
    </Box>
  );
}