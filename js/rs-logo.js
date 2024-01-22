/* ====================================
Инициализация слайдера в блоке rs-logo
==================================== */
function initLogoSlider() {
	if (document.querySelector('.rs-logo')) {
		const sliderLogos = document.querySelectorAll('.rs-logo__slider');

		sliderLogos.forEach(sliderLogo => {
			const pagination = sliderLogo.querySelector('.rs-logo__pagination');
			const arrowNext = sliderLogo.querySelector('.rs-logo__button-next');
			const arrowPrev = sliderLogo.querySelector('.rs-logo__button-prev');

			// Перечень слайдеров
			const sliderSwiper = new Swiper(sliderLogo, {
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
				speed: 1200,

				// Включение/отключение
				// перетаскивание на ПК
				simulateTouch: true,
				// Чувствительность свайпа
				touchRadio: 1,
				// Угол срабатывания свайпа/перетаскивания
				touchAngle: 45,

				// Курсор
				grabCursor: true,

				// Пагинация
				pagination: {
					el: pagination,
					// clickable: true,
					// dynamicBullets: true
					type: 'progressbar',
				},

				// // Управлениее мышью
				// mousewheel: {
				// 	enabled: true,
				// 	sensitivity: 2,
				// },

				// // Свободный режим
				// freeMode: {
				// 	enabled: true,
				// 	sticky: false,
				// 	momentumBounce: false,
				// },

				// Стрелки
				navigation: {
					nextEl: arrowNext,
					prevEl: arrowPrev,
				},

				// Брейкпоинты(адаптив)
				// Шрина экрана
				breakpoints: {
					320: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2.4,
						spaceBetween: 24,
					},
					1170: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
				},
			});
		});
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initLogoSlider();
});