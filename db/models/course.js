module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Title is required.' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Description is required.' },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          //
        },
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          //
        },
      },
    },
    {
      // Options
      sequelize,
    },
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      // Will save to database ok without this,
      // but needed for retrieval of key
      foreignKey: 'userId',
      // If client doesn't supply a userId, API will respond with
      // "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed"
    });
  };

  return Course;
};
