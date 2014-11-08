angular.module('distApp')
  .filter('toColorClass', function() {
  	/*
  	* if max is not present, n is assumed to be a percentage out of 100
  	* if max is passed in, the percentage is calculated
  	*/
    return function(n, max) {
    	console.log(n)
    	console.log(max)
    	var number = max ? Math.floor(Math.abs(n/max)*100) : Math.abs(n);
    	console.log(number)
    	// if number is between 0 and 40, show 'danger',
    	if (number <= 40) {
    		return 'danger'
    	} else if(number <= 60) {
			return 'warning'
		} if(number > 60) {
    		return 'success'
    	}
    }
  })