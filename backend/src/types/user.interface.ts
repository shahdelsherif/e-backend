import * as mongoose from 'mongoose';
export interface User {
    name: string;
    email: string;
    password: string;
    role: string;
    ID: number;
    profilePicture: string; // img.png
    studentMetrics: {
        completionRate: number;
        averageScore: number;
        engagementTrends: string;
    };
    enrolledCourses: mongoose.Types.ObjectId[]; 
    enrolledCoursesScores: Array<{courseName: string ; score: number}>;
  }