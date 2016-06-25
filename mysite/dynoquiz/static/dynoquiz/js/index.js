var index = angular.module('index',[]);

index.config(function($interpolateProvider){
	//allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
index.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


index.controller('QuizCtrl', function QuizCtrl($scope, $log, $http){

	//Load All user quizzes
	$scope.loadItems = function() {
		getQuizzes()
		    .then(function(response){
			    $scope.quizes = response.data;
		    });
	}; // End loadItems 

	$scope.addQuiz = function(){
		$scope.date = new Date();
		quiz = {
		    'user':$scope.userId,
			'quiz_name':$scope.quizName,
			'quiz_details':$scope.quizDetails,
			'date_created':$scope.date,
		};
		$scope.quizName=null;
		$scope.quizDetails=null;
		postQuiz(quiz)
		    .then(function(response){
			    $scope.loadItems();
		    });
	};

	$scope.removeQuiz = function(id) {
		deleteQuiz(id)
		    .then(function(){
			    $scope.loadItems();
		    });
	};

    $scope.shareQuiz = function(quiz) {
        $scope.curQuiz=quiz;
        getNonUsers(quiz.id)
            .then(function (response) {
                $scope.nonUsers=response.data;
            }, function(error) {
                alert("Unable to load users " + error.message);
            });
    };

    $scope.shareWithUser = function(user) {
        //$scope.curQuiz.users.push(user.id);
        quizUser = {
            'user':user.id,
            'quiz':$scope.curQuiz.id
        };
        postQuizUser(quizUser)
            .then(function (response) {
                user.saved=true;
            }, function(error) {
                alert("Unable to load users " + error.message);
            });
    };


    //On page load
    $scope.loadPage = function(userId) {
        $scope.loadItems();
        $scope.curUserId=userId;
        $scope.usersQuizBtnClass = "active";
    };


//TODO: Create Service Layer
    updateQuizUser = function(quiz){
        return ($http.put('/dynoquiz/api/quiz/'+quiz.id + '/', quiz) );
    };

    //TODO: This shouldn't be done with a non user list
    //Get users not yet shared with
    getNonUsers = function(quizId){
        return($http.get('/dynoquiz/api/quiz/'+quizId+'/nonuser'));
    };

    //Post new quiz, user relation
    postQuizUser = function(quizUser){
        return ($http.post('/dynoquiz/api/quiz/'+quizUser.quiz+'/user/'+quizUser.user+'/', quizUser) );
    };

    //Get Quizzes
    getQuizzes = function(){
        return ( $http.get('/dynoquiz/api/quiz/') );
    };

    //Add Quiz
    postQuiz = function(quiz){
        return ($http.post('/dynoquiz/api/quiz/', quiz) );
    };


    //Delete Quiz
    deleteQuiz = function(quizId) {
        return ($http.delete('/dynoquiz/api/quiz/' + quizId));
    };


}); //End Index controller 