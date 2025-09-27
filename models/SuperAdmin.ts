import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("SuperAdmin", superAdminSchema);
