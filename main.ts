import {GPIOControlService} from "./src/gpio-control-service";
import * as Promise from 'bluebird';

const controlService: GPIOControlService = new GPIOControlService();
const connectPromise : Promise<boolean> = controlService.connect();
connectPromise.then((response) => {
    console.log('control connected!')
});
