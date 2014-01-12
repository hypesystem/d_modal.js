(function($) {

	var last_modal_top = 0;
	var modal_id = 0;

	function default_to(a,val) {
		return typeof a !== 'undefined' ? a : val;
	}

	function d_modal_position_x($element, fluid) {
		fluid = default_to(fluid, false);
		
		if(fluid) {
			$element.animate({
				'left': ($(window).width() / 2) -
						($element.width() / 2) -
						parseInt($element.css('padding-left'))
			}, 'fast');
		}
		else {
			$element.css('left',
				($(window).width() / 2) -
				($element.width() / 2) -
				parseInt($element.css('padding-left')));
		}
	}

	function d_modal_position_y($element, fluid) {
		fluid = default_to(fluid,false);

		if(fluid) {
			$element.animate({
				'top': last_modal_top
			}, 'fast');
		}
		else {
			$element.css('top',last_modal_top+"px");
		}
		last_modal_top = last_modal_top +
						 $element.height() +
						 parseInt($element.css('padding-top')) +
						 parseInt($element.css('padding-bottom'));
	}

	function d_activate_modal($element, settings) {
		var settings = default_to(settings,{});
		//Extend default settings
		settings = $.extend({
			blocking: false,
			dismissable: true
		},settings);

		//Get default value overwrite from classes
		if($element.hasClass('d-modal-eternal')) settings.dismissable = false;
		if($element.hasClass('d-modal-blocking')) settings.blocking = true;
		
		//Make absolutely sure that it has the right class
		$element.addClass("d-modal");
		
		//Top most modals should be top-most z-axis, too
		$element.css('z-index', $element.css('z-index') - modal_id);

		//Bind modal dismiss listener to remove element and reposition remaining modals
		$element.on("dismiss.d_modal", function() {
			d_fadeOut_remove($element, function() {
				last_modal_top = 0;
				$(".d-modal").each(function() {
					d_modal_position_y($(this), true);
				});
			});
		});
		
		//Create dismiss button
		if(settings.dismissable) {
			$("<div></div>").addClass("dismiss").prependTo($element)
				.click(function() {
					$element.trigger("dismiss.d_modal");
				});
		}

		//Positioning
		d_modal_position_y($element);
		d_modal_position_x($element);

		//Optional lock screen
		if(settings.blocking) {
			var $blackness = $("<div></div>")
								.addClass("d-modal-blackness")
								.appendTo("body");
			
			//On dismiss modal, dismiss background, too.
			$element.on("dismiss.d_modal", function() {
				d_fadeOut_remove($blackness);
			});
		}
		
		return $element;
	}

	var codismiss = {};

	//Fade out, remove element on completion
	function d_fadeOut_remove($element,callback) {
		$element.fadeOut('fast',function() {
			$element.remove();
			if(typeof callback !== 'undefined') callback();
		});
	}

	//Create a new modal
	function d_make_modal(content, settings) {
		$element = $("<div></div>")
			.addClass("d-modal")
			.html(content)
			.appendTo("body");
		return d_activate_modal($element, settings);
	}
	
	//Extend jQuery prototype
	$.d_modal = d_make_modal;
	$.fn.d_modal = function(options) { return d_activate_modal(this,options) };

    //Run
    $(document).ready(function() {

        //Activate all modals defined by class
        $(".d-modal").each(function() {
            d_activate_modal($(this));
        });

        //On window resize, make sure that modals are still centered.
        $(window).resize(function() {
            $(".d-modal").each(function() {
                d_modal_position_x($(this));
            });
        });

    });

})(jQuery);