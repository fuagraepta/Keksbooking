'use strict';

(function () {
  // Заполнение и валидация формы отправки объяления
  var noticeForm = document.querySelector('.notice__form');
  var allNoticeFormInputs = noticeForm.querySelectorAll('.input');
  var selectType = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var timein = noticeForm.querySelector('#timein');
  var timeout = noticeForm.querySelector('#timeout');
  var roomNumber = noticeForm.querySelector('#room_number');
  var roomNumberTip = noticeForm.querySelector('.room_number_tip');
  var capacity = noticeForm.querySelector('#capacity');
  var reset = noticeForm.querySelector('.form__reset');

  window.form = {
    // Деактивация формы для подачи объявления
    'disabledForm': function () {
      noticeForm.classList.add('notice__form--disabled');
      for (var i = 0; i < allNoticeFormInputs.length; i++) {
        allNoticeFormInputs[i].disabled = true;
      }
    },
    // Активация формы для подачи объявления
    'enabledForm': function () {
      noticeForm.classList.remove('notice__form--disabled');
      for (var i = 0; i < allNoticeFormInputs.length; i++) {
        allNoticeFormInputs[i].disabled = false;
      }
    },
    // Получение  начального адреса основной метки
    'getMainPinAdress': function () {
      var inputAddress = noticeForm.querySelector('#address');
      inputAddress.value = window.map.mapPinMain.offsetLeft + ', ' + (window.map.mapPinMain.offsetTop + window.utils.getHalf(window.map.MAIN_PIN_HEIGHT) + window.map.MAIN_PIN_TAIL);
    }
  };

  window.form.disabledForm();

  // Функция синхронизации двух похожих(по длине) селектов
  var synchTime = function (selectOne, selectTwo) {
    selectOne.value = selectTwo.value;
  };

  // Вывод подсказки для не валидных полей
  var addTip = function (invalidElement, tip, tipMessage) {
    if (invalidElement.setCustomValidity !== '') {
      tip.classList.remove('hidden');
      tip.textContent = tipMessage;
    }
  };

  // Скрыть подсказку для валидных полей
  var removeTip = function (tip) {
    tip.classList.add('hidden');
  };

  //  Размещение делегирование формы отправки на не валидные поля.
  noticeForm.addEventListener('invalid', function (evt) {
    var target = evt.target;
    if (target.validity.valid === false) {
      target.classList.add('invalid');
    }
  }, true);

  // Показывает сообщение для описания в случаи не валидности поля
  // При желании можно отключить
  var title = noticeForm.querySelector('#title');
  var titleTip = noticeForm.querySelector('.title_tip');

  title.addEventListener('input', function () {
    if (title.value.length < 30) {
      title.setCustomValidity('Описание должно стотоять минимум из 30 символов');
      addTip(title, titleTip, 'Описание должно стотоять минимум из 30 символов');
    } else if (title.value.length > 100) {
      title.setCustomValidity('Имя не должно превышать 100 символов');
      addTip(title, titleTip, 'Имя не должно превышать 100 символов');
    } else {
      title.setCustomValidity('');
      removeTip(titleTip);
    }
  });

  // При выборе типа жилья меняется минимальная стоимость
  selectType.addEventListener('input', function () {
    if (selectType.value === 'flat') {
      price.min = 1000;
      price.placeholder = 1000;
    }
    if (selectType.value === 'bungalo') {
      price.min = 0;
      price.placeholder = 0;
    }
    if (selectType.value === 'house') {
      price.min = 5000;
      price.placeholder = 5000;
    }
    if (selectType.value === 'palace') {
      price.min = 10000;
      price.placeholder = 10000;
    }
  });

  // Время заезда синхронизируется со временем выезда
  timein.addEventListener('change', function () {
    synchTime(timeout, timein);
  });
  timeout.addEventListener('change', function () {
    synchTime(timein, timeout);
  });

  // Синхронизация комнат с количеством гостей
  var sinchRoomAndCapacity = function () {
    if (roomNumber.value === '1' && capacity.value !== '1') {
      roomNumber.setCustomValidity('для 1 гостя');
      addTip(roomNumber, roomNumberTip, 'для 1 гостя');
    } else if (roomNumber.value === '2' && capacity.value === '0') {
      roomNumber.setCustomValidity('для 2 гостей или для 1 гостя');
      addTip(roomNumber, roomNumberTip, 'не более 2 гостей');
    } else if (roomNumber.value === '2' && capacity.value === '3') {
      roomNumber.setCustomValidity('для 2 гостей или для 1 гостя');
      addTip(roomNumber, roomNumberTip, 'не более 2 гостей');
    } else if (roomNumber.value === '3' && capacity.value === '0') {
      roomNumber.setCustomValidity('для 3 гостей, для 2 гостей или для 1 гостя');
      addTip(roomNumber, roomNumberTip, 'не более 3 гостей');
    } else if (roomNumber.value === '100' && capacity.value !== '0') {
      roomNumber.setCustomValidity('не для гостей');
      addTip(roomNumber, roomNumberTip, 'не для гостей');
    } else {
      roomNumber.setCustomValidity('');
      removeTip(roomNumberTip);
    }
  };

  roomNumber.addEventListener('input', function () {
    sinchRoomAndCapacity();
  });

  capacity.addEventListener('input', function () {
    sinchRoomAndCapacity();
  });

  // Сброс страницы в исходное состояние.
  reset.addEventListener('click', function () {
    removeTip(roomNumberTip);
    removeTip(titleTip);
    // closePopup();
    window.form.disabledForm();
    window.map.disabledMap();
  });
})();
