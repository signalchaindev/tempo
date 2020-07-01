const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    permissions: {
      type: [String],
      enum: ['ADMIN', 'USER', 'SUPER_ADMIN'],
      default: ['USER'],
    },
  },
  { timestamps: true },
)

exports.User = mongoose.model('users', UserSchema)
