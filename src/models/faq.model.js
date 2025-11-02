import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "FAQ question is required"],
            trim: true,
        },
        answer: {
            type: String,
            required: [true, "FAQ answer is required"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);
export default Faq;