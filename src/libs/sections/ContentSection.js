(function(window)
{

	/**
	 *	Controller for the content sections
	 *
	 *	@author Alexandre Masy
	 **/
	var AbstractSection = helper.getClass('app.sections.AbstractSection');
	var ContentSection = AbstractSection.extend({

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

	helper.register( ContentSection, "app.sections.ContentSection" );
})(window);