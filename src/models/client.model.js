import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
            unique: true,
            index: true,
        },
        companyName: {
            type: String,
            trim: true,
        },
        companyWebsite: {
            type: String,
            trim: true,
        },
        billingContactName: {
            type: String,
            trim: true,
        },
        billingContactEmail: {
            type: String,
            lowercase: true,
            trim: true,
        },
        billingAddress: {
            line1: { type: String, trim: true },
            line2: { type: String, trim: true },
            city: { type: String, trim: true },
            region: { type: String, trim: true },
            postalCode: { type: String, trim: true },
            country: { type: String, trim: true },
        },
        paymentMethods: [
            {
                provider: { type: String, enum: ["stripe"], default: "stripe" },
                paymentMethodId: { type: String },
                last4: { type: String },
                brand: { type: String },
                expMonth: { type: Number },
                expYear: { type: Number },
                isDefault: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        savedTeams: [
            { type: Schema.Types.ObjectId, ref: "TeamSelection" }
        ],
        defaultCurrency: {
            type: String,
            default: "USD",
        },
        timezone: {
            type: String,
            default: "UTC",
        },
        languagePreference: {
            type: String,
            enum: ["english", "spanish", "french"],
            default: "english",
        },
    },
    { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;