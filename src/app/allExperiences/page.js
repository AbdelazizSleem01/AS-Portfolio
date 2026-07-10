import AdminLayout from "../components/AdminLayout";
import GetAllExperiences from "../components/Experience/GetAllExperiences";

export default function AllExperiencesPage() {
  return (
    <AdminLayout pageTitle="All Experiences">
      <GetAllExperiences />
    </AdminLayout>
  );
}
