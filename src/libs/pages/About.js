/**
 *	About page
 *
 *	Interaction for the about page
 *
 *	@author Alexandre Masy
 **/
(function(window)
{
	var AbstractPage = helper.getClass('app.pages.AbstractPage');
	var About = AbstractPage.extend({
		
		/** 
		 *	Init the page
		 **/
		init: function()
		{
			this._super('#about', 1, '/a-propos', 'about');

			this.leaves = ['#leave1', '#leave2', '#leave3', '#leave4'];
			this.stem = '#stem';
			this.petals = ['#petal1', '#petal2', '#petal3', '#petal4', '#petal5', '#petal6'];
		
			TweenMax.set(this.leaves, {opacity:0});
			TweenMax.set(this.stem, {opacity:0});
			TweenMax.set(this.petals, {opacity:0});

			this.tl;
		}

		/**
		 *	Start animation
		 *
		 **/
		,start: function()
		{
			this._super();

			if (this.tl)
				this.tl.stop();
			this.tl = new TimelineMax()
				.to( this.stem, .3, {opacity: 1})
				.add([
					TweenMax.staggerTo( this.petals, .3, {opacity: 1}, .1),
					TweenMax.staggerTo( this.leaves, .3, {opacity: 1, delay: .1}, .1)
				])
			;
		}

		,stop: function()
		{
			this._super();

			this.second.view.scrollTop(0);

			if (this.tl)
				this.tl.stop();
			this.tl = new TimelineMax()
				.to( this.petals, .3, {opacity:0})
				.to( this.leaves, .3, {opacity:0})
				.to( this.stem, .3, {opacity:0})
		}


	});

	helper.register( About, 'app.pages.About' );
})(window);