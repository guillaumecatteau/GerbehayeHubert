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

// Fonction pour initialiser le burger
function initBurger() {
  const burgerBtn = document.querySelector('.burgerBtn');
  const centerMenu = document.querySelector('.centerMenu');
  const navLinks = document.querySelectorAll('.navLink');

  if (!burgerBtn) return; // Vérifier que le burger existe

  burgerBtn.addEventListener('click', function() {
    if (centerMenu.classList.contains('open')) {
      centerMenu.classList.add('closing');
      centerMenu.classList.remove('open');
      this.classList.remove('active');
      
      setTimeout(() => {
        centerMenu.classList.remove('closing');
      }, 600);
    } else {
      this.classList.add('active');
      centerMenu.classList.add('open');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (centerMenu.classList.contains('open')) {
        centerMenu.classList.add('closing');
        centerMenu.classList.remove('open');
        burgerBtn.classList.remove('active');
        
        setTimeout(() => {
          centerMenu.classList.remove('closing');
        }, 600);
      }
    });
  });
}

// Fonction pour définir le lien actif en fonction de la page visitée
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navLink');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    // Vérifier si le lien correspond à la page actuelle
    if ((currentPage === 'index.html' && href === '#') || currentPage === href) {
      link.classList.add('active');
    }
  });
}
