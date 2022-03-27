'use strict';
//import local from '/assets/js/module-local.js';

//상수 및 변수
const $header = document.querySelector(".header-cont");
const $gnb = document.querySelector(".gnb");
const $live = document.querySelector(".live");
const $swiperX = document.querySelectorAll(".slide-wrap");
//banner
const $bannel = document.querySelector('.bannel');
const $bannelItem = document.querySelectorAll('.bannel-inner');
const $prevBtn = document.querySelector('.arrow-btn-prev');
const $nextBtn = document.querySelector('.arrow-btn-next');
const $pager = document.querySelector('.pager span');
//soon 무한슬라이드
const $soonSlide = document.querySelector(".center-slide .card-full");
const $soonSlideLi = document.querySelectorAll(".center-slide .card-full li");
const $soonPrevBtn = document.querySelector(".center-slide .arrow-btn-prev");
const $soonNextBtn = document.querySelector(".center-slide .arrow-btn-next");
const soonCount = $soonSlideLi.length;
const slideWidth = 150;
const activeSlideWidth = 180;
const slideMargin = 12;

let prevYoffset; //공통 : 스크롤 이전 
let scrollDirection;//공통 : 스크롤방향
let isMobile = false;
isMobile = mobileChk();

let touchable = []; //스와이프 터치여부 
let tPosX = []; //스와이프 xScroll 값

let pageNum = 0; //배너 페이지
let totalNum = $bannelItem.length; //배너 최종슬라이드 갯수
let bannelPlay = 0;//배너 인터벌

let startX = 0; // 배너 좌우구분
let endX = 0;// 배너 좌우구분

let soonCurrentIdx = 0; //동영상 
let $newSlideLi;
let clickAble = false;

const bgArray = new Array();
bgArray[0] = ["#aff6cf", "#9f98e8"];
bgArray[1] = ["#f0d5a7", "#c9b4ff"];
bgArray[2] = ["#a88beb", "#5de6de"];
bgArray[3] = ["#f5f7fa", "#b8c6db"];

