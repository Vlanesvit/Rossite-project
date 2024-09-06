// Подключение списка активных модулей
import { vnvModules } from "./modules.js";
import { handleReveal } from "../libs/animation-gsap.js";

/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
export function isWebp() {
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
/* Проверка мобильного браузера */
export let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
/* Добавление класса touch для HTML если браузер мобильный */
export function addTouchClass() {
	// Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');
}
// Добавление loaded для HTML после полной загрузки страницы
export function addLoadedClass() {
	setTimeout(function () {
		document.documentElement.classList.add('loaded');
	}, 0);
}
// Получение хеша в адресе сайта
export function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
// Указание хеша в адресе сайта
export function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split('#')[0];
	history.pushState('', '', hash);
}
// Учет плавающей панели на мобильных устройствах при 100vh
export function fullVHfix() {
	const fullScreens = document.querySelectorAll('[data-fullscreen]');
	if (fullScreens.length && isMobile.any()) {
		window.addEventListener('resize', fixHeight);
		function fixHeight() {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
		fixHeight();
	}
}
// Вспомогательные модули плавного расскрытия и закрытия объекта ======================================================================================================================================================================
export let _slideUp = (target, duration = 500, showmore = 0) => {
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
			// Создаем событие 
			document.dispatchEvent(new CustomEvent("slideUpDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
export let _slideDown = (target, duration = 500, showmore = 0) => {
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
			// Создаем событие 
			document.dispatchEvent(new CustomEvent("slideDownDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
export let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}
// Вспомогательные модули блокировки прокрутки и скочка ====================================================================================================================================================================================================================================================================================
export let bodyLockStatus = true;
export let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}
export let bodyUnlock = (delay = 500) => {
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
export let bodyLock = (delay = 500) => {
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
// Модуль работы со спойлерами =======================================================================================================================================================================================================================
/*
Документация по работе в шаблоне: https://template.vnv.guru/template-docs/modul-spojlery.html
Сниппет (HTML): spollers
*/
export function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');

	function spollerClassInit() {
		spollersArray.forEach(spoller => {
			if (spoller) {
				const spollersItem = spoller.querySelectorAll('[class*="_item"]')

				spoller.classList.add('spollers')

				spollersItem.forEach(item => {
					if (item) {
						const spollerTitle = item.querySelector('[class*="_title"]')
						const spollerBody = item.querySelector('[class*="_body"]')

						item.classList.add('spollers__item')
						if (spollerTitle) {
							spollerTitle.classList.add('spollers__title')
						}
						if (spollerBody) {
							spollerBody.classList.add('spollers__body')
						}
					}
				});
			}
		});
	}
	spollerClassInit()

	if (spollersArray.length > 0) {
		// Получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных слойлеров
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}
		// Получение слойлеров с медиа запросами
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
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
			let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter(item => item.closest('[data-spollers]') === spollersBlock);
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.closest('.spollers__item').querySelector('.spollers__body').hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.closest('.spollers__item').querySelector('.spollers__body').hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest('[data-spoller]')) {
				const spollerTitle = el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_spoller-active');
					_slideToggle(spollerTitle.closest('.spollers__item').querySelector('.spollers__body'), spollerSpeed);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
			const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
			if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
				spollerActiveTitle.classList.remove('_spoller-active');
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
			}
		}
		// Закрытие при клике вне спойлера
		const spollersClose = document.querySelectorAll('[data-spoller-close]');
		if (spollersClose.length) {
			document.addEventListener("click", function (e) {
				const el = e.target;
				if (!el.closest('[data-spollers]')) {
					spollersClose.forEach(spollerClose => {
						const spollersBlock = spollerClose.closest('[data-spollers]');
						if (spollersBlock.classList.contains('_spoller-init')) {
							const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
							spollerClose.classList.remove('_spoller-active');
							_slideUp(spollerClose.nextElementSibling, spollerSpeed);
						}
					});
				}
			});
		}
	}
}
// Модуь работы с табами =======================================================================================================================================================================================================================
/*
Документация по работе в шаблоне: https://template.vnv.guru/template-docs/modul-taby.html
Сниппет (HTML): tabs
*/
export function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash = [];

	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-');
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init');
			tabsBlock.setAttribute('data-tabs-index', index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});

		// Получение слойлеров с медиа запросами
		let mdQueriesArray = dataMediaQueries(tabs, "tabs");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
	}
	// Установка позиций заголовков
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach(tabsMediaItem => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
			let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
			let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
			let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
			tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add('_tab-spoller');
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove('_tab-spoller');
				}
			});
		});
	}
	// Работа с контентом
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
			tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
		}
		if (tabsContent.length) {
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '');
				tabsContentItem.setAttribute('data-tabs-item', '');

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add('_tab-active');
				}
				tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
			});
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute('data-tabs-hash');
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) {
						_slideDown(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = false;
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`);
					}
				} else {
					if (tabsBlockAnimate) {
						_slideUp(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = true;
					}
				}
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest('[data-tabs-title]')) {
			const tabTitle = el.closest('[data-tabs-title]');
			const tabsBlock = tabTitle.closest('[data-tabs]');
			if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
				let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
				tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
				tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
				tabTitle.classList.add('_tab-active');
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}
// Модуль работы с меню (бургер) =======================================================================================================================================================================================================================
/*
Документация по работе в шаблоне: https://template.vnv.guru/template-docs/menu-burger.html
Сниппет (HTML): menu
*/
export function menuInit() {
	if (document.querySelector(".icon-menu")) {
		document.addEventListener("click", function (e) {
			if (bodyLockStatus && e.target.closest('.icon-menu')) {
				menuToggle();
			}
		});
	};
}
export function menuOpen() {
	bodyLock();
	document.documentElement.classList.add("menu-open");
}
export function menuClose() {
	bodyUnlock();
	document.documentElement.classList.remove("menu-open");
}
export function menuToggle() {
	bodyLockToggle();
	document.documentElement.classList.toggle("menu-open");
}

export function regionMenuOpen() {
	bodyLock();
	document.documentElement.classList.add("region-menu-open");
}
export function regionMenuClose() {
	bodyUnlock();
	document.documentElement.classList.remove("region-menu-open");
}
export function regionMenuToggle() {
	bodyLockToggle();
	document.documentElement.classList.toggle("region-menu-open");
}

// Меню
export function menu() {
	const menus = document.querySelectorAll('.rs-header .menu');

	menus.forEach(menu => {
		const menuItems = menu.querySelectorAll('.menu__list li.menu-item');

		// Все пункты с выпадающим меню
		const menuItemDropdowns = menu.querySelectorAll('.menu__list .menu__dropdown');
		const menuItemDropdownsMenu = menu.querySelectorAll('.menu__list .menu__dropdown_block');

		// 0-ой уровень
		const menuItemDropdownsNull = menu.querySelectorAll('.menu__list > .menu__dropdown');
		const menuItemDropdownsMenuNull = menu.querySelectorAll('.menu__list > .menu__dropdown > .menu__dropdown_block');

		// 1-ый уровень
		const menuItemDropdownsFirst = menu.querySelectorAll('.menu__list > .menu__dropdown > .menu__dropdown_block > .dropdown__container > .dropdown__columns > .menu__dropdown');
		const menuItemDropdownsMenuFirst = menu.querySelectorAll('.menu__list > .menu__dropdown > .menu__dropdown_block > .dropdown__container > .dropdown__columns > .menu__dropdown > .menu__dropdown_block');

		// 2-ой уровень
		const menuItemDropdownsTwo = menu.querySelectorAll('.menu__list > .menu__dropdown > .menu__dropdown_block > .dropdown__container > .dropdown__columns > .menu__dropdown > .menu__dropdown_block > .menu__dropdown');
		const menuItemDropdownsMenuTwo = menu.querySelectorAll('.menu__list > .menu__dropdown > .menu__dropdown_block > .dropdown__container > .dropdown__columns > .menu__dropdown > .menu__dropdown_block > .menu__dropdown > .menu__dropdown_block');

		// Добавление иконки в пункты с выпадающим меню
		menuItems.forEach(item => {
			const menuLinkDropdowns = item.querySelector('a');
			let iconDropdown = document.createElement('i');
			iconDropdown.classList.add('menu__dropdown-arrow')
			menuLinkDropdowns.append(iconDropdown);
		});

		menuItemDropdowns.forEach(item => {
			item.addEventListener('mouseenter', function () {
				item.closest('.rs-header').classList.add('_header-hover')
			})
			item.addEventListener('mouseleave', function () {
				item.closest('.rs-header').classList.remove('_header-hover')
			})
		});

		/* Один и тот же код для отдельных уровней меню, 
		чтобы открывался только один пункт, а открытые - закрывались, кроме тех, кто выше уровнем */
		function openLvlMenu(li, ul) {
			li.forEach(item => {
				const menuItemIcons = item.querySelector('a > .menu__dropdown-arrow');
				const menuItemBack = item.querySelector('.menu__dropdown_back');

				if (menuItemBack) {
					menuItemBack.addEventListener('click', (e) => {
						e.preventDefault();
						if (menuItemIcons.closest('.menu__dropdown').classList.contains('_open-menu')) {
							menuItemIcons.closest('.menu__dropdown').classList.remove('_open-menu');
						}
					})
				}

				if (window.innerWidth <= 991.98) {
					const menuItemLink = item.querySelector('a');
					menuItemLink.addEventListener('click', function (e) {
						e.preventDefault();
					})
				}

				// Открытие меню при клике на иконку
				menuItemIcons.addEventListener('click', (e) => {
					e.preventDefault();

					// Проходимся по всем пунктам и ищем активные классы, убираем их и добавляем активный класс кликнутому пункту
					if (!menuItemIcons.closest('.menu__dropdown').classList.contains('_open-menu')) {
						li.forEach(itemDrop => {
							if (itemDrop.classList.contains('_open-menu')) {
								itemDrop.classList.remove('_open-menu')
							}
						});
						menuItemIcons.closest('.menu__dropdown').classList.add('_open-menu');
					} else if (menuItemIcons.closest('.menu__dropdown').classList.contains('_open-menu')) {
						menuItemIcons.closest('.menu__dropdown').classList.remove('_open-menu');
					}
				});
			});
		}
		// Пункты 0-го уровня меню
		openLvlMenu(menuItemDropdownsNull, menuItemDropdownsMenuNull)
		// Пункты 1-го уровня меню
		openLvlMenu(menuItemDropdownsFirst, menuItemDropdownsMenuFirst)
		// Пункты 2-го уровня меню
		openLvlMenu(menuItemDropdownsTwo, menuItemDropdownsMenuTwo)

		// При клике на бургер убираем открые меню и активные класс
		document.addEventListener("click", function (e) {
			if (e.target.closest('.menu__icon')) {
				menuItemDropdownsMenu.forEach(menu => {
					_slideUp(menu, 500);
				});
				menuItemDropdowns.forEach(item => {
					item.classList.remove('_open-menu');
				});

				regionMenuClose()
			}
		});
	});
}

export function regionMenu() {
	const regionBtns = document.querySelectorAll('.rs-header__location_show-search');
	const regionVerf = document.querySelectorAll('.rs-header__location_verification');
	const regionModal = document.querySelectorAll('.rs-header__location_modal');
	const regionBlockClose = document.querySelectorAll('.rs-header__region_close');
	const regionModalInnerMenuBtn = document.querySelector('.rs-header__container > .rs-header__location_modal .rs-header__location_show-search');

	// Открывает модальное окно подтверждение локации
	window.addEventListener('load', function () {
		setTimeout(() => {
			document.documentElement.classList.toggle("location-modal-open");
		}, 3000);
	})

	if (regionBtns.length > 0) {
		regionBtns.forEach(regionBtn => {
			regionBtn.addEventListener('click', function (e) {
				e.preventDefault();

				// Удаляет класс модального окна подтвеждения локации + открывает модальное окно выбора региона
				if (document.documentElement.classList.contains('location-modal-open')) {
					document.documentElement.classList.remove('location-modal-open')
				}

				if (!document.documentElement.classList.contains('region-menu-open')) {
					regionMenuOpen()
					regionBtn.closest('.rs-header').classList.add('_header-hover')
				}
			})
		});
	}

	if (regionBlockClose.length > 0) {
		regionBlockClose.forEach(close => {
			close.addEventListener('click', function (e) {
				e.preventDefault();

				// Закрывает модальное окно выбора региона
				if (document.documentElement.classList.contains('region-menu-open')) {
					regionMenuClose()
					close.closest('.rs-header').classList.remove('_header-hover')
				}
			});
		})
	}

	if (regionVerf.length > 0) {
		regionVerf.forEach(verf => {
			verf.addEventListener('click', function (e) {
				e.preventDefault();

				// Удаляет класс модального окна подтвеждения локации
				if (document.documentElement.classList.contains('location-modal-open')) {
					document.documentElement.classList.remove('location-modal-open')
				}
			})
		});
	}

	if (regionModalInnerMenuBtn) {
		regionModalInnerMenuBtn.addEventListener('click', function (e) {
			e.preventDefault();
			document.querySelector('.rs-header').classList.add('_header-show')
			menuOpen()
			regionMenuOpen()
		})
	}

	// Поиск по регионам
	function searchRegion() {
		const regionBlock = document.querySelectorAll('.rs-header__region');
		regionBlock.forEach(region => {
			const listRegion = region.querySelectorAll('.rs-header__region_select .rs-header__region_list li');
			const inputRegion = region.querySelector('.rs-header__region_field input');

			inputRegion.addEventListener('input', function () {
				const filterRegion = inputRegion.value.toUpperCase();

				listRegion.forEach(item => {
					const textValue = item.textContent;

					if (textValue.toUpperCase().indexOf(filterRegion) === 0) {
						console.log(textValue.toUpperCase().indexOf(filterRegion) === 0);
						item.classList.remove('hidden');
						item.parentElement.parentElement.classList.remove('hidden');

					} else {
						item.classList.add('hidden');
						item.parentElement.parentElement.classList.add('hidden');
					}

					const listRegionShow = region.querySelectorAll('.rs-header__region_select .rs-header__region_list li:not(.hidden)');
					listRegionShow.forEach(itemShow => {
						itemShow.parentElement.parentElement.classList.remove('hidden');
					});
				});
			});
		});
	}
	searchRegion()

}

// Модуль "показать еще" =======================================================================================================================================================================================================================
/*
Документация по работе в шаблоне: https://template.vnv.guru/template-docs/modul-pokazat-eshhjo.html
Сниппет (HTML): showmore
*/
export function showMore() {
	const showMoreBlocks = document.querySelectorAll('[data-showmore]');
	let showMoreBlocksRegular;
	let mdQueriesArray;
	if (showMoreBlocks.length) {
		// Получение обычных объектов
		showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
			return !item.dataset.showmoreMedia;
		});
		// Инициализация обычных объектов
		showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

		document.addEventListener("click", showMoreActions);
		window.addEventListener("resize", showMoreActions);

		// Получение объектов с медиа запросами
		mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
			});
			initItemsMedia(mdQueriesArray);
		}
	}
	function initItemsMedia(mdQueriesArray) {
		mdQueriesArray.forEach(mdQueriesItem => {
			initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
	}
	function initItems(showMoreBlocks, matchMedia) {
		showMoreBlocks.forEach(showMoreBlock => {
			initItem(showMoreBlock, matchMedia);
		});
	}
	function initItem(showMoreBlock, matchMedia = false) {
		showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
		let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
		let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
		showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
		showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
		const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
		if (matchMedia.matches || !matchMedia) {
			if (hiddenHeight < getOriginalHeight(showMoreContent)) {
				_slideUp(showMoreContent, 0, hiddenHeight);
				showMoreBlock.classList.add('_showmore-hide')
				showMoreButton.hidden = false;
			} else {
				_slideDown(showMoreContent, 0, hiddenHeight);
				showMoreBlock.classList.add('_showmore-nohide')
				showMoreButton.hidden = true;
			}
		} else {
			_slideDown(showMoreContent, 0, hiddenHeight);
			showMoreBlock.classList.add('_showmore-nohide')
			showMoreButton.hidden = true;
		}
	}
	function getHeight(showMoreBlock, showMoreContent) {
		let hiddenHeight = 0;
		const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size';
		if (showMoreType === 'items') {
			const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
			const showMoreItems = showMoreContent.children;
			for (let index = 1; index < showMoreItems.length; index++) {
				const showMoreItem = showMoreItems[index - 1];
				hiddenHeight += showMoreItem.offsetHeight;
				if (index == showMoreTypeValue) break
			}
		} else {
			const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
			hiddenHeight = showMoreTypeValue;
		}
		return hiddenHeight;
	}
	function getOriginalHeight(showMoreContent) {
		let parentHidden;
		let hiddenHeight = showMoreContent.offsetHeight;
		showMoreContent.style.removeProperty('height');
		if (showMoreContent.closest(`[hidden]`)) {
			parentHidden = showMoreContent.closest(`[hidden]`);
			parentHidden.hidden = false;
		}
		let originalHeight = showMoreContent.offsetHeight;
		parentHidden ? parentHidden.hidden = true : null;
		showMoreContent.style.height = `${hiddenHeight}px`;
		return originalHeight;
	}
	function showMoreActions(e) {
		const targetEvent = e.target;
		const targetType = e.type;
		if (targetType === 'click') {
			if (targetEvent.closest('[data-showmore-button]')) {
				const showMoreButton = targetEvent.closest('[data-showmore-button]');
				const showMoreBlock = showMoreButton.closest('[data-showmore]');
				const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
				const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : '500';
				const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
				if (!showMoreContent.classList.contains('_slide')) {
					showMoreBlock.classList.contains('_showmore-active') ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
					showMoreBlock.classList.toggle('_showmore-active');
					handleReveal(); // Обновление ScrollTrigger после появления новых элементов
				}
			}
		} else if (targetType === 'resize') {
			showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
			mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
		}
	}
}
//================================================================================================================================================================================================================================================================================================================
// Прочие полезные функции ================================================================================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================================================================================
// vnv (Full Logging System)
export function vnv(message) {
	setTimeout(() => {
		if (window.vnv) {
			console.log(message);
		}
	}, 0);
}
// Получить цифры из строки
export function getDigFromString(item) {
	return parseInt(item.replace(/[^\d]/g, ''))
}
// Форматирование цифр типа 100 000 000
export function getDigFormat(item) {
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}
// Убрать класс из всех элементов массива
export function removeClasses(array, className) {
	for (var i = 0; i < array.length; i++) {
		array[i].classList.remove(className);
	}
}
// Уникализация массива
export function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}
// Функция получения индекса внутри родителя
export function indexInParent(parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};
// Обработа медиа запросов из атрибутов 
export function dataMediaQueries(array, dataSetValue) {
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
//================================================================================================================================================================================================================================================================================================================