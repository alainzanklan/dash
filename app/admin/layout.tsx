import AdminNav from "../components/Admin/AdminNav";

export const metadata = {
  title: "Emart Admin",
  description: "Emart Admin Dashboard",
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
