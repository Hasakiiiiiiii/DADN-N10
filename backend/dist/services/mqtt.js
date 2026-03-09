"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMqtt = connectMqtt;
exports.getDeviceStatus = getDeviceStatus;
exports.listDevices = listDevices;
exports.sendCommand = sendCommand;
const mqtt_1 = __importDefault(require("mqtt"));
const config_1 = require("../config");
const deviceStatus = {};
let client = null;
function connectMqtt() {
    if (client)
        return client;
    client = mqtt_1.default.connect(config_1.MQTT_URL);
    client.on('connect', () => {
        console.log('MQTT connected to', config_1.MQTT_URL);
        client?.subscribe(`${config_1.MQTT_BASE_TOPIC}/+/status`, { qos: 0 }, err => {
            if (err)
                console.warn('MQTT subscribe error', err);
        });
    });
    client.on('message', (_, message, packet) => {
        const topic = packet.topic ?? '';
        const match = topic.match(new RegExp(`${config_1.MQTT_BASE_TOPIC}/([^/]+)/status`));
        if (!match)
            return;
        const deviceId = match[1];
        try {
            const payload = JSON.parse(message.toString());
            deviceStatus[deviceId] = {
                id: deviceId,
                online: true,
                lastSeen: new Date().toISOString(),
                values: payload,
            };
        }
        catch (e) {
            console.warn('Failed to parse MQTT status payload for', deviceId, e);
        }
    });
    client.on('error', err => {
        console.error('MQTT error', err);
    });
    client.on('offline', () => {
        console.warn('MQTT offline');
    });
    return client;
}
function getDeviceStatus(deviceId) {
    return deviceStatus[deviceId] ?? null;
}
function listDevices() {
    return Object.values(deviceStatus);
}
function sendCommand(deviceId, command) {
    if (!client)
        connectMqtt();
    const topic = `${config_1.MQTT_BASE_TOPIC}/${deviceId}/command`;
    if (!client)
        throw new Error('MQTT client not initialized');
    client.publish(topic, JSON.stringify(command), { qos: 0 });
}
