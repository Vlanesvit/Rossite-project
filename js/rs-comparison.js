// Инициализация сравнения картинок
function comparison() {
	const comparison = document.getElementById('image-compare')
	if (comparison) {
		const comparisonViewer = new ImageCompare(comparison, {
			// UI Theme Defaults
			controlColor: "#FFFFFF",
			controlShadow: false,
			addCircle: true,
			addCircleBlur: false,

			// Label Defaults
			showLabels: false,
			labelOptions: {
				before: 'Before',
				after: 'After',
				onHover: false
			},

			// Smoothing
			smoothing: true,
			smoothingAmount: 0,

			// Other options
			hoverStart: true,
			verticalMode: false,
			startingPoint: 50,
			fluidMode: true,
		}).mount();
	}
}
comparison()

// Инициализация курсора
addCursorHover(".rs-comparison__compare", ".rs-comparison .icv__circle", "cursor__active");
addCursorMove(".icv__circle")
