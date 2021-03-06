module.exports = {
  attributes: {
    recipient:{
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    note: {
      type: Sequelize.STRING,
      allowNull: true
    },
    remark: {
      type: Sequelize.STRING,
    },
    ItemNameArray: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const thisRecipe = this.getDataValue('Recipe');
          const recipe = thisRecipe ? [thisRecipe.perfumeName] : [];
          return recipe;
        } catch (e) {
          sails.log.error(e);
        }
      }
    }
  },
  associations: () => {
    RecipeOrder.belongsTo(User);
    RecipeOrder.belongsTo(Recipe);
  },
  options: {
    classMethods: {
      findByIdHasJoin: async(id) => {
        try {
          return await RecipeOrder.findOne({
            where: { id },
            include: [User, Recipe]
          });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      }
    },
    instanceMethods: {},
    hooks: {}
  }
};
