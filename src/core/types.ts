import { Server } from 'http';

export interface IApplicationOptions {
    controllers: Function[];
}

export interface IApplication {
    listen(port?: number): Server;
}

export interface IModel {
}

export interface IMessage<Payload> {
    type: string;
    payload?: Payload;
}

export interface IUpdate<M extends IModel, Msg extends IMessage<unknown>> {
    (model: M, message: Msg): M;
}

export interface IView<M extends IModel, Msg extends IMessage<unknown>> {
    (model: M): Msg;
}
