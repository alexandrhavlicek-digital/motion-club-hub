import React from 'react';
import { Calendar, List, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'program' | 'activities' | 'profile';
  onTabChange: (tab: 'program' | 'activities' | 'profile') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'program' as const, label: 'Program', icon: Calendar },
    { id: 'activities' as const, label: 'Moje aktivity', icon: List },
    { id: 'profile' as const, label: 'Domů', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around max-w-4xl mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-3 px-4 text-xs font-medium transition-colors ${
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};