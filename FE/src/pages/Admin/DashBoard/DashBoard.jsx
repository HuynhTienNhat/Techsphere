import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Container,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Select,
  MenuItem
} from "@mui/material";

import { 
  TrendingUp, 
  People, 
  Inventory, 
  AttachMoney,
  Dashboard as DashboardIcon
} from "@mui/icons-material";
import { getDashboardInformation, getYears } from "../../../services/api";
import RevenueChart from "./RevenueChart";

export default function AdminDashboard() {
  const [dashboardData, setdashboardData] = useState();
  const [year, setYear] = useState(2025);
  const [years, setYears] = useState([]);

  useEffect(()=>{
    loadYears();
    loadData();
  },[])

  const loadYears = async () => {
    try {
      const data = await getYears();
      if (data) {
        setYears(data);
        setYear(data.at(0));
      } else {
        throw new Error('Không thể tải dữ liệu');
      }
    } catch (err) {
        toast.error(err.message);
    }
  }

  const loadData = async () => {
    try {
      const data = await getDashboardInformation(year);
      console.log('Dashboard data:', data);
      if (data) {
        setdashboardData(data);
      } else {
        throw new Error('Không thể tải dữ liệu');
      }
    } catch (err) {
        toast.error(err.message);
    }
  }

  const recentOrders = dashboardData?.recentOrders.map((order) => (
    <Box key={order.orderId} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
      <Typography variant="body2" color="text.secondary">
        {order.orderDate.split("T")[0]}
      </Typography>
      <Typography variant="body1">
        <strong>ĐH-{order.orderId}</strong> -{" "}
        {order.status === "CONFIRMING" ? "Đang chờ xác nhận" : 
         order.status === "PREPARING" ? "Đang chuẩn bị hàng" :
         order.status === "DELIVERING" ? "Đang vận chuyển" :
         order.status === "COMPLETED" ? "Đã hoàn thành đơn" :
         "Đã hủy"}
      </Typography>
    </Box>
  ));
  

  const formatCurrency = (number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(number);
  // Số liệu mẫu để hiển thị
  const stats = [
    { title: "Tổng doanh thu theo năm", value: formatCurrency(dashboardData?.totalRevenue), icon: <AttachMoney sx={{marginLeft:1}} color="primary" fontSize="large" />, color: "#e3f2fd" },
    { title: "Đơn hàng mới", value: dashboardData?.newOrders, icon: <TrendingUp color="success" fontSize="large" sx={{marginLeft:1}}/>, color: "#e8f5e9" },
    { title: "Khách hàng", value: dashboardData?.customers, icon: <People color="info" fontSize="large" sx={{marginLeft:1}}/>, color: "#e0f7fa" },
    { title: "Sản phẩm bán ra", value: dashboardData?.products, icon: <Inventory color="warning" fontSize="large" sx={{marginLeft:1}}/>, color: "#fff8e1" },
  ];

  return (
    <Container maxWidth="lg" sx={{mx:20}}>
      <Box sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <DashboardIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" fontWeight="bold">
            Dashboard Admin
          </Typography>
        </Box>
        
        <Paper elevation={0} sx={{ p: 2, mb: 5, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Typography variant="body1">
            Chào mừng quay trở lại!
          </Typography>
        </Paper>
        
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 3,
                  bgcolor: stat.color,
                  height: '100%' 
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      {stat.title}
                    </Typography>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader
              title="Thống kê doanh thu theo năm "
              action={
                <Select
                  sx={{ marginLeft: 36 }}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  size="small"
                >
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              }
            />
              <Divider />
              <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <RevenueChart data={dashboardData?.ordersCompletedByYear} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardHeader title="Đơn hàng gần đây" />
              <Divider />
              <CardContent>
                {recentOrders}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}