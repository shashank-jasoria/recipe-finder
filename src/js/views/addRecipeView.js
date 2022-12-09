import view from './view';
import icons from 'url:../../img/icons.svg';

class addRecipeView extends view {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _overlay = document.querySelector('.overlay');
  _recipeWindow = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._recipeWindow.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = [...new FormData(this)];
      const res = Object.fromEntries(data);
      handler(res);
    });
  }
}

export default new addRecipeView();
