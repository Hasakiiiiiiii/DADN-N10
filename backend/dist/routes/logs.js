"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLog = addLog;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const logs = [];
function addLog(entry) {
    logs.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        timestamp: new Date().toISOString(),
        ...entry,
    });
    if (logs.length > 500)
        logs.pop();
}
router.get('/', auth_1.requireAuth, (req, res) => {
    const limit = Number(req.query.limit || 50);
    res.json({ logs: logs.slice(0, Math.min(limit, logs.length)) });
});
exports.default = router;
