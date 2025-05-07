import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from './../../../services/api.js';
import ProfileUpdateModal from './ProfileUpdateModal';
import { toast } from 'react-toastify';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';

export default function ProfileInfo() {
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    username: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    role: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch profile khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (formData) => {
    try {
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
    } catch (error) {
      throw error; 
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1000 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Thông tin cá nhân
      </Typography>

      {/* Profile picture */}
      <Box mb={3} sx={{ display: 'flex', justifyContent: 'center' }}>
        <svg width="100" height="100" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="44" height="44" rx="22" fill="#E0D4F9"></rect>
          <path
            d="M22.0086 10C23.3144 10 24.5909 10.3871 25.6767 11.1123C26.7624 11.8375 27.6087 12.8683 28.1084 14.0743C28.6081 15.2803 28.7389 16.6073 28.4841 17.8876C28.2294 19.1679 27.6006 20.3439 26.6772 21.2669C25.7538 22.1899 24.5774 22.8185 23.2967 23.0732C22.0159 23.3278 20.6884 23.1971 19.482 22.6976C18.2756 22.1981 17.2444 21.3521 16.519 20.2668C15.7935 19.1814 15.4063 17.9054 15.4062 16.6C15.4115 14.8512 16.1088 13.1755 17.3458 11.9389C18.5829 10.7023 20.2592 10.0052 22.0086 10Z"
            fill="#8B5CF6"
          ></path>
          <path
            opacity="0.95"
            d="M22.0049 39.6009C17.4561 39.5967 13.0859 37.8304 9.8125 34.6729C10.7861 32.2356 12.4672 30.1453 14.6394 28.6713C16.8117 27.1973 19.3756 26.4071 22.001 26.4024C24.6264 26.3976 27.1931 27.1786 29.3707 28.6448C31.5482 30.1109 33.2369 32.1951 34.2192 34.6289C30.9533 37.8169 26.5696 39.6013 22.0049 39.6009Z"
            fill="#4C1D95"
          ></path>
          <path
            opacity="0.3"
            d="M33 22.9318C33.9545 22.8636 35.7273 21.7727 36 20C36 21.4318 37.7727 22.7955 39 22.9318C38 23.1364 36 24.6909 36 26C36 24.3636 33.8182 23.1364 33 22.9318Z"
            fill="#8B5CF6"
          ></path>
          <path
            opacity="0.3"
            d="M6 21.4432C6.79545 21.3864 8.27273 20.4773 8.5 19C8.5 20.1932 9.97727 21.3295 11 21.4432C10.1667 21.6136 8.5 22.9091 8.5 24C8.5 22.6364 6.68182 21.6136 6 21.4432Z"
            fill="#8B5CF6"
          ></path>
          <path
            opacity="0.3"
            d="M29 6.95455C29.6364 6.90909 30.8182 6.18182 31 5C31 5.95455 32.1818 6.86364 33 6.95455C32.3333 7.09091 31 8.12727 31 9C31 7.90909 29.5455 7.09091 29 6.95455Z"
            fill="#8B5CF6"
          ></path>
        </svg>
      </Box>

      {/* Profile content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} sx={{width: '100%'}}>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Họ tên
            </Typography>
            <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {profile.name}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {profile.email}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Số điện thoại
            </Typography>
            <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {profile.phone}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Giới tính
            </Typography>
            <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Ngày sinh
            </Typography>
            <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEdit}
          sx={{ bgcolor: '#8B5CF6', '&:hover': { bgcolor: '#7C3AED' } }}
        >
          Chỉnh sửa thông tin
        </Button>
      </Box>

      {isModalOpen && (
        <ProfileUpdateModal
          initialData={profile}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </Paper>
  );
}