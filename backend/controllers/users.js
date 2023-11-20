const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require("../models");
const fs = require('fs');

// User creation function
exports.signup = (req, res) => {
    // Salt the password
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
       // Create the user object
        const newUser = {
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            password: hash
        }
       // Create user
        User.create(newUser)
            .then(() => res.status(200).json({ message: 'User created' }))
            .catch(() => res.status(400).json({ message: 'Existing user ' }))
    })
    .catch(error => res.status(500).json({ error }));
};

// User connection function
exports.login = (req, res) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            console.log(user)
           // If the user does not exist, an error message is returned
            if(!user) {
                return res.status(401).json({ error: 'Non-existent user' });
            }
         // If the user is found, we compare the passwords
            bcrypt.compare(req.body.password, user.dataValues.password)
                .then(valid => {
                   // If the passwords do not match, an error message is returned
                    if(!valid) {
                        return res.status(401).json({ error: 'incorrect password' });
                    }
                   // We add the token in the response
                    res.status(200).json({
                        userId: user.dataValues.id,
                        token: jwt.sign(
                            { userId: user.dataValues.id },
                            process.env.MY_TOKEN_KEY,
                            { expiresIn: '12h' }
                        )
                    });
                });
        })
        .catch(error => res.status(500).json({error}));
};

// User image modification function
exports.updateImage = (req, res) => {
    User.findOne({ where: { id: req.body.userId } })
        .then(user => {
           // If the profile picture is modified
            if(req.file) {
                const filename = user.imageUrl.split('/images/')[1];
              // If the old image is different from the default image, it is deleted
                if(filename != "image_profil_default.jpg") {
                    fs.unlink(`images/${filename}`, (err) => {
                        if(err) throw err;
                    });
                }
                // Add the new image and update the DB
                const newImage = {
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                };
                User.update(
                        newImage, { where: { id: req.body.userId}}
                    )
                    .then(() => res.status(201).json({ message: ' Modified image' }))
                    .catch(error => res.status(500).json({ error }));
            };
        })
        .catch(error => res.status(500).json({ error }));
}

// User modification function
exports.updateUser = (req, res) => {
    User.findOne({ where: { id: req.body.userId } })
        .then(user => {

           // If the password is changed
            if(req.body.oldPassword && req.body.newPassword) {
// Compare the entered password with the current password
                bcrypt.compare(req.body.oldPassword, user.dataValues.password)
                    .then(valid => {
                        if(!valid) {
                            return res.status(401).json({ error: 'The password entered does not match the current password '})
                        } else {
                            bcrypt.hash(req.body.newPassword, 10)
                                .then(newHash => {
                                    User.update(
                                        { password: newHash },
                                        { where: { id: req.body.userId } }
                                    );
                                    res.status(201).json({ message: 'Password changed'})
                                })
                                .catch(error => res.status(500).json({ error }))
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            }

           // If the name, first name or user description is modified
            if(req.body.lastname && req.body.lastname != user.lastname) {
                User.update(
                    { lastname: req.body.lastname},
                    { where: { id: req.body.userId } }
                );
                res.status(201).json({ message: 'Username changed'})
            };
            if(req.body.firstname && req.body.firstname != user.firstname) {
                User.update(
                    { firstname: req.body.firstname},
                    { where: { id: req.body.userId } }
                );
                res.status(201).json({ message: 'User name changed'})
            };
            if(req.body.description && req.body.description != user.description) {
                User.update(
                    { description: req.body.description },
                    { where: { id: req.body.userId } }
                );
            };
        })
        .catch(error => res.status(500).json({ error }));
};

// User delete function
exports.deleteUser = (req, res) => {
    User.findOne({ where: { id: req.params.id } })
        .then(user => {
            const filename = user.imageUrl.split('/images/')[1];
// Profile picture is removed from server if different from default picture
            if(filename != "image_profil_default.jpg") {
                fs.unlink(`images/${filename}`, (err) => {
                    if(err) {
                        console.log("Error: " + err);
                    };
                });
            };
           // The user is deleted from the DB
            User.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: "User deleted " }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
};


// Function retrieve all users
exports.getAllUsers = (req, res) => {
    // User passwords are not saved in the response
    User.scope('noPassword').findAll({
        order: [
            ['lastname', 'ASC'],
            ['firstname', 'ASC']
        ]
    })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json({ error }))
};


// Retrieve a single user function
exports.getUser = (req, res) => {
// The user password is not saved in the response
    User.findOne({ where: { id: req.params.id } })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json({ error }))
};