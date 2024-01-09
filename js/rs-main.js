/* ====================================
Инициализация слайдера в блоке rs-logo
==================================== */
function initLogoSliders() {
	// Перечень слайдеров
	if (document.querySelector('.rs-main__logo_slider')) {
		const swiperMain = new Swiper('.rs-main__logo_slider', {
			// // Автопрокрутка
			// autoplay: {
			// 	// Пауза между прокруткой
			// 	delay: 1,
			// 	// delay: 5000,
			// 	// Закончить на последнем слайде
			// 	stopOnLastSlide: false,
			// 	// Отключить после ручного переключения
			// 	disableOnInteraction: false,
			// 	// Изменить направление
			// 	// reverseDirection: true,
			// },

			// Обновить свайпер
			// при изменении элементов слайдера
			observer: true,
			// при изменении родительских элементов слайдера
			observeParents: true,
			// при изменении дочерних элементов слайдера
			observeSlideChildren: true,

			// Скорость смены слайдов
			speed: 5000,

			// Включение/отключение
			// перетаскивание на ПК
			simulateTouch: true,
			allowTouchMove: true,
			// Чувствительность свайпа
			touchRadio: 1,
			// Угол срабатывания свайпа/перетаскивания
			touchAngle: 45,

			// Цикличность слайдера
			loop: true,

			// Курсор перетаскивания
			grabCursor: true,

			// Анимация переключения
			// effect: 'fade',

			slidesPerView: 'auto',
			spaceBetween: 24,
		});
	}

}
window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initLogoSliders();
});
