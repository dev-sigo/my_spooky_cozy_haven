import initI18n from './js/i18n.js';
import initMusicController from './js/musicController.js';
import { setDynamicHint, getInlineSVG } from './js/uiController.js'; 
import { initGlowTracking } from './js/glowTracker.js';

document.addEventListener('DOMContentLoaded', async () => {
    initGlowTracking();
    initMusicController(); 

    const translations = await initI18n(); 

    if (!translations || Object.keys(translations).length === 0) {
        console.error("Não foi possível carregar as traduções. Abortando inicialização da UI.");
        return;
    }
    
    const MUSIC_KEY_HTML = await getInlineSVG('./assets/icons/p-key.svg', 'Tecla P', 'hint-key-icon');
    const TOGGLE_ICON_HTML = await getInlineSVG('./assets/icons/touch.svg', 'Ícone de clique duplo', 'hint-touch-icon');
    
    setDynamicHint(translations, MUSIC_KEY_HTML, TOGGLE_ICON_HTML); 
    
    console.log("Aplicação inicializada com sucesso!");
});