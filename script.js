document.addEventListener('DOMContentLoaded', function () {
  const bgMusic = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicControl');
  const scrollButtons = document.querySelectorAll('[data-scroll-target]');
  const revealElements = document.querySelectorAll('.reveal');

  let musicPlaying = false;

  function setMusicState(isPlaying) {
    musicPlaying = isPlaying;

    if (!musicBtn) return;

    musicBtn.classList.toggle('playing', isPlaying);
    musicBtn.setAttribute('aria-pressed', String(isPlaying));
    musicBtn.setAttribute('aria-label', isPlaying ? 'Jeda musik' : 'Putar musik');
  }

  function playMusic() {
    if (!bgMusic) return Promise.resolve(false);

    bgMusic.volume = 0.62;

    return bgMusic.play()
      .then(function () {
        setMusicState(true);
        return true;
      })
      .catch(function () {
        setMusicState(false);
        return false;
      });
  }

  function pauseMusic() {
    if (!bgMusic) return;

    bgMusic.pause();
    setMusicState(false);
  }

  function tryStartMusicFromGesture(event) {
    if (event && event.target && event.target.closest && event.target.closest('#musicControl')) {
      return;
    }

    if (bgMusic && bgMusic.paused) {
      playMusic();
    }
  }

  function scrollToTarget(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function openWayangAndScroll(targetId) {
    document.body.classList.add('invitation-opening');
    window.setTimeout(function () {
      document.body.classList.add('invitation-opened');
      scrollToTarget(targetId);
    }, 980);
  }

  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealThreshold = 90;

    revealElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < windowHeight - revealThreshold && rect.bottom > 0;
      if (isVisible) {
        el.classList.add('revealed');
      }
    });
  }

  scrollButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      tryStartMusicFromGesture();
      openWayangAndScroll(button.dataset.scrollTarget);
    });
  });

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', function (event) {
      event.stopPropagation();

      if (musicPlaying && !bgMusic.paused) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  ['click', 'touchstart'].forEach(function (eventName) {
    document.addEventListener(eventName, tryStartMusicFromGesture, { once: true, passive: true });
  });

  if (bgMusic) {
    bgMusic.addEventListener('play', function () {
      setMusicState(true);
    });

    bgMusic.addEventListener('pause', function () {
      setMusicState(false);
    });
  }

  const shareBtn = document.getElementById('shareBtn');
  const shareModal = document.getElementById('shareModal');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');

  if (shareBtn && shareModal) {
    shareBtn.addEventListener('click', function () {
      shareModal.style.display = 'flex';
    });

    shareModal.addEventListener('click', function (event) {
      if (event.target === shareModal) {
        shareModal.style.display = 'none';
      }
    });
  }

  window.closeShareModal = function () {
    if (shareModal) {
      shareModal.style.display = 'none';
    }
  };

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function () {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(function () {
        alert('Link undangan berhasil disalin.');
      }).catch(function () {
        prompt('Salin link manual:', currentUrl);
      });
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
      const text = encodeURIComponent(
        'Undangan Walimatul Khitan\n\n' +
        'Kepada Yth. Bapak/Ibu/Saudara(i),\n' +
        'Dengan hormat kami mengundang ke acara khitanan putra tercinta:\n\n' +
        'Sultan Hamzah Al Hasan\n' +
        'Rabu, 3 Juni 2026, pukul 08.00 sampai selesai\n' +
        'Jl. Habib Umar, Cipayung Datar, Megamendung, Bogor\n\n' +
        'Lihat detail undangan:\n' +
        window.location.href
      );
      window.open('https://wa.me/?text=' + text, '_blank');
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal);
  checkReveal();
});
