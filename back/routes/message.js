const sanitizeInput = require('../utils/sanitizer');
const { validateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const router = express.Router();

// Créer un message
router.post('/', validateToken, async (req, res) => {
	const messageContent = sanitizeInput(req.body.messageContent);
	const messageSender = sanitizeInput(req.body.messageSender);
	const messageReceiver = sanitizeInput(req.body.messageReceiver);
	const messageChannel = sanitizeInput(req.body.messageChannel);

	if (!messageContent) return res.status(400).send({ message: 'Erreur : Message vide.' });

	if (!messageReceiver) {
		try {
			const messageQuery = await db.query('INSERT INTO messages (content, senderID, channelID) VALUES (?, ?, ?)', [messageContent, messageSender, messageChannel]);
			
			if (messageQuery.affectedRows > 0) return res.status(200).send({ message: 'message created successfully.'});
			return res.status(500).send({ message: 'Error : Unable to create message.' });
	
		} catch (err) {
			res.status(500).send({ message: 'Error : Unable to create message.', error: err.message });
		}
	}

	if (messageReceiver) {
		try {
			const messageQuery = await db.query('INSERT INTO messages (content, senderID, receiverID) VALUES (?, ?, ?)', [messageContent, messageSender, messageReceiver]);
			
			if (messageQuery.affectedRows > 0) return res.status(200).send({ message: 'message created successfully.'});
			return res.status(500).send({ message: 'Error : Unable to create message.' });
	
		} catch (err) {
			res.status(500).send({ message: 'Error : Unable to create message.', error: err.message });
		}
	}
});

// Récupérer tous les messages
router.get('/', validateToken, async (req, res) => {
	try {
		const resourceQuery = await db.query('SELECT * FROM resource');
		return res.status(200).send(resourceQuery);

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch resources.', error: err.message });
	}
});

// Récupérer un message par ID
router.get('/:resourceID', validateToken, async (req, res) => {
	try {
		const resourceQuery = await db.query('SELECT * FROM resource WHERE resourceID = ?', [req.params.resourceID]);

		if (resourceQuery.length > 0) return res.status(200).send(resourceQuery[0]);
		return res.status(404).send({ message: 'Error : resource not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch the resource.', error: err.message });
	}
});

// Modifier un message
router.put('/:resourceID', validateToken, async (req, res) => {
	const resourceName = sanitizeInput(req.body.resourceName);

	try {
		const resourceQuery = await db.query('UPDATE resource SET resourceName = ? WHERE resourceID = ?', [chatName, req.params.resourceID]);

		if (resourceQuery.affectedRows > 0) return res.status(200).send({ message: 'resource updated successfully.' });
		return res.status(404).send({ message: 'Error : resource not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to update resource.', error: err.message });
	}
});

// Supprimer un message
router.delete('/:resourceID', validateToken, async (req, res) => {
	try {
		const resourceQuery = await db.query('DELETE FROM resource WHERE resourceID = ?', [req.params.resourceID]);

		if (resourceQuery.affectedRows > 0) return res.status(200).send({ message: 'resource deleted successfully.' });
		return res.status(404).send({ message: 'Error : resource not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to delete resource.', error: err.message });
	}
});

module.exports = router;