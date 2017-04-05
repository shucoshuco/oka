(function(app) {
	app.filter('cellImage', function() {
		return function(cell) {
			return '../public/images/level-' + (cell.level + 1) + '.png';
		};
	});
})(web);
