import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  audioScore: {
    type: Number,
    required: true,
  },
  faceScore: {
    type: Number,
    required: true,
  },
  finalScore: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
  },
  recommendations: [{
    type: String,
  }],
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;
