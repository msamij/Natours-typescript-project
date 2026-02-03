import mongoose from 'mongoose';
import slugify from '../imports/slugify.js';
import { logger } from '../logger.js';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val: Number) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price.',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingsAverage: -1 });

// Keeping these types in model.ts because they depend on `typeof tourSchema`.
// Moving them to Types.ts would require importing the schema there,
// creating unnecessary coupling. To keep things simple, we define them here.

// The shape of a Tour document based on the schema
type TourSchemaInferred = mongoose.InferSchemaType<typeof tourSchema> & { start: number };

// A Fully functional typed mongoose Hyderated document based on TourSchemaInferred.
type TourDocument = mongoose.HydratedDocument<TourSchemaInferred>;

// The query context used inside pre/post('find') hooks.
// (Since we need start field inside pre(/^find/) hooks, we essentially need a larger type containing TourDocument!)
type TourQueryContext = mongoose.Query<any, TourDocument, {}> & TourDocument;

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', { ref: 'Review', foreignField: 'tour', localField: '_id' });

/**
 *  (Commenting this one out), implementing referencing approach instead of embeding users in Tour Documents.
 */
/*
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
*/

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre<TourQueryContext>(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre<TourQueryContext>(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v -passwordChangedAt' });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

tourSchema.post<TourQueryContext>(/^find/, function (_document, next) {
  logger.info(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
