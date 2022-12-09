import view from './view';
import icons from 'url:../../img/icons.svg';

class paginationView extends view {
  _parentEl = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      console.log(btn);
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _previousButton(page) {
    return `
    <button data-goto =${page - 1} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
    </button>
    `;
  }
  _nextButton(page) {
    return `
    <button data-goto =${page + 1} class="btn--inline pagination__btn--next">
    <span>Page ${page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>
    `;
  }

  _generateMarkup() {
    // console.log(this._data.results.length);
    // console.log(this._data.results.length / this._data.resultsPerPage);
    // console.log(5);
    const curPag = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPage);
    console.log(this._data);
    if (curPag == 1 && numPage > 1) {
      return this._nextButton(curPag);
    }
    if (curPag == numPage && numPage > 1) {
      return this._previousButton(curPag);
    }
    if (curPag < numPage) {
      return `${this._previousButton(curPag)}${this._nextButton(curPag)}`;
    }

    return `1 page ony`;
  }
}

export default new paginationView();
