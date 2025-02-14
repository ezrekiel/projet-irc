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
		const messageQuery = await db.query('SELECT * FROM messages');
		return res.status(200).send(messageQuery);

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch messages.', error: err.message });
	}
});

// Récupérer un message par ID
router.get('/:messageID', validateToken, async (req, res) => {
	try {
		const messageQuery = await db.query('SELECT * FROM messages WHERE messageID = ?', [req.params.messageID]);

		if (messageQuery.length > 0) return res.status(200).send(messageQuery[0]);
		return res.status(404).send({ message: 'Error : message not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch the message.', error: err.message });
	}
});

// Modifier un message
router.put('/:messageID', validateToken, async (req, res) => {
	const messageName = sanitizeInput(req.body.messageName);

	try {
		const messageQuery = await db.query('UPDATE message SET messageName = ? WHERE messageID = ?', [chatName, req.params.messageID]);

		if (messageQuery.affectedRows > 0) return res.status(200).send({ message: 'message updated successfully.' });
		return res.status(404).send({ message: 'Error : message not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to update message.', error: err.message });
	}
});

// Supprimer un message
router.delete('/:messageID', validateToken, async (req, res) => {
	try {
		const messageQuery = await db.query('DELETE FROM messages WHERE messageID = ?', [req.params.messageID]);

		if (messageQuery.affectedRows > 0) return res.status(200).send({ message: 'message deleted successfully.' });
		return res.status(404).send({ message: 'Error : message not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to delete message.', error: err.message });
	}
});

module.exports = router;