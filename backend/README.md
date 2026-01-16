# Hotel Booking API

Production-ready REST API for hotel booking with MySQL database.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MySQL 8
- **ORM**: Prisma
- **Auth**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### 1. Prerequisites

- Node.js 20+
- MySQL 8 (or use Docker)
- npm or yarn

### 2. Setup

```bash
# Clone and install
cd backend
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your MySQL credentials

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start dev server
npm run dev
```

### 3. Using Docker (Recommended)

```bash
# Start MySQL + API
docker-compose up -d

# View logs
docker-compose logs -f api
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Hotels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | List hotels (with filters) |
| GET | `/api/hotels/:id` | Get hotel details |
| GET | `/api/hotels/:id/availability` | Check room availability |
| GET | `/api/hotels/amenities` | List all amenities |

### Rooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms/:roomId` | Get room details |
| GET | `/api/rooms/hotel/:hotelId` | List rooms by hotel |

### Bookings (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | My bookings |
| GET | `/api/bookings/:id` | Booking details |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/hotel/:hotelId` | List hotel reviews |
| POST | `/api/reviews/hotel/:hotelId` | Submit review (auth) |

### Admin (Admin Role Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| POST | `/api/admin/hotels` | Create hotel |
| PUT | `/api/admin/hotels/:id` | Update hotel |
| DELETE | `/api/admin/hotels/:id` | Delete hotel |
| POST | `/api/admin/hotels/:hotelId/rooms` | Create room |
| PUT | `/api/admin/rooms/:roomId` | Update room |
| DELETE | `/api/admin/rooms/:roomId` | Delete room |
| GET | `/api/admin/bookings` | All bookings |
| PATCH | `/api/admin/bookings/:id/cancel` | Cancel any booking |
| GET | `/api/admin/users` | List users |
| PATCH | `/api/admin/users/:id/suspend` | Suspend user |
| PATCH | `/api/admin/users/:id/activate` | Activate user |

## Query Parameters

### Hotels List
- `city` - Filter by city
- `minPrice` / `maxPrice` - Price range
- `minRating` - Minimum rating
- `amenities` - Comma-separated amenity names
- `guests` - Minimum capacity
- `sortBy` - `price_asc`, `price_desc`, `rating`, `popular`
- `page` / `limit` - Pagination

### Availability Check
- `checkIn` / `checkOut` - Date range (required)
- `roomId` - Specific room
- `rooms` - Number of rooms needed

## Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

## Test Credentials

After seeding:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotelbooking.com | admin123 |
| User | john@example.com | password123 |
| User | jane@example.com | password123 |

## Availability Logic

The booking system prevents overbooking using:

1. **Transaction + Row Locking**: Uses MySQL `FOR UPDATE` to lock rows during availability check
2. **Overlap Detection**: Counts bookings where `checkIn < requestedCheckOut AND checkOut > requestedCheckIn`
3. **Status Filter**: Only counts `confirmed` and `pending_payment` bookings
4. **Atomic Check**: Availability check and booking creation happen in single transaction

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── src/
│   ├── lib/             # Utilities (prisma, jwt)
│   ├── middleware/      # Auth, error, validation
│   ├── routes/          # API routes
│   ├── schemas/         # Zod validation schemas
│   ├── services/        # Business logic
│   └── index.ts         # Entry point
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Development

```bash
# Run dev server with hot reload
npm run dev

# Open Prisma Studio (DB GUI)
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Run tests
npm test
```

## Production Deployment

1. Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
2. Use managed MySQL (AWS RDS, PlanetScale, etc.)
3. Set `NODE_ENV=production`
4. Use Docker or deploy to cloud platform
5. Set up SSL/TLS
6. Configure proper CORS origins
