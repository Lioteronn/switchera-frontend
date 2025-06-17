import { supabase } from '../utils/supabase';

export interface Booking {
  id?: number;
  user_id: number;
  service_id: number;
  booking_created_at?: string;
  scheduled_datetime?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  stripe_payment_intent_id?: string;
}

export const bookingRepository = {
  /**
   * Create a new booking
   */
  async createBooking(booking: Omit<Booking, 'id' | 'booking_created_at'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('users_serviceregistration')
      .insert([booking])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    return data;
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(
    bookingId: number, 
    status: Booking['status'], 
    paymentIntentId?: string
  ): Promise<Booking> {
    const updateData: Partial<Booking> = { status };
    if (paymentIntentId) {
      updateData.stripe_payment_intent_id = paymentIntentId;
    }

    const { data, error } = await supabase
      .from('users_serviceregistration')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking status:', error);
      throw new Error(`Failed to update booking: ${error.message}`);
    }

    return data;
  },

  /**
   * Get bookings for a user
   */
  async getUserBookings(userId: number): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('users_serviceregistration')
      .select(`
        *,
        service:users_service(
          service_id,
          service_title,
          service_description,
          service_price,
          service_image,
          owner:auth_user(
            id,
            username,
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('user_id', userId)
      .order('booking_created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user bookings:', error);
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Get bookings for a service (for service owners)
   */
  async getServiceBookings(serviceId: number): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('users_serviceregistration')
      .select(`
        *,
        user:auth_user(
          id,
          username,
          first_name,
          last_name,
          email
        )
      `)
      .eq('service_id', serviceId)
      .order('booking_created_at', { ascending: false });

    if (error) {
      console.error('Error fetching service bookings:', error);
      throw new Error(`Failed to fetch service bookings: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Simple booking creation (for basic registration without payment)
   */
  async bookService(serviceId: string, scheduledDateTime?: string): Promise<Booking> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Convert user.id (UUID) to integer user_id by looking up in auth_user table
    const { data: authUser, error: authError } = await supabase
      .from('auth_user')
      .select('id')
      .eq('id', parseInt(user.id)) // This might need adjustment based on your auth setup
      .single();

    if (authError) {
      console.error('Error finding user:', authError);
      throw new Error('User not found in auth system');
    }

    const booking: Omit<Booking, 'id' | 'booking_created_at'> = {
      user_id: authUser.id,
      service_id: parseInt(serviceId),
      status: 'pending',
      scheduled_datetime: scheduledDateTime
    };

    return this.createBooking(booking);
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: number): Promise<Booking> {
    return this.updateBookingStatus(bookingId, 'cancelled');
  }
};
