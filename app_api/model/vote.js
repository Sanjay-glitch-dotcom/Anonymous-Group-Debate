const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    debateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Debate', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    choice: { type: String, enum: ['up', 'down'], required: true },
  },
  { timestamps: true }
);

voteSchema.index({ debateId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
