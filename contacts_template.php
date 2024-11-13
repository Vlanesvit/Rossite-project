<?php
/**
 * Template Name: Contacts
 */

get_header(); ?>
    <?php
		// Start the loop.
		while ( have_posts() ) : the_post(); ?>
    <?php endwhile;?>
<?php get_footer(); ?>
