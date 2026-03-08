import { type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import multer from 'multer';
import * as factory from '../controllers/handlerFactory.js';
import User from '../models/userModel.js';
import type { RequestWithUser } from '../types/Types.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req: RequestWithUser, file, cb) => {
    const ext = file.mimetype.split('/')[2];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

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
  console.log(req.file);
  console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

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
