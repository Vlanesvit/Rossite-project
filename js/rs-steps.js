/* ====================================
Скролл к блоку + поместить активный класс
==================================== */
function sidebarNavigation() {
	const indicators = document.querySelectorAll('.rs-steps__navigation_list a');
	const resetCurrentActiveIndicator = () => {
		const activeIndicator = document.querySelector("._active-step");
		activeIndicator.classList.remove("_active-step");
	};
	indicators.forEach((indicator) => {
		indicator.addEventListener('click', function () {
			resetCurrentActiveIndicator();
			this.classList.add('_active-step');
		});
	});

	const sections = document.querySelectorAll(".rs-steps__spollers_item");
	const onSectionLeavesViewport = (section) => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						resetCurrentActiveIndicator();
						const element = entry.target;
						const indicator = document.querySelector(`.rs-steps__navigation_list a[href='#${element.id}']`);
						indicator.classList.add("_active-step");
						return;
					}
				});
			},
			{
				// root: null,
				// rootMargin: "0px",
				threshold: 0.75
			}
		);
		observer.observe(section);
	};
	sections.forEach(onSectionLeavesViewport);

	indicators.forEach((indicator) => {
		indicator.addEventListener('click', function () {
			document
				.querySelector(this.getAttribute('href'))
				.scrollIntoView({ behavior: 'smooth' });
		});
	});
}
if (document.querySelector('.rs-steps__spollers_item') && document.querySelector('.rs-steps__navigation_list a')) {
	sidebarNavigation()
}