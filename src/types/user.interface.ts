// src/types/user.interface.ts

export interface User {
    id: number;            // Unique identifier for the user
    username: string;      // Username for the user
    email: string;         // Email address of the user
    roles?: string[];      // Optional: Roles assigned to the user
    isActive?: boolean;    // Optional: Whether the user is active
    createdAt?: Date;      // Optional: Account creation timestamp
    updatedAt?: Date;      // Optional: Last update timestamp
  }
  