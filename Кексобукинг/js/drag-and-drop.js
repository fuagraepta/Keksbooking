'use strict';

(function () {

  // Drag and drop основной метки объявления
  window.map.mapPinMain.addEventListener('mousedown', function (evt) {

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (window.map.mapPinMain.offsetTop < window.map.Y_MIN_COORD) {
        window.map.mapPinMain.style.top = window.map.Y_MIN_COORD + 'px';
      } if (window.map.mapPinMain.offsetTop > window.map.Y_MAX_COORD) {
        window.map.mapPinMain.style.top = window.map.Y_MAX_COORD + 'px';
      } if (window.map.mapPinMain.offsetLeft < window.map.X_MIN_COORD) {
        window.map.mapPinMain.style.left = window.map.X_MIN_COORD + 'px';
      } if (window.map.mapPinMain.offsetLeft > window.map.X_MAX_COORD) {
        window.map.mapPinMain.style.left = window.map.X_MAX_COORD + 'px';
      } else {
        window.map.mapPinMain.style.top = (window.map.mapPinMain.offsetTop - shift.y) + 'px';
        window.map.mapPinMain.style.left = (window.map.mapPinMain.offsetLeft - shift.x) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.map.enabledMap();

      window.form.getMainPinAdress();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
