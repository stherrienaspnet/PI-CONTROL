import * as MQTT from 'mqtt';
import * as Promise from 'bluebird';
import {EventEmitter} from 'events';
import {ActionType, MessageType, MotorGPIO} from "./gpio.model";

var rpio = require('rpio');

export class GPIOControlService extends EventEmitter {

    private readonly SERVER_URL: string = 'mqtt://iot.eclipse.org:1883';
    private readonly REQUEST: string = 'request';
    private readonly RESPONSE: string = 'response';

    private client: MQTT.Client;
    private deviceId: string = 'abc';
    private connectResolve: (...args: any[]) => void;
    private subscribeResolve: (...args: any[]) => void;
    private publishResolve: (...args: any[]) => void;

    constructor(){
        super();
        this.configurePort();
    }
    
    private addEventListeners(): void {
        this.client.addListener('connect', this.onConnect);
        this.client.addListener('message', this.onMessage);
    }

    private removeEventListeners(): void {
        this.client.removeAllListeners('connect');
        this.client.removeAllListeners('message');
        this.client.removeAllListeners('close');
    }

    private getBaseTopicUrl(): string {
        return `pi-robot/${this.deviceId}/control/`;
    }

    private onConnect: () => any = () => {
        const topicUrl: string = `${this.getBaseTopicUrl()}+`;
        this.subscribe(topicUrl).then((result: boolean) => {
            this.connectResolve(result);
        });
    };

    private reset() {
        rpio.write(MotorGPIO.LEFT_FORWARD, rpio.LOW);
        rpio.write(MotorGPIO.LEFT_REVERSE, rpio.LOW);
        rpio.write(MotorGPIO.RIGHT_FORWARD, rpio.LOW);
        rpio.write(MotorGPIO.RIGHT_REVERSE, rpio.LOW);
    }

    private moveLeft(): void {
        rpio.write(MotorGPIO.LEFT_FORWARD, rpio.HIGH);
        rpio.write(MotorGPIO.RIGHT_REVERSE, rpio.HIGH);
    }

    private moveRight(): void {
        rpio.write(MotorGPIO.RIGHT_FORWARD, rpio.HIGH);
        rpio.write(MotorGPIO.LEFT_REVERSE, rpio.HIGH);
    }

    private moveFormard(): void {
        rpio.write(MotorGPIO.LEFT_FORWARD, rpio.HIGH);
        rpio.write(MotorGPIO.RIGHT_FORWARD, rpio.HIGH);
    }

    private moveReverse(): void {
        rpio.write(MotorGPIO.LEFT_REVERSE, rpio.HIGH);
        rpio.write(MotorGPIO.RIGHT_REVERSE, rpio.HIGH);
    }


    private execute(command: string): void {
        this.reset();

        switch (command) {
            case ActionType.MOVE_LEFT:
                this.moveLeft();
                break;
            case ActionType.MOVE_RIGHT:
                this.moveRight();
                break;
            case ActionType.MOVE_FORWARD:
                this.moveFormard();
                break;
            case ActionType.MOVE_REVERSE:
                this.moveReverse();
                break;
            default:
                break;
        }
    }

    private configurePort(): void {
        var options = {
            gpiomem: true, /* Use /dev/gpiomem */
            mapping: 'physical', /* Use the P1-P40 numbering scheme */
        }

        rpio.init(options);
        rpio.open(MotorGPIO.LEFT_FORWARD, rpio.OUTPUT, rpio.LOW);
        rpio.open(MotorGPIO.LEFT_REVERSE, rpio.OUTPUT, rpio.LOW);
        rpio.open(MotorGPIO.RIGHT_FORWARD, rpio.OUTPUT, rpio.LOW);
        rpio.open(MotorGPIO.RIGHT_REVERSE, rpio.OUTPUT, rpio.LOW);
    }

    private onMessage = (topicUrl: string, message: Uint8Array) => {
        const topicFilter: string = `${this.getBaseTopicUrl()}${MessageType.REQUEST.toLowerCase()}`;
        if (topicUrl != topicFilter) return;
        const command: string = message.toString();
        this.execute(command);
        this.ackCommand(command);
    }

    private subscribeCallback: () => any = () => {
        this.subscribeResolve(true);
    };

    private subscribe(topicUrl: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.subscribeResolve = resolve;
            this.client.subscribe(topicUrl, this.subscribeCallback);
        });
    }

    connect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.client = MQTT.connect(this.SERVER_URL);
            this.connectResolve = resolve;
            this.addEventListeners();

        });
    }

    private ackCommand(command: string): void {
        const topicUrl: string = `${this.getBaseTopicUrl()}${MessageType.RESPONSE.toLowerCase()}`;
        this.client.publish(topicUrl, command);
    }
}
