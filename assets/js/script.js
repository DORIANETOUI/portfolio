// assets/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // 1. Mise à jour automatique de l'année dans le footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Défilement fluide (Smooth Scrolling) pour les liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Obtenir la hauteur de la navbar pour un défilement précis
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Ferme le menu burger sur mobile après un clic
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarToggler && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click(); // Simule un clic pour fermer
                }
            }
        });
    });

    // 3. Gestion du formulaire Formspree (feedback visuel)
    // Bien que Formspree gère son propre succès/erreur par défaut,
    // vous pouvez ajouter un feedback ici si vous désactivez la redirection de Formspree
    // ou si vous voulez un message instantané sans recharger la page.
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Empêche la soumission par défaut (rechargement de page)

            const formData = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important pour obtenir une réponse JSON de Formspree
                    }
                });

                if (response.ok) {
                    formStatus.innerHTML = '<div class="alert alert-success" role="alert">Merci ! Votre message a été envoyé avec succès.</div>';
                    contactForm.reset(); // Réinitialise le formulaire
                } else {
                    const data = await response.json();
                    if (Object.hasOwnProperty.call(data, 'errors')) {
                        formStatus.innerHTML = '<div class="alert alert-danger" role="alert">' + data["errors"].map(error => error["message"]).join(", ") + '</div>';
                    } else {
                        formStatus.innerHTML = '<div class="alert alert-danger" role="alert">Oups ! Une erreur est survenue lors de l\'envoi de votre message.</div>';
                    }
                }
            } catch (error) {
                console.error('Erreur de soumission du formulaire:', error);
                formStatus.innerHTML = '<div class="alert alert-danger" role="alert">Oups ! Une erreur réseau est survenue. Veuillez réessayer plus tard.</div>';
            }
        });
    }
});