let templatesLoaded = 0;

// Fonction pour vérifier si les deux templates sont chargés
function checkAllLoaded() {
  if (templatesLoaded === 2) {
    document.body.classList.add('loaded');
  }
}

// Charger le header
fetch('templates/header.html')
  .then(response => response.text())
  .then(html => {
    const body = document.body;
    const contentStartComment = Array.from(body.childNodes).find(node => 
      node.nodeType === Node.COMMENT_NODE && node.textContent.includes('content start')
    );
    if (contentStartComment) {
      contentStartComment.parentNode.insertBefore(
        document.createRange().createContextualFragment(html),
        contentStartComment
      );
      // Réinitialiser le burger après le chargement du header
      initBurger();
      // Initialiser le lien actif en fonction de la page
      setActiveNavLink();
      // Initialiser les listeners de langue après le chargement du header
      if (typeof initLanguageListeners === 'function') {
        initLanguageListeners();
      }
    }
    templatesLoaded++;
    checkAllLoaded();
  });

// Charger le footer
fetch('templates/footer.html')
  .then(response => response.text())
  .then(html => {
    const body = document.body;
    const contentEndComment = Array.from(body.childNodes).find(node => 
      node.nodeType === Node.COMMENT_NODE && node.textContent.includes('content end')
    );
    if (contentEndComment) {
      contentEndComment.parentNode.insertBefore(
        document.createRange().createContextualFragment(html),
        contentEndComment.nextSibling
      );
    }
    templatesLoaded++;
    checkAllLoaded();
  });
