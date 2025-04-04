# Museum Ticket Booking System

## Overview
The Museum Ticket Booking System is a web application that allows users to book tickets for various museums across India. The application features a user-friendly interface for browsing museums, viewing upcoming events, and managing bookings. It also provides analytics for better insights into user interactions.

## Project Structure
The project is divided into two main parts: the client-side (React) and the server-side (Node.js with MongoDB).

### Client
- **Public**
  - `index.html`: Main HTML file for the React application.
  - `manifest.json`: Metadata about the application.
  
- **Src**
  - **Assets**: Static assets like images and styles.
  - **Components**: Reusable components for different sections of the application.
    - **Common**: Header, Footer, and Navbar components.
    - **Home**: Components for the home page including Featured Museums, News Section, and Upcoming Events.
    - **Booking**: Components for booking tickets, processing payments, and confirming tickets.
    - **Profile**: Components for user profile details, current bookings, booking history, and museum map.
    - **Analytics**: Component for the analytics dashboard.
  - **Pages**: Main pages of the application including Home, Booking, Profile, and Analytics.
  - **Context**: Context providers for managing authentication and booking state.
  - **Utils**: Utility functions for API calls and other helpers.
  - `App.jsx`: Main application component.
  - `index.jsx`: Entry point for the React application.
  
- **Package.json**: Configuration file for npm dependencies and scripts.

### Server
- **Config**: Database connection and default configuration settings.
- **Controllers**: Functions for handling various operations like authentication, bookings, museums, news, and events.
- **Models**: MongoDB models for User, Booking, Museum, News, and Event.
- **Routes**: API routes for handling requests related to authentication, bookings, museums, news, and events.
- **Services**: Functions for sending emails and WhatsApp messages.
- **Middleware**: Authentication middleware for securing routes.
- **Utils**: Functions for generating QR codes.
- `server.js`: Entry point for the Node.js server.

## Features
- **User Authentication**: Users can register and log in to manage their bookings.
- **Ticket Booking**: Users can view museums, upcoming events, and book tickets.
- **Payment Process**: A mock payment process is implemented for ticket purchases.
- **Profile Management**: Users can view their profile, current bookings, and booking history.
- **Analytics Dashboard**: Provides insights into user interactions and bookings.

## Getting Started
1. Clone the repository.
2. Navigate to the `client` directory and run `npm install` to install client-side dependencies.
3. Navigate to the `server` directory and run `npm install` to install server-side dependencies.
4. Set up the MongoDB database and update the configuration in `server/config/default.json`.
5. Start the server by running `node server.js` in the `server` directory.
6. Start the client by running `npm start` in the `client` directory.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.