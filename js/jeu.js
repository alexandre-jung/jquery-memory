const CHAT = '01';
const LAPINS = '02';
const CUISINE = '03';
const NOMBRE_PAIRES = 8;
const PAIRES = melangerPaires(chargerPaires());

let premiereImageRetournee = false;
let image1src = null;
let image2src = null;

let img1 = null;
let img2 = null;

let pairesTrouvées = 0;
let essais = 0;

let peutJouer = true;

function chargerPaires(idPaires = '01') {

    // Créée l'url de toutes les images
    let resultat = [];
    for (let i = 0; i < NOMBRE_PAIRES; i++) {
        let idImage = i + 1;
        let url = `images/paires${idPaires}/${idImage}.jpg`;
        resultat.push(url);
    }

    // Ajoute le tableau à lui-même pour avoir chaque
    // carte en deux exemplaires
    return resultat.concat(resultat);
}

function melangerPaires(paires) {

    // Copie le tableau et mélange la copie
    let resultat = paires.slice();
    for (let i = 0; i < NOMBRE_PAIRES * 2; i++) {
        let j = Math.floor(Math.random() * (NOMBRE_PAIRES * 2));
        [resultat[i], resultat[j]] = [resultat[j], resultat[i]];
    }
    return resultat;
}

function jouer() {

    // Vide le container
    $('#container').html('');

    let paires = chargerPaires($('#idChoix').val());
    paires = melangerPaires(paires);
    chargerElements(paires);

    premiereImageRetournee = false;
    pairesTrouvées = 0;
    essais = 0;

    // Met à jour les compteurs
    $('#idNbrPaire').val(pairesTrouvées);
    $('#idNbrEssai').val(essais);

    // Ajoute un évènement à chaque élément
    $('li').on('click', event => {

        if (!peutJouer) {
            return;
        }

        // La cible et l'image associée
        let target = $(event.target);
        let image = $('img', target);

        if (premiereImageRetournee) {
            // Deuxième image

            image.show(150);
            target.addClass('retourner');
            image2src = image.attr('src');
            premiereImageRetournee = false;

            img2 = image;

            if (image1src == image2src) {

                // Paire trouvée

                img1.parent().removeAttr('class');
                img2.parent().removeAttr('class');

                pairesTrouvées++;
                essais++;
            }
            else {
                // cacher les 2 images
                // supprimer la class sur les 2 images

                peutJouer = false;

                setTimeout(() => {
                    img1.delay(200).hide(150);
                    img2.delay(200).hide(150);

                    img1.parent().removeAttr('class');
                    img2.parent().removeAttr('class');

                    peutJouer = true;
                }, 1000);

                essais++;
            }
        }
        else {

            if (!target.hasClass('retourner')) {
                // Première image

                premiereImageRetournee = true;
                image.show(150);
                target.addClass('retourner');
                image1src = image.attr('src');

                img1 = image;
            }
        }

        // Met à jour les compteurs
        $('#idNbrPaire').val(pairesTrouvées);
        $('#idNbrEssai').val(essais);

        if (pairesTrouvées == NOMBRE_PAIRES) {
            alert('Gagné !');
        }

    });
}

function chargerElements(urls) {

    // Trouve le container
    let container = $('#container');

    // Créée et ajoute une <ul>
    let ul = $('<ul></ul>').appendTo(container);

    // Créée les cartes et les ajoute à la liste
    for (let i = 0; i < urls.length; i++) {
        let element = $('<li></li>').appendTo(ul);
        let image = $(`<img src=${urls[i]}>`);

        // Cache l'image et l'ajoute au jeu
        image.hide().appendTo(element);
    }
}

// Initialise et démarre le jeu
$(() => jouer());
