# Backend Project README

# Mental Health Support Platform - Backend

# About the Project
This project is a comprehensive Mental Health Support Platform designed to bridge the gap between clients and professional counselors. It provides a secure, real-time environment for counseling sessions, session management, and record tracking. The system uses a MERN stack architecture to ensure scalability and high performance.

##  Key Features
- **Secure Authentication:** JWT-based login for Clients and Counselors.
- **Real-time Chat:** Instant messaging using **Socket.io**.
- **Role-based Dashboards:** Dedicated APIs for Client and Counselor views.
- **Session Management:** End-to-end booking and session tracking.
- **Video Call Integration:** Ready for live counseling sessions.

##  Project Structure
```text
MP-Backend/
├── Database/       # MongoDB Connection
├── Models/         # Mongoose Schemas (User, Booking, Message, session)
├── Routes/         # Express API Routes
├── Controllers/    # Business Logic
├── .env.example    # Sample environment variables
└── index.js        # Main server & Socket.io setup.

# Project Overview
The backend serves as the core engine of the application, handling:

Real-time Communication: Powered by Socket.io for instant chat between clients and counselors.

Secure Data Management: Handling sensitive user data and session records using MongoDB.

Role-Based Access: Distinct logic and dashboards for Clients and Counselors.

Session Lifecycle: Managing everything from booking requests to completing sessions and generating notes.


### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running the Project
```bash
npm start
```

## API Documentation
- **Postman Collection**: [View on Postman](https://documenter.getpostman.com/view/50347548/2sBXVbGtCH)
- **API Endpoints**: Available in `./docs/endpoints.md`

## Deployment
- **Deploy with Render**: [Railway.app](https://mp-backend-1-82km.onrender.com/)
- **Deploy with Netlify**: [Vercel.com](https://mp1frontend.netlify.app/)

## Repository
- **GitHub**: [View Repository](https://github.com/SundariC/MP-Backend)

## Technologies Used

- Runtime Environment: Node.js

-Framework: Express.js

-Database: MongoDB (Mongoose ODM)

-Real-time Engine: Socket.io

-Security: JSON Web Tokens (JWT) & Bcrypt

-API Testing: Postman

## Contributing
Pull requests are welcome. Please follow the project's code style.

## License
MIT License