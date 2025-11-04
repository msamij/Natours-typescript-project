import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Please provide a password'],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      // This only works on CREATE & SAVE!
      validate: {
        validator: function (val: String) {
          return this.password === val;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },

  {
    methods: {
      async correctedPassword(candidatePassword: string, userPassword: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, userPassword);
      },

      changedPasswordAfter(JWTTimestamp: number): boolean {
        if (this.passwordChangedAt) {
          const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
          return JWTTimestamp < changedTimestamp;
        }
        return false;
      },

      createPasswordResetToken() {
        const resetToken = crypto.randomBytes(32).toString('hex');

        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        this.passwordResetExpires = (Date.now() + 10 * 60 * 1000) as unknown as Date;

        return resetToken;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  (this as mongoose.Document & { passwordConfirm?: string | undefined }).passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = (Date.now() - 1000) as unknown as Date;
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
