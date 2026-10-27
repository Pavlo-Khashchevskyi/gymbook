# Gymbook — Data Model

UserRole: 'admin' | 'trainer' | 'client'

## User
- _id: ObjectId (auto)
- email: string, unique
- passwordHash: string
- firstName: string
- lastName: string
- role: UserRole
- isActive: boolean, default: true
- trainerId: ObjectId | null, User → (trainer), only for clients
- createdAt: Date (automatically managed by Mongoose)
- updatedAt: Date (automatically managed by Mongoose)

## Invite
- _id: ObjectId (auto)
- role: UserRole, 'trainer' | 'client'
- token: string, unique, random
- createdBy: ObjectId → User
- expiresAt: Date
- usedAt: Date | null, default: null, set by our code on registration
- createdAt: Date (automatically managed by Mongoose)