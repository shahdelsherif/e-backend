import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Forum } from './forum.schema';
import { CreateForumDto } from './create-forum.dto';
import { CreatePostDto } from './create-post.dto';
import { CreateReplyDto } from './create-reply.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { CoursesService } from 'src/courses/courses.service';


@Injectable()
export class ForumsService {
  constructor(
    @InjectModel(Forum.name) private readonly forumModel: Model<Forum>,  private readonly notificationsService: NotificationsService, private courseService: CoursesService
  ) {}

  // Create a new forum
  async createForum(createForumDto: CreateForumDto): Promise<Forum> {
    const newForum = new this.forumModel(createForumDto);
    return newForum.save();
  }

  // Create a new post in a forum
  async createPost(createPostDto: CreatePostDto): Promise<Forum> {
    const { forumId, userId, content } = createPostDto;

    const forum = await this.forumModel.findById(forumId);
    if (!forum) {
      throw new Error('Forum not found');
    }

    const courseId = forum.courseId.toString();

    const newPost = {
      _id: new Types.ObjectId,  
      userId: new Types.ObjectId(userId),
      content,
      timestamp: new Date(),
      replies: [],
    };

    forum.posts.push(newPost);
    await forum.save();


    // Notify participants (instructors and students)
    const participants = await this.getParticipants(courseId);
    for (const participant of participants) {
      if (participant.toString() !== createPostDto.userId) {
        await this.notificationsService.createNotification(
          participant.toString(),
          `New post in forum: ${forum.topic}`,
          courseId,
          newPost._id.toString(),
        );
      }
    }

    return forum; // Return the updated forum with the new post
  }

  // Add a reply to a post
  async addReply(createReplyDto: CreateReplyDto): Promise<Forum> {
    const { postId, userId, content } = createReplyDto;

    const forum = await this.forumModel.findOne({ 'posts._id': postId });
    if (!forum) {
      throw new Error('Post not found');
    }

    const courseId = forum.courseId.toString();

    const post = forum.posts.find(p => p._id.toString() === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const newReply = {
      userId: new Types.ObjectId(userId),
      content,
      timestamp: new Date(),
    };

    post.replies.push(newReply);
    await forum.save();

    // Notify participants (instructors and students)
    const participants = await this.getParticipants(courseId);
    for (const participant of participants) {
      if (participant.toString() !== createReplyDto.userId) {
        await this.notificationsService.createNotification(
          participant.toString(),
          `New reply in forum: ${forum.topic}`,
          courseId,
          postId,
        );
      }
    }

    return forum; // Return the updated forum with the new reply
  }

  // Helper: Get participants of a forum (instructors and students)
  private async getParticipants(courseId: string): Promise<string[]> {
    // Fetch participants from the course linked to the forum
    // Assuming you have a `Course` schema and service to fetch this data
    const course = await this.courseService.findOne(courseId);
    return [...course.instructorId, ...course.studentsEnrolled];
  }

  // Get all posts from a forum
  async getForumPosts(forumId: string): Promise<any[]> {
    const forum = await this.forumModel
      .findById(forumId)
      .populate('posts.userId', 'username') // Populate user names for posts
      .populate('posts.replies.userId', 'username'); // Populate user names for replies

    if (!forum) {
      throw new Error('Forum not found');
    }

    return forum.posts; // Return the posts array
  }

  // Seach for a word in posts or replys
  async searchPosts(query_: string): Promise<any> {
    return this.forumModel.find({
        $text: { $search: query_ },
      }).exec();
  }

  async searchForums(courseId: string, keyword: string): Promise<Forum[]> {
    const searchRegex = new RegExp(keyword, 'i'); // Case-insensitive regex for search
    return await this.forumModel.find({
      courseId,
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    }).exec();
  }
}
