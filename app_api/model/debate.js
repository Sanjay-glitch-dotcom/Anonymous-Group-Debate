const mongoose = require('mongoose');

const debateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    summary: { type: String },
    closedAt: { type: Date },
    autoCloseAt: { type: Date }, // Auto-close timestamp (15 minutes from creation)
    closedBy: { type: String, enum: ['timer', 'manual'], default: null }, // How it was closed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Debate', debateSchema);
