'use client';

import React, { useEffect, useState } from 'react';
import EventCard from '../components/events/eventcard/EventCard';
import Loader from '../components/loader/Loader';
import { useAuth } from '../context/AuthContext';

interface CustomField {
  label: string;
  value: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  customFields: CustomField[];
  ownerId: string;
}

const MyEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const {setLoadingAnimation , loadingAnimation} = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      setRole(userRole);

      try {
        setLoadingAnimation(true);
        const res = await fetch('/api/events/mine', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }finally{
        setLoadingAnimation(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      {loadingAnimation && <Loader />}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Events</h1>
        {events.length === 0 ? (
          <p className="text-gray-500">You have no events.</p>
        ) : (
          <div className="grid gap-4">
            {events.map(event => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                customFields={event.customFields}
                currentUserRole={role as any}
                isOwner={true}
                ownerId={event.ownerId}
                onDelete={() => {
                  setEvents(prev => prev.filter(e => e._id !== event._id));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyEventsPage;
