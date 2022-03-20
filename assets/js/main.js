'use strict';

const $header = document.querySelector(".header-cont");
const $gnb = document.querySelector(".gnb");
const $live = document.querySelector(".live");
const $swiperX = document.querySelectorAll(".slide-wrap");
let prevYoffset; //스크롤 이전 
let scrollDirection;//스크롤방향

let touchable = []; //터치여부 
let tPosX = []; //xScroll 값

//header animation
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

//타겟잡기
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

//slide function
function slideDown(e, idx, $swiper) {
  touchable[idx] = true;
  tPosX[idx].start = e.clientX;
}
function slideMove(e, idx, $swiper) {

  let slideScrollEnd = $swiper.querySelector('.slide-list').scrollWidth - $swiper.clientWidth;

  if (!touchable[idx] && !$swiper.classList.contains("nonetouch")) return;
  $swiper.classList.add("nonetouch");
  //스크롤 0 위치 && 이전스크롤 방향
  if ($swiper.scrollLeft <= 0 && tPosX[idx].start < e.clientX) {
    tPosX[idx] = {
      start: 0,
      current: 0,
      end: 0,
    }
  }
  // 스크롤끝지점 && 다음스크롤방향
  else if ($swiper.scrollLeft === slideScrollEnd && tPosX[idx].start > e.clientX) {
    tPosX[idx].current = slideScrollEnd
  }
  else {
    tPosX[idx].end = tPosX[idx].current + (e.clientX - tPosX[idx].start);//e.clientX;
  }
  $swiper.scrollLeft = -tPosX[idx].end;
}
function slideUp(e, idx, $swiper) {
  $swiper.classList.remove("nonetouch");
  touchable[idx] = false;
  tPosX[idx].current = tPosX[idx].end;
}
function slideWheel(e, idx, $swiper) {
  tPosX[idx] = {
    start: 0,
    current: e.scrollLeft,
    end: e.scrollLeft,
  }
  //console.log(tPosX[idx])
  console.log(e)
}
//slide function END

//스크롤 방향 
function scrollDirectionFunc() {
  if (prevYoffset > window.pageYOffset) {
    scrollDirection = 'up'
  } else {
    scrollDirection = 'down'
  }
  //스크롤시 이전변수값에 담기
  prevYoffset = window.pageYOffset;
}


window.addEventListener('scroll', (e) => {
  scrollDirectionFunc();
  //스크롤 픽스드 효과
  headerSticky(e);

  $live.querySelectorAll('.card-full-video').forEach((video, idx) => {

    if (
      pageYOffset > $live.offsetTop - (window.outerHeight / 2) && //아래로내릴때영역
      pageYOffset < $live.offsetTop - (window.outerHeight / 3) + $live.offsetHeight//하단
    ) {
      scrollxlive(e, video);
    }
    else {
      console.log('영역안임');
      $live.querySelectorAll('.card-full-cover')[0].style.visibility = "visible";
      video.currentTime = 0;
      video.pause();
      video.style.visibility = "hidden";
      video.style.zIndex = "-1";
    }
  });


});

$live.parentNode.addEventListener("scroll", (e) => { //siide 

   $live.querySelectorAll('.card-full-video').forEach((video, idx) => {
    let videoElem = video.parentNode.parentNode;//li

    if (
      $live.parentNode.scrollLeft > videoElem.offsetLeft - (window.outerWidth / 2) && //아래로내릴때영역
       $live.parentNode.scrollLeft < videoElem.offsetLeft - (window.outerWidth / 6) + video.offsetWidth//하단 
    ) {
      //console.log('영역안');

      $live.querySelectorAll('.card-full-cover')[0].style.visibility = "hidden";
      video.play();
      video.style.visibility = "visible";
      video.style.zIndex = "1";
    }
    else {
     // console.log('영역안임');
      $live.querySelectorAll('.card-full-cover')[0].style.visibility = "visible";
      video.currentTime = 0;
      video.pause();
      video.style.visibility = "hidden";
      video.style.zIndex = "-1";

    }

  }); 
});


function scrollxlive(e, video) {
  let videoElem = video.parentNode.parentNode;
  console.log(videoElem.offsetLeft)
  if (
    $live.scrollLeft > videoElem.offsetLeft - (window.outerWidth / 2) //&& //아래로내릴때영역
    // $live.scrollLeft < videoElem.offsetLeft - (window.outerWidth / 2) + video.offsetWidth//하단 
  ) {
    console.log('영역안');

    $live.querySelectorAll('.card-full-cover')[0].style.visibility = "hidden";
    video.play();
    video.style.visibility = "visible";
    video.style.zIndex = "1";
  }
}


$swiperX.forEach((swiper, idx) => {
  touchable[idx] = {};
  tPosX[idx] = {
    start: 0,
    current: 0,
    end: 0,
  }

  /* swiper.addEventListener('wheel', (e) => {
    let $swiper = getTarget(e.target, "slide-wrap");
    slideWheel(e, idx, $swiper);
  }) */

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
    slideUp(e, idx, $swiper);
  });
  swiper.addEventListener("mouseleave", (e) => {
    let $swiper = getTarget(e.target, "slide-wrap");
    slideUp(e, idx, $swiper);
  });

});



