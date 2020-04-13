# webapps-diaporama

A simple diaporama application using HTML5, JavaScript and CSS3.

## Présentation

[Cette application](https://techgp.fr:9005/webapps-diaporama/webapps-diaporama.html) écrite en HTML5, JavaScript et CSS3 vous permettra de visualiser des photos ou des images.

Les librairies suivantes ont été utilisées pour cette application :

- [jQuery 3.5.0](https://jquery.com/)
- [Bootstrap 4.4.1](https://getbootstrap.com/)
- [Popper 1.16.1](https://popper.js.org/), dépendance de Bootstrap 4
- [Material Icons](https://material.io/tools/icons) pour les boutons
- [DryIcons](https://dryicons.com/) pour le favicon

## Captures d'écran

### Présentation de l'IHM

![Présentation de l'IHM](./screenshots/webapps-diaporama-1.png)

## Licence

Ce projet est distribué sous licence MIT, reproduite dans le fichier LICENSE ici présent.

## Changelog

2016-03-20
- première version

2016-04-11
- amélioration des performances en utilisant URL.createObjectURL et URL.revokeObjectURL au lieu de FileReader.readAsDataURL
- ajout du support des touches gauche/droite pour naviguer dans le diaporama

2016-06-28
- ajout du fichier LICENCE

2016-07-16
- mise à jour de jQuery (2.1.4 vers 2.2.4)

2017-05-21
- mise à jour de jQuery (2.2.4 en 3.2.1) et Bootstrap (3.3.6 en 3.3.7)

2018-08-26
- correction d'un bug de récupération de la date des fichiers ("lastModifiedDate" dépréciée puis supprimée dans Firefox 61+)
- correction d'un clignotement au lancement en cachant par défaut les boutons du diaporama dans la barre en haut
- détection manuelle de 'swipeleft' et 'swiperight' pour supprimer la dépendance vers [jQuery Mobile 1.4.5](https://jquerymobile.com/) 
- mise à jour de jQuery (3.2.1 => 3.3.1) et renommage de "bootstrap" en "bootstrap3"
- passage des liens externes en HTTPS

2018-08-30
- mise à jour de la capture d'écran

2020-04-13
- nouvelle version plus moderne à l'occasion de la migration vers Bootstrap 4 (4.4.1)
- intégration de Popper (1.16.1) + mise à jour de jQuery (3.5.0) + utilisation de Material Icons au lieu de Glyphicons
- suppression de Application Cache, devenu obsolète (https://developer.mozilla.org/fr/docs/Web/HTML/Utiliser_Application_Cache)
