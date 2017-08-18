"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gpio_control_service_1 = require("./src/gpio-control-service");
var controlService = new gpio_control_service_1.GPIOControlService();
var connectPromise = controlService.connect();
connectPromise.then(function (response) {
    console.log('control connected!');
});
