import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function SpecsTab({ specs }) {
  return (
    <Box>
      {specs && specs.length > 0 ? (
        specs.map((spec, index) => (
          <Card 
            key={index} 
            elevation={1} 
            sx={{ mb: 2, ...(index === specs.length - 1 ? {} : {}) }}
          >
            <CardContent>
              <Typography variant="body2">
                <strong>{spec.specName}:</strong> {spec.specValue}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          Chưa có thông số nào.
        </Typography>
      )}
    </Box>
  );
}