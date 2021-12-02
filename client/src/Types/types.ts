export type MessageType = {
    ownerId: string
    message: string,
    date: string,
};
export type ChatDetails = {
    id: number,
    name: string,
    lastMessage: MessageType,
};