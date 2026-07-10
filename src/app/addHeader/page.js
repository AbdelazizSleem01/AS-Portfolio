import AdminLayout from "../components/AdminLayout";
import CreateHeaderForm from "../components/Headers/CreateHeaderForm";

export default function addHeader() {
    return (
        <AdminLayout pageTitle="Create Header">
            <CreateHeaderForm />
        </AdminLayout>
    );
}