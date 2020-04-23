'use strict';
module.exports = (sequelize, DataTypes) => {
  const reply = sequelize.define('reply', {
    content: DataTypes.STRING,
    message_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  reply.associate = function(models) {
    reply.belongsTo(models.message);
  };
  return reply;
};