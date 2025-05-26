'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface RSVPFormProps {
  eventId: string;
  isOwner : boolean
}

interface RSVP {
  name: string;
  email: string;
  submittedAt: string;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ eventId ,isOwner}) => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [userRole, setUserRole] = useState<string>('guest');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isPrivileged = ['admin' , 'staff'].includes(userRole);

  useEffect(() => {
    const role = localStorage.getItem('role') || 'guest';
    const storedToken = localStorage.getItem('token');
    setUserRole(role);
    if (['admin', 'owner', 'staff'].includes(role) && storedToken) {
      fetchRSVPs(eventId, storedToken);
    }
  }, [eventId]);

  const fetchRSVPs = async (eventId: string, token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rsvp/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setRsvps(data.rsvps || []);
      } else {
        setError(data.error || 'Failed to load RSVPs');
      }
    } catch (err) {
      setError('Server error while fetching RSVPs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/rsvp/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      toast.success('rsvp submitted successfully!', {
        duration: 2000,
        style: {
          background: 'black',
          color: '#fff',
        },
      });
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data: RSVP[]) => {
    const headers = ['Name', 'Email', 'Submitted At'];
    const rows = data.map(rsvp => [rsvp.name, rsvp.email, new Date(rsvp.submittedAt).toLocaleString()]);

    const csvContent = [headers, ...rows]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `event-${eventId}-rsvps.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (isPrivileged || isOwner) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between">
        <h3 className="font-semibold text-lg mb-2">RSVPs Received</h3>
        {rsvps.length > 0 && (
          <button
            onClick={() => downloadCSV(rsvps)}
            className="px-2 py-2 bg-gray-600 text-white text-sm rounded hover:bg-black"
          >
            Download CSV
          </button>
        )}
        </div>
        {loading && <p>Loading RSVPs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && rsvps.length === 0 && <p>No RSVPs yet.</p>}
        <ul className="space-y-2">
          {rsvps.map((rsvp, idx) => (
            <li key={idx} className="border-b pb-2">
              <p><strong>{rsvp.name}</strong> — {rsvp.email}</p>
              <p className="text-xs text-gray-500">
                Submitted: {new Date(rsvp.submittedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (submitted) {
    return <p className="text-green-600">Thanks for your RSVP!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      {error && <p className="mb-2 text-red-600">{error}</p>}

      <div className="mb-4">
        <label htmlFor="rsvp-name" className="block font-semibold mb-1">Name</label>
        <input
          id="rsvp-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Your name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rsvp-email" className="block font-semibold mb-1">Email</label>
        <input
          id="rsvp-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Your email"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-black disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'RSVP'}
      </button>
    </form>
  );
};

export default RSVPForm;
