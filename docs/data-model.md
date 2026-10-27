# Gymbook — Data Model

Database: MongoDB  
ODM: Mongoose

## User

Represents an admin, trainer, or client.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `email` | string | Required, unique, normalized to lowercase |
| `passwordHash` | string | Never store raw passwords |
| `role` | `'admin' \| 'trainer' \| 'client'` | Required |
| `gymId` | ObjectId → User | Gym owner ID; set for trainers and clients |
| `trainerId` | ObjectId → User \| null | Assigned trainer; only for clients |
| `firstName` | string | Required |
| `lastName` | string | Required |
| `status` | `'active' \| 'inactive'` | Default: `active` |
| `createdAt` | Date | Automatically generated |
| `updatedAt` | Date | Automatically updated |

Notes:
- An admin owns a gym and has `gymId` equal to their own `_id`.
- Trainers belong to an admin's gym.
- Clients belong to a gym and may be assigned to a trainer.
- Enforce role-based permissions on the server.
- A unique index on `email` prevents duplicate accounts.
- `gymId` references the admin account, not a separate Gym collection. A dedicated `Gym` entity can be introduced if multi-location support is needed.

## Invite

Represents an invitation for a trainer or client to join a gym.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `tokenHash` | string | Required, unique; hash of a cryptographically random token |
| `role` | `'trainer' \| 'client'` | Role granted by the invitation |
| `gymId` | ObjectId → User | Gym owner ID |
| `createdBy` | ObjectId → User | Admin for trainer invites; trainer for client invites |
| `trainerId` | ObjectId → User \| null | Required for client invitations; null for trainer invitations |
| `email` | string \| null | Optional restriction to a specific email |
| `expiresAt` | Date | Required; invitation expiration time |
| `usedAt` | Date \| null | Null until redeemed |
| `revokedAt` | Date \| null | Null unless revoked |
| `createdAt` | Date | Creation timestamp |

Notes:
- Generate a high-entropy random token and send the raw token only in the invitation URL.
- Store only its cryptographic hash in the database.
- Validate the hash, expiration, revocation status, and usage status when accepting an invitation.
- Consume an invitation atomically so concurrent requests cannot redeem it twice.
- Assign the role and gym from the invitation on the server; never trust values submitted by the registering user.
- A TTL index on `expiresAt` may clean up old documents, but application-level expiration checks are still required.
- A client invitation must be created by a trainer authorized to manage that client relationship.

## WorkoutPlan

Represents a workout program created by a trainer and optionally assigned to a client.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `gymId` | ObjectId → User | Gym owner ID |
| `trainerId` | ObjectId → User | Plan creator and responsible trainer |
| `clientId` | ObjectId → User \| null | Assigned client; null for an unassigned template |
| `title` | string | Required |
| `description` | string \| null | Optional |
| `exercises` | Exercise[] | Embedded array of exercises |
| `status` | `'draft' \| 'active' \| 'archived'` | Plan lifecycle |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### Embedded Exercise

| Field | Type | Notes |
|---|---|---|
| `exerciseId` | ObjectId \| null | Optional reference to a shared exercise library |
| `name` | string | Exercise name snapshot |
| `order` | number | Position in the workout |
| `sets` | number | Planned number of sets |
| `reps` | number \| string | Target reps, e.g. `10` or `8-12` |
| `weight` | number \| null | Optional target weight in kg |
| `restSeconds` | number \| null | Optional rest duration |
| `notes` | string \| null | Optional instructions |

Notes:
- Embed exercises because they are usually read and updated as part of a workout plan.
- This keeps the MVP simple and avoids extra queries when loading a plan.
- Store an exercise name snapshot so later library edits do not unexpectedly rename existing plan entries.
- Create a separate `Exercise` collection if a reusable, gym-wide exercise library is needed.
- If trainers need reusable templates, keep unassigned plans with `clientId: null` and copy or instantiate a plan when assigning it to a client.

## WorkoutLog

