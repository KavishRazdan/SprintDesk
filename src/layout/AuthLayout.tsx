import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020B09] text-white flex items-center justify-center relative overflow-hidden">
      <main className="w-full relative z-10 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};
