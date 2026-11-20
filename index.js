const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = 4000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect("mongodb://admin:admin1234@ac-xivqzxo-shard-00-00.fmj6izp.mongodb.net:27017,ac-xivqzxo-shard-00-01.fmj6izp.mongodb.net:27017,ac-xivqzxo-shard-00-02.fmj6izp.mongodb.net:27017/MovieCatalogSystem?ssl=true&replicaSet=atlas-u6w2n3-shard-0&authSource=admin&appName=B645-Limotan");

// Monitor the status of the db connection
let db = mongoose.connection;

db.on("err", () => console.error("Connection to the db failed"));
db.once("open", () => {console.log("Now connected to the MongoDB Atlas");
});

// Routing
const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

module.exports = {app, mongoose};