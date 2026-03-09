"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDefaultAdmin = ensureDefaultAdmin;
exports.ensureDefaultEmployee = ensureDefaultEmployee;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("./models/User");
const config_1 = require("./config");
async function ensureDefaultAdmin() {
    const existing = await User_1.User.findOne({ role: 'admin' }).exec();
    if (existing) {
        return;
    }
    const passwordHash = await bcryptjs_1.default.hash(config_1.DEFAULT_ADMIN_PASSWORD, 10);
    await User_1.User.create({
        email: config_1.DEFAULT_ADMIN_EMAIL,
        username: config_1.DEFAULT_ADMIN_USERNAME,
        role: 'admin',
        passwordHash,
        name: 'Admin',
    });
    console.log('Created default admin user', config_1.DEFAULT_ADMIN_EMAIL);
}
async function ensureDefaultEmployee() {
    const existing = await User_1.User.findOne({ role: 'employee' }).exec();
    if (existing) {
        return;
    }
    const passwordHash = await bcryptjs_1.default.hash('em1', 10);
    await User_1.User.create({
        email: 'employee@example.com',
        username: 'employee',
        role: 'employee',
        passwordHash,
        name: 'Employee',
    });
    console.log('Created default employee user employee@example.com');
}
