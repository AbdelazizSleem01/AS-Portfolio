"use client";
import AdminLayout from "../components/AdminLayout";
import GetAllSubscribes from "../components/Subscribe/GetAllSubscribes";

const SubscriptionsPage = () => {
  return (
    <AdminLayout pageTitle="Subscriptions Management">
      <div className="max-w-7xl mx-auto">
        <GetAllSubscribes />
      </div>
    </AdminLayout>
  );
};

export default SubscriptionsPage;