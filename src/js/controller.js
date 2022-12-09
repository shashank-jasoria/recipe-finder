import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import * as modal from './modal.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeVIew.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { setTimeout } from 'core-js';

const recipeContainer = document.querySelector('.recipe');

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultView.update(modal.gotSearchResultPage());

    //load recipee
    await modal.loadRecipe(id);

    recipeView.render(modal.state.recipe);
    bookmarkView.update(modal.state.bookmark);
  } catch (error) {
    recipeView.renderError();
  }
};
// console.log('test123');
const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();

    await modal.loadSearchResults(query);
    resultView.render(modal.gotSearchResultPage());
    paginationView.render(modal.state.search);
  } catch (error) {}
};

const controlPagination = function (goToPage) {
  resultView.render(modal.gotSearchResultPage(goToPage));
  paginationView.render(modal.state.search);
};
const controlServing = function (serving) {
  modal.updateServing(serving);
  recipeView.update(modal.state.recipe);
};
const controlAddBookmark = function () {
  console.log(!modal.state.recipe.bookmarked);
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);
  recipeView.update(modal.state.recipe);
  bookmarkView.render(modal.state.bookmark);
};
const controlBookmark = function () {
  bookmarkView.render(modal.state.bookmark);
};
const controlFormData = async function (data) {
  try {
    addRecipeView.renderSpinner();
    await modal.uploadRecipe(data);
    recipeView.render(modal.state.recipe);

    addRecipeView.renderMessage();
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
    bookmarkView.render(modal.state.bookmark);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
// https://forkify-api.herokuapp.com/v2
const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHadlerAddBookmark(controlAddBookmark);
  recipeView.addHadlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHadlerUpdateServing(controlServing);
  addRecipeView.addHandlerUpload(controlFormData);
};
init();

///////////////////////////////////////
