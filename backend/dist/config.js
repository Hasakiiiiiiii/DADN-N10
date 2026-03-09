"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTT_BASE_TOPIC = exports.MQTT_URL = exports.DEFAULT_ADMIN_PASSWORD = exports.DEFAULT_ADMIN_USERNAME = exports.DEFAULT_ADMIN_EMAIL = exports.MONGO_URL = exports.JWT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), envFile) });
exports.PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
exports.JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
exports.MONGO_URL = process.env.MONGO_URL ?? 'mongodb://mongo:27017/control-panel';
exports.DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@example.com';
exports.DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
exports.DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'ad12';
exports.MQTT_URL = process.env.MQTT_URL ?? 'mqtt://mosquitto:1883';
exports.MQTT_BASE_TOPIC = process.env.MQTT_BASE_TOPIC ?? 'devices';
