import AdminLayout from "@/app/components/AdminLayout";
import UpdateSkillForm from "@/app/components/Skills/UpdateSkillForm";

export default async function UpdateSkillPage({ params }) {
    const { id } = await params;
    return (
        <AdminLayout pageTitle="Update Skill">
            <UpdateSkillForm id={id} />
        </AdminLayout>
    );
}
