module.exports = (sequelize, DataTypes) => {
    const Publication = sequelize.define('Publication', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING
        },
        publicationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        dislikes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
        {
            timestamps: false,
            tableName: 'publications'
        }
    );

    Publication.associate = function (models) {
        models.Publication.belongsTo(models.User, {
            onDelete: "cascade",
            foreignKey: { name: 'userId', allowNull: false }
        });
        models.Publication.hasMany(models.Like, {
            foreignKey: 'publicationId'
        });
        models.Publication.hasMany(models.Comment, {
            foreignKey: 'publicationId'
        });
    };

    Publication.addScope('formatted_date', {
        attributes: { include : [[sequelize.fn('date_format', sequelize.col('publicationDate'), '%Y-%m-%d %H:%i'), 'formatted_date']]}
    });

    return Publication;
};