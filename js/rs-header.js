
/* ====================================
Меню
==================================== */
function menuFunction() {
	const menus = document.querySelectorAll('.rs-header .menu');

	// Бургер
	function menuBurger() {
		menus.forEach(menu => {
			const menuBurgerBtn = menu.querySelector('.menu__icon');

			menuBurgerBtn.addEventListener("click", function (e) {
				// Показать меню
				menuToggle();
			});
		});
	};
	if (document.querySelector(".menu__icon")) {
		menuBurger()
	}

	// Меню
	function menuInit() {
		menus.forEach(menu => {
			const menuItems = menu.querySelectorAll('.menu__list li');

			// Все пункты с выпадающим меню
			const menuItemDropdowns = menu.querySelectorAll('.menu__list .dropdown-item');
			const menuItemDropdownsMenu = menu.querySelectorAll('.menu__list .dropdown__menu');

			// 0-ой уровень
			const menuItemDropdownsNull = menu.querySelectorAll('.menu__list > .dropdown-item');
			const menuItemDropdownsMenuNull = menu.querySelectorAll('.menu__list > .dropdown-item > .dropdown__menu');

			// 1-ый уровень
			const menuItemDropdownsFirst = menu.querySelectorAll('.menu__list > .dropdown-item > .dropdown__menu > .dropdown__container > .dropdown__columns > .dropdown-item');
			const menuItemDropdownsMenuFirst = menu.querySelectorAll('.menu__list > .dropdown-item > .dropdown__menu > .dropdown__container > .dropdown__columns > .dropdown-item > .dropdown__menu');
	
			// 2-ой уровень
			const menuItemDropdownsTwo = menu.querySelectorAll('.menu__list > .dropdown-item > .dropdown__menu > .dropdown__container > .dropdown__columns > .dropdown-item > .dropdown__menu > .dropdown-item');
			const menuItemDropdownsMenuTwo = menu.querySelectorAll('.menu__list > .dropdown-item > .dropdown__menu > .dropdown__container > .dropdown__columns > .dropdown-item > .dropdown__menu > .dropdown-item > .dropdown__menu');

			// Добавление иконки в пункты с выпадающим меню
			menuItemDropdowns.forEach(item => {
				const menuLinkDropdowns = item.querySelector('a');
				let iconDropdown = document.createElement('i');
				menuLinkDropdowns.append(iconDropdown);
			});

			/* Один и тот же код для отдельных уровней меню, 
			чтобы открывался только один пункт, а открытые - закрывались, кроме тех, кто выше уровнем */
			function openLvlMenu(li, ul) {
				li.forEach(item => {
					const menuItemList = item.querySelector('.dropdown__menu');
					const menuItemIcons = item.querySelector('a > i');

					// Открытие меню при клике на иконку
					menuItemIcons.addEventListener('click', (e) => {
						e.preventDefault();
						_slideToggle(menuItemList, 500);
						ul.forEach(menu => {
							if (!menu.hasAttribute('hidden')) {
								_slideUp(menu, 500);
							}
						});

						// Проходимся по всем пунктам и ищем активные классы, убираем их и добавляем активный класс кликнутому пункту
						if (!menuItemIcons.closest('.dropdown-item').classList.contains('_open-menu')) {
							li.forEach(itemDrop => {
								if (itemDrop.classList.contains('_open-menu')) {
									itemDrop.classList.remove('_open-menu')
								}
							});
							menuItemIcons.closest('.dropdown-item').classList.add('_open-menu');
						} else if (menuItemIcons.closest('.dropdown-item').classList.contains('_open-menu')) {
							menuItemIcons.closest('.dropdown-item').classList.remove('_open-menu');
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
				}
			});
		});
	}
	menuInit()

	// Вспомогательные функции ========================================================================================================================================================
	// Функции открытия/закрытия бургер-меню с блокировкой скролла
	function menuOpen() {
		bodyLock();
		document.documentElement.classList.add("menu-open");
	}
	function menuClose() {
		bodyUnlock();
		document.documentElement.classList.remove("menu-open");
	}
	function menuToggle() {
		bodyLockToggle();
		document.documentElement.classList.toggle("menu-open");
	}
}
menuFunction()

/* ====================================
Якорные ссылки
==================================== */
// data-goto - указать ID блока
// data-goto-header - учитывать header
// data-goto-top - недокрутить на указанный размер
// data-goto-speed - скорость (только если используется доп плагин)
let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = "";
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = ".header";
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains("_header-scroll")) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add("_header-scroll");
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove("_header-scroll");
				setTimeout((() => {
					headerElement.style.cssText = ``;
				}), 0);
			} else headerItemHeight = headerElement.offsetHeight;
		}
		let options = {
			speedAsDuration: true,
			speed,
			header: headerItem,
			offset: offsetTop,
			easing: "linear"
		};
		document.documentElement.classList.contains("menu-open") ? menuClose() : null;
		if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
			let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
			targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
			targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
			window.scrollTo({
				top: targetBlockElementPosition,
				behavior: "smooth"
			});
		};
	};
}
function pageNavigation() {
	document.addEventListener("click", pageNavigationAction);
	document.addEventListener("watcherCallback", pageNavigationAction);
	function pageNavigationAction(e) {
		if ("click" === e.type) {
			const targetElement = e.target;
			if (targetElement.closest("[data-goto]")) {
				const gotoLink = targetElement.closest("[data-goto]");
				const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
				const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
				const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
				const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
				gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
				e.preventDefault();
			}
		} else if ("watcherCallback" === e.type && e.detail) {
			const entry = e.detail.entry;
			const targetElement = entry.target;
			if ("navigator" === targetElement.dataset.watch) {
				document.querySelector(`[data-goto]._navigator-active`);
				let navigatorCurrentItem;
				if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
					const element = targetElement.classList[index];
					if (document.querySelector(`[data-goto=".${element}"]`)) {
						navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
						break;
					}
				}
				if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
			}
		}
	}
}
pageNavigation();

/* ====================================
Header при скролле
==================================== */
function headerFixed() {
	const header = document.querySelector('.rs-header');
	let lastScrollTop = 0;

	function headerClassAdd() {
		header.classList.toggle('_header-fixed', window.scrollY > 0)
		let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		// Проверка на присутствие класса для бургер-меню. Если он есть, то шапка не скрывается
		if (document.documentElement.classList.contains("menu-open")) {
			header.style.top = "0px";
		}
		else {
			// Скрытие шапки
			if (scrollTop > lastScrollTop) {
				header.style.top = "-500px";
			} else {
				header.style.top = "0px";
			}
		}
		lastScrollTop = scrollTop;
	}

	window.addEventListener('scroll', function () {
		headerClassAdd()
	})
	window.addEventListener('load', function () {
		headerClassAdd()
	})
	window.addEventListener('resize', function () {
		headerClassAdd()
	})
}
headerFixed()

