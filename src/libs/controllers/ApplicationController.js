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
	function ApplicationController()
	{
		this.win = jQuery(window);
		this.display = jQuery('#display');
		this.navigation = new (helper.getClass('app.navigation.Primary'));

		// pages
		this.pages = [
			  this.home = new (helper.getClass('app.pages.Home'))
			, this.about = new (helper.getClass('app.pages.About'))
			, this.timing = new (helper.getClass('app.pages.Timing'))
			, this.expression = new (helper.getClass('app.pages.Expression'))
			, this.rsvp = new (helper.getClass('app.pages.Rsvp'))
			, this.contact = new (helper.getClass('app.pages.Contact'))
		];		

		// go
		this.currentIndex = -1;
		this.maxIndex = this.pages.length;
		this.vh = this.win.height();
		this.scrollTimer;
		this.replacing = true;

		this.start();
		var i = this.getIndexForURL( document.location.pathname );

		this.setPageByIndex( i );
		setTimeout(	this.scrollToPage.bind(this, this.pages[i], true ), 500 );

		// setTimeout( this.start.bind(this), 300 );
	}

	/**
	 *	Prototype
	 **/
	var p = ApplicationController.prototype;

	p.start = function()
	{
		// events
		helper.on( ApplicationEvent.GO, onGoHandler.bind(this) );
		helper.on( ApplicationEvent.NEXT, onNext.bind(this) );
		helper.on( ApplicationEvent.PREVIOUS, onPrevious.bind(this) );
		helper.on( NavigationEvent.OPENED, onOpenedHandler.bind(this) );
		helper.on( NavigationEvent.CLOSED, onClosedHandler.bind(this) );
		this.win.on('scroll', onScroll.bind(this));
		this.win.on('popstate', onPopState.bind(this));
	}

	/**
	 *	Go to a specified page
	 *
	 *	@param index int
	 *	@param move Boolean
	 **/
	p.setPageByIndex = function ( index, move )
	{
		if ( isNaN(index))
		{
			return;
		}

		index = Math.max( 0, Math.min(this.maxIndex, index));
		var direction = index > this.currentIndex ? 'up' : 'down';

		if ( index  == this.currentIndex )
			return;

		console.log('setPageByIndex', index, direction);

		var oldpage = this.currentPage;
		if ( oldpage )
			oldpage.stop();

		this.currentIndex = index;
		this.currentPage = this.pages[index];
		this.currentPage.start();

		// navigation
		this.navigation.setIndex( this.currentIndex );
		this.navigation.setTheme( this.currentPage.theme );

		// history
		history.pushState({index: this.currentIndex}, "", this.currentPage.url);
	}

	/**
	 *	Scroll to the given page (scrollMin)
	 *
	 *	@param page Page
	 *	@param transition Boolean
	 *	@return Q
	 **/
	p.scrollToPage = function( page, transition )
	{
		var y = page.scrollMin();
		return this.scrollTo( y, transition );
	}

	/**
	 *	Scroll to the given position
	 *
	 *	@param y int
	 *	@param transition Boolean
	 *	@return Q
	 **/
	p.scrollTo = function( y, transition )
	{
		var ret = Q.defer();
		var params = {scrollTo:{y:y}, onComplete:function(){console.log('scrollto complete');ret.resolve()}};

		if ( transition )
			TweenMax.to( this.win, .3, params );
		else
			TweenMax.set( this.win, params );

		return ret.promise;
	}

	/**
	 *	Return the closest page position
	 *
	 *	@return int
	 **/
	p.getClosestPagePosition = function()
	{
		var y;
		var hp = (this.vh - (this.home.scrollMin()- this.sct)) / this.vh;
		var ap = (this.vh - (this.about.scrollMin()- this.sct)) / this.vh;
		var tp = (this.vh - (this.timing.scrollMin()- this.sct)) / this.vh;
		var ep = (this.vh - (this.expression.scrollMin()- this.sct)) / this.vh;
		var rp = (this.vh - (this.rsvp.scrollMin()- this.sct)) / this.vh;
		var cp = (this.vh - (this.contact.scrollMin()- this.sct)) / this.vh;

		var min = .45;
		var max = 1;


		// are we in a new page ?
		if ( cp < max && cp > min )
		{
			y = this.contact.scrollMin();
		}
		else if ( rp < max && rp > min )
		{
			y = this.rsvp.scrollMin();
		}
		else if ( ep < max && ep > min )
		{
			y = this.expression.scrollMin();
		}
		else if ( tp < max && tp > min )
		{
			y = this.timing.scrollMin();
		}
		else if ( ap < max && ap > min )
		{
			y = this.about.scrollMin();
		}
		else if ( hp < max && hp > min )
		{
			y = 0;
		}

		// we are not if y is not defined
		// are we beyond the end of the current page 
		if ( y == undefined && this.currentPage && this.currentPage.scrollMax() - this.vh < this.sct )
		{
			y = this.currentPage.scrollMax() - this.vh;
		}

		// if ( y == undefined )
		// {
		// 	y = this.currentPage.scrollMin();
		// }

		return y;
	}

	/**
	 *	Get the index of the given url
	 *
	 *	@param url String
	 **/
	p.getIndexForURL = function (url)
	{
		var n = this.pages.length;
		var r = 0;
		while( n-- )
		{	
			if ( this.pages[n].url == url )
			{
				r = n;
				break;
			}
		}

		return r;
	}

	/**
	 *	Go to the next page
	 **/
	p.next = function()
	{
		this.setPageByIndex( this.currentIndex+1 );
		this.scrollToPage( this.currentPage, true );
	}

	/**
	 *	Go to the previous page
	 **/
	p.previous = function()
	{
		this.setPageByIndex( this.currentIndex-1 );
		this.scrollToPage( this.currentPage, true );
	}	

	/**
	 *	Update the views (e.g. due to a resize)
	 **/
	p.update = function()
	{
		this.vh = this.win.height();

		var n = this.pages.length-1;
		while( n-->0 )
		{
			this.pages[n].update();
		}

		this.navigation.update();

		// update scroll
		var y = this.currentPage.scrollMin();
		TweenMax.set( this.win, {scrollTo:{y:y}});
	}

	/**
	 *	Update the index based on the scroll position
	 **/
	p.updateBaseOnScroll = function()
	{
		this.sct = this.win.scrollTop();
		var index = this.currentIndex;

		if ( this.sct < this.about.scrollMin() )
			index = 0;

		if ( this.sct >= this.about.scrollMin() && this.sct < this.about.scrollMax() )
			index = 1;

		if ( this.sct >= this.timing.scrollMin() && this.sct < this.timing.scrollMax() )
			index = 2;

		if ( this.sct >= this.expression.scrollMin() && this.sct < this.expression.scrollMax() )
			index = 3;
		
		if ( this.sct >= this.rsvp.scrollMin() && this.sct < this.rsvp.scrollMax() )
			index = 4;
		
		if ( this.sct >= this.rsvp.scrollMax() )
			index = 5;

		if ( index != this.currentIndex )
			this.setPageByIndex( index );

		var l = Layout.getName();
		if ( !this.replacing )
		{
			if ( l != Layout.MD || l != Layout.LG )
				return;

			if ( this.scrollTimer )
				clearTimeout( this.scrollTimer );
			this.scrollTimer = setTimeout( this.replaceScroll.bind(this), 200 );
		}
	}

	/**
	 *	Replace the view to the specified page
	 *
	 *	@param page Page
	 **/
	p.replace = function( page )
	{
		this.setPageByIndex( page.index );
		this.replacing = true;
			
		this.scrollToPage(this.currentPage, true)
		.then(function()
		{
			this.replacing = false;
		}.bind(this));
	}

	/**
	 *	Replace the view based on the scroll position
	 *	Go to the closest index
	 **/
	p.replaceScroll = function()
	{

		var y = this.getClosestPagePosition();

		if ( y != undefined )
		{
			this.replacing = true;
			
			this.scrollTo(this.getClosestPagePosition(), true)
			.then(function()
			{
				this.replacing = false;
			}.bind(this));
		}
		
	}


	/**
	 *	On go handler
	 *
	 *	@param event Event
	 **/
	function onGoHandler(event, params)
	{
		var href = params.href;
		var i = this.getIndexForURL( href );

		this.setPageByIndex( i );
		this.scrollToPage( this.currentPage, true );
	}

	/**
	 *	Previous event handler
	 *		
	 *	@param event ApplicationEvent
	 **/
	function onPrevious(event)
	{
		this.previous();
	}

	/**
	 *	Next event handler
	 *
	 *	@param event ApplicationEvent
	 **/
	function onNext(event)
	{
		this.next();
	}

	/**
	 *	On navigation opened handler
	 *
	 *	@param event NavigationEvent
	 **/
	function onOpenedHandler(event)
	{
		this.display.addClass('opened');
	}

	/**
	 *	On navigation closed handler
	 *
	 *	@param event NavigationEvent
	 **/
	function onClosedHandler(event)
	{
		this.display.removeClass('opened');
	}

	/**
	 *	Scroll handler
	 *
	 *	@param event Event
	 **/
	function onScroll(event)
	{
		this.updateBaseOnScroll();
	}

	/**
	 *	On pop state event
	 *
	 *	@param event
	 **/
	function onPopState(event)
	{
		var e = event.originalEvent;
		var index = e.state.index || 0;

		if ( index == this.currentIndex )
			return;

		this.replace( this.pages[index] );
	}

	/** 
	 *	Function to be called on the initialisation
	 **/
	function Init()
	{
		var app = window.app = new ApplicationController();
		helper.addResize( app.update.bind(app) ); 
	}

	helper.addInit( Init );
})(window);