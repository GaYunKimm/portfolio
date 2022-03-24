'use strict';
window.addEventListener("DOMContentLoaded", () => {

  const $video = document.querySelector("#live");
  const $wrapper = document.querySelector(".wrapper");
  const $btnMute = document.querySelector(".video-btn-mute");
  const $btnPlay = document.querySelector(".video-control-btn");
  const $btnSlider = document.querySelector(".video-control-progress-point");
  const $progressBar = document.querySelector(".video-control-progress");
  const $progress = document.querySelector(".video-control-progress-bar-inner");
  const $remainingTime = document.querySelector(".video-control-time");

  let vod = {
    durationFrame: 0,
    currentFrame: 0,
    remainingTime: 0,
    persent: 0,
  }
  let rafId;

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
  $video.addEventListener("loadeddata", () => {
    init();
  });

  //남은 재생시간 구하기
  const getVideoTime = (time) => {
    let hour = Math.floor(time / 3600) === 0 ? `` : `${Math.floor(time / 3600)}:`;
    let minute = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : `${Math.floor(time / 60)}`;
    let second = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : `${Math.floor(time % 60)}`;

    return `${hour}${minute}:${second}`
  }

  //프로그래스 클릭시 변경된
  function moveCurrentTime(e, targets) {
    cancelAnimationFrame(rafId);
    const lefts = $progressBar.getBoundingClientRect();
    const target = targets? targets : e;
    const moveTime = ((target.clientX - lefts.left) / $progressBar.offsetWidth) * vod.durationFrame;
    $video.currentTime = moveTime;
    init();
  }

  let clickable = false;

  $progressBar.addEventListener('click', (e) => {
    moveCurrentTime(e);
  });

  $progressBar.addEventListener('mousedown', (e) => clickable = true);
  $progressBar.addEventListener('mousemove', (e) => { if (clickable) moveCurrentTime(e) });
  $progressBar.addEventListener('mouseup', (e) => clickable = false);
  $progressBar.addEventListener('mouseleave', (e) => clickable = false);

  $progressBar.addEventListener('touchstart', (e) => clickable = true);
  $progressBar.addEventListener('touchmove', (e) => { if (clickable) moveCurrentTime(e, e.targetTouches[0]) });
  $progressBar.addEventListener('touchend', (e) => clickable = false);

  //실행함수
  function init() {
    vod = {
      durationFrame: $video.duration,
      currentFrame: $video.currentTime,
      remainingTime: parseInt($video.duration - $video.currentTime, 10),
      persent: ($video.currentTime / $video.duration) * 100,
    }
    //console.log(vod.currentFrame)
    $progress.style.width = `${vod.persent}%`;
    $btnSlider.style.left = `${vod.persent}%`;
    $btnSlider.setAttribute("aria-valuenow", vod.persent);
    $remainingTime.innerText = getVideoTime(vod.remainingTime);
    rafId = requestAnimationFrame(() => {
      init();
    });
  }

  //동영상 뮤트
  $btnMute.addEventListener("click", (e) => {
    e.preventDefault();
    let $mute = getTarget(e.target, "video-btn-mute");
    if ($video.muted === true) {
      $mute.querySelector(".icon").textContent = "volume_up";
      $video.muted = false;
    }
    else {
      $mute.querySelector(".icon").textContent = "volume_off";
      $video.muted = true;
    }
  })

  //동영상 재생 일시정지
  $btnPlay.addEventListener("click", (e) => {
    e.preventDefault();
    let $play = getTarget(e.target, "video-control-btn");
    if (!$video.paused) {
      $play.querySelector(".icon").textContent = "pause";
      $video.pause();
      cancelAnimationFrame(rafId);
    }
    else {
      $play.querySelector(".icon").textContent = "play_arrow";
      $video.play();
      init();
    }
  });

  //화면 클릭시 상세화면 or 컨트롤 바
  $video.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.contains("video-detail-active") ?
      document.body.classList.remove("video-detail-active") :
      document.body.classList.add("video-detail-active");
  });

});