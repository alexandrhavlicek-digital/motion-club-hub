import React from 'react';
import { Header } from '@/components/motion/Header';
import { BottomNavigation } from '@/components/motion/BottomNavigation';
import { useMotionAuth } from '@/hooks/useMotionAuth';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Hotel, 
  Calendar, 
  LogOut,
  Mail,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const ProfilePage: React.FC = () => {
  const { userSession, logout } = useMotionAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Odhlášení úspěšné",
      description: "Byli jste úspěšně odhlášeni.",
    });
    navigate('/login');
  };

  const formatStayPeriod = (dateFrom: string, dateTo: string) => {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    
    return {
      from: from.toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      to: to.toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  };

  if (!userSession) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Profil" />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Nejste přihlášeni</p>
        </div>
        <BottomNavigation activeTab="profile" onTabChange={() => {}} />
      </div>
    );
  }

  const stayPeriod = formatStayPeriod(userSession.stay_period.date_from, userSession.stay_period.date_to);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profil" />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="activity-card p-6">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 mr-3 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Informace o rezervaci
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="font-medium text-foreground w-20">BNR:</span>
                <span className="text-muted-foreground">{userSession.bnr}</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium text-foreground w-16">E-mail:</span>
                <span className="text-muted-foreground">{userSession.email}</span>
              </div>
              
              <div className="flex items-center">
                <Hotel className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium text-foreground w-16">Hotel:</span>
                <span className="text-muted-foreground">{userSession.hotel.name}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium text-foreground w-16">Pobyt:</span>
                <span className="text-muted-foreground">
                  {stayPeriod.from} - {stayPeriod.to}
                </span>
              </div>
            </div>
          </div>

          {/* Participants Card */}
          <div className="activity-card p-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 mr-3 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Účastníci rezervace
              </h2>
            </div>
            
            <div className="space-y-3">
              {userSession.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center p-3 bg-muted rounded-lg"
                >
                  <User className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {participant.display_name}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({participant.age} let, {participant.type === 'Adult' ? 'Dospělý' : 'Dítě'})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/program')}
            >
              Zobrazit program aktivit
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/my-activities')}
            >
              Moje rezervace
            </Button>
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Odhlásit se
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation 
        activeTab="profile" 
        onTabChange={(tab) => {
          if (tab === 'program') {
            navigate('/program');
          } else if (tab === 'activities') {
            navigate('/my-activities');
          }
        }}
      />
    </div>
  );
};