'use client';
import React, { useEffect, useState } from 'react';
import EventCard from '../components/events/eventcard/EventCard';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/loader/Loader';
import toast from 'react-hot-toast';

interface CustomField {
  label: string;
  value: string;
}

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  customFields?: CustomField[];
  ownerId: string;
  fetchEvents : ()=> void;
}

function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user , loadingAnimation ,setLoadingAnimation} = useAuth();
   const fetchEvents = async () => {
      try {
        setLoadingAnimation(true);
        const res = await fetch('/api/events/public');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
        setLoadingAnimation(false);
      }
    };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token'); 
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete event');
      }

      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
      toast.success('Event deleted successfully!', {
          duration: 2000,
          style: {
            background: 'black',
            color: '#fff',
          },
        });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
      } else {
        console.error('An unknown error occurred:', err);
      }
    }
  };

  return (
    <>
      {loadingAnimation && <Loader/>}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Upcoming Events</h1>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event._id}
              id={event._id}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
              customFields={event.customFields}
              currentUserRole={user?.role}
              isOwner={user?.userId === event.ownerId}
              ownerId={event.ownerId}
              onDelete={() => handleDelete(event._id)}
              onUpdate={fetchEvents}
            />
          ))
        )}
      </div>
    </>
  );
}

export default Page;
