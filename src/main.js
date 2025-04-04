import {mainVar, createGalleryItem, deleteGalleryItem,  lightboxRefresh, axiosAfterTthenCall, hideLoadMoreButton,} from './js/render-functions.js';
import {axiosCall, } from './js/pixabay-api.js';


//*********   Start  ********************************************



document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault();
  hideLoadMoreButton();
  deleteGalleryItem();
  mainVar.searchText=event.target.elements['search-text'].value;
  mainVar.carrentPage = 1;
  mainVar.total = 0;

  axiosCall(mainVar.searchText, mainVar.carrentPage, mainVar.pageLen, axiosAfterTthenCall);

});


document.querySelector('.load-more').addEventListener('click', function (event) {
  hideLoadMoreButton();

  mainVar.carrentPage += 1;
  
  axiosCall(mainVar.searchText, mainVar.carrentPage, mainVar.pageLen, axiosAfterTthenCall);
  
});

//***************************************************** 

