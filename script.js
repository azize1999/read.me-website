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

    // ----------- Avatar Upload -------------
    const avatarInput = document.getElementById('avatar-input');
    const currentUserAvatar = document.getElementById('current-user-avatar');
    let userAvatarUrl = null;

    if (currentUserAvatar && avatarInput) {
        currentUserAvatar.onclick = () => avatarInput.click();
        avatarInput.onchange = function () {
            if (this.files && this.files[0]) {
                userAvatarUrl = URL.createObjectURL(this.files[0]);
                currentUserAvatar.innerHTML = "";
                currentUserAvatar.style.backgroundImage = `url('${userAvatarUrl}')`;
                currentUserAvatar.style.backgroundSize = "cover";
                currentUserAvatar.style.backgroundPosition = "center";
            }
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

            // Header (Avatar + Infos)
            let header = document.createElement('div');
            header.className = "post-header";
            let username = localStorage.getItem('currentUser') || "Utilisateur";

            let avatarHtml = `<div class="post-avatar">👤</div>`;
            if (userAvatarUrl) {
                avatarHtml = `<div class="post-avatar" style="background-image: url('${userAvatarUrl}'); background-size: cover; background-position: center;"></div>`;
            }

            // Préparation des infos méta (Localisation + Visibilité) - AU-DESSUS du nom
            let metaInfo = "";
            if (userPosition) {
                metaInfo += `📍 ${userPosition} `;
            }
            let visibility = document.getElementById('visibility').value;
            let visibilityIcon = visibility === "private" ? "🔒" : "🌍";
            metaInfo += `${metaInfo ? "• " : ""}${visibilityIcon}`;

            header.innerHTML = `
                ${avatarHtml}
                <div class="post-info">
                    <span class="post-details">${metaInfo}</span>
                    <span class="post-author">${username}</span>
                </div>
            `;
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

            // Ajout paramètres de publication
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

            // --- REACTION BAR ---
            let actionsDiv = document.createElement('div');
            actionsDiv.className = "post-actions";
            actionsDiv.innerHTML = `
                <button class="action-btn like-btn">👍 J'aime <span class="count">0</span></button>
                <button class="action-btn love-btn">❤️ J'adore <span class="count">0</span></button>
                <button class="action-btn haha-btn">😂 Haha <span class="count">0</span></button>
                <button class="action-btn sad-btn">😢 Triste <span class="count">0</span></button>
                <button class="action-btn angry-btn">😡 Grrr <span class="count">0</span></button>
                <button class="action-btn clap-btn">👏 Bravo <span class="count">0</span></button>
            `;
            div.appendChild(actionsDiv);

            // Logic Reactions
            actionsDiv.querySelectorAll('.action-btn').forEach(btn => {
                btn.onclick = function () {
                    let countSpan = this.querySelector('.count');
                    let count = parseInt(countSpan.textContent);
                    count++;
                    countSpan.textContent = count;
                    this.style.color = "#1877f2"; // Highlight color
                    this.style.fontWeight = "bold";
                };
            });

            // --- COMMENT SECTION ---
            if (enableComments) {
                let commentsSection = document.createElement('div');
                commentsSection.className = "post-comments-section";
                commentsSection.innerHTML = `
                    <div class="comments-list"></div>
                    <div class="comment-input-area">
                        <input type="text" placeholder="Écrire un commentaire..." class="comment-input">
                    </div>
                `;
                div.appendChild(commentsSection);

                // Logic Comments
                let input = commentsSection.querySelector('.comment-input');
                input.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter' && this.value.trim() !== "") {
                        let list = commentsSection.querySelector('.comments-list');
                        let commentDiv = document.createElement('div');
                        commentDiv.className = "comment-item";
                        // Avatar commentaire (petit)
                        let commentAvatar = userAvatarUrl ? `<div class="comment-avatar" style="background-image: url('${userAvatarUrl}');"></div>` : `<div class="comment-avatar">👤</div>`;

                        commentDiv.innerHTML = `
                            ${commentAvatar}
                            <div class="comment-bubble">
                                <strong>${username}</strong>
                                <p>${this.value}</p>
                            </div>
                        `;
                        list.appendChild(commentDiv);
                        this.value = "";
                    }
                });
            }

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
