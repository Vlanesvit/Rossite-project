<?php
// Баннер на Внутренних страницах
function rs_main_banner($banner){
    $color_banner=$banner['color_banner'];
    $color=$color_banner['primary_color'];
    $hover=$color_banner['primary_color_hover'];
    $text=$color_banner['primary_color_text'];
    ?>
<section class="rs-banner" style="
        <?php if(!empty($color)):?>
            --primary-color: <?=$color?>;
        <?php endif;?>
        <?php if(!empty($hover)):?>
            --primary-color-hover: <?=$hover?>;
        <?php endif;?>
        <?php if(!empty($text)):?>
            --primary-color-text: <?=$text?>;
        <?php endif;?> ">
	<div class="rs-banner__wrapper">
		<div class="rs-banner__bg">
			<picture>
				<source srcset="<?=$banner['banner_img']['desktop']?>" media="(min-width: 991.98px)">
				<source srcset="<?=$banner['banner_img']['tablet']?>" media="(min-width: 767.98px)">
				<img src="<?=$banner['banner_img']['mobile']?>" alt="">
			</picture>
		</div>
		<div class="rs-banner__content">
			<div class="rs-banner__container">
				<div class="rs-banner__body">
					<h1 class="mrp-med-50"><?=$banner['title']?></h1>
					<?php if(!empty($banner['text'])):?>
					<h5 class="mrp-reg-21"><?=$banner['text']?></h5>
					<?php endif;?>
					<?php if(!empty($banner['description'])):?>
					<?=$banner['description']?>
					<?php endif;?>
					<?php if(is_array($banner['button'])){ ?>
					<div class="rs-banner__buttons">
						<?php
                                foreach($banner['button'] as $button){
                                    $style=($button["style_button"]=="primary")?'_btn-primary':'_btn-primary-border';
                                    switch ($button["type_button"]){
                                        case "modal":?>
						<a href="#" class="rs-btn <?=$style?>" data-popup="<?=$button["text_button"]["url"]?>">
							<span class="btn-text _rs-icon-message"><?=$button["text_button"]["title"]?></span>
							<span class="btn-hover"></span>
						</a>
						<?php break;
                                        case "download":
                                            ?>
						<a href="<?=$button["download_button"]["url"]?>" class="rs-btn <?=$style?>"
							download="<?=$button["download_button"]["url"]?>" target="_blank">
							<span class="btn-text _rs-icon-download"><?=$button["download_button"]["title"]?></span>
							<span class="btn-hover"></span>
						</a>
						<?php break;
                                        case "link": ?>
						<a href="<?=$button["text_button"]["url"]?>" class="rs-btn <?=$style?>">
							<span
								class="btn-text _rs-icon-circle-arrow-down"><?=$button["text_button"]["title"]?></span>
							<span class="btn-hover"></span>
						</a>
						<?php break;
                                    }
                                } ?>
					</div>
					<?php }
                        ?>
				</div>
			</div>
		</div>
	</div>
</section>
<?php }
//Преимущества (слайдер Возможности сайтов)
function rs_features_slider($content,$key=0){
    $title = $content["title"];
    $subtitle = $content["subtitle"];
    $slides = $content["features_slide"];
    ?>
<section class="rs-features">
	<div class="section__container">
		<div class="rs-features__head">
			<h2 class="mrp-med-45"><?=$title?></h2>
			<h5 class="mrp-reg-21"><?=$subtitle?></h5>
		</div>
	</div>
	<?php if(is_array($slides)):?>
	<div class="rs-features__wrapper">
		<div class="rs-features__slider">
			<div class="rs-features__swiper">
				<?php foreach ($slides as $key=>$slide):
                            //   var_dump($slide);
                            $icons=$slide["features_icons"];
                            $lines=$slide["features_line"]
                            ?>
				<div class="rs-features__slide" style="background-color:<?=$slide["bg"]?>">
					<div class="rs-features__item">
						<div class="rs-features__picture">
							<div class="rs-features__img">
								<img src="<?=$slide["features_img"]?>" alt="">
							</div>
							<?php if(!empty($icons)):
                                            foreach ($icons as $k=>$icon):
                                                ?>
							<div class="rs-features__icon rs-features__icon-<?=($key+1)?>-<?=($k+1)?>">
								<img src="<?=$icon["icons"]?>" alt="">
							</div>
							<?php endforeach;
                                        endif; ?>
							<?php if(!empty($slide["features_bg"])):?>
							<div class="rs-features__bg">
								<img src="<?=$slide["features_bg"]?>" alt="">
							</div>
							<?php endif; ?>
							<?php if(!empty($icons)):
                                            foreach ($lines as $line):
                                                ?>
							<div class="rs-features__line">
								<?=$line["line"]?>
							</div>
							<?php endforeach;
                                        endif; ?>
						</div>
						<div class="rs-features__description">
							<h4 class="mrp-med-25"><?=$slide["title"]?></h4>
							<p class="mrp-reg-18"><?=$slide["description"]?>
							</p>
						</div>
					</div>
				</div>
				<?php endforeach;?>
			</div>
		</div>
	</div>
	<?php endif;?>
</section>

<?php }
//Дополнительно
function rs_services($content,$key=0){
    $title = $content["title"];
    $slides = $content["services_slide"];
    $index=1;
    $top = (!$key && !get_field("on_banner"))?'margin-top':'';
    ?>
<section class="rs-services <?=$top?>">
	<div class="section__container">
		<div class="section__head">
			<div class="section__head-title">
				<h2 class="mrp-med-45"><?=$title?></h2>
			</div>

			<div class="rs-services__navigation swiper-navigation">
				<div class="rs-services__button-prev swiper-button-prev _rs-icon-arrow-prev"></div>
				<div class="rs-services__button-next swiper-button-next _rs-icon-arrow-next"></div>
			</div>
		</div>
		<?php if(is_array($slides)):?>
		<div class="rs-services__slider swiper">
			<div class="rs-services__swiper swiper-wrapper">
				<?php foreach ($slides as $key=>$slide):
            $icons=$slide["icons"];
            $lines=$slide["lines"];
            $image=$slide["group_img"];
            $link=$slide["link"];
            ?>
				<div class="rs-services__slide swiper-slide">
					<a href="<?=$link['url']?>">
						<div class="rs-services__item rs-services--<?=$slide['bg']?>">
							<div class="rs-services__img <?php if($image['on_gif']): echo 'rs-services__gif'; endif;?>">
								<img src="<?=$image['img']?>" alt="">
							</div>
							<div class="rs-services__description">
								<h4 class="mrp-med-25"><?=$link['title']?></h4>
								<?php if(!empty($slide['description'])):?>
								<p class="mrp-reg-16"><?=$slide['description']?></p>
								<?php endif;?>
							</div>
							<?php if(is_array($icons)|| is_array($lines)):?>
							<div class="rs-services__icons">
								<?php if(!empty($icons)):
                                        foreach ($icons as $k=>$icon):
                                            $pos=!empty($icon["style"])?$icon["style"]:$index;
                                            $index++;
                                            ?>
								<div class="rs-services__icon rs-services__icon-<?=($pos)?>">
									<img src="<?=$icon["icon"]?>" alt="">
								</div>
								<?php endforeach;
                                    endif; ?>
								<?php if(!empty($lines)):
                                        foreach ($lines as $line):
                                            ?>
								<div class="rs-services__line">
									<?=$line["line"]?>
								</div>
								<?php endforeach;
                                    endif; ?>
							</div>
							<?php endif;?>
						</div>
					</a>
				</div>
				<?php endforeach;?>
			</div>
			<div class="rs-services__pagination swiper-pagination"></div>
		</div>
		<?php endif;?>
	</div>
</section>
<?php }
//слайдер Логотипы
function rs_slider_logo($content,$key=0){
    $title = $content["title"];
    $gallery = $content["gallery"];
//var_dump($gallery);
    ?>
<section class="rs-logo">
	<div class="rs-logo__container">

		<div class="rs-logo__wrapper">
			<div class="rs-logo__head">
				<h2 class="mrp-med-45"><?=$title?></h2>
				<div class="rs-logo__filters">
					<button type="button" class="rs-logo__filter _filter-active" data-filter="All">Все</button>
					<?php if(is_array($gallery)):?>
					<?php foreach ($gallery as $key=>$item):  ?>
					<button type="button" class="rs-logo__filter"
						data-filter="<?=$item["price"]?>"><?php echo number_format($item["price"], 0, '.', ' ')?>
						&nbsp;₽</button>
					<?php endforeach;?>
					<?php endif;?>
				</div>
			</div>
			<?php if(is_array($gallery)):?>
			<div class="rs-logo__slider swiper">
				<div class="rs-logo__swiper swiper-wrapper">
					<?php foreach ($gallery as $key=>$item):
                        foreach($item["img"] as $img): ?>
					<div class="rs-logo__slide swiper-slide" data-filter="<?=$item["price"]?>">
						<img src="<?=$img['url']?>" alt="">
					</div>
					<?php endforeach;?>
					<?php endforeach;?>
				</div>
				<div class="rs-logo__action swiper-action">
					<div class="rs-logo__pagination swiper-pagination"></div>
					<div class="rs-logo__navigation swiper-action__navigation">
						<div class="rs-logo__button-prev swiper-button-prev _rs-icon-arrow-prev">
						</div>
						<div class="rs-logo__button-next swiper-button-next _rs-icon-arrow-next">
						</div>
					</div>
				</div>
			</div>
			<?php endif;?>
		</div>
	</div>
</section>

<?php }
//О продукте
function rs_slider_prod($content,$key=0){
    $title = $content["title"];
    $slides = $content["about_slide"];
    $index=1;
    ?>
<section class="rs-slider-block rs-slider-block-pins">
	<div class="section__container">
		<div class="section__head">
			<div class="section__head-title">
				<h2 class="mrp-med-45"><?=$title?></h2>
			</div>
		</div>
		<?php if(is_array($slides)):?>
		<div class="rs-slider-block__slider swiper">
			<div class="rs-slider-block__swiper swiper-wrapper">
				<?php foreach ($slides as $key=>$slide):
                            $icons=$slide["icons"];
                            $lines=$slide["lines"];
                            $image=$slide["group_img"];
                            $link=$slide["link"];
                            ?>
				<div class="rs-slider-block__slide swiper-slide">
					<div class="rs-slider-block__item rs-slider-block--<?=$slide['bg']?>">
						<div
							class="rs-slider-block__img <?php if($image['on_gif']): echo 'rs-slider-block__gif'; endif;?>">
							<img src="<?=$image['img']?>" alt="">
						</div>
						<div class="rs-slider-block__description">
							<h4 class="mrp-med-25"><?=$slide['title']?></h4>
							<?php if(!empty($slide['description'])):?>
							<p class="mrp-reg-18"><?=$slide['description']?></p>
							<?php endif;?>
						</div>
						<?php if(is_array($icons)|| is_array($lines)):?>
						<div class="rs-slider-block__icons">
							<?php if(!empty($icons)):
                            foreach ($icons as $k=>$icon):
                            $coord = $icon['coordinats'];

                            $style = '';
                                if(!empty($coord['top'])){
                                    $style .=  'top:'. $coord['top'].'%;';
                                }
                                if(!empty($coord['left'])){
                                    $style .=  'left:'. $coord['left'].'%;';
                                }
                                if(!empty($coord['right'])){
                                    $style .=  'right:'. $coord['right'].'%;';
                                }
                                if(!empty($coord['bottom'])){
                                    $style .=  'bottom:'. $coord['bottom'].'%;';
                                }
                            ?>
							<div class="rs-slider-block__icon rs-slider-block__icon-<?=($index++)?>" style="<?=$style?>">
								<img src="<?=$icon["icon"]?>" alt="">
							</div>
							<?php endforeach;
                                            endif; ?>
							<?php if(!empty($lines)):
                                                foreach ($lines as $line):
                                                    ?>
							<div class="rs-slider-block__line">
								<?=$line["line"]?>
							</div>
							<?php endforeach;
                                            endif; ?>
						</div>
						<?php endif;?>
					</div>
				</div>
				<?php endforeach;?>
			</div>
			<div
				class="rs-slider-block__pagination swiper-pagination swiper-pagination-progressbar swiper-pagination-horizontal">
				<span class="swiper-pagination-progressbar-fill"></span>
			</div>
		</div>
		<?php endif;?>
	</div>
</section>
<?php }
//Слайдер (результаты клиентов)
function rs_slider_result($content,$key=0){
    $title = $content["title"];
    $subtitle = $content["subtitle"];
    $slides = $content["result_slides"];
    ?>
<section class="rs-slider-block">
	<div class="section__container">
		<div class="section__head">
			<div class="section__head-title">
				<h2 class="mrp-med-45"><?=$title?></h2>
				<p class="mrp-reg-18"><?=$subtitle?></p>
			</div>
			<?php if(is_array($slides)):?>
			<div class="rs-slider-block__navigation swiper-navigation">
				<div class="rs-slider-block__button-prev swiper-button-prev _rs-icon-arrow-prev"></div>
				<div class="rs-slider-block__button-next swiper-button-next _rs-icon-arrow-next"></div>
			</div>
			<?php endif;?>
		</div>

		<?php if(is_array($slides)):?>
		<div class="rs-slider-block__slider swiper">
			<div class="rs-slider-block__swiper swiper-wrapper">
				<?php foreach ($slides as $key=>$slide):
                            $link=$slide["link"];
                            ?>
				<div class="rs-slider-block__slide swiper-slide">
					<div class="rs-slider-block__block">
						<div class="rs-slider-block__desc">
							<h4 class="mrp-med-25">Сайт: <a href="<?=$link['url']?>"
									target="_blank"><?=$link['title']?></a></h4>
							<ul>
								<li>Поисковая система: <?=$slide["system"]?></li>
								<li>Регион: <?=$slide["region"]?></li>
							</ul>
						</div>
						<div class="rs-slider-block__table">
							<?=$slide["table"]?>
						</div>
					</div>
				</div>
				<?php endforeach;?>
			</div>
			<div
				class="rs-slider-block__pagination swiper-pagination swiper-pagination-progressbar swiper-pagination-horizontal">
				<span class="swiper-pagination-progressbar-fill"></span>
			</div>
		</div>
		<?php endif;?>
	</div>
</section>
<?php }
//Из прототипа в дизайн
function rs_comparison($content,$key=0){
    $title = $content["title"];
    $subtitle = $content["subtitle"];
    $images = $content["block_picture_comparison"];
    ?>
<section class="rs-comparison">
	<div class="section__container">
		<h2 class="mrp-med-45"><?=$title?></h2>
		<p class="mrp-reg-21"><?=$subtitle?></p>
	</div>
	<div class="rs-comparison__compare" id="image-compare">
		<?php foreach ($images as $image): ?>
		<img src="<?=$image["image"]?>" alt="" />
		<?php endforeach; ?>
	</div>
</section>
<?php }
//Мы разрабатываем
function rs_slider_development($content,$key=0){
    $title = $content["title"];
    $subtitle = $content["subtitle"];
    $slides = $content["about_slide"];
    $button = $content["button"];
    $index=11;
    ?>
<section class="rs-slider-block rs-slider-block-pins">
	<div class="section__container">
		<div class="section__head">
			<div class="section__head-title">
				<h2 class="mrp-med-50"><?=$title?></h2>
				<?php if(!empty($subtitle)):?>
				<p class="mrp-reg-18"><?=$subtitle?></p>
				<?php endif;?>
			</div>
			<?php if(is_array($slides) || is_array($button)):?>
			<div class="rs-slider-block__navigation swiper-navigation">
				<?php if(is_array($slides)):?>
				<div class="rs-slider-block__button-prev swiper-button-prev _rs-icon-arrow-prev"></div>
				<div class="rs-slider-block__button-next swiper-button-next _rs-icon-arrow-next"></div>
				<?php endif;?>
				<?php if(is_array($button)):?>
				<a href="<?=$button['url']?>" class="rs-btn rs-btn _btn-gray-border">
					<span class="btn-text">
						<svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M1 11V9.8C1 8.11984 1 7.27976 1.32698 6.63803C1.6146 6.07354 2.07354 5.6146 2.63803 5.32698C3.27976 5 4.11984 5 5.8 5H17M17 5L13 1M17 5L13 9"
								stroke="#6366F1" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<?=$button['title']?>
					</span>
					<span class="btn-hover"></span>
				</a>
				<?php endif;?>
			</div>
			<?php endif;?>
		</div>

		<?php if(is_array($slides)):?>
		<div class="rs-slider-block__slider swiper">
			<div class="rs-slider-block__swiper swiper-wrapper">
				<?php foreach ($slides as $key=>$slide):
                            $icons=$slide["icons"];
                            $lines=$slide["lines"];
                            $image=$slide["group_img"];
                            $link=$slide["link"];
                            ?>
				<div class="rs-slider-block__slide swiper-slide">
					<div class="rs-slider-block__item rs-slider-block--<?=$slide['bg']?>">
						<div
							class="rs-slider-block__img <?php if($image['on_gif']): echo 'rs-slider-block__gif'; endif;?>">
							<img src="<?=$image['img']?>" alt="">
						</div>
						<div class="rs-slider-block__description">
							<h4 class="mrp-med-25"><?=$slide['title']?></h4>
							<?php if(!empty($slide['description'])):?>
							<p class="mrp-reg-18"><?=$slide['description']?></p>
							<?php endif;?>
						</div>
						<?php if(is_array($icons)|| is_array($lines)):?>
						<div class="rs-slider-block__icons">
							<?php if(!empty($icons)):
                                                foreach ($icons as $k=>$icon):
                                                    $coord = $icon['coordinats'];
                                                    $style = '';
                                                    if(!empty($coord['top'])){
                                                        $style .=  'top:'. $coord['top'].'%;';
                                                    }
                                                    if(!empty($coord['left'])){
                                                        $style .=  'left:'. $coord['left'].'%;';
                                                    }
                                                    if(!empty($coord['right'])){
                                                        $style .=  'right:'. $coord['right'].'%;';
                                                    }
                                                    if(!empty($coord['bottom'])){
                                                        $style .=  'bottom:'. $coord['bottom'].'%;';
                                                    }
                                                    ?>
							<div class="rs-slider-block__icon rs-slider-block__icon-<?=($index++)?>" style="<?=$style?>">
								<img src="<?=$icon["icon"]?>" alt="">
							</div>
							<?php endforeach;
                                            endif; ?>
							<?php if(!empty($lines)):
                                                foreach ($lines as $line):
                                                    ?>
							<div class="rs-slider-block__line">
								<?=$line["line"]?>
							</div>
							<?php endforeach;
                                            endif; ?>
						</div>
						<?php endif;?>
					</div>
				</div>
				<?php endforeach;?>
			</div>
			<div
				class="rs-slider-block__pagination swiper-pagination swiper-pagination-progressbar swiper-pagination-horizontal">
				<span class="swiper-pagination-progressbar-fill"></span>
			</div>
		</div>
		<?php endif;?>
	</div>
</section>
<?php }
//Что такое контекстная реклама?
function rs_info_block ($content,$key=0){
    $title = $content["title"];
    $subtitle = $content["subtitle"];
    $images=$content["bg_banner"]
    ?>
<section class="rs-info-block section-bg">
	<div class="section__wrapper">
		<div class="section__bg">
			<img src="<?=$images['desctop']?>" alt="">
			<?php if($images['tablet']):?>
			<img src="<?=$images['tablet']?>" alt="">
			<?php endif;?>
			<?php if($images['mobile']):?>
			<img src="<?=$images['mobile']?>" alt="">
			<?php endif;?>
		</div>

		<div class="section__container">
			<div class="rs-info-block__desc">
				<h2 class="mrp-med-45"><?=$title?></h2>
				<h5 class="mrp-reg-21"><?=$subtitle?></h5>
			</div>
		</div>
	</div>
</section>
<?php }
//Почему SEO у нас стоит...?
function rs_why_block ($content,$key=0){
    $title = $content["title"];
    $subtitle = $content["subtitle"];
    $bg=$content["bg_image"];
    ?>
<section class="rs-why-block">
	<div class="rs-why-block__container">
		<div class="rs-why-block__wrapper">
			<div class="rs-why-block__bg"><img src="<?=$bg?>" alt=""></div>
			<div class="rs-why-block__content">
				<h2 class="mrp-med-50"><?=$title?></h2>
				<h5 class="mrp-reg-21"><?=$subtitle?></h5>
			</div>
		</div>
	</div>
</section>
<?php }