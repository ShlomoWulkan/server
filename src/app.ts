import express from "express";  
import cors from "cors";
import connectDB from "./config/db";
import "dotenv/config";

const port = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(cors());

app.listen(port, () => {
  console.log("Server is running on port 3000");
});

