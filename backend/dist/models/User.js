"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true, enum: ['admin', 'employee'], default: 'employee' },
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    passwordHash: { type: String, required: true },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
