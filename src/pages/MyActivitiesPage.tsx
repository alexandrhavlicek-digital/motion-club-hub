import React, { useState, useEffect } from 'react';
import { Header } from '@/components/motion/Header';
import { BottomNavigation } from '@/components/motion/BottomNavigation';
import { useMotionAuth } from '@/hooks/useMotionAuth';
import { motionApi } from '@/services/motionApi';
import { BookedActivity, Booking } from '@/types/motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  AlertCircle 
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const MyActivitiesPage: React.FC = () => {
  const { userSession } = useMotionAuth();
  const { toast } = useToast();
  
  const [bookedActivities, setBookedActivities] = useState<BookedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cancellation state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<{
    booking: Booking;
    eventId: number;
    activityTitle: string;
  } | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (userSession) {
      loadMyActivities();
    }
  }, [userSession]);

  const loadMyActivities = async () => {
    if (!userSession) return;
    
    setLoading(true);
    try {
      const response = await motionApi.getUserBookings(userSession.bnr);
      setBookedActivities(response.activities);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst vaše aktivity.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('cs-CZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
      time: date.toLocaleTimeString('cs-CZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const handleCancelBooking = (booking: Booking, eventId: number, activityTitle: string) => {
    setBookingToCancel({ booking, eventId, activityTitle });
    setCancelDialogOpen(true);
  };

  const confirmCancellation = async () => {
    if (!bookingToCancel || !userSession) return;

    setIsCancelling(true);
    try {
      await motionApi.cancelBooking(
        bookingToCancel.booking.booking_id,
        userSession.bnr,
        bookingToCancel.eventId,
        bookingToCancel.booking.participant
      );

      toast({
        title: "Zrušení úspěšné",
        description: `Účast na aktivitě ${bookingToCancel.activityTitle} byla zrušena.`,
      });

      // Reload activities
      await loadMyActivities();
    } catch (error) {
      toast({
        title: "Chyba zrušení",
        description: "Nepodařilo se zrušit účast. Zkuste to znovu.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const isActivityInPast = (dateTime: string) => {
    return new Date(dateTime) < new Date();
  };

  // Separate future and past activities
  const futureActivities = bookedActivities.filter(activity => 
    !isActivityInPast(activity.start_at)
  );
  const pastActivities = bookedActivities.filter(activity => 
    isActivityInPast(activity.start_at)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Moje aktivity" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Načítám vaše aktivity...</p>
          </div>
        </div>
        <BottomNavigation activeTab="activities" onTabChange={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Moje aktivity" />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {bookedActivities.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Žádné rezervace
            </h3>
            <p className="text-muted-foreground mb-6">
              Zatím nemáte rezervovány žádné aktivity.
            </p>
            <Button onClick={() => window.location.href = '/program'}>
              Prohlédnout program
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Future Activities */}
            {futureActivities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Nadcházející aktivity
                </h2>
                <div className="space-y-4">
                  {futureActivities.map(activity => {
                    const { date, time: startTime } = formatDateTime(activity.start_at);
                    const { time: endTime } = formatDateTime(activity.end_at);

                    return (
                      <div key={activity.event_id} className="activity-card p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {activity.title}
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {startTime} - {endTime}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {activity.location.label}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Účastníci:</h4>
                          {activity.bookings.map(booking => (
                            <div
                              key={booking.booking_id}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">
                                  {booking.participant.display_name}
                                </span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({booking.participant.age} let)
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking, activity.event_id, activity.title)}
                                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                Zrušit účast
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Activities */}
            {pastActivities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Proběhlé aktivity
                </h2>
                <div className="space-y-4">
                  {pastActivities.map(activity => {
                    const { date, time: startTime } = formatDateTime(activity.start_at);
                    const { time: endTime } = formatDateTime(activity.end_at);

                    return (
                      <div key={activity.event_id} className="activity-card p-4 opacity-75">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {activity.title}
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {startTime} - {endTime}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {activity.location.label}
                              </div>
                            </div>
                          </div>
                          <span className="bg-muted text-muted-foreground px-2 py-1 text-xs rounded-md">
                            Proběhlo
                          </span>
                        </div>

                        {/* Participants */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Účastníci:</h4>
                          {activity.bookings.map(booking => (
                            <div
                              key={booking.booking_id}
                              className="flex items-center p-3 bg-muted rounded-lg"
                            >
                              <User className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span className="font-medium">
                                {booking.participant.display_name}
                              </span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({booking.participant.age} let)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavigation 
        activeTab="activities" 
        onTabChange={(tab) => {
          if (tab === 'program') {
            window.location.href = '/program';
          } else if (tab === 'profile') {
            window.location.href = '/profile';
          }
        }} 
      />

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-destructive" />
              Zrušení účasti
            </AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete zrušit účast účastníka{' '}
              <strong>{bookingToCancel?.booking.participant.display_name}</strong> na aktivitě{' '}
              <strong>{bookingToCancel?.activityTitle}</strong>?
              <br />
              <br />
              Tuto akci nelze vrátit zpět.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancellation}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ruším...
                </>
              ) : (
                'Potvrdit zrušení'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};