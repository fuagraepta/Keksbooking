'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template')
  .content.querySelector('.map__pin');
  var PIN_TAIL = 40;

  // Разметка метки объявления
  window.getPin = function (offerMark) {
    var pin = mapPinTemplate.cloneNode(true);
    pin.classList.add('hidden');
    pin.style = 'left:' + offerMark.location.x + 'px;' + 'top:' +
    (offerMark.location.y - PIN_TAIL) + 'px';
    pin.firstElementChild.src = offerMark.author.avatar;
    pin.firstElementChild.alt = offerMark.offer.title;
    return pin;
  };
})();
