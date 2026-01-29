document.addEventListener('DOMContentLoaded', function() {
  const burgerBtn = document.querySelector('.burgerBtn');
  const centerMenu = document.querySelector('.centerMenu');
  const navLinks = document.querySelectorAll('.navLink');

  burgerBtn.addEventListener('click', function() {
    if (centerMenu.classList.contains('open')) {
      // Fermeture du menu
      centerMenu.classList.add('closing');
      centerMenu.classList.remove('open');
      this.classList.remove('active');
      
      // Retirer la classe closing après l'animation
      setTimeout(() => {
        centerMenu.classList.remove('closing');
      }, 600);
    } else {
      // Ouverture du menu
      this.classList.add('active');
      centerMenu.classList.add('open');
    }
  });

  // Close menu when clicking on a nav link
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
});
