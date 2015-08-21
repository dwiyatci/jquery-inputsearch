/**
 * jQuery plugin for automagically transforming `input[type="text"]` elements
 * into `input[type="search"]`-like elements.
 * @author Glenn Dwiyatcita
 * @date 20.08.2015
 * @version 0.2.0
 */

(function ($) {
    $.fn.inputSearch = function (options) {
        var elements          = this,
            searchIconImgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg' +
                                'AAABAAAAAQCAQAAAC1+jfqAAAASklEQVR42mNwZcAPGe' +
                                'itQMn1PxwqYVMAktAHQxALqwJ9V15XDiDWx62AA0hzYF' +
                                'egjt8ESajjcLhBCsn9WH0BEdTBHQ4gackBigsAp89pbW' +
                                'KQMm4AAAAASUVORK5CYII=',
            clearIconImgData  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg' +
                                'AAABAAAAAQCAQAAAC1+jfqAAAAdklEQVR42pWRPQ7AIA' +
                                'iFuVknFk9hwuxZXBwdvCkFa9X607R5Azzel6gICO+C74' +
                                'DBhFyUxA2Aq+Et1wNmilWmATEPSDqtIJ3W2AAugUb0nP' +
                                'QAl5CqnwCbnd0BV2hXR4TlJUMDcPlM7BdFU0zjqg/0Nf' +
                                'Ti/n/WRic9QaXT/imcNgAAAABJRU5ErkJggg==';

        options = $.extend({
            searchIconVisible: true,
            onClear          : $.noop
        }, options);

        var observer = null;
        if (window.MutationObserver) {
            observer = new MutationObserver(function (mutations) {

                mutations.forEach(function (mutation) {
                    $(mutation.target).data()
                        .refreshWrapperVisibility();
                });
            });
        }

        return elements
            .filter('input')
            .each(function () {
                var wrapper = $('<div>')
                        .addClass('jis-input-wrapper')
                        .css({
                            display : 'inline-block',
                            position: 'relative'
                        }),
                    icon    = $('<img>')
                        .attr({
                            src    : searchIconImgData,
                            'class': 'jis-icon-search'
                        })
                        .css({
                            position  : 'absolute',
                            width     : 16,
                            height    : 16,
                            visibility: options.searchIconVisible ?
                                        'visible' : 'hidden'
                        })
                        .on('click', function () {

                            if ($(this).hasClass('jis-icon-clear')) {
                                input
                                    .val('')
                                    .focus()
                                    .triggerHandler('input');

                                options.onClear();
                            }
                        }),
                    input   = $(this)
                        .data({
                            refreshWrapperVisibility: function () {
                                input.parent('.jis-input-wrapper').css({
                                    display   : input.css('display'),
                                    visibility: input.css('visibility'),
                                    opacity   : input.css('opacity')
                                });
                            }
                        })
                        .on('input', function () {
                            var query = $(this).val(),
                                src   = icon.attr('src');

                            if (query.length > 0) {

                                if (src !== clearIconImgData) {
                                    icon
                                        .attr('src', clearIconImgData)
                                        .toggleClass('jis-icon-search', false)
                                        .toggleClass('jis-icon-clear', true)
                                        .css({
                                            cursor    : 'pointer',
                                            visibility: 'visible'
                                        });
                                }
                            } else {

                                if (src !== searchIconImgData) {
                                    icon
                                        .attr('src', searchIconImgData)
                                        .toggleClass('jis-icon-search', true)
                                        .toggleClass('jis-icon-clear', false)
                                        .css({
                                            cursor    : 'auto',
                                            visibility: options.searchIconVisible ?
                                                        'visible' : 'hidden'
                                        });
                                }
                            }
                        })
                        .wrap(wrapper)
                        .after(icon);

                var visible = input.is(':visible');
                input.show();

                var gutter        = 4,
                    paddingRight  = icon.outerWidth() + gutter,
                    width         = parseFloat(input.css('width')),
                    adjustedWidth = width - paddingRight,
                    position      = input.position();

                input.css({
                    width       : adjustedWidth,
                    paddingRight: paddingRight
                });

                icon.css({
                    top : position.top + (gutter / 2),
                    left: position.left + adjustedWidth + gutter
                });

                if (observer) {
                    observer.observe(input[0], {
                        attributeFilter: ['style']
                    });
                } else {
                    setInterval(function () {
                        input.data()
                            .refreshWrapperVisibility();
                    }, 200);
                }

                if (!visible) {
                    input.hide();
                }
                input.triggerHandler('input');
            });
    };
}(jQuery));
