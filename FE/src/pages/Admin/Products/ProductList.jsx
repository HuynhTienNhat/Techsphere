import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";

export default function ProductList({ products, onEdit, onDelete }) {
  const getMainImageUrl = (product) => {
    if (product.mainImageUrl) return product.mainImageUrl;
    const mainImage = product.images?.find((img) => img.displayOrder === 0);
    return mainImage?.imgUrl || "https://via.placeholder.com/80";
  };

  const getTotalStock = (product) => {
    return product.variants?.reduce(
      (total, variant) => total + (variant.stockQuantity || 0),
      0
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {products.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", p: 6 }}>
          Không có sản phẩm nào.
        </Typography>
      ) : (
        <div>
          {/* Header - Table title row */}
          <Box 
            sx={{ 
              display: 'flex',
              borderBottom: '1px solid #e0e0e0',
              py: 1.5,
              alignItems: 'center',
            }}
          >
            <Box sx={{ width: '90px', pl: 2 }}>
              <Typography variant="subtitle2">Hình ảnh</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">Tên sản phẩm</Typography>
            </Box>
            <Box sx={{ width: '200px', textAlign: 'right', pr: 6 }}>
              <Typography variant="subtitle2">Giá</Typography>
            </Box>
            <Box sx={{ width: '100px', textAlign: 'center' }}>
              <Typography variant="subtitle2">Số lượng</Typography>
            </Box>
            <Box sx={{ width: '220px', textAlign: 'center' }}>
              <Typography variant="subtitle2">Tác vụ</Typography>
            </Box>
          </Box>

          {/* Product rows */}
          {products.map((product) => (
            <Box 
              key={product.productId} 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              <Box sx={{ width: '90px', pl: 2 }}>
                <img 
                  src={getMainImageUrl(product)} 
                  alt={product.name}
                  style={{ 
                    width: 60, 
                    height: 60, 
                    objectFit: 'contain'
                  }} 
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}
                >
                  {product.name}
                </Typography>
              </Box>
              <Box sx={{ width: '200px', textAlign: 'right' }}>
                <Typography variant="body2">
                  {product.basePrice.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
              <Box sx={{ width: '100px', textAlign: 'center' }}>
                <Typography variant="body2">
                  {getTotalStock(product)}
                </Typography>
              </Box>
              <Box sx={{ width: '220px', textAlign: 'right', pr: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="info"
                  onClick={() => onEdit(product)}
                  sx={{ 
                    background: "#8b5cf6", 
                    "&:hover": { backgroundColor: "#7c3aed" },
                    minWidth: '80px',
                    borderRadius: 1
                  }}
                >
                  EDIT
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => onDelete(product.productId)}
                  sx={{ 
                    background: "#ef4444", 
                    "&:hover": { bgcolor: "#dc2626" },
                    minWidth: '80px',
                    borderRadius: 1
                  }}
                >
                  DELETE
                </Button>
              </Box>
            </Box>
          ))}
        </div>
      )}
    </Box>
  );
}