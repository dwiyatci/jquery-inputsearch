/**
 * Created by Glenn on 06/20/13.
 */

(function ($) {

    $.fn.searchInput = function (options) {
        var defaults = {
            clearSearch: null
        };

        var settings = $.extend({}, defaults, options);

        var ICON_WIDTH = 16
            , ICON_HEIGHT = 16
            , ICON_PADDING = 1;

        var prepareIconHolder = function (inputEl) {
            var paddingTop = parseInt(inputEl.css('padding-top'))
                , paddingRight = parseInt(inputEl.css('padding-right'))
                , paddingBottom = parseInt(inputEl.css('padding-bottom'));

            // Make additional padding on the element as the "holder" of the icon.
            inputEl.css('padding-top', paddingTop + ICON_PADDING);
            inputEl.css('padding-right', paddingRight + ICON_WIDTH + 2 * ICON_PADDING);
            inputEl.css('padding-bottom', paddingBottom + ICON_PADDING);
        };

        var computeIconOffset = function (inputEl, iconEl) {
            // Compute the top offset of the icon.
            var inputBorderTop = parseInt(inputEl.css('border-top-width'))
                , inputPaddingTop = parseInt(inputEl.css('padding-top'))
                , iconOffsetY = (inputEl.height() - ICON_HEIGHT) / 2
                , inputOffsetTop = inputEl.offset().top
                , iconOffsetTop = inputOffsetTop + inputBorderTop + inputPaddingTop + iconOffsetY;
            iconEl.css('top', iconOffsetTop);

            // Compute the left offset of the icon.
            var inputBorderLeft = parseInt(inputEl.css('border-left-width'))
                , inputPaddingLeft = parseInt(inputEl.css('padding-left'))
                , iconOffsetX = inputEl.width() + ICON_PADDING
                , inputOffsetLeft = inputEl.offset().left
                , iconOffsetLeft = inputOffsetLeft + inputBorderLeft + inputPaddingLeft + iconOffsetX;
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

                if (typeof settings.clearSearch == 'function') {
                    settings.clearSearch.call(this);
                }
            }
        };

        var resizeHandler = function (inputEl, iconEl) {
            computeIconOffset(inputEl, iconEl);
        };

        return this.filter('input').each(function () {
            var inputEl = $(this);
            var iconEl = $('<i>').addClass('searchinput-icon-search')
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

            /*
             * Observer for watching display property change on the input element.
             */
            // Create an observer instance.
            var observer = new MutationObserver(function () {
                // Somehow the _if_ line is necessary to prevent infinite recursion,
                // i.e. this callback function being triggered when the input element
                // not visible AND inputEl.height() or inputEl.width() is called.
                if (inputEl.is(':visible')) {
                    computeIconOffset(inputEl, iconEl);
                }

                iconEl.css('display', inputEl.css('display'));
                iconEl.css('visibility', inputEl.css('visibility'));
                iconEl.css('opacity', inputEl.css('opacity'));
            });

            // Configuration of the observer:
            var config = { attributes: true, attributeOldValue: true, attributeFilter: ['style'] };

            // Pass in the target node, as well as the observer options.
            observer.observe(inputEl[0], config);
        });
    };

}(jQuery));
