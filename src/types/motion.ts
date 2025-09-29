// DERTOUR Motion Klub - Type definitions

export interface Participant {
  id: string;
  type: 'Adult' | 'Child' | 'Infant';
  display_name: string;
  age: number;
}

export interface ActivityEvent {
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

export interface Activity {
  activity_id: number;
  title: string;
  short_description: string;
  long_description?: string;
  category: string;
  images?: Array<{ url: string }>;
  location: {
    label: string;
  };
  events: ActivityEvent[];
}

export interface Hotel {
  hotel_id: string;
  name: string;
  provider_id?: number;
}

export interface ProgramResponse {
  range: {
    date_from: string;
    date_to: string;
  };
  hotel: Hotel;
  activities: Activity[];
}

export interface Booking {
  booking_id: number;
  participant: Participant;
}

export interface BookedActivity {
  event_id: number;
  title: string;
  start_at: string;
  end_at: string;
  location: { label: string };
  bookings: Booking[];
}

export interface UserBookingsResponse {
  bnr: string;
  hotel: Hotel;
  activities: BookedActivity[];
}

export interface BookingRequest {
  BNR: string;
  event_id: number;
  participants: Participant[];
}

export interface LoginData {
  bnr: string;
  email: string;
  adult_count?: number;
}

export interface UserSession {
  bnr: string;
  email: string;
  hotel: Hotel;
  stay_period: {
    date_from: string;
    date_to: string;
  };
  participants: Participant[];
}

export type UserRole = 'guest' | 'animator';

export interface AnimatorSession {
  animator_id: string;
  hotel: Hotel;
  role: 'animator';
}