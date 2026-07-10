import AdminLayout from "../components/AdminLayout";
import GetProjects from '../components/Projects/GetAllProjects.jsx';

const ProjectsPage = () => {
    return (
        <AdminLayout pageTitle="All Projects">
            <GetProjects />
        </AdminLayout>
    );
};

export default ProjectsPage;
