import moment from 'moment';
module.exports = {
  attributes: {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    scentName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    totalRepeat: {
      type: Sequelize.STRING,
      defaultValues: 0
    },

    score: {
      type: Sequelize.STRING,
      defaultValues: 0
    },

    updatedAt: {
      type: Sequelize.DATE,
      get: function() {
        try {
          return moment(this.getDataValue('updatedAt')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    createdAt: {
      type: Sequelize.DATE,
      get: function() {
        try {
          return moment(this.getDataValue('createdAt')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
  },
  associations: function() {
    //Feeling.belongsTo(Scent);
  },
  options: {
    // timestamps: false,
    classMethods: {
      update: async (data) => {
        try {
          let findItem = await Feeling.findOne({ where: { id: data.id }});
          return findItem ? (async () => {
            findItem.title = data.title;
            findItem.scentName = data.scentName;
            findItem.totalRepeat = data.totalRepeat;
            findItem.score = data.score;
            return await findItem.save();
          })() : false;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    instanceMethods: {},
    hooks: {}
  }
};
