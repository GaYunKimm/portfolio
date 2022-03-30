
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
export default scrollDirect;


//Func 타겟 잡기 (이벤트위임)
export const getTarget = (elem, className) => {
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
export const isMobile = () => {
  const mobileKeyWords = new Array('Android', 'iPhone', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
  for (let info in mobileKeyWords) {
    if (navigator.userAgent.match(mobileKeyWords[info]) != null) {
      return true;
    }
  }
  return false;
}
let isMobileState = isMobile();

//Func 트랜스폼 위치
export const getMatrix = (element) => {
  const values = element.style.transform.split(/\w+\(|\);?/);
  const transform = values[1].split(/,\s?/g).map(parseInt);

  return {
    x: transform[0],
    y: transform[1],
    z: transform[2]
  };
}



//Func X slide
export const slide = {
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