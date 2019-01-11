'use strict';

var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var allFieldsets = noticeForm.querySelectorAll('fieldset');
var mapCardTemplate = document.querySelector('template')
.content.querySelector('.map__card');
var mapPinTemplate = document.querySelector('template')
.content.querySelector('.map__pin');
var ESC_KEYCODE = 27;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 44;
var PIN_TAIL = 18;
// var MAIN_PIN_TAIL = 22;
// var MAIN_PIN_WIDTH = 65;
// var MAIN_PIN_HEIGHT = 65;
var MAP_X_MAX_COORD = 1200;
var MAP_Y_MAX_COORD = 750;
var X_MAX_COORD = MAP_X_MAX_COORD - PIN_WIDTH / 2;
var X_MIN_COORD = 0;
var Y_MAX_COORD = 630;
var Y_MIN_COORD = 130;
var HALF = 2;
var OFFER_TYPE_RU = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

// Данные необходимые для объявлений
var OFFER_NUMBER = 8;
var OFFERS_INFORMATION = {
  'title': ['Большая уютная квартира', 'Маленькая не уютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  'price': {
    'min': 1000,
    'max': 1000000
  },
  'type': ['palace', 'flat', 'house', 'bungalo'],
  'rooms': {
    'min': 1,
    'max': 5
  },
  'guests': {
    'min': 1,
    'max': 10
  },
  'checkin': ['12:00', '13:00', '14:00'],
  'checkout': ['12:00', '13:00', '14:00'],
  'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  'photos': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
};

// Вспомогательные функции

// Функия получения случайного значения
var getRandomValue = function (max, min) {
  if (min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    return Math.floor(Math.random() * (max));
  }
};

// Функция случайной сортировки массива из другова массива
var getRandomArray = function (someArray) {
  for (var i = someArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tempValue = someArray[i];
    someArray[i] = someArray[j];
    someArray[j] = tempValue;
  }
  return someArray;
};

// Функция  получения массива с произвльной длиной
var getRandomArrayLength = function (someArray) {
  var randomArray = [];
  for (var i = 0; i <= getRandomValue(someArray.length); i++) {
    randomArray.push(someArray[i]);
  }
  return randomArray;
};

// Получение елементов разметки
var getDefiniteElement = function (parentElement, elementSelector, elementContent) {
  var element = parentElement.querySelector(elementSelector);
  if (elementContent) {
    element.textContent = elementContent;
  }
  return element;
};

// Основной код

// Получение начальных кординат основной метки
var getInitialMainPinCoords = function () {
  var inputAddress = noticeForm.querySelector('#address');
  inputAddress.value = MAP_X_MAX_COORD / HALF + ', ' + MAP_Y_MAX_COORD / HALF;
};

// Деактивация формы для подачи объявления
var disabledForm = function () {
  for (var i = 0; i < allFieldsets.length; i++) {
    allFieldsets[i].disabled = true;
    getInitialMainPinCoords();
  }
};

// Деактивация карты
var disabledMap = function () {
  map.classList.add('map--faded');
  disabledForm();
};

disabledMap();

// Активация формы для подачи объявления
var enabledForm = function () {
  for (var i = 0; i < allFieldsets.length; i++) {
    allFieldsets[i].disabled = false;
  }
};

// Активация меток на карте
var enabledPins = function () {
  var pins = map.querySelectorAll('.map__pin');
  for (var i = 1; i < pins.length; i++) {
    pins[i].classList.remove('hidden');
  }
  return pins;
};

// Активация карты и формы для подачи объявления
var enabledMap = function () {
  noticeForm.classList.remove('notice__form--disabled');
  map.classList.remove('map--faded');
  enabledForm();
  addEventToPin(enabledPins());
  // getPins();
};

mapPinMain.addEventListener('mouseup', function () {
  enabledMap();
});

// Генерация списка авторов объявлений
var getAutorList = function (AuthorNumber) {
  var authorsList = [];
  for (var i = 0; i < AuthorNumber; i++) {
    var avatar = 'img/avatars/user0' + (i + 1) + '.png';
    authorsList.push(avatar);
  }
  return getRandomArray(authorsList);
};

var authors = getAutorList(OFFER_NUMBER);

// Генерация содержимого объявлений.
var fillOffer = function (offerData) {
  var offersContent = [];
  for (var i = 0; i < OFFER_NUMBER; i++) {
    var offerDescription = {
      'title': offerData.title[i],
      'address': '',
      'price': getRandomValue(offerData.price.max, offerData.price.min),
      'type': offerData.type[getRandomValue(offerData.type.length)],
      'rooms': getRandomValue(offerData.rooms.max, offerData.rooms.min),
      'guests': getRandomValue(offerData.guests.max, offerData.guests.min),
      'checkin': offerData.checkin[getRandomValue(offerData.checkin.length)],
      'checkout': offerData.checkout[getRandomValue(offerData.checkout.length)],
      'feature': getRandomArrayLength(offerData.features),
      'description': '',
      'photos': getRandomArray(offerData.photos)
    };
    offersContent.push(offerDescription);
  }
  return getRandomArray(offersContent);
};

var filling = fillOffer(OFFERS_INFORMATION);

