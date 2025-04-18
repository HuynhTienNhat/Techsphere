import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';

export default function ProfileUpdateModal({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    phone: initialData.phone || '',
    gender: initialData.gender || '',
    dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = 'Họ tên phải từ 2 đến 50 ký tự';
    }
    if (formData.phone && !/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số';
    }
    if (formData.dateOfBirth) {
      const today = new Date();
      const dob = new Date(formData.dateOfBirth);
      if (dob >= today) {
        newErrors.dateOfBirth = 'Ngày sinh phải trong quá khứ';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Xóa lỗi khi người dùng nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      await onSave(formData);
      onClose();
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Họ tên"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            inputProps={{ pattern: "0[0-9]{9}" }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Giới tính</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Giới tính"
            >
              <MenuItem value="">Chọn giới tính</MenuItem>
              <MenuItem value="MALE">Nam</MenuItem>
              <MenuItem value="FEMALE">Nữ</MenuItem>
              <MenuItem value="OTHER">Khác</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}