/* ====================================
Инициализация слайдера rs-features
==================================== */
function initFeaturesSlider() {
	if (document.querySelector('.rs-features__slider')) {
		'use strict';
		// До этой ширины слайдер будет неактивным
		const breakpoint = window.matchMedia('(min-width: 991.98px)');

		let features;

		const breakpointChecker = function () {
			if (breakpoint.matches === true) {
				if (features !== undefined) features.destroy(true, true);
				return;
			} else if (breakpoint.matches === false) {
				return enableSwiper();
			}
		};

		// Инициализация слайдера
		const enableSwiper = function () {
			const sliderFeatures = document.querySelectorAll('.rs-features');

			sliderFeatures.forEach(sliderFeature => {
				const slider = sliderFeature.querySelector('.rs-features__slider');
				const arrowNext = sliderFeature.querySelector('.rs-features__button-next');
				const arrowPrev = sliderFeature.querySelector('.rs-features__button-prev');

				// Перечень слайдеров
				new Swiper(slider, {
					// // Автопрокрутка
					// autoplay: {
					// 	// Пауза между прокруткой
					// 	delay: 10000,
					// 	// Закончить на последнем слайде
					// 	stopOnLastSlide: false,
					// 	// Отключить после ручного переключения
					// 	disableOnInteraction: false,
					// },

					// Обновить свайпер
					// при изменении элементов слайдера
					observer: true,
					// при изменении родительских элементов слайдера
					observeParents: true,
					// при изменении дочерних элементов слайдера
					observeSlideChildren: true,

					// Скорость смены слайдов
					speed: 500,

					// Включение/отключение
					// перетаскивание на ПК
					simulateTouch: true,
					// Чувствительность свайпа
					touchRadio: 1,
					// Угол срабатывания свайпа/перетаскивания
					touchAngle: 45,

					// Курсор
					grabCursor: true,

					// // Стрелки
					// navigation: {
					// 	nextEl: arrowNext,
					// 	prevEl: arrowPrev,
					// },

					// loop: true,

					// Брейкпоинты(адаптив)
					// Шрина экрана
					breakpoints: {
						320: {
							slidesPerView: 1.22,
							spaceBetween: 20,
						},
						768: {
							slidesPerView: 2.4,
							spaceBetween: 25,
						},
						992: {
							slidesPerView: 1,
							spaceBetween: 30,
						},
					},
				});
			});
		};

		breakpoint.addListener(breakpointChecker);
		breakpointChecker();
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдера
	initFeaturesSlider();
});