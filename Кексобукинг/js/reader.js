'use strict';

(function () {
  // Добавление аватарки и фотографий жилья с помощью fileReader
  // Проверка формата загружаемого файла
  var FILE_TYPES = ['png', 'jpg', 'jpeg', 'svg'];

  var checkFile = function (file) {
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    return matches;
  };

  // Создание FileReader для загрузки фото
  var getReader = function (file, preview) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });
    reader.readAsDataURL(file);
  };

  // Выполнение действия при событии Drop на элементе
  var isDropEvent = function (dropEvt, action) {
    dropEvt.stopPropagation();
    dropEvt.preventDefault();
    var dt = dropEvt.dataTransfer;
    var files = dt.files;
    action(files);
  };

  // Добавление аватарки пользователя
  var avatarFileChooser = document.querySelector('.notice__photo input[type=file]');
  var avatarPreview = document.querySelector('.notice__preview img');
  var dropZone = document.querySelectorAll('.drop-zone');

  // Добавление аватарки пользователя через input file
  var addAvatarPhoto = function (file) {
    var files = file ? file[0] : avatarFileChooser.files[0];

    if (checkFile(files)) {
      getReader(files, avatarPreview);
    }
  };

  avatarFileChooser.addEventListener('change', function () {
    addAvatarPhoto();
  });

  // Добавление аватарки пользователя с помощью Drag and Drop
  var onDropZoneDragenter = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var onDropZoneDragover = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };


  var onAvatarZoneDrop = function (dropEvt) {
    isDropEvent(dropEvt, addAvatarPhoto);
  };

  dropZone.forEach(function (zone) {
    zone.addEventListener('dragenter', onDropZoneDragenter, false);
    zone.addEventListener('dragover', onDropZoneDragover, false);
  });

  dropZone[0].addEventListener('drop', onAvatarZoneDrop, false);

  // Добавление фотографий жилья
  var photoFileChooser = document.querySelector('.form__photo-container input[type=file]');
  var housePreview = document.querySelectorAll('.form__photo-container img');
  var PHOTO_NUMBER = 0;

  // Получение номера фотографии
  var getPhotoNumber = function () {
    PHOTO_NUMBER++;
    if (PHOTO_NUMBER === housePreview.length) {
      PHOTO_NUMBER = 0;
    }
  };

  // Добавление фотографий жилья через input file
  var addHousePhoto = function (photo) {
    var files = photo ? photo : photoFileChooser.files;

    for (var i = 0; i < files.length; i++) {

      if (checkFile(files[i])) {
        getReader(files[i], housePreview[PHOTO_NUMBER]);
        getPhotoNumber();
      }
    }
  };

  photoFileChooser.addEventListener('change', function () {
    addHousePhoto();
  });

  // Добавление фотографий жилья с помощью Drag and Drop
  var onHousePhotoZoneDrop = function (dropEvt) {
    isDropEvent(dropEvt, addHousePhoto);
  };

  dropZone[1].addEventListener('drop', onHousePhotoZoneDrop, false);

  // Сортировка фотографий жилья с помощью drag and drop
  var onHousePreviewDragstart = function (evtDrag) {
    evtDrag.stopPropagation();
    var photoSrc = evtDrag.target.src;

    var onHousePreviewDrop = function (evtDrop) {
      evtDrop.stopPropagation();
      evtDrop.preventDefault();
      evtDrag.target.src = evtDrop.target.src;
      evtDrop.target.src = photoSrc;

      housePreview.forEach(function (photo) {
        photo.removeEventListener('drop', onHousePreviewDrop);
      });
    };

    housePreview.forEach(function (photo) {
      photo.addEventListener('drop', onHousePreviewDrop, false);
    });
  };

  var onHousePreviewDragover = function (DragoverEvt) {
    DragoverEvt.stopPropagation();
    DragoverEvt.preventDefault();
  };

  housePreview.forEach(function (photo) {
    photo.addEventListener('dragover', onHousePreviewDragover, false);
    photo.addEventListener('dragstart', onHousePreviewDragstart, false);
  });
})();
