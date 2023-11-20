const { Comment } = require("../models");

// Function to create a comment
exports.createComment = (req, res) => {
    const newComment = {
        userId: req.body.userId,
        content: req.body.content,
        publicationId: req.body.publicationId
    };
    Comment.create(newComment)
        .then(() => res.status(201).json({ message: "Comment created" }))
        .catch(error => res.status(500).json({ error }));
};

// Function delete a comment
exports.deleteComment = (req, res) => {
    Comment.destroy(
        { where: { id: req.params.id } }
    )
    .then(() => res.status(200).json({ message: "Comment deleted" }))
    .catch(error => res.status(500).json({ error }));
};