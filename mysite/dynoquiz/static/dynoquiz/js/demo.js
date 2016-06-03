var shopping = angular.module('shopping',[]);

shopping.config(function($interpolateProvider){
	//allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

shopping.controller('ListCtrl', function ListCtrl($scope, $log, $http){

	//dummy init fun
	$scope.initialize = function(data){
		$log.log('initialize',data);
		$scope.initData=data;
	};

	$scope.loadItems = function() {
		$http.get('/dynoquiz/api/quiz/').then(function(response){
			$scope.items = response.data;
		});
	};

	/*
	Angular Doc says to run it like this
	$scope.loadItems2 = function() {
		$http({
			method: 'GET',
			ulr: '/dynoquiz/api/quiz/'
			}).then(function success(response) {
				$scope.item2 = response.data;
			});
	};*/

	$scope.postQuiz = function(quiz) {
		alert("Inside post quiz: " + quiz);
		$http.post('/dynoquiz/api/quiz/', quiz).then(function(){
			alert("success post");
		});
	};

	$scope.showNewFields = function() {
		$scope.newFields = !$scope.newFields;
	};

	$scope.loadItems();
	$scope.newFields = false;

	$scope.addQuiz = function() {
		$scope.date = new Date();
		$scope.newQuizObj = {
			'quiz_name':$scope.quizName,
			'quiz_details':$scope.quizDetails,
			'date_created':$scope.date
		};
		$scope.postQuiz($scope.newQuizObj);
	};
});


