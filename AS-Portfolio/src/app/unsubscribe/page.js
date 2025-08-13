"use client";

import { Suspense } from "react";
import UnsubscribePageContent from "../components/UnsubscribePageContent";

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<Loading />}>
      <UnsubscribePageContent />
    </Suspense>
  );
}

// Simple loading component
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
