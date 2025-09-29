// DERTOUR Motion Klub - Mock API Service

import { 
  Activity, 
  ProgramResponse, 
  UserBookingsResponse, 
  BookingRequest,
  Participant 
} from '@/types/motion';

// Mock data based on the specification
const mockHotel = {
  hotel_id: 'HER90079',
  name: 'Hotel Aurora',
  provider_id: 13,
};

const mockActivities: Activity[] = [
  {
    activity_id: 1001,
    title: 'Paddleboard',
    short_description: 'Lekce paddleboardu na moři s instruktorem',
    long_description: 'Kompletní lekce paddleboardu včetně instruktáže, vybavení v ceně. Vhodné pro začátečníky i pokročilé.',
    category: 'Sport',
    location: { label: 'Bar na pláži' },
    events: [
      {
        event_id: 1987,
        start_at: '2025-07-01T10:00:00',
        end_at: '2025-07-01T12:00:00',
        capacity: { max: 30, confirmed: 24, available: 6 },
        age_profile: { min: 15, max: 99 }
      },
      {
        event_id: 1988,
        start_at: '2025-07-02T14:00:00',
        end_at: '2025-07-02T16:00:00',
        capacity: { max: 30, confirmed: 18, available: 12 },
        age_profile: { min: 15, max: 99 }
      }
    ]
  },
  {
    activity_id: 1002,
    title: 'Kids Club',
    short_description: 'Zábavný program pro děti s animátory',
    long_description: 'Kreativní dílničky, hry a zábava pro děti pod dohledem kvalifikovaných animátorů.',
    category: 'Děti',
    location: { label: 'Dětský klub' },
    events: [
      {
        event_id: 1989,
        start_at: '2025-07-01T09:00:00',
        end_at: '2025-07-01T12:00:00',
        capacity: { max: 20, confirmed: 8, available: 12 },
        age_profile: { min: 4, max: 12 }
      },
      {
        event_id: 1990,
        start_at: '2025-07-01T15:00:00',
        end_at: '2025-07-01T18:00:00',
        capacity: { max: 20, confirmed: 15, available: 5 },
        age_profile: { min: 4, max: 12 }
      }
    ]
  },
  {
    activity_id: 1003,
    title: 'Sunset Yoga',
    short_description: 'Relaxační jóga při západu slunce',
    long_description: 'Klidná jóga session při západu slunce s výhledem na moře. Vhodné pro všechny úrovně.',
    category: 'Wellness',
    location: { label: 'Terasa s výhledem na moře' },
    events: [
      {
        event_id: 1991,
        start_at: '2025-07-01T19:30:00',
        end_at: '2025-07-01T20:30:00',
        capacity: { max: 15, confirmed: 10, available: 5 },
        age_profile: { min: 16, max: 99 }
      },
      {
        event_id: 1992,
        start_at: '2025-07-02T19:30:00',
        end_at: '2025-07-02T20:30:00',
        capacity: { max: 15, confirmed: 5, available: 10 },
        age_profile: { min: 16, max: 99 }
      }
    ]
  },
  {
    activity_id: 1004,
    title: 'Aqua Aerobik',
    short_description: 'Cvičení ve vodě pro všechny věky',
    long_description: 'Energické cvičení ve vodě s motivující hudbou a profesionálním trenérem.',
    category: 'Sport',
    location: { label: 'Bazén' },
    events: [
      {
        event_id: 1994,
        start_at: '2025-01-01T16:00:00',
        end_at: '2025-01-01T17:00:00',
        capacity: { max: 35, confirmed: 22, available: 13 },
        age_profile: { min: 18, max: 99 }
      },
      {
        event_id: 1995,
        start_at: '2024-12-29T16:00:00',
        end_at: '2024-12-29T17:00:00',
        capacity: { max: 35, confirmed: 28, available: 7 },
        age_profile: { min: 18, max: 99 }
      }
    ]
  },
  {
    activity_id: 1005,
    title: 'Paintball Tournament',
    short_description: 'Turnaj v paintballu pro týmy',
    long_description: 'Adrenalinový paintballový turnaj. Ochranné vybavení a instrukce v ceně.',
    category: 'Sport',
    location: { label: 'Paintball arena' },
    events: [
      {
        event_id: 1996,
        start_at: '2024-12-27T14:00:00',
        end_at: '2024-12-27T16:30:00',
        capacity: { max: 24, confirmed: 20, available: 4 },
        age_profile: { min: 16, max: 55 }
      }
    ]
  },
  {
    activity_id: 1006,
    title: 'Dětský klub - odpoledne',
    short_description: 'Kreativní aktivity pro děti',
    long_description: 'Malování, výtvarné dílničky a hry pro děti s animátory.',
    category: 'Děti',
    location: { label: 'Dětský klub' },
    events: [
      {
        event_id: 1993,
        start_at: '2024-12-30T15:00:00',
        end_at: '2024-12-30T17:00:00',
        capacity: { max: 20, confirmed: 15, available: 5 },
        age_profile: { min: 4, max: 12 }
      }
    ]
  }
];

// Mock storage for bookings
let mockBookings: Array<{
  booking_id: number;
  bnr: string;
  event_id: number;
  participant: Participant;
  status: 'confirmed' | 'cancelled';
}> = [
  {
    booking_id: 555001,
    bnr: '191754321',
    event_id: 1987,
    participant: { id: '1', type: 'Adult', display_name: 'Adam N.', age: 45 },
    status: 'confirmed'
  }
];

let nextBookingId = 555011;

