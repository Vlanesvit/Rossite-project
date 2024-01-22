/* ====================================
Инициализация слайдера в блоке rs-services-about
==================================== */
function initWorkAboutSlider() {
	if (document.querySelector('.rs-services-about')) {
		const sliderReviews = document.querySelectorAll('.rs-services-about');

		sliderReviews.forEach(sliderReview => {
			const slider = sliderReview.querySelector('.rs-services-about__slider');
			
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

				// Стрелки
				// navigation: {
				// 	nextEl: arrowNext,
				// 	prevEl: arrowPrev,
				// },

				// Брейкпоинты(адаптив)
				// Шрина экрана
				breakpoints: {
					320: {
						slidesPerView: 1.22,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2.4,
						spaceBetween: 20,
					},
					992: {
						slidesPerView: 3,
						spaceBetween: 40,
					},
				},
			});
		});
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initWorkAboutSlider();
});