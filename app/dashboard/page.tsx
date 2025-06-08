'use client';
import React, { useEffect, useState } from 'react';
import EventCard from '../components/events/eventcard/EventCard';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/loader/Loader';
import Pagination from '../components/pagination/Pagination';
import SearchBox from '../components/search/SearchBox';
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
}

function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 5;

  const { user, loadingAnimation, setLoadingAnimation } = useAuth();

  const fetchEvents = async (page = 1, search = '') => {
    try {
      setLoadingAnimation(true);
      const res = await fetch(
        `/api/events/public?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setEvents(data.events || []);
      setTotalPages(Math.ceil(data.total / limit));
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
      setLoadingAnimation(false);
    }
  };

  useEffect(() => {
    fetchEvents(1, searchTerm);
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchEvents(1, term);
  };

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
        fetchEvents(currentPage - 1, searchTerm);
      } else if (updatedEvents.length === 0) {
        fetchEvents(currentPage, searchTerm);
      }

    } catch (err) {
      console.error('Delete error:', err);
    }
  };


  return (
    <>
      {loadingAnimation && <Loader />}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Upcoming Events</h1>

        <SearchBox onSearch={handleSearch} />

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-400 italic">No events found.</p>
        ) : (
          <>
            {events.map((event) => (
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
                onUpdate={() => fetchEvents(currentPage, searchTerm)}
              />
            ))}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchEvents(page, searchTerm)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Page;
