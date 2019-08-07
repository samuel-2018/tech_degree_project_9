module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Title is required.' },
        },
      },
      description: {
        type: DataTypes.TEXT,
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
    Course.belongsTo(models.User);
  };

  return Course;
};
