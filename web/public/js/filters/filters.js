(function(app) {
	app.filter('cellImage', function() {
		return function(cell) {
			return cell.oka
				? '../public/images/striptease.png'
				: '../public/images/level-' + (cell.level + 1) + '.png';
		};
	});

	app.filter('avatarImage', function() {
		return function(user) {
			return !user.avatar
				? '../public/images/default-avatar.png'
				: user.avatar;
		};
	});
})(web);
