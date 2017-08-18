"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageType = (function () {
    function MessageType() {
    }
    MessageType.resolve = function (topicUrl) {
        var paths = topicUrl.split('/');
        var messageType = paths[paths.length - 1].toUpperCase();
        switch (messageType) {
            case this.REQUEST:
                return this.REQUEST;
            case this.RESPONSE:
                return this.RESPONSE;
            default:
                return this.UNKNOWN;
        }
    };
    return MessageType;
}());
MessageType.REQUEST = 'REQUEST';
MessageType.RESPONSE = 'RESPONSE';
MessageType.UNKNOWN = 'UNKNOWN';
exports.MessageType = MessageType;
var ActionType = (function () {
    function ActionType() {
    }
    ActionType.resolve = function (action) {
        switch (action) {
            case ActionType.MOVE_FORWARD:
                return ActionType.MOVE_FORWARD;
            case ActionType.MOVE_REVERSE:
                return ActionType.MOVE_REVERSE;
            case ActionType.MOVE_LEFT:
                return ActionType.MOVE_LEFT;
            case ActionType.MOVE_RIGHT:
                return ActionType.MOVE_RIGHT;
            default:
                return ActionType.UNKNOWN;
        }
    };
    return ActionType;
}());
ActionType.STOP = 'STOP';
ActionType.MOVE_FORWARD = 'MOVE_FORWARD';
ActionType.MOVE_REVERSE = 'MOVE_REVERSE';
ActionType.MOVE_LEFT = 'MOVE_LEFT';
ActionType.MOVE_RIGHT = 'MOVE_RIGHT';
ActionType.LINK_DEVICE = 'LINK_DEVICE';
ActionType.UNLINK_DEVICE = 'UNLINK_DEVICE';
ActionType.UNKNOWN = 'UNKNOWN';
exports.ActionType = ActionType;
var ColorType = (function () {
    function ColorType() {
    }
    return ColorType;
}());
ColorType.ACTIVE_COLOR = 'navy';
ColorType.UNACTIVE_COLOR = '#2196F3';
ColorType.ENERGIZE_COLOR = 'lime';
ColorType.UNENERGIZE_COLOR = '#FFF';
exports.ColorType = ColorType;
