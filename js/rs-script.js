/* ====================================
Проверка поддержки webp, добавление класса webp или no-webp для HTML
==================================== */
function isWebp() {
	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}
isWebp()

/* ====================================
Проверка мобильного браузера
==================================== */
let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
/* Добавление класса touch для HTML если браузер мобильный */
function addTouchClass() {
	// Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');
}
addTouchClass()

/* ====================================
Добавление loaded для HTML после полной загрузки страницы
==================================== */
function addLoadedClass() {
	window.addEventListener("load", function () {
		setTimeout(function () {
			document.documentElement.classList.add('loaded');
		}, 0);
	});
}
addLoadedClass()

/* ====================================
Добавить картинкам draggable="false"
==================================== */
const imgs = document.getElementsByTagName('img');
for (let i = 0; i < imgs.length; i++) {
	imgs[i].setAttribute('draggable', false);
}

// const lazyMedia = new LazyLoad({
// 	elements_selector: '[data-src],[data-srcset]',
// 	class_loaded: '_lazy-loaded',
// 	use_native: true
// });

/* ====================================
Спойлеры/аккордионы
==================================== */
/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller

Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например: 
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/
function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		// Получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных слойлеров
		if (spollersRegular.length > 0) {
			initSpollers(spollersRegular);
		}
		// Получение слойлеров с медиа запросами
		const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
			return item.dataset.spollers.split(",")[0];
		});
		// Инициализация слойлеров с медиа запросами
		if (spollersMedia.length > 0) {
			const breakpointsArray = [];
			spollersMedia.forEach(item => {
				const params = item.dataset.spollers;
				const breakpoint = {};
				const paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			});
			// Получаем уникальные брейкпоинты
			let mediaQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
			});
			mediaQueries = mediaQueries.filter(function (item, index, self) {
				return self.indexOf(item) === index;
			});
			// Работаем с каждым брейкпоинтом
			mediaQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с нужными условиями
				const spollersArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				// Событие
				matchMedia.addEventListener("change", function () {
					initSpollers(spollersArray, matchMedia);
				});
				initSpollers(spollersArray, matchMedia);
			});
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_spoller-init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length > 0) {
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
				const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_spoller-active');
					_slideToggle(spollerTitle.nextElementSibling, 500);
				}
				// e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
			if (spollerActiveTitle) {
				spollerActiveTitle.classList.remove('_spoller-active');
				_slideUp(spollerActiveTitle.nextElementSibling, 500);
			}
		}
	}
}
if (document.querySelector('[data-spollers]')) {
	spollers()
}

/* ====================================
Параллакс элементов при движении мышью
==================================== */
/*
Предмету, который будет двигаться за мышью указать атрибут data-prlx-mouse.

// =========
Если нужны дополнительные настройки - указать 

Атрибут													Значение по умолчанию
-------------------------------------------------------------------------------------------------------------------
data-prlx-cx="коэффициент_х"					20							значение больше - меньше процент сдвига
data-prlx-cy="коэффициент_y"					20							значение больше - меньше процент сдвига
data-prlx-dxr																					против оси X
data-prlx-dyr																					против оси Y
data-prlx-a="скорость_анимации"				100							больше значение - больше скорость

// =========
Если нужно считывать движение мыши в блоке-родителе - тому родителю указать атрибут data-prlx-mouse-wrapper
*/

const paralaxMouse = document.querySelectorAll('[data-prlx-mouse]');
if (paralaxMouse.length) {
	this.paralaxMouseInit(paralaxMouse);
}

