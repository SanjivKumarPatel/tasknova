import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    
    avatar: { type: String, default: '' },

    lastLogin: { type: Date, default: null },

    rememberToken: {
      type: String,
      default: null,
      select: false,
    },

    rememberTokenExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    resetOtp: {
      type: String,
      default: null,
      select: false
    },

    resetOtpExpiry: {
      type: Date,
      default: null,
      select: false
    },

    resetOtpVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.toJSON = function () {
  const userObject = this.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

const User = mongoose.model('User', userSchema)

export default User
