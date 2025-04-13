import React from "react";

export default function ProductList({ products, onEdit, onDelete }) {
  const getMainImageUrl = (product) => {
    if (product.mainImageUrl) return product.mainImageUrl;
    const mainImage = product.images?.find((img) => img.displayOrder === 0);
    return mainImage?.imgUrl || "https://via.placeholder.com/80";
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {products.length === 0 ? (
        <p className="p-4 text-gray-500">Không có sản phẩm nào.</p>
      ) : (
        products.map((product) => (
          <div
            key={product.productId}
            className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50"
          >
            <img
              src={getMainImageUrl(product)}
              alt={product.name}
              className="w-20 h-20 object-contain rounded"
            />
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">
                {product.basePrice.toLocaleString("vi-VN")} VND
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="bg-violet-400 rounded px-3 py-2 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.productId)}
                className="bg-red-400 hover:bg-red-300 px-3 py-2 rounded cursor-pointer ml-5"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}