function paralaxMouseInit(paralaxMouse) {
	paralaxMouse.forEach(el => {
		const paralaxMouseWrapper = el.closest('[data-prlx-mouse-wrapper]');

		// Коэф. X 
		const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 20;
		// Коэф. У 
		const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 20;
		// Напр. Х
		const directionX = el.hasAttribute('data-prlx-dxr') ? -1 : 1;
		// Напр. У
		const directionY = el.hasAttribute('data-prlx-dyr') ? -1 : 1;
		// Скорость анимации
		const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 100;


		// Объявление переменных
		let positionX = 0, positionY = 0;
		let coordXprocent = 0, coordYprocent = 0;

		setMouseParallaxStyle();

		// Проверяю на наличие родителя, в котором будет считываться положение мыши
		if (paralaxMouseWrapper) {
			mouseMoveParalax(paralaxMouseWrapper);
		} else {
			mouseMoveParalax();
		}

		function setMouseParallaxStyle() {
			const distX = coordXprocent - positionX;
			const distY = coordYprocent - positionY;
			positionX = positionX + (distX * paramAnimation / 1000);
			positionY = positionY + (distY * paramAnimation / 1000);
			el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0);`;
			requestAnimationFrame(setMouseParallaxStyle);
		}
		function mouseMoveParalax(wrapper = window) {
			wrapper.addEventListener("mousemove", function (e) {
				const offsetTop = el.getBoundingClientRect().top + window.scrollY;
				if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
					// Получение ширины и высоты блока
					const parallaxWidth = window.innerWidth;
					const parallaxHeight = window.innerHeight;
					// Ноль по середине
					const coordX = e.clientX - parallaxWidth / 2;
					const coordY = e.clientY - parallaxHeight / 2;
					// Получаем проценты
					coordXprocent = coordX / parallaxWidth * 100;
					coordYprocent = coordY / parallaxHeight * 100;
				}
			});
		}
	});
}

/* ====================================
Функции инициализация кастомный курсор в блоке
==================================== */
function addCursorHover(hoveredElement, selectedElement, newClass) {
	document.querySelectorAll(hoveredElement).forEach(hover => {
		hover.addEventListener('mouseenter', function () {
			document.querySelector(selectedElement).classList.add(newClass)
		})
		hover.addEventListener('mouseleave', function () {
			document.querySelector(selectedElement).classList.remove(newClass)
		})
		hover.addEventListener('mousemove', function () {
			document.querySelector(selectedElement).classList.add(newClass)
		})
	});
}
function addCursorDrag(hoveredElement, selectedElement, newClass) {
	document.querySelectorAll(hoveredElement).forEach(hover => {
		hover.addEventListener('mousedown', function () {
			document.querySelector(selectedElement).classList.add(newClass)
		})
	});
	document.body.addEventListener('mouseup', function () {
		document.querySelector(selectedElement).classList.remove(newClass)
	})
}
function addCursorMove(selectedElement) {
	document.body.addEventListener('mousemove', function (e) {
		setTimeout(() => {
			document.querySelector(selectedElement).style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
		}, 0);
	});
}
// function hideCursor(selectedElement, newClass) {
// 	document.querySelector(selectedElement).classList.remove(newClass)
// }
// window.addEventListener('scroll', function () {
// 	hideCursor(".cursor", "cursor__active")
// })

/* ====================================
Прогресс прокрутки страницы
==================================== */
function progressBar() {
	let scroll = document.body.scrollTop || document.documentElement.scrollTop;
	let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	let scrolled = scroll / height * 100;
	document.getElementById('progressBar').style.width = scrolled + '%';
}
window.addEventListener('scroll', progressBar);

/* ====================================
Разделение слов на буквы и hover с заменой (работает по классу)
==================================== */
document.querySelectorAll('.split-text').forEach(button => {
	button.innerHTML =
		'<span class="split-text-wrapper">' +
		'<span class="split-text-origin"><span>' + button.textContent.trim().split('').join('</span><span>') + '</span></span>' +
		'<span class="split-text-copy"><span>' + button.textContent.trim().split('').join('</span><span>') + '</span></span>' +
		'</span>'
});

document.querySelectorAll('.rs-btn').forEach(button => {
	button.querySelector('.btn-text').classList.add('split-text')
	button.querySelector('.btn-text').innerHTML =
		'<span class="split-text-wrapper">' +
		'<span class="split-text-origin"><span>' + button.textContent.trim().split('').join('</span><span>') + '</span></span>' +
		'<span class="split-text-copy"><span>' + button.textContent.trim().split('').join('</span><span>') + '</span></span>' +
		'</span>'
});

// Создаем svg по размерам кнопки
function SVGRoundedButtons() {
	const btns = document.querySelectorAll('.rs-btn');

	btns.forEach(btn => {
		var width = Math.round(btn.getBoundingClientRect().width);
		var height = Math.round(btn.getBoundingClientRect().height);
		var start = 40;

		var svgWrappers = btn.querySelectorAll('.svg-wrapper');
		var length = 0;

		svgWrappers.forEach(function (wrapper) {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
			svg.appendChild(path);
			svg.setAttribute('width', width);
			svg.setAttribute('height', height);
			svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height + '');
			path.setAttribute('d', 'M ' + width / 2 + ' ' + 0 + ' H ' + (width - height / 2) + ' A ' + height / 2 + ' ' + height / 2 + ' ' + 0 + ' ' + 0 + ' ' + 1 + ' ' + (width - height / 2) + ' ' + height + ' H ' + height / 2 + ' A ' + height / 2 + ' ' + height / 2 + ' ' + 0 + ' ' + 0 + ' ' + 1 + ' ' + height / 2 + ' ' + 0 + ' Z ');
			length = Math.round(path.getTotalLength());
			wrapper.appendChild(svg);
			wrapper.classList.contains('svg-wrapper--thin') ? wrapper.querySelector('svg').classList.add('thin') : wrapper.querySelector('svg').classList.add('progress');
			wrapper.querySelector('svg path').style.strokeDasharray = length + ' ' + length;
			wrapper.querySelector('svg path').style.strokeDashoffset = length;
		});
	});
}
SVGRoundedButtons()

document.querySelectorAll('.rs-header__menu .menu__list li a').forEach(link => {
	link.classList.add('split-text')
	link.innerHTML =
		'<span class="split-text-wrapper">' +
		'<span class="split-text-origin"><span>' + link.textContent.trim().split('').join('</span><span>') + '</span></span>' +
		'<span class="split-text-copy"><span>' + link.textContent.trim().split('').join('</span><span>') + '</span></span>' +
		'</span>'
});

document.querySelectorAll('.rs-footer__menu .menu__list li a').forEach(link => {
	link.classList.add('split-text')
	link.innerHTML =
		'<span class="split-text-wrapper">' +
		'<span class="split-text-origin"><span>' + link.textContent.trim().split('').join('</span><span>') + '</span></span>' +
		'<span class="split-text-copy"><span>' + link.textContent.trim().split('').join('</span><span>') + '</span></span>' +
		'</span>'
});

//========================================================================================================================================================
// Обработа медиа запросов из атрибутов 
function dataMediaQueries(array, dataSetValue) {
	// Получение объектов с медиа запросами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	// Инициализация объектов с медиа запросами
	if (media.length) {
		const breakpointsArray = [];
		media.forEach(item => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с нужными условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			});
			return mdQueriesArray;
		}
	}
}

// Уникализация массива
function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}

//========================================================================================================================================================
// Вспомогательные модули блокировки прокрутки
let bodyLockStatus = true;
let bodyLockToggle = (delay = 300) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}
let bodyUnlock = (delay = 300) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}
let bodyLock = (delay = 300) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}

//========================================================================================================================================================
// Вспомогательные модули плавного раскрытия и закрытия объекта
let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showmore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty('height') : null;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}
