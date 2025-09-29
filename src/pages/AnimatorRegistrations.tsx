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
  Search
} from 'lucide-react';

export const AnimatorRegistrations: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2025-01-02');
  const [dateTo, setDateTo] = useState('2025-01-06');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock registration data
  const registrations = [
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
      status: 'confirmed'
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
      status: 'confirmed'
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
      status: 'confirmed'
    },
    {
      id: 4,
      bookingId: 555012,
      bnr: '191754321',
      participant: { name: 'Petr S.', age: 35, type: 'Adult' },
      activity: 'Paddleboard',
      eventDate: '2025-01-02',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Bar na pláži',
      status: 'confirmed'
    },
    {
      id: 5,
      bookingId: 555018,
      bnr: '191754321',
      participant: { name: 'Eva N.', age: 9, type: 'Child' },
      activity: 'Paddleboard',
      eventDate: '2025-01-02',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Bar na pláži',
      status: 'confirmed'
    },
    {
      id: 6,
      bookingId: 555013,
      bnr: '191754321',
      participant: { name: 'Adam N.', age: 45, type: 'Adult' },
      activity: 'Sunset Yoga',
      eventDate: '2025-01-06',
      startTime: '19:30',
      endTime: '20:30',
      location: 'Terasa s výhledem na moře',
      status: 'confirmed'
    }
  ];

  const activities = [
    { value: 'all', label: 'Všechny aktivity' },
    { value: 'Paddleboard', label: 'Paddleboard' },
    { value: 'Kids Club', label: 'Kids Club' },
    { value: 'Sunset Yoga', label: 'Sunset Yoga' },
    { value: 'Aqua Aerobik', label: 'Aqua Aerobik' }
  ];

  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    const matchesActivity = selectedActivity === 'all' || reg.activity === selectedActivity;
    const matchesSearch = searchTerm === '' || 
      reg.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.bnr.includes(searchTerm) ||
      reg.activity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const regDate = new Date(reg.eventDate);
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const matchesDate = regDate >= fromDate && regDate <= toDate;

    return matchesActivity && matchesSearch && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const handleExportCSV = () => {
    // Mock CSV export
    const csvData = filteredRegistrations.map(reg => 
      `${reg.bookingId},${reg.bnr},${reg.participant.name},${reg.participant.age},${reg.participant.type},${reg.activity},${reg.eventDate},${reg.startTime}-${reg.endTime},${reg.location}`
    );
    
    console.log('CSV Export:', csvData);
    // In real app, this would trigger file download
  };

  return (
    <AnimatorLayout title="Přehled registrací">
      <div className="space-y-6">
        {/* Filters */}
        <div className="activity-card p-6">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Filtry</h3>
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
                  placeholder="Jméno, BNR, aktivita..."
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

        {/* Registrations List */}
        <div className="space-y-4">
          {filteredRegistrations.map((registration) => (
            <div key={registration.id} className="activity-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-foreground">
                      {registration.activity}
                    </h4>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                      {registration.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{registration.participant.name}</p>
                        <p className="text-muted-foreground">
                          {registration.participant.age} let, {registration.participant.type === 'Adult' ? 'Dospělý' : 'Dítě'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formatDate(registration.eventDate)}</p>
                        <p className="text-muted-foreground">BNR: {registration.bnr}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{registration.startTime} - {registration.endTime}</p>
                        <p className="text-muted-foreground">ID: {registration.bookingId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{registration.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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