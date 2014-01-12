(function($) {

	var last_modal_top = 0;
	var modal_id = 0;
	var default_settings = {
		blocking: false,
		dismissable: true
	}

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
		//Extend default settings
		$.extend(settings, default_settings);

		//Get default value overwrite from classes
		if($element.hasClass('d-modal-eternal')) settings.dismissable = false;
		if($element.hasClass('d-modal-blocking')) settings.blocking = true;

		//Set id
		$element.attr("data-d-modal-id",++modal_id);
		
		//Top most modals should be top-most z-axis, too
		$element.css('z-index', $element.css('z-index') - modal_id);

		//Dismiss-cross
		if(settings.dismissable) {
			$("<div></div>").addClass("dismiss").prependTo($element)
				.click(function() {
					d_modal_dismiss($element);
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
			d_modal_codismissed($element,$blackness);
		}
	}

	var codismiss = {};

	//TODO: Currently only ONE codismissable is allowed
	function d_modal_codismissed($element,$co) {
		codismiss[$element.attr("data-d-modal-id")] = $co;
	}

	//TODO: Make this a jQuery event ($element.d_dismiss();), then
	// d_modal_codismissed can be rewritten as an event handler:
	// $element.d_dismiss(function() { $blackness.remove(); } );
	function d_modal_dismiss($element) {
		var element_id = $element.attr("data-d-modal-id");
		if(element_id in codismiss) {
			d_fadeOut_remove(codismiss[element_id]);
			delete codismiss[element_id];
		}
		d_fadeOut_remove($element, function() {
			//Reposition all modals
			last_modal_top = 0;
			$(".d-modal").each(function() {
				d_modal_position_y($(this), true);
			});
		});

	}

	function d_fadeOut_remove($element,callback) {
		$element.fadeOut('fast',function() {
			$element.remove();
			callback();
		});
	}

	function d_make_modal(content, settings) {
		$element = $("<div></div>")
			.addClass("d-modal")
			.html(content)
			.appendTo("body");
		d_activate_modal($element, settings);
		return $element;
	}
	
	//Extend jQuery prototype
	$.d_modal = d_make_modal;

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