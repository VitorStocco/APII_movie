const { Router } = require("express");

const Movie_TagsController = require("../controllers/Movie_TagsController");

const movie_tagsRoutes = Router();

const movie_tagsController = new Movie_TagsController();

movie_tagsRoutes.get("/:user_id", movie_tagsController.index);


module.exports = movie_tagsRoutes;