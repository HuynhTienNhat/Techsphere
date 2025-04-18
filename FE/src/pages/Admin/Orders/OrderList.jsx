import React from 'react';
import { Grid, Card, CardContent, Typography, Button, Chip ,Box} from '@mui/material';

const OrderList = ({ orders, onViewDetails }) => {
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
      CONFIRMED: 'Đã xác nhận',
      DELIVERING: 'Đang giao',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'DELIVERING':
        return 'info';
      default:
        return 'warning';
    }
  };

  return (
    <Grid container spacing={2}>
      {orders.length === 0 ? (
        <Grid item xs={12}>
          <Typography>Không có đơn hàng nào.</Typography>
        </Grid>
      ) : (
        orders.map((order) => (
          <Grid item xs={12} md={6} key={order.orderId}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">Đơn hàng #{order.orderId}</Typography>
                  <Chip
                    label={getStatusLabel(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>
                <Typography>Ngày đặt: {formatDate(order.orderDate)}</Typography>
                <Typography>Tổng tiền: {formatCurrency(order.totalAmount)}</Typography>
                <Typography>Phương thức thanh toán: {order.paymentMethod}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onViewDetails(order)}
                  sx={{ mt: 2 }}
                >
                  Chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default OrderList;