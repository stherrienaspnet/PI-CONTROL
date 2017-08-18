import * as Promise from 'bluebird';

export class MessageType {
  static readonly REQUEST: string = 'REQUEST';
  static readonly RESPONSE: string = 'RESPONSE';
  static readonly UNKNOWN: string = 'UNKNOWN';

  public static resolve(topicUrl: string): string {
    const paths: string[] = topicUrl.split('/');
    const messageType: string = paths[paths.length - 1].toUpperCase();

    switch (messageType){
      case this.REQUEST:
        return this.REQUEST;
      case this.RESPONSE:
        return this.RESPONSE;
      default:
        return this.UNKNOWN;
    }
  }
}

export class ActionType {
  static readonly STOP: string = 'STOP';
  static readonly MOVE_FORWARD: string = 'MOVE_FORWARD';
  static readonly MOVE_REVERSE: string = 'MOVE_REVERSE';
  static readonly MOVE_LEFT: string = 'MOVE_LEFT';
  static readonly MOVE_RIGHT: string = 'MOVE_RIGHT';
  static readonly LINK_DEVICE:string = 'LINK_DEVICE';
  static readonly UNLINK_DEVICE:string = 'UNLINK_DEVICE';
  static readonly UNKNOWN: string = 'UNKNOWN';

  public static resolve(action: string): string {
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
  }
}

export class ColorType{
  static readonly ACTIVE_COLOR: string = 'navy';
  static readonly UNACTIVE_COLOR: string = '#2196F3';
  static readonly ENERGIZE_COLOR: string = 'lime';
  static readonly UNENERGIZE_COLOR: string = '#FFF';
}

export class MotorGPIO{
    static readonly LEFT_FORWARD: number = 13;
    static readonly LEFT_REVERSE: number = 15;
    static readonly RIGHT_FORWARD: number = 16;
    static readonly RIGHT_REVERSE: number = 18;
}

export interface GPIOServicable {
  linkDevice(deviceId: string): Promise<boolean>;

  unlinkDevice(): Promise<boolean>;

  commandDevice(command: string): void;

  addListener(event: string | symbol, listener: Function): this;

  removeListener(event: string | symbol, listener: Function): this;
}
