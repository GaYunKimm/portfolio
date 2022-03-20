'use strict';

const $header = document.querySelector(".header-cont");
const $gnb = document.querySelector(".gnb");
const $contents = document.querySelector(".contents");
const $swiperX = document.querySelectorAll(".slide-wrap")
let prevYoffset; //스크롤 이전 
let scrollDirection;//스크롤방향


let tPosY = {
  start: 0,
  end: 0,
}

function headerSticky(e) {
  if (pageYOffset < 115) {
    if (pageYOffset < 65) {
      $header.style.transform = `translate3d(0,0px,0)`;

    } else {
      $header.style.transform = `translate3d(0,-65px,0)`;
    }
  }
  else {
    if (scrollDirection === 'up') {
      $header.style.transform = `translate3d(0,-65px,0)`;
    } else {
      $header.style.transform = `translate3d(0,-115px,0)`;
    }
  }
}

function touchEvent(e) {
  switch (e.type) {
    case "mousedown":
      tPosX.start = e.offsetX;
      tPosX.end = 0;
      tPosY.start = e.offsetY;
      tPosY.end = 0;
      break;
    case "mouseup":
      tPosX.end = e.offsetX;
      tPosY.end = e.offsetY;
  }
}
function getTarget(elem, className) {
  while (!elem.classList.contains(className)) {
    elem = elem.parentNode;
    if (elem.nodeName === "BODY") {
      elem = null;
      return
    }
  }
  return elem;
}

let touchable = [];
let tPosX = [];
let tIndex = [];

$swiperX.forEach((swiper, idx) => {
  tPosX[idx] = {
    start: 0,
    current: 0,
    end: 0,
  }
  touchable[idx] = {};

  swiper.addEventListener("mousedown", (e) => {
    let $swiper = getTarget(e.target, "slide-wrap");
    slideDown(e, idx, $swiper);
  });

  swiper.addEventListener("mousemove", (e) => {
    let $swiper = getTarget(e.target, "slide-wrap");
    slideMove(e, idx, $swiper);
  });

  swiper.addEventListener("mouseup", (e) => {
    let $swiper = getTarget(e.target, "slide-wrap");
    slideup(e, idx, $swiper);
   // console.log(tPosX)
  });

});

function slideDown(e, idx, $swiper) {
  touchable[idx] = true;
  tPosX[idx].start = e.clientX;
}

function slideMove(e, idx, $swiper) {

  if (!touchable[idx] && !$swiper.classList.contains("nonetouch")) return;
  $swiper.classList.add("nonetouch");
  if ($swiper.scrollLeft <= 0 && tPosX[idx].start < e.clientX) { //이전스크롤
    tPosX[idx] = {
      start : 0,
      current : 0,
      end : 0,
    }
  } else if ($swiper.scrollLeft === $swiper.querySelector('.slide-list').scrollWidth - $swiper.clientWidth && tPosX[idx].start > e.clientX) {
 
    tPosX[idx].current = $swiper.querySelector('.slide-list').scrollWidth - $swiper.clientWidth;
  }
  else {
    tPosX[idx].end = tPosX[idx].current + (e.clientX - tPosX[idx].start);//e.clientX;
  }
  $swiper.scrollTo(-tPosX[idx].end, 0);
}

function slideup(e, idx, $swiper) {
  //let $swiper = getTarget(e.target, "slide-wrap");
  $swiper.classList.remove("nonetouch");
  touchable[idx] = false;
  tPosX[idx].current = tPosX[idx].end;
}


window.addEventListener('scroll', (e) => {
  if (prevYoffset > window.pageYOffset) {
    scrollDirection = 'up'
  } else {
    scrollDirection = 'down'
  }
  //스크롤시 이전변수값에 담기
  prevYoffset = window.pageYOffset;
  //스크롤 픽스드 효과
  headerSticky(e);
});