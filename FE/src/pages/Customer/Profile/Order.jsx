import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FixedSizeList } from 'react-window';
import {
  getCustomerOrders,
  getOrdersByStatus,
  getOrdersByMonthAndYear,
  cancelOrder,
  getOrderDetails,
  getAddressById,
  createReview,
} from './../../../services/api.js'; 
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem 
} from "@mui/material";

export default function Orders() {
    const [activeTab, setActiveTab] = useState("ALL");
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [openReview, setOpenReview] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [variantName, setVariantName] = useState("");

    const tabs = [
      { name: "Tất cả", value: "ALL" },
      { name: "Chờ xác nhận", value: "CONFIRMING" },
      { name: "Đang chuẩn bị", value: "PREPARING" },
      { name: "Đang giao hàng", value: "DELIVERING" },
      { name: "Đã giao hàng", value: "COMPLETED" },
      { name: "Đã hủy", value: "CANCELLED" },
    ];

    useEffect(() => {
      if (selectedOrder?.orderItems?.length > 0) {
        const firstItem = selectedOrder.orderItems[0];
        setSelectedVariantId(firstItem.variantId);
        setSelectedProductId(firstItem.productId);
      }
    }, [selectedOrder]);

    const handleOpenReview = async (orderId) => {
      try {
        const order = await getOrderDetails(orderId);
        setSelectedOrder(order);
      } catch (error) {
        toast.error(error.message);
      }
      setSelectedOrderId(orderId);
      setOpenReview(true);
    };
    
    const handleCloseReview = () => {
      setOpenReview(false);
      setSelectedOrderId(null);
    };
    
    // Lấy danh sách đơn hàng
    const fetchOrders = async (status = "ALL", month = null, year = null) => {
      setIsLoading(true);
      try {
        let data;
        if (month && year) {
          data = await getOrdersByMonthAndYear(month, year);
        } else if (status !== "ALL") {
          data = await getOrdersByStatus(status);
        } else {
          data = await getCustomerOrders();
        }
        setOrders(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Gọi khi component mount hoặc khi tab thay đổi
    useEffect(() => {
      fetchOrders(activeTab); 
    }, [activeTab]);
  
    // Xử lý hủy đơn hàng
    const handleCancelOrder = async (orderId) => {
      if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
        try {
          await cancelOrder(orderId);
          toast.success("Hủy đơn hàng thành công!");
          fetchOrders(activeTab, month, year); // Cập nhật lại danh sách, giữ month/year nếu có
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
  
    // Mở modal chi tiết đơn hàng
    const handleOpenModal = async (orderId) => {
      try {
        const order = await getOrderDetails(orderId);
        setSelectedOrder(order);
        if (order.userAddressId) {
          const address = await getAddressById(order.userAddressId);
          
          setSelectedAddress(address);
        } else {
          setSelectedAddress(null);
        }
        setOpenModal(true);
      } catch (error) {
        toast.error(error.message);
      }
    };
  
    // Đóng modal
    const handleCloseModal = () => {
      setOpenModal(false);
      setSelectedOrder(null);
      setSelectedAddress(null);
    };
  
    // Xử lý lọc theo tháng/năm
    const handleFilterByDate = (e) => {
      e.preventDefault();
      if (month && year) {
        fetchOrders(activeTab, month, year);
      } else {
        toast.error("Vui lòng nhập cả tháng và năm!");
      }
    };
  
    // Xử lý xóa bộ lọc
    const handleClearFilter = () => {
      setMonth("");
      setYear("");
      fetchOrders(activeTab); // Tải lại danh sách với tab hiện tại
    };
  
    // Format tiền tệ
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    };
  
    // Format ngày
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("vi-VN");
    };
  
    // Xử lý màu trạng thái
    const getStatusColor = (status) => {
      switch (status) {
        case "COMPLETED":
          return "success";
        case "CANCELLED":
          return "error";
        case "DELIVERING":
          return "info";
        default:
          return "warning";
      }
    };

    // Row component for virtual list
    const OrderRow = ({ index, style }) => {
      const order = orders[index];
      return (
        <div style={style}>
          <Paper sx={{ p: 2, mb: 2, mx: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography fontWeight="medium">Đơn hàng #{order.orderId}</Typography>
              <Chip
                label={tabs.find((tab) => tab.value === order.status)?.name || order.status}
                color={getStatusColor(order.status)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Ngày đặt: {formatDate(order.orderDate)}
            </Typography>
            <Typography variant="body2" fontWeight="medium" mt={1}>
              {formatCurrency(order.totalAmount)}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal(order.orderId)}
              >
                Chi tiết
              </Button>
              {(order.status === "CONFIRMING" || order.status === "PREPARING") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleCancelOrder(order.orderId)}
                >
                  Hủy
                </Button>
              )}
              {(order.status === "COMPLETED") && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {handleOpenReview(order.orderId)}}
                  sx={{ ml: "auto" }}
                >
                  Đánh giá
                </Button>
              )}
            </Box>
          </Paper>
        </div>
      );
    };
  
    return (
      <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Đơn hàng của tôi
        </Typography>
  
        {/* Tabs trạng thái */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.name} value={tab.value} />
          ))}
        </Tabs>
  
        {/* Bộ lọc tháng/năm */}
        <Box component="form" onSubmit={handleFilterByDate} sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            type="number"
            label="Tháng (1-12)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            size="small"
            sx={{ width: 120 }}
          />
          <TextField
            type="number"
            label="Năm (e.g., 2025)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            size="small"
            sx={{ width: 120 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Lọc
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilter}
          >
            Xóa bộ lọc
          </Button>
        </Box>
  
        {/* Danh sách đơn hàng với Virtual Scrolling */}
        {isLoading ? (
          <Typography>Đang tải...</Typography>
        ) : orders.length === 0 ? (
          <Typography>Không có đơn hàng nào.</Typography>
        ) : (
          <Box sx={{ height: 400, width: '100%' }}>
            <FixedSizeList
              height={400}
              width="100%"
              itemCount={orders.length}
              itemSize={180} // Adjust based on your order item height
            >
              {OrderRow}
            </FixedSizeList>
          </Box>
        )}
  
        {/* Modal chi tiết đơn hàng (MUI Dialog) */}
        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
          {selectedOrder && (
            <>
              <DialogTitle>Chi tiết đơn hàng #{selectedOrder.orderId}</DialogTitle>
              <DialogContent>
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Thông tin đơn hàng
                  </Typography>
                  <Typography>Ngày đặt: {formatDate(selectedOrder.orderDate)}</Typography>
                  <Typography>
                    Trạng thái: {tabs.find((tab) => tab.value === selectedOrder.status)?.name}
                  </Typography>
                  <Typography>Tổng tiền: {formatCurrency(selectedOrder.totalAmount)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Địa chỉ giao hàng
                  </Typography>
                  {selectedAddress ? (
                    <Typography>
                      {selectedAddress.streetAndHouseNumber}, {selectedAddress.district},{" "}
                      {selectedAddress.city}, {selectedAddress.typeOfAddress}
                      {selectedAddress.isDefault && " (Mặc định)"}
                    </Typography>
                  ) : (
                    <Typography>Không có thông tin địa chỉ</Typography>
                  )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Sản phẩm
                  </Typography>
                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                    selectedOrder.orderItems.map((item) => (
                      <Box key={item.variantId} sx={{ mb: 2, pb: 2, borderBottom: "1px solid #e0e0e0" }}>
                        <Typography fontWeight="bold">
                          {item.productName} ({item.color}, {item.storage})
                        </Typography>
                        <Typography>Số lượng: {item.quantity}</Typography>
                        <Typography>Đơn giá: {formatCurrency(item.unitPrice)}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography>Không có sản phẩm nào</Typography>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} variant="outlined">
                  Đóng
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog open={openReview} onClose={handleCloseReview}>
          <DialogTitle>Đánh giá đơn hàng #{selectedOrderId}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 ,mb: 2}}>
              <InputLabel id="product-select-label">Sản phẩm</InputLabel>
              <Select
                labelId="product-select-label"
                value={selectedVariantId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedVariantId(selectedId);
              
                  const selectedItem = selectedOrder?.orderItems?.find(
                    (item) => item.variantId === selectedId
                  );
              
                  if (selectedItem) {
                    setSelectedProductId(selectedItem.productId);
                    setVariantName(`${selectedItem.productName} (${selectedItem.color}, ${selectedItem.storage})`);
                  }
                }}
                label="Sản phẩm"
              >
                {selectedOrder?.orderItems?.map((item) => (
                  <MenuItem key={item.variantId} value={item.variantId}>
                    {item.productName} ({item.color}, {item.storage})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Nội dung đánh giá"
              fullWidth
              multiline
              onChange={(e)=>{setComment(e.target.value)}}
              rows={4}
              sx={{ mt: 2, width: 552 }}
            />
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              precision={1}
              sx={{ display: "flex", justifyContent: "center", mx: "auto", mt: 2 }} 
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseReview}>Hủy</Button>
            <Button variant="contained" color="primary" onClick={() => {
              try{
                if(comment === "") throw new Error("Nội dung không thể trống.");
                createReview(rating, comment, selectedOrderId, selectedProductId, variantName);
              }
              catch(error){
                toast.error("Lỗi: " + error.message);
              }
              handleCloseReview();
            }}>
              Gửi đánh giá
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
}