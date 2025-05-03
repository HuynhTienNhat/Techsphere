import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Alert,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import { changeOrderStatus, getUserById, getAddressByIdAndUserId } from './../../../services/api';
import { toast } from 'react-toastify';

const OrderDetailModal = ({ order, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const allowedStatuses = ['CONFIRMING', 'PREPARING', 'DELIVERING'];
  const orderStatuses = ['CONFIRMING', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin người dùng
        const userData = await getUserById(order.userId);
        setUserInfo(userData);

        // Lấy thông tin địa chỉ (nếu có)
        if (order.userAddressId) {
          try {
            console.log(order.userAddressId);
            
            const addressData = await getAddressByIdAndUserId(order.userId,order.userAddressId);
            setAddress(addressData);
          } catch (err) {
            console.warn('Không thể tải địa chỉ:', err.message);
            setAddress(null);
          }
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    };
    fetchData();
  }, [order.userId, order.userAddressId]);

  const handleStatusChange = async () => {
    if (!allowedStatuses.includes(order.status)) {
      toast.error('Chỉ có thể cập nhật trạng thái cho đơn hàng ở trạng thái Chờ xác nhận, Đã xác nhận, hoặc Đang giao.');
      return;
    }
    try {
      setIsLoading(true);
      await changeOrderStatus(order.userId, order.orderId, status);
      const updatedOrder = { ...order, status };
      onUpdate(updatedOrder);
      toast.success('Cập nhật trạng thái thành công!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      CONFIRMING: 'Chờ xác nhận',
      PREPARING: 'Đang chuẩn bị',
      DELIVERING: 'Đang giao',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxWidth: 800,
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold'}}>
          Chi tiết đơn hàng #ĐH-{order.orderId}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Thông tin đơn hàng */}
        <Box sx={{ mb: 2 }}>
          <Typography><strong>Ngày đặt:</strong> {formatDate(order.orderDate)}</Typography>
          <Typography><strong>Tổng tiền:</strong> {formatCurrency(order.totalAmount)}</Typography>
          <Typography><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</Typography>
          <Typography><strong>Trạng thái:</strong> {getStatusLabel(order.status)}</Typography>
        </Box>

        {/* Thông tin người đặt */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{color: '	#6d28d9', fontWeight: 'bold'}}>
            Thông tin người đặt
          </Typography>
          {userInfo ? (
            <>
              <Typography><strong>Tên:</strong> {userInfo.name || 'Chưa cung cấp'}</Typography>
              <Typography><strong>Số điện thoại:</strong> {userInfo.phone || 'Chưa cung cấp'}</Typography>
            </>
          ) : (
            <Typography>Đang tải thông tin...</Typography>
          )}
        </Box>

        {/* Thông tin địa chỉ */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{color: '	#6d28d9', fontWeight: 'bold'}}>
            Địa chỉ giao hàng
          </Typography>
          {address ? (
            <Typography>
              {address.streetAndHouseNumber}, {address.district}, {address.city} - <strong>{address.typeOfAddress}</strong>
              {address.isDefault && ' (Mặc định)'}
            </Typography>
          ) : (
            <Typography>Không có thông tin địa chỉ</Typography>
          )}
        </Box>

        {/* Thay đổi trạng thái */}
        {allowedStatuses.includes(order.status) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Cập nhật trạng thái
            </Typography>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              {orderStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {getStatusLabel(s)}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              color="success"
              onClick={handleStatusChange}
              disabled={isLoading}
              sx={{ mr: 1 }}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
            </Button>
          </Box>
        )}

        {/* Sản phẩm */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{color: '	#6d28d9', fontWeight: 'bold'}}>
            Sản phẩm
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Màu</TableCell>
                  <TableCell>Dung lượng</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Đơn giá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderItems.map((item) => (
                  <TableRow key={item.variantId}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.storage}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button variant="contained" color="error" onClick={onClose}>
          Đóng
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderDetailModal;