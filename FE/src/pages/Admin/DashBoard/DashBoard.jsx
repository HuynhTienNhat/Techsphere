import React from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Container,
  Card,
  CardContent,
  CardHeader,
  Divider
} from "@mui/material";
import { 
  TrendingUp, 
  People, 
  Inventory, 
  AttachMoney,
  Dashboard as DashboardIcon
} from "@mui/icons-material";

export default function AdminDashboard() {
  // Số liệu mẫu để hiển thị
  const stats = [
    { title: "Tổng doanh thu", value: "850,000,000 VND", icon: <AttachMoney color="primary" fontSize="large" />, color: "#e3f2fd" },
    { title: "Đơn hàng mới", value: "24", icon: <TrendingUp color="success" fontSize="large" />, color: "#e8f5e9" },
    { title: "Khách hàng", value: "1,458", icon: <People color="info" fontSize="large" />, color: "#e0f7fa" },
    { title: "Sản phẩm", value: "68", icon: <Inventory color="warning" fontSize="large" />, color: "#fff8e1" },
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
            Chào mừng quay trở lại! Bạn có <strong>5</strong> thông báo mới và <strong>12</strong> đơn hàng cần xử lý.
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
              <CardHeader title="Thống kê doanh thu" />
              <Divider />
              <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Biểu đồ doanh thu sẽ được hiển thị tại đây
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardHeader title="Đơn hàng gần đây" />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2" color="text.secondary">12/04/2025</Typography>
                  <Typography variant="body1"><strong>ĐH-12345</strong> - Đã giao hàng</Typography>
                </Box>
                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2" color="text.secondary">11/04/2025</Typography>
                  <Typography variant="body1"><strong>ĐH-12344</strong> - Đang giao hàng</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">10/04/2025</Typography>
                  <Typography variant="body1"><strong>ĐH-12343</strong> - Chờ xác nhận</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}