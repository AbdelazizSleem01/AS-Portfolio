import AdminLayout from "../components/AdminLayout";
import CreatedProjectForm from "../components/Projects/CreatedProjectForm";

export default function addProject() {
    return (
        <AdminLayout pageTitle="Create Project">
            <CreatedProjectForm />
        </AdminLayout>
    );
}