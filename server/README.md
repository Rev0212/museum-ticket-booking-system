# Museum Ticket Booking System

## Overview
This project is a ticket booking system for various museums across India. It allows users to browse featured museums, view news about Indian art and museums, book tickets, and manage their profiles and bookings.

## Features
- **Home Page**: 
  - Displays featured museums.
  - Shows news about Indian art and museums fetched from an external API.
  - Lists upcoming events related to museums.

- **Ticket Booking Page**: 
  - Detailed ticket booking form.
  - Option to send tickets via WhatsApp (QR code) and email.
  - Mock payment process.

- **Profile Page**: 
  - Displays user profile information.
  - Shows current bookings with a map to the museum.
  - History of past bookings.

- **Analytics Page**: 
  - Provides insights and analytics related to bookings and user interactions.

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: MongoDB

## Project Structure
```
museum-ticket-booking-system
├── client                  # Frontend application
│   ├── public              # Public assets
│   ├── src                 # Source files for React app
│   ├── package.json        # Client dependencies
│   └── README.md           # Client documentation
├── server                  # Backend application
│   ├── config              # Configuration files
│   ├── controllers         # Controller files for handling requests
│   ├── models              # Mongoose models
│   ├── routes              # API routes
│   ├── services            # Services for email and WhatsApp
│   ├── middleware          # Middleware for authentication
│   ├── utils               # Utility functions
│   ├── server.js           # Entry point for the server
│   ├── package.json        # Server dependencies
│   └── README.md           # Server documentation
├── .gitignore              # Git ignore file
├── package.json            # Root package.json for the project
└── README.md               # Overall project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the server directory and install dependencies:
   ```
   cd server
   npm install
   ```
3. Navigate to the client directory and install dependencies:
   ```
   cd ../client
   npm install
   ```
4. Set up the MongoDB database and update the configuration in `server/config/default.json`.
5. Start the server:
   ```
   cd server
   npm start
   ```
6. Start the client:
   ```
   cd client
   npm start
   ```

## Usage
- Access the application in your browser at `http://localhost:3000`.
- Use the navigation bar to explore different sections of the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License
This project is licensed under the MIT License.