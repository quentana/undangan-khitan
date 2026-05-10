// script.js - interaksi minimal: scroll reveal, share, copy link, dll
document.addEventListener('DOMContentLoaded', function() {
  // ========== REVEAL ON SCROLL (tanpa library berat) ==========
  const revealElements = document.querySelectorAll('.reveal');
  
  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealThreshold = 80;
    
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < windowHeight - revealThreshold && rect.bottom > 0;
      if (isVisible) {
        el.classList.add('revealed');
      }
    });
  }
  
  window.addEventListener('scroll', checkReveal);
  window.addEventListener('resize', checkReveal);
  checkReveal(); // initial check
  
  // ========== SHARE MODAL ==========
  const shareBtn = document.getElementById('shareBtn');
  const shareModal = document.getElementById('shareModal');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');
  
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      shareModal.style.display = 'flex';
    });
  }
  
  window.closeShareModal = function() {
    shareModal.style.display = 'none';
  };
  
  // salin link
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function() {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(() => {
        alert('✨ Link undangan berhasil disalin!');
      }).catch(() => {
        prompt('Salin link manual:', currentUrl);
      });
    });
  }
  
  // bagikan WhatsApp
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
      const text = encodeURIComponent(`✨ *Undangan Walimatul Khitan* ✨\n\nKepada Yth. Bapak/Ibu/Saudara(i),\nDengan hormat kami mengundang ke acara khitanan putra tercinta:\n\nM. Atha Faaris Al Bahari\n📅 Ahad, 15 Juni 2025 (08.00 - 12.00 WIB)\n📍 Graha Al Bahari, Jl. Kenanga Raya No.27, Surabaya\n\nLihat detail undangan:\n${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }
  
  // klik di luar modal untuk menutup
  shareModal.addEventListener('click', function(e) {
    if (e.target === shareModal) {
      shareModal.style.display = 'none';
    }
  });
  
  // ========== SMOOTH SCROLL untuk tombol navigasi di hero ==========
  const scrollHint = document.querySelector('.scroll-down');
  if (scrollHint) {
    scrollHint.addEventListener('click', function(e) {
      const targetSection = document.getElementById('sambutan');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  
  // optional: tambahkan efek interaksi ringan pada map jika diperlukan
  const mapIframe = document.querySelector('.map-container iframe');
  if (mapIframe) {
    // biarkan sesuai default embed, tidak mengganggu UX
    console.log('Map iframe siap');
  }
  
  // merapikan event untuk tombol di footer/share (tidak ada fungsi rumit)
  console.log('Undangan Khitan siap - tema navy & putih');
});
// ========== MUSIC BACKGROUND (auto-play dengan interaksi) ==========
const musicBtn = document.getElementById('musicControl');
const bgMusic = document.getElementById('bgMusic');
let musicPlaying = false;
let musicAttempted = false;

// Fungsi untuk memulai musik
function startMusic() {
  if (bgMusic && !musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicBtn.classList.add('playing');
    }).catch(e => {
      console.log('Autoplay gagal, menunggu klik user');
    });
  }
}

// Coba autoplay saat halaman dimuat (mungkin berhasil di beberapa browser)
window.addEventListener('load', () => {
  if (bgMusic) {
    bgMusic.volume = 0.6; // volume 60%
    startMusic();
  }
});

// Jika autoplay gagal, mulai saat user pertama kali berinteraksi (klik/tap di mana saja)
function userInteractionStart() {
  if (!musicPlaying && bgMusic && bgMusic.paused) {
    startMusic();
  }
  // Hapus listener setelah berhasil
  document.removeEventListener('click', userInteractionStart);
  document.removeEventListener('touchstart', userInteractionStart);
}
document.addEventListener('click', userInteractionStart);
document.addEventListener('touchstart', userInteractionStart);

// Toggle play/pause manual saat tombol diklik
if (musicBtn && bgMusic) {
  musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicBtn.classList.remove('playing');
    } else {
      bgMusic.play().then(() => {
        musicPlaying = true;
        musicBtn.classList.add('playing');
      }).catch(err => {
        console.log('Gagal memutar musik:', err);
      });
    }
  });
}