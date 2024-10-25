/*
Документация: https://refreshless.com/nouislider/
*/
// Подключаем из node_modules
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css'; // Импортируйте стили, чтобы они применились

// Инициализация noUiSlider
export function initNoUiField(page, page_count) {
	const pageItem = document.getElementById(page);
	const pageCount = document.getElementById(page_count);
	if (pageItem && pageCount) {
		const pageNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
		const pageformat = {
			to: function (value) {
				return pageNumber[Math.round(value)];
			},
			from: function (value) {
				return pageNumber.indexOf(value);
			}
		};
		noUiSlider.create(pageItem, {
			start: 3,
			connect: 'lower',
			range: { min: 0, max: pageNumber.length - 1 },
			step: 1,
			format: pageformat,
			pips: { mode: 'steps', format: pageformat, density: 100 },
		});
		pageItem.noUiSlider.on('update', function (values, handle) {
			pageNumber.forEach(number => {
				pageItem.classList.remove(`active-pip-${number}`);
			});
			pageItem.classList.add(`active-pip-${values}`);
			pageCount.textContent = values;
		});
	}
}

// Функция для уничтожения noUiSlider
export function destroyNoUiField(page) {
	const pageItem = document.getElementById(page);
	if (pageItem && pageItem.noUiSlider) {
		pageItem.noUiSlider.destroy();
	}
}

// Инициализация на странице
initNoUiField('styles-page', 'styles-page-count')
initNoUiField('fill-page', 'fill-page-count')
