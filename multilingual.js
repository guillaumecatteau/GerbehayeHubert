// Système multilingue
window.currentLanguage = 'EN';
window.translations = {};

// Charger les traductions au démarrage
async function loadTranslations(lang) {
  if (lang === 'EN') {
    // Pour l'anglais, on restaure l'état initial
    window.translations[lang] = null;
    return;
  }

  const file = lang === 'FR' ? 'fr.json' : 'nl.json';
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    window.translations[lang] = {};
    
    // Créer un objet clé-valeur pour les traductions
    data.translations.forEach(item => {
      window.translations[lang][item.id] = item.content;
    });
  } catch (error) {
    console.error(`Erreur lors du chargement de ${file}:`, error);
  }
}

// Appliquer les traductions à la page
function applyTranslations(lang) {
  if (lang === 'EN') {
    // Restaurer l'état initial en rechargeant la page ou en stockant les valeurs initiales
    location.reload();
    return;
  }

  if (!window.translations[lang]) {
    return;
  }

  // Parcourir tous les éléments avec les IDs des traductions
  Object.keys(window.translations[lang]).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = window.translations[lang][id];
    }
  });
}

// Gérer le changement de langue
function changeLanguage(lang, element) {
  console.log(`Langue changée vers: ${lang}`);
  // Mettre à jour la classe active sur les liens de langue
  const langLinks = document.querySelectorAll('.languageSelector .langLink');
  langLinks.forEach(link => {
    link.classList.remove('active');
    link.classList.remove('last-visible');
  });
  
  // Ajouter la classe active au lien cliqué
  element.classList.add('active');
  
  // Trouver le dernier lien visible (non-actif) et ajouter la classe last-visible
  const visibleLinks = Array.from(langLinks).filter(link => !link.classList.contains('active'));
  if (visibleLinks.length > 0) {
    visibleLinks[visibleLinks.length - 1].classList.add('last-visible');
  }

  // Sauvegarder la langue en sessionStorage
  sessionStorage.setItem('preferredLanguage', lang);

  // Charger et appliquer les traductions
  window.currentLanguage = lang;
  loadTranslations(lang).then(() => {
    applyTranslations(lang);
    // Update form error messages if the function exists
    if (window.updateContactFormErrorMessages) {
      window.updateContactFormErrorMessages();
    }
  });
}

// Initialiser au chargement de la page
function initMultilingual() {
  // Vérifier s'il y a une langue préférée en sessionStorage
  const savedLanguage = sessionStorage.getItem('preferredLanguage') || 'EN';

  // Charger les traductions pour la langue sauvegardée
  loadTranslations(savedLanguage).then(() => {
    window.currentLanguage = savedLanguage;

    // Appliquer les traductions
    if (savedLanguage !== 'EN') {
      applyTranslations(savedLanguage);
    }
  });
}

// Initialiser les listeners de langue (appelé après le chargement du header)
function initLanguageListeners() {
  // Vérifier s'il y a une langue préférée en sessionStorage
  const savedLanguage = sessionStorage.getItem('preferredLanguage') || 'EN';
  console.log('initLanguageListeners - langue sauvegardée:', savedLanguage);

  // Mettre à jour l'interface des langues
  const langLinks = document.querySelectorAll('.languageSelector .langLink');
  
  langLinks.forEach((link) => {
    link.classList.remove('active');
    link.classList.remove('last-visible');
    if (link.textContent.trim() === savedLanguage) {
      link.classList.add('active');
    }
  });

  // Trouver le dernier lien visible (non-actif) et ajouter la classe last-visible
  const visibleLinks = Array.from(langLinks).filter(link => !link.classList.contains('active'));
  if (visibleLinks.length > 0) {
    visibleLinks[visibleLinks.length - 1].classList.add('last-visible');
  }

  // Ajouter les événements aux liens de langue
  langLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.textContent.trim();
      changeLanguage(lang, this);
    });
  });
}

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', initMultilingual);
