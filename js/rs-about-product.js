/* ====================================
Инициализация слайдера в блоке rs-about-product
==================================== */
function initAboutSlider() {
	if (document.querySelector('.rs-about-product')) {
		const sliderAbouts = document.querySelectorAll('.rs-about-product');

		sliderAbouts.forEach(sliderAbout => {
			const slider = sliderAbout.querySelector('.rs-about-product__slider');
			const pagination = sliderAbout.querySelector('.rs-about-product__pagination');
			const arrowNext = sliderAbout.querySelector('.rs-about-product__button-next');
			const arrowPrev = sliderAbout.querySelector('.rs-about-product__button-prev');

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

				// Пагинация
				pagination: {
					el: pagination,
					// clickable: true,
					// dynamicBullets: true
					type: 'progressbar',
				},

				// Стрелки
				navigation: {
					nextEl: arrowNext,
					prevEl: arrowPrev,
				},

				// Брейкпоинты(адаптив)
				// Шрина экрана
				breakpoints: {
					320: {
						slidesPerView: 1.22,
						spaceBetween: 20,
					},
					540: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2.39,
						spaceBetween: 20,
					},
					992: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					1170: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
					1350: {
						slidesPerView: 3.34,
						spaceBetween: 30,
					},
				},
			});
		});
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initAboutSlider();
});