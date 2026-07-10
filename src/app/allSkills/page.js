import AdminLayout from "../components/AdminLayout";
import GetAllSkills from "../components/Skills/GetAllSkills";

const SkillsPage = () => {
    return (
        <AdminLayout pageTitle="All Skills">
            <GetAllSkills />
        </AdminLayout>
    );
};

export default SkillsPage;
