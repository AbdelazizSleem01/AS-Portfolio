import AdminLayout from "../components/AdminLayout";
import GetAllSCertificates from '../components/Certificates/GetAllCertificates.jsx';

const ProjectsPage = () => {
    return (
        <AdminLayout pageTitle="All Certificates">
            <GetAllSCertificates />
        </AdminLayout>
    );
};

export default ProjectsPage;
