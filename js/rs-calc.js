document.addEventListener('DOMContentLoaded', function () {
	function initStylesPage() {
		const stylesPage = document.getElementById('styles-page');
		const stylesPageCount = document.getElementById('styles-page-count');
		const stylesPageNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
		const stylesPageformat = {
			to: function (value) {
				return stylesPageNumber[Math.round(value)];
			},
			from: function (value) {
				return stylesPageNumber.indexOf(value);
			}
		};
		noUiSlider.create(stylesPage, {
			start: 3,
			connect: 'lower',
			range: { min: 0, max: stylesPageNumber.length - 1 },
			step: 1,
			// tooltips: true,
			format: stylesPageformat,
			pips: { mode: 'steps', format: stylesPageformat, density: 100 },
		});
		stylesPage.noUiSlider.on('update', function (values, handle) {
			stylesPageNumber.forEach(number => {
				stylesPage.classList.remove(`active-pip-${number}`)
			});
			stylesPage.classList.add(`active-pip-${values}`)
			stylesPageCount.textContent = values;
		});;
	}
	if (document.getElementById('styles-page')) {
		initStylesPage()
	}

	function initFillPage() {
		const fillPage = document.getElementById('fill-page');
		const fillPageCount = document.getElementById('fill-page-count');
		const fillPageNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
		const fillPageformat = {
			to: function (value) {
				return fillPageNumber[Math.round(value)];
			},
			from: function (value) {
				return fillPageNumber.indexOf(value);
			}
		};
		noUiSlider.create(fillPage, {
			start: 4,
			connect: 'lower',
			range: { min: 0, max: fillPageNumber.length - 1 },
			step: 1,
			// tooltips: true,
			format: fillPageformat,
			pips: { mode: 'steps', format: fillPageformat, density: 100 },
		});
		fillPage.noUiSlider.on('update', function (values, handle) {
			fillPageNumber.forEach(number => {
				fillPage.classList.remove(`active-pip-${number}`)
			});
			fillPage.classList.add(`active-pip-${values}`)
			fillPageCount.textContent = values;
		});;
	}
	if (document.getElementById('fill-page')) {
		initFillPage()
	}


})