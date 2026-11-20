const express = require("express");
const movieController = require("../controllers/movie");
const userController = require("../controllers/user");

const router = express.Router();

router.post("/addMovie", userController.verify, userController.verifyAdmin, movieController.addMovie);
router.get("/getMovies", movieController.getMovies);
router.get("/getMovie/:id", movieController.getMovie);
router.patch("/updateMovie/:id", userController.verify, userController.verifyAdmin, movieController.updateMovie);
router.delete("/deleteMovie/:id", userController.verify, userController.verifyAdmin, movieController.deleteMovie);
router.post("/addComment/:id", userController.verify, movieController.addMovieComment);
router.get("/getComments/:id", movieController.getMovieComments);

module.exports = router;
