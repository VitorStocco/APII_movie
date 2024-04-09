const knex = require("../database/knex");

class Movie_NotesController{
    async create(request, response){
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        })

        /* Tags  */
        const tagsInsert = tags.map(name => {
            return{
                note_id,
                name,
                user_id
            }
        });

        await knex("movie_tags").insert(tagsInsert);

        response.json();
    }

    async show(request, response){
        const{ id } = request.params;

        const movie_note = await knex("movie_notes").where({ id }).first();
        const movie_tags = await knex("movie_tags").where({ note_id: id}).orderBy("name");

        return response.json({
            ...movie_note,
            movie_tags,
        });
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("movie_notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response){
        const { title, user_id, movie_tags, rating } = request.query;

        let movie_notes;

        if (movie_tags) {
            const filterTags = movie_tags.split(',').map(movie_tag => movie_tag.trim());
           

            movie_notes = await knex("movie_tags")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.rating",
                "movie_notes.user_id",
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)  
            .whereIn("name", filterTags)
            .innerJoin("movie_notes", "movie_notes.id", "movie_notes.rating", "movie_tags.note_id")
            .orderBy("movie_notes.title")

        } else if(rating) {
            const filterRating = rating.split(',').map(rating => rating.trim());
           

            movie_notes = await knex("movie_notes")
            .select([
                "id",
                "title",
                "description",
                "rating",
                "user_id",
            ])
            .where("user_id", user_id)
            .whereLike("title", `%${title}%`)  
            .whereIn("rating", filterRating)
            .orderBy("title")

        } else {
            movie_notes = await knex("movie_notes")
            .where({ user_id })
            .whereLike("movie_notes.title", `%${title}%`)
            .orderBy("title");

        }

        const userTags = await knex("movie_tags")
        .where({ user_id });
        const movie_notesWithTags = movie_notes.map( movie_note =>{
            const movie_noteTags = userTags.filter(movie_tag => movie_tag.note_id === movie_note.id);

            return{
                ...movie_note,
                movie_tags: movie_noteTags
            }
        });

        return response.json(movie_notesWithTags);

    }
}

module.exports = Movie_NotesController;