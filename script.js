// Redirection après inscription
const inscriptionForm = document.getElementById('inscription-form');
if (inscriptionForm) {
    inscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        localStorage.setItem('currentUser', document.getElementById('nom').value);
        window.location.href = "espace.html";
    });
}

console.log("Emoji picker opened");

// Menu mobile
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle && menu) {
    menuToggle.onclick = function() {
        menu.classList.toggle('active');
    };
}

// Faux envoi formulaire (pour les autres formulaires que celui d'inscription)
const firstForm = document.querySelector('form');
if (firstForm && firstForm.id !== 'inscription-form') {
    firstForm.onsubmit = function(e) {
        e.preventDefault();
        alert("Merci, votre message a bien été envoyé !");
        this.reset();
    };
}

const form = document.getElementById('inscription-form');
const btn = form.querySelector('.add-to-cart');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // bloque soumission immédiate
    
    btn.classList.add('loading'); // ajoute animation
    
    setTimeout(() => {
        form.submit(); // soumet après animation (2.5s)
    }, 2500);
});
