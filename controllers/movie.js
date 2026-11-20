const mongoose = require("mongoose");
const Movie = require("../models/movie");

module.exports.addMovie = async (req, res) => {
    try {
        const { title, director, year, description, genre } = req.body;

        if (!title || !director || !year || !description || !genre) {
            return res.status(400).send({
                message: "All movie fields are required"
            });
        }

        const newMovie = new Movie({
            title,
            director,
            year,
            description,
            genre
        });

        const savedMovie = await newMovie.save();
        return res.status(201).send(savedMovie);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).send({
                message: error.message
            });
        }

        return res.status(500).send({
            message: "Error adding movie"
        });
    }
};

module.exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        return res.status(200).send({ movies });
    } catch (error) {
        return res.status(500).send({
            message: "Error retrieving movies"
        });
    }
};

module.exports.getMovie = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({
                message: "Invalid movie id"
            });
        }

        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).send({
                message: "Movie not found"
            });
        }

        return res.status(200).send({ movie });
    } catch (error) {
        return res.status(500).send({
            message: "Error retrieving movie"
        });
    }
};

module.exports.updateMovie = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({
                message: "Invalid movie id"
            });
        }

        const allowedFields = ["title", "director", "year", "description", "genre"];
        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).send({
                message: "No movie fields to update"
            });
        }

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).send({
                message: "Movie not found"
            });
        }

        return res.status(200).send(movie);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).send({
                message: error.message
            });
        }

        return res.status(500).send({
            message: "Error updating movie"
        });
    }
};

module.exports.deleteMovie = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({
                message: "Invalid movie id"
            });
        }

        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).send({
                message: "Movie not found"
            });
        }

        return res.status(200).send({
            message: "Movie deleted successfully"
        });
    } catch (error) {
        return res.status(500).send({
            message: "Error deleting movie"
        });
    }
};

module.exports.addMovieComment = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({
                message: "Invalid movie id"
            });
        }

        if (!req.body.comment || !req.body.comment.trim()) {
            return res.status(400).send({
                message: "Comment is required"
            });
        }

        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).send({
                message: "Movie not found"
            });
        }

        movie.comments.push({
            userId: req.user.id,
            comment: req.body.comment
        });

        await movie.save();

        return res.status(201).send({
            message: "Comment added successfully",
            comments: movie.comments
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).send({
                message: error.message
            });
        }

        return res.status(500).send({
            message: "Error adding comment"
        });
    }
};

module.exports.getMovieComments = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({
                message: "Invalid movie id"
            });
        }

        const movie = await Movie.findById(req.params.id).select("comments");

        if (!movie) {
            return res.status(404).send({
                message: "Movie not found"
            });
        }

        return res.status(200).send({
            comments: movie.comments
        });
    } catch (error) {
        return res.status(500).send({
            message: "Error retrieving comments"
        });
    }
};
