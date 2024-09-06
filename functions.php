<?php

//Кастомизация темы
require get_template_directory() . '/inc/customizer.php';

// Подключение сервисных функций
require 'inc/template-functions.php';

// Подключение Стилей и скриптов
require 'inc/enqueue_scripts.php';

// Подключение функционала для хедера
require 'inc/functions/rs-header-functions.php';

// Подключение функционала для футера
require 'inc/functions/rs-footer-functions.php';

// Подключение функционала блоков шаблонов страниц
require 'inc/functions/rs-page-functions.php';

// Подключение функционала для баннеров/слайдеров/
require 'inc/functions/rs-banner-block-functions.php';

// Подключение функционала для текстовых блоков
require 'inc/functions/rs-text-block-functions.php';

// Подключение функционала для форм
require 'inc/functions/rs-feedback-functions.php';

// Подключение функционала для работы с Кейсами
require 'inc/functions/rs-project-functions.php';

// Подключение функционала для работы с Тарифами
require 'inc/functions/rs-tariff-functions.php';

// Подключение функционала для работы с Партнерами
require 'inc/functions/rs-partner-functions.php';

// Подключение функционала для работы с Табы/вклвдки/аккардеоны
require 'inc/functions/rs-tabs-functions.php';

// Подключение функционала для работы с Отзывы
require 'inc/functions/rs-reviews-functions.php';

// Подключение функционала для работы с Городами
require 'inc/functions/rs-city-functions.php';

