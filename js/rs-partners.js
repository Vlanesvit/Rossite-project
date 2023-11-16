/* ====================================
Инициализация слайдера rs-partners
==================================== */
function initPartnersSlider() {
	if (document.querySelector('.rs-partners__slider')) {
		'use strict';
		// До этой ширины слайдер будет неактивным
		const breakpoint = window.matchMedia('(min-width: 767.98px)');

		let partners;

		const breakpointChecker = function () {
			if (breakpoint.matches === true) {
				if (partners !== undefined) partners.destroy(true, true);
				return;
			} else if (breakpoint.matches === false) {
				return enableSwiper();
			}
		};

		// Инициализация слайдера
		const enableSwiper = function () {
			partners = new Swiper('.rs-partners__slider', {
				// Автопрокрутка
				autoplay: {
					// Пауза между прокруткой
					delay: 5000,
					// Закончить на последнем слайде
					stopOnLastSlide: false,
					// Отключить после ручного переключения
					disableOnInteraction: true,
				},

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
				// Cобытие touchstart (pointerdown)
				touchStartPreventDefault: true,

				// Курсор перетаскивания
				grabCursor: true,

				// Брекпоинты (адаптив)
				breakpoints: {
					320: {
						slidesPerView: 2.45,
						spaceBetween: 14,
						grid: {
							fill: 'row',
							rows: 2,
						},
					},
					540: {
						slidesPerView: 4,
						spaceBetween: 14,
						grid: {
							fill: 'row',
							rows: 2,
						},
					},
				},
			});
		};

		breakpoint.addListener(breakpointChecker);
		breakpointChecker();
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдера
	initPartnersSlider();
});