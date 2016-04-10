function Diaporama(content) {
	this.content = content;
	this.image = this.content.children('img');
	this.updateSize();
	this.index = -1;
	this.files = [];
	this.image.on('load', this.onimageload.bind(this));
}

Diaporama.prototype.load = function(files) {
	this.files = files;
	this.image.hide();
	this.showFirst();
};

Diaporama.prototype.show = function(index) {
	if (this.isReady()) {
		var file, description;
		this.index = (index + this.files.length) % this.files.length;
		file = this.files[this.index];
		description = file.name + '<br />(' + file.type + ', ' + this.formatFileSize(file.size) + ', ' + file.lastModifiedDate.toLocaleDateString() + ')';
		this.image.hide().attr('src', window.URL.createObjectURL(file)).attr('title', description);
	} else {
		this.index = -1;
		this.image.hide().attr('src', '').attr('title', '');
		if (this.onchange)
			this.onchange(this);
	}
};

Diaporama.prototype.showFirst = function() {
	this.show(0);
};

Diaporama.prototype.showPrevious = function() {
	this.show(this.index - 1);
};

Diaporama.prototype.showNext = function() {
	this.show(this.index + 1);
};

Diaporama.prototype.showLast = function() {
	this.show(this.files.length - 1);
};

Diaporama.prototype.formatFileSize = function(size) {
	if (size < 1024)
		return size.toString();
	if (size < 1024 * 1024)
		return (size / 1024).toPrecision(3) + ' Ko';
	return (size / 1024 / 1024).toPrecision(3) + ' Mo';
};

Diaporama.prototype.updateSize = function() {
	this.image.css({
		width: this.content.innerWidth() + 'px',
		height: this.content.innerHeight() + 'px'
	});
};

Diaporama.prototype.isReady = function() {
	return this.files && this.files.length > 0;
};

Diaporama.prototype.onimageload = function(event) {
	window.URL.revokeObjectURL(this.image[0].src);
	this.image.fadeIn('fast');
	if (this.onchange)
		this.onchange(this);
};

$(function() {
	/* Créer un diaporama, qui va nous permettre de naviguer parmi les images */
	var diaporama = new Diaporama($('#diaporama-content')),
		/* Récupérer la barre de navigation, qu'il faudra mettre à jour quand on change d'image */
		navigation = $('#navigation').hide();

	/*
	 * Profiter du "diaporama.onchange" pour :
	 * - afficher / cacher les contrôles selon l'état du diaporama
	 * - mettre à jour les boutons de navigation
	 * - mettre à jour en haut à droite la description de l'image actuellement affichée
	 */
	diaporama.onchange = function(d) {
		var ready = d.index >= 0,
			n = $('#navigation').toggle(ready),
			span = $('#image-description').toggle(ready);
		$('#image-size-button').toggle(ready);
		n.children(':lt(2)').prop('disabled', d.index == 0);
		n.children(':gt(2)').prop('disabled', d.index == d.files.length - 1);
		n.children('#position').text((d.index + 1) + ' / ' + d.files.length);
		if (ready) {
			var file = d.files[d.index];
			span.children(':first-child').text(file.name);
			span.children(':last-child').text(d.image[0].naturalWidth + 'x' + d.image[0].naturalHeight + ', ' + file.type + ', ' + d.formatFileSize(file.size) + ', ' + file.lastModifiedDate.toLocaleDateString());
		}
	};

	/* Sélection d'une ou plusieurs images à afficher, par sélection ou glisser/déposer de fichiers */
	$('#open-files-button').on('click', function() {
		$('#open-files-input').click();
	});
	$('#open-files-input').on('change', function() {
		diaporama.load(this.files);
	});
	$('body').on('dragover', function(event) {
		event.stopPropagation();
		event.preventDefault();
		event.originalEvent.dataTransfer.dropEffect = 'copy';
	}).on('drop', function(event) {
		event.stopPropagation();
		event.preventDefault();
		diaporama.load(event.originalEvent.dataTransfer.files);
	});

	/* Sélection de la couleur de fond, pour s'assurer si besoin par exemple de la transparence */
	$('#background-color-button').on('click', function() {
		$('#background-color-input').click();
	});
	$('#background-color-input').on('change', function() {
		$(document.body).css('background-color', this.value);
	});

	/* 
	 * Passer d'un mode de dimensionnement à un autre :
	 * - 'scale-down' affiche les images entièrement, sans les déformer, mais en les réduisant si elles sont trop grandes
	 * - 'contain' s'assure que les images soient les plus grandes possibles, mais sans les déformer et en les affichant entièrement
	 * - 'cover' affiche les images de manière à couvrir la zone, en tronquant ce qui dépasse éventuellement dans une dimension 
	 */
	$('#image-size-button').on('click', function() {
		var img = $('#diaporama-content > img'),
			states = {};
		states['scale-down'] = 'contain';
		states['contain'] = 'cover';
		states['cover'] = 'scale-down';
		img.css('object-fit', states[img.css('object-fit')]);
	});

	/* Gérer les 4 boutons de navigation "first", "previous", "next" et "last" */
	navigation.on('click', 'button[data-action]', function(event) {
		var action = $(event.target).closest('button').attr('data-action');
		diaporama[action]();
	});

	/* Ajuster la taille des images quand la taille de la fenêtre change */
	$(window).on('resize', function() {
		diaporama.updateSize();
	});

	/* Faire défiler les images en tactile, grâce à jQuery Mobile */
	$('#diaporama-content').on('swipeleft', function() {
		diaporama.showNext();
	});
	$('#diaporama-content').on('swiperight', function() {
		diaporama.showPrevious();
	});

	/* Empêcher le "dragstart"  sur les images pour être sûr que le 'swipeleft' fonctionne */
	$('#diaporama-content').on('dragstart', function(event) {
		event.preventDefault();
	});
});