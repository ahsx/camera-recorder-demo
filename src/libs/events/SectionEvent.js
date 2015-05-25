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
	function SectionEvent(){}

	/**
	 *	Open the given section
	 **/
	SectionEvent.OPEN = 'section::open';

	/**
	 *	Close the section
	 **/
	SectionEvent.CLOSE = 'section::close';

	window.SectionEvent = SectionEvent;
})(window);