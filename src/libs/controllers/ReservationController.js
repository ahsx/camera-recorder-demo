(function(window)
{

	function ReservationController()
	{

	}

	var p = ReservationController.prototype;

	/**
	 *	
	 *
	 **/
	p.send = function( data )
	{
		return Q(
			jQuery.ajax({
				url:'/reservation',
				method: 'post',
				data: data
			})
		);
	}


	helper.register(ReservationController, 'app.controllers.ReservationController');
})(window);