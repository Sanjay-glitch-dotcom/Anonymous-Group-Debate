const mongoose = require('mongoose');
const Vote = mongoose.model('Vote');
const Debate = mongoose.model('Debate');

async function tally(req, res) {
  try {
    const { id: debateId } = req.params;
    const docs = await Vote.aggregate([
      { $match: { debateId: new mongoose.Types.ObjectId(debateId) } },
      { $group: { _id: '$choice', count: { $sum: 1 } } },
    ]);

    const tallies = { up: 0, down: 0 };
    docs.forEach((d) => (tallies[d._id] = d.count));

    res.json({ debateId, ...tallies });
  } catch (e) {
    res.status(500).json({ message: 'Failed to tally votes' });
  }
}

async function vote(req, res) {
  try {
    const { id: debateId } = req.params;
    const { choice } = req.body || {};
    if (!['up', 'down'].includes(choice)) return res.status(400).json({ message: 'Invalid choice' });

    const debate = await Debate.findById(debateId);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (debate.status !== 'closed') return res.status(400).json({ message: 'Voting allowed after debate is closed' });

    // Check if user already voted
    const existing = await Vote.findOne({ debateId, userId: req.user.sub });
    if (existing) {
      return res.status(409).json({ message: 'Vote already cast' });
    }

    // Create new vote
    const vote = await Vote.create({ debateId, userId: req.user.sub, choice });
    res.status(201).json({ debateId, userId: req.user.sub, choice });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Vote already cast' });
    res.status(500).json({ message: 'Failed to vote' });
  }
}

module.exports = { tally, vote };
