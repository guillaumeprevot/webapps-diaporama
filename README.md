# webapps-diaporama

A simple diaporama application using HTML5, JavaScript and CSS3.

## Présentation

[Cette application](https://techgp.fr/webapps/webapps-diaporama.html) écrite en HTML5, JavaScript et CSS3 vous permettra de visualiser des photos ou des images.

Les librairies suivantes ont été utilisées pour cette application :

- [jQuery 3.3.1](https://jquery.com/) sous licence MIT
- [Bootstrap 3.3.7](https://getbootstrap.com/docs/3.3/components/) sous licence MIT
- [DryIcons](https://dryicons.com/) pour le favicon

L'application est fournie avec un fichier manifest `webapps-diaporama.appcache` permettant la mise en cache et l'utilisation en mode déconnecté. Plus d'info chez Mozilla [en français](https://developer.mozilla.org/fr/docs/Utiliser_Application_Cache) ou [en anglais](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache).

NB : quand le certificat HTTPS est incorrect, la mise en cache échouera sous Chrome avec l'erreur `Manifest fetch Failed (9)`. Dans ce cas, faites les tests en HTTP et/ou utilisez un certificat valide en production.

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
