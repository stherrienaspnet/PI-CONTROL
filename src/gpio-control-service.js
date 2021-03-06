"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MQTT = require("mqtt");
var Promise = require("bluebird");
var events_1 = require("events");
var gpio_model_1 = require("./gpio.model");
var rpio = require('rpio');
var GPIOControlService = (function (_super) {
    __extends(GPIOControlService, _super);
    function GPIOControlService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.SERVER_URL = 'mqtt://iot.eclipse.org:1883';
        _this.REQUEST = 'request';
        _this.RESPONSE = 'response';
        _this.deviceId = 'abc';
        _this.onConnect = function () {
            var topicUrl = _this.getBaseTopicUrl() + "+";
            _this.subscribe(topicUrl).then(function (result) {
                _this.connectResolve(result);
            });
        };
        _this.onMessage = function (topicUrl, message) {
            var topicFilter = "" + _this.getBaseTopicUrl() + gpio_model_1.MessageType.REQUEST.toLowerCase();
            if (topicUrl != topicFilter)
                return;
            var command = message.toString();
            _this.execute(command);
            _this.ackCommand(command);
        };
        _this.subscribeCallback = function () {
            _this.subscribeResolve(true);
        };
        return _this;
    }
    GPIOControlService.prototype.addEventListeners = function () {
        this.client.addListener('connect', this.onConnect);
        this.client.addListener('message', this.onMessage);
    };
    GPIOControlService.prototype.removeEventListeners = function () {
        this.client.removeAllListeners('connect');
        this.client.removeAllListeners('message');
        this.client.removeAllListeners('close');
    };
    GPIOControlService.prototype.getBaseTopicUrl = function () {
        return "pi-robot/" + this.deviceId + "/control/";
    };
    GPIOControlService.prototype.reset = function () {
        rpio.write(gpio_model_1.MotorGPIO.LEFT_FORWARD, rpio.LOW);
        rpio.write(gpio_model_1.MotorGPIO.LEFT_REVERSE, rpio.LOW);
        rpio.write(gpio_model_1.MotorGPIO.RIGHT_FORWARD, rpio.LOW);
        rpio.write(gpio_model_1.MotorGPIO.RIGHT_REVERSE, rpio.LOW);
    };
    GPIOControlService.prototype.moveLeft = function () {
        rpio.write(gpio_model_1.MotorGPIO.LEFT_FORWARD, rpio.HIGH);
        rpio.write(gpio_model_1.MotorGPIO.RIGHT_REVERSE, rpio.HIGH);
    };
    GPIOControlService.prototype.moveRight = function () {
        rpio.write(gpio_model_1.MotorGPIO.RIGHT_FORWARD, rpio.HIGH);
        rpio.write(gpio_model_1.MotorGPIO.LEFT_REVERSE, rpio.HIGH);
    };
    GPIOControlService.prototype.moveFormard = function () {
        rpio.write(gpio_model_1.MotorGPIO.LEFT_FORWARD, rpio.HIGH);
        rpio.write(gpio_model_1.MotorGPIO.RIGHT_FORWARD, rpio.HIGH);
    };
    GPIOControlService.prototype.moveReverse = function () {
        rpio.write(gpio_model_1.MotorGPIO.LEFT_REVERSE, rpio.HIGH);
        rpio.write(gpio_model_1.MotorGPIO.RIGHT_REVERSE, rpio.HIGH);
    };
    GPIOControlService.prototype.execute = function (command) {
        this.reset();
        switch (command) {
            case gpio_model_1.ActionType.MOVE_LEFT:
                this.moveLeft();
                break;
            case gpio_model_1.ActionType.MOVE_RIGHT:
                this.moveRight();
                break;
            case gpio_model_1.ActionType.MOVE_FORWARD:
                this.moveFormard();
                break;
            case gpio_model_1.ActionType.MOVE_REVERSE:
                this.moveReverse();
                break;
            default:
                break;
        }
    };
    GPIOControlService.prototype.configurePort = function () {
        var options = {
            gpiomem: true,
            mapping: 'physical',
        };
        rpio.init(options);
        rpio.open(gpio_model_1.MotorGPIO.LEFT_FORWARD, rpio.OUTPUT, rpio.LOW);
        rpio.open(gpio_model_1.MotorGPIO.LEFT_REVERSE, rpio.OUTPUT, rpio.LOW);
        rpio.open(gpio_model_1.MotorGPIO.RIGHT_FORWARD, rpio.OUTPUT, rpio.LOW);
        rpio.open(gpio_model_1.MotorGPIO.RIGHT_REVERSE, rpio.OUTPUT, rpio.LOW);
    };
    GPIOControlService.prototype.subscribe = function (topicUrl) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.subscribeResolve = resolve;
            _this.client.subscribe(topicUrl, _this.subscribeCallback);
        });
    };
    GPIOControlService.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client = MQTT.connect(_this.SERVER_URL);
            _this.connectResolve = resolve;
            _this.addEventListeners();
        });
    };
    GPIOControlService.prototype.ackCommand = function (command) {
        var topicUrl = "" + this.getBaseTopicUrl() + gpio_model_1.MessageType.RESPONSE.toLowerCase();
        this.client.publish(topicUrl, command);
    };
    return GPIOControlService;
}(events_1.EventEmitter));
exports.GPIOControlService = GPIOControlService;
//# sourceMappingURL=gpio-control-service.js.map