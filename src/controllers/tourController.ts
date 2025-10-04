import { type NextFunction, type Request, type Response } from 'express';
import type { RequestWithTime } from '../types/Request.js';
import Tour from '../models/tourModel.js';

export const getAllTours = (req: RequestWithTime, res: Response) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

export const getTour = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  // const tour = tours.find(item => item.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

export const createTour = (req: Request, res: Response) => {
  res.status(201).json({
    status: 'sucess',
    // data: {
    //   tour: newTour,
    // },
  });
};

export const updateTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
