import React from 'react';
import { ArrowRightOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const UserMenu = () => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
      <a href="/login" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        Sign in
      </a>
      <a href="/register" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
        <UserPlusIcon className="w-5 h-5" />
        Create an account
      </a>
    </div>
  );
};

export default UserMenu;

