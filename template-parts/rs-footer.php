<?php
global $office, $sales, $tech;
?>
<footer class="rs-footer">
    <div class="rs-footer__top">
        <div class="rs-footer__container">
            <div class="rs-footer__head">
                <div class="rs-footer__phone">
                    <a href="tel:<?= preg_replace('/[^0-9\+]+/', '', $sales['phone']) ?>"><?=$sales['phone']?></a>
                    <span>Отдел продаж</span>
                </div>
                <div class="rs-footer__links">
                    <ul>
                        <li>
                            <a href="#" class="rs-btn _btn-gray-border">
										<span class="btn-text">Анкета для разработки сайта
											«Бизнес»</span>
                                <span class="btn-hover"></span>

                            </a>
                        </li>
                        <li>
                            <a href="#" class="rs-btn _btn-gray-border">
                                <span class="btn-text">Презентация сайта «Бизнес»</span>
                                <span class="btn-hover"></span>

                            </a>
                        </li>
                        <li>
                            <a href="#" class="rs-btn _btn-gray-border">
                                <span class="btn-text">Технические характеристики сайта «Бизнес»</span>
                                <span class="btn-hover"></span>

                            </a>
                        </li>
                    </ul>
                </div>
                <div class="rs-footer__social social">
                    <ul class="social__list">
                        <li><a href="#" class="_rs-icon-vk"></a></li>
                        <li><a href="#" class="_rs-icon-whatsapp"></a></li>
                        <li><a href="#" class="_rs-icon-telegram"></a></li>
                        <li><a href="#" class="_rs-icon-instagram"></a></li>
                    </ul>
                </div>
            </div>


            <?php true_breadcrumbs();?>

            <?php
            $footer_menu = get_field("footer_menu",FRONT_PAGE);
            $menus = explode(",", $footer_menu);
            ?>

            <div class="rs-footer__body">
                <div data-spollers="991.98,max" class="rs-footer__spollers">
                    <?php
                    foreach ($menus as $id):
                    if(wp_get_nav_menu_object( $id)):?>
                    <div class="rs-footer__spollers_item">
                        <button type="button" data-spoller class="rs-footer__spollers_title"><?=wp_get_nav_menu_object( $id)->name?></button>
                        <div class="rs-footer__spollers_body">
                            <div class="rs-footer__menu menu">
                                <?php
                                $args = [
                                    'theme_location'  => '',
                                    'menu'            => $id,
                                    'container'       => 'nav',
                                    'container_class' => 'menu__body',
                                    'container_id'    => '',
                                    'menu_class'      => 'menu__list',
                                    'menu_id'         => '',
                                    'echo'            => true,
                                    'fallback_cb'     => '',
                                    'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                                    'depth'           => 0,
                                    'walker'          =>'',
                                ];
                                wp_nav_menu($args);
                                ?>
                            </div>
                        </div>
                    </div>
                    <?php endif;
                    endforeach;
                    ?>
                    <div class="rs-footer__spollers_item">
                        <button type="button" data-spoller class="rs-footer__spollers_title _spoller-active">Контактная
                            информация</button>
                        <div class="rs-footer__spollers_body">
                            <div class="rs-footer__contact contact">
                                <ul class="contact__list">
                                    <li><?=$office['office_addr']?>
                                        <span>центральный офис</span>
                                    </li>
                                    <li>
                                        <?=$office['yuridicheskij_adres']?>
                                        <span>юридический адрес <a href="/about/">(учередительные
														документы)</a></span>
                                    </li>
                                    <?php if(!empty($sales['works'])):?>
                                        <li><?=$sales['works']?><span>время работы</span></li>
                                    <?php endif;?>
                                    <?php if(!empty($sales['email'])):?>
                                        <li><a href="mailto:<?=$sales['email']?>"><?=$sales['email']?></a>
                                            <span>e-mail</span></li>
                                    <?php endif;?>
                                    <li><a href="mailto:<?= $tech['email']; ?>"><?= $tech['email']; ?></a><span>техническая поддержка</span></li>
                                </ul>
                            </div>
                            <a href="#" class="rs-btn _btn-white" data-popup="#letter-manager">
                                <span class="btn-text _rs-icon-call">Написать письмо руководителю</span>
                                <span class="btn-hover"></span>

                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="rs-footer__bottom">
        <div class="rs-footer__container">
            <div class="rs-footer__body">
                <div data-spollers="991.98,max" data-one-spoller class="rs-footer__spollers">
                    <div class="rs-footer__spollers_item">
                        <button type="button" data-spoller class="rs-footer__spollers_title">
                            Юридический адрес</button>
                        <div class="rs-footer__spollers_body">
                            <div class="rs-footer__contact contact">
                                <ul class="contact__list">
                                    <li><?=$office['yuridicheskij_adres']?></li>
                                    <li><a href="/about/">Учредительные документы</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="rs-footer__spollers_item">
                        <button type="button" data-spoller class="rs-footer__spollers_title">
                            Центральный офис</button>
                        <div class="rs-footer__spollers_body">
                            <div class="rs-footer__contact contact">
                                <ul class="contact__list">
                                    <?php if(!empty($office['office_addr'])):?>
                                        <li><?=$office['office_addr']?></li>
                                    <?php endif;?>
                                    <?php if(!empty($sales['works'])):?>
                                        <li>Время работы: <?=$sales['works']?></li>
                                    <?php endif;?>
                                    <?php if(!empty($sales['email'])):?>
                                        <li><a href="mailto:<?=$sales['email']?>"><?=$sales['email']?></a></li>
                                    <?php endif;?>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <?php if(!empty($office['skoro_otkrytie'])):?>
                    <div class="rs-footer__spollers_item">
                        <button type="button" data-spoller class="rs-footer__spollers_title">
                            Скоро открытие</button>
                        <div class="rs-footer__spollers_body">
                            <div class="rs-footer__contact contact">
                                <ul class="contact__list">
                                    <?php foreach ($office['skoro_otkrytie'] as $item): ?>
                                    <li><?=$item["address"]?></li>
                                    <?php endforeach;?>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <?php endif;?>

                    <div class="rs-footer__spollers_item">
                        <button type="button" data-spoller class="rs-footer__spollers_title">
                            Техническая поддержка</button>
                        <div class="rs-footer__spollers_body">
                            <div class="rs-footer__contact contact">
                                <ul class="contact__list">
                                    <li><a href="mailto:<?= $tech['email']; ?>"><?= $tech['email']; ?></a></li>
                                </ul>
                            </div>
                            <a href="#" class="rs-btn _btn-white" data-popup="#letter-manager">
                                <span class="btn-text _rs-icon-call">Написать письмо руководителю</span>
                                <span class="btn-hover"></span>

                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <?php get_list_city()?>
            <div class="rs-footer__copyright">© 2011—<?=date("Y");?> Россайт</div>
        </div>
    </div>
</footer>