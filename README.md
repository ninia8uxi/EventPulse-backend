# EventPulse API

## Project Description
EventPulse is a backend API for managing events, user registrations, and real-time messaging. Users can browse events, register for them, and receive announcements via Socket.io.

## Technologies
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io
- Vercel (Deployment)

## How to Run Locally
1. Clone the repository:  
   `git clone https://github.com/ninia8uxi/30906010300081-EventPulse.git`
2. Navigate to the project:  
   `cd EventPulse-backend`
3. Install dependencies:  
   `npm install`
4. Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   PORT=5000
   ```
5. Run the seed to populate the database:  
   `npm run seed`
6. Start the server:  
   `npm run dev`

## Deployment Link
- **Live API:** [https://eventpulse-api-beta.vercel.app](https://eventpulse-api-beta.vercel.app)
- **Health Check:** [https://eventpulse-api-beta.vercel.app/health](https://eventpulse-api-beta.vercel.app/health)

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/events` | List events (with filters, pagination, search) |
| GET | `/api/events/:id` | Get a single event |
| POST | `/api/events` | Create an event (Admin only) |
| PUT | `/api/events/:id` | Update an event (Admin only) |
| DELETE | `/api/events/:id` | Delete an event (Admin only) |
| POST | `/api/registrations` | Register for an event |
| GET | `/api/registrations` | Get my registrations |
| DELETE | `/api/registrations/:id` | Cancel a registration |
| GET | `/health` | Health check |

## Testing
Run unit and integration tests:
```bash
npm test
```

## Author
- **Student ID:** 30906010300081
- **GitHub:** [ninia8uxi](https://github.com/ninia8uxi)
```bash
npm test
