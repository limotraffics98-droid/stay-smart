import { PrismaClient, UserRole, BookingStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.roomImage.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotelAmenity.deleteMany();
  await prisma.hotelImage.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('📦 Creating amenities...');
  const amenities = await Promise.all([
    prisma.amenity.create({ data: { name: 'Free WiFi', icon: 'Wifi' } }),
    prisma.amenity.create({ data: { name: 'Swimming Pool', icon: 'Waves' } }),
    prisma.amenity.create({ data: { name: 'Spa', icon: 'Sparkles' } }),
    prisma.amenity.create({ data: { name: 'Gym', icon: 'Dumbbell' } }),
    prisma.amenity.create({ data: { name: 'Restaurant', icon: 'UtensilsCrossed' } }),
    prisma.amenity.create({ data: { name: 'Bar', icon: 'Wine' } }),
    prisma.amenity.create({ data: { name: 'Parking', icon: 'Car' } }),
    prisma.amenity.create({ data: { name: 'Room Service', icon: 'ConciergeBell' } }),
    prisma.amenity.create({ data: { name: 'Pet Friendly', icon: 'Dog' } }),
    prisma.amenity.create({ data: { name: 'Beach Access', icon: 'Umbrella' } }),
    prisma.amenity.create({ data: { name: 'Airport Shuttle', icon: 'Plane' } }),
    prisma.amenity.create({ data: { name: 'Business Center', icon: 'Briefcase' } }),
  ]);

  console.log('👤 Creating users...');
  const passwordHash = await bcrypt.hash('password123', 12);
  const adminPasswordHash = await bcrypt.hash('admin123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@hotelbooking.com',
        phone: '+1234567890',
        passwordHash: adminPasswordHash,
        role: UserRole.admin,
      },
    }),
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1987654321',
        passwordHash,
        role: UserRole.user,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1122334455',
        passwordHash,
        role: UserRole.user,
      },
    }),
  ]);

  console.log('🏨 Creating hotels...');
  const hotelsData = [
    {
      name: 'The Grand Palace Hotel',
      city: 'New York',
      address: '123 Fifth Avenue, New York, NY 10001',
      description: 'Experience luxury at its finest in the heart of Manhattan. The Grand Palace Hotel offers breathtaking views of Central Park, world-class dining, and impeccable service that defines New York elegance.',
      rating: 4.8,
      lat: 40.7484,
      lng: -73.9857,
      mainImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      priceFrom: 450,
      amenityIndices: [0, 1, 2, 3, 4, 5, 6, 7],
    },
    {
      name: 'Oceanfront Paradise Resort',
      city: 'Miami',
      address: '500 Ocean Drive, Miami Beach, FL 33139',
      description: 'Wake up to stunning ocean views and feel the warm Miami breeze. Our beachfront resort offers the perfect blend of relaxation and excitement with direct beach access and vibrant nightlife.',
      rating: 4.6,
      lat: 25.7617,
      lng: -80.1918,
      mainImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      priceFrom: 380,
      amenityIndices: [0, 1, 2, 4, 5, 6, 9],
    },
    {
      name: 'Mountain View Lodge',
      city: 'Denver',
      address: '789 Mountain Road, Denver, CO 80202',
      description: 'Nestled in the Rocky Mountains, our lodge offers a perfect escape for nature lovers. Enjoy hiking trails, ski slopes, and cozy fireplaces with panoramic mountain views.',
      rating: 4.5,
      lat: 39.7392,
      lng: -104.9903,
      mainImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      priceFrom: 280,
      amenityIndices: [0, 3, 4, 6, 8],
    },
    {
      name: 'City Center Business Hotel',
      city: 'Chicago',
      address: '200 Michigan Avenue, Chicago, IL 60601',
      description: 'Perfectly positioned for business travelers, our hotel offers state-of-the-art facilities, meeting rooms, and quick access to the financial district.',
      rating: 4.3,
      lat: 41.8781,
      lng: -87.6298,
      mainImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      priceFrom: 220,
      amenityIndices: [0, 3, 4, 6, 7, 11],
    },
    {
      name: 'Golden Gate Boutique Hotel',
      city: 'San Francisco',
      address: '450 Union Square, San Francisco, CA 94108',
      description: 'A charming boutique hotel in the heart of San Francisco. Explore the iconic Golden Gate Bridge, Fisherman\'s Wharf, and vibrant neighborhoods from our central location.',
      rating: 4.7,
      lat: 37.7749,
      lng: -122.4194,
      mainImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      priceFrom: 350,
      amenityIndices: [0, 4, 5, 6, 7, 8],
    },
    {
      name: 'Desert Oasis Spa Resort',
      city: 'Phoenix',
      address: '1000 Desert Springs Way, Phoenix, AZ 85001',
      description: 'Find tranquility in the Arizona desert. Our spa resort offers world-renowned wellness treatments, stunning desert landscapes, and luxurious accommodations.',
      rating: 4.9,
      lat: 33.4484,
      lng: -112.0740,
      mainImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      priceFrom: 420,
      amenityIndices: [0, 1, 2, 3, 4, 6],
    },
    {
      name: 'Historic Quarter Inn',
      city: 'New Orleans',
      address: '300 Bourbon Street, New Orleans, LA 70130',
      description: 'Immerse yourself in the rich culture of New Orleans. Located in the French Quarter, our inn offers easy access to jazz clubs, legendary cuisine, and historic architecture.',
      rating: 4.4,
      lat: 29.9511,
      lng: -90.0715,
      mainImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      priceFrom: 195,
      amenityIndices: [0, 4, 5, 7, 8],
    },
    {
      name: 'Lakeside Retreat Hotel',
      city: 'Seattle',
      address: '100 Lakeshore Drive, Seattle, WA 98101',
      description: 'Overlooking Lake Washington with views of Mount Rainier, our retreat offers a peaceful escape with easy access to Seattle\'s tech hub and cultural attractions.',
      rating: 4.6,
      lat: 47.6062,
      lng: -122.3321,
      mainImage: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      priceFrom: 310,
      amenityIndices: [0, 1, 3, 4, 6, 7],
    },
    {
      name: 'Hollywood Glamour Hotel',
      city: 'Los Angeles',
      address: '6800 Hollywood Boulevard, Los Angeles, CA 90028',
      description: 'Live like a star at our glamorous Hollywood hotel. Walk the Walk of Fame, explore studio tours, and experience the entertainment capital of the world.',
      rating: 4.5,
      lat: 34.0522,
      lng: -118.2437,
      mainImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      priceFrom: 380,
      amenityIndices: [0, 1, 2, 3, 4, 5, 6, 7],
    },
    {
      name: 'Capitol Hill Suites',
      city: 'Washington DC',
      address: '400 Pennsylvania Avenue, Washington, DC 20001',
      description: 'Steps away from the National Mall and Smithsonian museums. Our elegant suites provide the perfect base for exploring the nation\'s capital.',
      rating: 4.4,
      lat: 38.9072,
      lng: -77.0369,
      mainImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      priceFrom: 290,
      amenityIndices: [0, 3, 4, 6, 7, 10, 11],
    },
  ];

  const hotels = [];
  for (const hotelData of hotelsData) {
    const { amenityIndices, ...data } = hotelData;
    const hotel = await prisma.hotel.create({
      data: {
        ...data,
        images: {
          create: [
            { imageUrl: data.mainImage, order: 0 },
            { imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', order: 1 },
            { imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', order: 2 },
            { imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', order: 3 },
          ],
        },
        amenities: {
          create: amenityIndices.map((idx) => ({
            amenityId: amenities[idx].id,
          })),
        },
      },
    });
    hotels.push(hotel);
  }

  console.log('🛏️ Creating rooms...');
  const roomTypes = [
    { name: 'Standard Room', roomType: 'standard', capacity: 2, priceMultiplier: 1, totalRooms: 20 },
    { name: 'Deluxe Room', roomType: 'deluxe', capacity: 2, priceMultiplier: 1.5, totalRooms: 15 },
    { name: 'Suite', roomType: 'suite', capacity: 4, priceMultiplier: 2.5, totalRooms: 8 },
    { name: 'Family Room', roomType: 'family', capacity: 6, priceMultiplier: 2, totalRooms: 5 },
  ];

  const rooms = [];
  for (const hotel of hotels) {
    for (const roomType of roomTypes) {
      const room = await prisma.room.create({
        data: {
          hotelId: hotel.id,
          name: roomType.name,
          roomType: roomType.roomType,
          description: `Comfortable ${roomType.name.toLowerCase()} with modern amenities and stunning views.`,
          capacity: roomType.capacity,
          pricePerNight: Number(hotel.priceFrom) * roomType.priceMultiplier,
          totalRooms: roomType.totalRooms,
          images: {
            create: [
              { imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', order: 0 },
              { imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', order: 1 },
            ],
          },
        },
      });
      rooms.push(room);
    }
  }

  console.log('📝 Creating sample bookings...');
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  const futureCheckout = new Date(futureDate);
  futureCheckout.setDate(futureCheckout.getDate() + 3);

  await prisma.booking.create({
    data: {
      userId: users[1].id,
      hotelId: hotels[0].id,
      roomId: rooms[0].id,
      checkIn: futureDate,
      checkOut: futureCheckout,
      guests: 2,
      roomsCount: 1,
      totalAmount: 1350,
      status: BookingStatus.confirmed,
      paymentStatus: PaymentStatus.paid,
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '+1987654321',
      payments: {
        create: {
          provider: 'stripe',
          providerRef: 'pi_test_123456789',
          amount: 1350,
          currency: 'USD',
          status: PaymentStatus.paid,
        },
      },
    },
  });

  console.log('⭐ Creating reviews...');
  const reviewsData = [
    { userId: users[1].id, hotelId: hotels[0].id, rating: 5, comment: 'Absolutely stunning hotel! The views of Central Park are breathtaking and the service is impeccable.' },
    { userId: users[2].id, hotelId: hotels[0].id, rating: 4, comment: 'Great location and beautiful rooms. Would definitely stay again.' },
    { userId: users[1].id, hotelId: hotels[1].id, rating: 5, comment: 'Perfect beach getaway! The pool area is amazing and the staff was so friendly.' },
    { userId: users[2].id, hotelId: hotels[2].id, rating: 4, comment: 'Beautiful mountain views and cozy atmosphere. Great for a winter escape.' },
  ];

  for (const review of reviewsData) {
    await prisma.review.create({ data: review });
  }

  // Update hotel ratings based on reviews
  for (const hotel of hotels) {
    const reviews = await prisma.review.findMany({
      where: { hotelId: hotel.id },
    });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await prisma.hotel.update({
        where: { id: hotel.id },
        data: { rating: avgRating },
      });
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log(`
📊 Summary:
- ${amenities.length} amenities
- ${users.length} users (1 admin, 2 regular)
- ${hotels.length} hotels
- ${rooms.length} rooms
- Sample bookings and reviews

🔐 Login Credentials:
Admin: admin@hotelbooking.com / admin123
User 1: john@example.com / password123
User 2: jane@example.com / password123
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
