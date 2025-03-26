import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import {axiosCall, } from './pixabay-api.js';

export const mainVar = {
  searchText: '',
  carrentPage: 1,
  pageLen: 20,
  maxItems: 60,
  direction: 'toBottom',
};
export {
  createGalleryItem,
  deleteGalleryItem,
  intersectionSet,
  lightboxRefresh,
  axiosAfterTthenCall,
};

let lightbox;


function axiosAfterTthenCall(responseDataHits) {
        createGalleryItem(responseDataHits);
        lightboxRefresh();
};


function deleteGalleryItem() {
  document.querySelector('.gallery').outerHTML = `<ul class="gallery"></ul>`;
};

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
    console.log(`Додавав ${mainVar.direction}`);

    if (mainVar.direction === 'toBottom') {
      console.log(`To bottom ${fragment}`);
      parentUl.appendChild(fragment);

      console.log(`Галерея after add = ${parentUl.children.length} елементів`);

      while (parentUl.children.length > mainVar.maxItems) {
        // видаляю зайві попереду галереї
        parentUl.removeChild(parentUl.firstElementChild);
      }
      console.log(
        `Gallery after del from bottom = ${parentUl.children.length} elements`
      );
    } else {
      if (mainVar.direction === 'toTop') {
        const scrollBefore = parentUl.scrollHeight;
        parentUl.prepend(fragment); // add to top

        const scrollAfter = parentUl.scrollHeight;
        window.scrollBy(0, scrollAfter - scrollBefore);

        while (parentUl.children.length > mainVar.maxItems) {
          // видаляю зайві у кінці галереї
          parentUl.removeChild(parentUl.lastElementChild);
        }
        console.log(
          `Gallery after del from bottom = ${parentUl.children.length} elements`
        );
      }
    }
  }
}

function intersectionSet() {
  let galleryLength = 0;
  mainVar.runStarted = true;
  const observerIntersection = new IntersectionObserver((entries, observer) => {
    const situation = {
      // для контролю положення маркерів div class="intersection-top marker-top" і div class="intersection-bottom marker-bottom"
      markerTop: false,
      markerBottom: false,
    };
    entries.forEach(entry => {
      // для кожного контрол. елемента визначаю положення: тут, тобто isIntersecting, чи ні
      if (entry.isIntersecting) {
        console.log(entry.target.classList[1]);
        if (entry.target.classList[1] === 'marker-top') {
          situation.markerTop = true;
        } else {
          if (entry.target.classList[1] === 'marker-bottom') {
            situation.markerBottom = true;
          }
        }
      }
    });
    // визначаю куди проскролили галерею
    if (situation.markerBottom && !situation.markerTop) {
      // якщо дійшли до низу
      mainVar.direction = 'toBottom'; // зовнішній маркер для інших учасників
      axiosCall(mainVar.searchText, ++mainVar.carrentPage, mainVar.pageLen, axiosAfterTthenCall); // додаю записи знизу
    } else {
      if (!situation.markerBottom && situation.markerTop) {
        // якщо дійшли до верху
        mainVar.direction = 'toTop'; // зовнішній маркер для інших учасників
        if (mainVar.carrentPage > 3) { // контроль номера сторінки, щоб не було 0, -1, і т.д.
          axiosCall(mainVar.searchText, --mainVar.carrentPage - 2, mainVar.pageLen, axiosAfterTthenCall  ); // додаю записи зверху
        }
      }
    }

    console.log(situation);
    console.log(`Page = ${mainVar.carrentPage} `);
  });

  observerIntersection.observe(document.querySelector(['.marker-top']));
  observerIntersection.observe(document.querySelector(['.marker-bottom']));
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

