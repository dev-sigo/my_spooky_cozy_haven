import { isMobileDevice } from './uiController.js';

/** @type {HTMLAudioElement | null} */
let mainMusic = null;
/** @type {NodeListOf<HTMLAudioElement> | null} */
let soundEffects = null;
/** * Estado que rastreia se a interação inicial (Play All) já ocorreu.
 * @type {boolean} 
 */
let hasStartedPlaying = false;


// =======================================================
// AÇÕES DE RESPONSABILIDADE ÚNICA (Funções Limpas)
// =======================================================

/**
 * Tenta dar Play na música principal, tratando possíveis erros de autoplay.
 */
function playMainMusic() {
    if (mainMusic) {
        mainMusic.play().catch(error => {
            console.warn("Reprodução automática da música falhou (usuário precisa interagir):", error);
        });
    }
}

/**
 * Pausa ou retoma apenas a reprodução da música principal.
 */
function toggleMusicOnly() {
    if (mainMusic) {
        mainMusic.paused ? playMainMusic() : mainMusic.pause();
    }
}

/**
 * Tenta dar Play em todos os efeitos sonoros.
 * Nota: Os SFX só serão tocados na primeira interação do usuário.
 */
function playAllSoundEffects() {
    if (soundEffects) {
        soundEffects.forEach((sound) => {
            sound.play().catch(error => {
                console.warn(`Reprodução automática do efeito sonoro falhou:`, error);
            });
        });
    }
}

/**
 * Executa a ação de inicialização: Toca Música + Toca SFX.
 */
function handleInitialPlay() {
    playAllSoundEffects();
    playMainMusic();
    hasStartedPlaying = true;
}


// =======================================================
// ROTEADOR / DISPATCHER (Lógica Híbrida)
// =======================================================

/**
 * Função responsável por rotear o dblclick ou keydown('P').
 *
 * Regras:
 * 1. Na primeira vez, toca TUDO (música + sfx).
 * 2. Nas vezes seguintes, alterna SÓ a música.
 *
 * @param {Event} [event] - O evento que disparou a função (opcional).
 */
function handleSoundInteraction(event) {
    if (event && event.type === 'keydown') {
        event.preventDefault(); 
    }

    if (!hasStartedPlaying) {
        handleInitialPlay();
        console.log("Inicialização: Música e SFX ligados.");
    } else {
        toggleMusicOnly();
        console.log("Alternância: Música Pausada/Retomada (SFX continuam).");
    }
}


// =======================================================
// INICIALIZAÇÃO DO MÓDULO
// =======================================================

/**
 * Configura os event listeners para o controle principal.
 */
function setupInteractionListeners() {
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'p') {
            handleSoundInteraction(event);
        }
    });
    
    if (isMobileDevice()) {
        document.addEventListener('dblclick', handleSoundInteraction);
    }
}

/**
 * Inicializa o controle de reprodução, buscando as referências de áudio.
 * @export
 */
export default function initMusicController() {
    mainMusic = document.getElementById('music');
    soundEffects = document.querySelectorAll('audio.sfx');
    
    if (!mainMusic) {
        console.warn('Elemento <audio id="music"> não encontrado.');
        return;
    }
    
    setupInteractionListeners();
}