export const motionApi = {
  // Get program for hotel and date range
  async getProgram(dateFrom: string, dateTo: string, hotelId: string): Promise<ProgramResponse> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    return {
      range: { date_from: dateFrom, date_to: dateTo },
      hotel: mockHotel,
      activities: mockActivities
    };
  },

  // Book activity
  async bookActivity(booking: BookingRequest): Promise<{ status: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Add bookings for each participant
    booking.participants.forEach(participant => {
      mockBookings.push({
        booking_id: nextBookingId++,
        bnr: booking.BNR,
        event_id: booking.event_id,
        participant,
        status: 'confirmed'
      });

      // Update activity capacity
      mockActivities.forEach(activity => {
        activity.events.forEach(event => {
          if (event.event_id === booking.event_id) {
            event.capacity.confirmed += 1;
            event.capacity.available = Math.max(0, event.capacity.available - 1);
          }
        });
      });
    });

    return { status: 'confirmed' };
  },

  // Get user bookings
  async getUserBookings(bnr: string): Promise<UserBookingsResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));

    // Add more mock bookings for demonstration
    const extraMockBookings = [
      // Future activities
      {
        booking_id: 555010,
        bnr: '191754321',
        event_id: 1989,
        participant: { id: '5', type: 'Child', display_name: 'Eva N.', age: 9 },
        status: 'confirmed' as const
      },
      {
        booking_id: 555011,
        bnr: '191754321',
        event_id: 1991,
        participant: { id: '1', type: 'Adult', display_name: 'Adam N.', age: 45 },
        status: 'confirmed' as const
      },
      {
        booking_id: 555012,
        bnr: '191754321',
        event_id: 1987,
        participant: { id: '3', type: 'Adult', display_name: 'Petr S.', age: 35 },
        status: 'confirmed' as const
      },
      {
        booking_id: 555013,
        bnr: '191754321',
        event_id: 1992,
        participant: { id: '1', type: 'Adult', display_name: 'Adam N.', age: 45 },
        status: 'confirmed' as const
      },
      {
        booking_id: 555018,
        bnr: '191754321',
        event_id: 1987,
        participant: { id: '5', type: 'Child', display_name: 'Eva N.', age: 9 },
        status: 'confirmed' as const
      },
      // Past activities
      {
        booking_id: 555014,
        bnr: '191754321',
        event_id: 1995,
        participant: { id: '3', type: 'Adult', display_name: 'Petr S.', age: 35 },
        status: 'confirmed' as const
      },
      {
        booking_id: 555015,
        bnr: '191754321',
        event_id: 1993,
        participant: { id: '5', type: 'Child', display_name: 'Eva N.', age: 9 },
        status: 'confirmed' as const
      },
      {
        booking_id: 555016,
        bnr: '191754321',
        event_id: 1996,
        participant: { id: '1', type: 'Adult', display_name: 'Adam N.', age: 45 },
        status: 'confirmed' as const
      },
      {
        booking_id: 555017,
        bnr: '191754321',
        event_id: 1996,
        participant: { id: '3', type: 'Adult', display_name: 'Petr S.', age: 35 },
        status: 'confirmed' as const
      }
    ];

    const allBookings = [...mockBookings, ...extraMockBookings];
    const userBookings = allBookings.filter(b => b.bnr === bnr && b.status === 'confirmed');
    
    // Group bookings by event
    const activitiesMap = new Map();
    
    userBookings.forEach(booking => {
      const activity = mockActivities.find(a => 
        a.events.some(e => e.event_id === booking.event_id)
      );
      const event = activity?.events.find(e => e.event_id === booking.event_id);
      
      if (activity && event) {
        const key = event.event_id;
        if (!activitiesMap.has(key)) {
          activitiesMap.set(key, {
            event_id: event.event_id,
            title: activity.title,
            start_at: event.start_at,
            end_at: event.end_at,
            location: activity.location,
            bookings: []
          });
        }
        activitiesMap.get(key).bookings.push({
          booking_id: booking.booking_id,
          participant: booking.participant
        });
      }
    });

    return {
      bnr,
      hotel: mockHotel,
      activities: Array.from(activitiesMap.values())
    };
  },

  // Cancel booking
  async cancelBooking(bookingId: number, bnr: string, eventId: number, participant: Participant): Promise<{ status: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Find and cancel the booking
    const bookingIndex = mockBookings.findIndex(b => 
      b.booking_id === bookingId && b.bnr === bnr && b.status === 'confirmed'
    );

    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].status = 'cancelled';

      // Update activity capacity
      mockActivities.forEach(activity => {
        activity.events.forEach(event => {
          if (event.event_id === eventId) {
            event.capacity.confirmed = Math.max(0, event.capacity.confirmed - 1);
            event.capacity.available = Math.min(event.capacity.max, event.capacity.available + 1);
          }
        });
      });
    }

    return { status: 'cancelled' };
  },

  // Get registrations for animator
  async getAnimatorRegistrations(dateFrom: string, dateTo: string, activityId?: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredBookings = mockBookings.filter(b => b.status === 'confirmed');
    
    // Filter by date range and activity if specified
    if (activityId) {
      const activity = mockActivities.find(a => a.activity_id.toString() === activityId);
      if (activity) {
        const eventIds = activity.events.map(e => e.event_id);
        filteredBookings = filteredBookings.filter(b => eventIds.includes(b.event_id));
      }
    }

    const registrations = filteredBookings.map(booking => {
      const activity = mockActivities.find(a => 
        a.events.some(e => e.event_id === booking.event_id)
      );
      
      return {
        booking_id: booking.booking_id,
        bnr: booking.bnr,
        participant: booking.participant,
        activity_title: activity?.title || 'Unknown',
        event_id: booking.event_id
      };
    });

    return {
      range: { from: dateFrom, to: dateTo },
      registrations
    };
  }
};