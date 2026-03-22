const mongoose = require('mongoose');
const Debate = mongoose.model('Debate');
const Reply = mongoose.model('Reply');
const Vote = mongoose.model('Vote');

async function list(req, res) {
  try {
    const debates = await Debate.find().sort({ createdAt: -1 }).lean();
    
    // Add reply and vote counts to each debate
    const debatesWithCounts = await Promise.all(
      debates.map(async (debate) => {
        const [replyCount, voteCount] = await Promise.all([
          Reply.countDocuments({ debateId: debate._id }),
          Vote.countDocuments({ debateId: debate._id })
        ]);
        
        return {
          ...debate,
          replyCount,
          voteCount
        };
      })
    );
    
    res.json(debatesWithCounts);
  } catch (e) {
    res.status(500).json({ message: 'Failed to list debates' });
  }
}

async function get(req, res) {
  try {
    const debate = await Debate.findById(req.params.id).lean();
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    
    // Add reply and vote counts
    const [replyCount, voteCount] = await Promise.all([
      Reply.countDocuments({ debateId: debate._id }),
      Vote.countDocuments({ debateId: debate._id })
    ]);
    
    res.json({
      ...debate,
      replyCount,
      voteCount
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to get debate' });
  }
}

async function create(req, res) {
  try {
    const { title, description } = req.body || {};
    if (!title || !description) return res.status(400).json({ message: 'Title and description required' });

    // Set closing time to 15 minutes from now
    const autoCloseAt = new Date(Date.now() + 15 * 60 * 1000);

    const debate = await Debate.create({
      title,
      description,
      createdBy: req.user.sub,
      autoCloseAt,
    });

    setTimeout(async () => {
      try {
        const currentDebate = await Debate.findById(debate._id);
        if (currentDebate && currentDebate.status === 'open') {
          currentDebate.status = 'closed';
          currentDebate.closedAt = new Date();
          currentDebate.closedBy = 'timer';
          await currentDebate.save();
          if (typeof global.__broadcastDebateEvent === 'function') {
            global.__broadcastDebateEvent(String(currentDebate._id), 'closed', {
              id: String(currentDebate._id),
              status: currentDebate.status,
              closedAt: currentDebate.closedAt,
              closedBy: currentDebate.closedBy,
            });
          }
        }
      } catch (error) {
        console.error('Error auto-closing debate:', error);
      }
    }, 3 * 60 * 1000);

    res.status(201).json(debate);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create debate' });
  }
}

async function close(req, res) {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (debate.status === 'closed') return res.status(400).json({ message: 'Debate already closed' });

    if (debate.createdBy.toString() !== req.user.sub) {
      return res.status(403).json({ message: 'Only the debate creator can close this debate' });
    }

    debate.status = 'closed';
    debate.closedAt = new Date();
    debate.closedBy = 'manual';
    await debate.save();

    if (typeof global.__broadcastDebateEvent === 'function') {
      global.__broadcastDebateEvent(String(debate._id), 'closed', {
        id: String(debate._id),
        status: debate.status,
        closedAt: debate.closedAt,
        closedBy: debate.closedBy,
      });
    }

    res.json(debate);
  } catch (e) {
    res.status(500).json({ message: 'Failed to close debate' });
  }
}

async function remove(req, res) {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });

    if (debate.createdBy.toString() !== req.user.sub) {
      return res.status(403).json({ message: 'Only the debate creator can delete this debate' });
    }

    if (debate.status !== 'closed') {
      return res.status(400).json({ message: 'Only closed debates can be deleted' });
    }

    await Reply.deleteMany({ debateId: debate._id });
    await Vote.deleteMany({ debateId: debate._id });
    await Debate.deleteOne({ _id: debate._id });

    if (typeof global.__broadcastDebateEvent === 'function') {
      global.__broadcastDebateEvent(String(debate._id), 'deleted', { id: String(debate._id) });
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete debate' });
  }
}

module.exports = { list, get, create, close, remove };
