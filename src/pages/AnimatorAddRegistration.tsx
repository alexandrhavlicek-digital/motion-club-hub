import React, { useState } from 'react';
import { AnimatorLayout } from '@/components/motion/AnimatorLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Search,
  UserPlus,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';

export const AnimatorAddRegistration: React.FC = () => {
  const [bnr, setBnr] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [selectedActivities, setSelectedActivities] = useState<{[key: string]: string[]}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock BNR search
  const mockBnrData = {
    '191754321': {
      bnr: '191754321',
      hotel: 'Hotel Aurora',
      participants: [
        { id: '1', name: 'Adam N.', age: 45, type: 'Adult' },
        { id: '3', name: 'Petr S.', age: 35, type: 'Adult' },
        { id: '5', name: 'Eva N.', age: 9, type: 'Child' }
      ]
    },
    '191754322': {
      bnr: '191754322',
      hotel: 'Hotel Aurora',
      participants: [
        { id: '10', name: 'Marie K.', age: 32, type: 'Adult' },
        { id: '11', name: 'Jan K.', age: 7, type: 'Child' }
      ]
    }
  };

  // Mock activities data (no time restrictions for animator)
  const mockActivities = [
    {
      id: 1987,
      title: 'Paddleboard',
      date: '2025-01-02',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Bar na pláži',
      capacity: { max: 30, confirmed: 20, available: 10 },
      ageProfile: { min: 15, max: 99 }
    },
    {
      id: 1989,
      title: 'Kids Club',
      date: '2025-01-03',
      startTime: '09:00',
      endTime: '12:00',
      location: 'Dětský klub',
      capacity: { max: 20, confirmed: 8, available: 12 },
      ageProfile: { min: 4, max: 12 }
    },
    {
      id: 1991,
      title: 'Sunset Yoga',
      date: '2025-01-05',
      startTime: '19:30',
      endTime: '20:30',
      location: 'Terasa s výhledem na moře',
      capacity: { max: 15, confirmed: 8, available: 7 },
      ageProfile: { min: 16, max: 99 }
    },
    {
      id: 1992,
      title: 'Sunset Yoga',
      date: '2025-01-06',
      startTime: '19:30',
      endTime: '20:30',
      location: 'Terasa s výhledem na moře',
      capacity: { max: 15, confirmed: 5, available: 10 },
      ageProfile: { min: 16, max: 99 }
    },
    // Past activities - animator can register retroactively
    {
      id: 1995,
      title: 'Aqua Aerobik',
      date: '2024-12-29',
      startTime: '16:00',
      endTime: '17:00',
      location: 'Bazén',
      capacity: { max: 35, confirmed: 28, available: 7 },
      ageProfile: { min: 18, max: 99 }
    }
  ];

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
      const result = mockBnrData[bnr as keyof typeof mockBnrData];
      if (result) {
        setSearchResult(result);
        setSelectedActivities({});
        toast({
          title: "BNR nalezeno",
          description: `Nalezena rezervace pro hotel ${result.hotel}.`,
        });
      } else {
        setSearchResult(null);
        toast({
          title: "BNR nenalezeno",
          description: "Zadané BNR nebylo v systému nalezeno.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleParticipantToggle = (activityId: string, participantId: string, checked: boolean) => {
    setSelectedActivities(prev => {
      const activityParticipants = prev[activityId] || [];
      if (checked) {
        return {
          ...prev,
          [activityId]: [...activityParticipants, participantId]
        };
      } else {
        return {
          ...prev,
          [activityId]: activityParticipants.filter(id => id !== participantId)
        };
      }
    });
  };

  const isParticipantEligible = (participant: any, activity: any) => {
    return participant.age >= activity.ageProfile.min && participant.age <= activity.ageProfile.max;
  };

  const handleSubmitRegistrations = () => {
    const totalSelections = Object.values(selectedActivities).reduce((sum, participants) => sum + participants.length, 0);
    
    if (totalSelections === 0) {
      toast({
        title: "Chyba",
        description: "Prosím vyberte alespoň jednoho účastníka pro registraci.",
        variant: "destructive",
      });
      return;
    }

    // Mock registration submission
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Registrace úspěšná",
        description: `Bylo zaregistrováno ${totalSelections} účastí.`,
      });
      
      // Reset form
      setSearchResult(null);
      setSelectedActivities({});
      setBnr('');
      setIsLoading(false);
    }, 1500);
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

  return (
    <AnimatorLayout title="Přidat registraci">
      <div className="space-y-6">
        {/* BNR Search */}
        <div className="activity-card p-6">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Vyhledat rezervaci</h3>
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

        {/* Search Result */}
        {searchResult && (
          <div className="activity-card p-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 mr-2 text-green-600" />
              <h3 className="text-lg font-semibold text-foreground">
                Rezervace nalezena
              </h3>
            </div>
            
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p><strong>BNR:</strong> {searchResult.bnr}</p>
              <p><strong>Hotel:</strong> {searchResult.hotel}</p>
              <p><strong>Počet účastníků:</strong> {searchResult.participants.length}</p>
            </div>

            <h4 className="font-semibold mb-3">Účastníci:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {searchResult.participants.map((participant: any) => (
                <div key={participant.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {participant.age} let, {participant.type === 'Adult' ? 'Dospělý' : 'Dítě'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities for Registration */}
        {searchResult && (
          <div className="activity-card p-6">
            <div className="flex items-center mb-4">
              <UserPlus className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Dostupné aktivity
              </h3>
            </div>
            
            <div className="space-y-4">
              {mockActivities.map((activity) => {
                const { formatted: dateFormatted, isPast } = formatDate(activity.date);
                
                return (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-foreground">
                            {activity.title}
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
                            {activity.startTime} - {activity.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {activity.location}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Kapacita: </span>
                          <span className="font-medium">
                            {activity.capacity.confirmed}/{activity.capacity.max}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            (volných: {activity.capacity.available})
                          </span>
                          <span className="text-muted-foreground ml-4">
                            Věk: {activity.ageProfile.min}-{activity.ageProfile.max} let
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Participants selection */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Registrovat účastníky:</h5>
                      {searchResult.participants.map((participant: any) => {
                        const isEligible = isParticipantEligible(participant, activity);
                        const isSelected = selectedActivities[activity.id]?.includes(participant.id) || false;
                        
                        return (
                          <div key={participant.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${activity.id}-${participant.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => 
                                handleParticipantToggle(activity.id.toString(), participant.id, checked as boolean)
                              }
                              disabled={!isEligible || activity.capacity.available === 0}
                            />
                            <label 
                              htmlFor={`${activity.id}-${participant.id}`}
                              className={`text-sm ${isEligible ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                              {participant.name} ({participant.age} let)
                              {!isEligible && (
                                <span className="ml-2 text-red-500 text-xs">
                                  <AlertCircle className="w-3 h-3 inline mr-1" />
                                  Nevhodný věk
                                </span>
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Button 
                onClick={handleSubmitRegistrations}
                disabled={isLoading || Object.values(selectedActivities).every(arr => arr.length === 0)}
                className="w-full"
              >
                {isLoading ? 'Registruji...' : 'Potvrdit registrace'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AnimatorLayout>
  );
};