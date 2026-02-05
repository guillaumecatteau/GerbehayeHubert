// ===========================
// RESPONSIVE & ADAPTIVE LOGIC
// ===========================

// Fonction pour initialiser le burger (responsive menu)
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

// Écouter les changements de taille de l'écran pour les ajustements responsifs
window.addEventListener('resize', function() {
  // Les media queries CSS gèrent le responsive des grids et layouts
  // Ajouter ici toute logique JS supplémentaire si nécessaire pour les changements de viewport
});
