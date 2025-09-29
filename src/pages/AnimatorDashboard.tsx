import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatorLayout } from '@/components/motion/AnimatorLayout';
import { 
  Users, 
  Calendar, 
  UserPlus, 
  UserMinus,
  BarChart3,
  Clock
} from 'lucide-react';

export const AnimatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock statistics
  const stats = [
    {
      title: 'Celkem registrací',
      value: '156',
      icon: Users,
      change: '+12%',
      color: 'text-blue-600'
    },
    {
      title: 'Aktivní aktivity',
      value: '8',
      icon: Calendar,
      change: '+2',
      color: 'text-green-600'
    },
    {
      title: 'Dnešní registrace',
      value: '24',
      icon: UserPlus,
      change: '+8',
      color: 'text-purple-600'
    },
    {
      title: 'Zrušené dnes',
      value: '3',
      icon: UserMinus,
      change: '-2',
      color: 'text-red-600'
    }
  ];

  const recentActivities = [
    {
      activity: 'Paddleboard',
      participant: 'Adam N.',
      action: 'Registrace',
      time: '10:30',
      type: 'add'
    },
    {
      activity: 'Kids Club',
      participant: 'Eva N.',
      action: 'Registrace',
      time: '10:15',
      type: 'add'
    },
    {
      activity: 'Sunset Yoga',
      participant: 'Marie K.',
      action: 'Zrušení',
      time: '09:45',
      type: 'remove'
    },
    {
      activity: 'Aqua Aerobik',
      participant: 'Petr S.',
      action: 'Registrace',
      time: '09:20',
      type: 'add'
    }
  ];

  return (
    <AnimatorLayout title="Dashboard">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="activity-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="activity-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Rychlé akce
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="flex items-center p-4 border rounded-lg hover:bg-muted cursor-pointer"
              onClick={() => navigate('/animator/registrations')}
            >
              <BarChart3 className="w-6 h-6 text-primary mr-3" />
              <div>
                <p className="font-medium">Přehled registrací</p>
                <p className="text-sm text-muted-foreground">Zobrazit všechny registrace</p>
              </div>
            </div>
            <div 
              className="flex items-center p-4 border rounded-lg hover:bg-muted cursor-pointer"
              onClick={() => navigate('/animator/add')}
            >
              <UserPlus className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium">Přidat registraci</p>
                <p className="text-sm text-muted-foreground">Manuální registrace účastníka</p>
              </div>
            </div>
            <div 
              className="flex items-center p-4 border rounded-lg hover:bg-muted cursor-pointer"
              onClick={() => navigate('/animator/remove')}
            >
              <UserMinus className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <p className="font-medium">Zrušit registraci</p>
                <p className="text-sm text-muted-foreground">Manuální zrušení účastníka</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Poslední aktivity
            </h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'add' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">
                      {activity.participant} - {activity.activity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="activity-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Dnešní program
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-l-4 border-l-primary bg-muted rounded-r-lg">
              <div>
                <p className="font-medium">Paddleboard</p>
                <p className="text-sm text-muted-foreground">10:00 - 12:00 • Bar na pláži</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">24/30</p>
                <p className="text-xs text-muted-foreground">registrací</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border-l-4 border-l-green-500 bg-muted rounded-r-lg">
              <div>
                <p className="font-medium">Kids Club</p>
                <p className="text-sm text-muted-foreground">15:00 - 18:00 • Dětský klub</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">15/20</p>
                <p className="text-xs text-muted-foreground">registrací</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border-l-4 border-l-purple-500 bg-muted rounded-r-lg">
              <div>
                <p className="font-medium">Sunset Yoga</p>
                <p className="text-sm text-muted-foreground">19:30 - 20:30 • Terasa</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">10/15</p>
                <p className="text-xs text-muted-foreground">registrací</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatorLayout>
  );
};