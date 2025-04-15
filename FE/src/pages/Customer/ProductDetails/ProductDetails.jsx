// src/components/ProductDetail/index.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductImages from './ProductImages';
import ProductVariants from './ProductVariants';
import ProductPrice from './ProductPrice';
import ProductBasicInfo from './BasicInformation';
import ProductSpecs from './ProductSpecs';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${slug}`);
        
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        console.log(data)
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
    <div className="mx-26 px-4 sm:px-6 lg:px-8 max-w-7xl mt-6">
      <h1 className="text-2xl font-bold mb-5">
        {product.name} {product.isOutOfStock && <span className="text-sm text-red-500 ml-2">Hết hàng</span>}
      </h1>

      <div className="flex flex-col md:flex-row justify-between w-full pt-4 border-t-4 border-gray-300 gap-8"> 
        <ProductImages images={product.images} mainImageUrl={product.mainImageUrl} />

        <div className="flex flex-col w-full md:w-96 space-y-6">
          <ProductVariants variants={product.variants} onVariantChange={setSelectedVariant}/>
          <ProductPrice basePrice={product.basePrice} oldPrice={product.oldPrice} selectedVariant={selectedVariant} product={product}/>
        </div>
      </div>

      {/* Product Information and Specifications in same row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ProductBasicInfo />
        <ProductSpecs specs={product.specs} />
      </div>
    </div>
  );
};

export default ProductDetail;