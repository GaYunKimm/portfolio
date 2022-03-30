'use strict';
//import { isMobile } from './assets/js/module-common.js';

(() => {

  //VIDEO 제어 
  const $wrapper = document.querySelector(".wrapper");
  const $video = document.querySelector("#live");
  const $btnMute = document.querySelector(".video-btn-mute");
  const $btnPlay = document.querySelector(".video-control-btn");
  const $btnSlider = document.querySelector(".video-control-progress-point");

  const $progressBar = document.querySelector(".video-control-progress");
  const $progress = document.querySelector(".video-control-progress-bar-inner");
  const $remainingTime = document.querySelector(".video-control-time");
  //좋아요
  const $heartWrap = document.querySelector(".chat-like-box");
  const $likeBtn = document.querySelector(".chat-like-btn");
  let $likes = document.querySelectorAll(".chat-like-effect");

  //Func height 설정
  const setScreenSize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
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
  let isMobileState = false;
  isMobileState = isMobile();

  let clickable = false; //비디오 컨트롤러 드래그여부

  let vod = {
    durationFrame: 0, //전체프레임
    currentFrame: 0, //현재프레임
    remainingTime: 0, //남은시간
    persent: 0, //진행퍼센트
  }
  let rafId; //비디오Raf

  //Func 남은 재생시간 구하기
  const getVideoTime = (time) => {
    let hour = Math.floor(time / 3600) === 0 ? `` : `${Math.floor(time / 3600)}:`;
    let minute = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : `${Math.floor(time / 60)}`;
    let second = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : `${Math.floor(time % 60)}`;
    return `${hour}${minute}:${second}`
  }
  //비디오 컨트롤 업데이트 raf
  const videoInit = (e) => {
    vod = {
      durationFrame: $video.duration,//진행퍼센트
      currentFrame: $video.currentTime,//현재프레임
      remainingTime: parseInt($video.duration - $video.currentTime, 10),//남은시간
      persent: ($video.currentTime / $video.duration) * 100,//진행퍼센트
    }
    //console.log(vod.currentFrame)
    $progress.style.width = `${vod.persent}%`;
    $btnSlider.style.left = `${vod.persent}%`;
    $btnSlider.setAttribute("aria-valuenow", vod.persent);
    $remainingTime.innerText = getVideoTime(vod.remainingTime);
    rafId = requestAnimationFrame(() => {
      videoInit();
    });
    if (vod.persent === 100 && $video.paused) {
      $btnPlay.querySelector(".icon").textContent = "play_arrow";
      cancelAnimationFrame(rafId)
    }
  }
  //Func 프로그래스 클릭시 시간 변경
  const moveCurrentTime = (e, targets) => {
    cancelAnimationFrame(rafId); //업데이트 중지

    const lefts = $progressBar.getBoundingClientRect();
    const target = targets ? targets : e;
    const moveTime = ((target.pageX - lefts.left) / $progressBar.offsetWidth) * vod.durationFrame;
    $video.currentTime = moveTime;

    videoInit();//업데이트 시작
  }

  const currentTime = (time) => {
    //cancelAnimationFrame(rafId); //업데이트 중지
    $video.currentTime = time;
    videoInit();//업데이트 시작
  }

  //Func 뮤트 토글
  const VideoMuteToggle = (e) => {
    e.preventDefault();
    const muteIcon = $video.muted ? "volume_up" : "volume_off";
    const muteState = $video.muted ? false : true;
    $btnMute.querySelector(".icon").textContent = muteIcon;
    $video.muted = muteState;
  }
  //Func 재생/일시정지 토글
  const videoPlayToggle = (e) => {
    // e.preventDefault();
    const playIcon = $video.paused ? "pause" : "play_arrow";
    const playState = $video.paused ? 'play' : 'pause';
    const playrafId = $video.paused ? cancelAnimationFrame(rafId) : videoInit();
    $btnPlay.querySelector(".icon").textContent = playIcon;


    $video[playState]();
    playrafId;
    if (vod.persent === 100) {
      currentTime(0)
    }
  }
  //Func 상세화면/재생화면 토글
  const videoWrapToggle = (e) => {
    e.preventDefault();

    document.body.classList.contains("video-detail-active") ?
      document.body.classList.remove("video-detail-active") :
      document.body.classList.add("video-detail-active");
  }
  //Func 좋아요버튼 하트추가
  const addLike = (e) => {
    let like = document.createElement("div");
    like.classList.add("chat-like-effect")
    like.innerHTML = `<span class="chat-like-effect-heart"><span></span></span>`;
    $heartWrap.append(like);
  }
  //Func 좋아요버튼 하트추가 raf
  const likeInit = (e) => {
    $likes.removeChild($likes.children[0]);
    requestAnimationFrame(() => {
      likeInit();
      if ($likes.hasChildNodes() && $likes.firstChild) {
        $likes.removeChild($likes.firstChild);
      }
    });
  }

  //좋아요 첫번째 삭제
  setInterval(() => {
    //console.log($likes.length )
    if ($likes.length > 0) {
      $likes[0].remove();
      console.log("e");
    }

  }, 100);

  //초기설정
  setScreenSize();

  //초기화 라이브 시작
  $btnPlay.querySelector(".icon").textContent = "pause";
  //초기화 동영상 로드 완료 
  $video.addEventListener("loadeddata", () => { videoInit(); });

  //동영상 뮤트
  $btnMute.addEventListener("click", (e) => { VideoMuteToggle(e); });
  //동영상 재생 일시정지
  $btnPlay.addEventListener("click", (e) => { videoPlayToggle(e); });
  //좋아요 클릭
  $likeBtn.addEventListener("click", () => { addLike() });
  //화면 클릭시 상세화면 or 컨트롤 바
  $video.addEventListener("click", (e) => { videoWrapToggle(e) });

  //재생바 클릭시 플레이타임 이동
  $progressBar.addEventListener('click', (e) => { moveCurrentTime(e); });

  //pc 재생바 드래그 
  $progressBar.addEventListener('mousedown', (e) => clickable = true);
  $progressBar.addEventListener('mousemove', (e) => { if (clickable) moveCurrentTime(e) });
  $progressBar.addEventListener('mouseup', (e) => clickable = false);
  $progressBar.addEventListener('mouseleave', (e) => clickable = false);
  //mo 재생바 드래그 
  $progressBar.addEventListener('touchstart', (e) => clickable = true);
  $progressBar.addEventListener('touchmove', (e) => { if (clickable) moveCurrentTime(e, e.touches[0]) });
  $progressBar.addEventListener('touchend', (e) => clickable = false);


  window.addEventListener("resize", () => {
    setScreenSize();
  })


})();
