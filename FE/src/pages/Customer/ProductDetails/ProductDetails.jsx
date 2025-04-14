// src/components/ProductDetail/index.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductImages from './ProductImages';
import ProductVariants from './ProductVariants';
import ProductPrice from './ProductPrice';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${slug}`);
        console.log(response);
        
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        console.log(data);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="text-center py-5 text-lg">Đang tải...</div>;
  if (!product) return <div className="text-center py-5 text-lg text-red-500">Sản phẩm không tồn tại</div>;

  return (
    <div className="max-w-6xl mx-28 p-5"> {/* Sửa mx-29 thành mx-auto */}
        <h1 className="text-2xl font-bold mb-5">
            {product.name} {product.isOutOfStock && <span className="text-sm text-red-500 ml-2">Hết hàng</span>}
        </h1>

        <div className="flex justify-between items-start gap-30"> 
            <ProductImages images={product.images} mainImageUrl={product.mainImageUrl} />

            <div className="flex flex flex-col w-auto">
                <ProductVariants variants={product.variants} onVariantChange={setSelectedVariant}/>
                <ProductPrice basePrice={product.basePrice} oldPrice={product.oldPrice} selectedVariant={selectedVariant}/>
            </div>
        </div>
    </div>
  );
};

export default ProductDetail;