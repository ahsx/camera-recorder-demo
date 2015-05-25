/**
 *	Application controller
 *
 *	@author Alexandre Masy
 **/
(function(window)
{

	/**
	 *	El constructor
	 **/
	function NavigationEvent(){}

	/**
	 *	the navigation is open
	 **/
	NavigationEvent.OPENED = 'navigation::opened';

	/**
	 *	the navigation is closed
	 **/
	 NavigationEvent.CLOSED = 'navigation::closed';

	window.NavigationEvent = NavigationEvent;
})(window);