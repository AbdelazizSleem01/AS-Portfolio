import AdminLayout from "@/app/components/AdminLayout";
import UpdateHeaderForm from "@/app/components/Headers/UpdateHeaderForm";

export default async function updateHeaderPage({ params }) {
  const { id } = await params;
  return (
    <AdminLayout pageTitle="Update Header">
      <UpdateHeaderForm id={id} />
    </AdminLayout>
  );
}