Represents a workout session actually performed by a client.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `gymId` | ObjectId → User | Gym owner ID |
| `clientId` | ObjectId → User | Client who performed the workout |
| `trainerId` | ObjectId → User \| null | Responsible trainer at the time |
| `workoutPlanId` | ObjectId → WorkoutPlan \| null | Source plan, if applicable |
| `planTitle` | string \| null | Snapshot of the plan title |
| `exercises` | LoggedExercise[] | Embedded performed exercises and sets |
| `startedAt` | Date | Session start time |
| `completedAt` | Date \| null | Null until completed |
| `notes` | string \| null | Optional session notes |
| `createdAt` | Date | Creation timestamp |

### Embedded LoggedExercise

| Field | Type | Notes |
|---|---|---|
| `exerciseId` | ObjectId \| null | Optional library reference |
| `name` | string | Exercise name snapshot |
| `sets` | LoggedSet[] | Actual performed sets |
| `notes` | string \| null | Optional notes |

### Embedded LoggedSet

| Field | Type | Notes |
|---|---|---|
| `setNumber` | number | Set position |
| `reps` | number | Actual repetitions |
| `weight` | number \| null | Actual weight in kg |
| `completed` | boolean | Whether the set was completed |

Notes:
- Reference both the client and the source workout plan.
- `workoutPlanId` can be null for workouts performed without an assigned plan.
- Embed the performed exercises and sets to preserve the workout history.
- Store snapshots of exercise names and relevant plan information so edits to a plan do not rewrite historical records.
- Enforce that the client belongs to the gym and is authorized to use the selected plan.
- Clients may create their own workout logs; trainers may view logs only for clients they are authorized to manage.

## Slot

Represents a time slot offered by a trainer for an appointment.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `gymId` | ObjectId → User | Gym owner ID |
| `trainerId` | ObjectId → User | Trainer offering the slot |
| `startsAt` | Date | Required start time |
| `endsAt` | Date | Required end time; must be after `startsAt` |
| `capacity` | number | Default: `1`; positive integer |
| `status` | `'open' \| 'cancelled'` | Slot availability |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

Notes:
- A slot represents availability, not a particular client's reservation.
- Store timestamps in UTC and display them in the user's local timezone.
- Prevent overlapping slots for the same trainer where required.
- For the MVP, use `capacity: 1` for personal training sessions.
- Group sessions may use a higher capacity.
- Do not allow the slot to be deleted or changed in a way that silently invalidates existing bookings.

## Booking

Represents a client's reservation for a slot.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `gymId` | ObjectId → User | Gym owner ID |
| `slotId` | ObjectId → Slot | Required slot reference |
| `trainerId` | ObjectId → User | Trainer reference for efficient queries |
| `clientId` | ObjectId → User | Client making the booking |
| `status` | `'booked' \| 'cancelled' \| 'completed' \| 'no_show'` | Booking lifecycle |
| `bookedAt` | Date | Creation time |
| `cancelledAt` | Date \| null | Cancellation timestamp |
| `notes` | string \| null | Optional booking notes |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

Notes:
- Keep `Slot` and `Booking` separate because one describes available time and the other describes a reservation.
- For personal training, allow only one active booking per slot.
- For group sessions, allow multiple active bookings up to `Slot.capacity`.
- Validate capacity and booking conflicts on the server using atomic operations or transactions where appropriate.
- A cancelled booking should not consume slot capacity.
- Keep historical bookings instead of deleting them.
- A unique compound index on `{ slotId, clientId }` can prevent duplicate booking documents for the same client and slot, but cancellation and rebooking rules must be handled deliberately.
- When a slot is cancelled, update or cancel its active bookings according to the product's cancellation policy.

## Relationships

- Admin (User) → many Trainers (User)
- Admin (User) → many Clients (User)
- Trainer (User) → many Clients (User)
- Trainer (User) → many WorkoutPlans
- Client (User) → many WorkoutLogs
- WorkoutPlan → many WorkoutLogs
- Trainer (User) → many Slots
- Slot → many Bookings, limited by capacity
- Client (User) → many Bookings
- Admin and Trainer → many Invites

## General Rules

- Every protected query must enforce gym-level access control.
- Never rely only on ObjectId references supplied by the client.
- Validate references, roles, and relationships on the server.
- Use timestamps consistently.
- Use schema validation for required fields, enums, and numeric constraints.
- Index fields frequently used for lookups, including `gymId`, `trainerId`, `clientId`, `slotId`, and relevant timestamps.
- Keep password hashes and invitation tokens out of API responses and application logs.
