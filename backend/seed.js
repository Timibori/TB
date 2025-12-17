const mongoose = require('mongoose');
const Menu = require('./models/Menu'); // Ensure this path matches your 'models' folder

// This is your specific Database Connection
const MONGO_URI = 'mongodb+srv://bmaho6630_db_user:strategodak@cluster0.tcdrreg.mongodb.net/tastybites?appName=Cluster0';

// Your Menu Data
const menuItems = [
    { 
      name: "Spaghetti Bolognese", 
      desc: "Classic Italian pasta with rich meat sauce", 
      price: 12.99, 
      category: "Main",
      image: "https://placehold.co/400?text=Pasta"
    },
    { 
      name: "Grilled Salmon", 
      desc: "Fresh salmon with lemon butter sauce and vegetables", 
      price: 18.99, 
      category: "Main",
      image: "https://placehold.co/400?text=Salmon" 
    },
    { 
      name: "Margherita Pizza", 
      desc: "Traditional pizza with tomato, mozzarella, and basil", 
      price: 14.99, 
      category: "Main",
      image: "https://placehold.co/400?text=Pizza" 
    },
    { 
      name: "Caesar Salad", 
      desc: "Crisp romaine lettuce with Caesar dressing and croutons", 
      price: 10.99, 
      category: "Appetizer",
      image: "https://placehold.co/400?text=Salad" 
    },
    { 
      name: "Beef Burger", 
      desc: "Juicy beef patty with cheese, lettuce, and special sauce", 
      price: 13.99, 
      category: "Main",
      image: "https://placehold.co/400?text=Burger" 
    },
    { 
      name: "Chocolate Lava Cake", 
      desc: "Warm chocolate cake with a molten center", 
      price: 8.99, 
      category: "Dessert",
      image: "https://placehold.co/400?text=Cake" 
    }
];

const seedDB = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // 2. Clear old data (Optional: removes duplicates)
    await Menu.deleteMany({});
    console.log("Old menu cleared!");

    // 3. Insert new items
    await Menu.insertMany(menuItems);
    console.log("Success! 6 Items added to Database.");

    // 4. Disconnect
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
  }
};

seedDB();