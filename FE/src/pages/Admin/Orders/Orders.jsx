import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Tabs, Tab, TextField, Pagination,
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;

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
      setTotalPages(Math.ceil(data.length / ordersPerPage));
      if (page > totalPages) {
        setPage(1);
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

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setMonth(null);
    setYear(null);
  };

  const handleFilterByDate = () => {
    if (month && year) {
      setPage(1);
      fetchOrders();
    } else {
      toast.error("Vui lòng nhập cả tháng và năm!");
    }
  };

  const handleClearFilter = () => {
    setMonth(null);
    setYear(null);
    setPage(1);
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  }

  const getCurrentOrders = () => {
    const startIndex = (page - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return orders.slice(startIndex, endIndex);
  }

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
        <>
        <OrderList orders={getCurrentOrders()} onViewDetails={handleOpenModal} />
        {/* Phân trang */}
        {orders.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {orders.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", p: 6 }}>
            Không có đơn hàng nào.
          </Typography>
        )}
        </>
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
