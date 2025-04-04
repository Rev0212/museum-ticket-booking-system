# Museum Ticket Booking System

## Overview
This project is a ticket booking system for various museums across India. It allows users to browse featured museums, read news about Indian art and museums, book tickets, and manage their profiles and bookings.

## Client-Side
The client-side of the application is built using React. It consists of several components organized into directories based on their functionality.

### Project Structure
```
client
├── public
│   ├── index.html
│   └── manifest.json
├── src
│   ├── assets
│   ├── components
│   │   ├── common
│   │   ├── home
│   │   ├── booking
│   │   ├── profile
│   │   └── analytics
│   ├── pages
│   ├── context
│   ├── utils
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
```

### Key Components
- **Common Components**: Header, Navbar, and Footer for consistent layout across pages.
- **Home Components**: FeaturedMuseums, NewsSection, and UpcomingEvents to display relevant information on the home page.
- **Booking Components**: BookingForm for ticket booking, PaymentProcess for handling payments, and TicketConfirmation for displaying booking details.
- **Profile Components**: ProfileDetails, CurrentBookings (with a map), and BookingHistory to manage user profiles and bookings.
- **Analytics Component**: AnalyticsDashboard for viewing application analytics.

### API Integration
The application fetches news about Indian art and museums from an external API and handles ticket booking through a backend service.

## Backend
The backend is built using Node.js and MongoDB. It manages user authentication, booking processes, and museum data.

### Key Features
- User authentication and profile management.
- Booking management for tickets.
- Museum data retrieval and management.
- News and events management.

### API Endpoints
The backend exposes several API endpoints for the client to interact with, including:
- Authentication routes
- Booking routes
- Museum routes
- News routes
- Event routes

## Getting Started
1. Clone the repository.
2. Navigate to the `client` directory and run `npm install` to install client dependencies.
3. Navigate to the `server` directory and run `npm install` to install server dependencies.
4. Set up your MongoDB database and configure the connection in `server/config/default.json`.
5. Start the server by running `node server.js` in the `server` directory.
6. Start the client by running `npm start` in the `client` directory.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.