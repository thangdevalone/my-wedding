const musicList = [
    "music/music.mp3"
  ];

  let index = 0;
  let audio = new Audio(musicList[index]);

  audio.preload = "auto";
  audio.volume = 0.65;
  audio.loop = musicList.length === 1;

  let musicStarted = false;
  let isPlaying = false;

  const toggleBtn = document.getElementById("music-toggle");

  function updateIcon() {
    if (isPlaying) {
      toggleBtn.classList.add("playing");

      toggleBtn.setAttribute("aria-pressed", "true");
      toggleBtn.setAttribute("title", "Tắt nhạc");
      toggleBtn.setAttribute("aria-label", "Tắt nhạc");
    } else {
      toggleBtn.classList.remove("playing");

      toggleBtn.setAttribute("aria-pressed", "false");
      toggleBtn.setAttribute("title", "Bật nhạc");
      toggleBtn.setAttribute("aria-label", "Bật nhạc");
    }
  }

  function safePlay() {
    return audio.play()
      .then(() => {
        musicStarted = true;
        isPlaying = true;

        updateIcon();
        removeAutoPlayEvents();
      })
      .catch((err) => {
        console.debug("Audio play blocked:", err);
      });
  }

  function pauseMusic() {
    audio.pause();

    isPlaying = false;

    updateIcon();
  }

  function nextMusic() {
    if (musicList.length <= 1) return;

    index = (index + 1) % musicList.length;
    audio.src = musicList[index];

    safePlay();
  }

  audio.addEventListener("ended", nextMusic);

  function startMusicOnFirstGesture(event) {
    if (musicStarted) return;

    if (event && toggleBtn.contains(event.target)) {
      return;
    }

    safePlay();
  }

  function addAutoPlayEvents() {
    document.addEventListener("wheel", startMusicOnFirstGesture, { passive: true });
    document.addEventListener("scroll", startMusicOnFirstGesture, { passive: true });
    document.addEventListener("mousemove", startMusicOnFirstGesture, { passive: true });
    document.addEventListener("touchstart", startMusicOnFirstGesture, { passive: true });
    document.addEventListener("touchmove", startMusicOnFirstGesture, { passive: true });
  }

  function removeAutoPlayEvents() {
    document.removeEventListener("wheel", startMusicOnFirstGesture);
    document.removeEventListener("scroll", startMusicOnFirstGesture);
    document.removeEventListener("mousemove", startMusicOnFirstGesture);
    document.removeEventListener("touchstart", startMusicOnFirstGesture);
    document.removeEventListener("touchmove", startMusicOnFirstGesture);
  }

  toggleBtn.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (isPlaying) {
      pauseMusic();
    } else {
      safePlay();
    }
  });

  toggleBtn.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleBtn.click();
    }
  });

  addAutoPlayEvents();
  updateIcon();
