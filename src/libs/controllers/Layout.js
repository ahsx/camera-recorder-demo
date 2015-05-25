(function(window)
{

	function Layout(){}

	/**
	 *	X-Small
	 **/
	Layout.XS = 'xs';

	/**
	 *	Small
	 **/
	Layout.SM = 'sm';

	/**
	 *	Medium
	 **/
	Layout.MD = 'md';

	/**
	 *	Large
	 **/
	Layout.LG = 'lg';

	/**
	 *	Return the layout name based on the width
	 *	The name are the same as Twitter Bootstrap
	 *	
	 *	@return String
	 **/
	Layout.getName = function()
	{
		var w = jQuery(window).width();
		var ret = Layout.XS;

		if ( w < 768 )
			ret = Layout.XS;
		else if ( w>=768 && w < 992 )
			ret = Layout.SM;
		else if ( w >= 992 && w < 1200)
			ret = Layout.MD;
		else
			ret = Layout.LG;

		return ret;
	}

	/**
	 *	Is it a small screen
	 *
	 *	@return Boolean
	 **/
	Layout.isSmall = function()
	{
		var n = Layout.getName();
		return n == Layout.XS || n == Layout.SM;
	}

	window.Layout = Layout;
})(window);