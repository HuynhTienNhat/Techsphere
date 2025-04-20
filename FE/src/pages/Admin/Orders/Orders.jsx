import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Tabs, Tab, TextField,
  Button, Box
} from '@mui/material';
import OrderList from './OrderList';
import OrderDetailModal from './OrderDetailModal';
import {
  getAllOrders,
  getOrdersByMonthAndYear_Admin,
  getOrdersByStatus_Admin
} from './../../../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { name: 'Tất cả', value: 'ALL' },
    { name: 'Chờ xác nhận', value: 'CONFIRMING' },
    { name: 'Đang chuẩn bị', value: 'PREPARING' },
    { name: 'Đang giao', value: 'DELIVERING' },
    { name: 'Hoàn thành', value: 'COMPLETED' },
    { name: 'Đã hủy', value: 'CANCELLED' },
  ];

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let data;
      if (month && year) {
        data = await getOrdersByMonthAndYear_Admin(month, year);
      } else if (activeTab !== 'ALL') {
        data = await getOrdersByStatus_Admin(activeTab);
      } else {
        data = await getAllOrders();
      }
      setOrders(data);
    } catch (error) {
      toast.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setMonth(null);
    setYear(null);
  };

  const handleFilterByDate = () => {
    if (month && year) {
      fetchOrders();
    } else {
      toast.error("Vui lòng nhập cả tháng và năm!");
    }
  };

  const handleClearFilter = () => {
    setMonth(null);
    setYear(null);
    fetchOrders();
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
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === updatedOrder.orderId ? updatedOrder : order
      )
    );
    handleCloseModal();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý đơn hàng
      </Typography>

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
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          type="number"
          label="Tháng (1-12)"
          value={month ?? ''}
          onChange={(e) => setMonth(Number(e.target.value))}
          size="small"
          sx={{ width: 120 }}
        />
        <TextField
          type="number"
          label="Năm (e.g., 2025)"
          value={year ?? ''}
          onChange={(e) => setYear(Number(e.target.value))}
          size="small"
          inputProps={{ min: 2000, max: 2099 }}
          sx={{ width: 120 }}
        />
        <Button variant="contained" color="primary" onClick={handleFilterByDate}>
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
