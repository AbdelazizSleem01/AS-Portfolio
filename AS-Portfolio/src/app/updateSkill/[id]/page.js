import UpdateSkillForm from "@/app/components/Skills/UpdateSkillForm";

export default async function UpdateSkillPage({ params }) {
    const { id } = await params;
    return <UpdateSkillForm id={id} />;
}
