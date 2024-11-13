<?php
//Баннеры/слайдеры inc/functions/rs-banner-block-functions.php
//Верхний баннер
add_action('template_on_main_banner', 'rs_main_banner');
//слайдер О продукте
add_action('template_on_slider-prod', 'rs_slider_prod');
//слайдер О продукте 2 версия
add_action('template_on_slider-prod-development', 'rs_slider_development');
//слайдер Логотипы
add_action('template_on_slaider_logo', 'rs_slider_logo');
//Слайдер (результаты клиентов)
add_action('template_on_slider-result', 'rs_slider_result');
//слайдер Дополнительно
add_action('template_on_services', 'rs_services',100,2);
//слайдер Из прототипа в дизайн
add_action('template_on_comparison', 'rs_comparison');
//слайдер Преимущества
add_action('template_on_features', 'rs_features_slider');
//баннер Что такое контекстная реклама?
add_action('template_on_info-block', 'rs_info_block');
//баннер Почему SEO у нас стоит ...?
add_action('template_on_why-block', 'rs_why_block');

//Текстовые блоки inc/functions/rs-text-block-functions.php
//текст с картинкой паралаксом
add_action('template_on_text-block-1', 'rs_text_block_1');
add_action('template_on_text-block-workflow', 'rs_text_block_workflow');
//Текстовый блок (текст + картинка)
add_action('template_on_text-block-about', 'rs_text_block_about');
//Текстовый блок (Описание услуги)
add_action('template_on_services-about', 'rs_services_about');
//текст в 2 колонки
add_action('template_on_task_list', 'rs_task_list');
//Функционал
add_action('template_on_task_spollers', 'rs_task_spollers');
//Нумерованный  список (шаги)
add_action('template_on_step', 'rs_step');
//Преимущества (с иконками)
add_action('template_on_features_icons', 'rs_features_icons');
//Преимущества (колонки)
add_action('template_on_task-features', 'rs_features_task');
//Сферы услуг
add_action('template_on_services-sector-development', 'rs_services_development');
//Отрасли (сетка)
add_action('template_on_grid-block', 'rs_grid_block');

//Формы inc/functions/rs-feedback-functions.php
add_action('template_on_feedback', 'rs_feedback_development');
add_action('template_on_feedback-development', 'rs_feedback_development');

//Наши работы inc/functions/rs-project-functions.php
add_action('template_on_project', 'rs_project');

//Тарифы inc/functions/rs-tariff-functions.php
add_action('template_on_tariff', 'rs_tariff');
add_action('template_on_tariff-support', 'rs_tariff_support');
add_action('template_on_services-price', 'rs_tariff_services');
add_action('template_on_tariff_advert', 'rs_tariff_advert');
add_action('template_on_tariff_logo', 'rs_tariff_logo');
add_action('template_on_tariff-development', 'rs_tariff');

//Партнеры inc/functions/rs-partner-functions.php
add_action('template_on_partner', 'rs_partner');
add_action('template_on_partner_main', 'rs_main_partner');
add_action('template_on_partner_contact', 'rs_partner');

//Табы/вклвдки/аккардеоны inc/functions/rs-tabs-functions.php
//Над сайтом будут работать
add_action('template_on_spoller', 'rs_spoller');
add_action('template_on_spoller-development', 'rs_spoller_development');
//FAQ (Ответы на часто задаваемые вопросы:)
add_action('template_on_faq', 'rs_faq');

//Отзывы inc/functions/rs-reviews-functions.php
add_action('template_on_reviews', 'rs_reviews');

//Контакты inc/functions/rs-city-functions.php
add_action('template_on_documents_contact', 'rs_documents_contact');
add_action('template_on_contacts_contact', 'rs_contacts');