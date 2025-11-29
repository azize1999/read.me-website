// Redirection après inscription
const inscriptionForm = document.getElementById('inscription-form');
if (inscriptionForm) {
    inscriptionForm.addEventListener('submit', function (e) {
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
    menuToggle.onclick = function () {
        menu.classList.toggle('active');
    };
}

// Faux envoi formulaire (pour les autres formulaires que celui d'inscription)
const firstForm = document.querySelector('form');
if (firstForm && firstForm.id !== 'inscription-form' && firstForm.id !== 'post-form') {
    firstForm.onsubmit = function (e) {
        e.preventDefault();
        alert("Merci, votre message a bien été envoyé !");
        this.reset();
    };
}

const form = document.getElementById('inscription-form');
if (form) {
    const btn = form.querySelector('.add-to-cart');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // bloque soumission immédiate
        btn.classList.add('loading'); // ajoute animation
        setTimeout(() => {
            form.submit(); // soumet après animation (2.5s)
        }, 2500);
    });
}


// ==========================================
// CODE ESPACE PERSONNEL (espace.html)
// ==========================================

if (document.getElementById('post-form')) {
    // Affiche le nom utilisateur
    const usernameEl = document.getElementById('username');
    if (usernameEl) usernameEl.textContent = localStorage.getItem('currentUser') || "";

    // Bouton photo : déclenche input file
    const addPhotoBtn = document.getElementById('add-photo');
    const mediaInput = document.getElementById('media-input');
    if (addPhotoBtn && mediaInput) {
        addPhotoBtn.onclick = () => mediaInput.click();
    }

    // Aperçu images/vidéos
    if (mediaInput) {
        mediaInput.addEventListener('change', function () {
            const preview = document.getElementById('media-preview');
            preview.innerHTML = "";
            for (const file of this.files) {
                let el;
                if (file.type.startsWith("image")) {
                    el = document.createElement('img');
                } else if (file.type.startsWith("video")) {
                    el = document.createElement('video');
                    el.controls = true;
                }
                if (el) {
                    el.src = URL.createObjectURL(file);
                    preview.appendChild(el);
                }
            }
        });
    }

    // ----- EMOJIS -----
    const emojis = ["😃", "😂", "😍", "🥳", "😢", "🥰", "😭", "😅", "😡", "👍", "🙏", "👏", "💡", "🎉", "🔥", "❤️"];
    const emojiPicker = document.getElementById('emoji-picker');
    const addEmojiBtn = document.getElementById('add-emoji');
    const textarea = document.getElementById('editor');

    function injectEmojis(picker, textareaTarget) {
        if (!picker.innerHTML) {
            emojis.forEach(emoji => {
                let span = document.createElement('span');
                span.textContent = emoji;
                span.onclick = function () {
                    textareaTarget.innerHTML += emoji;
                    picker.style.display = "none";
                    textareaTarget.focus();
                };
                picker.appendChild(span);
            });
        }
    }

    if (addEmojiBtn && emojiPicker) {
        addEmojiBtn.onclick = function (e) {
            e.stopPropagation();
            if (emojiPicker.style.display === "block") {
                emojiPicker.style.display = "none";
            } else {
                injectEmojis(emojiPicker, textarea);
                emojiPicker.style.display = "block";
            }
        };

        document.addEventListener('click', function (e) {
            if (!emojiPicker.contains(e.target) && e.target !== addEmojiBtn) {
                emojiPicker.style.display = "none";
            }
        });
    }

    // -------- Mini éditeur ---------
    document.querySelectorAll(".editor-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.dataset.action;
            document.execCommand(action, false, null);
            document.getElementById("editor").focus();
        });
    });

    // ----------- Localisation utilisateur ----------------------
    let userPosition = "";
    const locationInput = document.getElementById('location-input');
    const getLocationBtn = document.getElementById('get-location');

    if (getLocationBtn && locationInput) {
        getLocationBtn.onclick = function () {
            if (locationInput.style.display === "none") {
                locationInput.style.display = "inline-block";
                locationInput.focus();
                getLocationBtn.style.display = "none";
            }
        };

        locationInput.addEventListener('input', function () {
            userPosition = this.value;
        });
    }

    // ----------- Thèmes (Noir / Blanc / Défaut) -------------
    const themeDark = document.getElementById('theme-dark');
    const themeLight = document.getElementById('theme-light');
    const themeDefault = document.getElementById('theme-default');

    if (themeDark && themeLight && themeDefault) {
        themeDark.onclick = () => {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        };
        themeLight.onclick = () => {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        };
        themeDefault.onclick = () => {
            document.body.classList.remove('dark-mode');
            document.body.classList.remove('light-mode');
        };
    }

    // ----------- Publication enrichie -------------
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.onsubmit = function (e) {
            e.preventDefault();
            let post = document.getElementById('editor').innerHTML;
            let mediaInput = document.getElementById('media-input');
            let div = document.createElement('div');
            div.className = "post";

            // Header (Avatar + Nom)
            let header = document.createElement('div');
            header.className = "post-header";
            let username = localStorage.getItem('currentUser') || "Utilisateur";
            header.innerHTML = `<div class="post-avatar">👤</div> <span>${username}</span>`;
            div.appendChild(header);

            // Contenu du post
            let contentDiv = document.createElement('div');
            contentDiv.className = "post-content";

            // Convertir le markdown simple en HTML
            post = post.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
            post = post.replace(/\*([^*]+)\*/g, "<i>$1</i>");
            post = post.replace(/<u>(.+?)<\/u>/g, "<u>$1</u>");
            contentDiv.innerHTML = post;
            div.appendChild(contentDiv);

            // Ajout médias
            if (mediaInput.files.length > 0) {
                for (let file of mediaInput.files) {
                    let el;
                    if (file.type.startsWith("image")) {
                        el = document.createElement('img');
                    } else if (file.type.startsWith("video")) {
                        el = document.createElement('video');
                        el.controls = true;
                    }
                    if (el) {
                        el.src = URL.createObjectURL(file);
                        div.appendChild(el);
                    }
                }
            }
            // Ajout localisation
            if (userPosition) {
                let loc = document.createElement('div');
                loc.className = "post-location";
                loc.innerHTML = `📍 ${userPosition}`;
                div.appendChild(loc);
            }

            // Ajout paramètres de publication
            let visibility = document.getElementById('visibility').value;
            let enableComments = document.getElementById('enable-comments').checked;

            if (!enableComments) {
                div.classList.add('comments-disabled');
            }

            const publishBtn = document.querySelector('.fb-publish');
            if (visibility === "private") {
                div.classList.add('post-private');
                publishBtn.classList.add('btn-private');
            } else {
                publishBtn.classList.remove('btn-private');
            }

            let info = document.createElement('div');
            info.className = "post-meta";
            info.innerHTML = `Visibilité: <b>${visibility}</b> | Commentaires: <b>${enableComments ? "activés" : "désactivés"}</b>`;
            div.appendChild(info);

            document.getElementById('publications').prepend(div);
            this.reset();
            document.getElementById('media-preview').innerHTML = "";
            document.getElementById('user-location').textContent = "";
            if (locationInput) {
                locationInput.value = "";
                locationInput.style.display = "none";
            }
            if (getLocationBtn) getLocationBtn.style.display = "inline-block";
            userPosition = "";

            document.getElementById('editor').innerHTML = "Exprimez-vous...";
        };
    }
}
