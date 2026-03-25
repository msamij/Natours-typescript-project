import type { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import type { RequestWithUser } from '../types/Types.js';
import { catchAsync } from '../utils/catchAsync.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const getCheckoutSession = catchAsync(async (req: RequestWithUser, res: Response, _next: NextFunction) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour?.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour?.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: (tour?.price as number) * 100,
          product_data: {
            name: `${tour?.name} Tour`,
            description: tour?.summary,
            images: [`https://natours.dev/img/tours/${tour?.imageCover}`],
          },
        },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

export const createBookingCheckout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) {
    return next();
  }
});
