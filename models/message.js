'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    content: DataTypes.STRING
  }, {
    underscored: true,
  });
  message.associate = function(models) {
    message.hasMany(models.reply);
  };
  return message;
};