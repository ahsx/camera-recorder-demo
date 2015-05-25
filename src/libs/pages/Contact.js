/**
 *	Contact page
 *
 *	Interaction for the contact page
 *
 *	@author Alexandre Masy
 **/
(function(window)
{
	var AbstractPage = helper.getClass('app.pages.AbstractPage');
	var Contact = AbstractPage.extend({
		init: function()
		{
			this._super('#contact', 5, '/contact', 'contact');

			this.leaves = ['#contact_leave1', '#contact_leave2', '#contact_leave3', '#contact_leave4'];
			this.stem = '#contact_stem';
			this.petals = ['#contact_petal1', '#contact_petal2', '#contact_petal3', '#contact_petal4', '#contact_petal5'];
			this.tl;

			TweenMax.set(this.leaves, {opacity:0});
			TweenMax.set(this.stem, {opacity:0});
			TweenMax.set(this.petals, {opacity:0});
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

	helper.register( Contact, 'app.pages.Contact' );
})(window);