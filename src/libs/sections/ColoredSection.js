(function(window)
{
	/**
	 *	Controller for the colored sections
	 *
	 *	@author Alexandre Masy
	 **/
	var AbstractSection = helper.getClass('app.sections.AbstractSection');
	var ColoredSection = AbstractSection.extend({

		/**
		 *	Init the class
		 *
		 *	@param view jQueryElement
		 **/
		init:function( view )
		{
			this._super( view )
		}	
	});

	helper.register( ColoredSection, "app.sections.ColoredSection" );
})(window);