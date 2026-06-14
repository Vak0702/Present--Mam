const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const teacherRoutes = require("./routes/teacherRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

dotenv.config();

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Present Mam Backend is Running...");
});

app.use("/api/students", studentRoutes);
const PORT = process.env.PORT || 5000;

app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});