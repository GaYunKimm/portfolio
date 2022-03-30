'use strict';

//import { getTarget, isMobile, slide, getMatrix } from './assets/js/module-common.js';
//import scrollDirect from './assets/js/module-common.js';

(() => {

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

  const banner = {
    pageNum: 0,//배너 현재 페이지
    totalNum: $bannelItem.length, //배너 최종슬라이드 갯수
    bannerPlay: 0,
    startX: 0,// 배너 좌우구분 첫시작
    endX: 0,// 배너 좌우구분 끝값
    bgArray: [ //배너 색상
      ["#aff6cf", "#9f98e8"],
      ["#f0d5a7", "#c9b4ff"],
      ["#a88beb", "#5de6de"],
      ["#f5f7fa", "#b8c6db"],
    ]
  }
  //soon info 
  const soonInfo = {
    wrapWidth: 0, //슬라이드 총 넓이 //li의총합
    winWidth: 0, //보이는영역 넓이
    width: 150,//soon 가로크기
    activeWidth: 180,// soon active된 크기
    margin: 12,// soon 마진 값

    count: $soonSlideLi.length, // soon 원본 갯수
    cloneCount: 0,//soon 클론 총 갯수

    currentIdx: 0,//soon 현재  idx (변해야하는 값)
    idx: 0, //soon 현재  idx
    cloneCurrentIdx: 0,//soon 클론 idx

    firstIdx: 0,
    lastIdx: 0,
  }
  let $newSlideLi; //soon 클론된  li


  //Func 스크롤 방향
  const scrollDirect = {
    prevYoffset: 0,
    scrollDirection: 0,
    scrollDirectionFunc: function (e) {
      if (scrollDirect.prevYoffset > window.pageYOffset) {
        scrollDirect.scrollDirection = 'up'
      } else {
        scrollDirect.scrollDirection = 'down'
      }
      //스크롤시 이전변수값에 담기
      scrollDirect.prevYoffset = window.pageYOffset;
    },
  }
  //Func 타겟 잡기 (이벤트위임)
  const getTarget = (elem, className) => {
    //타겟잡기
    while (!elem.classList.contains(className)) {
      elem = elem.parentNode;
      if (elem.nodeName === "BODY") {
        elem = null;
        return
      }
    }
    return elem;
  }
  //Func 모바일체크
  const isMobile = () => {
    const mobileKeyWords = new Array('Android', 'iPhone', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
    for (let info in mobileKeyWords) {
      if (navigator.userAgent.match(mobileKeyWords[info]) != null) {
        return true;
      }
    }
    return false;
  }
  //Func 트랜스폼 위치
  const getMatrix = (element) => {
    const values = element.style.transform.split(/\w+\(|\);?/);
    const transform = values[1].split(/,\s?/g).map(parseInt);

    return {
      x: transform[0],
      y: transform[1],
      z: transform[2]
    };
  }
  //Func X slide
  const slide = {
    touchable: [], //스와이프 터치여부 
    tPosX: [], //스와이프 xScroll 값
    slideDown: function (e, idx, $swiper) {
      if (isMobileState) return;
      this.touchable[idx] = true;
      this.tPosX[idx].start = e.clientX;
    },
    slideMove: function (e, idx, $swiper) {
      if (isMobileState) return;
      let slideScrollEnd = $swiper.querySelector('.slide-list').scrollWidth - $swiper.clientWidth;
      if (!this.touchable[idx] && !$swiper.classList.contains("nonetouch")) return;

      //스크롤 0 위치 && 이전스크롤 방향
      if ($swiper.scrollLeft <= 0 && this.tPosX[idx].start < e.clientX) {
        this.tPosX[idx] = {
          start: 0,
          current: 0,
          end: 0,
        }
      }
      // 스크롤끝지점 && 다음스크롤방향
      else if ($swiper.scrollLeft === slideScrollEnd && this.tPosX[idx].start > e.clientX) {
        this.tPosX[idx].current = slideScrollEnd
      }
      else {
        this.tPosX[idx].end = this.tPosX[idx].current + (e.clientX - this.tPosX[idx].start);//e.clientX;
      }
      $swiper.scrollLeft = -this.tPosX[idx].end;
      $swiper.classList.add("nonetouch");

    },
    slideUp: function (e, idx, $swiper) {
      if (isMobileState) return;

      $swiper.classList.remove("nonetouch");
      this.touchable[idx] = false;
      this.tPosX[idx].current = this.tPosX[idx].end;
    },
    slideWheel: function (e, idx, $swiper) {
      if (isMobileState) return;

      this.tPosX[idx] = {
        start: 0,
        current: -$swiper.scrollLeft,
        end: -$swiper.scrollLeft,
      }
      //console.log(tPosX[idx])
      //console.log(this.tPosX[idx])
    }
  }

  let isMobileState = false; //모바일 체크
  isMobileState = isMobile();//모바일 체크
  let clickAble = false; // 클릭체크


  //Func header animation
  const headerSticky = (e) => {
    if (pageYOffset < 115) {
      if (pageYOffset < 65) {
        $header.style.transform = `translate3d(0,0px,0)`;

      } else {
        $header.style.transform = `translate3d(0,-65px,0)`;
      }
    }
    else {
      if (scrollDirect.scrollDirection === 'up') {
        $header.style.transform = `translate3d(0,-65px,0)`;
      } else {
        $header.style.transform = `translate3d(0,-115px,0)`;
      }
    }
  }

  //Func live Y스크롤 시 라이브 특정 영역 라이브 영상 재생
  const scrollYLiveActive = (e) => {
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
  //Func live X스크롤 시 라이브 특정 영역 라이브 영상 재생
  const scrollXLiveActive = (e, video) => {
    $live.querySelectorAll('.card-full-video').forEach((video, idx) => {
      let $videoWrap = video.parentNode.parentNode.parentNode.parentNode;
      let $videoLi = video.parentNode.parentNode;
      if (
        //비디오 화면 1.2 비율 만큼 보이면
        $videoWrap.scrollLeft > $videoLi.offsetLeft - (window.outerWidth / 1.2) &&
        //비디오 화면 
        $videoWrap.scrollLeft < $videoLi.offsetLeft - (window.outerWidth / 6) + video.offsetWidth
      ) {
        video.play();
        $videoLi.classList.add('active');
      }
      else {
        video.currentTime = 0; // 영상 처음 프레임
        video.pause();
        $videoLi.classList.remove('active');
      }
    });
  }

  //Func banner 페이지 변경
  const bannerPageChange = () => {
    $bannel.style.background = `linear-gradient( -315deg, ${banner.bgArray[banner.pageNum][0]} 0%, ${banner.bgArray[banner.pageNum][1]} 74%)`;
    for (let i = 0; i < banner.totalNum; i++) {
      $bannelItem[i].classList.remove('active');
    }
    $bannelItem[banner.pageNum].classList.add('active');
  }
  //Func banner 이전
  const bannerPrev = () => {
    banner.pageNum--;
    if (banner.pageNum < 0) {
      banner.pageNum = banner.totalNum - 1;
    }
    $pager.innerText = `${banner.pageNum + 1} / ${banner.totalNum}`
  }
  //Func banner 다음
  const bannerNext = () => {
    banner.pageNum++;
    if (banner.pageNum >= banner.totalNum) {
      banner.pageNum = 0;
    }
    $pager.innerText = `${banner.pageNum + 1} / ${banner.totalNum}`
  }
  //Func banner 자동 넘기기
  const bannerInterval = () => {
    clearInterval(banner.bannerPlay);
    banner.bannerPlay = setInterval(() => {
      bannerNext();
      bannerPageChange();
    }, 5000);
  }
  //Func banner 터치효과 추가
  const bannerTouchX = (e, targets) => {
    const target = targets ? targets : e;

    if (e.type === "touchstart" || e.type === "mousedown") {
      banner.startX = target.clientX;
      banner.endX = 0;
    }
    else if (e.type === "touchmove") {
      banner.endX = target.clientX;
    }
    else {
      if (e.type === "mouseup") { banner.endX = target.clientX; }

      if (banner.endX - banner.startX > 30) {
        bannerPrev();
      } else if (banner.startX - banner.endX > 30) {
        bannerNext();
      }
      bannerPageChange();
    }
  }

  //Func soon초기 가운데 정렬
  const setSoonInit = () => {
    $newSlideLi = document.querySelectorAll(".center-slide .card-full li");
    soonInfo.wrapWidth = (soonInfo.width + soonInfo.margin) * soonInfo.count;
    soonInfo.winWidth = $soonSlide.parentNode.clientWidth;
    soonInfo.cloneCount = $newSlideLi.length;
    soonInfo.firstIdx = soonInfo.count;
    soonInfo.lastIdx = soonInfo.firstIdx + soonInfo.count - 1;

    const centerPos = soonInfo.wrapWidth + ((soonInfo.activeWidth / 2) + (soonInfo.margin)) - (soonInfo.winWidth / 2);
    $soonSlide.style.left = `${-centerPos}px`

    // console.log(soonInfo)

    return centerPos;
  }
  const slideLeft = setSoonInit();
  //Func soon 슬라이드 크기 효과
  const activeSlideEffect = (idx) => {
    $newSlideLi.forEach(elem => {
      elem.classList.remove("active");
    });
    soonInfo.cloneCurrentIdx = (idx + soonInfo.count) + (soonInfo.count);
    soonInfo.idx = idx + soonInfo.count
    //복사본 효과
    $newSlideLi[soonInfo.cloneCurrentIdx].classList.add("active");
    //원본 효과
    $newSlideLi[soonInfo.idx].classList.add("active");
  }
  //Func soon 슬라이드 박스 이동 효과
  const moveSlideEffect = (idx, slidePos, slideTrans) => {
    soonInfo.currentIdx = idx;
    $soonSlide.classList.remove("animate");
    $soonSlide.style.transform = `translate3d(${slidePos + slideTrans}px,0,0)`;
    activeSlideEffect(idx);

    setTimeout(() => {
      $soonSlide.classList.add("animate");
      $soonSlide.style.transform = `translate3d(${slidePos}px,0,0)`;
    }, 50);
  }
  //Func soon 슬라이드 전체박스 이동
  const moveSlide = (idx) => {
    clickAble = true;
    if (!clickAble) return;

    soonInfo.currentIdx = idx;
    $soonSlide.style.transform = `translate3d(${-idx * (soonInfo.width + soonInfo.margin)}px,0,0)`;
    //next : 마지막슬라이드에서 첫번째슬라이드
    if (soonInfo.currentIdx >= soonInfo.count) {
      const idxs = idx - soonInfo.currentIdx;
      console.log(idxs)
      const slidePos = ($newSlideLi[idxs].offsetLeft / 2 - window.innerWidth / 2) + soonInfo.activeWidth;
      moveSlideEffect(0, 0, soonInfo.activeWidth);
    }
    //prev 첫번째슬라이드에서 마지막슬라이드
    else if (soonInfo.currentIdx < 0) {
      const slidePos = ($newSlideLi[(soonInfo.lastIdx) - soonInfo.currentIdx].offsetLeft / 2) - (soonInfo.activeWidth) + soonInfo.margin;
      moveSlideEffect(soonInfo.count - 1, -slidePos, -soonInfo.activeWidth);
    }
    //기본움직임
    else {
      activeSlideEffect(soonInfo.currentIdx);
    }
    setTimeout(() => {
      clickAble = false;
    }, 400);
  }
  //Func soon 슬라이드 요소 클론 만들기
  const makeClone = () => {
    for (let i = 0; i < soonInfo.count; i++) {
      const cloneSlide = $soonSlideLi[i].cloneNode(true); //요소복사(하위포함)
      cloneSlide.setAttribute('class', '');
      $soonSlide.appendChild(cloneSlide);
    }
    for (let i = soonInfo.count - 1; i >= 0; i--) {
      const cloneSlide = $soonSlideLi[i].cloneNode(true); //요소복사(하위포함)
      cloneSlide.setAttribute('class', '');
      $soonSlide.prepend(cloneSlide);
    }
    setSoonInit();
    $newSlideLi[$newSlideLi.length - soonInfo.count - 1].classList.add("active");

    setTimeout(() => {
      $soonSlide.classList.add("animate");
    }, 100);
  }
  //Func soon 슬라이드 터치
  const slideSoon = {
    touchable: false, //스와이프 터치여부 
    tPosX: {
      start: 0,
      current: 0,
      end: 0,
    }, //스와이프 xScroll 값
    slideDown: function (e, targets) {
      const target = targets ? targets : e;
      slideSoon.touchable = true;
      slideSoon.tPosX.start = target.clientX;
      // console.log(slideSoon.touchable)
    },
    slideMove: function (e, targets) {
      const target = targets ? targets : e
      console.log(target)
      if (!slideSoon.touchable) return;
      if (!this.touchable && !$soonSlide.classList.contains("nonetouch")) return;

      $soonSlide.classList.add("nonetouch");
      this.tPosX.end = this.tPosX.current + (target.clientX - this.tPosX.start);
      $soonSlide.style.transform = `translate3d(${slideSoon.tPosX.end}px,0,0)`;
    },
    slideUp: function (e) {
      $soonSlide.classList.remove("nonetouch");
      $newSlideLi.forEach((elem, idx) => {
        const $slideWrap = elem.parentNode;
        const slideWrapWidth = $slideWrap.getBoundingClientRect();
        let soonActive;
        if (
          -(slideWrapWidth.left) > elem.offsetLeft - (window.outerWidth / 2) &&
          -(slideWrapWidth.left) < elem.offsetLeft - (window.outerWidth / 2) + elem.offsetWidth
        ) {
          if (idx > soonInfo.firstIdx) {
            soonActive = idx - ($newSlideLi.length / 3);
          }
          else {
            soonActive = idx;
          }
          moveSlide(soonActive);
        }
      });
      const xpos = getMatrix($soonSlide);
      this.tPosX.current = xpos.x;
      this.tPosX.end = xpos.x;
      slideSoon.touchable = false;
      //console.log(this.tPosX)
    },
  }



  //초기실행 함수
  //headerSticky();
  bannerPageChange();
  bannerInterval()
  makeClone();


  //스크롤 이벤트
  window.addEventListener('scroll', (e) => {
    //스크롤 방향
    scrollDirect.scrollDirectionFunc();
    //스크롤 픽스드 효과
    headerSticky(e);
    //live y스크롤(x스크롤 포함) 동영상재생
    scrollYLiveActive(e);
  });
  //배너 이벤트 이전클릭
  $prevBtn.addEventListener('click', () => {
    bannerPrev();
    bannerPageChange();
    bannerInterval()
  });
  //배너이벤트 다음클릭
  $nextBtn.addEventListener('click', () => {
    bannerNext();
    bannerPageChange();
    bannerInterval()
  });
  //배너 drag
  if (!isMobileState) {
    //pc 배너이벤트 터치
    $bannel.addEventListener('mousedown', bannerTouchX);
    $bannel.addEventListener('mouseup', bannerTouchX);
  } else {
    //mo 배너이벤트 터치
    $bannel.addEventListener('touchstart', (e) => {
      bannerTouchX(e, e.targetTouches[0])
    });
    $bannel.addEventListener('touchmove', (e) => {
      bannerTouchX(e, e.targetTouches[0])
    });
    $bannel.addEventListener('touchend', (e) => {
      bannerTouchX(e, e.targetTouches[0])
    });
  }


  //라이브 스크롤이벤트
  $live.parentNode.addEventListener("scroll", (e) => {
    //siide 
    scrollXLiveActive(e);
  });

  //공통 스와이퍼 이벤트
  $swiperX.forEach((swiper, idx) => {
    slide.touchable[idx] = {};
    slide.tPosX[idx] = {
      start: 0,
      current: 0,
      end: 0,
    }
    swiper.addEventListener("mousedown", (e) => {
      let $swiper = getTarget(e.target, "slide-wrap");
      slide.slideDown(e, idx, $swiper);
    });
    swiper.addEventListener("mousemove", (e) => {
      let $swiper = getTarget(e.target, "slide-wrap");
      slide.slideMove(e, idx, $swiper);
    });
    swiper.addEventListener("mouseup", (e) => {
      let $swiper = getTarget(e.target, "slide-wrap");
      slide.slideUp(e, idx, $swiper);
    });
    swiper.addEventListener("mouseleave", (e) => {
      let $swiper = getTarget(e.target, "slide-wrap");
      slide.slideUp(e, idx, $swiper);
    });
    swiper.addEventListener("wheel", (e) => {
      let $swiper = getTarget(e.target, "slide-wrap");
      slide.slideWheel(e, idx, $swiper);
    });
  });

  //soon 배너 이벤트 이전
  $soonPrevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveSlide(soonInfo.currentIdx - 1);
  });
  //soon 배너 이벤트 다음
  $soonNextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveSlide(soonInfo.currentIdx + 1);
  });
  //soon drag
  if (!isMobileState) {
    //pc  드래그 
    $soonSlide.addEventListener("mousedown", (e) => { slideSoon.slideDown(e); });
    $soonSlide.addEventListener("mousemove", (e) => { slideSoon.slideMove(e); });
    $soonSlide.addEventListener("mouseup", (e) => { slideSoon.slideUp(e); });
    $soonSlide.addEventListener("mouseleave", (e) => { slideSoon.slideUp(e); });
  } else {
    //mo  드래그 
    $soonSlide.addEventListener('touchstart', (e) => slideSoon.slideDown(e, e.targetTouches[0]));
    $soonSlide.addEventListener('touchmove', (e) => slideSoon.slideMove(e, e.targetTouches[0]));
    $soonSlide.addEventListener('touchend', (e) => slideSoon.slideUp(e));
  }

  //리사이즈 이벤트
  window.addEventListener("resize", () => {
    setSoonInit();
  });


})();



