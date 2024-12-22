export class CreateChatDto {
    readonly creator: string;
    readonly chatName: string;
    readonly participants: string[];
    readonly isGroupChat: boolean; 
    
  }
  