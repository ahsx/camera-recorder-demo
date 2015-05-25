(function(window)
{

	/**
	 *	Controller for the list sections
	 *
	 *	@author Alexandre Masy
	 **/
	var AbstractSection = helper.getClass('app.sections.AbstractSection');
	var ListSection = AbstractSection.extend({

		/**
		 *	Init the class
		 *
		 *	@param view jQueryElement
		 **/
		init:function( view )
		{
			this._super( view );
			this.background = this.view.find('.background');

			this.links = this.view.find('a.bar').on('click', onLinkClick.bind(this))
		}

		,open: function()
		{	
			this._super();
		}

		,close: function()
		{
			this._super();
			this.links.removeClass('active');
		}
	});

	function onLinkClick(event)
	{
		event.preventDefault();

		var el = jQuery(event.currentTarget)
		var href = el.attr('href');

		if ( href != '#' )
		{
			this.links.removeClass('active');
			el.addClass('active');
			this.dispatcher.trigger( SectionEvent.OPEN, {url: href} );
		}

		return false;
	}

	helper.register( ListSection, "app.sections.ListSection" );
})(window);