'use client';

import React, { useEffect, useState } from 'react';
import EventCard from '../components/events/eventcard/EventCard';
import Loader from '../components/loader/Loader';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Pagination from '../components/pagination/Pagination';
import { ChevronDown } from 'lucide-react';

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
  status: string;
}

const MyEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' = all
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const limit = 5;

  const { setLoadingAnimation, loadingAnimation } = useAuth();

  const fetchEvents = async (page = 1, status = statusFilter) => {
    const token = localStorage.getItem('token');

    try {
      setLoadingAnimation(true);
      const res = await fetch(`/api/events/mine?page=${page}&limit=${limit}&status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setEvents(data.events || []);
      setTotalPages(Math.ceil(data.total / limit));
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoadingAnimation(false);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    if (storedRole === 'guest' || storedRole === 'staff' || !storedRole) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
      fetchEvents();
    }
  }, []);

  if (isAuthorized === null) {
    return null;
  }

  if (!isAuthorized) {
    return <p className="text-center p-6">Unauthorized: You do not have access to this page.</p>;
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete event');
      }

      toast.success('Event deleted successfully!', {
        duration: 2000,
        style: {
          background: 'black',
          color: '#fff',
        },
      });

      const updatedEvents = events.filter((event) => event._id !== id);
      const isLastItemOnPage = updatedEvents.length === 0 && currentPage > 1;

      setEvents(updatedEvents);
      if (isLastItemOnPage) {
        fetchEvents(currentPage - 1, statusFilter);
      } else if (updatedEvents.length === 0) {
        fetchEvents(currentPage, statusFilter);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <>
      {loadingAnimation && <Loader />}

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-6">My Events</h1>
          <div className="relative w-fit mb-6">
            <select
              value={statusFilter}
              onChange={(e) => {
                const value = e.target.value;
                setStatusFilter(value);
                fetchEvents(1, value);
              }}
              className="appearance-none px-3 py-2 pr-6 text-sm border border-black text-black bg-white rounded focus:outline-none focus:ring-1 focus:ring-black truncate"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronDown size={14} className="text-black" />
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-gray-400 italic">You have no events.</p>
        ) : (
          <>
            <div className="grid gap-4">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  location={event.location}
                  customFields={event.customFields}
                  currentUserRole={role as 'admin' | 'owner' | 'staff' | 'guest'}
                  isOwner={true}
                  ownerId={event.ownerId}
                  onDelete={() => handleDelete(event._id)}
                  status={event.status}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchEvents(page, statusFilter)}
            />
          </>
        )}
      </div>
    </>
  );
};

export default MyEventsPage;
