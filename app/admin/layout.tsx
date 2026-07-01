import AdminNav from '../components/Admin/AdminNav';

export const metadata = {
  title: 'Dash Admin',
  description: 'Dash Admin Dashboard',
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
