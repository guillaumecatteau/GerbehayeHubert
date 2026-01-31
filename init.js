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
    }
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
