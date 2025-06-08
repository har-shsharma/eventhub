'use client';

import React, { useEffect, useState } from 'react';
import EventForm from '../components/events/eventform/EventForm';

function Page() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'guest' || role === 'staff' || !role) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, []);

  if (isAuthorized === null) {
    return <p className="text-center p-6">Loading...</p>; // or your animation
  }

  if (!isAuthorized) {
    return <p className="text-center p-6">Unauthorized: You do not have access to this page.</p>;
  }

  return (
    <div className="absolute pt-24 top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
      <EventForm />
    </div>
  );
}

export default Page;
