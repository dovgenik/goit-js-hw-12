import {mainVar, createGalleryItem, deleteGalleryItem, intersectionSet, lightboxRefresh, axiosAfterTthenCall,} from './js/render-functions.js';
import {axiosCall, } from './js/pixabay-api.js';


//*********   Start  ********************************************

intersectionSet();


document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault();
  deleteGalleryItem();
  mainVar.searchText=event.target.elements['search-text'].value;
  mainVar.direction = 'toBottom';
  mainVar.carrentPage = 1;
  
  axiosCall(mainVar.searchText, mainVar.carrentPage, mainVar.pageLen, axiosAfterTthenCall);
});

//***************************************************** 

