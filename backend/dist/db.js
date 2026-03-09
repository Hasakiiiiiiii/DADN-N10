"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
async function connectDb() {
    if (mongoose_1.default.connection.readyState === 1)
        return mongoose_1.default;
    mongoose_1.default.set('strictQuery', true);
    await mongoose_1.default.connect(config_1.MONGO_URL);
    console.log('MongoDB connected to', config_1.MONGO_URL);
    return mongoose_1.default;
}
