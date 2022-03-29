'use strict';
import { getTarget, isMobile, slide } from '/assets/js/module-common.js';
import scrollDirect from '/assets/js/module-common.js';

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


  let $newSlideLi; //soon 클론된  li

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
  const bannerTouchX = (e) => {
    switch (e.type) {
      case "touchstart":
      case "mousedown":
        banner.startX = e.offsetX;
        banner.endX = 0;
        break;
      case "touchend":
      case "mouseup":
        banner.endX = e.offsetX;
        if (banner.endX - banner.startX > 30) {
          bannerPrev();
        } else if (banner.startX - banner.endX > 30) {
          bannerNext();
        }
        bannerPageChange();
    }
  }
  const soonCount = $soonSlideLi.length; // soon 갯수
  const slideWidth = 150; //soon 가로크기
  const activeSlideWidth = 180; // soon active 크기
  const slideMargin = 12; // soon 마진 값
  let soonCurrentIdx = 0; //soon 현재  

  const soonInfo = {
    wrapWidth: 0, //슬라이드 총 넓이
    width: 150,//soon 가로크기
    activeWidth: 180,// soon active된 크기
    margin: 12,// soon 마진 값
    count: $soonSlideLi.length, // soon 원본 갯수
    cloneCount: 0,//soon 클론 총 갯수
    soonIdx: $soonSlideLi.length,
    firstIdx: 0,
    lastIdx: 0,
    currentIdx: 0,//soon 현재  idx
    cloneCurrentIdx: 0,//soon 클론 idx
  }
  
  //Func soon초기 가운데 정렬
  const setSoonInit = () => {
    $newSlideLi = document.querySelectorAll(".center-slide .card-full li");
    const initSlideWidth = (slideWidth + slideMargin) * soonCount;
    const initWidth = $soonSlide.parentNode.clientWidth;
    const initTransVal = initSlideWidth + ((activeSlideWidth / 2) + 24) - (initWidth / 2);
    $soonSlide.style.left = `${-initTransVal}px`

    return setSoonInit;
  }
  const slideLeft = setSoonInit();
  //Func soon 슬라이드 크기 효과
  const activeSlideEffect = (num) => {
    $newSlideLi.forEach(elem => {
      elem.classList.remove("active");
    });
    //복사본 효과
    $newSlideLi[(num + soonCount) + (soonCount)].classList.add("active");
    //원본 효과
    $newSlideLi[num + soonCount].classList.add("active");
  }
  //Func soon 슬라이드 박스 이동 효과
  const moveSlideEffect = (idx, slidePos, slideTrans) => {
    soonCurrentIdx = idx;
    $soonSlide.classList.remove("animate");
    $soonSlide.style.transform = `translate3d(${slidePos + slideTrans}px,0,0)`;
    activeSlideEffect(idx);

    setTimeout(() => {
      $soonSlide.classList.add("animate");
      $soonSlide.style.transform = `translate3d(${slidePos}px,0,0)`;
    }, 50);
  }
  //Func soon 슬라이드 전체박스 이동
  const moveSlide = (num) => {
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
  //Func soon 슬라이드 요소 클론 만들기
  const makeClone = () => {
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
    setSoonInit();
    $newSlideLi[$newSlideLi.length - soonCount - 1].classList.add("active");

    setTimeout(() => {
      $soonSlide.classList.add("animate");
    }, 100);
  }


  /*  //Func soon초기 가운데 정렬
   const setSoonInit = () => {
     //클론된 li업데이트
     $newSlideLi = document.querySelectorAll(".center-slide .card-full li");
 
     soonInfo.wrapWidth = (soonInfo.width + soonInfo.margin) * soonInfo.count;//클론된 li 개수
     soonInfo.cloneCount = $newSlideLi.length;//슬라이드 총 갯수
     soonInfo.firstIdx = soonInfo.cloneCount / 3;
     soonInfo.lastIdx = soonInfo.firstIdx + soonInfo.count;
     soonInfo.currentIdx = soonInfo.firstIdx;
     soonInfo.cloneCurrentIdx = (soonInfo.firstIdx + soonInfo.count) - soonInfo.count;
     //(num + soonCount) + (soonCount)
 
     //슬라이드 감싸는 박스 넓이 (overflow)
     const slideParentWidth = $soonSlide.parentNode.clientWidth;
     //슬라이드 가운데 정렬 값
     const centerPos = soonInfo.wrapWidth + ((soonInfo.activeWidth / 2) + (soonInfo.margin * 2)) - (slideParentWidth / 2);
     console.log(soonInfo)
 
     return centerPos;
   }
   //Func soon 슬라이드 크기 효과
   const activeSlideEffect = (idx) => {
     soonInfo.soonIdx = idx;
     soonInfo.cloneCurrentIdx = (idx + soonInfo.soonIdx) + (soonInfo.soonIdx);
 
     console.log(soonInfo.currentIdx, soonInfo.cloneCurrentIdx)
 
     $newSlideLi.forEach(elem => {
       elem.classList.remove("active");
     });
     //복사본 효과(num + soonCount) + (soonCount)
     $newSlideLi[soonInfo.cloneCurrentIdx].classList.add("active");
     //원본 효과 num + soonCount
     $newSlideLi[soonInfo.currentIdx].classList.add("active");
   }
   //Func soon 슬라이드 박스 이동 효과
   const moveSlideEffect = (idx, slidePos, slideTrans) => {
     soonInfo.currentIdx = idx;
     //슬라이드 박스 애니메이션 제거
     $soonSlide.classList.remove("animate");
     $soonSlide.style.transform = `translate3d(${slidePos + slideTrans}px,0,0)`;
 
     activeSlideEffect(idx);
 
     setTimeout(() => {
       $soonSlide.classList.add("animate");//슬라이드 박스 애니메이션 추가
       $soonSlide.style.transform = `translate3d(${slidePos}px,0,0)`;
     }, 50);
   }
   //Func soon 슬라이드 전체박스 이동
   const moveSlide = (idx, cloneidx) => {
     clickAble = true;
     if (!clickAble) return;
 
     soonInfo.soonIdx = idx;
     soonInfo.cloneCurrentIdx = cloneidx;
     console.log(idx);
 
     //$soonSlide.style.transform = `translate3d(${-($newSlideLi[soonInfo.currentIdx].offsetLeft)}px,0,0)`;
     $soonSlide.style.transform = `translate3d(${idx * (soonInfo.width + soonInfo.margin)}px,0,0)`;
 
     //next : 마지막슬라이드에서 첫번째슬라이드
     if (soonInfo.soonIdx >= soonInfo.count) {
       soonInfo.soonIdx = soonInfo.firstIdx;
       soonInfo.cloneCurrentIdx = soonInfo.firstIdx;
       moveSlideEffect(0, 0, soonInfo.activeWidth);
     }
     //prev 첫번째슬라이드에서 마지막슬라이드
     else if (soonInfo.currentIdx < soonInfo.firstIdx) {
       const prevLeft = ($newSlideLi[(soonInfo.count * 2) - 1].offsetLeft / 2) - (soonInfo.activeWidth / 2);
       moveSlideEffect(soonInfo.count - 1, -prevLeft, -soonInfo.activeWidth);
     }
     else {
       activeSlideEffect(soonInfo.currentIdx);
     }
     console.log(soonInfo.currentIdx, soonInfo.cloneCurrentIdx);
     //console.log(soonInfo);
 
     //console.log(soonInfo)
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
     const slideCenter = setSoonInit();
     $soonSlide.style.left = `${-slideCenter}px`; //
     $newSlideLi[soonInfo.firstIdx].classList.add("active"); //초기 액티브 설정
     $newSlideLi[soonInfo.cloneCurrentIdx].classList.add("active"); //초기 액티브 설정
     setTimeout(() => {
       $soonSlide.classList.add("animate");
     }, 100);
   } */



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
  //pc 배너이벤트 터치
  $bannel.addEventListener('mousedown', bannerTouchX);
  $bannel.addEventListener('mouseup', bannerTouchX);

  //라이브 스크롤이벤트
  $live.parentNode.addEventListener("scroll", (e) => {
    //siide 
    scrollXLiveActive(e);
  });

  //soon 배너 이벤트 이전
  $soonPrevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveSlide(soonCurrentIdx - 1);
  });
  //soon 배너 이벤트 다음
  $soonNextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveSlide(soonCurrentIdx + 1);
    console.log(soonInfo)
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

  //리사이즈 이벤트
  window.addEventListener("resize", () => {
    setSoonInit();
  });

  function getMatrix(element) {
    const values = element.style.transform.split(/\w+\(|\);?/);
    const transform = values[1].split(/,\s?/g).map(parseInt);

    return {
      x: transform[0],
      y: transform[1],
      z: transform[2]
    };
  }

  /* const slideSoon = {
    touchable: false, //스와이프 터치여부 
    tPosX: {
      start: 0,
      current: 0,
      end: 0,
    }, //스와이프 xScroll 값
 
    slideDown: function (e) {
      slideSoon.touchable = true;
      slideSoon.tPosX.start = e.clientX;
 
      //console.log(this.tPosX)
    },
    slideMove: function (e) {
      if (!this.touchable && !$soonSlide.classList.contains("nonetouch")) return;
      $soonSlide.classList.add("nonetouch");
      this.tPosX.end = this.tPosX.current + (e.clientX - this.tPosX.start);
      $soonSlide.style.transform = `translate3d(${slideSoon.tPosX.end}px,0,0)`;
    },
    slideUp: function (e) {
      $soonSlide.classList.remove("nonetouch");
      slideSoon.touchable = false;
 
      $newSlideLi.forEach((elem, idx) => {
        const $slideWrap = elem.parentNode;
        const slideWrapWidth = $slideWrap.getBoundingClientRect();
 
        let soonActive;
 
        //  console.log(-(slideWrapWidth.left), elem.offsetLeft)
        if (
          -(slideWrapWidth.left) > elem.offsetLeft - (window.outerWidth / 2) &&
          -(slideWrapWidth.left) < elem.offsetLeft - (window.outerWidth / 2) + elem.offsetWidth
        ) {
          soonActive = idx - ($newSlideLi.length / 3);
          //  console.log(soonActive) //30-elem[idx]
          moveSlide(soonActive);
        }
        else {
          elem.classList.remove('active');
        }
      });
      const xpos = getMatrix($soonSlide);
      this.tPosX.current = xpos.x;
      this.tPosX.end = xpos.x;
      //console.log(this.tPosX)
    },
  }
 
  $soonSlide.addEventListener("mousedown", (e) => {
    slideSoon.slideDown(e);
  });
  $soonSlide.addEventListener("mousemove", (e) => {
    slideSoon.slideMove(e);
  });
  $soonSlide.addEventListener("mouseup", (e) => {
    slideSoon.slideUp(e);
  }); */


})();



