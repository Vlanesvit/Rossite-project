import { addCursorHover, addCursorMove, addCursorDrag } from "../libs/cursor.js";
// Инициализация курсора
addCursorHover(".rs-project__slide", ".cursor", "cursor__active");
addCursorMove(".rs-project__slide", ".cursor__circle")

import { handleReveal } from "../libs/animation-gsap.js";

/* ====================================
Подсчет активных фильтров и отчистка
==================================== */
export function filterClear() {
	const filterItem = document.querySelectorAll('.rs-case .filter__item');
	const filterBtn = document.querySelector('.rs-case .filter__btn');

	function outputCountActiveFilter(where_find, where_output) {
		if (where_output) {
			let filterCount = document.createElement('span');
			filterCount.classList.add('filter__count');
			where_output.prepend(filterCount);

			const checkboxs = where_find.querySelectorAll('input[type="checkbox"]');

			checkboxs.forEach(checkbox => {
				checkbox.addEventListener('input', function () {
					countChecked()
				})
			});

			function countChecked() {
				const activeCheckbox = where_find.querySelectorAll('input[type="checkbox"]:checked');
				let numCheckedFilter = activeCheckbox.length;
				if (numCheckedFilter > 0) {
					where_output.classList.add('_output-count');
					filterCount.style.display = "flex";
					filterCount.innerHTML = numCheckedFilter;
				} else {
					where_output.classList.remove('_output-count');
					filterCount.style.display = "none";
					filterCount.innerHTML = "0";
				}
			}
		}
	}
	outputCountActiveFilter(document, filterBtn)


	filterItem.forEach(filter => {
		const filterTitle = filter.querySelector('.filter__title');

		outputCountActiveFilter(filter, filterTitle)
	});
}
if (document.querySelector('.rs-case .filter')) {
	filterClear();
}

/* ====================================
Модальное окно фильтров
==================================== */
export function filterProject() {
	const filters = document.querySelectorAll('.filter');

	filters.forEach(filter => {
		const filterItems = filter.querySelectorAll('.filter__item')
		const filterBlock = filter.querySelector('.filter__block');
		const filterBtn = filter.querySelector('.filter__btn');

		if (filterBtn) {
			filterBtn.addEventListener('click', function () {
				filterBlock.classList.toggle('_open-filter')
				document.documentElement.classList.toggle('_open-filter');
			})
		}

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
				} else {
					this.closest('.filter__item').classList.remove('_open-filter');
				}
			})

			// Закрытие фильтров при клике вне блока фильтра
			filter.addEventListener('click', function (e) {
				e.stopPropagation();
			});
			document.addEventListener('click', function (e) {
				// selectOptionsAll.forEach(selectOpt => {
				// 	if (!selectOpt.classList.contains("_slide")) {
				// 		_slideUp(selectOpt, 200);
				// 	}
				// });
				item.classList.remove('_open-filter')
			});

			if (filterClose) {
				filterClose.addEventListener('click', function () {
					item.classList.remove('_open-filter')
				})
			}
		});
	});
}
if (document.querySelector('.filter')) {
	filterProject()
}

/* ====================================
Имитация загрузки карточек
==================================== */
export function imitationProductLoad() {
	const projects = document.querySelectorAll('.rs-project');

	projects.forEach(project => {
		const showData = project.querySelector('[data-project-show]');
		const loadData = project.querySelector('[data-project-load]');
		const projectSlide = project.querySelectorAll('.rs-project__slide');
		const projectAdd = project.querySelector('.rs-project__add');

		let showCount = Number(showData.getAttribute('data-project-show'));
		let loadCount = Number(loadData.getAttribute('data-project-load'));

		function checkCurrentItems() {
			// Скрываем кнопку, если карточки все открыты
			if (showCount >= projectSlide.length) {
				projectAdd.classList.add('_close-btn');
			}
		}
		checkCurrentItems();

		// Показываем первые {showCount} карточек
		for (let i = 0; i < showCount; i++) {
			if (projectSlide[i]) {
				projectSlide[i].classList.add('_open-project');
			}
		}

		projectAdd.addEventListener('click', function () {
			for (let i = showCount; i < showCount + loadCount; i++) {
				if (projectSlide[i]) {
					projectSlide[i].classList.add('_open-project');
				}
			}
			showCount += loadCount;
			checkCurrentItems();

			handleReveal(); // Обновление ScrollTrigger после появления новых элементов
		});
	});
}
if (document.querySelector('.rs-project')) {
	imitationProductLoad()
}
