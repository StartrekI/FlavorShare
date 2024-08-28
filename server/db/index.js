import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.MONGO_DB;

console.log('DB_URI:', DB_URI); // Add this line to check if DB_URI is loaded

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MONGODB CONNECTED!! DB HOST: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`MONGODB CONNECTION ERROR: ${error}`);
        throw error; // Ensure the promise is rejected
    }
}

export default connectDB;
