/**
 *	Primary navigation
 *
 *	@author Alexandre Masy
 **/
(function(window)
{

	/**
	 *	El constructor
	 **/
	function Primary()
	{
		this.view = jQuery('#primary');

		if ( this.view.length == 0 )
			return;

		this.view
				.on('mouseenter', onViewOver.bind(this))
				.on('mouseleave', onViewOut.bind(this))
		;

		this.win = jQuery(window);
		this.backgrounds = this.view.find('.backgrounds');
		this.animals = this.view.find('.animals');
		this.animalsItem = this.view.find('.animals .item');
		this.links = this.view.find('.navigation a').on('click', onLinkClick.bind(this));
		this.activator = this.view.find('.activator');

		this.currentIndex = 0;
		this.maxIndex = 5;
		this.itemHeight = 0;
		this.theme = 'home';

		this.updateLayout();

		// TweenMax.to( this.view, .3, {left:0, delay: .5});
		TweenMax.set( this.view, {left:0});
	}

	/**
	 *	Prototype
	 **/
	var p = Primary.prototype;

	/**
	 *	Set the current theme
	 *
	 *	@param value String
	 **/
	p.setTheme = function (value)
	{
		this.view.removeClass( this.theme ).addClass( value );
		this.theme = value;
	}

	/**
	 *	Define the progress
	 *
	 *	@param value number
	 **/	
	p.setProgress = function( value )
	{
		this.bgs.scrollTop( value );	
	}

	/**
	 *	Update the view
	 **/
	p.update = function()
	{
		this.updateLayout();
		this.setIndex( this.currentIndex );
	}

	/** 
	 *	Open the navigation
	 **/
	p.open = function()
	{
		if ( Layout.isSmall() )
			return;

		this.view.addClass('opened');
		helper.trigger( NavigationEvent.OPENED );
	}

	/**
	 *	Close the navigation
	 **/
	p.close = function()
	{
		if ( Layout.isSmall() )
			return;
		
		this.view.removeClass('opened');
		helper.trigger( NavigationEvent.CLOSED );
	}

	/**
	 *	Define the current index
	 *
	 *	@param value int
	 *	@param animate Boolean
	 **/
	p.setIndex = function( value, animate )
	{
		value = Math.max( 0, Math.min(this.maxIndex, value));

		var prevIndex = this.currentIndex;
		this.currentIndex = value;

		// links
		this.links.removeClass('active').eq(value).addClass('active');

		// activator
		var o = this.links.eq(value).position();
		var y = o.top + 9;
		TweenMax.to(this.activator, .3, {y: y});

		// backgrounds
		y = this.currentIndex * this.itemHeight; 
		TweenMax.to( this.backgrounds, 1, {scrollTo:{y: y}})
		
		// animals
		var oldone = this.animalsItem.eq(prevIndex)
		var newone = this.animalsItem.eq(this.currentIndex)

		oldone.removeClass('active');
		newone.addClass('active');

		// if ( this.animalTransition )
		// 	this.animalTransition.stop();
		
		// this.animalTransition = new TimelineMax()
		// 	.set( oldone, {className:"-=active"})
		// 	.set( newone, {height: 0, className:"+=active"})

		// 	.to( newone, 1, {height: 100})
		// 	.set( oldone, {height: 0})
		// ;
	}

	/**
	 *	Update the layout
	 **/
	p.updateLayout = function()
	{
		this.itemHeight = this.win.height();

		// // view
		// this.view.css({
		// 	height: this.itemHeight
		// })
	}

	/**
	 *	Mouse over handler
	 *
	 *	@param event MouseEvent
	 **/
	function onViewOver(event)
	{
		event.preventDefault();

		this.open();	

		return false;
	}

	/**
	 *	Mouse out handler
	 *
	 *	@param event MouseEvent
	 **/
	function onViewOut(event)
	{
		event.preventDefault();

		this.close();

		return false;
	}

	/**
	 *	Click on the links
	 *
	 *	@param event MouseEvent
	 **/
	function onLinkClick(event)
	{
		event.preventDefault();

		var el = jQuery(event.currentTarget);
		var href = el.attr('href');

		helper.trigger( ApplicationEvent.GO, {href:href} );

		return false;
	}
	

	
	helper.register( Primary, 'app.navigation.Primary' );
})(window);