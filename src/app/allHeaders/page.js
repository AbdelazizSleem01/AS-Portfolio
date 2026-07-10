import AdminLayout from "../components/AdminLayout";
import GetAllHeader from "../components/Headers/GetAllHeaders";

const HeaderPage = () => {
    return (
        <AdminLayout pageTitle="All Headers">
            <GetAllHeader />
        </AdminLayout>
    );
};

export default HeaderPage;
