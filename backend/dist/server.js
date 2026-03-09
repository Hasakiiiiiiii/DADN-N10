"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const auth_1 = __importDefault(require("./routes/auth"));
const devices_1 = __importDefault(require("./routes/devices"));
const logs_1 = __importDefault(require("./routes/logs"));
const mqtt_1 = require("./services/mqtt");
const db_1 = require("./db");
const seed_1 = require("./seed");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('tiny'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', auth_1.default);
app.use('/api/devices', devices_1.default);
app.use('/api/logs', logs_1.default);
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});
async function start() {
    try {
        await (0, db_1.connectDb)();
        await (0, seed_1.ensureDefaultAdmin)();
        await (0, seed_1.ensureDefaultEmployee)();
        (0, mqtt_1.connectMqtt)();
        const server = app.listen(config_1.PORT, () => {
            console.log(`🚀 Backend listening on http://localhost:${config_1.PORT}`);
        });
        process.on('SIGINT', () => {
            server.close(() => {
                console.log('Server stopped');
                process.exit(0);
            });
        });
    }
    catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
}
start();
