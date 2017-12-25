/**
 * jQuery plugin for automagically transforming `input[type="text"]` elements
 * into `input[type="search"]`-like elements.
 * @author Glenn Dwiyatcita
 * @date 25.12.2017
 * @version 1.0.0
 */
(function iife($) {
  $.fn.inputSearch = function inputSearch(options) {
    const searchIconImgData = `
      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAASkl
      EQVR42mNwZcAPGeitQMn1PxwqYVMAktAHQxALqwJ9V15XDiDWx62AA0hzYFegjt8ESajjcLhB
      Csn9WH0BEdTBHQ4gackBigsAp89pbWKQMm4AAAAASUVORK5CYII=
    `;

    const clearIconImgData = `
      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAdkl
      EQVR42pWRPQ7AIAiFuVknFk9hwuxZXBwdvCkFa9X607R5Azzel6gICO+C74DBhFyUxA2Aq+Et
      1wNmilWmATEPSDqtIJ3W2AAugUb0nPQAl5CqnwCbnd0BV2hXR4TlJUMDcPlM7BdFU0zjqg/0N
      fTi/n/WRic9QaXT/imcNgAAAABJRU5ErkJggg==
    `;

    const opts = { ...$.fn.inputSearch.defaults, ...options };

    let observer;
    if (window.MutationObserver) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          $(mutation.target).data().refreshWrapperVisibility();
        });
      });
    }

    return this
      .filter('input')
      .each((i, el) => {
        const wrapper = $('<div>')
          .addClass('jqis-input-wrapper')
          .css({
            display: 'inline-block',
            position: 'relative',
          });

        const icon = $('<img>')
          .addClass('jqis-icon-search')
          .attr({
            src: searchIconImgData,
          })
          .css({
            position: 'absolute',
            width: 16,
            height: 16,
            visibility: opts.searchIconVisible ? 'visible' : 'hidden',
          })
          .on('click', (e) => {
            if ($(e.currentTarget).hasClass('jqis-icon-clear')) {
              input
                .val('')
                .focus()
                .triggerHandler('input');

              opts.onClear();
            }
          });

        const input = $(el)
          .data({
            refreshWrapperVisibility() {
              input
                .parent('.jqis-input-wrapper')
                .css({
                  display: input.css('display'),
                  visibility: input.css('visibility'),
                  opacity: input.css('opacity'),
                });
            },
          })
          .on('input', (e) => {
            const query = $(e.currentTarget).val();
            const src = icon.attr('src');

            if (query.length > 0) {
              if (src !== clearIconImgData) {
                icon
                  .attr('src', clearIconImgData)
                  .toggleClass('jqis-icon-search', false)
                  .toggleClass('jqis-icon-clear', true)
                  .css({
                    cursor: 'pointer',
                    visibility: 'visible',
                  });
              }
            } else if (src !== searchIconImgData) {
              icon
                .attr('src', searchIconImgData)
                .toggleClass('jqis-icon-search', true)
                .toggleClass('jqis-icon-clear', false)
                .css({
                  cursor: 'auto',
                  visibility: opts.searchIconVisible ? 'visible' : 'hidden',
                });
            }
          })
          .wrap(wrapper)
          .after(icon)
          .show();

        const gutter = 4;
        const paddingRight = icon.outerWidth() + gutter;
        const width = parseFloat(input.css('width')) - paddingRight;
        const { top, left } = input.position();

        input.css({
          paddingRight,
          width,
        });

        icon.css({
          top: top + (gutter / 2),
          left: left + width + gutter,
        });

        if (observer) {
          observer.observe(input[0], {
            attributeFilter: ['style'],
          });
        } else {
          setInterval(() => input.data().refreshWrapperVisibility(), 200);
        }

        if (!input.is(':visible')) {
          input.hide();
        }

        input.triggerHandler('input');
      });
  };

  $.fn.inputSearch.defaults = {
    searchIconVisible: true,
    onClear: $.noop,
  };
}(jQuery));
