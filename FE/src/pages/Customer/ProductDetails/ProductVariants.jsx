// src/components/ProductDetail/ProductVariants.jsx
import React, { useState, useEffect } from 'react';

const ProductVariants = ({ variants, onVariantChange }) => {
  // Kiểm tra nếu variants không tồn tại hoặc rỗng
  if (!variants || variants.length === 0) {
    return <div className="text-gray-500">Không có biến thể nào</div>;
  }

  // Gom nhóm các color và storage duy nhất
  const colors = [...new Set(variants.map(variant => variant.color))];

  // Tìm biến thể mặc định
  let defaultVariant = variants.find(variant => variant.isDefault) || variants[0];

  // Nếu biến thể mặc định hết hàng, chọn biến thể đầu tiên có hàng
  if (defaultVariant.stockQuantity === 0) {
    defaultVariant = variants.find(variant => variant.stockQuantity > 0) || defaultVariant;
  }

  // State để lưu màu và dung lượng đã chọn
  const [selectedColor, setSelectedColor] = useState(defaultVariant.color);
  const [selectedStorage, setSelectedStorage] = useState(defaultVariant.storage);

  // Lọc danh sách storages dựa trên selectedColor
  const availableStorages = [...new Set(
    variants
      .filter(variant => variant.color === selectedColor) // Chỉ lấy các variant của màu đã chọn
      .map(variant => variant.storage)
  )];

  // Kiểm tra stockQuantity cho từng storage
  const getStockStatus = (color, storage) => {
    const variant = variants.find(v => v.color === color && v.storage === storage);
    return variant ? variant.stockQuantity > 0 : false;
  };

  // Tìm variant dựa trên màu và dung lượng đã chọn
  let selectedVariant = variants.find(
    variant => variant.color === selectedColor && variant.storage === selectedStorage
  ) || defaultVariant;

  // Nếu selectedStorage không có trong availableStorages hoặc hết hàng, chọn storage đầu tiên có hàng
  useEffect(() => {
    const validStorages = availableStorages.filter(storage => getStockStatus(selectedColor, storage));
    if (!validStorages.includes(selectedStorage) || !getStockStatus(selectedColor, selectedStorage)) {
      setSelectedStorage(validStorages[0] || availableStorages[0]); // Chọn storage đầu tiên có hàng
    }
  }, [selectedColor, availableStorages]);

  // Cập nhật state khi variants thay đổi
  useEffect(() => {
    setSelectedColor(defaultVariant.color);
    setSelectedStorage(defaultVariant.storage);
  }, [variants]);

  // Cập nhật selectedVariant lên parent component
  useEffect(() => {
    if (selectedVariant && onVariantChange) {
      onVariantChange(selectedVariant);
    }
  }, [selectedVariant, onVariantChange]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-base font-semibold mb-2">Chọn màu</h4>
        <div className="flex gap-3">
          {colors.map(color => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 border rounded-md cursor-pointer text-center ${
                selectedColor === color ? 'border-blue-500 border-2 font-bold' : 'border-gray-300'
              }`}
            >
              {color}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-2">Chọn dung lượng</h4>
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
                className={`relative px-4 py-2 border rounded-md text-center ${
                  selectedStorage === storage && isInStock
                    ? 'border-blue-500 border-2 font-bold'
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