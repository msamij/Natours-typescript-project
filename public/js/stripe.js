import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51T9qUzBlwWw0eSD3aje35wBPTDSWDCz1qHXX0jsBY93mhZ0FHjgHQ6IRodEIPpdZsc9qLzpkkm5Iayn3FdEuDdvG00eeKFciPR',
);

export const bookTour = async tourId => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
