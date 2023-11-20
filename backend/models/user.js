module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'http://localhost:3000/images/image_profil_default.jpg'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    },
        {
            timestamps: false,
            tableName: "users"
        }
    );

    User.associate = function (models) {
        models.User.hasMany(models.Publication, {
            foreignKey: { name: 'userId',
                allowNull: false
            }
        });
    };

    User.addScope('noPassword', {
        attributes: { exclude: ['password'] }
    });

    return User;
};