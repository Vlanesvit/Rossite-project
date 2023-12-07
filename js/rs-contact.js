
function map(n) {
	ymaps.ready(init);
	function init() {
		// Создание карты.
		var myMap = new ymaps.Map("map", {
			// Координаты центра карты.
			// Порядок по умолчанию: «широта, долгота».
			// Чтобы не определять координаты центра карты вручную,
			// воспользуйтесь инструментом Определение координат.
			controls: [],
			center: [55.708303, 37.652822],
			// Уровень масштабирования. Допустимые значения:
			// от 0 (весь мир) до 19.
			zoom: 15
		});

		let myPlacemark = new ymaps.Placemark([55.708303, 37.652822], {
		}, {
			// Опции.
			// balloonContentHeader: 'Mistoun',
			// balloonContentBody: 'ТЦ «Твой Дом», МКАД 24-й километр, 1к1 ТРК Vegas',
			// balloonContentFooter: '+ 7(495) 507-54 - 90',
			// hasBalloon: true,
			// hideIconOnBalloonOpen: true,

			// hasBalloon: false,
			// hideIconOnBalloonOpen: false,
			// Необходимо указать данный тип макета.
			// iconLayout: 'default#imageWithContent',
			// Своё изображение иконки метки.
			// iconImageHref: '',
			// Размеры метки.
			// iconImageSize: [55, 55],
			// Смещение левого верхнего угла иконки относительно
			// её "ножки" (точки привязки).
			// iconImageOffset: [-25, -25],
			// Смещение слоя с содержимым относительно слоя с картинкой.
			// iconContentOffset: [0, 0],
		});
		myMap.geoObjects.add(myPlacemark);
	}
}
map()
