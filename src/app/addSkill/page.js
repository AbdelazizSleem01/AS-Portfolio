import AdminLayout from "../components/AdminLayout";
import CreateSkillForm from "../components/Skills/CreateSkillsForm";

export default function addSkill() {
    return (
        <AdminLayout pageTitle="Create Skill">
            <CreateSkillForm />
        </AdminLayout>
    );
}