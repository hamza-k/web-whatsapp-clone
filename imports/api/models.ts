export interface Profile {
    phone?: string;
    picture?: string;
    actu?: string;
}

export interface User {
    _id?: string;
    username?: string;
    password?: string;
    profile?: Profile
}

export interface Chat {
    _id?: string;
    title?: string;
    picture?: string;
    participants?: string[];
    lastMessage?: Message;
}

export interface Message {
    _id?: string;
    chatId?: string;
    content?: string;
    createdAt?: Date;
    type?: MessageType;
    ownership?: string;
    senderId?: string;
    read?: boolean;
}

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image'
}