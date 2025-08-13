"use client";
import { useState, useEffect } from 'react';
import FeedbackForm from './CreateFeedbackForm';
import FeedbackList from './GetAllFeedback';


export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);




  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => setFeedbacks(data));
  }, []);

  return (
    <div className="Heading container mx-auto p-4">
      <h6 className="text-3xl semiHead font-bold mb-8 text-center">What People Say</h6>
      <FeedbackForm setFeedbacks={setFeedbacks} />
      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}