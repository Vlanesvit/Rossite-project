/* ====================================
Инициализация слайдера в блоке rs-slider-block
==================================== */
function initBlockSlider() {
	// Слайдер с классом с закрепом и гориз.скроллом
	if (document.querySelector('.rs-slider-block.rs-slider-block-pins')) {
		const sliderBlocks = document.querySelectorAll('.rs-slider-block.rs-slider-block-pins');

		sliderBlocks.forEach(sliderBlock => {
			const arrowNext = sliderBlock.querySelector('.rs-slider-block__button-next');
			const arrowPrev = sliderBlock.querySelector('.rs-slider-block__button-prev');
			let scrollChange = 300

			arrowNext.addEventListener('click', function (e) {
				e.preventDefault();
				window.scrollBy(0, scrollChange);
			})

			arrowPrev.addEventListener('click', function (e) {
				e.preventDefault();
				window.scrollBy(0, -scrollChange);
			})
		});
	}

	// Слайдер обыкновенный
	if (document.querySelector('.rs-slider-block:not(.rs-slider-block-pins)')) {
		const sliderBlocks = document.querySelectorAll('.rs-slider-block:not(.rs-slider-block-pins)');

		sliderBlocks.forEach(sliderBlock => {
			const slider = sliderBlock.querySelector('.rs-slider-block__slider');
			const pagination = sliderBlock.querySelector('.rs-slider-block__pagination');
			const arrowNext = sliderBlock.querySelector('.rs-slider-block__button-next');
			const arrowPrev = sliderBlock.querySelector('.rs-slider-block__button-prev');

			// Перечень слайдеров
			const sliderSwiper = new Swiper(slider, {
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
						slidesPerView: 1,
						spaceBetween: 20,
					},
					540: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 24,
					},
					992: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					1170: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
					1440: {
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
	initBlockSlider();
});