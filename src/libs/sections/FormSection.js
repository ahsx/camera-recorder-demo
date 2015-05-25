(function(window)
{

	/**
	 *	Controller for the form sections
	 *
	 *	@author Alexandre Masy
	 **/
	var AbstractSection = helper.getClass('app.sections.AbstractSection');
	var FormSection = AbstractSection.extend({

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

	helper.register( FormSection, "app.sections.FormSection" );
})(window);