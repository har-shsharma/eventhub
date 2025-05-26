'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';


interface CustomField {
  label: string;
  value: string;
}

interface EventFormProps {
  initialData?: {
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    customFields?: CustomField[];
    ownerId: string;
    id: string | undefined;
  };
  onSave?: () => void;
}

interface CustomField {
  label: string;
  value: string;
}

interface EventData {
  id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  customFields: CustomField[];
  ownerId: string;
}


const EventForm: React.FC<EventFormProps> = ({ initialData, onSave }) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const ownerId = initialData?.ownerId || '';
  const [role, setRole] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>(initialData?.customFields || []);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const { setLoadingAnimation } = useAuth();
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);


  async function onSubmit(data: EventData) {
    try {
      const token = localStorage.getItem('token');
      if (data.ownerId) {
        const res = await fetch(`/api/events/${data.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update event');
        }
        const updatedEvent = await res.json();
        toast.success('Event updated successfully!', {
          duration: 2000,
          style: {
            background: 'black',
            color: '#fff',
          },
        });
      } else {
        const res = await fetch('/api/events/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create event');
        }

        const newEvent = await res.json();
        toast.success('Event created successfully!', {
          duration: 2000,
          style: {
            background: 'black',
            color: '#fff',
          },
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      } else {
        console.error(err);
      }
    } finally {
      setLoadingAnimation(false);
      if (onSave) onSave();
    }
  }


  const handleAddCustomField = () => {
    if (newLabel.trim() && newValue.trim()) {
      setCustomFields([...customFields, { label: newLabel, value: newValue }]);
      setNewLabel('');
      setNewValue('');
    }
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    setLoadingAnimation(true);
    e.preventDefault();
    onSubmit({ id: initialData?.id, title, description, date, location, customFields, ownerId });
    router.push('/dashboard');
  };

  return (
    <>
      {role !== 'guest' && role !== 'staff' && role !== null && role !== undefined &&
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded-[12px] shadow-lg border border-gray-200 text-gray-800">
          <div className="mb-4">
            <label className="block font-semibold mb-1" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white"
              placeholder="Event title"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white"
              placeholder="Event description"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1" htmlFor="date">Date & Time</label>
            <input
              id="date"
              type="datetime-local"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1" htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white"
              placeholder="Event location"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Custom Fields</label>
            {customFields.length === 0 && <p className="text-gray-500 mb-2">No custom fields added.</p>}
            {customFields.map((field, index) => (
              <div key={index} className="flex items-center mb-2 space-x-2">
                <span className="flex-1 text-sm">
                  <strong>{field.label}:</strong> {field.value}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomField(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 mt-2">
              <input
                type="text"
                placeholder="Label"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                className="flex-1 min-w-[100px] border border-gray-300 px-2 py-1 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Value"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                className="flex-1 min-w-[100px] border border-gray-300 px-2 py-1 rounded bg-white"
              />
              <button
                type="button"
                onClick={handleAddCustomField}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-black"
              >
                Add
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-black"
          >
            Save Event
          </button>
        </form>
      }
    </>

  );
};

export default EventForm;
