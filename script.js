const openTriggers = document.querySelectorAll("[data-window]");
const windows = document.querySelectorAll(".window");
const statusClock = document.querySelector(".status-clock");
const musicPlayer = document.querySelector("[data-music-player]");

let topZIndex = 10;
let currentTrackIndex = 0;
const playlist = [
  {
    title: "PLAYLIST 01",
    src: "./assets/music/PlayList_01.mp3",
  },
  {
    title: "PLAYLIST 02",
    src: "./assets/music/PlayList_02.mp3",
  },
  {
    title: "PLAYLIST 03",
    src: "./assets/music/PlayList_03.ogg",
  },
  {
    title: "PLAYLIST 04",
    src: "./assets/music/PlayList_04.mp3",
  },
];

openTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openWindow(trigger.dataset.window);
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWindow(trigger.dataset.window);
    }
  });
});

windows.forEach((windowElement) => {
  const closeButton = windowElement.querySelector(".window-close");
  const titlebar = windowElement.querySelector(".window-titlebar");

  closeButton.addEventListener("click", () => {
    windowElement.classList.remove("is-open");
  });

  windowElement.addEventListener("pointerdown", () => {
    bringToFront(windowElement);
  });

  titlebar.addEventListener("pointerdown", (event) => {
    startDragging(event, windowElement);
  });
});

function openWindow(windowId) {
  const targetWindow = document.getElementById(windowId);

  if (targetWindow) {
    targetWindow.classList.add("is-open");
    bringToFront(targetWindow);
    showInitialScrollLogos(targetWindow);
  }
}

function showInitialScrollLogos(windowElement) {
  const scrollTargets = windowElement.querySelectorAll(".zodiac-description-box, .detail-gallery");

  scrollTargets.forEach((scrollTarget) => {
    scrollTarget.classList.remove("scroll-logo-visible");
    void scrollTarget.offsetWidth;
    scrollTarget.classList.add("scroll-logo-visible");

    setTimeout(() => {
      scrollTarget.classList.remove("scroll-logo-visible");
    }, 2000);
  });
}

function bringToFront(windowElement) {
  topZIndex += 1;
  windowElement.style.zIndex = topZIndex;
}

function startDragging(event, windowElement) {
  if (event.target.closest("button")) {
    return;
  }

  const startX = event.clientX;
  const startY = event.clientY;
  const startLeft = windowElement.offsetLeft;
  const startTop = windowElement.offsetTop;

  bringToFront(windowElement);

  function moveWindow(moveEvent) {
    const titlebar = windowElement.querySelector(".window-titlebar");
    const titlebarHeight = titlebar.offsetHeight;
    const statusbar = document.querySelector(".desktop-statusbar");
    const statusbarHeight = statusbar ? statusbar.offsetHeight : 0;
    const maxTop = window.innerHeight - statusbarHeight - titlebarHeight;
    const newLeft = startLeft + moveEvent.clientX - startX;
    const newTop = Math.min(Math.max(0, startTop + moveEvent.clientY - startY), maxTop);

    windowElement.style.left = `${newLeft}px`;
    windowElement.style.top = `${newTop}px`;
  }

  function stopDragging() {
    window.removeEventListener("pointermove", moveWindow);
    window.removeEventListener("pointerup", stopDragging);
  }

  window.addEventListener("pointermove", moveWindow);
  window.addEventListener("pointerup", stopDragging);
}

function updateClock() {
  if (!statusClock) {
    return;
  }

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  statusClock.textContent = `${hours}:${minutes}`;
}

updateClock();
setInterval(updateClock, 1000);

if (musicPlayer) {
  const audio = musicPlayer.querySelector("audio");
  const playButton = musicPlayer.querySelector(".player-play");
  const previousButton = musicPlayer.querySelector(".player-prev");
  const nextButton = musicPlayer.querySelector(".player-next");
  const trackLabel = musicPlayer.querySelector(".player-track");
  const timeLabel = musicPlayer.querySelector(".player-time");
  const progressBar = musicPlayer.querySelector(".player-progress span");

  function loadTrack(trackIndex) {
    const track = playlist[trackIndex];

    audio.src = track.src;
    trackLabel.textContent = track.title;
    timeLabel.textContent = "0:00";
    progressBar.style.width = "0%";
  }

  function playTrack() {
    audio.play().catch(() => {
      pauseTrack();
    });
    playButton.classList.add("is-playing");
    playButton.setAttribute("aria-label", "Pause music");
  }

  function pauseTrack() {
    audio.pause();
    playButton.classList.remove("is-playing");
    playButton.setAttribute("aria-label", "Play music");
  }

  function changeTrack(direction) {
    const wasPlaying = !audio.paused;

    currentTrackIndex = (currentTrackIndex + direction + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);

    if (wasPlaying) {
      playTrack();
    }
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  }

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  });

  previousButton.addEventListener("click", () => {
    changeTrack(-1);
  });

  nextButton.addEventListener("click", () => {
    changeTrack(1);
  });

  audio.addEventListener("timeupdate", () => {
    const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;

    progressBar.style.width = `${progress}%`;
    timeLabel.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    changeTrack(1);
    playTrack();
  });

  audio.addEventListener("pause", () => {
    playButton.classList.remove("is-playing");
  });

  audio.addEventListener("play", () => {
    playButton.classList.add("is-playing");
  });

  loadTrack(currentTrackIndex);
}
