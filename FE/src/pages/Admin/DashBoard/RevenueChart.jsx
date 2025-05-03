import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data }) => {
  return (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <XAxis dataKey="month" />
      <YAxis
        tickFormatter={(value) => `${value / 1_000_000} triệu`}
        padding={{ top: 10 }}
      />
      <Tooltip
        formatter={(value) => [
          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
          'Doanh thu'
        ]}
        labelFormatter={(label) => `${label}`}
      />
      <Line type="linear" dataKey="revenue" stroke="#1976d2" strokeWidth={2} dot />
    </LineChart>
  </ResponsiveContainer>
  );
};

export default RevenueChart;
