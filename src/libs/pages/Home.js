/**
 *	Home page
 *
 *	Interaction for the home page
 *
 *	@author Alexandre Masy
 **/
(function(window)
{
	var AbstractPage = helper.getClass('app.pages.AbstractPage');
	var Home = AbstractPage.extend({

		/**
		 *	Init the page
		 **/
		init: function()
		{
			this._super('#home', 0, '/', 'home');

			this.illustration = this.view.find('.illustration');
			this.date = this.view.find('#date');
			this.direction = this.view.find('#direction');
			this.view.find('.arrow a').on('click', onArrowClick.bind(this));
		}

		/**
		 *	Update the layout of the view
		 **/
		,updateLayout: function(){}
	});

	function onArrowClick(event)
	{
		event.preventDefault();

		this.next();

		return false;
	}


	helper.register( Home, 'app.pages.Home' );
})(window);