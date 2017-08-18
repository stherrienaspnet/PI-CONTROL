import * as MQTT from 'mqtt';
import * as Promise from 'bluebird';
import {EventEmitter} from 'events';
import {MessageType} from '../../PI-ROBOT/src/app/gpio.model'

export class GPIOControlService extends EventEmitter {
    private readonly SERVER_URL: string = 'mqtt://iot.eclipse.org:1883';
    private readonly REQUEST: string = 'request';
    private readonly RESPONSE: string = 'response';

    private client: MQTT.Client;
    private deviceId: string = 'abc';
    private connectResolve: (...args: any[]) => void;
    private disconnectResolve: (...args: any[]) => void;
    private subscribeResolve: (...args: any[]) => void;
    private publishResolve: (...args: any[]) => void;

    private addEventListeners(): void {
        this.client.addListener('connect', this.onConnect);
        this.client.addListener('message', this.onMessage);
        this.client.addListener('close', this.onClose);
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

    private onMessage = (topicUrl: string, message: Uint8Array) => {
        const topicFilter: string = `${this.getBaseTopicUrl()}${MessageType.REQUEST.toLowerCase()}`;
        if (topicUrl != topicFilter) return;
        const command: string = message.toString();
        this.ackCommand(command);
    }

    private onClose = () => { }

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

    unlinkDevice(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.client.end();
            resolve(true);
        });
    }

    private ackCommand(command: string): void {
        const topicUrl: string = `${this.getBaseTopicUrl()}${MessageType.RESPONSE.toLowerCase()}`;
        this.client.publish(topicUrl, command);
    }
}
