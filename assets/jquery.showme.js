(function($) {
        //Define jQuery function:
        $.fn.showme = function() {
                var $content = $(this);
        
                //Create activator
                $('<div class="showme-activator">Show me</div>')
                        .insertAfter($(this))
                        .click(function() {
                                 eval($content.text());
                        });
        }

        //On page load
        $(document).ready(function() {
        
                //Automatically activate on all items with "showme" class.
                $(".showme").each(function() {
                        $(this).showme();
                });
        });
})(jQuery);