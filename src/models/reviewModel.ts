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
type ReviewQueryContext = mongoose.Query<any, ReviewDocument, {}>;

reviewSchema.post('save', function () {
  (this.constructor as unknown as ReviewDocument).calculateAverageRatings(this.tour);
});

reviewSchema.pre<ReviewQueryContext>(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  // .populate({ path: 'tour', select: 'name' })
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
