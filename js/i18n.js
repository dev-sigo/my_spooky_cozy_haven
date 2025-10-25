// i18n.js
export async function initI18n() {
  const userLang = navigator.language.slice(0, 2);
  const supportedLangs = ["pt", "en"];
  const langToLoad = supportedLangs.includes(userLang) ? userLang : "en";

  try {
    const response = await fetch(`./lang/${langToLoad}.json`);
    const translations = await response.json();

    // Atualiza o DOM
    document.getElementById("title").innerHTML = translations.title;
    document.getElementById("hint").innerHTML = translations.hint;
  } catch (err) {
    console.error("Erro ao carregar traduções:", err);
  }
}
