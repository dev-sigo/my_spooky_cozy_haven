/**
 * Determina o idioma a ser carregado com base na preferência do usuário e nos idiomas suportados.
 *
 * @returns {string} O código do idioma (ex: 'pt' ou 'en') a ser usado para carregar o arquivo JSON.
 */
function determineLanguage() {
  const userLang = navigator.language;
  const supportedLangs = ["pt-BR", "en-US"];
  
  return supportedLangs.includes(userLang) ? userLang : "en-US";
}

/**
 * Carrega o arquivo de tradução JSON do servidor.
 *
 * @param {string} langToLoad - O código do idioma a ser carregado (ex: 'pt').
 * @returns {Promise<Object>} Uma Promise que resolve para um objeto contendo as traduções.
 * Retorna um objeto vazio se houver falha no carregamento.
 */
async function loadTranslations(langToLoad) {
  try {
    const REPO_NAME = 'my_spooky_cozy_haven';
    const translationPath = `/${REPO_NAME}/lang/${langToLoad}.json`;
    const response = await fetch(translationPath);
    
    if (!response.ok) {
        throw new Error(`Falha ao carregar o arquivo de tradução: ${response.status}`);
    }

    const translations = await response.json();
    return translations;

  } catch (err) {
    console.error("Erro ao carregar traduções:", err);
    return {};
  }
}

/**
 * Função principal para inicializar o sistema de internacionalização (i18n).
 *
 * 1. Determina o idioma.
 * 2. Carrega as traduções.
 * 3. Injeta a tradução do título (#title) diretamente no DOM.
 *
 * NOTA: A injeção da dica (#hint) é omitida aqui,
 * pois será tratada dinamicamente pelo uiController.
 *
 * @returns {Promise<Object>} Uma Promise que resolve para o objeto de traduções completo.
 */
export default async function initI18n() {
  const langToLoad = determineLanguage();
  const translations = await loadTranslations(langToLoad);

  const titleElement = document.getElementById("title");

  if (titleElement && translations.title) {
    titleElement.textContent = translations.title;
  }
  
  return translations;
}