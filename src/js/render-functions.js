import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { axiosCall } from './pixabay-api.js';

export const mainVar = {
  searchText: '',
  carrentPage: 1,
  pageLen: 15,
  total: 0,
};
export {
  createGalleryItem,
  deleteGalleryItem,
  lightboxRefresh,
  axiosAfterTthenCall,
  hideLoadMoreButton,
};

let lightbox;

function axiosAfterTthenCall(responseData) {
  
  createGalleryItem(responseData.hits);
  lightboxRefresh();
  
  if (responseData.totalHits > mainVar.carrentPage * mainVar.pageLen) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
    iziToast.error({
      message: "We're sorry, but you've reached the end of search results.",
      close: true,
      timeout: 5000,
      position: 'topRight',
    });
  }

  
}

function deleteGalleryItem() {
  document.querySelector('.gallery').outerHTML = `<ul class="gallery"></ul>`;
}

function createGalleryItem(arrayImgs) {
  if (arrayImgs.length < 1) {
    iziToast.error({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      close: true,
      timeout: 5000,
      position: 'topRight',
    });
  } else {
    const fragment = document.createDocumentFragment();
    const parentUl = document.querySelector('.gallery');

    for (const element of arrayImgs) {
      const li = document.createElement('li');
      li.classList.add('gallery-item');

      li.innerHTML = `<div class="gallery-div">
        <a class="gallery-link" href="${element.largeImageURL}">
          <img class="gallery-image" src="${element.webformatURL}" alt="${element.tags}">
        </a>
      </div>
      <div class="img-footer">
        <div class="footer-item"><p>Likes</p><p>${element.likes}</p></div>
        <div class="footer-item"><p>Views</p><p>${element.views}</p></div>
        <div class="footer-item"><p>Comments</p><p>${element.comments}</p></div>
        <div class="footer-item"><p>Downloads</p><p>${element.downloads}</p></div>
      </div>`;

      fragment.appendChild(li);
    }
    parentUl.appendChild(fragment);
  }

  if (mainVar.carrentPage > 1) {
    let scrollH = document
      .querySelector('.gallery-item')
      .getBoundingClientRect().height;

    window.scrollBy({ left: 0, top: scrollH * 2, behavior: 'smooth' });
  }
}

function lightboxRefresh() {
  // Оновлюємо SimpleLightbox після додавання зображень
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
      captionDelay: 250,
      showCounter: true,
      disableScroll: true,
      navText: ['←', '→'],
      closeText: '×',
    });
  }
}

function showLoader() {
  document.querySelector('.loader').classList.toggle('visually-hidden');
}

function hideLoader() {
  document.querySelector('.loader').classList.toggle('visually-hidden');
}

function showLoadMoreButton() {
  if (
    document.querySelector('.load-more').classList.contains('visually-hidden')
  ) {
    document.querySelector('.load-more').classList.remove('visually-hidden');
  }
}

function hideLoadMoreButton() {
  if (
    !document.querySelector('.load-more').classList.contains('visually-hidden')
  ) {
    document.querySelector('.load-more').classList.add('visually-hidden');
  }
}
