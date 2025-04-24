import React from 'react';
// Import icons từ react-icons
import { FaHeadphones } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { MdEmail, MdRateReview } from 'react-icons/md';

// CSS cho component
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  cardContainer: {
    flex: '1 1 calc(50% - 10px)',
    minWidth: '300px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 24px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    gap: '16px',
    height: '100%',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    margin: '0 0 4px 0',
  },
  value: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f44336',
    margin: 0,
  },
  email: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f44336',
    margin: 0,
    textDecoration: 'none',
  }
};

// Custom Icon components với màu sắc
const SupportIcon = () => (
  <div style={{ ...styles.iconWrapper, backgroundColor: '#e8f0fe' }}>
    <FaHeadphones size={24} color="#4285F4" />
  </div>
);

const WarrantyIcon = () => (
  <div style={{ ...styles.iconWrapper, backgroundColor: '#fef8e8' }}>
    <BiTime size={24} color="#FBBC04" />
  </div>
);

const ComplaintIcon = () => (
  <div style={{ ...styles.iconWrapper, backgroundColor: '#fde8e8' }}>
    <MdRateReview size={24} color="#EA4335" />
  </div>
);

const EmailIcon = () => (
  <div style={{ ...styles.iconWrapper, backgroundColor: '#e8f5e9' }}>
    <MdEmail size={24} color="#34A853" />
  </div>
);

// Contact Card Component
const ContactCard = ({ icon, title, value, isEmail }) => {
  return (
    <div style={styles.cardContainer}>
      <div style={styles.card}>
        {icon}
        <div style={styles.content}>
          <p style={styles.title}>{title}</p>
          {isEmail ? (
            <a href={`mailto:${value}`} style={styles.email}>
              {value}
            </a>
          ) : (
            <p style={styles.value}>{value}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Contact() {
  return (
    <div style={styles.container}>
      {/* Hàng 1: Tư vấn và Bảo hành */}
      <div style={styles.row}>
        <ContactCard 
          icon={<SupportIcon />} 
          title="Tư vấn mua hàng (8h00 - 22h00)" 
          value="1800.2097" 
        />
        <ContactCard 
          icon={<WarrantyIcon />} 
          title="Bảo hành (8h00 - 21h00)" 
          value="1800.2064" 
        />
      </div>
      
      {/* Hàng 2: Khiếu nại và Email */}
      <div style={styles.row}>
        <ContactCard 
          icon={<ComplaintIcon />} 
          title="Khiếu nại (8h00 - 21h30)" 
          value="1800.2063" 
        />
        <ContactCard 
          icon={<EmailIcon />} 
          title="Email" 
          value="cskh@techsphere.com.vn" 
          isEmail={true} 
        />
      </div>
    </div>
  );
}