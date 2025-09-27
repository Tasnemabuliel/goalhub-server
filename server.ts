import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import superAdminRoutes from "./routes/superadmin";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

// ===== Middleware =====
app.use(cors());                 // כדי לאפשר בקשות מה-Client
app.use(express.json());         // קריאת body כ-JSON

// ===== Routes =====
app.use("/api/superadmin", superAdminRoutes);

// בדיקת חיים (Health check)
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "GoalHub API" });
});

// ===== MongoDB Connection =====
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // הפעלת השרת רק אחרי שהחיבור למסד נתונים הצליח
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
