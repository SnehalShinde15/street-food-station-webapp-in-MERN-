import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI;
        if (!dbURI) {
            throw new Error("MongoDB URI not found in environment variables");
        }

        // Use the correct database name
        const dbName = "foodApp";
        const uriWithDb = dbURI.includes("/?") 
            ? dbURI.replace("/?", `/${dbName}?`)
            : `${dbURI}/${dbName}`;

        console.log("Connecting to MongoDB...");
        console.log("Database URI:", uriWithDb.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // Hide credentials in logs

        await mongoose.connect(uriWithDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Connected Successfully!");
        console.log("Database Name:", dbName);
        console.log("Connection State:", mongoose.connection.readyState);
        
        // Log when the connection is lost
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected!');
        });

        // Log when the connection is reconnected
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected!');
        });

    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};
