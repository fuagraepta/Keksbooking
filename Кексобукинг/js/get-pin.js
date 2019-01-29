'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template')
  .content.querySelector('.map__pin');

  // Разметка метки объявления
  window.getPin = function (offerMark) {
    var pin = mapPinTemplate.cloneNode(true);
    pin.classList.add('hidden');
    pin.style = 'left:' + offerMark.location.x + 'px;' + 'top:' +
    offerMark.location.y + 'px';
    pin.firstElementChild.src = offerMark.author.avatar;
    pin.firstElementChild.alt = offerMark.offer.title;
    return pin;
  };
})();
