# Talent IQ

A full-stack technical interview and DSA practice platform. Students practice coding problems and join live mock interviews; interviewers host sessions, run video calls, and submit structured feedback; admins manage users, content, and platform-wide problem sets.

## Features

- **Role-based access** — Student, Interviewer, and Admin roles with route-level guarding
  - Admin access is restricted to a single configured owner email
  - Interviewer access requires admin approval (request → in-app/email notification → admin approves)
- **Live interview sessions** — host video calls (Stream Video), in-call chat (Stream Chat), and a shared code editor
  - Interviewer creates a session, then selects the problem once the room is live
- **100+ DSA problems** — filterable by difficulty, category, and company, with starter code per language
- **In-browser code execution & judging** — run code against test cases via Piston, see pass/fail output
- **Daily Challenge** — a featured problem each day with bonus rewards
- **Gamification** — XP, streaks, achievements, and a leaderboard
- **Company question bank** — curated questions tagged by company and frequency
- **Interview feedback system** — interviewers rate candidates and leave structured evaluations
- **Notifications** — in-app bell + email (via nodemailer) for session updates, interviewer requests/approvals
- **Admin dashboard** — manage users (roles), and manage problem content (CRUD)

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- TanStack Query (React Query)
- Tailwind CSS + daisyUI
- Clerk (`@clerk/clerk-react`) for authentication
- Stream Video & Chat SDKs

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Clerk (`@clerk/express`) for auth middleware
- Inngest for webhook-driven user sync
- Stream server SDK (video/chat)
- Nodemailer for email notifications

## Project Structure

```
TalentIQ/
├── backend/
│   └── src/
│       ├── controllers/   # route handlers
│       ├── middleware/    # auth (protectRoute, requireRole)
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routers
│       └── lib/           # env, db, email, notifications, roles, stream, inngest
└── frontend/
    └── src/
        ├── api/           # axios wrappers per resource
        ├── components/    # reusable UI components
        ├── hooks/         # React Query hooks
        ├── pages/         # route-level pages
        └── data/          # local problem & company-question datasets
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or Atlas)
- Accounts/API keys for [Clerk](https://clerk.com), [Stream](https://getstream.io), and [Inngest](https://www.inngest.com)

### Setup

1. Clone the repo and install dependencies for both apps:

   ```bash
   git clone https://github.com/Rishabh774/TalentIQ.git
   cd TalentIQ
   npm install --prefix backend
   npm install --prefix frontend
   ```

2. Configure environment variables (copy the example files and fill in real values):

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   Backend (`backend/.env`):

   | Variable | Description |
   |---|---|
   | `PORT` | Port for the Express server |
   | `DB_URL` | MongoDB connection string |
   | `CLIENT_URL` | Frontend origin (for CORS) |
   | `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk auth keys |
   | `PISTON_URL` | Piston API base URL used to run code. The public `emkc.org` instance is whitelist-only, so [self-host Piston](https://github.com/engineer-man/piston#self-hosting) and point this at it |
   | `STREAM_API_KEY` / `STREAM_API_SECRET` | Stream video/chat server keys |
   | `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` | Inngest keys for Clerk webhook sync |
   | `SUPER_ADMIN_EMAIL` | The email that is automatically granted the admin role |
   | `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | (optional) SMTP credentials for email notifications |

   Frontend (`frontend/.env`):

   | Variable | Description |
   |---|---|
   | `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:3000/api`) |
   | `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (must match the backend key) |
   | `VITE_STREAM_API_KEY` | Stream client key |

3. Run both apps in development mode from the project root:

   ```bash
   npm run dev
   ```

   This starts the backend on `http://localhost:3000` and the frontend on `http://localhost:5173`.

### Production build

```bash
npm run build   # installs deps and builds the frontend
npm start       # starts the backend, which also serves the built frontend
```

A `Dockerfile` is included for containerized deployment.

## Roles & Access

| Role | How it's granted | Access |
|---|---|---|
| Student | Default for any new user | Practice problems, daily challenge, join sessions, leaderboard |
| Interviewer | Self-requested, then approved by an admin | Everything a student has, plus creating/hosting sessions and submitting feedback |
| Admin | Automatically granted only to `SUPER_ADMIN_EMAIL` | User & role management, problem content management, everything else |

## License

ISC
