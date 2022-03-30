'use strict';

(() => {
  //import local from '/assets/js/module-local.js';
  const $cover = document.querySelector(".detail-title-cover");
  const $coverImg = document.querySelector(".detail-title-cover-img");
  const $detailCont = document.querySelector(".detail-cont");
  const $header = document.querySelector(".header");

  const headerH = $header.offsetHeight;

  //Func height 설정
  const setScreenSize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  //Func 
  const contentEffect = () => {
    if (pageYOffset >= $detailCont.offsetTop - headerH) {
      document.body.classList.remove("detail-scroll");
    } else {
      document.body.classList.add("detail-scroll");
    }
  }
  //Func 스크롤이펙트
  const coverEffect = () => {
    $coverImg.style.transform = `scale(${1 + pageYOffset / 500})`;
    $cover.style.opacity = `${0.3 + pageYOffset / 1000}`;
  }

  setScreenSize();

  window.addEventListener("scroll", (e) => {
    contentEffect();
    coverEffect();
  });
  window.addEventListener("resize", (e) => {
    setScreenSize();
  });
})();
