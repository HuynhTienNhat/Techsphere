// src/components/ProductDetail/ProductVariants.jsx
import React, { useState, useEffect } from 'react';

const ProductVariants = ({ variants, onVariantChange }) => {
  // Check if variants don't exist or are empty
  if (!variants || variants.length === 0) {
    return <div className="text-gray-500">Không có biến thể nào</div>;
  }

  // Group unique colors
  const colors = [...new Set(variants.map(variant => variant.color))];

  // Find default variant
  let defaultVariant = variants.find(variant => variant.default) || variants[0];

  // If default variant is out of stock, select first in-stock variant
  if (defaultVariant.stockQuantity === 0) {
    defaultVariant = variants.find(variant => variant.stockQuantity > 0) || defaultVariant;
  }

  // State for selected color and storage
  const [selectedColor, setSelectedColor] = useState(defaultVariant.color);
  const [selectedStorage, setSelectedStorage] = useState(defaultVariant.storage);

  // Filter storage options based on selected color
  const availableStorages = [...new Set(
    variants
      .filter(variant => variant.color === selectedColor)
      .map(variant => variant.storage)
  )];

  // Check stock status for each storage option
  const getStockStatus = (color, storage) => {
    const variant = variants.find(v => v.color === color && v.storage === storage);
    return variant ? variant.stockQuantity > 0 : false;
  };

  // Find selected variant based on selected color and storage
  let selectedVariant = variants.find(
    variant => variant.color === selectedColor && variant.storage === selectedStorage
  ) || defaultVariant;

  // If selected storage is not available or out of stock, select first in-stock storage
  useEffect(() => {
    const validStorages = availableStorages.filter(storage => getStockStatus(selectedColor, storage));
    if (!validStorages.includes(selectedStorage) || !getStockStatus(selectedColor, selectedStorage)) {
      setSelectedStorage(validStorages[0] || availableStorages[0]);
    }
  }, [selectedColor, availableStorages]);

  // Update state when variants change
  useEffect(() => {
    setSelectedColor(defaultVariant.color);
    setSelectedStorage(defaultVariant.storage);
  }, [variants]);

  // Update parent component with selected variant
  useEffect(() => {
    if (selectedVariant && onVariantChange) {
      onVariantChange(selectedVariant);
    }
  }, [selectedVariant, onVariantChange]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h4 className="text-base font-semibold mb-3">Chọn màu</h4>
        <div className="flex gap-3 flex-wrap">
          {colors.map(color => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 border rounded-md cursor-pointer min-w-20 text-center ${
                selectedColor === color ? 'border-blue-500 border-2 font-medium' : 'border-gray-300'
              }`}
            >
              {color}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Chọn dung lượng</h4>
        <div className="flex gap-3">
          {availableStorages.map(storage => {
            const isInStock = getStockStatus(selectedColor, storage);
            return (
              <div
                key={storage}
                onClick={() => {
                  if (isInStock) {
                    setSelectedStorage(storage);
                  }
                }}
                className={`relative px-4 py-2 border rounded-md min-w-20 text-center ${
                  selectedStorage === storage && isInStock
                    ? 'border-blue-500 border-2 font-medium'
                    : 'border-gray-300'
                } ${!isInStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {storage}
                {!isInStock && (
                  <span className="absolute top-0 right-0 text-xs text-red-500 bg-white px-1 rounded-bl-lg">
                    Hết hàng
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;