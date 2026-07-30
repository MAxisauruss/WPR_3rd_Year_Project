# Smart Event Management & Ticketing Platform

A full-stack event booking and ticketing web application built with Node.js, Express, EJS, and MongoDB. The platform lets visitors browse and book tickets for events, gives registered users a personal booking history, and gives admins a dashboard to manage events, bookings, and customer enquiries — replacing manual, spreadsheet-based event tracking with a single web app.

This was built as a 3rd year Web Programming (WPR) project.

## Features

- **Event browsing** — public event listing, plus a detail page per event
- **Ticket booking** — logged-in users can book tickets for an event, with available-ticket counts updated automatically
- **User accounts** — login with sessions, and a personal "My Bookings" page showing each user's own booking history
- **Admin dashboard** — event CRUD (create/edit/delete), booking overview and management of contact-form enquiries
- **Contact / enquiries** — a public contact form that lands in the admin dashboard for follow-up
- **Role-based access** — separate `User` and `Admin` roles, with admin-only routes for event and enquiry management

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Views:** EJS templating
- **Auth:** express-session, bcrypt for password hashing (still in the works)
- **Styling:** custom CSS

## Project Structure

```
├── server.js                    # App entry point (routes, middleware, DB connection)
├── controllers/                 # Route logic (auth, events, bookings, admin, contact)
├── routes/                      # Express routers, mounted by feature area
├── models/                      # Mongoose schemas: User, Event, Booking
├── middleWare/                  # Auth guards and centralized error handling
├── Smart-Event-Platform/
│   ├── Views/                   # EJS templates (home, events, booking, dashboard, auth, partials)
│   ├── Models/                  # Enquiry schema for the contact form
│   ├── config/db.js             # MongoDB connection helper
│   └── Images/                  # Static event imagery
├── Style/style.css              # Site-wide styling
└── scripts/                     # Utility scripts for inspecting seeded event data
```

## Database Collections

MongoDB database (`WPR3x1`) with four collections:

```
WPR3x1
├── bookings     # Ticket bookings — links a user to an event, with quantity, price, and status
├── enquiries    # Messages submitted through the public contact form
├── events       # Event listings — title, date, category, capacity, price, tickets remaining
└── users        # Registered accounts — name, email, hashed password, role (User/Admin)
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB database (local or MongoDB Atlas)

### Installation

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=a_long_random_string
PORT=3000
```

`.env` is git-ignored

### Running the App

```bash
npm start

or 
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Roadmap / Known Limitations

- Booking cancellation and payment integration are not yet implemented
- Admin analytics are basic (top events by tickets sold, total revenue) and could be expanded
- No automated test suite yet
