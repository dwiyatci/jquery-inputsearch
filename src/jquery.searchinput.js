/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function ($) {
    
    $.fn.searchInput = function () {
        var ICON_WIDTH = 16;
        var ICON_HEIGHT = 16;
        var ICON_PADDING = 1;
        
        var prepareIconHolder = function (inputEl) {
            var paddingTop = parseInt(inputEl.css('padding-top'));
            var paddingRight = parseInt(inputEl.css('padding-right'));
            var paddingBottom = parseInt(inputEl.css('padding-bottom'));
            
            // Make additional padding on the element as the "holder" of the icon.
            inputEl.css('padding-top', paddingTop + ICON_PADDING);
            inputEl.css('padding-right', paddingRight + ICON_WIDTH + 2 * ICON_PADDING);
            inputEl.css('padding-bottom', paddingBottom + ICON_PADDING);
        };
        
        var computeIconOffset = function (inputEl, iconEl) {
            // Compute the top offset of the icon.
            var inputBorderTop = parseInt(inputEl.css('border-top-width'));
            var inputPaddingTop = parseInt(inputEl.css('padding-top'));
            var iconOffsetY = (inputEl.height() - ICON_HEIGHT) / 2;
            var inputOffsetTop = inputEl.offset().top;
            var iconOffsetTop = inputOffsetTop + inputBorderTop + inputPaddingTop + iconOffsetY;
            iconEl.css('top', iconOffsetTop);
            
            // Compute the left offset of the icon.
            var inputBorderLeft = parseInt(inputEl.css('border-left-width'));
            var inputPaddingLeft = parseInt(inputEl.css('padding-left'));
            var iconOffsetX = inputEl.width() + ICON_PADDING;
            var inputOffsetLeft = inputEl.offset().left;
            var iconOffsetLeft = inputOffsetLeft + inputBorderLeft + inputPaddingLeft + iconOffsetX;
            iconEl.css('left', iconOffsetLeft);
        };
        
        var toggleSearchIcon = function (iconEl, isSearchIcon) {
            iconEl.toggleClass('searchinput-icon-search', isSearchIcon)
                  .toggleClass('searchinput-icon-clear', !isSearchIcon);
        };
        
        var inputHandler = function (inputEl, iconEl) {
            if (inputEl.val().length > 0) {
                toggleSearchIcon(iconEl, false);
            } else {
                toggleSearchIcon(iconEl, true);
            }
        };
        
        var iconClickHandler = function (inputEl, iconEl) {
            if (iconEl.hasClass('searchinput-icon-clear')) {
                inputEl.val('').focus();
                toggleSearchIcon(iconEl, true);
            }
        };
        
        var resizeHandler = function (inputEl, iconEl) {
            computeIconOffset(inputEl, iconEl);
        };
        
        return this.filter('input').each(function() {
            var inputEl = $(this);
            var iconEl = $('<a/>').addClass('searchinput-icon-search')
                                  .addClass('searchinput-icon-clear')
                                  .toggleClass('searchinput-icon-clear', false);
            
            prepareIconHolder(inputEl);
            computeIconOffset(inputEl, iconEl);
            inputEl.after(iconEl);
            
            inputEl.on('input', function () {
                inputHandler($(this), iconEl);
            });
            
            iconEl.on('click', function () {
                iconClickHandler(inputEl, $(this));
            });
            
            $(window).on('resize', function () {
                resizeHandler(inputEl, iconEl);
            });
        });
    };
    
}(jQuery));
