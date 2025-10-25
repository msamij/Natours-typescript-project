import bcrypt from 'bcryptjs';
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
  },
  {
    methods: {
      async correctedPassword(candidatePassword: string, userPassword: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, userPassword);
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined!;
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
