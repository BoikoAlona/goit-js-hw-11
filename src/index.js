import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from "./api-search.js";


const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.loadMore.classList.replace('loadMore', 'is-hidden');

export let q = '';
export let page = 1;
let totalPage = 1;

refs.form.addEventListener("submit", onFormSubmit);

async function onFormSubmit(evt) {
  evt.preventDefault();
  page = 1;
  q = evt.target.elements.searchQuery.value;
  
  const data = await fetchImages();
  
  if (data.totalHits !== 0) {
    refs.gallery.innerHTML = '';
    const markup = postsTemplate(data.hits);
    refs.gallery.insertAdjacentHTML("beforeend", markup);
    refs.loadMore.classList.replace('is-hidden', 'loadMore');
    totalPage = Math.ceil(data.totalHits / 40);
    UpdateBtnStatus();
    lightbox.refresh();
  } else {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };
}

refs.loadMore.addEventListener("click", onLoadMoreClick);

async function onLoadMoreClick() {
    page++;
    UpdateBtnStatus();
    const data = await fetchImages();
    const markup = postsTemplate(data.hits);
    refs.gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
};

const lightbox = new simpleLightbox('.gallery-link', {
    captionDelay: 250,
});

function postTemplate({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    return `<div class="photo-card">
        <div class=card-wrap>
        <a class="gallery-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/></a></div>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
}

function postsTemplate(posts) {
  const markup = posts
    .map(postTemplate)
    .join("");
    return markup;
}

function UpdateBtnStatus() {
  if (page >= totalPage) {
    refs.loadMore.classList.add('is-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
  } else { refs.loadMore.classList.replace('is-hidden', 'loadMore') };
}