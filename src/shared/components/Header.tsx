import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="bg-surface w-10 h-10 rounded-full flex items-center justify-center border border-default"
        >
          <i className="fas fa-arrow-right text-secondary"></i>
        </button>
      )}
      <h1 className="text-2xl font-bold text-primary flex-1">{title}</h1>
      {rightAction && rightAction}
    </div>
  );
};

export default Header;