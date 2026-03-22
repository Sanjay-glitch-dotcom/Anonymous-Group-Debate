const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    debateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Debate', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

replySchema.index({ debateId: 1, userId: 1, createdAt: 1 });

module.exports = mongoose.model('Reply', replySchema);
