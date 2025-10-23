import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface Participant {
  id: string;
  type: 'Adult' | 'Child' | 'Infant';
  display_name: string;
  age: number;
}

interface ActivityEvent {
  event_id: number;
  title: string;
  start_at: string;
  end_at: string;
  location: { label: string };
  capacity: {
    max: number;
    confirmed: number;
    available: number;
  };
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ActivityEvent | null;
  participants: Participant[];
  onConfirm: (selectedParticipants: Participant[]) => void;
  isLoading?: boolean;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  event,
  participants,
  onConfirm,
  isLoading = false
}) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('cs-CZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleConfirm = () => {
    const selected = participants.filter(p => selectedParticipants.includes(p.id));
    onConfirm(selected);
    setSelectedParticipants([]);
    setTermsAccepted(false);
  };

  const handleClose = () => {
    setSelectedParticipants([]);
    setTermsAccepted(false);
    onClose();
  };

  if (!event) return null;

  const { date, time: startTime } = formatDateTime(event.start_at);
  const { time: endTime } = formatDateTime(event.end_at);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Rezervace aktivity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Activity Details */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">{event.title}</h3>
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
                {event.location.label}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {event.capacity.available} míst volných
              </div>
            </div>
          </div>

          {/* Participant Selection */}
          <div>
            <h4 className="font-medium mb-3">Vyberte účastníky:</h4>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={participant.id}
                    checked={selectedParticipants.includes(participant.id)}
                    onCheckedChange={() => handleParticipantToggle(participant.id)}
                  />
                  <label
                    htmlFor={participant.id}
                    className="flex-1 text-sm font-medium cursor-pointer"
                  >
                    {participant.display_name}
                    <span className="text-muted-foreground ml-2">
                      ({participant.age} let, {participant.type === 'Adult' ? 'Dospělý' : 'Dítě'})
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Terms confirmation */}
          <div className="border-t pt-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                Potvrzuji, že jsem se seznámil(a) s tím, že aktivitu pořádá místní provozovatel a DER Touristik CZ a.s. je pouze zprostředkovatelem.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Zrušit
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedParticipants.length === 0 || !termsAccepted || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Rezervuji...' : `Rezervovat (${selectedParticipants.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};