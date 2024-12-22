import { Document, Types } from 'mongoose';

export class CreatePostDto {
    _id: Types.ObjectId;
    readonly forumId: string; // Forum ID where the post should be created
    readonly userId: string; // User ID who is creating the post
    readonly content: string; // Post content
  }
  