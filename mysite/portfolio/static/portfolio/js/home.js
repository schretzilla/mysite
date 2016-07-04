var home = angular.module('home', ['directives.percent']);
home.controller('HomeController', function ($scope, $http) {
    

});

var percentDirective = angular.module('directives.percent', []);
percentDirective.directive('percent', function() {
    return{
            restirct:'E',
            scope: {object: '@'},
            template: '\
            <div class="progress">\
                <div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: {{object}}%">\
                {{object/10}}/10\
                </div>\
            </div> '
        }
    });