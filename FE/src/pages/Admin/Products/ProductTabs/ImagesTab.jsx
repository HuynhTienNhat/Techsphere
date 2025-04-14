import React from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";

export default function ImagesTab({ images }) {
  return (
    <Box className="grid grid-cols-2 gap-4">
      {images && images.length > 0 ? (
        images.map((image, index) => (
          <Card key={index} className="p-2" elevation={1}>
            <CardMedia
              component="img"
              image={image.imgUrl}
              alt={`Image ${image.displayOrder}`}
              sx={{ height: 128, objectFit: "contain" }}
            />
            <Typography variant="caption" className="text-center block">
              Display Order: {image.displayOrder}
            </Typography>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" className="col-span-2 text-center">
          Chưa có hình ảnh nào.
        </Typography>
      )}
    </Box>
  );
}