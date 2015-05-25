/**
 *	Helper class to help things to go smooth
 *
 *	@author Alexandre Masy
 **/
(function( window )
{

	/**
	 *	El constructor
	 **/
	function Helper()
	{
		jQuery('document').ready(init.bind(this));
		jQuery(window).on('resize', resize.bind(this));
	}

	/**
	 *	Prototype
	 **/
	var p = Helper.prototype;

	/**
	 *	List of the methods to be initialize on ready
	 **/	
	p.requestInit = [];

	/**
	 *	List of methods to call on window resize
	 **/
	p.requestResize = [];

	/**
	 *	List of classes
	 **/
	p.classes = {};

	/**
	 *	Dispatcher
	 **/
	p.dispatcher = jQuery({});

	/**
	 *	Bind an event
	 **/
	p.on = p.dispatcher.on.bind(p.dispatcher);

	/**
	 *	Unbind an event
	 **/
	p.off = p.dispatcher.off.bind(p.dispatcher);

	/**
	 *	Trigger an event
	 **/
	p.trigger = p.dispatcher.trigger.bind(p.dispatcher);

	/**
	 *	Register a class
	 *
	 *	@param value Class
	 *	@param address String
	 **/
	p.register = function ( value, address )
	{
		this.classes[address] = value;
	}

	/**
	 *	Get a class
	 *
	 *	@param value String
	 *	@return Class
	 */
	p.getClass = function( value )
	{
		if ( this.classes.hasOwnProperty(value) )
			return this.classes[value];
		return false;
	}

	/**
	 *	Add a method to the initialisation list
	 *
	 *	@param f Function
	 **/
	p.addInit = function( f )
	{
		this.requestInit.push( f );
	}

	/**
	 *	Add a method to call on window resize
	 *
	 *	@param f Function
	 **/
	p.addResize = function( f )
	{
		this.requestResize.push( f );
	}

	/**
	 *	Init all the requested methods
	 **/
	function init()
	{
		var n = this.requestInit.length;
		while( n-->0 )
		{
			this.requestInit[n]();
		}
	}

	/**
	 *	Window resize handler
	 **/
	function resize()
	{
		var n = this.requestResize.length;
		while( n-->0 )
		{
			this.requestResize[n]();
		}
	}

	window.helper = new Helper();
})(window);