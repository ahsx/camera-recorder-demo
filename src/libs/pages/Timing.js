/**
 *	Timing page
 *
 *	Interaction for the timing page
 *
 *	@author Alexandre Masy
 **/
(function(window)
{
	var AbstractPage = helper.getClass('app.pages.AbstractPage');
	var Timing = AbstractPage.extend({
		
		/** 
		 *	Init the class
		 **/
		init: function()
		{
			this._super('#timing', 2, '/deroulement', 'timing');

			this.stem = '#timing_stem';
			this.leaves = ['#timing_leave1', '#timing_leave2', '#timing_leave3', '#timing_leave4'];
			this.petals = ['#timing_petal'];
			this.center = '#timing_center';
			this.points = '#timing_points path';
			this.tl;

			TweenMax.set(this.stem, {opacity: 0});
			TweenMax.set(this.center, {opacity: 0});
			TweenMax.set(this.petals, {opacity: 0});
			TweenMax.set(this.points, {opacity: 0});
			TweenMax.set(this.leaves, {opacity: 0});
		}

		/**
		 *	Start the animation
		 **/
		, start: function()
		{
			this._super();

			if ( this.tl )
				this.tl.stop();

			this.tl = new TimelineMax()
				.to( this.stem, .3, {opacity:1} )
				.to( this.center, .3, {opacity:1} )
				.to( this.petals, .3, {opacity:1} )
				.to( this.points, .3, {opacity:1} )
				.to( this.leaves, .3, {opacity:1} )
			;
		}

		/**
		 *	Stop the mousewheel tracking
		 **/
		, stop: function()
		{
			this._super();
			this.second.view.scrollTop(0);

			if ( this.tl )
				this.tl.stop();

			this.tl = new TimelineMax()
				.to( this.stem, .3, {opacity:0} )
				.to( this.center, .3, {opacity:0} )
				.to( this.petals, .3, {opacity:0} )
				.to( this.points, .3, {opacity:0} )
				.to( this.leaves, .3, {opacity:0} )
			;
		}
	});	

	helper.register( Timing, 'app.pages.Timing' );
})(window);