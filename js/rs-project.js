// Инициализация курсора
addCursorHover(".rs-project__item", ".rs-project .cursor", "cursor__active");
addCursorMove(".cursor__circle")

/* ====================================
Инициализация слайдера с выключением на >992px
==================================== */
function initProjectSlider() {
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
}
window.addEventListener("load", function (e) {
	// Запуск инициализации слайдера
	initProjectSlider();
});

/* ====================================
Модальное окно фильтров
==================================== */
function filterProject() {
	const filters = document.querySelectorAll('.filter');

	filters.forEach(filter => {
		const filterItems = filter.querySelectorAll('.filter__item')

		filterItems.forEach(item => {
			const filterShow = item.querySelector('.filter__title');
			const filterClose = item.querySelector('.filter__close');

			// Открытие\Закрытие фильтров
			filterShow.addEventListener('click', function () {
				if (!this.closest('.filter__item').classList.contains('_open-filter')) {
					filterItems.forEach(item => {
						if (item.classList.contains('_open-filter')) item.classList.remove('_open-filter')
					});
					this.closest('.filter__item').classList.add('_open-filter');
				} else if (this.closest('.filter__item').classList.contains('_open-filter')) {
					this.closest('.filter__item').classList.remove('_open-filter');
				}
			})

			// // Закрытие фильтров при клике вне блока фильтра
			// select.addEventListener('click', function (e) {
			// 	e.stopPropagation();
			// });
			// document.addEventListener('click', function (e) {
			// 	selectOptionsAll.forEach(selectOpt => {
			// 		if (!selectOpt.classList.contains("_slide")) {
			// 			_slideUp(selectOpt, 200);
			// 		}
			// 	});
			// 	select.classList.remove('_open-filter')
			// });

			filterClose.addEventListener('click', function () {
				item.classList.remove('_open-filter')
			})
		});
	});
}
if (document.querySelector('.filter')) {
	filterProject()
}

/* ====================================
Имитация загрузки карточек товара
==================================== */
function imitationProductLoad() {
	const projects = document.querySelectorAll('.rs-project__slide');
	const projectAdd = document.querySelector('.rs-project__add');

	let currentItems = 3;

	function checkCurrentItems() {
		// Скрываем кнопку, если карточки все открыты
		if (currentItems >= projects.length) {
			projectAdd.classList.add('_close-btn');
		}
	}
	checkCurrentItems()

	// Показываем первые {currentItems} карточек
	for (let i = 0; i < currentItems; i++) {
		if (projects[i]) {
			projects[i].classList.add('_open-project');
		}
	}

	projectAdd.addEventListener('click', function () {
		for (let i = currentItems; i < currentItems + 3; i++) {
			if (projects[i]) {
				projects[i].classList.add('_open-project');
			}
		}
		currentItems += 3;
		checkCurrentItems()

		// ВАЖНО! обновляем старт и конец для анимации
		ScrollTrigger.refresh()
	})
}
imitationProductLoad()