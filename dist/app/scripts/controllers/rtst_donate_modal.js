'use strict';

angular.module('distApp')
  .controller('RTSTDonateModalCtrl', ['$scope', 'API', '$modalInstance', function($scope, API, $modalInstance) {

  $scope.close = function() {
    $modalInstance.close()
  }

  $scope.donateRTST = function() {
    
    if (!$scope.show_confirmation) {
      $scope.show_confirmation = true
      return
    }

    var data = _($scope.selected_contact).extend({
      amount: $scope.amount 
    })

    API.fundRTST(data).$promise.then(function() {
      $scope.show_confirmation = false
      $scope.show_thankyou = true
    }, function(err) {
      $scope.show_warning_label = true
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

}]);


