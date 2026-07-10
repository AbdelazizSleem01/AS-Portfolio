import AdminLayout from "@/app/components/AdminLayout";
import UpdateProjectForm from "@/app/components/Projects/UpdateProjectForm";

export default async function updateHeaderPage({ params }) {
  const { id } = await params;
  return (
    <AdminLayout pageTitle="Update Project">
      <UpdateProjectForm id={id} />
    </AdminLayout>
  );
}
