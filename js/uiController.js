/**
 * Tenta determinar se o dispositivo é provavelmente móvel,
 * verificando o suporte a toque e o tamanho da tela.
 * @returns {boolean} True se for mobile (ou touch-enabled tablet/laptop).
 */
export function isMobileDevice() {
  const hasTouchSupport =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  return hasTouchSupport && isSmallScreen;
}

/**
 * Cria um nó de texto e o anexa ao elemento pai, garantindo o uso de textContent para segurança.
 * @param {HTMLElement} parentElement - O elemento pai onde o nó será anexado.
 * @param {string} textContent - O texto a ser injetado.
 */
function createAndAppendTextNode(parentElement, textContent) {
  const textNode = document.createTextNode(textContent);
  parentElement.appendChild(textNode);
}

/**
 * Cria um elemento <span>, injeta o HTML do ícone
 * e o anexa ao elemento pai.
 * @param {HTMLElement} parentElement - O elemento pai.
 * @param {string} iconHtml - O código HTML/SVG/IMG do ícone.
 */
function createAndAppendIcon(parentElement, iconHtml) {
  const iconWrapper = document.createElement("span");
  iconWrapper.innerHTML = iconHtml;
  parentElement.appendChild(iconWrapper);
}

/**
 * Monta e anexa a dica de uso para dispositivos MOBILE.
 * * Responsabilidade: [Ícone Toggle] + [Texto Mobile]
 *
 * @param {HTMLElement} hintElement - O elemento <p id="hint">.
 * @param {Object} translations - O objeto de traduções.
 * @param {string} toggleIconHtml - O HTML do ícone de toque duplo.
 */
function buildMobileHint(hintElement, translations, toggleIconHtml) {
  createAndAppendIcon(hintElement, toggleIconHtml);
  createAndAppendTextNode(hintElement, " " + translations.hint_mobile);
}

/**
 * Monta e anexa a dica de uso para DESKTOP.
 * * Responsabilidade: [Texto Prefixo] + [Ícone] + [Texto Suffix]
 *
 * @param {HTMLElement} hintElement - O elemento <p id="hint">.
 * @param {Object} translations - O objeto de traduções.
 * @param {string} musicKeyHtml - O HTML do ícone da tecla.
 */
function buildDesktopHint(hintElement, translations, musicKeyHtml) {
  createAndAppendTextNode(hintElement, translations.hint_desktop_prefix + " ");
  createAndAppendIcon(hintElement, musicKeyHtml);
  createAndAppendTextNode(hintElement, " " + translations.hint_desktop_suffix);
}

/**
 * Limpa e padroniza a string de código SVG, removendo atributos
 * que interferem no estilização via CSS (e no 'currentColor').
 * * @param {string} svgText - A string de texto bruto contendo o código SVG.
 * @returns {string | null} O código SVG limpo (<svg>...</svg>) ou null se não for encontrado.
 */
function cleanSvgString(svgText) {
    // 1. Extrai a tag <svg> principal
    const svgMatch = svgText.match(/<svg[^>]*>[\s\S]*<\/svg>/i);
    
    if (!svgMatch) { 
        return null; 
    }

    let svgContent = svgMatch[0];

    // 2. Limpa dimensões (CSS controlará o tamanho)
    svgContent = svgContent
        .replace(/width=['"]?(\S*)['"]?/i, "")
        .replace(/height=['"]?(\S*)['"]?/i, "");

    // 3. Limpa cores fixas (CSS controlará o fill/stroke via currentColor)
    svgContent = svgContent
        .replace(/fill=['"]?(\S*)['"]?/gi, "")
        .replace(/stroke=['"]?(\S*)['"]?/gi, "");

    return svgContent;
}

/**
 * Busca o SVG e o retorna como string limpa para injeção inline.
 * @param {string} path - Caminho para o arquivo .svg.
 * @returns {Promise<string>} O código HTML do SVG limpo ou vazio em caso de erro.
 */
export async function getInlineSVG(path) {
    try {
        // --- 1. Busca do Recurso  ---
        const response = await fetch(path);
        
        if (!response.ok) {
            throw new Error(`Falha ao buscar SVG: Status ${response.status} em ${path}`);
        }

        const svgText = await response.text();
        
        // --- 2. Limpeza e Padronização ---
        const cleanedSvg = cleanSvgString(svgText);

        if (!cleanedSvg) {
            console.error(`Conteúdo inválido: A resposta de ${path} não contém um SVG.`);
            return "";
        }

        // Retorna o SVG pronto para injeção
        return cleanedSvg;
        
    } catch (error) {
        // --- 3. Tratamento de Erro Centralizado ---
        console.error(`[SVG INJECTOR] Erro ao processar o SVG em ${path}: ${error.message}`);
        return "";
    }
}

/**
 * Função principal para definir a instrução de uso no elemento #hint.
 * Esta função age apenas como um coordenador/roteador, delegando a montagem da Hint.
 *
 * @param {Object} translations - O objeto de traduções carregado.
 * @param {string} musicKeyHtml - O HTML do ícone da tecla de música ('P').
 * @param {string} toggleIconHtml - O HTML do ícone do clique duplo/toque duplo.
 */
export function setDynamicHint(translations, musicKeyHtml, toggleIconHtml) {
  const hintElement = document.querySelector(".footer-hint");

  if (!hintElement) {
    console.warn("Elemento #hint não encontrado.");
    return;
  }

  hintElement.innerHTML = "";

  if (isMobileDevice()) {
    buildMobileHint(hintElement, translations, toggleIconHtml);
  } else {
    buildDesktopHint(hintElement, translations, musicKeyHtml);
  }
}
