import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent, Divider } from '@mui/material';

const RevenueChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <XAxis dataKey="month"  />
      <YAxis tickFormatter={(value) => `${value / 1_000_000} triệu`} padding={{ top: 10}}/>
      <Tooltip 
        formatter={(value) => [
          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),'Doanh thu']
        }
        labelFormatter={(label) => `${label}`}
      />
      <Bar dataKey="revenue" fill="#1976d2" />
    </BarChart>
  </ResponsiveContainer>
  );
};

export default RevenueChart;
