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
        userQuizAvailable=[];
        getQuizUsers(quiz.id)
            .then(function(response) {
                    $scope.quizUsers = response.data;
                    getUsers()
                        .then(function (response){
                            $scope.users=response.data;
                        });
            }, function(error) {
                    alert("Could not get quizUser relation " + error.message);
            });

    };

    //Check if quizUsers contains particular user
    $scope.quizAvailable = function(user){
        for (var i=0; i<$scope.quizUsers.length; i++){
            var curQuizUser = $scope.quizUsers[i]
            if(curQuizUser.user == user.id && curQuizUser.available==true ){
                userQuizAvailable.push(true);
                return true;
            }
        };
        userQuizAvailable.push(false);
        return false;
    };

    //Creates and/or updates quiz user relations
    $scope.shareWithUser = function(user, index) {
        quizUser = {
            'user':user.id,
            'quiz':$scope.curQuiz.id,
        };

        //Determine if user is being shared with or unsared with
        if (userQuizAvailable[index]==false){
            //Share quiz
            quizUser.available=true;
            updateQuizUser(quizUser)
                .then(function(response){
                    userQuizAvailable[index] = true;
                    //TODO: add fade to saved
                    user.saved=true;
                }, function(error){
                    alert("Unable to post quiz user relation " + error.message);
                });
        } else{
            quizUser.available=false;
            //unshare quiz
            updateQuizUser(quizUser)
                .then(function(response){
                    userQuizAvailable[index] = false;
                    user.saved=true;
            }, function(error){
                alert("Unable to update quiz user relation " + error.message);
            });
        }

    };


    //On page load
    $scope.loadPage = function(userId) {
        $scope.loadItems();
        $scope.curUserId=userId;
        $scope.usersQuizBtnClass = "active";
    };


//TODO: Create Service Layer
    //Get all quiz_user relations for a quiz
    getQuizUsers = function(quizId){
        return($http.get('/quiztro/api/quiz/'+quizId+'/quizuser/'));
    };
    //Update quiz user relation
    updateQuizUser = function(quizUser){
        return ($http.post('/quiztro/api/quiz/'+quizUser.quiz+'/user/'+quizUser.user+'/', quizUser) );
    };

    //Get Users
    getUsers = function(){
        return($http.get('/quiztro/api/user/'));
    };

    //TODO: This shouldn't be done with a non user list
    //Get users not yet shared with
    getNonUsers = function(quizId){
        return($http.get('/quiztro/api/quiz/'+quizId+'/nonuser'));
    };

    //Post new quiz, user relation
    //TODO this is replaced with updateQuizUser
    postQuizUser = function(quizUser){
        return ($http.post('/quiztro/api/quiz/'+quizUser.quiz+'/user/'+quizUser.user+'/', quizUser) );
    };

    //Get Quizzes
    getQuizzes = function(){
        return ( $http.get('/quiztro/api/quiz/') );
    };

    //Add Quiz
    postQuiz = function(quiz){
        return ($http.post('/quiztro/api/quiz/', quiz) );
    };


    //Delete Quiz
    deleteQuiz = function(quizId) {
        return ($http.delete('/quiztro/api/quiz/' + quizId));
    };


}); //End Index controller 