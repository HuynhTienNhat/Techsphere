// src/components/ProductDetail/ProductPrice.jsx
import React from 'react';
import { Button } from '@mui/material';

const ProductPrice = ({ basePrice, oldPrice, selectedVariant }) => {
  // Tính giá điều chỉnh
  const priceAdjustment = selectedVariant?.priceAdjustment || 0;

  // Tính giá hiển thị và giá cũ
  const adjustedPrice = basePrice + priceAdjustment;
  const adjustedOldPrice = oldPrice ? oldPrice + priceAdjustment : null;

  // Format giá tiền
  const formatPrice = (price) => {
    return price ? `${parseInt(price).toLocaleString('vi-VN')}đ` : 'N/A';
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-4 mb-4 px-4 py-2 shadow-md bg-gray-200 rounded mb-2">
        <span className="text-2xl font-bold text-red-600">{formatPrice(adjustedPrice)}</span>
        {adjustedOldPrice && (
          <span className="text-lg text-gray-500 line-through">{formatPrice(adjustedOldPrice)}</span>
        )}
      </div>
      <div className='flex justify-between'>
        <Button
            variant="contained"
            color="primary"
            className="py-3 text-base"
            sx={{ textTransform: 'none',backgroundColor: '#8b5cf6', // violet-500
                color: 'white',
                '&:hover': {
                backgroundColor: '#7c3aed', // violet-600
                }, mt:2}}
        >
            Thêm vào giỏ hàng
        </Button>

        <Button
            variant="contained"
            color="primary"
            className="py-3 text-base"
            sx={{ textTransform: 'none',backgroundColor: '#ef4444', 
                color: 'white',
                '&:hover': {
                backgroundColor: '#dc2626', 
                }, mt:2}}
        >
            Mua ngay
        </Button>
      </div>
    </div>
  );
};

export default ProductPrice;