import UpdateCertificateForm from "@/app/components/Certificates/UpdateCertificatesForm";

export default async function UpdateCertificatePage({ params }) {
    const { id } = await params;
    return <UpdateCertificateForm id={id} />;
}
