const mongoose = require('mongoose');
const Debate = mongoose.model('Debate');
const Reply = mongoose.model('Reply');

function simpleSummarize(texts) {
  const text = texts.join(' ').toLowerCase();
  const words = text.match(/[a-zA-Z']+/g) || [];
  const stop = new Set(['the','a','an','and','or','but','of','to','in','on','for','with','is','are','was','were','be','been','it','that','this','as','at','by','from','we','you','they','i']);
  const counts = {};
  words.forEach(w => { if (!stop.has(w) && w.length > 2) counts[w] = (counts[w]||0)+1; });
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(x=>x[0]);
  return `Key themes: ${top.join(', ') || 'n/a'}. Summary generated from ${texts.length} replies.`;
}

async function generateSummary(req, res) {
  try {
    const { id } = req.params;
    const debate = await Debate.findById(id);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (debate.status !== 'closed') return res.status(400).json({ message: 'Summary available after debate is closed' });
    if (debate.summary) return res.json({ summary: debate.summary });

    const replies = await Reply.find({ debateId: id }).sort({ createdAt: 1 }).lean();
    const texts = replies.map(r => r.content);

    let summary;
    const provider = (process.env.AI_PROVIDER || 'stub').toLowerCase();
    if (provider === 'stub' || !process.env.AI_API_KEY) {
      summary = simpleSummarize(texts);
    } else {
      // Placeholder for real provider integration
      summary = simpleSummarize(texts);
    }

    debate.summary = summary;
    await debate.save();
    res.status(201).json({ summary });
  } catch (e) {
    res.status(500).json({ message: 'Failed to generate summary' });
  }
}

async function getSummary(req, res) {
  try {
    const { id } = req.params;
    const debate = await Debate.findById(id).lean();
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (!debate.summary) return res.status(404).json({ message: 'Summary not available' });
    res.json({ summary: debate.summary });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
}

module.exports = { generateSummary, getSummary };
