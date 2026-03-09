"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const mqtt_1 = require("../services/mqtt");
const router = (0, express_1.Router)();
// List currently known devices (from MQTT status updates)
router.get('/', auth_1.requireAuth, (_req, res) => {
    const devices = (0, mqtt_1.listDevices)();
    res.json({ devices });
});
router.get('/:id/status', auth_1.requireAuth, (req, res) => {
    const deviceId = String(req.params.id);
    const status = (0, mqtt_1.getDeviceStatus)(deviceId);
    if (!status) {
        return res.status(404).json({ error: 'Device not found' });
    }
    res.json({ status });
});
router.post('/:id/command', auth_1.requireAuth, (req, res) => {
    const deviceId = String(req.params.id);
    const command = req.body;
    if (!command || typeof command !== 'object') {
        return res.status(400).json({ error: 'Command must be an object' });
    }
    try {
        (0, mqtt_1.sendCommand)(deviceId, command);
        res.json({ status: 'sent', deviceId, command });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to send command', details: err.message });
    }
});
exports.default = router;
