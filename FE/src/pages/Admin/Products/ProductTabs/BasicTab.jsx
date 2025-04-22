import React from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Stack } from "@mui/material";

export default function BasicTab({ formData, brands, errors, onChange }) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Name"
        name="name"
        value={formData.name || ""}
        onChange={onChange}
        fullWidth
        size="small"
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Model"
        name="model"
        value={formData.model || ""}
        onChange={onChange}
        fullWidth
        size="small"
        error={!!errors.model}
        helperText={errors.model}
      />
      <TextField
        label="Slug"
        name="slug"
        value={formData.slug || ""}
        onChange={onChange}
        fullWidth
        size="small"
        error={!!errors.slug}
        helperText={errors.slug}
      />
      <TextField
        label="Base Price (VND)"
        type="number"
        name="basePrice"
        value={formData.basePrice || ""}
        onChange={onChange}
        fullWidth
        size="small"
        error={!!errors.basePrice}
        helperText={errors.basePrice}
      />
      <TextField
        label="Old Price (VND)"
        type="number"
        name="oldPrice"
        value={formData.oldPrice || ""}
        onChange={onChange}
        fullWidth
        size="small"
        error={!!errors.oldPrice}
        helperText={errors.oldPrice}
      />
      <FormControl fullWidth size="small" error={!!errors.brandName}>
        <InputLabel>Brand</InputLabel>
        <Select
          name="brandName"
          value={formData.brandName || ""}
          onChange={onChange}
          label="Brand"
        >
          <MenuItem value="">Select Brand</MenuItem>
          {brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.name}>
              {brand.name}
            </MenuItem>
          ))}
        </Select>
        {errors.brandName && (
          <p className="text-red-500 text-sm">{errors.brandName}</p>
        )}
      </FormControl>
    </Stack>
  );
}