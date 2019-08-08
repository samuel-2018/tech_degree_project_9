module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'First name is required.' },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Last name is required.' },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Email address is required.' },
          isEmail: { msg: 'Valid email address is required.' },
        },
        unique: { msg: 'That email address is already associated with an account.' },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password is required.' },
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
      // If client doesn't supply a userId, API will respond with
      // "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed"
    });
  };

  return User;
};
