import UpdateProjectForm from "@/app/components/Projects/UpdateProjectForm";


export default async function updateHeaderPage({ params }) {
  const { id } =await params;
  return (
    <div>
      <UpdateProjectForm id={id} />
    </div>
  );
}
