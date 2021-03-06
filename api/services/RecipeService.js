module.exports = {
  findAll: async () => {
    try {
      return await User.findAll();
    } catch (e) {
      throw e;
    }
  },

  create: async (recipe = {
    formula,
    formulaLogs,
    authorName,
    perfumeName,
    message,
    description,
    visibility,
    productionStatus,
    UserId,
    coverPhotoId,
  }) => {
    try {
      recipe.formula = RecipeService.sortFormulaByScentName({formula: recipe.formula});
      sails.log.info(recipe);

      return await Recipe.create(recipe);
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  sortFormulaByScentName: ({formula}) => {
    const bubble = (a, b) => a.scent.match(/(\d+)/g)[0]-b.scent.match(/(\d+)/g)[0];
    let result = formula.sort(bubble);
    return result;
  },

  sortFeelingsByValue: ({feelings}) => {
    console.log(feelings[0]);
    const bubble = (a, b) => parseInt(b.value, 10)-parseInt(a.value, 10);
    let result = feelings.sort(bubble);
    return result;
  },

  update: async (recipe = {
    id,
    formula,
    formulaLogs,
    authorName,
    perfumeName,
    message,
    description,
    visibility,
    productionStatus,
  }) => {
    try {
      const bubble = (a,b) => a.scent.match(/(\d+)/g)[0]-b.scent.match(/(\d+)/g)[0];
      recipe.formula = recipe.formula.sort(bubble);
      sails.log.info('update recipe service=>', recipe);
      let updatedRecipe = await Recipe.findOne({
        where: {
          id: parseInt(recipe.id, 10)
        },
      });
      if (updatedRecipe) {
        updatedRecipe.formula = recipe.formula;
        updatedRecipe.formulaLogs = recipe.formulaLogs;
        updatedRecipe.authorName = recipe.authorName;
        updatedRecipe.perfumeName = recipe.perfumeName;
        updatedRecipe.message = recipe.message;
        updatedRecipe.visibility = recipe.visibility;
        updatedRecipe.productionStatus = recipe.productionStatus
        updatedRecipe.description = recipe.description;

        updatedRecipe = await updatedRecipe.save();
      }
      return updatedRecipe;
    } catch (e) {
      throw e;
    }
  },

  loadRecipe: async function(recipeId, currentUser) {
    try {
      const recipe = await Recipe.findOneAndIncludeUserLike({
        findByRecipeId: recipeId,
        currentUser
      });
      if (!recipe) {
        const error = new Error('can not find recipe');
        error.type = 'notFound';
        throw error;
      }

      let editable = false;
      const belongUser = recipe.UserId === currentUser.id;
      if (currentUser && belongUser) editable = true;

      const social = SocialService.forRecipe({ recipes: [recipe] });

      return { recipe, editable, social };
    } catch (e) {
      throw e;
    }
  },

}
