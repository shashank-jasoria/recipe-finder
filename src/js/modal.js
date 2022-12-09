import { getJSON } from './helper.js';
import { API_URL } from './config.js';
import { RES_PER_PAGE, KEY } from './config.js';
import { sendJSON } from './helper.js';
import { async } from 'regenerator-runtime';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};
const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    state.recipe = createRecipeObject(data);
    if (state.bookmark.some(bookmark => bookmark.id == id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
    // console.log(error);
  }
};
export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rep => {
      return {
        id: rep.id,
        title: rep.title,
        publisher: rep.publisher,
        image: rep.image_url,
        ...(rep.key && { key: rep.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};
export const gotSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * 10;
  const end = page * 10;
  return state.search.results.slice(start, end);
};
export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });

  state.recipe.servings = newServing;
  console.log(newServing);
  console.log(state.recipe.ingredients);
};
const persistBookmarks = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};
export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  if (recipe.id == state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};
export const deleteBookmark = function (id) {
  index = state.bookmark.findIndex(el => (el.id = id));
  if (id == state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  state.bookmark.splice(index, 1);
  persistBookmarks();
};
const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    const ingredients = Object.entries(newRecipe)
      .filter(
        entries => entries[0].startsWith('ingredient') && entries[1] !== ''
      )
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) {
          console.log('wrooooong');
          throw new Error('Wrong ingredient format  please correct the format');
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    console.log(data);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};
