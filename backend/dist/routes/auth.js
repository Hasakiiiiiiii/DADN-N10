"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
function createUserResponse(user) {
    return {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        name: user.name,
        phone: user.phone,
        address: user.address,
    };
}
router.post('/login', async (req, res) => {
    const { email, username, password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    const query = {};
    if (email) {
        query.email = email.toLowerCase().trim();
    }
    else if (username) {
        query.username = username.trim();
    }
    else {
        return res.status(400).json({ error: 'Email or username is required' });
    }
    const user = await User_1.User.findOne(query).exec();
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), email: user.email, role: user.role }, config_1.JWT_SECRET, {
        expiresIn: '8h',
    });
    return res.json({ token, user: createUserResponse(user) });
});
router.get('/me', auth_1.requireAuth, async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User_1.User.findById(req.user.id).exec();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: createUserResponse(user) });
});
router.put('/profile', auth_1.requireAuth, async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const patch = req.body;
    const update = {};
    if (patch.name !== undefined)
        update.name = patch.name;
    if (patch.phone !== undefined)
        update.phone = patch.phone;
    if (patch.address !== undefined)
        update.address = patch.address;
    if (patch.email !== undefined)
        update.email = patch.email.toLowerCase().trim();
    if (patch.username !== undefined)
        update.username = patch.username.trim();
    const user = await User_1.User.findByIdAndUpdate(req.user.id, update, { new: true }).exec();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: createUserResponse(user) });
});
router.post('/password', auth_1.requireAuth, async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'oldPassword and newPassword are required' });
    }
    const user = await User_1.User.findById(req.user.id).exec();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcryptjs_1.default.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
        return res.status(403).json({ error: 'Old password is incorrect' });
    }
    user.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
    await user.save();
    return res.json({ success: true });
});
exports.default = router;
