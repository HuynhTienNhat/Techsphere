import React, { useState } from "react";

export default function VariantsTab({ variants, onChange, errors }) {
  // Danh sách các lựa chọn bộ nhớ cố định
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
      alert("Biến thể với màu và bộ nhớ này đã tồn tại!");
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
      storage: "",
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
    <div className="space-y-4">
      {/* Form thêm biến thể */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Thêm biến thể</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              type="text"
              value={newVariant.color}
              onChange={(e) =>
                setNewVariant({ ...newVariant, color: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
          <label className="block text-sm font-medium mb-1">Storage</label>
            <select
              value={newVariant.storage}
              onChange={(e) =>
                setNewVariant({ ...newVariant, storage: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              {storageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price Adjustment</label>
            <input
              type="number"
              value={newVariant.priceAdjustment}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  priceAdjustment: parseFloat(e.target.value),
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              value={newVariant.stockQuantity}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  stockQuantity: parseInt(e.target.value),
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newVariant.default}
              onChange={(e) =>
                setNewVariant({ ...newVariant, default: e.target.checked })
              }
              className="mr-2"
            />
            <label className="text-sm font-medium">Default</label>
          </div>
        </div>
        <button
          onClick={handleAddVariant}
          className="mt-4 bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600"
        >
          Add Variant
        </button>
      </div>

      {/* Danh sách biến thể */}
      {variants.length === 0 ? (
        <p className="text-gray-500">Chưa có biến thể nào.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2 p-2 border rounded">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="flex items-center p-2 border rounded justify-between"
            >
              <div>
                <p>
                  <strong>Color:</strong> {variant.color}
                </p>
                <p>
                  <strong>Storage:</strong> {variant.storage}
                </p>
                <p>
                  <strong>Price Adjustment:</strong>{" "}
                  {variant.priceAdjustment.toLocaleString("vi-VN")} VND
                </p>
                <p>
                  <strong>Stock:</strong> {variant.stockQuantity}
                </p>
                <p>
                  <strong>Default:</strong> {variant.default ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleDefault(index)}
                  className="text-blue-500 hover:underline"
                >
                  Set Default
                </button>
                <button
                  onClick={() => handleDeleteVariant(index)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {errors.variants && (
        <p className="text-red-500 text-sm">{errors.variants}</p>
      )}
    </div>
  );
}