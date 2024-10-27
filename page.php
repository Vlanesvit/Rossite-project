<?php
/**
 * The template for displaying all pages.
 *
 * This is the templ ate that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package storefront
 */
get_header();
if(is_front_page()){
    $bg_images = get_field('bg_images');
$video = get_field('video');
$video_city =get_field('video',$_SESSION['CURRENT_ID']);
$title_project = get_field('title_project');
$bg_project = get_field('ip_project');
$link_project = get_field('iet_projecty');
$projecty = get_field('projecty');
$logo = get_field('logo');

$preview = $video_city['preview']?:$video['preview'];
$mp4 = $video_city['mp4']?:$video['mp4'];
    ?>
<section class="rs-main">
	<!-- <?php if(!empty($bg_images)):
            foreach ($bg_images as $key=>$img): ?>
	<div class="rs-main__bg-img rs-main__bg-img-<?=($key+1)?>">
		<img src="<?=$img['img']?>" alt="">
	</div>
	<?php endforeach;?>
	<?php endif; ?> -->
	<div class="rs-main__wrapper">
		<div class="rs-main__pins">
			<?php if(!empty($video )): ?>
			<div class="rs-main__pin rs-main__title">
				<div class="rs-main__title_body">
					<h1><?=$video['title']?></h1>
				</div>

				<div class="rs-main__title_video">
					<video autoplay loop muted playsinline <?php if($preview):?>poster="<?=$preview?>" <?php endif;?>>
						<source src="<?=$mp4?>" type="video/mp4">
					</video>
				</div>
			</div>
			<?php endif; ?>
			<?php if(!empty($projecty )): ?>
			<div class="rs-main__pin rs-main__project">
				<div class="rs-main__project_bg">
					<img src="<?=$bg_project?>" alt="">
				</div>
				<div class="rs-main__container">
					<div class="rs-main__project_wrapper">
						<div class="rs-main__project_body">
							<div class="rs-main__project_nav">
								<h3 class="mrp-med-40"><?=$title_project?></h3>

								<div class="rs-main__project_nav_body">
									<ul>
										<?php foreach($projecty as $key=>$project):?>
										<li><a href="#slide-<?=($key+1)?>" <?php if($key==0) :?>class="_active"
												<?php endif;?>><?=$project['title']?></a></li>
										<?php endforeach;?>
									</ul>
								</div>
							</div>
							<div class="rs-main__project_list">
								<?php foreach($projecty as $key=>$project):
                                    $images=$project['images'];
                                     $tags=$project['tag-list'];
                                    ?>
								<div class="rs-main__project_item" id="slide-<?=($key+1)?>">
									<a href="<?=$project['link']?>" target="_blank">
										<div class="rs-main__project_picture">
											<div class="rs-main__project__img">
												<!-- <img src="<?=$images['desctop']?>" alt="">
												<?php if(!empty($images['mobile'])):?>
												<img src="" alt="">
												<?php endif; ?> -->
												<picture>
													<source srcset="<?=$images['desctop']?>"
														media="(min-width: 991.98px)">
													<source srcset="<?=$images['tablet']?>"
														media="(min-width: 767.98px)">
													<img src="<?=$images['mobile']?>" alt="">
												</picture>
											</div>
											<?php if(!empty($project['logo'])):?>
											<div class="rs-main__project__logo">
												<img src="<?=$project['logo']?>" alt="">
											</div>
											<?php endif; ?>
										</div>
									</a>

									<div class="rs-main__project_desc">
										<h6><?=$project['title']?></h6>
										<span><?=$project['link']?></span>
										<?php if(!empty($tags)):?>
										<ul class="tag-list">
											<?php foreach($tags as $tag):?>
											<li><?=$tag['tag']?></li>
											<?php endforeach;?>
										</ul>
										<?php endif; ?>
									</div>

								</div>
								<?php endforeach;?>
							</div>
						</div>

						<div class="rs-main__project_footer">
							<?php if(!empty($link_project )):?>
							<a href="<?=$link_project ["url"]?>" class="rs-project__add rs-btn _btn-gray-border">
								<span class="btn-text _rs-icon-picture"><?=$link_project['title']?></span>
								<span class="btn-hover"></span>
							</a>
							<?php endif; ?>
							<?php
        //do_action( 'template_on_partner_main');
        if(!empty($logo)):?>
							<div class="rs-main__logo">
								<div class="rs-main__logo_slider marquee" data-direction="left">
									<ul class="rs-main__logo_swiper">
										<?php foreach( $logo as $item ){?>
										<li class="rs-main__logo_slide">
											<img src="<?=$item['url']?>" alt="">
										</li>
										<?php } ?>
									</ul>
								</div>
							</div>
							<?php endif; ?>
						</div>
					</div>
				</div>
			</div>
			<?php endif; ?>
		</div>
	</div>
	<?php if(!empty($link_project )):?>
	<a href="<?=$link_project['url']?>" class="rs-main__project-all _rs-icon-arrow-next"><?=$link_project['title']?></a>
	<?php endif; ?>
</section>

<?php } else {
    if(get_field("on_banner")) {
        //Баннер
        $banner = get_field('banner');
        do_action( 'template_on_main_banner', $banner);
    }
    $rows = get_field('bloki' );
    if( is_array($rows) ) {
        foreach($rows as $index => $row){
            $tip_bloka = $row["tip_bloka"];
            do_action( 'template_on_'.$tip_bloka, $row, $index);
        }
    }
}
?>

<?php get_footer(); ?>