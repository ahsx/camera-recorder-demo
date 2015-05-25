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
	function ApplicationEvent(){}

	/**
	 *	Go to the given section
	 **/
	ApplicationEvent.GO = 'app::go';

	/**
	 *	Go to the next section
	 **/
	ApplicationEvent.NEXT = 'app::next';

	/**
	 *	Go to the previous section
	 **/
	ApplicationEvent.PREVIOUS = 'app::previous';

	window.ApplicationEvent = ApplicationEvent;
})(window);