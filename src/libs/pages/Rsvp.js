/**
 *	Rsvp page
 *
 *	Interaction for the rsvp page
 *
 *	@author Alexandre Masy
 **/
(function(window)
{
	var AbstractPage = helper.getClass('app.pages.AbstractPage');
	var Rsvp = AbstractPage.extend({
		init: function()
		{
			this._super('#rsvp', 4, '/reservation', 'rsvp');

			this.items = this.view.find('.people .item');
			this.form = this.view.find('form');
			this.waiting = this.view.find('.waiting');
			this.thanks = this.view.find('.thanks');

			this.adult = this.view.find('#adult').on('change', onFieldChange.bind(this));
			this.children = this.view.find('#children').on('change', onFieldChange.bind(this));
			this.view.find("#rsvpform").validate({
				 showErrors: onShowErrors.bind(this)
				,submitHandler: onSubmit.bind(this)
			});

			this.leaves = ['#rsvp_leave1', '#rsvp_leave2', '#rsvp_leave3', '#rsvp_leave4', '#rsvp_leave5', '#rsvp_leave6'];
			this.border = '#rsvp_border';
			this.flower = '#rsvp_flower';
		
			TweenMax.set(this.border, {opacity:0});
			TweenMax.set(this.leaves, {opacity:0});
			TweenMax.set(this.flower, {opacity:0});

			this.setNumberOfPeople(2);
			this.setState('form');
			this.updateLayout();
			
			jQuery('.range').rangeslider({
				polyfill: false
			});
		}

		/**
		 *	Define the number of people
		 *
		 *	@param value Number
		 **/
		,setNumberOfPeople:function (value)
		{
			this.items
					.removeClass('hidden')
					.slice(value, this.items.length)
					.addClass('hidden')
			;
			
			this.items
					.find('input')
					.attr('required', 'required')
					.slice(value*2, this.items.length*2)
					.removeAttr('required');
			;

			this.updateLayout();
		}

		/**
		 *	Update the view
		 **/
		,update: function()
		{
			this._super();
			this.updateLayout();
		}

		/**
		 *	Update the layout
		 *	
		 **/
		,updateLayout: function()
		{
			this._super();
			
			var h = this.form.children().height() + 20;

			console.log('updateLayout', h, this.state);
			if ( this.state == 'form' )
				this.form.css({height: h});
		}

		/**
		 *	Define the state of the view
		 *
		 *	@param value String
		 **/
		, setState: function(value)
		{
			this.state = value;
			
			switch (value)
			{
				case "form":
					break;

				case "waiting":
					this.form.removeAttr('style').removeClass('active');
					this.waiting.removeClass('invisible').addClass('active');

					break;

				case "thanks":
					this.waiting.removeClass('active').addClass('invisible');
					this.thanks.addClass('active').removeClass('invisible');
					break;
			}
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

			// this.border
			// this.leaves
			// this.flower

			this.tl = new TimelineMax()
				.to( this.border, .3, {opacity: 1})
				.staggerTo( this.leaves, .3, {opacity:1}, .1)
				.to( this.flower, .3, {opacity: 1})
			;
		}

		,stop: function()
		{
			this._super();

			if (this.tl)
				this.tl.stop();

			this.tl = new TimelineMax()
				.to( this.flower, .3, {opacity:0})
				.to( this.leaves, .3, {opacity:0})
				.to( this.border, .3, {opacity:0})
		}
	});

	/**
	 *	Field change handler
	 *
	 *	@param event Event
	 **/
	function onFieldChange(event)
	{
		var nAdult = this.adult.val() | 0;
		var nChildren = this.children.val() | 0;

		this.setNumberOfPeople( nAdult + nChildren );
	}

	/**
	 *	Form submit invalid
	 *
	 *	@param event Event
	 *	@param validator Validator
	 **/
	function onShowErrors(errorMap, errorList)
	{
		var n = errorList.length;
		var el;
		while( n-- > 0 )
		{
			el = jQuery(errorList[n].element);
			el.parent().addClass('error');
		}

		console.log('validator', errorList);
	}

	/**
	 *	Form submit
	 **/
	function onSubmit()
	{
		// change the state
		this.setState('waiting');

		// submit the form
		var data = {};
		var el, name;
		this.view.find('input, textarea').each(function(i, e)
		{
			el = jQuery(e);
			name = el.attr('name');

			data[name] = el.val();
		});

		var controller = helper.getClass('app.controllers.ReservationController');	
		controller = new controller();
		controller.send(data).then(function(result)
		{
			console.log('complete', result, this);
			if ( result.status == 200 )
				this.setState('thanks')
			else
				this.setState('form');

		}.bind(this))



		return false;
	}

	helper.register( Rsvp, 'app.pages.Rsvp' );
})(window);