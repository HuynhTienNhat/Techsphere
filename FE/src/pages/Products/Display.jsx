import React from 'react';
import { useNavigate } from "react-router-dom";

export default function ProductDisplay() {
    const [products, setProducts] = React.useState([])

    const [sortOrder, setSortOrder] = React.useState("");

    React.useEffect(() => {
        fetchProducts();
    }, [sortOrder]); 

    const handleClick = (slug) =>{
        navigate(`/products/${slug}`);
    }

    const fetchProducts = () => {
        let url = 'http://localhost:8080/api/products'

        if (sortOrder) {
            url += `?sortBy=${sortOrder}`;
        }

        fetch(url)
        .then(response => response.json())
        .then(data => setProducts(data))
    }

    const productElements = products.map(product => (
        <div key={product.id} onClick={() => handleClick(product.slug)}
        className="transition-transform transform hover:-translate-y-2 hover:shadow-lg p-2 flex flex-col justify-center rounded-md shadow-md dark:bg-white-50 dark:text-gray-900 border-[0.5px] border-gray-100">
            <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover" />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-red-500 font-bold">{product.price.toLocaleString()} đ</p>
            {product.old_price && (
                <p className="text-gray-500 line-through">{product.old_price.toLocaleString()} đ</p>
            )}
        </div>
    ))

    return(
        <div className="product-display mt-10 py-5 mx-30 rounded-lg" style={{ boxShadow: '0px 8px 20px rgba(0,0,0,0.2)' }}>
            <div className="mb-4 px-10 border-b border-b-gray-300 pb-4">
                <label className="mr-2">Sắp xếp theo: </label>
                <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)} 
                    className="border p-1 rounded"
                >
                    <option value="">Mặc định</option>
                    <option value="price_asc">Giá thấp → cao</option>
                    <option value="price_desc">Giá cao → thấp</option>
                </select>
            </div>

            <div className={`${products.length > 0 ? "grid grid-cols-4 gap-4" : "flex items-center"}`}>
                {products.length > 0 ?productElements : <p className='text-center w-full'>Hiện chưa có sản phẩm nào</p>}
            </div>
        </div>
    )
}