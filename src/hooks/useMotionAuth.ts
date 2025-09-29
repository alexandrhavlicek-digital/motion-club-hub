import { useState, useEffect } from 'react';
import { UserSession, AnimatorSession, UserRole } from '@/types/motion';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  userSession: UserSession | null;
  animatorSession: AnimatorSession | null;
  isLoading: boolean;
}

export const useMotionAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    userSession: null,
    animatorSession: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session in localStorage
    const checkExistingSession = () => {
      try {
        const animatorSession = localStorage.getItem('motion_animator_session');
        const guestSession = localStorage.getItem('motion_guest_session');

        if (animatorSession) {
          const session = JSON.parse(animatorSession);
          setAuthState({
            isAuthenticated: true,
            role: 'animator',
            userSession: null,
            animatorSession: session,
            isLoading: false,
          });
        } else if (guestSession) {
          const session = JSON.parse(guestSession);
          setAuthState({
            isAuthenticated: true,
            role: 'guest',
            userSession: session,
            animatorSession: null,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkExistingSession();
  }, []);

  const loginAsGuest = async (bnr: string, email: string, adultCount?: number): Promise<boolean> => {
    try {
      // Mock API call - in real app, this would validate BNR and email
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock session data  
      const session: UserSession = {
        bnr: '191754321', // Ensure this matches the BNR in mock bookings
        email,
        hotel: {
          hotel_id: 'HER90079',
          name: 'Hotel Aurora',
          provider_id: 13,
        },
        stay_period: {
          date_from: '2025-07-01',
          date_to: '2025-07-08',
        },
        participants: [
          { id: '1', type: 'Adult', display_name: 'Adam N.', age: 45 },
          { id: '3', type: 'Adult', display_name: 'Petr S.', age: 35 },
          { id: '5', type: 'Child', display_name: 'Eva N.', age: 9 },
        ],
      };

      localStorage.setItem('motion_guest_session', JSON.stringify(session));
      setAuthState({
        isAuthenticated: true,
        role: 'guest',
        userSession: session,
        animatorSession: null,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error('Guest login failed:', error);
      return false;
    }
  };

  const loginAsAnimator = async (animatorId: string, password: string): Promise<boolean> => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const session: AnimatorSession = {
        animator_id: animatorId,
        hotel: {
          hotel_id: 'HER90079',
          name: 'Hotel Aurora',
        },
        role: 'animator',
      };

      localStorage.removeItem('motion_guest_session');
      localStorage.setItem('motion_animator_session', JSON.stringify(session));
      setAuthState({
        isAuthenticated: true,
        role: 'animator',
        userSession: null,
        animatorSession: session,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error('Animator login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('motion_guest_session');
    localStorage.removeItem('motion_animator_session');
    setAuthState({
      isAuthenticated: false,
      role: null,
      userSession: null,
      animatorSession: null,
      isLoading: false,
    });
  };

  return {
    ...authState,
    loginAsGuest,
    loginAsAnimator,
    logout,
  };
};