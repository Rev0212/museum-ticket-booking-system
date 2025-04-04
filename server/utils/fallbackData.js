/**
 * Static fallback data for when API requests fail
 */

// Sample museums data
exports.museums = [
  {
    _id: "60a1e2c98b1f2c0015c5a7a1",
    name: "National Museum",
    description: "The National Museum in New Delhi is one of the largest museums in India, holding a diverse collection of articles ranging from the pre-historic era to modern works of art.",
    shortDescription: "India's premier cultural institution focused on preserving the country's rich heritage",
    city: "New Delhi",
    state: "Delhi",
    location: {
      address: "Janpath, New Delhi, Delhi 110011",
      coordinates: {
        latitude: 28.6127,
        longitude: 77.2195
      }
    },
    ticketPrice: {
      adult: 50,
      child: 0,  // Free for children
      senior: 20,
      student: 20
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1609254116977-65ea1782e2b6?q=80&w=1200&auto=format&fit=crop",
        caption: "National Museum exterior view"
      },
      {
        url: "https://images.unsplash.com/photo-1584652188398-73ea32f67fee?q=80&w=1200&auto=format&fit=crop",
        caption: "Ancient artifacts display"
      }
    ],
    operatingHours: [
      { day: "Monday", open: "Closed", close: "Closed", closed: true },
      { day: "Tuesday", open: "10:00", close: "18:00", closed: false },
      { day: "Wednesday", open: "10:00", close: "18:00", closed: false },
      { day: "Thursday", open: "10:00", close: "18:00", closed: false },
      { day: "Friday", open: "10:00", close: "18:00", closed: false },
      { day: "Saturday", open: "10:00", close: "20:00", closed: false },
      { day: "Sunday", open: "10:00", close: "20:00", closed: false }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/National_Museum,_New_Delhi"
  },
  {
    _id: "60a1e2c98b1f2c0015c5a7a2",
    name: "Salar Jung Museum",
    description: "The Salar Jung Museum is an art museum located in Hyderabad, India. It is one of the three National Museums of India and has a collection of sculptures, paintings, carvings, textiles, manuscripts, ceramics, metallic artifacts, carpets, clocks, and furniture from Japan, China, Burma, Nepal, India, Persia, Egypt, Europe, and North America.",
    shortDescription: "One of the largest art museums globally, featuring the collection of the Salar Jung family",
    city: "Hyderabad",
    state: "Telangana",
    location: {
      address: "Salar Jung Road, Darulshifa, Hyderabad, Telangana 500002",
      coordinates: {
        latitude: 17.3714,
        longitude: 78.4804
      }
    },
    ticketPrice: {
      adult: 50,
      child: 0,
      senior: 20,
      student: 20
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1605177629218-51c1a3aae412?q=80&w=1200&auto=format&fit=crop",
        caption: "Salar Jung Museum facade"
      }
    ],
    operatingHours: [
      { day: "Monday", open: "Closed", close: "Closed", closed: true },
      { day: "Tuesday", open: "10:00", close: "17:00", closed: false },
      { day: "Wednesday", open: "10:00", close: "17:00", closed: false },
      { day: "Thursday", open: "10:00", close: "17:00", closed: false },
      { day: "Friday", open: "10:00", close: "17:00", closed: false },
      { day: "Saturday", open: "10:00", close: "17:00", closed: false },
      { day: "Sunday", open: "10:00", close: "17:00", closed: false }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Salar_Jung_Museum"
  }
];

// Sample events data
exports.events = [
  {
    _id: "60a1e2c98b1f2c0015c5a7b1",
    title: "Classical Dance Performance: Bharatanatyam",
    description: "Experience the ancient Indian classical dance form Bharatanatyam, featuring renowned dancers performing traditional pieces that tell stories from Indian mythology.",
    museumId: "60a1e2c98b1f2c0015c5a7a1",
    startDate: new Date(2025, 3, 15), // April 15, 2025
    endDate: new Date(2025, 3, 15),
    startTime: "18:30",
    endTime: "20:30",
    category: "Performance",
    image: "https://images.unsplash.com/photo-1635321593217-40050ad13c74?q=80&w=1200&auto=format&fit=crop",
    location: "National Museum Auditorium, New Delhi"
  },
  {
    _id: "60a1e2c98b1f2c0015c5a7b2",
    title: "Textile Heritage: Weaving Workshop",
    description: "Learn traditional Indian weaving techniques in this hands-on workshop led by master craftsmen. Create your own small tapestry while exploring the rich textile heritage of India.",
    museumId: "60a1e2c98b1f2c0015c5a7a2",
    startDate: new Date(2025, 3, 20), // April 20, 2025
    endDate: new Date(2025, 3, 20),
    startTime: "10:00",
    endTime: "13:00",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1200&auto=format&fit=crop",
    location: "Salar Jung Museum, Hyderabad"
  }
];

// Sample bookings data
exports.bookings = [
  {
    _id: "60a1e2c98b1f2c0015c5a7c1",
    user: "60a1e2c98b1f2c0015c5a7d1",
    museum: "60a1e2c98b1f2c0015c5a7a1",
    bookingReference: "MUSEUM-123456-7890",
    visitDate: new Date(2025, 4, 15), // May 15, 2025
    tickets: [
      { type: "adult", quantity: 2, price: 50 },
      { type: "child", quantity: 1, price: 0 }
    ],
    totalAmount: 100,
    paymentMethod: "credit_card",
    status: "confirmed",
    contactInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+919876543210"
    },
    createdAt: new Date()
  }
];