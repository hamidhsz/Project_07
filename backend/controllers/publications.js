const { Publication, User, Like, Comment } = require("../models");
const { Op } = require('sequelize');
const fs = require('fs');

// Create publication function
exports.createPublication = (req, res) => {
    let publicationImage;
  // If the user publishes an image
    if(req.file) {
        publicationImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    };
  // Create the publication object
    const newPublication = {
        userId: req.body.userId,
        content: req.body.content,
        imageUrl: publicationImage
    };
   // Create the post
    Publication.create(newPublication)
        .then(publication => res.status(201).json(publication))
        .catch(error => res.status(500).json({ error }));
};

// Function delete publication
exports.deletePublication = (req, res) => {
    Publication.findOne({ where: { id: req.params.id } })
    .then(publication => {

        // If the post includes an image, it is removed from the server
        if(publication.imageUrl != null) {
            const filename = publication.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if(err) throw err;
            })
        };
       // The publication is deleted from the DB
        Publication.destroy({ where: { id: req.params.id } })
            .then(() => res.status(201).json({ message: "Post deleted"}))
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// Function retrieve all publications
exports.getAllPublications = (req, res) => {
   // We search for all the publications
    Publication.scope('formatted_date').findAll({
       // Include users, likes and comments
        include: [
            { model: User, as: 'User', attributes: ['firstname', 'lastname', 'imageUrl'] },
            { model: Like },
            { model: Comment, include: [
                { model: User, attributes: ['firstname', 'lastname', 'imageUrl'] }
            ]}
        ],

// The results are listed in descending order of dates
        order: [
            ['publicationDate', 'DESC'],
            [Comment, 'createdAt', 'DESC']
        ]
    })
        .then(publications => res.status(200).json(publications))
        .catch(error => res.status(500).json({ error }));
};

// Like/dislike function for posts
exports.publicationLike = (req, res) => {
    Like.findOne({
        where: {
            userId: req.body.userId,
            publicationId: req.body.publicationId }
    })
        .then(response => {
// If the user has never liked or disliked the post
            if(response == null) {
                // If he clicks "like"
                if(req.body.likeValue == 1) {
                    Like.create({
                        userId: req.body.userId,
                        publicationId: req.body.publicationId,
                        liked: req.body.likeValue
                    });
                    Publication.increment(
                        { likes: 1 },
                        { where: { id: req.body.publicationId}}
                    );
                    res.status(201).json({ message: 'Like added'})
                }
             // If he clicks on "dislike"
                else if(req.body.likeValue == -1) {
                    Like.create({
                        userId: req.body.userId,
                        publicationId: req.body.publicationId,
                        liked: req.body.likeValue
                    });
                    Publication.increment(
                        { dislikes: 1 },
                        { where: { id: req.body.publicationId}}
                    );
                    res.status(201).json({ message:'Dislike added'})
                }
            }

            // If the user has already liked the post
            else if(response.dataValues.liked == 1) {
                // S'il clique sur "dislike"
                if(req.body.likeValue == -1) {
                    Like.update(
                        { liked: -1 },
                        { where: { [Op.and]: [{ publicationId: req.body.publicationId }, { userId: req.body.userId }] } }
                    );
                    Publication.increment(
                        { dislikes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    Publication.decrement(
                        { likes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    res.status(201).json({ message: "Dislike added & like removed"});
                }
                // If he clicks "like"
                else {
                    Like.destroy(
                        { where: { [Op.and]: [{ publicationId: req.body.publicationId}, { userId: req.body.userId }] } }
                    );
                    Publication.decrement(
                        { likes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    res.status(201).json({ message: "Like removed"})
                };
            }

            // If the user has already disliked the post
            else if(response.dataValues.liked == -1) {
               // If he clicks "like"
                if(req.body.likeValue == 1) {
                    Like.update(
                        { liked: 1 },
                        { where: { [Op.and]: [{ publicationId: req.body.publicationId }, { userId: req.body.userId }] } }
                    );
                    Publication.increment(
                        { likes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    Publication.decrement(
                        { dislikes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    res.status(201).json({ message: "Like added & dislike removed"})
                }
                // If he clicks on "dislike"
                else {
                    Like.destroy(
                        { where: { [Op.and]: [{ publicationId: req.body.publicationId }, { userId: req.body.userId }] } }
                    );
                    Publication.decrement(
                        { dislikes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    res.status(201).json({ message: " Dislike removed "})
                };
            }
        })
        .catch(error => res.status(500).json({ error }));
};