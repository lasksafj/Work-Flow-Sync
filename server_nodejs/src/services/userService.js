const db = require('../config/db');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../utils/token');

exports.registerUser = async (userData) => {
    const { email, password, lastName, firstName, phoneNumber, dateOfBirth } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(userData);
    const result = await db.query(
        'INSERT INTO users (email, password, last_name, first_name, phone_number, date_of_birth) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [email, hashedPassword, lastName, firstName, phoneNumber, dateOfBirth]
    );
    return result.rows[0];
};

exports.loginUser = async (userData) => {
    const { email, password } = userData;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid password');
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);
    const profile = {
        email: user.email,
        lastName: user.last_name,
        firstName: user.first_name,
        phoneNumber: user.phone_number,
        dateOfBirth: user.date_of_birth,
        avatar: user.avatar
    }
    return { accessToken, refreshToken, profile };
};

exports.refreshToken = async (token) => {
    // console.log('refresh', token);
    const decoded = verifyRefreshToken(token);
    // console.log('decoded', decoded);
    const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    // console.log(user);
    if (!user) throw new Error('Invalid refresh token');

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // await db.query('UPDATE users SET refreshToken = ? WHERE id = ?', [refreshToken, user.id]);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    return { accessToken, refreshToken };
};

exports.verifyUser = async (accessToken) => {
    const decoded = verifyAccessToken(accessToken);
    const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    if (!user) throw new Error('Invalid access token');

    const profile = {
        email: user.email,
        lastName: user.last_name,
        firstName: user.first_name,
        phoneNumber: user.phone_number,
        dateOfBirth: user.date_of_birth,
        avatar: user.avatar
    }
    return { profile };
}