// src/components/ProductDetail/ProductPrice.jsx
import React from 'react';
import { Button } from '@mui/material';

const ProductPrice = ({ basePrice, oldPrice, selectedVariant }) => {
  // Calculate price adjustment
  const priceAdjustment = selectedVariant?.priceAdjustment || 0;

  // Calculate display price and old price
  const adjustedPrice = basePrice + priceAdjustment;
  const adjustedOldPrice = oldPrice ? oldPrice + priceAdjustment : null;

  // Format price
  const formatPrice = (price) => {
    return price ? `${parseInt(price).toLocaleString('vi-VN')}đ` : 'N/A';
  };

  return (
    <div className="mt-6 w-full">
      <div className="flex items-center gap-4 mb-4 px-4 py-3 bg-gray-100 rounded mb-4 justify-center">
        <span className="text-2xl font-bold text-red-600">{formatPrice(adjustedPrice)}</span>
        {adjustedOldPrice && (
          <span className="text-lg text-gray-500 line-through">{formatPrice(adjustedOldPrice)}</span>
        )}
      </div>
      <div className="flex gap-4 justify-between w-full">
        <Button
          variant="contained"
          className="py-3 flex-1"
          sx={{ 
            textTransform: 'none',
            backgroundColor: '#8b5cf6',
            color: 'white',
            '&:hover': {
              backgroundColor: '#7c3aed',
            }, 
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '1rem'
          }}
        >
          Thêm vào giỏ hàng
        </Button>

        <Button
          variant="contained"
          className="py-3 flex-1"
          sx={{ 
            textTransform: 'none',
            backgroundColor: '#ef4444',
            color: 'white',
            '&:hover': {
              backgroundColor: '#dc2626',
            }, 
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '1rem'
          }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
};

export default ProductPrice;