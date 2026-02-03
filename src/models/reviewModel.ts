import mongoose from 'mongoose';

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
      async calculateAverageRatings(tourId: mongoose.Schema.Types.ObjectId) {
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
      },
    },

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

type ReviewSchemaInferred = mongoose.InferSchemaType<typeof reviewSchema>;
type ReviewDocument = mongoose.HydratedDocument<ReviewSchemaInferred>;
type ReviewQueryContext = mongoose.Query<any, ReviewDocument, {}>;

reviewSchema.pre<ReviewQueryContext>(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  // .populate({ path: 'tour', select: 'name' })
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
