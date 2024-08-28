import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({
    path: "./.env",
});

// Connect to the database and start the server
connectDB()
    .then(() => {
        // Start the server only if the database connection is successful
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    })
    .catch((error) => {
        // Log the database connection error and exit the process
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the process with failure code
    });
