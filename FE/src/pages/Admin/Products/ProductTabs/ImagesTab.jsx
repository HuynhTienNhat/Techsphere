import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardActions,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ImagesTab({ images, onDeleteImage }) {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: 2 
    }}>
      {images && images.length > 0 ? (
        images.map((image, index) => (
          <Card key={index} sx={{ p: 1 }} elevation={1}>
            <CardMedia
              component="img"
              image={image.imgUrl}
              alt={`Image ${image.displayOrder}`}
              sx={{ height: 128, objectFit: "contain" }}
            />
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
              Display Order: {image.displayOrder}
            </Typography>
            {onDeleteImage && (
              <CardActions sx={{ justifyContent: 'center', p: 0, mt: 1 }}>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => onDeleteImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            )}
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ gridColumn: 'span 2', textAlign: 'center' }}>
          Chưa có hình ảnh nào.
        </Typography>
      )}
    </Box>
  );
}