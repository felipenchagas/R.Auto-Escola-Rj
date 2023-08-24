(function ($) {

	"use strict";

	var $document = $(document),
		$window = $(window),
		plugins = {
			mainSlider: $('#mainSlider'),
			slideNav: $('#slide-nav'),
			categoryCarousel: $('.category-carousel'),
			servicesCarousel: $('.services-carousel'),
			servicesAltCarousel: $('.services-alt'),
			servicesBlockAlt: $('.services-block-alt'),
			textIconCarousel: $('.text-icon-carousel'),
			personCarousel: $('.person-carousel'),
			submenu: $('[data-submenu]'),
			googleMapFooter: $('#footer-map'),
			counterBlock: $('#counterBlock'),
			isotopeGallery: $('.gallery-isotope'),
			postGallery: $('.blog-isotope'),
			postCarousel: $('.post-carousel'),
			postMoreLink: $('.view-more-post'),
			animation: $('.animation')
		},
		$shiftMenu = $('#slidemenu, #pageContent, #mainSliderWrapper, .page-footer, .page-header .header-row, body, .darkout-menu'),
		$navbarToggle = $('.navbar-toggle'),
		$dropdown = $('.dropdown-submenu, .dropdown'),
		$fullHeight = $('#mainSlider, #mainSlider .img--holder'),
		$marginTop = $('body.fixedSlider #pageContent'),
		$marginBottom = $('body.fixedFooter #pageContent');

	/* ---------------------------------------------
     Scripts initialization
    --------------------------------------------- */
	$document.ready(function () {

		var windowWidth = window.innerWidth || $window.width();
		var windowH = $window.height();

		// set fullheigth
		if (windowWidth < 992) {
			$fullHeight.height('');
		} else {
			var windowHeight = $window.height();
			var footerHeight = $('.page-footer').height();
			$fullHeight.height(windowHeight);
			$marginTop.css({
				'margin-top': windowHeight + 'px'
			});
			$marginBottom.css({
				'margin-bottom': footerHeight + 'px'
			})
		}

		// vertical tabs
		$("div.vertical-tab-menu>div.list-group>a").on('click', function (e) {
			e.preventDefault();
			$(this).siblings('a.active').removeClass("active");
			$(this).addClass("active");
			var index = $(this).index();
			$("div.vertical-tab>div.vertical-tab-content").removeClass("active");
			$("div.vertical-tab>div.vertical-tab-content").eq(index).addClass("active");
		});

		// collapsed text
		$(".view-more-link").on('click', function (e) {
			var $this = $(this);
			var $target = $($this.attr('href'));
			if ($this.hasClass('opened')) {
				$this.removeClass('opened');
				$('.view-more-mobile', $target).stop(true, true).fadeOut();
			} else {
				$this.addClass('opened');
				$('.view-more-mobile', $target).stop(true, true).fadeIn();
			}
			e.preventDefault();
		})

		// image animation in modal (appointment form)
		$('header .appointment').on('click', function () {
			$('html').css({
				'overflow-y': 'hidden'
			});
			$('.page-header, #mainSliderWrapper').css({
				'padding-right': getScrollbarWidth() + 'px'
			});
		})
		$('.modal').on('shown.bs.modal', function () {
			var $el = $('.animate', $(this));
			doAnimations($el);
		}).on('hidden.bs.modal', function () {
			var $el = $('.animate', $(this));
			$el.addClass('animation');
			$('html').css({
				'overflow-y': ''
			})
			$('.page-header, #mainSliderWrapper').css({
				'padding-right': ''
			});
		})

		// main slider
		if (plugins.mainSlider.length) {
			var $el = plugins.mainSlider;
			$el.on('init', function (e, slick) {
				var $firstAnimatingElements = $('div.slide:first-child').find('[data-animation]');
				doAnimations($firstAnimatingElements);
			});
			$el.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
				var $currentSlide = $('div.slide[data-slick-index="' + nextSlide + '"]');
				var $animatingElements = $currentSlide.find('[data-animation]');
				setTimeout(function () {
					$('div.slide').removeClass('slidein');
				}, 500);
				setTimeout(function () {
					$currentSlide.addClass('slidein');
				}, 1000);
				doAnimations($animatingElements);
			});
			$el.slick({
				arrows: true,
				dots: false,
				autoplay: true,
				autoplaySpeed: 7000,
				fade: true,
				speed: 500,
				pauseOnHover: false,
				pauseOnDotsHover: true
			});
		}

		// number counter
		if (plugins.counterBlock.length) {
			plugins.counterBlock.waypoint(function () {
				$('.number > span.count', plugins.counterBlock).each(count);
				this.destroy();
			}, {
				triggerOnce: true,
				offset: '80%'
			});
		}

		// slide menu
		if (plugins.slideNav.length) {
			var $slideNav = plugins.slideNav,
				toggler = '.navbar-toggle',
				$closeNav = $('.darkout-menu, .close-menu');

			$slideNav.after($('<div id="navbar-height-col"></div>'));
			var $heightCol = $('#navbar-height-col')
			$slideNav.on("click", toggler, function (e) {
				var $this = $(this);
				$heightCol.toggleClass('slide-active');
				$this.toggleClass('slide-active');
				$shiftMenu.toggleClass('slide-active');
			});
			$closeNav.on("click", function (e) {
				$heightCol.toggleClass('slide-active');
				$shiftMenu.toggleClass('slide-active');
			});
		}

		// image popup
		if (plugins.isotopeGallery.length) {
			plugins.isotopeGallery.find('a.hover').magnificPopup({
				type: 'image',
				gallery: {
					enabled: true
				}
			});
		}

		// gallery isotope
		if (plugins.isotopeGallery.length) {
			var $gallery = plugins.isotopeGallery;
			$gallery.imagesLoaded(function () {
				$gallery.isotope({
					itemSelector: '.gallery-item',
					masonry: {
						columnWidth: '.gallery-item',
						gutter: 30
					}
				});
			});
			isotopeFilters($gallery);
		}

		// post isotope
		if (plugins.postGallery.length) {
			console.log('dsad')
			var $postgallery = $('.blog-isotope');
			$postgallery.imagesLoaded(function () {
				$postgallery.isotope({
					itemSelector: '.blog-post',
					masonry: {
						gutter: 30,
						columnWidth: '.blog-post'
					}
				});
			});
		}

		// post more ajax load
		if (plugins.postMoreLink.length) {
			var $postMoreLink = plugins.postMoreLink,
				$postPreload = $('#postPreload'),
				$postLoader = $('#moreLoader');

			$postMoreLink.on('click', function () {
				var target = $(this).attr('data-load');
				$postLoader.addClass('visible');
				$(this).hide();
				$.ajax({
					url: target,
					success: function (data) {
						setTimeout(function () {
							$postPreload.append(data);
							$postLoader.removeClass('visible');
						}, 500);
					}
				});
			})
		}

		// CAROUSELS

		// text_icon carousek
		if (plugins.textIconCarousel.length) {
			plugins.textIconCarousel.slick({
				mobileFirst: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				dots: true,
				arrows: false,
				responsive: [{
					breakpoint: 991,
					settings: {
						slidesToShow: 3
					}
            }, {
					breakpoint: 767,
					settings: {
						slidesToShow: 2
					}
            }, {
					breakpoint: 480,
					settings: {
						slidesToShow: 1
					}
            }]
			});
		}

		// person carousel (team)
		if (plugins.personCarousel.length) {
			plugins.personCarousel.slick({
				mobileFirst: false,
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
				autoplay: true,
				autoplaySpeed: 2000,
				arrows: false,
				dots: true,
				responsive: [{
					breakpoint: 1199,
					settings: {
						slidesToShow: 3
					}
            }, {
					breakpoint: 767,
					settings: {
						slidesToShow: 1
					}
            }]
			});
		}

		// category carousel
		if (plugins.categoryCarousel.length) {
			plugins.categoryCarousel.slick({
				mobileFirst: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				arrows: false,
				dots: true,
				responsive: [{
					breakpoint: 991,
					settings: {
						slidesToShow: 3
					}
            }, {
					breakpoint: 767,
					settings: {
						slidesToShow: 2
					}
            }, {
					breakpoint: 480,
					settings: {
						slidesToShow: 1
					}
            }]
			});
		}

		// post carousel
		if (plugins.postCarousel.length) {
			plugins.postCarousel.slick({
				mobileFirst: false,
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
				autoplay: false,
				arrows: true,
				dots: false
			});
		}

		// END CAROUSELS

		// lazy loading effect
		if (plugins.animation.length) {
			onScrollInit(plugins.animation, windowWidth);
		}

		toggleNavbarMethod(windowWidth);
		mobileClickBanner(windowWidth);

		// Resize window events
		$window.resize(function () {
			var windowWidth = window.innerWidth || $window.width();

			startCarousel();

			if (windowWidth < 992) {
				$fullHeight.height('');
			}
			if (windowWidth > 767 && $navbarToggle.is(':hidden')) {
				$shiftMenu.removeClass('slide-active');
			}
			if (plugins.servicesBlockAlt.length) {
				$(".services-block-alt, .services-block-alt .title, .services-block-alt .text").each(function () {
					$(this).css({
						'height': ''
					});
				})
			}
		});

		$(window).resize(debouncer(function (e) {
			var windowWidth = window.innerWidth || $window.width();
			if (windowWidth > 991) {
				$fullHeight.height($(window).height());
			}

			if (windowWidth > 768) {
				if (plugins.servicesCarousel.length) {
					equalHeight(".text-icon-carousel > div", ".title", ".text");
				}
			}
			if (windowWidth > 480) {
				if (plugins.servicesBlockAlt.length) {
					equalHeight(".services-block-alt", ".title", ".text");
				}
			}

			$dropdown.removeClass('opened');
			toggleNavbarMethod(windowWidth);
			mobileClickBanner(windowWidth);
		}))

	})

	$window.on('load', function () {

		var windowWidth = window.innerWidth || $window.width();

		startCarousel();

		// remove preloader
		$('#loader-wrapper').fadeOut(500);
		if (windowWidth > 768) {
			if (plugins.servicesCarousel.length) {
				equalHeight(".text-icon-carousel > div", ".title", ".text");
			}
		}
		if (windowWidth > 480) {
			if (plugins.servicesBlockAlt.length) {
				equalHeight(".services-block-alt", ".title", ".text");
			}
		}
		if (plugins.googleMapFooter.length) {
			createMap('footer-map', 14, -25.430060, -49.260760)
		}

	});


	/* ---------------------------------------------
     Functions
    --------------------------------------------- */

	// Set equal height to block
	function equalHeight(block) {
		var wrapWidth = $(block).parent().width(),
			blockWidth = $(block).width(),
			wrapDivide = Math.floor(wrapWidth / blockWidth),
			cellArr = $(block);
		for (var arg = 1; arg <= arguments.length; arg++) {
			for (var i = 0; i <= cellArr.length; i = i + wrapDivide) {
				var maxHeight = 0,
					heightArr = [];
				for (var j = 0; j < wrapDivide; j++) {
					heightArr.push($(cellArr[i + j]).find(arguments[arg]));
					if (heightArr[j].outerHeight() > maxHeight) {
						maxHeight = heightArr[j].outerHeight();
					}
				}
				for (var counter = 0; counter < heightArr.length; counter++) {
					$(cellArr[i + counter]).find(arguments[arg]).outerHeight(maxHeight);
				}
			}
		}
	}

	// Slider Animation
	function doAnimations(elements) {
		var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		elements.each(function () {
			var $this = $(this);
			var $animationDelay = $this.data('delay');
			var $animationType = 'animated ' + $this.data('animation');
			$this.css({
				'animation-delay': $animationDelay,
				'-webkit-animation-delay': $animationDelay
			});
			$this.addClass($animationType).one(animationEndEvents, function () {
				$this.removeClass($animationType);
			});
			if ($this.hasClass('animate')) {
				$this.removeClass('animation');
			}
		});
	}

	// Time Out Resize
	function debouncer(func, timeout) {
		var timeoutID, timeout = timeout || 500;
		return function () {
			var scope = this,
				args = arguments;
			clearTimeout(timeoutID);
			timeoutID = setTimeout(function () {
				func.apply(scope, Array.prototype.slice.call(args));
			}, timeout);
		}
	}

	// Count To
	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}

	// Isotope Filters (for gallery)
	function isotopeFilters(gallery) {
		var $gallery = $(gallery);
		if ($gallery.length) {
			var container = $gallery;
			var optionSets = $(".filters-by-category .option-set"),
				optionLinks = optionSets.find("a");
			optionLinks.on('click', function (e) {
				var thisLink = $(this);
				if (thisLink.hasClass("selected")) return false;
				var optionSet = thisLink.parents(".option-set");
				optionSet.find(".selected").removeClass("selected");
				thisLink.addClass("selected");
				var options = {},
					key = optionSet.attr("data-option-key"),
					value = thisLink.attr("data-option-value");
				value = value === "false" ? false : value;
				options[key] = value;
				if (key === "layoutMode" && typeof changeLayoutMode === "function") changeLayoutMode($this, options);
				else {
					container.isotope(options);
				}
				return false
			})
		}
	}

	// Mobile Only carousel initialization
	function slickMobile(carousel, breakpoint, slidesToShow, slidesToScroll) {
		var windowWidth = window.innerWidth || $window.width();
		if (windowWidth < (breakpoint + 1)) {
			carousel.slick({
				mobileFirst: true,
				slidesToShow: slidesToShow,
				slidesToScroll: slidesToScroll,
				infinite: true,
				autoplay: false,
				arrows: false,
				dots: true,
				responsive: [{
					breakpoint: breakpoint,
					settings: "unslick",
				}]
			});
		}
	}

	function startCarousel() {
		if (plugins.servicesAltCarousel.length) {
			slickMobile(plugins.servicesAltCarousel, 480, 1, 1);
		}
		if (plugins.servicesCarousel.length) {
			slickMobile(plugins.servicesCarousel, 767, 2, 2);
		}
	}

	// Navigation dropdown menu
	function toggleNavbarMethod(windowWidth) {
		var $dropdownLink = $(".dropdown > a, .dropdown-submenu > a");
		var $dropdown = $(".dropdown, .dropdown-submenu");
		var $dropdownCaret = $(".dropdown > a > .ecaret, .dropdown-submenu > a > .ecaret");
		$dropdownLink.on('click.toggleNavbarMethod', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var url = $(this).attr('href');
			if (url) $(location).attr('href', url);
		});
		if (windowWidth < 768) {
			$dropdown.unbind('.toggleNavbarMethod');
			$dropdownCaret.unbind('.toggleNavbarMethod');
			$dropdownCaret.on('click.toggleNavbarMethod', function (e) {
				e.stopPropagation();
				e.preventDefault();
				var $li = $(this).parent().parent('li');
				if ($li.hasClass('opened')) {
					$li.find('.dropdown-menu').first().stop(true, true).slideUp(0);
					$li.removeClass('opened');
				} else {
					$li.find('.dropdown-menu').first().stop(true, true).slideDown(0);
					$li.addClass('opened');
				}
			})
		}
	}


	// Lazy Load animation
	function onScrollInit(items, wW) {
		if (wW > 991) {
			if (!$('body').data('firstInit')) {
				items.each(function () {
					var $element = $(this),
						animationClass = $element.attr('data-animation'),
						animationDelay = $element.attr('data-animation-delay');
					$element.removeClass('no-animate');
					$element.css({
						'-webkit-animation-delay': animationDelay,
						'-moz-animation-delay': animationDelay,
						'animation-delay': animationDelay
					});
					var trigger = $element;
					trigger.waypoint(function () {
						$element.addClass('animated').addClass(animationClass);
						if ($element.hasClass('hoveranimation')) {
							$element.on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function () {
								$(this).removeClass("animated").removeClass("animation").removeClass(animationClass);
							});
						}
					}, {
						triggerOnce: true,
						offset: '90%'
					});
				});
				$('body').data('firstInit', true);
			}
		} else {
			items.each(function () {
				var $element = $(this);
				$element.addClass('no-animate')
			})
		}
	}

	// Get Scrollbar Width
	function getScrollbarWidth() {
		var outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

		document.body.appendChild(outer);

		var widthNoScroll = outer.offsetWidth;
		// force scrollbars
		outer.style.overflow = "scroll";

		// add innerdiv
		var inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);

		var widthWithScroll = inner.offsetWidth;

		// remove divs
		outer.parentNode.removeChild(outer);

		return widthNoScroll - widthWithScroll;
	}

	// Click event to banner on mobile when action button is hidden
	function mobileClickBanner(wW) {
		if (wW < 768) {
			$(".banner-under-slider").on('click', function (e) {
				var $this = $(this);
				var target = $this.find('.action .btn').attr('href');
				if (target) $(location).attr('href', target);
				e.preventDefault();
			})
		} else {
			$(".banner-under-slider").unbind('click');
		}
	}

	// Google Map
	function createMap(id, mapZoom, lat, lng) {
		// Create google map
		// Basic options for a simple Google Map
		// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
		var mapOptions = {
			// How zoomed in you want the map to start at (always required)
			zoom: mapZoom,
			scrollwheel: false, // The latitude and longitude to center the map (always required)
			center: new google.maps.LatLng(lat, lng),
			// How you would like to style the map. 
			// This is where you would paste any style found on Snazzy Maps.
			styles: [{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [{
					"color": "#e9e9e9"
                }, {
					"lightness": 17
                }]
            }, {
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [{
					"color": "#f5f5f5"
                }, {
					"lightness": 20
                }]
            }, {
				"featureType": "road.highway",
				"elementType": "geometry.fill",
				"stylers": [{
					"color": "#ffffff"
                }, {
					"lightness": 17
                }]
            }, {
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [{
					"color": "#ffffff"
                }, {
					"lightness": 29
                }, {
					"weight": 0.2
                }]
            }, {
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [{
					"color": "#ffffff"
                }, {
					"lightness": 18
                }]
            }, {
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [{
					"color": "#ffffff"
                }, {
					"lightness": 16
                }]
            }, {
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [{
					"color": "#f5f5f5"
                }, {
					"lightness": 21
                }]
            }, {
				"featureType": "poi.park",
				"elementType": "geometry",
				"stylers": [{
					"color": "#dedede"
                }, {
					"lightness": 21
                }]
            }, {
				"elementType": "labels.text.stroke",
				"stylers": [{
					"visibility": "on"
                }, {
					"color": "#ffffff"
                }, {
					"lightness": 16
                }]
            }, {
				"elementType": "labels.text.fill",
				"stylers": [{
					"saturation": 36
                }, {
					"color": "#333333"
                }, {
					"lightness": 40
                }]
            }, {
				"elementType": "labels.icon",
				"stylers": [{
					"visibility": "off"
                }]
            }, {
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [{
					"color": "#f2f2f2"
                }, {
					"lightness": 19
                }]
            }, {
				"featureType": "administrative",
				"elementType": "geometry.fill",
				"stylers": [{
					"color": "#fefefe"
                }, {
					"lightness": 20
                }]
            }, {
				"featureType": "administrative",
				"elementType": "geometry.stroke",
				"stylers": [{
					"color": "#fefefe"
                }, {
					"lightness": 17
                }, {
					"weight": 1.2
                }]
            }]
		};
		// Get the HTML DOM element that will contain your map 
		// We are using a div with id="map" seen below in the <body>
		var mapElement = document.getElementById(id);
		// Create the Google Map using our element and options defined above
		var map = new google.maps.Map(mapElement, mapOptions);
		var image = 'images/map-marker.png';
		// Let's also add a marker while we're at it
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map,
			icon: image
		});

	}
	// END FUNCTIONS

})(jQuery);