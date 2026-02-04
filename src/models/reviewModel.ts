import mongoose from 'mongoose';
import Tour from './tourModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },

  {
    statics: {
      async calculateAverageRatings(tourId: mongoose.Types.ObjectId) {
        const stats = await this.aggregate([
          {
            $match: { tour: tourId },
          },
          {
            $group: {
              _id: '$tour',
              nRating: { $sum: 1 },
              avgRating: { $avg: '$rating' },
            },
          },
        ]);

        await Tour.findByIdAndUpdate(tourId, { ratingsQuantity: stats[0].nRating, ratingsAverage: stats[0].avgRating });
      },
    },

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

interface ReviewMethods {
  calculateAverageRatings(tourId: mongoose.Types.ObjectId): Promise<void>;
}

type ReviewSchemaInferred = mongoose.InferSchemaType<typeof reviewSchema>;
type ReviewDocument = mongoose.HydratedDocument<ReviewSchemaInferred, ReviewMethods>;
type ReviewQueryContext = mongoose.Query<any, ReviewDocument, {}> & { review: ReviewDocument };

reviewSchema.pre<ReviewQueryContext>(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  // .populate({ path: 'tour', select: 'name' })
  next();
});

reviewSchema.pre<ReviewQueryContext>(/^findOneAnd/, async function (next) {
  this.review = (await this.findOne()) as ReviewDocument;
  next();
});

reviewSchema.post<ReviewQueryContext>(/^findOneAnd/, async function () {
  await (this.review.constructor as unknown as ReviewDocument).calculateAverageRatings(this.review.tour);
});

reviewSchema.post('save', function () {
  (this.constructor as unknown as ReviewDocument).calculateAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
