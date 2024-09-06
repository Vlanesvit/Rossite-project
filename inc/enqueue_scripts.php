<?php
/**
 * Enqueue functions.
 *
 * @see https://rosait.ru/wiki/
 *
 * @package wp35-shop-v1
 *
 * @version 1.0
 */

//Подключеие стилей и скриптов
add_action( 'wp_enqueue_scripts', 'rs_style_theme');
function rs_style_theme() {
    wp_enqueue_style( 'image-compare-viewer', 'https://unpkg.com/image-compare-viewer/dist/image-compare-viewer.min.css', array(), null, 'screen' );
    wp_enqueue_style( 'nouislider', 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.8.1/nouislider.min.css', array(), '20240506133819', 'screen' );
    wp_enqueue_style( 'style', get_stylesheet_directory_uri().'/css/style.min.css',array(), '20240506133819', 'screen');

    wp_enqueue_script('api-maps','https://api-maps.yandex.ru/2.1?apikey=38863ba5-9462-46dc-940c-d9fed985abff&lang=ru_RU',[],'20240506133819');
   /* wp_add_inline_script( 'api-maps', "ymaps.ready(init);

		function init() {
			if (document.querySelector('.map')) {
				const mapClasses = document.querySelectorAll('.map');
				mapClasses.forEach(mapClass => {
					ymaps.ready();
					let map = new ymaps.Map(mapClass, {
						controls: [],
						// Координаты центра карты
						center: branchData[0].location,
						// Уровень масштабирования
						zoom: 15,
					}, {
						suppressMapOpenBlock: true,
						balloonMaxWidth: 200,
						searchControlProvider: 'yandex#search'
					});

					let pinsCollection = new ymaps.GeoObjectCollection({}, {
						preset: 'islands#blueDotIcon', // дефолт метка
						draggable: false, // метки нельзя перемещать
						// iconLayout: 'default#imageWithContent', // указать данный тип макета.
						// iconImageHref: 'img/footer/map-pin.png', // cвоё изображение иконки метки.
						// iconImageSize: [36, 52], // размеры метки
						// iconImageOffset: [-18, -26], // смещение левого верхнего угла иконки
						// iconContentOffset: [0, 0], // cмещение слоя с содержимым относительно слоя с картинкой
					});

					for (let i = 0; i < branchData.length; i++) {
						let marks = new ymaps.Placemark(branchData[i].location, {
							// Зададим содержимое заголовка балуна.
							balloonContentHeader: '+branchData[i].address+',

							// Зададим содержимое всплывающей подсказки.
							hintContent: '+branchData[i].address+',
						}, )
						pinsCollection.add(marks);
					}

					// Добавим метки на карту.
					map.geoObjects.add(pinsCollection);

					// Скрываем хинт при открытии балуна.
					map.events.add('balloonopen', function(e) {
						Map.hint.close();
					});

					// Закрываем балун по клику по карте
					map.events.add('click', e => e.get('target').balloon.close());
				});
			}
		}" );

    $data = [
        [
            'address'=> 'ул. Ленинская Слобода, д.19, БЦ «Omega Plaza», офис 348.1',
			'location'=> [55.708521, 37.653510],
		],
    ];*/

   // wp_add_inline_script( 'api-maps', 'const branchData = ' . wp_json_encode( $data ), 'before' );

    wp_enqueue_script('barba','https://cdn.jsdelivr.net/npm/@barba/core',[],'20240506133819',['in_footer' => true,'strategy'  => 'async',]);
    wp_enqueue_script('image-compare-viewer','https://unpkg.com/image-compare-viewer/dist/image-compare-viewer.min.js',[],'20240506133819',['in_footer' => true,'strategy'  => 'async',]);
    wp_enqueue_script('nouislider','https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.8.1/nouislider.min.js',[],'20240506133819',['in_footer' => true,'strategy'  => 'async',]);
    wp_enqueue_script('gsap','https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',[],'20240506133819',['in_footer' => true,'strategy'  => 'async',]);
    wp_enqueue_script('scroll_trigger','https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',[],'20240506133819',['in_footer' => true,'strategy'  => 'async',]);
    wp_enqueue_script('scroll-to','https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js',[],'20240506133819',['in_footer' => true,'strategy'  => 'async',]);
    wp_enqueue_script('app',get_stylesheet_directory_uri().'/js/app.min.js',['barba','image-compare-viewer','nouislider','gsap','scroll_trigger','scroll-to'],'20240506133819',['in_footer' => true,'strategy'  => 'defer',]);
}