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

// Donation form & stripe
(function() {
	const paymentAPI = 'https://wt-00b50724a47109acb762597a6836a906-0.sandbox.auth0-extend.com/stripe-payment';
	const $amountField = document.getElementById('support-amount');
	const $monthlyRadio = document.getElementById('support-monthly');
	const $monthlyLabel = document.querySelector('#support-monthly + label');
	const $oneTimeRadio = document.getElementById('support-once');

	const stripe = Stripe('pk_live_mFpKP0JmQWp9mQ2FjetxyzlH', {
		stripeAccount: 'acct_1DUXo0B6dm2WDTHv'
	});

	const getPaymentSession = (data) => {
		return fetch(`${paymentAPI}/session`, {
			method: 'POST',
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json; charset=utf-8"
			},
			body: JSON.stringify(data)
		}).then(r => r.json())
	}

	const startPayment = (e) => {
		e.preventDefault();
		const amount = parseInt($amountField.value) * 100;

		const data = {};
		if (!$monthlyRadio.checked) data.amount = amount;
        else data.plan = `monthly-${parseInt(amount) / 100}`;
		 	
		getPaymentSession(data)
			.then((session) => {
				if (session.error) throw session.error;
				return stripe.redirectToCheckout({ sessionId: session.id })
			})
			.then((result) => {
				if (result.error) throw session.error;
			})
			.catch(err => {
				console.error(err);
			});
	}

	const amounts = Array.prototype.slice.call(document.querySelectorAll('.support-amount-picker li'))
		.reduce((items, $listItem) => {
			const amount = $listItem.querySelector('span').innerText;
			items[amount] = $listItem;
			return items;
		}, {});
	
	const hideMonthly = () => {
		$monthlyLabel.classList.add('hidden');
		$monthlyRadio.classList.add('hidden');
		$oneTimeRadio.checked = true;
	}

	const showMonthly = () => {
		$monthlyLabel.classList.remove('hidden');
		$monthlyRadio.classList.remove('hidden');
	}

	const $scholarshipMessage = document.getElementById('scholarship-message');
	const updateSelectedAmount = (event, amount = null) => {
		const newAmount = event ? event.currentTarget.value : amount;
		if (!parseInt(newAmount)) return;
		Object.keys(amounts).forEach((amount) => {
			amounts[amount].classList.remove('selected');
		});

		if (amounts[newAmount]) {
			amounts[newAmount].classList.add('selected');
			if (parseInt(newAmount) === 2000) hideMonthly();
			else showMonthly();
		} else hideMonthly();

		if (parseInt(newAmount) === 2000) $scholarshipMessage.innerText = 'This supports one student for the entirety of the programme.';
		else $scholarshipMessage.innerText = ' ';

	};

	const chooseDonationAmount = (e) => {
		const amount = e.target.matches('span') ? e.target.innerText : e.target.querySelector('span').innerText;
		$amountField.value = amount;
		updateSelectedAmount(null, amount);
	};

	document.getElementById('support-form').addEventListener('submit', startPayment);
	document.getElementById('support-amount-picker').addEventListener('click', chooseDonationAmount);
	$amountField.addEventListener('input', updateSelectedAmount);
})();
