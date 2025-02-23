const sanitizeInput = require('../utils/sanitizer');
const { generateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/signin', async (req, res) => {
	try {
		const email = sanitizeInput(req.body.email);
		const password = sanitizeInput(req.body.password);
		if (!email || !password) return res.status(400).send({ message: 'Error : Missing credentials.' });

		const hashedPassword = await db.getHashedPasswordForUser(email);
		const bcryptResult = await bcrypt.compare(password, hashedPassword);
		if (!bcryptResult) return res.status(401).send({ message: 'Invalid credentials!' });

		const token = generateToken({ email });
		const userDetails = await getUserDetails(email);
		const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
		const expiryDate = new Date((Date.now() - timeZoneOffset) + 3600000).toISOString();
		return res.status(200).send({ message: 'Login successful!', token: token, user: userDetails, expiryDate: expiryDate });
	} catch(error) {
		return res.status(500).send({ message: 'Error : ' + error });
	}
});

router.post('/signup', async (req, res) => {
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

async function getUserDetails(username) {
	const userDetailsQuery = await db.query('SELECT users.id AS userID, username, email, firstname, lastname FROM users WHERE username = ?', [username]);
	if (!(userDetailsQuery.length > 0)) return {};
	return userDetailsQuery[0];
}

function isEmailValid(email) {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,5}$/;
	return regex.test(email);
}

module.exports = router;
