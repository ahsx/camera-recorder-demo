/**
 *	Expression page
 *
 *	Interaction for the expression page
 *
 *	@author Alexandre Masy
 **/
(function(window)
{
	var AbstractPage = helper.getClass('app.pages.AbstractPage');
	var Expression = AbstractPage.extend({
		
		init: function()
		{
			this._super('#expression', 3, '/exprimez-vous', 'expression');

			this.leaves = ['#expression_leave1', '#expression_leave2', '#expression_leave3', '#expression_leave4'];
			this.stem = '#expression_stem';
			this.petals = '#expression_petals';
			this.points = '#expression_points path';
			this.inside = '#expression_inside';
		
			TweenMax.set(this.leaves, {opacity:0});
			TweenMax.set(this.stem, {opacity:0});
			TweenMax.set(this.petals, {opacity:0});
			TweenMax.set(this.points, {opacity:0});
			TweenMax.set(this.inside, {opacity:0});

			this.tl;
		}

		, start: function()
		{
			this._super();

			if (this.tl)
				this.tl.stop();

			this.tl = new TimelineMax()
				.to( this.stem, .3, {opacity: 1})
				.add([
					TweenMax.staggerTo( this.petals, .3, {opacity: 1}, .1),
					TweenMax.staggerTo( this.leaves, .3, {opacity: 1, delay: .1}, .1),
					TweenMax.staggerTo( this.points, .3, {opacity:1}, .1)
				])
				.to( this.inside, .3, {opacity: 1})
			;
		}

		, stop: function()
		{
			this._super();
			
			if ( this.tl )
				this.tl.stop();

			this.tl = new TimelineMax()
				.to( this.inside, .3, {opacity: 0})
				.add([
					TweenMax.to( this.petals, .3, {opacity: 0}, .1),
					TweenMax.to( this.leaves, .3, {opacity: 0, delay: .1}, .1),
					TweenMax.to( this.points, .3, {opacity: 0}, .1)
				])
				.to( this.stem, .3, {opacity: 0})
		}
	});

	helper.register( Expression, 'app.pages.Expression' );
})(window);