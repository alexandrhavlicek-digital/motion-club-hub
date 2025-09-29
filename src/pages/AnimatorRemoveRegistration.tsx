import React, { useState } from 'react';
import { AnimatorLayout } from '@/components/motion/AnimatorLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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
import { 
  Search,
  UserMinus,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  Trash2
} from 'lucide-react';

export const AnimatorRemoveRegistration: React.FC = () => {
  const [bnr, setBnr] = useState('');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const { toast } = useToast();

  // Mock registrations data
  const mockRegistrations: { [key: string]: any[] } = {
    '191754321': [
      {
        id: 555001,
        eventId: 1987,
        participant: { id: '1', name: 'Adam N.', age: 45, type: 'Adult' },
        activity: 'Paddleboard',
        date: '2025-01-02',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Bar na pláži',
        status: 'confirmed'
      },
      {
        id: 555010,
        eventId: 1989,
        participant: { id: '5', name: 'Eva N.', age: 9, type: 'Child' },
        activity: 'Kids Club',
        date: '2025-01-03',
        startTime: '09:00',
        endTime: '12:00',
        location: 'Dětský klub',
        status: 'confirmed'
      },
      {
        id: 555011,
        eventId: 1991,
        participant: { id: '1', name: 'Adam N.', age: 45, type: 'Adult' },
        activity: 'Sunset Yoga',
        date: '2025-01-05',
        startTime: '19:30',
        endTime: '20:30',
        location: 'Terasa s výhledem na moře',
        status: 'confirmed'
      },
      {
        id: 555012,
        eventId: 1987,
        participant: { id: '3', name: 'Petr S.', age: 35, type: 'Adult' },
        activity: 'Paddleboard',
        date: '2025-01-02',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Bar na pláži',
        status: 'confirmed'
      },
      // Past registrations - animator can cancel these too
      {
        id: 555014,
        eventId: 1995,
        participant: { id: '3', name: 'Petr S.', age: 35, type: 'Adult' },
        activity: 'Aqua Aerobik',
        date: '2024-12-29',
        startTime: '16:00',
        endTime: '17:00',
        location: 'Bazén',
        status: 'confirmed'
      }
    ],
    '191754322': [
      {
        id: 555020,
        eventId: 1991,
        participant: { id: '10', name: 'Marie K.', age: 32, type: 'Adult' },
        activity: 'Sunset Yoga',
        date: '2025-01-05',
        startTime: '19:30',
        endTime: '20:30',
        location: 'Terasa s výhledem na moře',
        status: 'confirmed'
      }
    ]
  };

  const handleSearchBnr = () => {
    if (!bnr) {
      toast({
        title: "Chyba",
        description: "Prosím zadejte BNR.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const result = mockRegistrations[bnr];
      if (result && result.length > 0) {
        setRegistrations(result);
        toast({
          title: "Registrace nalezeny",
          description: `Nalezeno ${result.length} registrací pro BNR ${bnr}.`,
        });
      } else {
        setRegistrations([]);
        toast({
          title: "Žádné registrace",
          description: "Pro zadané BNR nebyly nalezeny žádné registrace.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelRegistration = (registration: any) => {
    setSelectedRegistration(registration);
    setCancelDialogOpen(true);
  };

  const confirmCancellation = () => {
    if (!selectedRegistration) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Remove from local state
      setRegistrations(prev => 
        prev.filter(reg => reg.id !== selectedRegistration.id)
      );
      
      toast({
        title: "Registrace zrušena",
        description: `Účast ${selectedRegistration.participant.name} na aktivitě ${selectedRegistration.activity} byla zrušena.`,
      });
      
      setCancelDialogOpen(false);
      setSelectedRegistration(null);
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const isPast = date < new Date();
    const formatted = date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return { formatted, isPast };
  };

  const groupedRegistrations = registrations.reduce((groups, reg) => {
    const key = `${reg.activity}-${reg.date}-${reg.startTime}`;
    if (!groups[key]) {
      groups[key] = {
        activity: reg.activity,
        date: reg.date,
        startTime: reg.startTime,
        endTime: reg.endTime,
        location: reg.location,
        participants: []
      };
    }
    groups[key].participants.push(reg);
    return groups;
  }, {} as any);

  return (
    <AnimatorLayout title="Zrušit registraci">
      <div className="space-y-6">
        {/* BNR Search */}
        <div className="activity-card p-6">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Vyhledat registrace</h3>
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="bnr">BNR (číslo rezervace)</Label>
              <Input
                id="bnr"
                value={bnr}
                onChange={(e) => setBnr(e.target.value)}
                placeholder="191754321"
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleSearchBnr} disabled={isLoading}>
              {isLoading ? 'Hledám...' : 'Vyhledat'}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Demo BNR: 191754321 nebo 191754322</p>
          </div>
        </div>

        {/* Search Results */}
        {registrations.length > 0 && (
          <div className="activity-card p-6">
            <div className="flex items-center mb-4">
              <UserMinus className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Nalezené registrace ({registrations.length})
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.values(groupedRegistrations).map((group: any, index) => {
                const { formatted: dateFormatted, isPast } = formatDate(group.date);
                
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-foreground">
                            {group.activity}
                          </h4>
                          {isPast && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs">
                              Proběhlá aktivita
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {dateFormatted}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {group.startTime} - {group.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {group.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Registered Participants */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Registrovaní účastníci:</h5>
                      {group.participants.map((registration: any) => (
                        <div key={registration.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-muted-foreground" />
                            <div>
                              <span className="font-medium">
                                {registration.participant.name}
                              </span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({registration.participant.age} let, {registration.participant.type === 'Adult' ? 'Dospělý' : 'Dítě'})
                              </span>
                              <span className="text-xs text-muted-foreground ml-2 block">
                                ID: {registration.id}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelRegistration(registration)}
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Zrušit
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

        {/* No results message */}
        {bnr && registrations.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Žádné registrace
            </h3>
            <p className="text-muted-foreground">
              Pro BNR {bnr} nebyly nalezeny žádné aktivní registrace.
            </p>
          </div>
        )}

        {/* Cancellation Confirmation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-destructive" />
                Zrušení registrace
              </AlertDialogTitle>
              <AlertDialogDescription>
                Opravdu chcete zrušit registraci účastníka{' '}
                <strong>{selectedRegistration?.participant.name}</strong> na aktivitě{' '}
                <strong>{selectedRegistration?.activity}</strong>?
                <br />
                <br />
                <span className="text-sm">
                  Datum: {selectedRegistration && formatDate(selectedRegistration.date).formatted}
                  <br />
                  Čas: {selectedRegistration?.startTime} - {selectedRegistration?.endTime}
                  <br />
                  ID registrace: {selectedRegistration?.id}
                </span>
                <br />
                <br />
                Tuto akci nelze vrátit zpět.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>
                Zrušit
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmCancellation}
                disabled={isLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLoading ? 'Ruším...' : 'Potvrdit zrušení'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AnimatorLayout>
  );
};