// Сборка объявлений в целое
var createOfferDataList = function (offerAuthor, offerContent) {
  var offersList = [];
  for (var i = 0; i < OFFER_NUMBER; i++) {
    var offer = {
      author: {
        avatar: offerAuthor[i]
      },
      offer: offerContent[i],
      location: {
        x: getRandomValue(X_MAX_COORD, X_MIN_COORD),
        y: getRandomValue(Y_MAX_COORD, Y_MIN_COORD)
      },
    };
    offer.offer.address = offer.location.x + ',' + ' ' + (offer.location.y - (PIN_TAIL + PIN_HEIGHT / 2));
    offersList.push(offer);
  }
  return offersList;
};

var offers = createOfferDataList(authors, filling);

// Отрисовка метки объявления
var renderOfferCoords = function (offersMark) {
  var pin = mapPinTemplate.cloneNode(true);
  pin.classList.add('hidden');
  pin.style = 'left:' + offersMark.location.x + 'px;' + 'top:' +
  offersMark.location.y + 'px';
  pin.firstElementChild.src = offersMark.author.avatar;
  pin.firstElementChild.alt = offersMark.offer.title;
  return pin;
};

// Добавление метки объявления в DOM
var addOfferMark = function (element) {
  var mapPins = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < element.length; i++) {
    fragment.appendChild(renderOfferCoords(element[i]));
    mapPins.appendChild(fragment);
  }
};

addOfferMark(offers);

// Отрисовка объявления
var markingOffer = function (advertising) {
  var popup = mapCardTemplate.cloneNode(true);
  var popupAvatar = getDefiniteElement(popup, '.popup__avatar'); // Аватарка
  popupAvatar.src = advertising.author.avatar;
  var popupFeatures = popup.querySelectorAll('.feature'); // Преимушества

  for (var i = 0; i < popupFeatures.length; i++) {
    if (i >= advertising.offer.feature.length) {
      popupFeatures[i].classList.remove('feature');
    }
  }

  var popupPhotos = getDefiniteElement(popup, '.popup__photos'); // Фотографии объявления
  var popupPhotoItem = popupPhotos.querySelector('li');

  for (var j = 0; j < advertising.offer.photos.length; j++) {
    var itemImg = document.createElement('img');
    itemImg.src = advertising.offer.photos[j];
    itemImg.style.cssText = 'width: 60px; height: 60px;';
    popupPhotoItem.appendChild(itemImg);
  }

  getDefiniteElement(popup, '.popup__title', advertising.offer.title); // Заголовок объявления
  getDefiniteElement(popup, '.popup__text--address', advertising.offer.address); // Адресс объявления
  getDefiniteElement(popup, '.popup__text--price', advertising.offer.price + ' ₽/Ночь'); // Цена
  getDefiniteElement(popup, '.popup__type', OFFER_TYPE_RU[advertising.offer.type]); // Тип жилья
  getDefiniteElement(popup, '.popup__text--capacity', advertising.offer.rooms + ' комнаты для ' + advertising.offer.guests + ' гостей'); // Количество гостей + количество комнат
  getDefiniteElement(popup, '.popup__text--time', 'Заезд после ' + advertising.offer.checkin + ', выезд до ' + advertising.offer.checkout); // Время заезда + время выезда.
  getDefiniteElement(popup, '.popup__description', advertising.offer.description); // Описание

  return popup;
};

// Добавление объявления в DOM
var addAdvertising = function (element) {
  var mapFilters = map.querySelector('.map__filters-container');
  var fragment = document.createDocumentFragment();
  fragment.appendChild(markingOffer(element));
  map.insertBefore(fragment, mapFilters);
};

// Выбор похожих объявлений

// Открыть попап с объявлением
var openPopup = function (offer) {
  addAdvertising(offer);
  document.addEventListener('keydown', popupPressEscHendler);
  var popupClose = map.querySelector('.popup__close');
  popupClose.addEventListener('click', closePopup);
};

// Закрыть попап с объявлением
var closePopup = function () {
  if (map.querySelector('.popup')) {
    var popup = map.querySelector('.popup');
    map.removeChild(popup);
    unmarkPin();
  }
  document.removeEventListener('keydown', popupPressEscHendler);
};

// Закрытие попап по нажатию на ESC
var popupPressEscHendler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

// Маркировка выбраной на карте отметки
var markPin = function (pin) {
  pin.classList.add('map__pin--active');
};

// Снятие маркировки с отметки
var unmarkPin = function () {
  var pins = map.querySelectorAll('.map__pin');
  for (var i = 1; i < pins.length; i++) {
    pins[i].classList.remove('map__pin--active');
  }
};

// Добавление обработчиков событий для открытия и закрытия объявления по щелчку на каждую метку
var addPinClickHendler = function (pin, offer) {
  pin.addEventListener('click', function () {
    openPopup(offer);
    markPin(pin);
  });
};


var addEventToPin = function (pins) {
  for (var i = 0; i < offers.length; i++) {
    pins[i + 1].addEventListener('click', function () {
      closePopup();
    });
    addPinClickHendler(pins[i + 1], offers[i]);
  }
};

// Заполнение и валидация формы отправки объяления

var selectType = noticeForm.querySelector('#type');
console.log(selectType);
