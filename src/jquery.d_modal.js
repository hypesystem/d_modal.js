function default_to(a,val) {
	return typeof a !== 'undefined' ? a : val;
}

(function($) {

	var last_modal_top = 0;
	var modal_id = 0;

	function d_modal_position_x($element, duration) {
		duration = default_to(duration, 0);

        $element.animate({
            'left': ($(window).width() / 2) -
                    ($element.width() / 2) -
                    parseInt($element.css('padding-left'))
        }, duration);
	}

	function d_modal_position_y($element, duration) {
		duration = default_to(duration, 0);

        $element.animate({
            'top': last_modal_top
        }, duration);
		
		last_modal_top += $element.height() +
						  parseInt($element.css('padding-top')) +
						  parseInt($element.css('padding-bottom'));
	}

	function d_activate_modal($element, settings) {
		var settings = default_to(settings,{});
		
		//Get default value overwrite from classes
		if($element.hasClass('d-modal-eternal')) settings.dismissable = false;
		if($element.hasClass('d-modal-blocking')) settings.blocking = true;
		
		//Extend default settings
		//TODO: onDismiss? onCreate? (functions for making entry/exit animations)
		settings = $.extend({
			blocking: false,
			dismissable: true,
            parent: "body"
		},settings);
		
		//Add d-modal class to element
		$element.addClass("d-modal");
		
		//Top most modals should be top-most z-axis, too
		$element.css('z-index', $element.css('z-index') - (++modal_id));

		//Bind modal dismiss listener to remove element and reposition remaining modals
		$element.on("dismiss.d_modal", function() {
			d_fadeOut_remove($element, function() {
				last_modal_top = 0;
				$(".d-modal").each(function() {
					d_modal_position_y($(this), 'fast');
				});
			});
		});
		
		if(settings.dismissable) {
            //Create dismiss button
			$("<div></div>")
				.addClass("dismiss")
				.prependTo($element)
				.click(function() {
					$element.trigger("dismiss.d_modal");
				});
		}
        else {
            //Set modal class: eternal
            $element.addClass("d-modal-eternal");
        }

		//Position the modal x and y
		d_modal_position_y($element);
		d_modal_position_x($element);

		//Optional blocking of screen
		if(settings.blocking) {
            //Set modal class: blocking
            $element.addClass("d-modal-blocking");
			//Create screen block
			var $blackness = $("<div></div>")
								.addClass("d-modal-blackness")
								.appendTo(settings.parent);
			
			//On dismiss modal, remove screen block.
			$element.on("dismiss.d_modal", function() {
				d_fadeOut_remove($blackness);
			});
		}
		
		return $element;
	}

	//Fade out, remove element on completion, call callback if any
	function d_fadeOut_remove($element,callback) {
		$element.fadeOut('fast',function() {
			$element.remove();
			if(typeof callback !== 'undefined') callback();
		});
	}

	//Create a new modal
	function d_make_modal(content, settings) {
        settings = $.extend({
            parent: "body"
        }, settings);
    
		$element = $("<div></div>")
			.html(content)
			.appendTo(settings.parent);
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