(function(app) {
	app.directive('dice', ['$timeout', function($timeout) {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/dice.html',
			replace: true,
			scope: {
				player: '=',
				advance: '&',
			},
			link: function($scope, element, attrs, controller) {
				$scope.status = 0;
				$scope.roll = function() {
					$scope.status = $scope.status == 2 ? 0 : $scope.status + 1;
					switch($scope.status) {
						case 1:
							element.removeClass('in-turn');
							element.addClass('rolling');
							break;
						case 2:
							element.removeClass('rolling');
							element.addClass('drop');
							$timeout(function() {
								let n = Math.floor(Math.random() * 5) + 1;
								switch(n) {
									case 1: element.addClass('one'); break;
									case 2: element.addClass('two'); break;
									case 3: element.addClass('three'); break;
									case 4: element.addClass('four'); break;
									case 5: element.addClass('five'); break;
									case 6: element.addClass('six'); break;
								}
								$timeout(function() {
									$scope.advance({n: {n: n}});
								}, 2000);
							}, 2000);

							break;
					}
				};

				$scope.$watch('player.turn', function(value) {
					if (value) {
						element.addClass('in-turn');
						element.bind('click', $scope.roll);
					} else {
						element.removeClass('in-turn');
						element.removeClass('rolling');
						element.removeClass('drop');
						element.removeClass('one');
						element.removeClass('two');
						element.removeClass('three');
						element.removeClass('four');
						element.removeClass('five');
						element.removeClass('six');
						element.unbind('click');
					}
				});
			},
		};
	}]);
})(web);
