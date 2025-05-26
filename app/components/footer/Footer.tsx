'use client';

import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 py-4 mt-12">
      <div className="max-w-6xl mx-auto flex justify-center items-center">
        <p className="text-sm text-center">
          © {new Date().getFullYear()} EventHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
