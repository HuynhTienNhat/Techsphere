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
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', p: 6 }}>
          Không có sản phẩm nào.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: 'space-between' }}>
          {products.map((product) => (
            <Grid item key={product.productId} sx={{ width: 'calc(50% - 16px)' }}>
              <Card
                elevation={1}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2,
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } 
                }}
              >
                <CardMedia
                  component="img"
                  image={getMainImageUrl(product)}
                  alt={product.name}
                  sx={{ width: 80, height: 80, objectFit: "contain" }}
                />
                <CardContent sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="h6" fontWeight="semibold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {product.basePrice.toLocaleString("vi-VN")} VND
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng số lượng: {getTotalStock(product)}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onDelete(product.productId)}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}