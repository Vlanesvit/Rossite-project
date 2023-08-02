/* ====================================
Инициализация слайдера в блоке rs-services
==================================== */
function initServiceSlider() {
	if (document.querySelector('.rs-services')) {
		const sliderServices = document.querySelectorAll('.rs-services');

		sliderServices.forEach(sliderService => {
			const slider = sliderService.querySelector('.rs-services__slider');
			const pagination = sliderService.querySelector('.rs-services__pagination');
			const arrowNext = sliderService.querySelector('.rs-services__button-next');
			const arrowPrev = sliderService.querySelector('.rs-services__button-prev');

			// Перечень слайдеров
			const sliderSwiper = new Swiper(slider, {
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

				// Управлениее мышью
				mousewheel: {
					enabled: true,
					sensitivity: 2,
				},

				// Свободный режим
				freeMode: {
					enabled: true,
					sticky: false,
					momentumBounce: false,
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

			const breakpoint = window.matchMedia('(min-width: 991.98px)');
			const breakpointChecker = function () {
				if (breakpoint.matches === true) {
					gsap.to(".rs-services__swiper", { ease: "none", });
					ScrollTrigger.create({
						trigger: ".rs-services",
						start: "top-=10% top",
						end: "bottom+=100% bottom",
						scrub: true,
						pin: true,
						// markers: 1,
						// onEnter: () => { },
						// onLeave: () => { },
						// onEnterBack: () => { },
						// onLeaveBack: () => { },
						onUpdate: self => {
							// setTimeout(() => {
							// 	if (self.direction === 1) {
							// 		sliderSwiper.slideNext()
							// 	}
							// 	else if (self.direction === -1) {
							// 		sliderSwiper.slidePrev()
							// 	}
							// }, 300);
						},
					})
				}
			};
			breakpoint.addListener(breakpointChecker);
			breakpointChecker();
		});
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initServiceSlider();
});