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
		description = file.name + '\n(' + file.type + ', ' + this.formatFileSize(file.size) + ', ' + this.formatFileDate(file) + ')';
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

Diaporama.prototype.formatFileDate = function(file) {
	return new Date(file.lastModified).toLocaleDateString();
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
	var diaporama = new Diaporama($('#diaporama-content'));

	/*
	 * Profiter du "diaporama.onchange" pour :
	 * - afficher / cacher les contrôles selon l'état du diaporama
	 * - mettre à jour les boutons de navigation
	 * - mettre à jour en haut à droite la description de l'image actuellement affichée
	 */
	diaporama.onchange = function(d) {
		var ready = d.index >= 0,
			span = $('#image-description').toggle(ready);
		$('#image-size-button').toggle(ready);
		$('#navigation').toggle(ready);
		$('#show-first-button').prop('disabled', d.index == 0);
		$('#show-previous-button').prop('disabled', d.index == 0);
		$('#show-next-button').prop('disabled',d.index == d.files.length - 1);
		$('#show-last-button').prop('disabled',d.index == d.files.length - 1);
		$('#position').text((d.index + 1) + ' / ' + d.files.length);
		$('#image-description').toggle(ready);
		if (ready) {
			var file = d.files[d.index];
			var description = d.image[0].naturalWidth + 'x' + d.image[0].naturalHeight + ', ' + file.type + ', ' + d.formatFileSize(file.size) + ', ' + d.formatFileDate(file);
			$('#image-description')
				.children(':first-child').text(file.name).end()
				.children(':last-child').text(description).end();
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
	$('#show-first-button').click(() => diaporama.showFirst());
	$('#show-previous-button').click(() => diaporama.showPrevious());
	$('#show-next-button').click(() => diaporama.showNext());
	$('#show-last-button').click(() => diaporama.showLast());

	/* Ajuster la taille des images quand la taille de la fenêtre change */
	$(window).on('resize', function() {
		diaporama.updateSize();
	});

	/* Faire défiler les images en tactile, grâce à jQuery Mobile */
	$('#diaporama-content').on('touchstart', function(startEvent) {
		var startX, moveX;
		function touchmove(event) {
			if (event.originalEvent.touches)
				moveX = event.originalEvent.touches[0].clientX;
		}
		if (startEvent.originalEvent.touches) {
			startX = startEvent.originalEvent.touches[0].clientX;
			$(document).on('touchmove', touchmove).one('touchend', function() {
				$(document).off('touchmove', touchmove);
				if (moveX - startX > 30) { //swipe right => previous
					diaporama.showPrevious();
				} else if (startX - moveX > 30) { //swipe left => next
					diaporama.showNext();
				}
			});
		}
	});

	/* Faire défiler les images  avec les touches gauche/droite du clavier */
	$(document.body).on('keypress', function(event) {
		if (event.target.tagName === 'INPUT' || event.ctrlKey)
			return;
		var keyCode = event.which || event.keyCode;
		switch(keyCode) {
			case 37: // left
				diaporama.showPrevious();
				event.preventDefault();
				break;
			case 39: // right
				diaporama.showNext();
				event.preventDefault();
				break;
		}
	});

	/* Empêcher le "dragstart"  sur les images pour être sûr que le 'swipeleft' fonctionne */
	$('#diaporama-content').on('dragstart', function(event) {
		event.preventDefault();
	});
});