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

function d_activate_modal($element, dismissable, do_lock_screen) {
    //TODO: Make jQuery function, use settings object
    //Default value of do_lock_screen
    do_lock_screen = default_to(do_lock_screen, false);
    dismissable = default_to(dismissable, true);

    //Get default value overwrite from classes
    if($element.hasClass('tt-modal-eternal')) dismissable = false;
    if($element.hasClass('tt-modal-locking')) do_lock_screen = true;

    //Set id
    $element.attr("data-tt-modal-id",++modal_id);
    
    //Top most modals should be top-most z-axis, too
    $element.css('z-index', $element.css('z-index') - modal_id);

    //Dismiss-cross
    if(dismissable) {
        $("<div></div>").addClass("dismiss").prependTo($element)
            .click(function() {
                d_modal_dismiss($element);
            });
    }

    //Positioning
    d_modal_position_y($element);
    d_modal_position_x($element);

    //Optional lock screen
    if(do_lock_screen) {
        var $blackness = $("<div></div>")
                            .addClass("blackness")
                            .appendTo("body");
        d_modal_codismissed($element,$blackness);
    }
}

var codismiss = {};

//TODO: Currently only ONE codismissable is allowed
function d_modal_codismissed($element,$co) {
    codismiss[$element.attr("data-tt-modal-id")] = $co;
}

//TODO: Make this a jQuery event ($element.d_dismiss();), then
// d_modal_codismissed can be rewritten as an event handler:
// $element.d_dismiss(function() { $blackness.remove(); } );
function d_modal_dismiss($element) {
    var element_id = $element.attr("data-tt-modal-id");
    if(element_id in codismiss) {
        d_fadeOut_remove(codismiss[element_id]);
        delete codismiss[element_id];
    }
    d_fadeOut_remove($element, function() {
        //Reposition all modals
        last_modal_top = 0;
        $(".tt-modal").each(function() {
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

function d_make_modal(content, dismissable, lock_screen) {
    $element = $("<div></div>")
        .addClass("tt-modal")
        .html(content)
        .appendTo("body");
    d_activate_modal($element, dismissable, lock_screen);
    return $element;
}

(function($) {

    //Run
    $(document).ready(function() {

        //Activate all modals defined by class
        $(".tt-modal").each(function() {
            d_activate_modal($(this));
        });

        //On window resize, make sure that modals are still centered.
        $(window).resize(function() {
            $(".tt-modal").each(function() {
                d_modal_position_x($(this));
            });
        });

    });

})(jQuery);