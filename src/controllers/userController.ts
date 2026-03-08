import { type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import * as factory from '../controllers/handlerFactory.js';
import User from '../models/userModel.js';
import type { RequestWithUser } from '../types/Types.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

// Commented this one out, we're saving images to a buffer!
/*
const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req: RequestWithUser, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});
*/

const multerStorage = multer.memoryStorage();

interface FileFilterCallback {
  (error: Error): void;
  (error: Error, acceptFile: boolean): void;
}

const multerFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    cb(null as unknown as Error, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 404), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto: RequestHandler = upload.single('photo');

export const resizeUserPhoto = (req: Request, _res: Response, next: NextFunction) => {
  const requestWithUser = req as RequestWithUser;

  if (!req.file) return next();

  req.file.filename = `user-${requestWithUser.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

export const getMe = (req: Request, _res: Response, next: NextFunction) => {
  const requestWithUser = req as RequestWithUser;
  req.params.id = requestWithUser.user.id as string;
  next();
};

export const updateMe = catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req: RequestWithUser, res: Response, _next: NextFunction) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createUser = (_req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};

export const getAllUsers = factory.getAll(User);

export const getUser = factory.getOne(User);

export const updateUser = factory.updateOne(User);

export const deleteUser = factory.deleteOne(User);
