'use client';
import React, { useState } from 'react';

interface Props {
    onSearch: (searchTerm: string) => void;
}

function SearchBox({ onSearch }: Props) {
    const [term, setTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(term.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4 justify-center">
            <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search by keyword..."
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-[500px] rounded-l-[100px] focus:ring-2 focus:ring-gray-600 focus:outline-none transition duration-200"
            />
            <button
                type="submit"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-black rounded-r-[100px]"
            >
                Search
            </button>
        </form>
    );
}

export default SearchBox;
