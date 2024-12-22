import { Document, Types } from 'mongoose';
export class CreateReplyDto {
    readonly postId: string; // Post ID where the reply should be added
    readonly userId: string; // User ID who is replying
    readonly content: string; // Reply content
  }
  