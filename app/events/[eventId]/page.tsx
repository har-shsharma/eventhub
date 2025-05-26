'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RSVPForm from '@/app/components/events/rsvpform/RSVPForm';
import { useAuth } from '@/app/context/AuthContext';
import Loader from '@/app/components/loader/Loader';

interface CustomField {
  label: string;
  value: string;
}

interface EventData {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  customFields?: CustomField[];
  ownerId: string;
}

export default function EventDetailsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const customFields = event?.customFields ?? [];
  const {user , loadingAnimation , setLoadingAnimation} = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoadingAnimation(true);
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();
        setIsOwner(data?.event?.ownerId === user?.userId);
        if (res.ok) {
          setEvent(data.event);
        }
      } catch (err) {
        console.error('Failed to fetch event details', err);
      } finally {
        setLoadingAnimation(false);
      }
    };

    fetchEvent();
  }, [eventId]);


  if(loadingAnimation) return <Loader/>
  if (!event) return <p className="p-4 text-red-500">Event not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <button
        onClick={() => router.back()}
        className="text-gray-600 underline hover:text-black mb-4 mt-12"
      > 
        ← Back to All Events
      </button>

      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>

      {event.location && <p>📍 {event.location}</p>}
      {event.description && <p>{event.description}</p>}

      {customFields?.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Additional Info:</h2>
          <ul className="list-disc pl-5">
            {event.customFields?.map((field, idx) => (
              <li key={idx}>
                <strong>{field.label}:</strong> {field.value}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-semibold mb-2">RSVP Now</h2>
        <RSVPForm eventId={event._id} isOwner={isOwner}/>
      </div>
    </div>
  );
}
