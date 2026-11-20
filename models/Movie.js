const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    director: {
        type: String,
        required: [true, "Director is required"],
        trim: true
    },
    year: {
        type: Number,
        required: [true, "Year is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    genre: {
        type: String,
        required: [true, "Genre is required"],
        trim: true
    },
    comments: {
        type: [commentSchema],
        default: []
    }
});

module.exports = mongoose.model("Movie", movieSchema);
