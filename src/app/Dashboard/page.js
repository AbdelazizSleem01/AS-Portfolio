import AdminLayout from "../components/AdminLayout";
import Dashboard from "../components/dashboard";

const DashboardPage = () => {
  return (
    <AdminLayout pageTitle="Analytics Dashboard">
      <Dashboard />
    </AdminLayout>
  );
};

export default DashboardPage;