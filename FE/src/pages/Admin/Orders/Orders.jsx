import React, { useState, useEffect } from 'react';
import { Container, Typography, Tabs, Tab, TextField, Button, Box, Alert } from '@mui/material';
import OrderList from './OrderList';
import OrderDetailModal from './OrderDetailModal';
import { getAllOrders } from './../../../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { name: 'Tất cả', value: 'ALL' },
    { name: 'Chờ xác nhận', value: 'CONFIRMING' },
    { name: 'Đã xác nhận', value: 'CONFIRMED' },
    { name: 'Đang giao', value: 'DELIVERING' },
    { name: 'Hoàn thành', value: 'COMPLETED' },
    { name: 'Đã hủy', value: 'CANCELLED' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getAllOrders();
        setOrders(data.data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterByDate = (e) => {
    e.preventDefault();
    if (month && year) {
      fetchOrders(newValue, month, year);
    } else {
      toast.error("Vui lòng nhập cả tháng và năm!");
    }
  };

  const handleClearFilter = () => {
    setMonth('');
    setYear('');
    fetchOrders(activeTab);
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map((order) => (order.orderId === updatedOrder.orderId ? updatedOrder : order)));
    handleCloseModal();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý đơn hàng
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Tabs trạng thái */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.name} value={tab.value} />
        ))}
      </Tabs>

      {/* Bộ lọc tháng/năm */}
      <Box component="form" onSubmit={handleFilterByDate} sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          type="number"
          label="Tháng (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          size="small"
          inputProps={{ min: 1, max: 12 }}
          sx={{ width: 120 }}
        />
        <TextField
          type="number"
          label="Năm (e.g., 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          size="small"
          inputProps={{ min: 2000, max: 2099 }}
          sx={{ width: 120 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Lọc
        </Button>
        <Button variant="outlined" onClick={handleClearFilter}>
          Xóa bộ lọc
        </Button>
      </Box>

      {/* Danh sách đơn hàng */}
      {isLoading ? (
        <Typography>Đang tải...</Typography>
      ) : (
        <OrderList orders={orders} onViewDetails={handleOpenModal} />
      )}

      {/* Modal chi tiết */}
      {isModalOpen && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onUpdate={handleUpdateOrder}
        />
      )}
    </Container>
  );
};

export default Orders;