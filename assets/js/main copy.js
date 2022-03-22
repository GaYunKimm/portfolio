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
      $videoWrap.scrollLeft > $videoLi.offsetLeft - (window.outerWidth / 2) && //아래로내릴때영역
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



window.addEventListener('scroll', (e) => {
  //스크롤 방향
  scrollDirectionFunc();
  //스크롤 픽스드 효과
  headerSticky(e);
  //y스크롤(x스크롤 포함) 동영상재생
  scrollYLiveActive(e);
});


$live.parentNode.addEventListener("scroll", (e) => { //siide 
  scrollXLiveActive(e);
});

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


//banner

const $bannel = document.querySelector('.bannel');
const $bannelItem = document.querySelectorAll('.bannel-inner');
const $prevBtn = document.querySelector('.arrow-btn-prev');
const $nextBtn = document.querySelector('.arrow-btn-next');
const $pager = document.querySelector('.pager span');

let pageNum = 0;
let totalNum = $bannelItem.length;

let startX = 0;
let endX = 0;

const bgArray = new Array();
bgArray[0] = ["#aff6cf", "#9f98e8"];
bgArray[1] = ["#f0d5a7", "#c9b4ff"];
bgArray[2] = ["#a88beb", "#5de6de"];
bgArray[3] = ["#f5f7fa", "#b8c6db"];

$prevBtn.addEventListener('click', () => {
  prev();
  pageChange();
  interval()
});

$nextBtn.addEventListener('click', () => {
  next();
  pageChange();
  interval()
});
let bannelPlay = 0;

pageChange();
interval()


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

$bannel.addEventListener('mousedown', touchX);
$bannel.addEventListener('mouseup', touchX);

function touchX(e) {
  switch (e.type) {
    case "mousedown":
      startX = e.offsetX;
      endX = 0;
      break;
    case "mouseup":
      endX = e.offsetX;
      if (endX - startX > 30) {
        next();
      } else if (startX - endX > 30) {
        prev();
      }
      pageChange();
  }
}