import AdminLayout from "../components/AdminLayout";
import AdminFeedbackList from "../components/Feedback/AdminFeedbackList";

export default function allFeedbacks() {
    return (
        <AdminLayout pageTitle="All Feedbacks">
            <AdminFeedbackList />
        </AdminLayout>
    );
}