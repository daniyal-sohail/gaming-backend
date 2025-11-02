import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
            unique: true,
            index: true,
        },
        roleTitle: {
            type: String,
            default: "Administrator",
            trim: true,
        },
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
