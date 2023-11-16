/* ====================================
Инициализация слайдера в блоке rs-features
==================================== */
function initFeaturesSlider() {
	if (document.querySelector('.rs-features')) {
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

				on: {
					slideChangeTransitionEnd: function () {
						const slide = document.querySelector('.rs-features__slide.swiper-slide-active');
						switch (true) {
							case slide.classList.contains('rs-features__slide-1'):
								document.querySelector('.rs-features__wrapper').style.backgroundColor = "var(--item-gray-bg)";
								break;

							case slide.classList.contains('rs-features__slide-2'):
								document.querySelector('.rs-features__wrapper').style.backgroundColor = "var(--item-blue-bg)";
								break;

							case slide.classList.contains('rs-features__slide-3'):
								document.querySelector('.rs-features__wrapper').style.backgroundColor = "var(--item-green-bg)";
								break;

							default:
								console.log('Слайдера нет');
								break;
						}
					},
				}
			});
		});
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initFeaturesSlider();
});