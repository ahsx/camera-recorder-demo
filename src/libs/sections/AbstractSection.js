(function(window)
{

	var AbstractSection = Class.extend({

		init: function( view )
		{
			this.view = view;
			this.win = jQuery(window);
			this.dispatcher = jQuery({});
		}

		/**
		 *	Return the height of the view
		 *
		 *	@return Number
		 **/
		,height: function()
		{
			return this.view.outerHeight();
		}

		,open: function( url )
		{
			this.view.addClass('open');
		}
		,close: function()
		{
			this.view.removeClass('open');
		}
		,update: function()
		{
			this.updateLayout();
		}
		,updateLayout: function(){}
	});

	helper.register( AbstractSection, 'app.sections.AbstractSection' );
})(window);