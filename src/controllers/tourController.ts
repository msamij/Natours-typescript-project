import { type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import sharp from 'sharp';
import Tour from '../models/tourModel.js';
import type { RequestWithGeoCoordinates, RequestWithUser, RequestWithYear } from '../types/Types.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 404));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadTourImages: RequestHandler = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeTourImages = catchAsync(async (req: RequestWithUser, _res: Response, next: NextFunction) => {
  const files = req.files as unknown as { [fieldname: string]: Express.Multer.File[] };
  if (!files?.imageCover || !files?.images) {
    return next();
  }

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp((files.imageCover[0] as Express.Multer.File).buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp((file as Express.Multer.File).buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});

export const aliasTopTour = async (req: Request, _res: Response, next: NextFunction) => {
  const url = new URL(req.originalUrl, `http://${req.headers.host}`);
  url.searchParams.set('limit', '5');
  url.searchParams.set('sort', '-ratingsAverage,price');
  url.searchParams.set('fields', 'name,price,ratingsAverage,summary,difficulty');
  req.url = url.pathname + url.search;
  next();
};

export const createTour = factory.createOne(Tour);

export const getAllTours = factory.getAll(Tour);

export const getTour = factory.getOne(Tour, { path: 'reviews' });

export const updateTour = factory.updateOne(Tour);

export const deleteTour = factory.deleteOne(Tour);

export const getTourStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(async (req: RequestWithYear, res: Response) => {
  const year = parseInt(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

export const getToursWithin = catchAsync(async (req: RequestWithGeoCoordinates, res: Response, next: NextFunction) => {
  const { distance, latlng, unit } = req.params;
  const distanceNum = Number(distance);
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(new AppError(`Please provide lattitude and longitude in the format lat,lng`, 400));
  }

  const radius = unit === 'mi' ? distanceNum / 3963.2 : distanceNum / 6378.1;

  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

export const getDistances = catchAsync(async (req: RequestWithGeoCoordinates, res: Response, next: NextFunction) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',').map(el => Number(el));

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(new AppError(`Please provide lattitude and longitude in the format lat,lng`, 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances,
    },
  });
});

// Commenting this out since we're doing generic getOne implementation.
// export const getAllTours = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
//   const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// Commenting this out since we're doing generic getOne implementation.
// export const getTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   if (!tour) {
//     return next(new AppError(`No tour found with the ID: ${req.params.id}`, 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// Commenting this out since we're doing generic createOne implementation.
// export const createTour = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'sucess',
//     data: {
//       tour: newTour,
//     },
//   });
// });

// Commenting this out since we're doing generic updateOne implementation.
// export const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError(`No tour found with the ID: ${req.params.id}`, 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// Commenting this out since we're doing generic deleteOne implementation.
// export const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError(`No tour found with the ID: ${req.params.id}`, 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