//모바일체크
function mobileChk() {
  var mobileKeyWords = new Array('Android', 'iPhone', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
  for (var info in mobileKeyWords) {
    if (navigator.userAgent.match(mobileKeyWords[info]) != null) {
      return true;
    }
  }
  return false;
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

//slide function
function slideDown(e, idx, $swiper) {
  if (!isMobile) return;
  touchable[idx] = true;
  tPosX[idx].start = e.clientX;
}
function slideMove(e, idx, $swiper) {
  if (!isMobile) return;

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
  if (!isMobile) return;

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
//Y스크롤 시 라이브 특정 영역 라이브 영상 재생
function scrollYLiveActive(e) {
  $live.querySelectorAll('.card-full-video').forEach((video, idx) => {
    if (
      pageYOffset > $live.offsetTop - (window.outerHeight / 2) && //아래로내릴때영역
      pageYOffset < $live.offsetTop - (window.outerHeight / 3) + $live.offsetHeight//하단 영역이 어디까지 보이는지
    ) {
      scrollXLiveActive(e);
    }
    else {
      video.currentTime = 0;
      video.pause();
      video.parentNode.parentNode.classList.remove('active'); //li
    }
  });
}
//X스크롤 시 라이브 특정 영역 라이브 영상 재생
function scrollXLiveActive(e, video) {
  $live.querySelectorAll('.card-full-video').forEach((video, idx) => {
    let $videoWrap = video.parentNode.parentNode.parentNode.parentNode;
    let $videoLi = video.parentNode.parentNode;
    if (
      $videoWrap.scrollLeft > $videoLi.offsetLeft - (window.outerWidth / 1.2) && //아래로내릴때영역
      $videoWrap.scrollLeft < $videoLi.offsetLeft - (window.outerWidth / 6) + video.offsetWidth//하단 
    ) {
      video.play();
      $videoLi.classList.add('active');
    }
    else {
      video.currentTime = 0;
      video.pause();
      $videoLi.classList.remove('active');
    }
  });
}



function interval() {
  clearInterval(bannelPlay);
  bannelPlay = setInterval(() => {
    next();
    pageChange();
  }, 5000);
}

function prev() {
  pageNum--;
  if (pageNum < 0) {
    pageNum = totalNum - 1;
  }
  $pager.innerText = `${pageNum + 1} / ${totalNum}`
}

function next() {
  pageNum++;
  if (pageNum >= totalNum) {
    pageNum = 0;
  }
  $pager.innerText = `${pageNum + 1} / ${totalNum}`

}

function pageChange() {

  $bannel.style.background = `linear-gradient( -315deg, ${bgArray[pageNum][0]} 0%, ${bgArray[pageNum][1]} 74%)`;

  for (let i = 0; i < totalNum; i++) {
    // $bannel.style.background = `linear-gradient(120deg, ${bgArray[pageNum][0]} 0%, ${bgArray[pageNum][1]}) 74%`;
    $bannelItem[i].classList.remove('active');
  }
  $bannelItem[pageNum].classList.add('active');
  //$bannelItem[pageNum].style.backgroundColor = bgArray[pageNum][0];

}
function touchX(e) {
  switch (e.type) {
    case "touchstart":
    case "mousedown":
      startX = e.offsetX;
      endX = 0;
      break;
    case "touchend":
    case "mouseup":
      endX = e.offsetX;
      if (endX - startX > 30) {
        prev();
      } else if (startX - endX > 30) {
        next();
      }
      pageChange();
  }
}


//슬라이드 크기 효과
function activeSlideEffect(num) {
  $newSlideLi.forEach(elem => {
    elem.classList.remove("active");
  });
  //복사본 효과
  $newSlideLi[(num + soonCount) + (soonCount)].classList.add("active");
  //원본 효과
  $newSlideLi[num + soonCount].classList.add("active");
}
//슬라이드 박스 이동 효과
function moveSlideEffect(idx, slidePos, slideTrans) {
  soonCurrentIdx = idx;
  $soonSlide.classList.remove("animate");
  $soonSlide.style.transform = `translate3d(${slidePos + slideTrans}px,0,0)`;
  activeSlideEffect(idx);
  setTimeout(() => {
    $soonSlide.classList.add("animate");
    $soonSlide.style.transform = `translate3d(${slidePos}px,0,0)`;
  }, 50);
}
//슬라이드 전체박스 이동
function moveSlide(num) {
  clickAble = true;
  if (!clickAble) return;
  soonCurrentIdx = num;
  $soonSlide.style.transform = `translate3d(${-num * (slideWidth + 12)}px,0,0)`;
  //next : 마지막슬라이드에서 첫번째슬라이드
  if (soonCurrentIdx === soonCount) {
    moveSlideEffect(0, 0, activeSlideWidth);
  }
  //prev 첫번째슬라이드에서 마지막슬라이드
  else if (soonCurrentIdx === -1) {
    const prevLeft = ($newSlideLi[(soonCount * 2) - 1].offsetLeft / 2) - (activeSlideWidth / 2);
    moveSlideEffect(soonCount - 1, -prevLeft, -activeSlideWidth);
  }
  //기본움직임
  else {
    activeSlideEffect(soonCurrentIdx);
  }
  setTimeout(() => {
    clickAble = false;
  }, 400);
}

//초기 가운데 정렬
function calcSlideValue() {
  $newSlideLi = document.querySelectorAll(".center-slide .card-full li");
  const initSlideWidth = (slideWidth + slideMargin) * soonCount;
  const initWidth = $soonSlide.parentNode.clientWidth;
  const initTransVal = initSlideWidth + ((activeSlideWidth / 2) + 24) - (initWidth / 2);
  $soonSlide.style.left = `${-initTransVal}px`

  return initTransVal;
}
const slideLeft = calcSlideValue();

// 슬라이드 요소 클론 만들기
function makeClone() {
  for (let i = 0; i < soonCount; i++) {
    const cloneSlide = $soonSlideLi[i].cloneNode(true); //요소복사(하위포함)
    cloneSlide.setAttribute('class', '');
    $soonSlide.appendChild(cloneSlide);
  }
  for (let i = soonCount - 1; i >= 0; i--) {
    const cloneSlide = $soonSlideLi[i].cloneNode(true); //요소복사(하위포함)
    cloneSlide.setAttribute('class', '');
    $soonSlide.prepend(cloneSlide);
  }
  calcSlideValue();
  $newSlideLi[$newSlideLi.length - soonCount - 1].classList.add("active");

  setTimeout(() => {
    $soonSlide.classList.add("animate");
  }, 100);
}




                                                                    

//스크롤 이벤트
window.addEventListener('scroll', (e) => {
  //스크롤 방향
  scrollDirectionFunc();
  //스크롤 픽스드 효과
  headerSticky(e);
  //y스크롤(x스크롤 포함) 동영상재생
  scrollYLiveActive(e);
});

//라이브 스크롤이벤트
$live.parentNode.addEventListener("scroll", (e) => { //siide 
  scrollXLiveActive(e);
});

//스와이퍼 이벤트
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

//배너 이벤트
$prevBtn.addEventListener('click', () => {
  prev();
  pageChange();
  interval()
});
//배너이벤트
$nextBtn.addEventListener('click', () => {
  next();
  pageChange();
  interval()
});

pageChange();
interval()


$bannel.addEventListener('mousedown', touchX);
$bannel.addEventListener('mouseup', touchX);







makeClone();


$soonPrevBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveSlide(soonCurrentIdx - 1);
});
$soonNextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveSlide(soonCurrentIdx + 1);
});

