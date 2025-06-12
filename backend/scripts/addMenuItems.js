import mongoose from 'mongoose';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the food schema
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    image: { type: String, required: true },
    category: { type: String, required: true},
});

// Create the model
const FoodModel = mongoose.models.food || mongoose.model("food", foodSchema);

// Menu items data
const menuItems = [
    // Starters
    {
        name: "Chicken Wings",
        rating: 4.5,
        description: "Crispy fried chicken wings with spicy sauce",
        price: 299,
        image: "chicken-wings.jpg",
        category: "Starters"
    },
    {
        name: "Vegetable Spring Rolls",
        rating: 4.2,
        description: "Crispy spring rolls filled with vegetables",
        price: 199,
        image: "spring-rolls.jpg",
        category: "Starters"
    },
    {
        name: "Paneer Tikka",
        rating: 4.7,
        description: "Grilled cottage cheese with spices",
        price: 249,
        image: "paneer-tikka.jpg",
        category: "Starters"
    },
    {
        name: "Chicken 65",
        rating: 4.6,
        description: "Spicy deep-fried chicken with curry leaves",
        price: 279,
        image: "chicken-65.jpg",
        category: "Starters"
    },
    
    // Main Course - Veg
    {
        name: "Paneer Butter Masala",
        rating: 4.8,
        description: "Cottage cheese in rich tomato gravy",
        price: 299,
        image: "paneer-butter-masala.jpg",
        category: "Main Course"
    },
    {
        name: "Dal Makhani",
        rating: 4.5,
        description: "Creamy black lentils cooked overnight",
        price: 249,
        image: "dal-makhani.jpg",
        category: "Main Course"
    },
    {
        name: "Vegetable Biryani",
        rating: 4.4,
        description: "Fragrant rice with mixed vegetables",
        price: 279,
        image: "veg-biryani.jpg",
        category: "Main Course"
    },
    {
        name: "Malai Kofta",
        rating: 4.6,
        description: "Vegetable dumplings in creamy gravy",
        price: 269,
        image: "malai-kofta.jpg",
        category: "Main Course"
    },
    
    // Main Course - Non-Veg
    {
        name: "Butter Chicken",
        rating: 4.9,
        description: "Tender chicken in rich tomato-butter gravy",
        price: 349,
        image: "butter-chicken.jpg",
        category: "Main Course"
    },
    {
        name: "Chicken Biryani",
        rating: 4.7,
        description: "Fragrant rice with spiced chicken",
        price: 329,
        image: "chicken-biryani.jpg",
        category: "Main Course"
    },
    {
        name: "Mutton Rogan Josh",
        rating: 4.8,
        description: "Tender mutton in aromatic curry",
        price: 399,
        image: "mutton-rogan-josh.jpg",
        category: "Main Course"
    },
    {
        name: "Fish Curry",
        rating: 4.5,
        description: "Fresh fish in spicy coconut gravy",
        price: 359,
        image: "fish-curry.jpg",
        category: "Main Course"
    },
    
    // Breads
    {
        name: "Butter Naan",
        rating: 4.3,
        description: "Soft Indian bread with butter",
        price: 49,
        image: "butter-naan.jpg",
        category: "Breads"
    },
    {
        name: "Garlic Cheese Naan",
        rating: 4.6,
        description: "Naan stuffed with garlic and cheese",
        price: 79,
        image: "garlic-cheese-naan.jpg",
        category: "Breads"
    },
    {
        name: "Puri",
        rating: 4.2,
        description: "Deep-fried Indian bread",
        price: 59,
        image: "puri.jpg",
        category: "Breads"
    },
    {
        name: "Roti",
        rating: 4.1,
        description: "Whole wheat Indian bread",
        price: 39,
        image: "roti.jpg",
        category: "Breads"
    },
    
    // Desserts
    {
        name: "Gulab Jamun",
        rating: 4.7,
        description: "Sweet milk dumplings in sugar syrup",
        price: 89,
        image: "gulab-jamun.jpg",
        category: "Desserts"
    },
    {
        name: "Rasmalai",
        rating: 4.8,
        description: "Soft cottage cheese patties in sweet milk",
        price: 99,
        image: "rasmalai.jpg",
        category: "Desserts"
    },
    {
        name: "Ice Cream",
        rating: 4.5,
        description: "Vanilla ice cream with choice of toppings",
        price: 79,
        image: "ice-cream.jpg",
        category: "Desserts"
    },
    {
        name: "Kheer",
        rating: 4.6,
        description: "Sweet rice pudding with nuts",
        price: 69,
        image: "kheer.jpg",
        category: "Desserts"
    },
    
    // Beverages
    {
        name: "Masala Chai",
        rating: 4.4,
        description: "Indian spiced tea with milk",
        price: 49,
        image: "masala-chai.jpg",
        category: "Beverages"
    },
    {
        name: "Lassi",
        rating: 4.5,
        description: "Sweet yogurt drink",
        price: 59,
        image: "lassi.jpg",
        category: "Beverages"
    },
    {
        name: "Fresh Lime Soda",
        rating: 4.3,
        description: "Refreshing lime drink with soda",
        price: 49,
        image: "lime-soda.jpg",
        category: "Beverages"
    },
    {
        name: "Mango Shake",
        rating: 4.7,
        description: "Creamy mango milkshake",
        price: 69,
        image: "mango-shake.jpg",
        category: "Beverages"
    }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI;
        if (!dbURI) {
            throw new Error("MongoDB URI not found in environment variables");
        }

        // Add database name to URI if not present
        const dbName = "foodApp";
        const uriWithDb = dbURI.includes("/?") 
            ? dbURI.replace("/?", `/${dbName}?`)
            : `${dbURI}/${dbName}`;

        console.log("Connecting to MongoDB...");
        await mongoose.connect(uriWithDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Connected Successfully!");
        console.log("Database Name:", dbName);
        
        return true;
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        return false;
    }
};

// Add menu items to database
const addMenuItems = async () => {
    try {
        // Connect to database
        const connected = await connectDB();
        if (!connected) {
            console.error("Failed to connect to database");
            process.exit(1);
        }

        // Clear existing food items
        await FoodModel.deleteMany({});
        console.log("Cleared existing food items");

        // Insert new menu items
        const result = await FoodModel.insertMany(menuItems);
        console.log(`Successfully added ${result.length} menu items to the database`);

        // Disconnect from database
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");

        return true;
    } catch (error) {
        console.error("Error adding menu items:", error);
        return false;
    }
};

// Run the script
addMenuItems()
    .then(success => {
        if (success) {
            console.log("Menu items added successfully!");
        } else {
            console.error("Failed to add menu items");
        }
    })
    .catch(error => {
        console.error("Script error:", error);
    }); 