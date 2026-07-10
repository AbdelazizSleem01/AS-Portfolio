import AdminLayout from "../components/AdminLayout";
import CreatedExperienceForm from "../components/Experience/CreatedExperienceForm";

export default function AddExperiencePage() {
  return (
    <AdminLayout pageTitle="Create Experience">
      <CreatedExperienceForm />
    </AdminLayout>
  );
}
