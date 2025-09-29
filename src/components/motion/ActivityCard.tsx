import React from 'react';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityEvent {
  event_id: number;
  start_at: string;
  end_at: string;
  capacity: {
    max: number;
    confirmed: number;
    available: number;
  };
  age_profile: {
    min: number;
    max: number;
  };
}

interface Activity {
  activity_id: number;
  title: string;
  short_description: string;
  category: string;
  location: {
    label: string;
  };
  events: ActivityEvent[];
}

interface ActivityCardProps {
  activity: Activity;
  onBook: (eventId: number) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onBook }) => {
  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
    });
  };

  const getCapacityStatus = (capacity: ActivityEvent['capacity']) => {
    const percentage = (capacity.confirmed / capacity.max) * 100;
    if (percentage >= 90) return 'full';
    if (percentage >= 70) return 'limited';
    return 'available';
  };

  const getCapacityText = (capacity: ActivityEvent['capacity']) => {
    const status = getCapacityStatus(capacity);
    switch (status) {
      case 'full':
        return 'Obsazeno';
      case 'limited':
        return `Zbývá ${capacity.available} míst`;
      default:
        return `${capacity.available} míst volných`;
    }
  };

  return (
    <div className="activity-card p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{activity.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{activity.short_description}</p>
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <MapPin className="w-4 h-4 mr-1" />
            {activity.location.label}
          </div>
        </div>
        <span className="bg-muted text-muted-foreground px-2 py-1 text-xs rounded-md font-medium">
          {activity.category}
        </span>
      </div>

      <div className="space-y-3">
        {activity.events.map((event) => {
          const capacityStatus = getCapacityStatus(event.capacity);
          const isBookable = event.capacity.available > 0;

          return (
            <div
              key={event.event_id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center text-sm font-medium text-foreground mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(event.start_at)}
                  <Clock className="w-4 h-4 ml-3 mr-1" />
                  {formatTime(event.start_at)} - {formatTime(event.end_at)}
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  <span className={`capacity-indicator capacity-${capacityStatus}`}>
                    {getCapacityText(event.capacity)}
                  </span>
                  {event.age_profile.min > 0 && (
                    <span className="ml-3 text-muted-foreground">
                      {event.age_profile.min}+ let
                    </span>
                  )}
                </div>
              </div>
              <Button
                onClick={() => onBook(event.event_id)}
                disabled={!isBookable}
                variant={isBookable ? "default" : "secondary"}
                size="sm"
                className="ml-3"
              >
                {isBookable ? 'Rezervovat' : 'Obsazeno'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};