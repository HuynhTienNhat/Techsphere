import React from "react";
import { Navigate,Link } from "react-router-dom";
import {useEffect,  useState , useRef} from "react";
import { fetchCart } from "../../../services/api";
import { FaTrash } from 'react-icons/fa';

export default function CartBody(){
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    // const navigate = useNavigate();
    const cartRef = useRef(cartItems);

    useEffect(() => {
        cartRef.current = cartItems;
      }, [cartItems]);

    useEffect(()=>{
        loadCart();
        return () => {
            const token = localStorage.getItem("token");
            console.log(cartRef.current);
            fetch('http://localhost:8080/api/cart/update', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify( { cartItemDTOS: cartRef.current } )
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(()=> {
                console.log('Cart items submitted successfully:');
              })
              .catch(error => {
                console.error('Error submitting cart items:', error);
              });
        }
    },[]);

    const loadCart = async () => {
        setIsLoading(true);
        setError(null);
        try{
            const data = await fetchCart();
            console.log(data);
            if (data && data.cartItems && data.totalPrice !== undefined) {
                setCartItems(data.cartItems);
                setTotalPrice(data.totalPrice);
            } else {
                throw new Error("Dữ liệu giỏ hàng không hợp lệ");
            }
        }
        catch(err){
            setError(err.message);
        }
        finally{
            setIsLoading(false);
        }
    };

    // const handleClick = (slug) => {
    //     navigate(`/products/${slug}`);
    // };

    const formatCurrency = (number) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(number);
      
    const updateQuantity = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
                : item
            )
        );
    };
          

    const cartItemsElement = cartItems.map((item)=>(
        <div key={item.id} className="rounded-md flex items-start p-5 min-h-[100px] justify-between bg-white text-black border-gray-400">
            <div className="flex-shrink-0">
                <img src={item.mainImageUrl || "https://via.placeholder.com/150"} alt="" className="w-[130px] h-[130px] object-cover rounded" />
            </div>
            <div className="flex flex-col flex-grow ml-4">
                <div className="flex justify-between items-start">
                    <p className="text-black font-medium">{item.productName} {item.storage} - {item.color}</p>
                    <FaTrash className="text-black dark:text-gray-400 text-2xl cursor-pointer" />
                </div>
                <div className="flex justify-between items-center mt-15">
                    <div className="flex gap-2">
                        <p className="text-red-600 font-semibold text-xl">{formatCurrency(item.unitPrice)}</p>
                        <p className="line-through text-gray-300 text-sm pt-1">{formatCurrency(item.oldPrice)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span onClick={() => updateQuantity(item.id,-1)} className="rounded-md cursor-pointer bg-gray-300 w-8 h-8 flex justify-center items-center">-</span>
                        <input type="text" readOnly className="bg-transparent w-8 h-8 text-center text-black" value={item.quantity} />
                        <span onClick={() => updateQuantity(item.id,1)} className="rounded-md cursor-pointer bg-gray-300 w-8 h-8 flex justify-center items-center">+</span>
                    </div>
                </div>
            </div>
        </div>

    ));

    return <div>
    <div className="container-body items-center">
      <div className="container-items">
        {isLoading ? (
            <div className="text-center py-10">
                <p className="text-gray-500">Đang tải giỏ hàng...</p>
            </div>
        ) : error ? (
            <div className="text-center py-10">
                <p className="text-gray-500">{error}</p>
            </div>
        ) : cartItems.length === 0 ? (
          <div className="mt-20 flex flex-col justify-center items-center">
            <p className="block h-[30vh] mt-20 text-center">
              Giỏ hàng của bạn đang trống.<br />
              Hãy chọn thêm sản phẩm mới để mua sắm.
            </p>
            <div className="mt-4">
                <Link to={"/"} className="px-10 p-2 cursor-pointer rounded-md dark:bg-violet-600 dark:text-gray-50 hover:dark:bg-violet-700 transition-colors">
                    Quay lại trang chủ
                </Link>
            </div>
          </div>
        ) : (
            <div className="flex flex-col gap-10 mt-10">
                {cartItemsElement}
                <div className="bg-white flex justify-between items-center">
                    <p className="ml-2 p-5 text-xl">Tạm tính: <span className="text-red-600">{formatCurrency(totalPrice)}</span></p>
                    <button className="mr-5 bg-violet-600 rounded-md cursor-pointer h-10 p-2 px-5">Mua ngay</button>
                </div>
            </div>
        )
        }
      </div>
    </div>
  </div>
  
}