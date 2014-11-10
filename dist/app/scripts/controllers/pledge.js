'use strict';

angular.module('distApp')
  .controller('PledgeModalCtrl', ['$scope', '$routeParams', 'API', 'Socket', 'project', '$modalInstance', 
    function($scope, $routeParams, API, Socket, project, $modalInstance) {

  // amount field is enabled by default
  $scope.amount_disabled = false;

  $scope.project = project
  $scope.amount = project.cost // the user won't be able to set the pledge amount
  
  // and it will default to the cost of the project if under 40k
  if (project.cost < 40000) {
    $scope.amount_disabled = true
    $scope.high_cost_project = false
  } else {
    $scope.high_cost_project = true
    $scope.cost_increment = project.increment
  }

  if (project.limit == 0) {
    $scope.already_funded = true
  }

  $scope.close = function() {
    $modalInstance.close()
  }

  $scope.submitPledge = function() {

    if ($scope.show_confirmation) {

      var data = _($scope.selected_contact).extend({
        amount: Math.min($scope.amount, $scope.cost_increment), 
        project_id: project._id 
      })

      Socket.emit('project::fund', data, function(err) {
        if (err) {
          $scope.show_warning_label = true
        } else {
          $scope.show_confirmation = false
          $scope.show_thankyou = true
        }
      })
    } else {
      $scope.show_confirmation = true
      return
    }

    var data = _($scope.selected_contact).extend({
      amount: $scope.amount, 
      project_id: project._id,
      project_category: project.category 
    })

    Socket.emit('project::fund', data, function(err) {
      if (err) {
        $scope.show_warning_label = true
      } else {
        $scope.show_confirmation = false
        $scope.show_thankyou = true
      }
    })
    
  }

  $scope.back = function() {
    $scope.show_confirmation = false
  }

  $scope.selectContact = function(cont) {
    var contact = {}
    var contact_properties = cont.properties

    contact.name = contact_properties.name[0].value
    contact.email = contact_properties.email ? contact_properties.email[0].value : null;
    contact.phone_number = contact_properties.phone ? contact_properties.phone[0].value : null;
    contact.address = contact_properties.address ? contact_properties.address[0].value : null;
    $scope.selected_contact = contact
    return
  }
  /* contact_list that is returned should take on the form of:
  * [ { 'properties' : { 'name' : { 'value' : 'Interstellar' } } } ]
  */
  $scope.findContacts = function(query_string) {
    return API.contacts({ name: query_string }).$promise.then(function(contact_list) {
      console.log(contact_list)
      return contact_list
    })
  }

  Socket.on('project::funded', function(data) {
    if (data.project_id == project._id) {
      $scope.already_funded = true
    }
  })

}]);


