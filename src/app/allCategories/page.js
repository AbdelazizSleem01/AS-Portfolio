import AdminLayout from "../components/AdminLayout";
import CategoriesList from "../components/categories/AllCategories";

const ProjectsPage = () => {
    return (
        <AdminLayout pageTitle="All Categories">
            <CategoriesList />
        </AdminLayout>
    );
};

export default ProjectsPage;
