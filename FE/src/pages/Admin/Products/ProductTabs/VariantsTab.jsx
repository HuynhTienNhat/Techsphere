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

export default function VariantsTab({ variants, onChange, errors }) {
  const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"];
  const [newVariant, setNewVariant] = useState({
    color: "",
    storage: storageOptions[0],
    priceAdjustment: 0,
    stockQuantity: 0,
    default: false,
  });

  const handleAddVariant = () => {
    const exists = variants.some(
      (v) => v.color === newVariant.color && v.storage === newVariant.storage
    );
    if (exists) {
      toast.warning("Biến thể với màu và bộ nhớ này đã tồn tại!");
      return;
    }
    if (newVariant.default) {
      const updatedVariants = variants.map((v) => ({ ...v, default: false }));
      onChange([...updatedVariants, newVariant]);
    } else {
      onChange([...variants, newVariant]);
    }
    setNewVariant({
      color: "",
      storage: storageOptions[0],
      priceAdjustment: 0,
      stockQuantity: 0,
      default: false,
    });
  };

  const handleDeleteVariant = (index) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const handleToggleDefault = (index) => {
    const updatedVariants = variants.map((v, i) => ({
      ...v,
      default: i === index,
    }));
    onChange(updatedVariants);
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
                  priceAdjustment: parseFloat(e.target.value),
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
                  stockQuantity: parseInt(e.target.value),
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
          {variants.map((variant, index) => (
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
                  onClick={() => handleToggleDefault(index)}
                >
                  Set Default
                </Button>
                <Button
                  color="error"
                  onClick={() => handleDeleteVariant(index)}
                >
                  Delete
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
    </Box>
  );
}