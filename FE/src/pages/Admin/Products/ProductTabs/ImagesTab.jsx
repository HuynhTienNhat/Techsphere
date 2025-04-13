import React from "react";

export default function ImagesTab({ images }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images && images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} className="p-2 border rounded">
            <img
              src={image.imgUrl}
              alt={`Image ${image.displayOrder}`}
              className="w-full h-32 object-contain"
            />
            <p className="text-sm text-gray-600">
              Display Order: {image.displayOrder}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Chưa có hình ảnh nào.</p>
      )}
    </div>
  );
}