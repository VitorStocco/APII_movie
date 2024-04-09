const { Router } = require("express")

const usersRouter = require("./user.routes");
const movie_notesRouter = require("./movie_notes.routes");
const movie_tagsRouter = require("./movie_tags.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/movie_notes", movie_notesRouter);
routes.use("/movie_tags", movie_tagsRouter);

module.exports = routes;