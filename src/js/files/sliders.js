/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
// import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Инициализация слайдеров
export function initSliders() {
	// Перечень слайдеров
	if (document.querySelector('.rs-slider-block')) {
		const sliderBlocks = document.querySelectorAll('.rs-slider-block');
		sliderBlocks.forEach(sliderBlock => {
			if (!sliderBlock.classList.contains('rs-slider-block-pins')) {
				sliderBlockSwiperSettings(sliderBlock)
			}

			if (window.innerWidth <= 991.98 && sliderBlock.classList.contains('rs-slider-block-pins')) {
				sliderBlock.classList.remove('rs-slider-block-pins')
				sliderBlockSwiperSettings(sliderBlock)
			}
		});

		function sliderBlockSwiperSettings(sliderBlock) {
			const slider = sliderBlock.querySelector('.rs-slider-block__slider');
			const pagination = sliderBlock.querySelector('.rs-slider-block__pagination');
			const arrowNext = sliderBlock.querySelector('.rs-slider-block__button-next');
			const arrowPrev = sliderBlock.querySelector('.rs-slider-block__button-prev');

			const sliderSwiper = new Swiper(slider, {
				modules: [Navigation, Pagination, Autoplay],

				// Автопрокрутка
				autoplay: {
					// Пауза между прокруткой
					delay: 10000,
					// Закончить на последнем слайде
					stopOnLastSlide: false,
					// Отключить после ручного переключения
					disableOnInteraction: false,
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
		}
	}

	if (document.querySelector('.rs-services')) {
		const sliderBlocks = document.querySelectorAll('.rs-services');
		sliderBlocks.forEach(sliderBlock => {
			const slider = sliderBlock.querySelector('.rs-services__slider');
			const pagination = sliderBlock.querySelector('.rs-services__pagination');
			const arrowNext = sliderBlock.querySelector('.rs-services__button-next');
			const arrowPrev = sliderBlock.querySelector('.rs-services__button-prev');
			const sliderSwiper = new Swiper(slider, {
				modules: [Navigation, Pagination, Autoplay],

				// Автопрокрутка
				autoplay: {
					// Пауза между прокруткой
					delay: 10000,
					// Закончить на последнем слайде
					stopOnLastSlide: false,
					// Отключить после ручного переключения
					disableOnInteraction: false,
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
				},
			});
		});
	}

	if (document.querySelector('.rs-services-about')) {
		const sliderBlocks = document.querySelectorAll('.rs-services-about');
		sliderBlocks.forEach(sliderBlock => {
			const slider = sliderBlock.querySelector('.rs-services-about__slider');
			// Перечень слайдеров
			new Swiper(slider, {
				modules: [Navigation, Pagination, Autoplay],
				// Автопрокрутка
				autoplay: {
					// Пауза между прокруткой
					delay: 10000,
					// Закончить на последнем слайде
					stopOnLastSlide: false,
					// Отключить после ручного переключения
					disableOnInteraction: false,
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

				// Курсор
				grabCursor: true,

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

	if (document.querySelector('.rs-reviews')) {
		const sliderBlocks = document.querySelectorAll('.rs-reviews');
		sliderBlocks.forEach(sliderBlock => {
			const slider = sliderBlock.querySelector('.rs-reviews__slider');
			const slides = sliderBlock.querySelectorAll('.rs-reviews__slide');
			const arrowNext = sliderBlock.querySelector('.rs-reviews__button-next');
			const arrowPrev = sliderBlock.querySelector('.rs-reviews__button-prev');

			// Перечень слайдеров
			new Swiper(slider, {
				modules: [Navigation, Pagination, Autoplay],

				// Автопрокрутка
				autoplay: {
					// Пауза между прокруткой
					delay: 10000,
					// Закончить на последнем слайде
					stopOnLastSlide: false,
					// Отключить после ручного переключения
					disableOnInteraction: false,
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

				// Курсор
				grabCursor: true,

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
					768: {
						slidesPerView: 2.4,
						spaceBetween: 20,
					},
					992: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
				},
			});

			// Если отзыв большой
			slides.forEach(slide => {
				const reviewsDesc = slide.querySelector('.rs-reviews .rs-reviews__description p');
				if (reviewsDesc.clientHeight > 175) {
					reviewsDesc.closest('.rs-reviews__description').classList.add('_large-reviews');
				}
			});
		});
	}

	if (document.querySelector('.rs-project__slider')) {
		'use strict';
		// До этой ширины слайдер будет неактивным
		const breakpoint = window.matchMedia('(min-width: 991.98px)');

		let projectSlider;

		const breakpointChecker = function () {
			if (breakpoint.matches === true) {
				if (projectSlider !== undefined) projectSlider.destroy(true, true);
				return;
			} else if (breakpoint.matches === false) {
				return enableSwiper();
			}
		};

		// Инициализация слайдера
		const enableSwiper = function () {
			projectSlider = new Swiper('.rs-project__slider', {
				modules: [Navigation, Pagination, Autoplay],

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

				// Бесконечность
				loop: true,

				// Брекпоинты (адаптив)
				breakpoints: {
					320: {
						slidesPerView: 1.6,
						spaceBetween: 20,
						centeredSlides: true,
					},
					540: {
						slidesPerView: 3,
						spaceBetween: 20,
						centeredSlides: false,
					},
					768: {
						slidesPerView: 2.39,
						spaceBetween: 20,
						centeredSlides: false,
					},
				},
			});
		};

		breakpoint.addListener(breakpointChecker);
		breakpointChecker();
	}

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
				modules: [Navigation, Pagination, Autoplay],

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

	if (document.querySelector('.rs-logo')) {
		const sliderBlocks = document.querySelectorAll('.rs-logo');

		sliderBlocks.forEach(sliderBlock => {
			const sliders = sliderBlock.querySelectorAll('.rs-logo__slider');

			sliders.forEach(slider => {
				const pagination = slider.querySelector('.rs-logo__pagination');
				const arrowNext = slider.querySelector('.rs-logo__button-next');
				const arrowPrev = slider.querySelector('.rs-logo__button-prev');
				const slides = slider.querySelectorAll('.rs-logo__slide');
				const filters = sliderBlock.querySelectorAll(".rs-logo__filter");

				const sliderSwiper = new Swiper(slider, {
					modules: [Navigation, Pagination, Autoplay],

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

				function updateFilter(activeFilter) {
					if (!activeFilter) {
						filters[0].classList.add("_filter-active");
						activeFilter = filters[0];
					}
					filters.forEach(filter => {
						if (filter === activeFilter) {
							filter.classList.add("_filter-active");
						} else {
							filter.classList.remove("_filter-active");
						}
					});
				}

				function updateSlider(slider) {
					slider.updateProgress();
					slider.updateSize();
					slider.updateSlides();
					slider.update();
				}

				filters.forEach(filter => {
					filter.addEventListener("click", function (e) {
						slides.forEach(slide => {
							if (!filter.classList.contains('_filter-active')) {
								if (filter.dataset.filter === slide.dataset.filter) {
									slide.classList.remove("hidden");
									slide.classList.add("swiper-slide");
									updateSlider(sliderSwiper)
									// showContentOnScroll('.rs-logo__slide', 0.3, 0, 'right-left--every');
								} else if (filter.dataset.filter === "All" || filter.dataset.filter === 'all' || filter.textContent === 'Все') {
									slide.classList.remove("hidden");
									slide.classList.add("swiper-slide");
									updateSlider(sliderSwiper)
									// showContentOnScroll('.rs-logo__slide', 0.3, 0, 'right-left--every');
								} else {
									slide.classList.add("hidden");
									slide.classList.remove("swiper-slide");
									slide.removeAttribute("style");
									updateSlider(sliderSwiper)
									// showContentOnScroll('.rs-logo__slide', 0.3, 0, 'right-left--every');
								}
							}
						});
						updateFilter(filter);
					});
				});
			});
		});
	}

	if (document.querySelector('.rs-other-project')) {
		const sliderBlocks = document.querySelectorAll('.rs-other-project');
		sliderBlocks.forEach(sliderBlock => {
			const slider = sliderBlock.querySelector('.rs-other-project__slider');
			const pagination = sliderBlock.querySelector('.rs-other-project__pagination');
			const arrowNext = sliderBlock.querySelector('.rs-other-project__button-next');
			const arrowPrev = sliderBlock.querySelector('.rs-other-project__button-prev');
			const sliderSwiper = new Swiper(slider, {
				modules: [Navigation, Pagination, Autoplay],

				// Автопрокрутка
				autoplay: {
					// Пауза между прокруткой
					delay: 10000,
					// Закончить на последнем слайде
					stopOnLastSlide: false,
					// Отключить после ручного переключения
					disableOnInteraction: false,
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
					767.98: {
						slidesPerView: 2.1,
						spaceBetween: 24,
					},
					991.98: {
						slidesPerView: 3,
						spaceBetween: 24,
					},
					1439.98: {
						slidesPerView: 3,
						spaceBetween: 50,
					},
				},
			});
		});
	}

	if (document.querySelector('.rs-case-slider--desk .rs-case-slider__slider')) {
		'use strict';
		// До этой ширины слайдер будет неактивным
		const breakpoint = window.matchMedia('(min-width: 991.98px)');

		let caseDeskSlider;

		const breakpointChecker = function () {
			if (breakpoint.matches === true) {
				if (caseDeskSlider !== undefined) caseDeskSlider.destroy(true, true);
				return;
			} else if (breakpoint.matches === false) {
				return enableSwiper();
			}
		};

		// Инициализация слайдера
		const enableSwiper = function () {
			caseDeskSlider = new Swiper('.rs-case-slider--desk .rs-case-slider__slider', {
				modules: [Navigation, Pagination, Autoplay],

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

				// Бесконечность
				loop: true,

				// Брекпоинты (адаптив)
				breakpoints: {
					320: {
						slidesPerView: 1.05,
						spaceBetween: 16,
						centeredSlides: true,
					},
					767.98: {
						slidesPerView: 1.2,
						spaceBetween: 28,
						centeredSlides: true,
					},
				},
			});
		};

		breakpoint.addListener(breakpointChecker);
		breakpointChecker();
	}

	if (document.querySelector('.rs-case-slider--mob .rs-case-slider__slider')) {
		'use strict';
		// До этой ширины слайдер будет неактивным
		const breakpoint = window.matchMedia('(min-width: 991.98px)');

		let caseMobSlider;

		const breakpointChecker = function () {
			if (breakpoint.matches === true) {
				if (caseMobSlider !== undefined) caseMobSlider.destroy(true, true);
				return;
			} else if (breakpoint.matches === false) {
				return enableSwiper();
			}
		};

		// Инициализация слайдера
		const enableSwiper = function () {
			caseMobSlider = new Swiper('.rs-case-slider--mob .rs-case-slider__slider', {
				modules: [Navigation, Pagination, Autoplay],

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

				// Бесконечность
				loop: true,

				// Брекпоинты (адаптив)
				breakpoints: {
					320: {
						slidesPerView: 1.4,
						spaceBetween: 14,
						centeredSlides: true,
					},
					767.98: {
						slidesPerView: 2.3,
						spaceBetween: 20,
						centeredSlides: true,
					},
				},
			});
		};

		breakpoint.addListener(breakpointChecker);
		breakpointChecker();
	}
}

// Функция для уничтожения всех слайдеров на странице
export function destroySliders() {
	const sliderContainers = document.querySelectorAll('.swiper-container-initialized');
	sliderContainers.forEach((sliderContainer) => {
		const swiperInstance = sliderContainer.swiper;
		if (swiperInstance) {
			swiperInstance.destroy(true, true);
		}
	});
}

// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

// Запуск инициализации слайдеров
if (document.querySelector('.swiper')) {
	initSliders();
}
// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
//initSlidersScroll();