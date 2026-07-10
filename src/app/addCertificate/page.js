import AdminLayout from "../components/AdminLayout";
import CreateCertificateForm from "../components/Certificates/CreateCertificateForm";

export default function addCertificate() {
    return (
        <AdminLayout pageTitle="Create Certificate">
            <CreateCertificateForm />
        </AdminLayout>
    );
}