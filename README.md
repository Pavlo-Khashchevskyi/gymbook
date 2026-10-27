# gymbook

Gym management platform for admins, trainers, and clients.

## Roles

### Admin

- Invite trainers.
- View and deactivate trainers.

### Trainer

- Invite clients.
- Create and assign workout plans.
- Manage availability and bookings.

### Client

- View assigned workout plans.
- Log completed workouts.
- Book and cancel training sessions.

## MVP Scope

- Authentication and role-based access control.
- Trainer and client invitations.
- Workout plans and workout logs.
- Trainer availability and individual session bookings.
- One slot can be booked by only one client (no double booking).

## Out of Scope

- Group classes.
- Payments and subscriptions.
- Nutrition tracking.
- Chat and notifications.
- Exercise library and workout plan templates.
- Advanced analytics and dashboards.
- Multi-gym support.

## Core Flow

- Admin invites Trainer → Trainer invites Client → Trainer assigns a plan → Client logs a workout.
- Trainer creates a slot → Client books the slot → Trainer views the booking → Client can cancel the booking.