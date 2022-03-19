'use strict';

const $header = document.querySelector(".header-cont");
const $gnb = document.querySelector(".gnb");
const $contents = document.querySelector(".contents");
const $swiperX = document.querySelectorAll(".slide-wrap")
let prevYoffset; //스크롤 이전 
let scrollDirection;//스크롤방향

let touchable = false;
let tPosX = {
  start: 0,
  current: 0,
  end: 0,
}
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

function swiper(e) {
  touchEvent(e);
  if (tPosX.end - tPosX.start) {
    console.log(tPosX.end - tPosX.start)
  }  //뒷터치 - 첫시작 = 오른쪽이동

  //else if (startX - endX > 30) { }  //첫시작 - 뒷터치 = 왼쪽이동

  //console.log(tPosX)
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

$contents.addEventListener("mousedown", (e) => {
  let $swiper = getTarget(e.target, "slide-wrap");
  $swiper.classList.add("nonetouch");
  touchable = true;
  tPosX.start = e.clientX;
});
$contents.addEventListener("mousemove", (e) => {
  let $swiper = getTarget(e.target, "slide-wrap");
  if (!touchable && !$swiper.classList.contains("nonetouch")) return;
  if ($swiper.scrollLeft <= 0 && tPosX.start < e.clientX) { //이전스크롤
    tPosX.end = 0;
    tPosX.current = 0;
    tPosX.start = 0;
  } else if ($swiper.scrollLeft === $swiper.querySelector('.slide-list').scrollWidth - $swiper.clientWidth&& tPosX.start > e.clientX) {
    //tPosX.end = $swiper.querySelector('.slide-list').scrollWidth - $swiper.clientWidth;
    tPosX.current = $swiper.querySelector('.slide-list').scrollWidth - $swiper.clientWidth;
  }
  else {
    tPosX.end = tPosX.current + (e.clientX - tPosX.start);//e.clientX;
  }
  $swiper.scrollTo(-tPosX.end, 0);


  // $swiper.style.transform = `translate3d(${tPosX.end}px,0,0)`
  //console.log(tPosX);
  //else if (startX - endX > 30) { }  //첫시작 - 뒷터치 = 왼쪽이동
});
$contents.addEventListener("mouseup", (e) => {
  let $swiper = getTarget(e.target, "slide-wrap");
  $swiper.classList.remove("nonetouch");
  touchable = false;
  tPosX.current = tPosX.end;
  //console.log($swiper.scrollLeft, tPosX)


  console.log(tPosX);

});


// $contents.addEventListener("mousedown", swiper);
// $contents.addEventListener("mousemove", swiper);
// $contents.addEventListener("mouseup", swiper);

// $contents.addEventListener("click",(e)=>{
//   if(e.target.classList.contains("slide-wrap") ){

//   }
// })

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