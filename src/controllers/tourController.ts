import { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import type { tourSimple } from '../routes/types.js';
import type { RequestWithTime } from '../types/Request.js';

const __dirname = path.resolve();

const tours: tourSimple[] = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

export const getAllTours = (req: RequestWithTime, res: Response) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

export const getTour = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  const tour = tours.find(item => item.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

export const createTour = (req: Request, res: Response) => {
  const newId = tours![tours.length - 1]!.id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'sucess',
      data: {
        tour: newTour,
      },
    });
  });
};

export const updateTour = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

export const deleteTour = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
