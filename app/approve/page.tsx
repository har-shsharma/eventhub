'use client';
import React, { useEffect, useState } from 'react';
import EventCard from '../components/events/eventcard/EventCard';
import Loader from '../components/loader/Loader';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/pagination/Pagination';

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
  status: 'pending' | 'approved' | 'rejected';
}

const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { user, loadingAnimation, setLoadingAnimation } = useAuth();

  const fetchPendingEvents = async () => {
    try {
      setLoadingAnimation(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/pending?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch pending events');

      const data = await res.json();
      setEvents(data.events || []);

      const totalPages = Math.ceil(data.total / data.limit);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load pending events');
    } finally {
      setLoadingAnimation(false);
    }
  };


  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchPendingEvents();
  }, [user, page]);



  const updateEventStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setLoadingAnimation(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      toast.success(`Event ${status} successfully!`, {
        duration: 2000,
        style: { background: 'black', color: 'white' },
      });

      setEvents((prev) => {
        const updatedEvents = prev.filter((event) => event._id !== id);
        if (updatedEvents.length === 0 && page > 1) {
          setPage(page - 1);
        }
        else if (updatedEvents.length === 0 && page === 1) {
          fetchPendingEvents();
        }
        return updatedEvents;
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update event status');
    } finally {
      setLoadingAnimation(false);
    }
  };


  if (user?.role !== 'admin' && user?.role !== 'staff') {
    return <p className="text-center p-6">Unauthorized: You do not have access to this page.</p>;
  }

  return (
    <>
      {loadingAnimation && <Loader />}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Pending Events for Approval</h1>

        {events.length === 0 ? (
          <p className="text-center text-gray-400 italic">No pending events at the moment.</p>
        ) : (
          <>
            <div className="grid gap-4">
              {events.map((event) => (
                <div key={event._id} className="border rounded p-4 shadow">
                  <EventCard
                    id={event._id}
                    title={event.title}
                    description={event.description || ''}
                    date={event.date}
                    location={event.location || ''}
                    customFields={event.customFields || []}
                    currentUserRole={user.role}
                    isOwner={user.userId === event.ownerId}
                    ownerId={event.ownerId}
                  />

                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => updateEventStatus(event._id, 'approved')}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-black"
                      style={{ boxShadow: '0px 4px 6px 0px #CDDAFB4D inset' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateEventStatus(event._id, 'rejected')}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-black"
                      style={{ boxShadow: '0px 4px 6px 0px #CDDAFB4D inset' }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>
    </>
  );
};

export default AdminEventsPage;
