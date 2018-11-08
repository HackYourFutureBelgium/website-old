(function($) {
	"use strict"

	///////////////////////////
	// Preloader
	$(window).on('load', function() {
		$("#preloader").delay(600).fadeOut();
	});

	///////////////////////////
	// Scrollspy
	$('body').scrollspy({
		target: '#nav',
		offset: $(window).height() / 2
	});

	///////////////////////////
	// Smooth scroll
	$("#nav .main-nav a[href^='#']").on('click', function(e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({
			scrollTop: $(this.hash).offset().top
		}, 600);
	});

	$('#back-to-top').on('click', function(){
		$('body,html').animate({
			scrollTop: 0
		}, 600);
	});

	///////////////////////////
	// Btn nav collapse
	$('#nav .nav-collapse').on('click', function() {
		$('#nav').toggleClass('open');
	});

	///////////////////////////
	// Mobile dropdown
	$('.has-dropdown a').on('click', function() {
		$(this).parent().toggleClass('open-drop');
	});

	///////////////////////////
	// On Scroll
	$(window).on('scroll', function() {
		var wScroll = $(this).scrollTop();

		// Fixed nav
		wScroll > 1 ? $('#nav').addClass('fixed-nav') : $('#nav').removeClass('fixed-nav');

		// Back To Top Appear
		wScroll > 700 ? $('#back-to-top').fadeIn() : $('#back-to-top').fadeOut();
	});

	///////////////////////////
	// magnificPopup
	$('.work').magnificPopup({
		delegate: '.lightbox',
		type: 'image'
	});

	///////////////////////////
	// Owl Carousel
	$('#about-slider').owlCarousel({
		items:1,
		loop:true,
		margin:15,
		nav: true,
		navText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
		dots : true,
		autoplay : true,
		animateOut: 'fadeOut'
	});

	$('#testimonial-slider').owlCarousel({
		loop:true,
		margin:15,
		dots : true,
		nav: false,
		autoplay : true,
		responsive:{
			0: {
				items:1
			},
			992:{
				items:2
			}
		}
	});
})(jQuery);

(function() {
	const showDonationForm = (e) => {
		e.preventDefault();
		console.log(e);
	};

	const $amountField = document.getElementById('support-amount');
	const amounts = Array.prototype.slice.call(document.querySelectorAll('.support-amount-picker li'))
		.reduce((items, $listItem) => {
			const amount = $listItem.querySelector('span').innerText;
			items[amount] = $listItem;
			return items;
		}, {});

	const updateSelectedAmount = (event, amount = null) => {
		const newAmount = event ? event.currentTarget.value : amount;
		Object.keys(amounts).forEach((amount) => {
			amounts[amount].classList.remove('selected');
		})
		if (amounts[newAmount]) {
			amounts[newAmount].classList.add('selected');
		}
	};

	const chooseDonationAmount = (e) => {
		const amount = e.target.matches('span') ? e.target.innerText : e.target.querySelector('span').innerText;
		$amountField.value = amount;
		updateSelectedAmount(null, amount);
	}

	document.getElementById('support-form').addEventListener('submit', showDonationForm);
	document.getElementById('support-amount-picker').addEventListener('click', chooseDonationAmount);
	$amountField.addEventListener('input', updateSelectedAmount);
	console.log(amounts);
})();
