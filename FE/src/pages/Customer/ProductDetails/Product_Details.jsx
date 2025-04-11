import { useParams } from "react-router-dom";
import React from "react";
import Headline from './Headline.jsx';
import ProductDisplay from './ProductDisplay.jsx';

export default function ProductDetails(){
    const {slug} = useParams();
    const [product, setProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Gọi API từ back-end
        fetch(`http://localhost:8080/api/products/${slug}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Product not found!");
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching product:", error);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <p className="text-center">Đang tải...</p>;
    }

    if (!product) {
        return <p className="text-center text-red-500">Không tìm thấy sản phẩm!</p>;
    }

    return (
        <>
            <Headline headling={product.name} />
            <ProductDisplay product={product}/>
            <ProductDescription/>
            <ProductReviews/>
            <Orders/>
        </>
    )
}