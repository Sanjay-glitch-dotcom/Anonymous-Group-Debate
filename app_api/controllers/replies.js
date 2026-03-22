const mongoose = require('mongoose');
const Reply = mongoose.model('Reply');
const Debate = mongoose.model('Debate');

async function listByDebate(req, res) {
  try {
    const { id: debateId } = req.params;
    const [replies, debate] = await Promise.all([
      Reply.find({ debateId }).sort({ createdAt: 1 }).lean(),
      Debate.findById(debateId).lean(),
    ]);
    const userId = req.user?.sub;
    res.json(
      replies.map((r) => ({
        _id: r._id,
        debateId: r.debateId,
        author: `Anonymous#${r.userId.toString().slice(-4)}`,
        content: r.content,
        createdAt: r.createdAt,
        canDelete:
          !!userId && (
            r.userId.toString() === String(userId) ||
            (debate && String(debate.createdBy) === String(userId))
          ),
      }))
    );
  } catch (e) {
    res.status(500).json({ message: 'Failed to list replies' });
  }
}

async function create(req, res) {
  try {
    const { id: debateId } = req.params;
    const { content } = req.body || {};
    if (!content) return res.status(400).json({ message: 'Content required' });

    const debate = await Debate.findById(debateId);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (debate.status !== 'open') return res.status(400).json({ message: 'Debate is closed' });

    const count = await Reply.countDocuments({ debateId, userId: req.user.sub });
    if (count >= 3) return res.status(403).json({ message: 'Reply limit reached (3 per user per debate)' });

    const reply = await Reply.create({ debateId, userId: req.user.sub, content });
    res.status(201).json({
      _id: reply._id,
      debateId: reply.debateId,
      author: `Anonymous#${(reply.userId.toString().slice(-4))}`,
      content: reply.content,
      createdAt: reply.createdAt,
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create reply' });
  }
}

async function remove(req, res) {
  try {
    const { id: debateId, replyId } = req.params;
    const [debate, reply] = await Promise.all([
      Debate.findById(debateId),
      Reply.findOne({ _id: replyId, debateId })
    ]);

    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const userId = req.user?.sub;
    const isCreator = debate.createdBy.toString() === String(userId);
    const isOwner = reply.userId.toString() === String(userId);

    if (!userId || (!isCreator && !isOwner)) {
      return res.status(403).json({ message: 'Not allowed to delete this reply' });
    }

    await Reply.deleteOne({ _id: reply._id });

    if (typeof global.__broadcastDebateEvent === 'function') {
      global.__broadcastDebateEvent(String(debateId), 'reply_deleted', { id: String(reply._id) });
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete reply' });
  }
}

async function update(req, res) {
  try {
    const { id: debateId, replyId } = req.params;
    const { content } = req.body || {};
    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: 'Content required' });
    }

    const [debate, reply] = await Promise.all([
      Debate.findById(debateId),
      Reply.findOne({ _id: replyId, debateId })
    ]);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const userId = req.user?.sub;
    const isCreator = String(debate.createdBy) === String(userId);
    const isOwner = String(reply.userId) === String(userId);

    // Owners can edit only while debate is open; creator can edit anytime
    if (!userId || (!isCreator && !isOwner)) {
      return res.status(403).json({ message: 'Not allowed to edit this reply' });
    }
    if (!isCreator && debate.status !== 'open') {
      return res.status(400).json({ message: 'Debate is closed' });
    }

    reply.content = content;
    await reply.save();

    if (typeof global.__broadcastDebateEvent === 'function') {
      global.__broadcastDebateEvent(String(debateId), 'reply_updated', {
        id: String(reply._id),
        content: reply.content,
        updatedAt: reply.updatedAt,
      });
    }

    res.json({
      _id: reply._id,
      debateId: reply.debateId,
      author: `Anonymous#${reply.userId.toString().slice(-4)}`,
      content: reply.content,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update reply' });
  }
}

module.exports = { listByDebate, create, remove, update };
