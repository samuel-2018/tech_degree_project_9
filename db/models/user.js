module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'First name is required.' },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Last name is required.' },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Email address is required.' },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Pasword is required.' },
        },
      },
    },
    {
      // Options
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      // Will save to database ok without this,
      // but needed for retrieval of key
      foreignKey: 'userId',
    });
  };

  return User;
};
