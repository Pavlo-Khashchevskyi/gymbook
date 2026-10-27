# gymbook

A simple gym management platform for gym owners, trainers, and clients.

Vision

Gymbook helps gyms manage their staff, clients, and workout programs in one place.

Roles

Admin

Owns and manages a gym.

Has full administrative control over the gym.

Invites trainers via unique invitation links.

Manages trainers and all clients in the gym.

Can deactivate users and revoke invitations.

Views gym-wide statistics.

Trainer

Belongs to one gym.

Manages their own clients.

Invites clients via unique registration links.

Creates and manages workout programs.

Assigns workout programs to clients.

Tracks client workout history and progress.

Client

Belongs to a gym and is assigned to a trainer.

Views their assigned workout programs.

Records completed exercises, sets, reps, and weights.

Views workout history and personal progress.

Can access only their own personal data.

User Stories (MVP)

Admin

As an admin, I want to create a gym, so that I can manage my gym in one place.

As an admin, I want to invite trainers via unique links, so that only invited trainers can join my gym.

As an admin, I want to manage trainers, so that I can control who has access to my gym.

As an admin, I want to view all clients in my gym, so that I can oversee gym activity.

As an admin, I want to deactivate trainers or clients, so that I can manage access when needed.

As an admin, I want to revoke invitation links, so that unused links cannot be abused.

As an admin, I want to view basic gym statistics, so that I can understand overall activity.

Trainer

As a trainer, I want to register through an admin invitation link, so that I can join the correct gym.

As a trainer, I want to invite clients via unique links, so that I can build my client list.

As a trainer, I want to view and manage my clients, so that I can organize my work.

As a trainer, I want to create workout programs, so that I can prepare personalized training plans.

As a trainer, I want to assign workout programs to clients, so that they know what to do during workouts.

As a trainer, I want to edit workout programs, so that I can adapt them to a client's needs.

As a trainer, I want to view workout history, so that I can monitor client progress.

As a trainer, I want to remove a client from my active list, so that I can keep my workspace organized.

Client

As a client, I want to register through my trainer's invitation link, so that I can join the correct gym and trainer.

As a client, I want to view my assigned workout program, so that I know which exercises to perform.

As a client, I want to record sets, reps, and weights, so that I can track each workout.

As a client, I want to mark a workout as completed, so that my trainer can see my activity.

As a client, I want to view my workout history, so that I can track my progress.

As a client, I want to view my profile, so that I can manage my basic personal information.

Core Features (MVP)

Authentication and role-based access control.

Gym creation and ownership.

Trainer invitation links.

Client invitation links.

Trainer and client management.

Exercise library with exercise names and descriptions.

Workout program creation and assignment.

Workout logging: sets, reps, and weights.

Workout history and basic progress tracking.

Basic dashboards for each role.

User activation and deactivation.

Secure separation of data between gyms.

Out of Scope (Not in MVP)

Calendar view and appointment scheduling.

Online payments and subscriptions.

Membership billing and invoicing.

Nutrition plans and meal tracking.

Chat and direct messaging.

Push notifications and SMS notifications.

AI-generated workout plans.

Wearable integrations (Apple Watch, Garmin, etc.).

Advanced analytics and reports.

Exercise videos and a large multimedia library.

Public profiles and social features.

Multiple gym locations under one organization.

Trainer marketplace and public discovery.

Native iOS and Android applications.

Automated recurring workouts.

Booking group classes.

Inventory and equipment management.

MVP Success Criteria

An admin can create a gym and invite a trainer.

A trainer can join the gym and invite a client.

A client can register and access their assigned workout program.

A trainer can create and assign a workout program.

A client can log a workout and view their history.

An admin can manage gym users.

Users cannot access data belonging to another gym or unauthorized clients.

Product Principle

Start with one gym, one admin, multiple trainers, and multiple clients.

Make the core workflow simple and reliable before adding advanced features.