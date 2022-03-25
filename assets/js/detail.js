'use strict';

const $cover = document.querySelector(".detail-title-cover");
const $coverImg = document.querySelector(".detail-title-cover-img");
const $detailCont = document.querySelector(".detail-cont");
const $header = document.querySelector(".header");
const headerH = $header.offsetHeight;

function contentEffect() {
  if (pageYOffset >= $detailCont.offsetTop - headerH) {
    document.body.classList.remove("detail-scroll");
  }
  else {
    document.body.classList.add("detail-scroll");
  }
}
function coverEffect() {
  $coverImg.style.transform = `scale(${1 + pageYOffset / 500})`;
  $cover.style.opacity = `${0.3 + pageYOffset / 1000}`;
}

window.addEventListener("scroll", (e) => {
  contentEffect()
  coverEffect()


});