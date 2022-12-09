class searchView {
  #parentel = document.querySelector('.search');

  getQuery() {
    const query = this.#parentel.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this.#parentel.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this.#parentel.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
