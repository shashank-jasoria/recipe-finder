import view from './view';
import icons from 'url:../../img/icons.svg';
import priviewView from './priviewView.js';

class bookmarkView extends view {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Bookmark yet find a nice recipe and bookmark it';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => priviewView.render(bookmark, false))
      .join('');
  }
}
export default new bookmarkView();
