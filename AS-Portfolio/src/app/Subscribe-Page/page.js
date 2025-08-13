'use client'

import GetAllSubscribes from "../components/Subscribe/GetAllSubscribes"

const SubscriptionsPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Subscriptions Management</h1>
      <GetAllSubscribes />
    </div>
  )
}

export default SubscriptionsPage