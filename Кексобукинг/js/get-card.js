'use strict';

(function () {
  // Отрисовка  карточки объявления
  var mapCardTemplate = document.querySelector('template')
  .content.querySelector('.map__card');

  // Перевод типов жилья на русский
  var OFFER_TYPE_RU = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  // Разметка карточки объявления
  window.getCard = function (advertising) {
    var popup = mapCardTemplate.cloneNode(true);
    var popupAvatar = window.utils.getDefiniteElement(popup, '.popup__avatar'); // Аватарка
    popupAvatar.src = advertising.author.avatar;
    var popupFeatures = popup.querySelectorAll('.feature'); // Преимушества

    for (var i = 0; i < popupFeatures.length; i++) {
      if (i >= advertising.offer.feature.length) {
        popupFeatures[i].classList.remove('feature');
      }
    }

    var popupPhotos = window.utils.getDefiniteElement(popup, '.popup__photos'); // Фотографии объявления
    var popupPhotoItem = popupPhotos.querySelector('li');

    for (var j = 0; j < advertising.offer.photos.length; j++) {
      var itemImg = document.createElement('img');
      itemImg.src = advertising.offer.photos[j];
      itemImg.style.cssText = 'width: 60px; height: 60px;';
      popupPhotoItem.appendChild(itemImg);
    }

    window.utils.getDefiniteElement(popup, '.popup__title', advertising.offer.title); // Заголовок объявления
    window.utils.getDefiniteElement(popup, '.popup__text--address', advertising.offer.address); // Адресс объявления
    window.utils.getDefiniteElement(popup, '.popup__text--price', advertising.offer.price + ' ₽/Ночь'); // Цена
    window.utils.getDefiniteElement(popup, '.popup__type', OFFER_TYPE_RU[advertising.offer.type]); // Тип жилья
    window.utils.getDefiniteElement(popup, '.popup__text--capacity', advertising.offer.rooms + ' комнаты для ' + advertising.offer.guests + ' гостей'); // Количество гостей + количество комнат
    window.utils.getDefiniteElement(popup, '.popup__text--time', 'Заезд после ' + advertising.offer.checkin + ', выезд до ' + advertising.offer.checkout); // Время заезда + время выезда.
    window.utils.getDefiniteElement(popup, '.popup__description', advertising.offer.description); // Описание

    return popup;
  };
})();
