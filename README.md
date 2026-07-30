# Smart Event Management & Ticketing Platform

A full-stack event booking and ticketing web application built with Node.js, Express, EJS, and MongoDB. The platform lets visitors browse and book tickets for events, gives registered users a personal booking history, and gives admins a dashboard to manage events, bookings, and customer enquiries — replacing manual, spreadsheet-based event tracking with a single web app.

This was built as a 3rd year Web Programming (WPR) project.

Team Member Roles:
1. Team Lead / Project Coordinator (Marcus)<br>
Primary Page: Home / Event Listing Page.<br>
Tasks:<br>
o Oversee overall project cohesion and ensure all five mandatory pages are
integrated.<br>
o Implement event discovery features, including search and filtering logic.<br>
o Coordinate the final presentation and ensure the project meets all functional
requirements.<br>
2. Backend Developer (Darrin)<br>
Primary Page: Booking & Dashboard Page (Logic).<br>
Tasks:<br>
o Develop the server-side logic using Node.js and Express.<br>
o Implement the automated ticket booking system and capacity validation.<br>
o Create the admin analytics dashboards to track popular events and total
bookings.<br>
3. Frontend Developer (Jakobus)<br>
Primary Page: UI/UX Design across all 5 EJS Templates.<br>
Tasks:<br>
o Design and style the frontend using CSS (or Bootstrap/Tailwind) for basic
responsiveness.<br>
o Ensure the EJS templates correctly display dynamic data from the backend.<br>
o Focus on usability and professional layout to meet the UI/UX marking criteria.<br>
4. Database Engineer (Kamohelo)<br>
Primary Page: Contact/Enquiry Management Page.<br>
Tasks:<br>
o Design and implement MongoDB schemas using Mongoose.<br>
o Develop the enquiry system to store and retrieve user messages.<br>
o Ensure data persistence and validation across all models (Events, Users,
Bookings).<br>
5. Security / DevOps Engineer (Oratile)<br>
Primary Page: User Authentication Page.<br>
Tasks:<br>
o Implement secure registration and login using password hashing (bcrypt).<br>
o Establish Role-Based Access Control (RBAC) and protect admin routes via
middleware.<br>
o Manage the GitHub repository, ensuring frequent commits and proper version
control<br>

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
