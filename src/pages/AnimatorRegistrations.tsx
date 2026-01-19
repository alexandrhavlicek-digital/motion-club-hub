import React, { useState } from 'react';
import { AnimatorLayout } from '@/components/motion/AnimatorLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  Download,
  Search,
  Building,
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Registration {
  id: number;
  bookingId: number;
  bnr: string;
  participant: { name: string; age: number; type: string };
  activity: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  hotel: string;
}

export const AnimatorRegistrations: React.FC = () => {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState('2025-01-02');
  const [dateTo, setDateTo] = useState('2025-01-06');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedHotels, setExpandedHotels] = useState<string[]>([]);
  const [expandedActivities, setExpandedActivities] = useState<string[]>([]);

  // Mock registration data with hotel
  const registrations: Registration[] = [
    {
      id: 1,
      bookingId: 555001,
      bnr: '191754321',
      participant: { name: 'Adam N.', age: 45, type: 'Adult' },
      activity: 'Paddleboard',
      eventDate: '2025-01-02',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Bar na pláži',
      status: 'confirmed',
      hotel: 'Hotel Margarita'
    },
    {
      id: 2,
      bookingId: 555010,
      bnr: '191754321',
      participant: { name: 'Eva N.', age: 9, type: 'Child' },
      activity: 'Kids Club',
      eventDate: '2025-01-03',
      startTime: '09:00',
      endTime: '12:00',
      location: 'Dětský klub',
      status: 'confirmed',
      hotel: 'Hotel Margarita'
    },
    {
      id: 3,
      bookingId: 555011,
      bnr: '191754321',
      participant: { name: 'Adam N.', age: 45, type: 'Adult' },
      activity: 'Sunset Yoga',
      eventDate: '2025-01-05',
      startTime: '19:30',
      endTime: '20:30',
      location: 'Terasa s výhledem na moře',
      status: 'confirmed',
      hotel: 'Hotel Margarita'
    },
    {
      id: 4,
      bookingId: 555012,
      bnr: '191754322',
      participant: { name: 'Petr S.', age: 35, type: 'Adult' },
      activity: 'Paddleboard',
      eventDate: '2025-01-02',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Bar na pláži',
      status: 'confirmed',
      hotel: 'Hotel Sunset Beach'
    },
    {
      id: 5,
      bookingId: 555018,
      bnr: '191754323',
      participant: { name: 'Eva N.', age: 9, type: 'Child' },
      activity: 'Paddleboard',
      eventDate: '2025-01-02',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Bar na pláži',
      status: 'confirmed',
      hotel: 'Hotel Sunset Beach'
    },
    {
      id: 6,
      bookingId: 555013,
      bnr: '191754324',
      participant: { name: 'Jana K.', age: 28, type: 'Adult' },
      activity: 'Sunset Yoga',
      eventDate: '2025-01-06',
      startTime: '19:30',
      endTime: '20:30',
      location: 'Terasa s výhledem na moře',
      status: 'confirmed',
      hotel: 'Hotel Margarita'
    },
    {
      id: 7,
      bookingId: 555014,
      bnr: '191754325',
      participant: { name: 'Martin D.', age: 42, type: 'Adult' },
      activity: 'Aqua Aerobik',
      eventDate: '2025-01-04',
      startTime: '11:00',
      endTime: '12:00',
      location: 'Hotelový bazén',
      status: 'confirmed',
      hotel: 'Hotel Paradise'
    }
  ];

  const activities = [
    { value: 'all', label: 'Všechny aktivity' },
    { value: 'Paddleboard', label: 'Paddleboard' },
    { value: 'Kids Club', label: 'Kids Club' },
    { value: 'Sunset Yoga', label: 'Sunset Yoga' },
    { value: 'Aqua Aerobik', label: 'Aqua Aerobik' }
  ];

  // Quick date filter helpers
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateFrom(today);
    setDateTo(today);
  };

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setDateFrom(tomorrowStr);
    setDateTo(tomorrowStr);
  };

  const setThisWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    setDateFrom(monday.toISOString().split('T')[0]);
    setDateTo(sunday.toISOString().split('T')[0]);
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    const matchesActivity = selectedActivity === 'all' || reg.activity === selectedActivity;
    const matchesSearch = searchTerm === '' || 
      reg.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.bnr.includes(searchTerm) ||
      reg.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.hotel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const regDate = new Date(reg.eventDate);
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const matchesDate = regDate >= fromDate && regDate <= toDate;

    return matchesActivity && matchesSearch && matchesDate;
  });

  // Group registrations by hotel, then by activity
  const groupedRegistrations = filteredRegistrations.reduce((acc, reg) => {
    if (!acc[reg.hotel]) {
      acc[reg.hotel] = {};
    }
    const activityKey = `${reg.activity} - ${reg.eventDate} ${reg.startTime}`;
    if (!acc[reg.hotel][activityKey]) {
      acc[reg.hotel][activityKey] = {
        activity: reg.activity,
        eventDate: reg.eventDate,
        startTime: reg.startTime,
        endTime: reg.endTime,
        location: reg.location,
        participants: []
      };
    }
    acc[reg.hotel][activityKey].participants.push(reg);
    return acc;
  }, {} as Record<string, Record<string, { activity: string; eventDate: string; startTime: string; endTime: string; location: string; participants: Registration[] }>>);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const handleExportCSV = () => {
    const csvData = filteredRegistrations.map(reg => 
      `${reg.bookingId},${reg.bnr},${reg.participant.name},${reg.participant.age},${reg.participant.type},${reg.activity},${reg.eventDate},${reg.startTime}-${reg.endTime},${reg.location},${reg.hotel}`
    );
    
    console.log('CSV Export:', csvData);
  };

  const handleRemoveRegistration = (registration: Registration) => {
    toast({
      title: "Registrace odebrána",
      description: `${registration.participant.name} byl/a odebrán/a z aktivity ${registration.activity}.`,
    });
  };

  const toggleHotel = (hotel: string) => {
    setExpandedHotels(prev => 
      prev.includes(hotel) 
        ? prev.filter(h => h !== hotel)
        : [...prev, hotel]
    );
  };

  const toggleActivity = (activityKey: string) => {
    setExpandedActivities(prev => 
      prev.includes(activityKey) 
        ? prev.filter(a => a !== activityKey)
        : [...prev, activityKey]
    );
  };

  // Expand all by default
  React.useEffect(() => {
    setExpandedHotels(Object.keys(groupedRegistrations));
    setExpandedActivities(
      Object.entries(groupedRegistrations).flatMap(([hotel, activities]) => 
        Object.keys(activities).map(actKey => `${hotel}-${actKey}`)
      )
    );
  }, [filteredRegistrations.length]);

  return (
    <AnimatorLayout title="Přehled registrací">
      <div className="space-y-6">
        {/* Filters */}
        <div className="activity-card p-6">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Filtry</h3>
          </div>
          
          {/* Quick date filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={setToday}
              className="text-sm"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Dnes
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={setTomorrow}
              className="text-sm"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Zítra
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={setThisWeek}
              className="text-sm"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Tento týden
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFrom">Datum od</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="dateTo">Datum do</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Aktivita</Label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activities.map(activity => (
                    <SelectItem key={activity.value} value={activity.value}>
                      {activity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="search">Vyhledat</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Jméno, BNR, aktivita, hotel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Registrace ({filteredRegistrations.length})
            </h3>
            <p className="text-sm text-muted-foreground">
              Zobrazeno {filteredRegistrations.length} z {registrations.length} registrací
            </p>
          </div>
          
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Grouped Registrations */}
        <div className="space-y-4">
          {Object.entries(groupedRegistrations).map(([hotel, activities]) => (
            <Collapsible
              key={hotel}
              open={expandedHotels.includes(hotel)}
              onOpenChange={() => toggleHotel(hotel)}
            >
              <div className="activity-card overflow-hidden">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-3 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">{hotel}</h4>
                    <span className="ml-3 text-sm text-muted-foreground">
                      ({Object.values(activities).reduce((sum, act) => sum + act.participants.length, 0)} účastníků)
                    </span>
                  </div>
                  {expandedHotels.includes(hotel) ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="p-4 space-y-3">
                    {Object.entries(activities).map(([activityKey, activityData]) => {
                      const fullKey = `${hotel}-${activityKey}`;
                      return (
                        <Collapsible
                          key={activityKey}
                          open={expandedActivities.includes(fullKey)}
                          onOpenChange={() => toggleActivity(fullKey)}
                        >
                          <div className="border border-border rounded-lg overflow-hidden">
                            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center flex-wrap gap-2">
                                <span className="font-medium text-foreground">{activityData.activity}</span>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">{formatDate(activityData.eventDate)}</span>
                                <span className="text-sm text-muted-foreground">•</span>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {activityData.startTime} - {activityData.endTime}
                                </div>
                                <span className="text-sm text-muted-foreground">•</span>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {activityData.location}
                                </div>
                                <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                                  {activityData.participants.length} účastníků
                                </span>
                              </div>
                              {expandedActivities.includes(fullKey) ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              )}
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <div className="divide-y divide-border">
                                {activityData.participants.map((participant) => (
                                  <div 
                                    key={participant.id}
                                    className="p-3 flex items-center justify-between bg-background hover:bg-muted/20 transition-colors"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <div>
                                          <p className="font-medium text-foreground">{participant.participant.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {participant.participant.age} let • {participant.participant.type === 'Adult' ? 'Dospělý' : 'Dítě'}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="hidden sm:block text-sm">
                                        <p className="text-muted-foreground">BNR: {participant.bnr}</p>
                                        <p className="text-muted-foreground text-xs">ID: {participant.bookingId}</p>
                                      </div>
                                      <span className="hidden md:inline-flex bg-green-100 text-green-800 px-2 py-0.5 rounded-md text-xs font-medium">
                                        {participant.status === 'confirmed' ? 'Potvrzeno' : participant.status}
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveRegistration(participant)}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      <span className="hidden sm:inline">Odebrat</span>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
          
          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Žádné registrace
              </h3>
              <p className="text-muted-foreground">
                Pro zadané filtry nebyly nalezeny žádné registrace.
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatorLayout>
  );
};
