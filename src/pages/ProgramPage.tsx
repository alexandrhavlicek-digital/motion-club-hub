import React, { useState, useEffect } from 'react';
import { Header } from '@/components/motion/Header';
import { BottomNavigation } from '@/components/motion/BottomNavigation';
import { ActivityCard } from '@/components/motion/ActivityCard';
import { BookingModal } from '@/components/motion/BookingModal';
import { useMotionAuth } from '@/hooks/useMotionAuth';
import { motionApi } from '@/services/motionApi';
import { Activity, ActivityEvent, Participant } from '@/types/motion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const ProgramPage: React.FC = () => {
  const { userSession } = useMotionAuth();
  const { toast } = useToast();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<(ActivityEvent & { title: string; location: { label: string }}) | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (userSession) {
      loadProgram();
    }
  }, [userSession]);

  const loadProgram = async () => {
    if (!userSession) return;
    
    setLoading(true);
    try {
      const response = await motionApi.getProgram(
        userSession.stay_period.date_from,
        userSession.stay_period.date_to,
        userSession.hotel.hotel_id
      );
      setActivities(response.activities);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst program aktivit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookActivity = (eventId: number) => {
    // Find the event and activity
    let foundEvent: (ActivityEvent & { title: string; location: { label: string }}) | null = null;
    
    for (const activity of activities) {
      const event = activity.events.find(e => e.event_id === eventId);
      if (event) {
        foundEvent = {
          ...event,
          title: activity.title,
          location: activity.location
        };
        break;
      }
    }

    if (foundEvent) {
      setSelectedEvent(foundEvent);
      setIsBookingModalOpen(true);
    }
  };

  const handleConfirmBooking = async (selectedParticipants: Participant[]) => {
    if (!selectedEvent || !userSession) return;

    setIsBooking(true);
    try {
      await motionApi.bookActivity({
        BNR: userSession.bnr,
        event_id: selectedEvent.event_id,
        participants: selectedParticipants
      });

      toast({
        title: "Rezervace úspěšná!",
        description: `Aktivita ${selectedEvent.title} byla rezervována pro ${selectedParticipants.length} osob.`,
        variant: "default",
      });

      // Reload program to update capacities
      await loadProgram();
      setIsBookingModalOpen(false);
    } catch (error) {
      toast({
        title: "Chyba rezervace",
        description: "Rezervaci se nepodařilo dokončit. Zkuste to znovu.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Filter activities based on search and category
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(activities.map(a => a.category)));

  const formatDateRange = () => {
    if (!userSession) return '';
    const from = new Date(userSession.stay_period.date_from).toLocaleDateString('cs-CZ');
    const to = new Date(userSession.stay_period.date_to).toLocaleDateString('cs-CZ');
    return `${from} - ${to}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Program aktivit" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Načítám program...</p>
          </div>
        </div>
        <BottomNavigation activeTab="program" onTabChange={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Program aktivit" />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stay period info */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center text-primary">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="font-semibold">Váš pobyt: {formatDateRange()}</span>
          </div>
          <p className="text-sm text-primary/80 mt-1">
            {userSession?.hotel.name} • Zobrazují se pouze aktivity ve vašem období
          </p>
        </div>

        {/* Search and filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Hledat aktivity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                Vše
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Activities list */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm || selectedCategory ? 'Žádné aktivity nenalezeny' : 'Žádné aktivity'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory 
                ? 'Zkuste změnit vyhledávací kritéria'
                : 'Pro vaše období pobytu nejsou k dispozici žádné aktivity.'
              }
            </p>
            {(searchTerm || selectedCategory) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="mt-4"
              >
                Zrušit filtry
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map(activity => (
              <ActivityCard
                key={activity.activity_id}
                activity={activity}
                onBook={handleBookActivity}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNavigation 
        activeTab="program" 
        onTabChange={(tab) => {
          if (tab === 'activities') {
            window.location.href = '/my-activities';
          } else if (tab === 'profile') {
            window.location.href = '/profile';
          }
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        event={selectedEvent}
        participants={userSession?.participants || []}
        onConfirm={handleConfirmBooking}
        isLoading={isBooking}
      />
    </div>
  );
};