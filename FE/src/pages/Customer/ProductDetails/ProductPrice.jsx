import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '../../../services/api';

const ProductPrice = ({ basePrice, oldPrice, selectedVariant, product }) => {
  const navigate = useNavigate();

  const priceAdjustment = selectedVariant?.priceAdjustment || 0;
  const adjustedPrice = basePrice + priceAdjustment;
  const adjustedOldPrice = oldPrice ? oldPrice + priceAdjustment : null;

  const formatPrice = (price) => {
    return price ? `${parseInt(price).toLocaleString('vi-VN')}đ` : 'N/A';
  };

  const handleAddToCart = async (redirect = false) => {
    if (!selectedVariant) {
      toast.error('Vui lòng chọn một phiên bản sản phẩm');
      return;
    }

    if (product?.isOutOfStock) {
      toast.error('Sản phẩm hiện đã hết hàng');
      return;
    }

    try {
      await addToCart(selectedVariant.variantId, 1);
      toast.success('Đã thêm thành công');
      if (redirect) {
        navigate('/cart');
      }
    } catch (error) {
      if (error.message.includes('Vui lòng đăng nhập') || error.message.includes('403')) {
        toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.dispatchEvent(new Event('token-changed'));
        navigate('/login');
      } else {
        toast.error(error.message || 'Không thể thêm vào giỏ hàng');
      }
    }
  };

  const isDisabled = !selectedVariant || product?.isOutOfStock;

  return (
    <div className="mt-6 w-full">
      <div className="flex items-center gap-4 mb-4 px-4 py-3 bg-gray-100 rounded mb-4 justify-center">
        <span className="text-2xl font-bold text-red-600">{formatPrice(adjustedPrice)}</span>
        {adjustedOldPrice && (
          <span className="text-lg text-gray-500 line-through">{formatPrice(adjustedOldPrice)}</span>
        )}
      </div>
      <div className="flex gap-4 justify-between w-full">
        <Button
          variant="contained"
          className="py-3 flex-1"
          onClick={() => handleAddToCart(false)}
          disabled={isDisabled}
          sx={{
            textTransform: 'none',
            backgroundColor: isDisabled ? '#d1d5db' : '#8b5cf6',
            color: 'white',
            '&:hover': {
              backgroundColor: isDisabled ? '#d1d5db' : '#7c3aed',
            },
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '1rem',
          }}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          variant="contained"
          className="py-3 flex-1"
          onClick={() => handleAddToCart(true)}
          disabled={isDisabled}
          sx={{
            textTransform: 'none',
            backgroundColor: isDisabled ? '#d1d5db' : '#ef4444',
            color: 'white',
            '&:hover': {
              backgroundColor: isDisabled ? '#d1d5db' : '#dc2626',
            },
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '1rem',
          }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
};

export default ProductPrice;