const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Constants
const VALID_VOICES = ['Alloy', 'Echo', 'Fable', 'Onyx', 'Nova', 'Shimmer'];
const VALID_PREFERENCES = ['selectedVoice', 'playbackRate', 'upliftingNewsOnly', 'lastFetchedTopics', 'selectedNewsSources'];

// Get user preferences
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = user.getPreferences();
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user preferences
router.put('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { selectedVoice, playbackRate, upliftingNewsOnly, lastFetchedTopics } = req.body;
    
    // Validate input
    if (selectedVoice && !VALID_VOICES.includes(selectedVoice)) {
      return res.status(400).json({ error: 'Invalid voice selection' });
    }

    if (playbackRate !== undefined && (playbackRate < 0.5 || playbackRate > 2.0)) {
      return res.status(400).json({ error: 'Playback rate must be between 0.5 and 2.0' });
    }

    if (lastFetchedTopics && !Array.isArray(lastFetchedTopics)) {
      return res.status(400).json({ error: 'lastFetchedTopics must be an array' });
    }

    const preferences = await user.updatePreferences({
      selectedVoice,
      playbackRate,
      upliftingNewsOnly,
      lastFetchedTopics
    });

    res.json(preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update specific preference
router.patch('/:preference', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { preference } = req.params;
    const { value } = req.body;

    // Validate preference name
    if (!VALID_PREFERENCES.includes(preference)) {
      return res.status(400).json({ error: 'Invalid preference name' });
    }

    // Validate value based on preference type
    if (preference === 'selectedVoice') {
      if (!VALID_VOICES.includes(value)) {
        return res.status(400).json({ error: 'Invalid voice selection' });
      }
    } else if (preference === 'playbackRate') {
      if (value < 0.5 || value > 2.0) {
        return res.status(400).json({ error: 'Playback rate must be between 0.5 and 2.0' });
      }
    } else if (preference === 'upliftingNewsOnly') {
      if (typeof value !== 'boolean') {
        return res.status(400).json({ error: 'upliftingNewsOnly must be a boolean' });
      }
    } else if (preference === 'lastFetchedTopics') {
      if (!Array.isArray(value)) {
        return res.status(400).json({ error: 'lastFetchedTopics must be an array' });
      }
    } else if (preference === 'selectedNewsSources') {
      if (!Array.isArray(value)) {
        return res.status(400).json({ error: 'selectedNewsSources must be an array' });
      }
      if (value.length > 20) {
        return res.status(400).json({ error: 'Maximum 20 news sources allowed' });
      }
    }

    const updateData = { [preference]: value };
    const preferences = await user.updatePreferences(updateData);

    res.json(preferences);
  } catch (error) {
    console.error('Error updating user preference:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
