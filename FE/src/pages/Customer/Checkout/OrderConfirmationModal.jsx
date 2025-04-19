// src/components/Checkout/OrderConfirmationModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function OrderConfirmationModal({ order, addresses, formatCurrency, onClose }) {
  if (!order) return null;

  return (
    <Dialog
      open={!!order}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '8px',
          fontFamily: 'Roboto, sans-serif',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 500, color: '#1f2937' }}>
        Xác nhận đơn hàng
      </DialogTitle>
      <DialogContent>
        <p className="text-gray-700">Mã đơn hàng: #{order.orderId}</p>
        <p className="text-gray-700">
          Ngày đặt: {new Date(order.orderDate).toLocaleString('vi-VN')}
        </p>
        <h3 className="text-lg font-semibold mt-4">Sản phẩm:</h3>
        {order.orderItems.map((item) => (
          <div key={item.variantId} className="flex justify-between py-2">
            <span>
              {item.productName} ({item.storage}, {item.color}) x {item.quantity}
            </span>
            <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <p className="text-gray-700 mt-2">
          Tạm tính: {formatCurrency(order.subtotal)}
        </p>
        <p className="text-gray-700">
          Phí vận chuyển: {formatCurrency(order.shippingFee)}
        </p>
        {order.discountCode && (
          <p className="text-gray-700">
            Giảm giá ({order.discountCode}): -{formatCurrency(order.discountAmount)}
          </p>
        )}
        <p className="text-red-600 font-semibold mt-2">
          Tổng cộng: {formatCurrency(order.totalAmount)}
        </p>
        <p className="text-gray-700 mt-2">
          Phương thức thanh toán:{' '}
          {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
        </p>
        <p className="text-gray-700">
          Địa chỉ giao hàng:{' '}
          {addresses.find((addr) => addr.id === order.userAddressId)?.streetAndHouseNumber},{' '}
          {addresses.find((addr) => addr.id === order.userAddressId)?.district},{' '}
          {addresses.find((addr) => addr.id === order.userAddressId)?.city}
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          component={Link}
          to="/"
          sx={{ textTransform: 'none', color: '#6b7280', '&:hover': { backgroundColor: '#f3f4f6' } }}
        >
          Quay lại trang chủ
        </Button>
        <Button
          component={Link}
          to="/profile/orders"
          sx={{
            textTransform: 'none',
            backgroundColor: '#8b5cf6',
            color: 'white',
            '&:hover': { backgroundColor: '#7c3aed' },
          }}
        >
          Xem đơn hàng
        </Button>
      </DialogActions>
    </Dialog>
  );
}