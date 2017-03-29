(function(app) {
	app.filter('cellImage', function() {
		return function(cell) {
			switch (cell.level) {
				case 0: return '../public/images/striptease.png';
				case 1: return '../public/images/whisper.png';
				case 2: return '../public/images/hands.png';
				case 3: return '../public/images/masturbation.png';
				case 4: return '../public/images/oral-sex.png';
				default: return '../public/images/sex.png';
			}
		};
	});
})(web);
