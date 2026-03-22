const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');
const debatesCtrl = require('../controllers/debates');
const repliesCtrl = require('../controllers/replies');
const votesCtrl = require('../controllers/votes');
const aiCtrl = require('../controllers/ai');
const { requireAuth, optionalAuth } = require('../services/auth');

// In-memory SSE client registry per debate
const sseClients = new Map(); // debateId => Set(res)

function getClientSet(debateId) {
  if (!sseClients.has(debateId)) sseClients.set(debateId, new Set());
  return sseClients.get(debateId);
}

function sseBroadcast(debateId, event, payload) {
  const clients = sseClients.get(debateId);
  if (!clients) return;
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload || {});
  for (const res of clients) {
    try {
      res.write(`event: ${event}\n`);
      res.write(`data: ${data}\n\n`);
    } catch (_) {
      // Ignore broken pipe
    }
  }
}

// Expose broadcast globally so controllers can use it without import cycles
// Safe no-op if not set when called
global.__broadcastDebateEvent = sseBroadcast;

// Auth
router.post('/auth/signup', authCtrl.signup);
router.post('/auth/login', authCtrl.login);

// Debates
router.get('/debates', debatesCtrl.list);
router.get('/debates/:id', debatesCtrl.get);
router.post('/debates', requireAuth, debatesCtrl.create);
router.post('/debates/:id/close', requireAuth, debatesCtrl.close);

// SSE stream for real-time debate events (status changes, deletions, etc.)
router.get('/debates/:id/stream', (req, res) => {
  const debateId = req.params.id;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  // Send initial ping to establish stream
  res.write(': connected\n\n');

  const set = getClientSet(debateId);
  set.add(res);

  req.on('close', () => {
    set.delete(res);
    try { res.end(); } catch (_) {}
  });
});

// Replies
router.get('/debates/:id/replies', optionalAuth, repliesCtrl.listByDebate);
router.post('/debates/:id/replies', requireAuth, repliesCtrl.create);
// Update a reply (by debate creator or the reply owner)
router.put('/debates/:id/replies/:replyId', requireAuth, repliesCtrl.update);
// Delete a reply (by debate creator or the reply owner)
router.delete('/debates/:id/replies/:replyId', requireAuth, repliesCtrl.remove);

// Votes
router.get('/debates/:id/votes', votesCtrl.tally);
router.post('/debates/:id/votes', requireAuth, votesCtrl.vote);

// AI Summary
router.post('/debates/:id/summary', requireAuth, aiCtrl.generateSummary);
router.get('/debates/:id/summary', aiCtrl.getSummary);

// Delete a closed debate (by debate creator)
router.delete('/debates/:id', requireAuth, debatesCtrl.remove);

module.exports = router;
