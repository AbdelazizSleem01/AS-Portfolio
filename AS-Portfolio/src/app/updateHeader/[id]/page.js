import UpdateHeaderForm from "@/app/components/Headers/UpdateHeaderForm";


export default async function updateHeaderPage({ params }) {
  const { id } =await params;
  return (
    <div>
      <UpdateHeaderForm id={id} />
    </div>
  );
}
