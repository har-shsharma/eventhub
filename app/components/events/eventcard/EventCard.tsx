'use client';

import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import EventForm from '../eventform/EventForm'; 
import { useRouter } from 'next/navigation';

interface CustomField {
  label: string;
  value: string;
}

interface EventCardProps {
  id?: string;
  title: string;
  description?: string;
  date: string | Date;
  location?: string;
  customFields?: CustomField[];
  currentUserRole?: 'admin' | 'owner' | 'staff' | 'guest' ;
  isOwner?: boolean;
  ownerId: string
  onDelete?: () => void;
  onUpdate?: () => void; 
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  customFields = [],
  currentUserRole = 'guest',
  isOwner = false,
  onDelete,
  onUpdate,
  ownerId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const eventDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const canEdit = currentUserRole === 'admin' || isOwner  || 'staff';
  const canDelete = currentUserRole === 'admin' || isOwner;

  if (isEditing) {
    return (
      <div className="event-card border rounded-md p-4 shadow-md bg-white relative">
        <button
          onClick={() => setIsEditing(false)}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-800"
        >
          Cancel
        </button>
        <EventForm
          initialData={{
            title,
            description,
            date: typeof date === 'string' ? date : new Date(date).toISOString().slice(0, 16),
            location,
            customFields,
            ownerId,
            id
          }}
          onSave={() => {setIsEditing(false); if (onUpdate) onUpdate();}}
        />
      </div>
    );
  }

  const handleCardClick = () => {
  if (!isEditing && id) {
    router.push(`/events/${id}`);
  }
};

  return (
    <div className="event-card border rounded-md p-4 shadow-md bg-white relative hover:bg-gray-100 cursor-pointer"  onClick={handleCardClick}>
      {canEdit && (
        <div className="absolute top-4 right-4 flex space-x-4">
          <button onClick={(e) => {setIsEditing(true); e.stopPropagation(); }} className="text-gray-600 hover:text-black">
            <Pencil size={18} />
          </button>
          {canDelete && (
            <button onClick={(e)=>{e.stopPropagation(); onDelete?.() }} className="text-gray-600 hover:text-black">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">{eventDate}</p>
      {location && <p className="text-gray-700 mb-2">📍 {location}</p>}
      {description && <p className="mb-2">{description}</p>}

      {customFields.length > 0 && (
        <div className="custom-fields mt-2">
          {customFields.map((field, idx) => (
            <p key={idx} className="text-sm">
              <strong>{field.label}:</strong> {field.value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCard;
