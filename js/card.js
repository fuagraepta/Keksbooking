'use strict';

(function () {
  // Разметка карточки объявления
  var mapCardTemplate = document.querySelector('template')
  .content.querySelector('.map__card');

  // Перевод типов жилья на русский
  var engTypeToRusType = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var getCard = function (advertising) {
    var popup = mapCardTemplate.cloneNode(true);
    var popupAvatar = window.utils.getDefiniteElement(popup, '.popup__avatar');// Аватарка
    popupAvatar.src = advertising.author.avatar;
    var popupFeatures = popup.querySelectorAll('.feature');// Преимущества

    for (var i = 0; i < popupFeatures.length; i++) {
      if (i > advertising.offer.features.length) {
        popupFeatures[i].classList.remove('feature');
      }
    }

    var popupPhotos = window.utils.getDefiniteElement(popup, '.popup__photos');// Фотографии объявления
    var popupPhotoItem = popupPhotos.querySelector('li');

    for (var j = 0; j < advertising.offer.photos.length; j++) {
      var itemImg = document.createElement('img');
      itemImg.src = advertising.offer.photos[j];
      itemImg.style.cssText = 'width: 60px; height: 60px;';
      popupPhotoItem.appendChild(itemImg);
    }

    window.utils.getDefiniteElement(popup, '.popup__title', advertising.offer.title); // Заголовок объявления
    window.utils.getDefiniteElement(popup, '.popup__text--address', advertising.offer.address); // Адрес объявления
    window.utils.getDefiniteElement(popup, '.popup__text--price', advertising.offer.price + ' ₽/Ночь'); // Цена
    window.utils.getDefiniteElement(popup, '.popup__type', engTypeToRusType[advertising.offer.type]); // Тип жилья
    window.utils.getDefiniteElement(popup, '.popup__text--capacity', advertising.offer.rooms + ' комнаты для ' + advertising.offer.guests + ' гостей'); // Количество гостей + количество комнат
    window.utils.getDefiniteElement(popup, '.popup__text--time', 'Заезд после ' + advertising.offer.checkin + ', выезд до ' + advertising.offer.checkout); // Время заезда + время выезда.
    window.utils.getDefiniteElement(popup, '.popup__description', advertising.offer.description); // Описание

    return popup;
  };

  var card = {
    // Добавление объявления в DOM
    'renderCard': function (element) {
      var mapFilters = window.map.cityMap.querySelector('.map__filters-container');
      var fragment = document.createDocumentFragment();
      fragment.appendChild(getCard(element));
      window.map.cityMap.insertBefore(fragment, mapFilters);
    },
    // Открыть попап с объявлением
    'openPopup': function (popupOffer) {
      this.renderCard(popupOffer);
      document.addEventListener('keydown', onPopupPressEsc);
      var popupClose = window.map.cityMap.querySelector('.popup__close');
      popupClose.addEventListener('click', this.closePopup);
    },
    // Закрыть попап с объявлением
    'closePopup': function () {
      if (window.map.cityMap.querySelector('.popup')) {
        var popup = window.map.cityMap.querySelector('.popup');
        window.map.cityMap.removeChild(popup);
      }
      document.removeEventListener('keydown', onPopupPressEsc);
    }
  };

  // Закрытие попап по нажатию на ESC
  var onPopupPressEsc = function (escEvent) {
    window.utils.isEscPressEvent(escEvent, card.closePopup);
  };

  window.card = card;
})();
