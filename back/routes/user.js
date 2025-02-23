const sanitizeInput = require('../utils/sanitizer');
const { validateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Créer un user
router.post('/', validateToken, async (req, res) => {
	try {
		const firstName = sanitizeInput(req.body.firstName);
		const lastName = sanitizeInput(req.body.lastName);
		const username = sanitizeInput(req.body.username);
		const email = sanitizeInput(req.body.email);
		const password = sanitizeInput(req.body.password);
		const phoneNumber = sanitizeInput(req.body.phoneNumber);
		const birthday = sanitizeInput(req.body.birthday);
		const gender = sanitizeInput(req.body.gender);
		const country = sanitizeInput(req.body.country);
		const city = sanitizeInput(req.body.city);
		const address = sanitizeInput(req.body.address);
		const zipCode = sanitizeInput(req.body.zipCode);

		if (!firstName || !lastName || !username || !email || !password || !phoneNumber || !birthday || !gender || !country || !city || !address || !zipCode) return res.status(400).send({ message: 'Error : Missing credentials.' });
		if(!isEmailValid(email)) return res.status(400).send({ message: 'Error : Invalid email.' });

		const hashedPassword = await bcrypt.hash(password, 10);

		const signupQuery = await db.query('INSERT INTO users (username, email, password, firstName, lastName, phoneNumber, birthday, gender, country, city, address, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
			[username, email, hashedPassword, firstName, lastName, phoneNumber, birthday, gender, country, city, address, zipCode]
		);

		if (!(signupQuery.affectedRows > 0)) return res.status(500).send({ message: 'Error : Unable to create User.' });
		const userDetails = await getUserDetails(username);
		return res.status(200).send({ message: 'User created successfully.', user: userDetails});
	} catch(error) {
		return res.status(500).send({ message: 'Error : ' + error });
	}
});

// Récupérer tous les users
router.get('/', validateToken, async (req, res) => {
	try {
		const userQuery = await db.query('SELECT users.id AS userID, username, firstname, lastname FROM users');
		return res.status(200).send(userQuery);

	} catch (err) {
		return res.status(500).send({ message: 'Error : Unable to fetch users.', error: err.message });
	}
});

// Récupérer un user par son ID
router.get('/:userID', validateToken, async (req, res) => {
	try {
		const userQuery = await db.query('SELECT users.id AS userID, username, email, firstname, lastname, phoneNumber, address AS address, zipCode, country, city FROM users WHERE id = ?', [req.params.userID]);
		console.log(userQuery);

		if (userQuery.length > 0) return res.status(200).send(userQuery[0]);
		return res.status(404).send({ message: 'Error : user not found.' });

	} catch (err) {
		return res.status(500).send({ message: 'Error : Unable to fetch the user.', error: err.message });
	}
});

router.put('/:id', validateToken, async (req, res) => {
    try {
        const updates = [];
        const values = [];

        // Definition des champs, mot de passe géré plus tard
        const fields = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            username: req.body.username,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            zipCode: req.body.zipCode
        };

        for (let [key, value] of Object.entries(fields)) {
            if (value) {
                updates.push(`${key} = ?`);
                values.push(sanitizeInput(value));
            }
        }

        // Gestion du hash
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(sanitizeInput(req.body.password), 10);
            updates.push("pass = ?");
            values.push(hashedPassword);
        }

        // En cas d'absence de retour, revoie une erreur
        if (!updates.length) return res.status(400).send({ message: 'No fields provided for update.' });

        // Build query
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        values.push(req.params.id);

        const userQuery = await db.query(query, values);

        return userQuery.affectedRows > 0
            ? res.status(200).send({ message: 'User updated successfully.'})
            : res.status(404).send({ message: 'Error: User not found.' });
    } catch (err) {
        return res.status(500).send({ message: 'Error: Unable to update user.', error: err.message });
    }
});

// Suppression d'un user
router.delete('/:userID', validateToken, async (req, res) => {
	try {
		const userQuery = await db.query('DELETE FROM  users WHERE id = ?', [req.params.userID]);

		if (userQuery.affectedRows > 0) return res.status(200).send({ message: 'user deleted successfully.' });
		return res.status(404).send({ message: 'Error : user not found.' });

	} catch (err) {
		return res.status(500).send({ message: 'Error : Unable to delete user.', error: err.message });
	}
});

async function getUserDetails(username) {
	const userDetailsQuery = await db.query('SELECT users.id AS userID, username, firstname, lastname FROM users WHERE username = ?', [username]);
	if (!(userDetailsQuery.length > 0)) return {};
	return userDetailsQuery[0];
}

function isUsernameValid(username) {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,5}$/;
	return regex.test(username);
}

module.exports = router;
