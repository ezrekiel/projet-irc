const sanitizeInput = require('../utils/sanitizer');
const { validateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const router = express.Router();

// Créer un channel
router.post('/', validateToken, async (req, res) => {
	const channelName = sanitizeInput(req.body.channelName);

	if (!channelName) return res.status(400).send({ message: 'Error : Missing information.' });

	try {
		const channelQuery = await db.query('INSERT INTO channels (channelName) VALUES (?)', [channelName]);
		
		if (channelQuery.affectedRows > 0) return res.status(200).send({ message: 'channel created successfully.'});
		return res.status(500).send({ message: 'Error : Unable to create channel.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to create channel.', error: err.message });
	}
});

// Récupérer tous les channels
router.get('/', validateToken, async (req, res) => {
	try {
		const channelQuery = await db.query('SELECT * FROM channels');
		return res.status(200).send(channelQuery);

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch channels.', error: err.message });
	}
});

// Récuperer un channel par ID
router.get('/:channelID', validateToken, async (req, res) => {
	try {
		const channelQuery = await db.query('SELECT * FROM channels WHERE id = ?', [req.params.channelID]);

		if (channelQuery.length > 0) return res.status(200).send(channelQuery[0]);
		return res.status(404).send({ message: 'Error : channel not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch the channel.', error: err.message });
	}
});

// Modifier un channel
router.put('/:channelID', validateToken, async (req, res) => {
	const channelName = sanitizeInput(req.body.channelName);

	try {
		const channelQuery = await db.query('UPDATE channels SET channelName = ? WHERE id = ?', [channelName, req.params.channelID]);

		if (channelQuery.affectedRows > 0) return res.status(200).send({ message: 'channel updated successfully.' });
		return res.status(404).send({ message: 'Error : channel not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to update channel.', error: err.message });
	}
});

// Supprimer un channel
router.delete('/:channelID', validateToken, async (req, res) => {
	try {
		const channelQuery = await db.query('DELETE FROM channels WHERE id = ?', [req.params.channelID]);

		if (channelQuery.affectedRows > 0) return res.status(200).send({ message: 'channel deleted successfully.' });
		return res.status(404).send({ message: 'Error : channel not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to delete channel.', error: err.message });
	}
});

module.exports = router;