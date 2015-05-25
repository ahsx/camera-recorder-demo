(function(window)
{
	/**
	 *	Controller for the colored sections
	 *
	 *	@author Alexandre Masy
	 **/
	var AbstractSection = helper.getClass('app.sections.AbstractSection');
	var ExtraSection = AbstractSection.extend({

		/**
		 *	Init the class
		 *
		 *	@param view jQueryElement
		 **/
		init:function( view )
		{
			this._super( view );

			this.sections = this.view.find(".section-content");
			this.view.find('.controls .close').on('click', onClose.bind(this));

			this.sections.find('a').on('click', onLinkClick.bind(this));
		}

		/**
		 *	Return the height of the view
		 *
		 *	@return Number
		 **/
		,height: function()
		{
			var ret = 0;
			var el;
			this.sections.each(function(i, e)
			{
				el = jQuery(e);
				ret = Math.max( ret, el.outerHeight() );
			});

			ret = Math.max( ret, this.view.outerHeight() );

			return ret;
		}

		,open: function( url )
		{	
			this._super();
			this.sections.addClass('hidden');

			var div = this.view.find('[data-url="'+url+'"]');
			div.removeClass('hidden');

			if ( Layout.isSmall() )
			{
				var o = div.offset().top;
				TweenMax.to(window, .3, {scrollTo:{y: o}});
			}
		}
	});

	/**
	 *	Click on a link in the document
	 *
	 *	@param event MouseEvent
	 **/
	function onLinkClick(event)
	{

		var el = jQuery(event.currentTarget);
		var href = el.attr('href');
		var target = el.attr('target');
		if (target != "_blank")
		{
			event.preventDefault();
			helper.trigger( ApplicationEvent.GO, {href:href});
			return false;
		}
	}

	function onClose(event)
	{
		event.preventDefault();

		this.dispatcher.trigger( SectionEvent.CLOSE );

		return false;
	}

	helper.register( ExtraSection, "app.sections.ExtraSection" );
})(window);