const mongoose = require('mongoose');
const path = require('path');

// Fix the path to load .env file correctly with absolute path
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Log the connection string (without sensitive info) for debugging
console.log(`Attempting to connect to MongoDB at: ${process.env.MONGODB_URI ? 'URI found' : 'URI NOT FOUND'}`);

// Import the Museum model
const Museum = require('../models/Museum');

// Sample museums data organized by state
const museumsByState = {
  "Andhra Pradesh": [
    {
      name: "Salar Jung Museum",
      description: "One of the three National Museums of India, featuring the largest one-man collection of antiques in the world.",
      location: {
        city: "Hyderabad",
        state: "Andhra Pradesh",
        country: "India"
      },
      images: [
        {
          url: "https://i0.wp.com/weekendyaari.in/wp-content/uploads/2024/11/Salarjung-Museum-hyd.webp?fit=1500%2C1000&ssl=1",
          caption: "Salar Jung Museum"
        }
      ],
      ticketPrices: {
        adult: 50,
        child: 0,
        senior: 20
      },
      openingHours: {
        open: "10:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://salarjungmuseum.in/"
      },
      featured: true
    },
    {
      name: "Archaeological Museum",
      description: "Home to ancient Buddhist sculptures and artifacts from the Amaravati Stupa dating back to the 3rd century BCE.",
      location: {
        city: "Amaravati",
        state: "Andhra Pradesh",
        country: "India"
      },
      images: [
        {
          url: "https://s7ap1.scene7.com/is/image/incredibleindia/amaravati-archaeological-museum-amaravati-andhra-pradesh-4-attr-hero?qlt=82&ts=1726743670605",
          caption: "Archaeological Museum"
        }
      ],
      ticketPrices: {
        adult: 30,
        child: 0,
        senior: 15
      },
      openingHours: {
        open: "09:00",
        close: "17:30"
      },
      contactInfo: {
        website: "https://en.wikipedia.org/wiki/Amaravati_Archaeological_Museum"
      },
      featured: false
    },
    {
      name: "Visakha Museum",
      description: "Houses artifacts and collections relating to the cultural heritage of Visakhapatnam, including ship models and archaeological finds.",
      location: {
        city: "Visakhapatnam",
        state: "Andhra Pradesh",
        country: "India"
      },
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Visakha_Museum.jpg",
          caption: "Visakha Museum"
        }
      ],
      ticketPrices: {
        adult: 25,
        child: 0,
        senior: 10
      },
      openingHours: {
        open: "10:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://www.vizagcityonline.com/visakha-museum"
      },
      featured: false
    }
  ],
  "Delhi": [
    {
      name: "National Museum",
      description: "Houses over 200,000 artworks spanning 5,000 years of Indian cultural heritage and world civilizations.",
      location: {
        city: "New Delhi",
        state: "Delhi",
        country: "India"
      },
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/India_national_museum_01.jpg/250px-India_national_museum_01.jpg",
          caption: "National Museum"
        }
      ],
      ticketPrices: {
        adult: 50,
        child: 0,
        senior: 25
      },
      openingHours: {
        open: "10:00",
        close: "18:00"
      },
      contactInfo: {
        website: "https://nationalmuseumindia.gov.in/"
      },
      featured: true
    },
    {
      name: "National Gallery of Modern Art",
      description: "Showcasing the changing art forms in Indian paintings, sculptures and graphics throughout the years.",
      location: {
        city: "New Delhi",
        state: "Delhi",
        country: "India"
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=1200&auto=format&fit=crop",
          caption: "National Gallery of Modern Art"
        }
      ],
      ticketPrices: {
        adult: 40,
        child: 0,
        senior: 20
      },
      openingHours: {
        open: "11:00",
        close: "18:00"
      },
      contactInfo: {
        website: "https://ngmaindia.gov.in/"
      },
      featured: true
    },
    {
      name: "Red Fort Archaeological Museum",
      description: "Located inside the historic Red Fort, displaying artifacts from the Mughal era.",
      location: {
        city: "New Delhi",
        state: "Delhi",
        country: "India"
      },
      images: [
        {
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7_l9GvkWlxR0qejyadBFrL5gMxyxwKpUeCw&s",
          caption: "Red Fort Archaeological Museum"
        }
      ],
      ticketPrices: {
        adult: 35,
        child: 0,
        senior: 15
      },
      openingHours: {
        open: "09:30",
        close: "16:30"
      },
      contactInfo: {
        website: "https://asi.nic.in/pages/WorldHeritageRedFort"
      },
      featured: false
    }
  ],
  "Gujarat": [
    {
      name: "Calico Museum of Textiles",
      description: "One of the finest textile museums in the world with an outstanding collection of Indian fabrics and historical textiles.",
      location: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India"
      },
      images: [
        {
          url: "https://calicomuseum.org/wp-content/uploads/2013/10/DSC_8569_web.jpg",
          caption: "Calico Museum of Textiles"
        }
      ],
      ticketPrices: {
        adult: 30,
        child: 0,
        senior: 15
      },
      openingHours: {
        open: "10:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://www.calicomuseum.org/"
      },
      featured: true
    },
    {
      name: "Lalbhai Dalpatbhai Museum",
      description: "Houses a collection of paintings, sculptures, and other exhibits with emphasis on Jain art forms.",
      location: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India"
      },
      images: [
        {
          url: "https://ahmedabadtourism.in/images/places-to-visit/headers/lalbhai-dalpatbhai-museum-ahmedabad-tourism-entry-fee-timings-holidays-reviews-header.jpg",
          caption: "Lalbhai Dalpatbhai Museum"
        }
      ],
      ticketPrices: {
        adult: 25,
        child: 0,
        senior: 10
      },
      openingHours: {
        open: "10:30",
        close: "17:30"
      },
      contactInfo: {
        website: "https://www.ldmuseum.co.in/"
      },
      featured: false
    },
    {
      name: "Sardar Vallabhbhai Patel National Museum",
      description: "Dedicated to the life and achievements of Sardar Vallabhbhai Patel, with exhibits showcasing his contributions to India's independence.",
      location: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India"
      },
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Sardar_Patel_National_Memorial.jpg/640px-Sardar_Patel_National_Memorial.jpg",
          caption: "Sardar Vallabhbhai Patel National Museum"
        }
      ],
      ticketPrices: {
        adult: 20,
        child: 0,
        senior: 10
      },
      openingHours: {
        open: "09:30",
        close: "17:00"
      },
      contactInfo: {
        website: "https://sardarvallabhbhaipatelnationalmuseum.org/"
      },
      featured: false
    }
  ],
  "Karnataka": [
    {
      name: "Government Museum",
      description: "One of the oldest museums in India, featuring archaeological artifacts, paintings, and geological exhibits.",
      location: {
        city: "Bangalore",
        state: "Karnataka",
        country: "India"
      },
      images: [
        {
          url: "https://static.toiimg.com/thumb/62277521/Government-Museum.jpg?width=1200&height=900",
          caption: "Government Museum"
        }
      ],
      ticketPrices: {
        adult: 20,
        child: 0,
        senior: 10
      },
      openingHours: {
        open: "10:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://archaeology.karnataka.gov.in/page/Government+Museums/Government+Museums+Bengaluru/en"
      },
      featured: false
    },
    {
      name: "Mysore Palace Museum",
      description: "Located within the magnificent Mysore Palace, displaying royal treasures, weapons, paintings, and artifacts.",
      location: {
        city: "Mysore",
        state: "Karnataka",
        country: "India"
      },
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Front_view_of_the_Mysore_palace.jpg/1200px-Front_view_of_the_Mysore_palace.jpg",
          caption: "Mysore Palace Museum"
        }
      ],
      ticketPrices: {
        adult: 50,
        child: 0,
        senior: 25
      },
      openingHours: {
        open: "10:00",
        close: "17:30"
      },
      contactInfo: {
        website: "https://mysorepalace.gov.in/"
      },
      featured: true
    }
  ],
  "Maharashtra": [
    {
      name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
      description: "Formerly known as the Prince of Wales Museum, featuring Indo-Saracenic architectural style and extensive art collections.",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=1200&auto=format&fit=crop",
          caption: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya"
        }
      ],
      ticketPrices: {
        adult: 70,
        child: 0,
        senior: 35
      },
      openingHours: {
        open: "10:15",
        close: "18:00"
      },
      contactInfo: {
        website: "https://csmvs.in/"
      },
      featured: true
    },
    {
      name: "Raja Dinkar Kelkar Museum",
      description: "Contains the collection of Dr. Dinkar G. Kelkar, dedicated to everyday arts of the Maratha period.",
      location: {
        city: "Pune",
        state: "Maharashtra",
        country: "India"
      },
      images: [
        {
          url: "https://img-cdn.thepublive.com/filters:format(webp)/local-samosal/media/media_files/pgZODvPlwDSNcLFDdX9c.png",
          caption: "Raja Dinkar Kelkar Museum"
        }
      ],
      ticketPrices: {
        adult: 40,
        child: 0,
        senior: 20
      },
      openingHours: {
        open: "09:30",
        close: "17:30"
      },
      contactInfo: {
        website: "https://rajakelkarmuseum.org/"
      },
      featured: false
    },
    {
      name: "Jehangir Art Gallery",
      description: "Mumbai's premier art institution showcasing contemporary Indian art in rotating exhibitions.",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
      },
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Jehangir_Art_Gallery.jpg",
          caption: "Jehangir Art Gallery"
        }
      ],
      ticketPrices: {
        adult: 30,
        child: 0,
        senior: 15
      },
      openingHours: {
        open: "11:00",
        close: "19:00"
      },
      contactInfo: {
        website: "http://www.jehangirartgallery.com/"
      },
      featured: false
    }
  ],
  "Rajasthan": [
    {
      name: "Albert Hall Museum",
      description: "The oldest museum in Rajasthan, featuring a rich collection of artifacts including paintings, jewelry, carpets, and more.",
      location: {
        city: "Jaipur",
        state: "Rajasthan",
        country: "India"
      },
      images: [
        {
          url: "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-museum-jaipur-rajasthan-3-attr-hero?qlt=82&ts=1726660086518",
          caption: "Albert Hall Museum"
        }
      ],
      ticketPrices: {
        adult: 40,
        child: 0,
        senior: 20
      },
      openingHours: {
        open: "09:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://shop.museumsofindia.org/node/412"
      },
      featured: true
    },
    {
      name: "City Palace Museum",
      description: "Located within the City Palace complex, showcasing royal artifacts, miniature paintings, and traditional Rajasthani arts.",
      location: {
        city: "Udaipur",
        state: "Rajasthan",
        country: "India"
      },
      images: [
        {
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9nz1ahkd47CqDpM4jzQBOA9nMkpLOM-XVyA&s",
          caption: "City Palace Museum"
        }
      ],
      ticketPrices: {
        adult: 30,
        child: 0,
        senior: 15
      },
      openingHours: {
        open: "09:30",
        close: "17:30"
      },
      contactInfo: {
        website: "https://www.citypalacemuseum.org/"
      },
      featured: false
    },
    {
      name: "Mehrangarh Fort Museum",
      description: "Set within the historic Mehrangarh Fort, displaying royal palanquins, arms, costumes, paintings, and artifacts.",
      location: {
        city: "Jodhpur",
        state: "Rajasthan",
        country: "India"
      },
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Jodhpur_mehrangarh_fort.jpg",
          caption: "Mehrangarh Fort Museum"
        }
      ],
      ticketPrices: {
        adult: 60,
        child: 0,
        senior: 30
      },
      openingHours: {
        open: "09:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://www.mehrangarh.org/"
      },
      featured: true
    }
  ],
  "Tamil Nadu": [
    {
      name: "Government Museum",
      description: "Established in 1851, featuring archaeological, numismatic, zoological and botanical collections.",
      location: {
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India"
      },
      images: [
        {
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM1f29PqAxFrPTUpr3ibsfoy_eMqJHHOstnQ&s",
          caption: "Government Museum"
        }
      ],
      ticketPrices: {
        adult: 15,
        child: 0,
        senior: 10
      },
      openingHours: {
        open: "09:30",
        close: "17:00"
      },
      contactInfo: {
        website: "https://www.chennaimuseum.org/"
      },
      featured: false
    },
    {
      name: "Thanjavur Art Gallery",
      description: "Located within the Thanjavur Palace complex, housing a collection of bronze and stone sculptures from the 7th to 18th centuries.",
      location: {
        city: "Thanjavur",
        state: "Tamil Nadu",
        country: "India"
      },
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Thanjavur_Maratha_Palace_Darbar_Hall.jpg",
          caption: "Thanjavur Art Gallery"
        }
      ],
      ticketPrices: {
        adult: 20,
        child: 0,
        senior: 10
      },
      openingHours: {
        open: "10:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://tourism.gov.in/thanjavur-art-gallery"
      },
      featured: false
    }
  ],
  "West Bengal": [
    {
      name: "Indian Museum",
      description: "Established in 1814, it is the oldest and largest museum in India with rare collections of antiques, armor, ornaments, fossils and mummies.",
      location: {
        city: "Kolkata",
        state: "West Bengal",
        country: "India"
      },
      images: [
        {
          url: "https://www.trawell.in/admin/images/upload/555418834Kolkata_Indian_Museum_Main.jpg",
          caption: "Indian Museum"
        }
      ],
      ticketPrices: {
        adult: 20,
        child: 0,
        senior: 10
      },
      openingHours: {
        open: "10:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://indianmuseumkolkata.org/"
      },
      featured: true
    },
    {
      name: "Victoria Memorial Hall",
      description: "A magnificent marble building dedicated to the memory of Queen Victoria, now serving as a museum with rare artifacts.",
      location: {
        city: "Kolkata",
        state: "West Bengal",
        country: "India"
      },
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/7/72/Victoria_Memorial_situated_in_Kolkata.jpg",
          caption: "Victoria Memorial Hall"
        }
      ],
      ticketPrices: {
        adult: 30,
        child: 0,
        senior: 15
      },
      openingHours: {
        open: "10:00",
        close: "18:00"
      },
      contactInfo: {
        website: "https://victoriamemorial-cal.org/"
      },
      featured: true
    },
    {
      name: "Academy of Fine Arts",
      description: "Showcasing contemporary Indian art with regular exhibitions by prominent artists.",
      location: {
        city: "Kolkata",
        state: "West Bengal",
        country: "India"
      },
      images: [
        {
          url: "https://static.toiimg.com/photo/msid-62656139,width-96,height-65.cms",
          caption: "Academy of Fine Arts"
        }
      ],
      ticketPrices: {
        adult: 15,
        child: 0,
        senior: 10
      },
      openingHours: {
        open: "12:00",
        close: "20:00"
      },
      contactInfo: {
        website: "https://academyoffineartskolkata.com/"
      },
      featured: false
    }
  ],
  "Kerala": [
    {
      name: "Kerala State Museum",
      description: "Houses an impressive collection of archaeological artifacts, bronze sculptures, and historical exhibits from Kerala's rich past.",
      location: {
        city: "Thiruvananthapuram",
        state: "Kerala",
        country: "India"
      },
      images: [
        {
          url: "https://www.keralatourism.org/images/enchanting_kerala/large/napier_museum20181008062418_32_1.jpg",
          caption: "Kerala State Museum"
        }
      ],
      ticketPrices: {
        adult: 25,
        child: 0,
        senior: 15
      },
      openingHours: {
        open: "10:00",
        close: "17:00"
      },
      contactInfo: {
        website: "https://museumkerala.gov.in/"
      },
      featured: false
    },
    {
      name: "Hill Palace Museum",
      description: "The largest archaeological museum in Kerala, displaying royal artifacts from the Kochi Royal Family.",
      location: {
        city: "Kochi",
        state: "Kerala",
        country: "India"
      },
      images: [
        {
          url: "https://www.keralatourism.org/images/destination/large/hill_palace_museum_tripunithura20131107155723_79_1.jpg",
          caption: "Hill Palace Museum"
        }
      ],
      ticketPrices: {
        adult: 30,
        child: 0,
        senior: 15
      },
      openingHours: {
        open: "09:30",
        close: "16:30"
      },
      contactInfo: {
        website: "https://www.keralatourism.org/destination/hill-palace-museum-tripunithura/79"
      },
      featured: false
    }
  ]
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

// Function to seed museums
const seedMuseums = async () => {
  try {
    // First, clear existing museums
    await Museum.deleteMany({});
    console.log('Cleared existing museums from database');

    // Prepare museums data for insertion
    const museumsToInsert = [];
    
    Object.entries(museumsByState).forEach(([state, museums]) => {
      museums.forEach(museum => {
        museumsToInsert.push(museum);
      });
    });
    
    // Insert all museums
    const result = await Museum.insertMany(museumsToInsert);
    console.log(`Successfully inserted ${result.length} museums into the database`);
    
    return result;
  } catch (error) {
    console.error('Error seeding museums:', error);
    throw error;
  }
};

// Run the seeding function
const runSeed = async () => {
  try {
    await connectDB();
    const seededMuseums = await seedMuseums();
    console.log(`Seeded ${seededMuseums.length} museums successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding process:', error);
    process.exit(1);
  }
};

runSeed();