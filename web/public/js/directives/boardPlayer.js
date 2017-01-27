(function(app) {
	app.directive('boardPlayer', function() {
		return {
			restrict: 'E',
			template: '<div class="player gender-{{player.gender}} '
						+ '{{speed}} hidden"></div>',
			replace: true,
			scope: {
				player: '=',
				speed: '=',
			},
			link: function($scope, element, attrs, controller) {
				element.css('display: none;');
				$scope.$watch('player.visible', function(value) {
					if (value) {
						element.removeClass('hidden');
					} else {
						element.addClass('hidden');
					}
				});
				$scope.$watch('player.top', function(value, old) {
					element.css('top', '' + (value - element[0].offsetHeight / 2) + 'px');
				});

				$scope.$watch('player.left', function(value, old) {
					element.css('left', '' + (value - element[0].offsetWidth / 2) + 'px');
				});
			},
		};
	});
})(web);
