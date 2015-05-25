(function(window)
{
	/**
	 *	AbstractPage
	 **/
	var AbstractPage = Class.extend({

		/**
		 *	Init the class
		 *	
		 *	@param selector String
		 *	@param index int
		 *	@param url String
	 	 *	@param theme String
		 **/
		init: function( selector, index, url, theme )
		{
			this.win = jQuery(window);
			this.view = jQuery(selector);
			this.index = index;
			this.url = url;
			this.theme = theme;
			this.content = this.view.find('.article-content');
			this.controls = this.view.find('.section-controls');
			this.view.find('.section-controls a').on('click', onControlsClick.bind(this))
			this.background = jQuery('#primary .backgrounds .'+theme);

			this.setupSection();
			setTimeout( this.updateLayout.bind(this), 300 );
		}

		/**	
		 *	Setup the sections
		 **/
		,setupSection: function()
		{
			var ColoredSection = helper.getClass('app.sections.ColoredSection');
			var ContentSection = helper.getClass('app.sections.ContentSection');
			var ListSection = helper.getClass('app.sections.ListSection');
			var FormSection = helper.getClass('app.sections.FormSection');
			var ExtraSection = helper.getClass('app.sections.ExtraSection');

			// first
			var view = this.view.find('.first');
			if ( view.length > 0 )
			{
				if ( view.hasClass('section-colored') )
					this.first = new ColoredSection(view);
				else if( view.hasClass('section-content') )
					this.first = new ContentSection(view); 
				else if( view.hasClass('section-list') )
					this.first = new ListSection(view); 
				else if( view.hasClass('section-form') )
					this.first = new FormSection(view);
				else if( view.hasClass('section-extra') )
					this.first = new ExtraSection(view);
			}

			// second
			view = this.view.find('.second');
			if ( view.length > 0 )
			{
				if ( view.hasClass('section-colored') )
					this.second = new ColoredSection(view);
				else if( view.hasClass('section-content') )
					this.second = new ContentSection(view); 
				else if( view.hasClass('section-list') )
					this.second = new ListSection(view); 
				else if( view.hasClass('section-form') )
					this.second = new FormSection(view);
				else if( view.hasClass('section-extra') )
					this.second = new ExtraSection(view);

				this.second.dispatcher.on( SectionEvent.OPEN, onSectionOpen.bind(this) )
			}

			// third
			view = this.view.find('.third');
			if ( view.length > 0 )
			{
				if ( view.hasClass('section-colored') )
					this.third = new ColoredSection(view);
				else if( view.hasClass('section-content') )
					this.third = new ContentSection(view); 
				else if( view.hasClass('section-list') )
					this.third = new ListSection(view); 
				else if( view.hasClass('section-form') )
					this.third = new FormSection(view);	
				else if( view.hasClass('section-extra') )
					this.third = new ExtraSection(view);	

				this.third.dispatcher.on( SectionEvent.CLOSE, onSectionClose.bind(this) )
			}
		}

		/**
		 *	Return the height of the view
		 *
		 *	@return Number
		 **/
		,height: function()
		{
			return this.viewHeight;
		}

		/**
		 *	Return the scroll min position
		 *	
		 *	@return Number
		 **/
		,scrollMin: function()
		{
			return this.view.offset().top;
		}

		/**
		 *	Return the scroll max position
		 *
		 *	@return Number
		 **/
		,scrollMax: function()
		{
			return this.height() + this.scrollMin();
		}

		/**
		 *	Start the wheel tracking
		 **/
		,start: function()
		{
			this.view.addClass('active');
		}

		/**
		 *	Stop the wheel tracking
		 **/
		,stop: function()
		{
			this.close();
			this.view.removeClass('active');
		}

		/**
		 *	Request the next page
		 **/
		,next: function()
		{
			helper.trigger(ApplicationEvent.NEXT);
			this.stop();
		}

		/**
		 *	Request the previous page
		 **/
		,previous: function()
		{
			helper.trigger(ApplicationEvent.PREVIOUS);
			this.stop();
		}

		/**
		 *	Open the sections
		 *	
		 *	@param url String
		 **/
		,open : function( url )
		{
			// request the page activation
			if (!this.view.hasClass('active'))
				helper.trigger( ApplicationEvent.GO, {href: this.url});

			// open the sections
			if (this.first)
				this.first.open();

			if (this.second)
				this.second.open();

			if (this.third)
				this.third.open(url);

			// activate the controls
			this.controls.addClass('active');
			this.updateLayout();
		}

		/**
		 *	Close the sections
		 **/
		,close: function()
		{
			if ( this.first )
				this.first.close();

			if ( this.second ) 
				this.second.close(); 

			if ( this.third )
				this.third.close(); 

			this.controls.removeClass('active');
			this.updateLayout();
		}

		/**
		 *	Update the section
		 **/
		,update: function()
		{
			if ( this.first )
				this.first.update();

			if ( this.second ) 
				this.second.update(); 

			if ( this.third )
				this.third.update(); 	
		}

		/**
		 *	Update the layout
		 **/
		,updateLayout: function()
		{
			var h = this.win.height();

			if ( this.first )
				h = Math.max( h, this.first.height() )

			if ( this.second ) 
				h = Math.max( h, this.second.height() );

			if ( this.third )
				h = Math.max( h, this.third.height() );

			if ( Layout.isSmall() )
				h = this.view.outerHeight();
			
			this.viewHeight = h;
			if ( Layout.isSmall() )
			{
				this.view.removeAttr('style');
			}
			else
			{
				this.view.css({height: h});
			}

			this.background.css({height: h});
		}
	});

	/**
	 *	Request the opening of a section handler
	 *	
	 *	@param event SectionEvent
	 *	@param params Object
	 **/
	function onSectionOpen( event, params )
	{
		this.open( params.url );
	}

	/**
	 *	Request the close of a section handler
	 *	
	 *	@param event SectionEvent
	 **/
	function onSectionClose( event )
	{
		this.close();
	}

	/**
	 *	Controls click 
	 *
	 *	@param event MouseEvent
	 **/
	function onControlsClick(event)
	{
		event.preventDefault();

		this.close();
		
		return false;
	}

	helper.register( AbstractPage, 'app.pages.AbstractPage' );
})(window);