import AdminLayout from "@/app/components/AdminLayout";
import UpdateCertificateForm from "@/app/components/Certificates/UpdateCertificatesForm";

export default async function UpdateCertificatePage({ params }) {
    const { id } = await params;
    return (
        <AdminLayout pageTitle="Update Certificate">
            <UpdateCertificateForm id={id} />
        </AdminLayout>
    );
}
