import React from "react";

export default function ProductList({ products, onEdit, onDelete }) {
  const getMainImageUrl = (product) => {
    if (product.mainImageUrl) return product.mainImageUrl;
    const mainImage = product.images?.find((img) => img.displayOrder === 0);
    return mainImage?.imgUrl || "https://via.placeholder.com/80";
  };

  const getTotalStock = (product) => {
    return product.variants?.reduce((total, variant) => total + (variant.stockQuantity || 0), 0);
  };

  return (
    <div className={`${products.length === 0 ? "shadow-lg rounded py-8 mx-5 text-center" : ""}`}>
      {products.length === 0 ? (
        <p className="py-2 px-5 text-gray-500 font-semibold">Không có sản phẩm nào.</p>
      ) : (
            products.map((product) => (
            <div
              key={product.productId}
              className="flex items-center p-4 min-h-30 items-center border shadow-sm border-gray-200 rounded hover:bg-gray-50 m-4"
            >
              <img
                src={getMainImageUrl(product)}
                alt={product.name}
                className="w-20 h-20 object-contain rounded"
              />
              <div className="flex-1 ml-4 mt-2 flex-col justify-center items-center">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">
                  {product.basePrice.toLocaleString("vi-VN")} VND
                </p>
                <p className="text-sm text-gray-500">
                  Tổng số lượng: {getTotalStock(product)}
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