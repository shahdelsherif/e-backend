export class CreateChatDto {
    readonly participants: string[]; // Array of user IDs
    readonly isGroupChat: boolean; // Whether the chat is a group chat or not
  }
  