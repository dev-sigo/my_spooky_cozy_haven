/**
 * Inicializa o controle de reprodução da música.
 * Pressionar "M" pausa ou retoma o áudio.
 */
export function initMusicController() {
  const music = document.getElementById('music');
  if (!music) {
    console.warn('Elemento <audio id="music"> não encontrado.');
    return;
  }

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'm') {
      music.paused ? music.play() : music.pause();
    }
  });
}
