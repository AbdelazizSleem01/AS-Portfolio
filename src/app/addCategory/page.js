import AdminLayout from "../components/AdminLayout";
import CreateCategory from "../components/categories/CreateCategory";

const ProjectsPage = () => {
    return (
        <AdminLayout pageTitle="Create Category">
            <CreateCategory />
        </AdminLayout>
    );
};

export default ProjectsPage;
