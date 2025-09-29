import React from 'react';
import derTourLogo from '@/assets/der-tour-logo.png';
import motionLogo from '@/assets/motion-logo-white.png';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Motion Klub", 
  showBackButton = false, 
  onBack 
}) => {
  return (
    <header className="motion-header px-4 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-2 text-primary-foreground hover:bg-primary-hover rounded-md transition-colors"
              aria-label="Zpět"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="bg-white px-2 py-1 rounded-md">
            <img src={derTourLogo} alt="DERTOUR" className="h-6" />
          </div>
          <span className="text-lg font-semibold text-white">{title}</span>
        </div>
        
        {/* Motion Logo - right side, hidden on small screens */}
        <div className="hidden sm:block">
          <img src={motionLogo} alt="Motion" className="h-8" />
        </div>
      </div>
    </header>
  );
};