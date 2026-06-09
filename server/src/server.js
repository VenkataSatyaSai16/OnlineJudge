import app from "./app.js";
import DBConnection from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
DBConnection();

app.listen(PORT , ()=>{
    console.log("Server is running on " + PORT);
})