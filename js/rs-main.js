/* ====================================
Инициализация слайдера в блоке rs-logo
==================================== */
function initLogoSliders() {
	// Перечень слайдеров
	if (document.querySelector('.rs-main__logo_slider')) {
		const swiperMain = new Swiper('.rs-main__logo_slider', {
			// Автопрокрутка
			autoplay: {
				// Пауза между прокруткой
				delay: 1,
				// delay: 5000,
				// Закончить на последнем слайде
				stopOnLastSlide: false,
				// Отключить после ручного переключения
				disableOnInteraction: false,
				// Изменить направление
				// reverseDirection: true,
			},

			// Обновить свайпер
			// при изменении элементов слайдера
			observer: true,
			// при изменении родительских элементов слайдера
			observeParents: true,
			// при изменении дочерних элементов слайдера
			observeSlideChildren: true,

			// Скорость смены слайдов
			speed: 5000,

			// Включение/отключение
			// перетаскивание на ПК
			simulateTouch: true,
			allowTouchMove: true,
			// Чувствительность свайпа
			touchRadio: 1,
			// Угол срабатывания свайпа/перетаскивания
			touchAngle: 45,

			// Цикличность слайдера
			loop: true,

			// Курсор перетаскивания
			grabCursor: true,

			// Анимация переключения
			// effect: 'fade',

			slidesPerView: 'auto',
			spaceBetween: 24,
		});
	}

}
window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initLogoSliders();
});

// function sidebarMaaNavigation() {
// 	const indicators = document.querySelectorAll('.rs-main__project_nav_body ul li a');
// 	const resetCurrentActiveIndicator = () => {
// 		const activeIndicator = document.querySelector("._active-step");
// 		activeIndicator.classList.remove("_active-step");
// 	};
// 	indicators.forEach((indicator) => {
// 		indicator.addEventListener('click', function () {
// 			resetCurrentActiveIndicator();
// 			this.classList.add('_active-step');
// 		});
// 	});

// 	const sections = document.querySelectorAll(".rs-main__project_item");
// 	const onSectionLeavesViewport = (section) => {
// 		const observer = new IntersectionObserver(
// 			(entries) => {
// 				entries.forEach((entry) => {
// 					if (entry.isIntersecting) {
// 						resetCurrentActiveIndicator();
// 						const element = entry.target;
// 						const indicator = document.querySelector(`.rs-main__project_nav_body ul li a[href='#${element.id}']`);
// 						indicator.classList.add("_active-step");
// 						return;
// 					}
// 				});
// 			},
// 			{
// 				// root: null,
// 				// rootMargin: "0px",
// 				threshold: 0.75
// 			}
// 		);
// 		observer.observe(section);
// 	};
// 	sections.forEach(onSectionLeavesViewport);

// 	indicators.forEach((indicator) => {
// 		indicator.addEventListener('click', function () {
// 			document
// 				.querySelector(this.getAttribute('href'))
// 				.scrollIntoView({ behavior: 'smooth' });
// 		});
// 	});
// }
// if (document.querySelector('.rs-main__project_item') && document.querySelector('.rs-main__project_nav_body ul li a')) {
// 	sidebarMaaNavigation()
// }


let links = gsap.utils.toArray(".rs-main__project_nav_body ul li a");
links.forEach(a => {
	let element = document.querySelector(a.getAttribute("href")),
		linkST = ScrollTrigger.create({
			trigger: element,
			start: "top top"
		});
	ScrollTrigger.create({
		trigger: element,
		start: "top center",
		end: "bottom center",
		onToggle: self => self.isActive && setActive(a)
	});
	a.addEventListener("click", e => {
		e.preventDefault();
		gsap.to(window, { duration: 1, scrollTo: linkST.start, overwrite: "auto" });
	});
});

function setActive(link) {
	links.forEach(el => el.classList.remove("_active-step"));
	link.classList.add("_active-step");
}