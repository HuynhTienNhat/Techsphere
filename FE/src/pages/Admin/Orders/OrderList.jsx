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
      PREPARING: 'Đang chuẩn bị',
      CONFIRMED: 'Đã xác nhận',
      DELIVERING: 'Đang giao hàng',
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
          <Grid item xs={12} md={6} key={order.orderId} sx={{ width: '100%' }}> 
            <Card>
              <CardContent> 
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}> 
                  <Typography variant="h6" sx={{color:"#8D51FF", fontWeight:600}}>Đơn hàng #{order.orderId}</Typography>
                  <Chip 
                    label={getStatusLabel(order.status)} 
                    color={getStatusColor(order.status)} 
                    size="small" 
                    sx={{ fontSize: '0.75rem' }} // Thu nhỏ kích thước chữ của Chip
                  /> 
                </Box> 
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'row', // Sắp xếp theo hàng ngang
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: 2, // Khoảng cách giữa các phần tử
                    mt: 1 
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">
                      Ngày đặt: {formatDate(order.orderDate)}
                    </Typography> 
                    <Typography variant="body2">
                      Tổng tiền: {formatCurrency(order.totalAmount)}
                    </Typography> 
                    <Typography variant="body2">
                      Phương thức: {order.paymentMethod}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => onViewDetails(order)}
                    size="small" // Thu nhỏ kích thước nút
                    sx={{ 
                      fontSize: '0.75rem', // Thu nhỏ chữ trong nút
                      padding: '6px 8px', // Giảm padding để nút nhỏ hơn
                    }}
                  > 
                    Chi tiết 
                  </Button>
                </Box>
              </CardContent> 
            </Card> 
          </Grid> 
        ))
      )} 
    </Grid>
  );
};

export default OrderList;