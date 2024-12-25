import { Server } from 'http';

export interface IApplication {
    listen(port?: number): Server;
}
