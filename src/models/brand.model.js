const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./config/db');

class Brand extends Model {}

Brand.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      set(value) {
        this.setDataValue('name', value.trim());
      },
      validate: {
        notEmpty: {
          msg: "Brand name can't be empty",
        },
        notNull: {
          msg: 'Brand name is required',
        },
      },
    },

    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'brand',
  }
);

module.exports = Brand;
