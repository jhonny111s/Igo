'use strict';

var todoApp = angular.module('todoApp', ['ngRoute', 'ui.bootstrap']);
todoApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/templates/todo.html',
      controller: 'TodoController',
    }).otherwise({
      redirectTo: '/',
      caseInsensitiveMatch: true
    })
  }]);

todoApp.controller('TodoController', TodoController);

function TodoController (TodoService) {

  var vm = this;

  vm.formData = {};
  vm.todos = [];

  TodoService.getTodos().then(function(response) {
    vm.todos = response;
  });

  function addTodo () {
    TodoService.addTodo(vm.formData).then(function(response) {
      vm.todos.push(vm.formData)
      vm.formData = {};
    });
  }

  function removeTodo(todo) {
    TodoService.removeTodo(todo).then(function(response) {
      vm.todos.splice(vm.todos.indexOf(todo), 1)
    });
  }

  vm.addTodo = addTodo;
  vm.removeTodo = removeTodo;

}
