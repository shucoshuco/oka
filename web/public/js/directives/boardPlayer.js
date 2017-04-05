(function(app) {
	app.directive('boardPlayer', function() {
		return {
			restrict: 'E',
			template: '<div class="player gender-{{player.model.gender}} '
						+ '{{speed}}" ng-show="player.visible"></div>',
			replace: true,
			scope: {
				player: '=',
				speed: '=',
			},
			link: function($scope, element, attrs, controller) {
				let offsetWidth = function offsetWidth() {
					return (element[0].offsetWidth || 30) / 2;
				};

				let offsetHeight = function offsetHeight() {
					return (element[0].offsetWidth || 30) / 2;
				};

				$scope.$watch('player.top', function(value, old) {
					element.css('top', '' + (value - offsetHeight()) + 'px');
				});

				$scope.$watch('player.left', function(value, old) {
					element.css('left', '' + (value - offsetWidth()) + 'px');
				});
			},
		};
	});
})(web);
