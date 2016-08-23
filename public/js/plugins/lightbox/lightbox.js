// Generated by CoffeeScript 1.4.0

/*
Lightbox v2.51
by Lokesh Dhakar - http://www.lokeshdhakar.com

For more information, visit:
http://lokeshdhakar.com/projects/lightbox2/

Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
- free for use in both personal and commercial projects
- attribution requires leaving author name, author link, and the license info intact
	
Thanks
- Scott Upton(uptonic.com), Peter-Paul Koch(quirksmode.com), and Thomas Fuchs(mir.aculo.us) for ideas, libs, and snippets.
- Artemy Tregubenko (arty.name) for cleanup and help in updating to latest proto-aculous in v2.05.


Table of Contents
=================
LightboxOptions

Lightbox
- constructor
- init
- enable
- build
- start
- changeImage
- sizeContainer
- showImage
- updateNav
- updateDetails
- preloadNeigbhoringImages
- enableKeyboardNav
- disableKeyboardNav
- keyboardAction
- end

options = new LightboxOptions
lightbox = new Lightbox options
*/


(function($) {

  LightboxOptions = (function() {

    function LightboxOptions() {
      this.fileLoadingImage = 'images/loading.gif';
      this.fileCloseImage = 'images/close.png';
      this.resizeDuration = 700;
      this.fadeDuration = 500;
      this.labelImage = "Image";
      this.labelOf = "of";
      this.lightboxId = 'body';
      this.appliedElements = 'a[rel^=lightbox], area[rel^=lightbox]';
      this.classLightBox = 'lightbox';
      this.classLightBoxOverlay = 'lightboxOverlay';
      this.linkPreviousAlbum = null; // add captura
      this.linkNextAlbum = null; // add captura
    }

    return LightboxOptions;

  })();

  Lightbox = (function() {

    function Lightbox(options) {
      this.options = options;
      this.album = [];
      this.currentImageIndex = void 0;
      this.flagAjax = false;
//      this.init();
    }

    Lightbox.prototype.init = function() {
      this.enable();
      return this.build();
    };

    Lightbox.prototype.enable = function() {
      var _this = this;
      return $('body').on('click', this.options.appliedElements , function(e) {
        _this.currentTarget = $(e.currentTarget); 
        _this.start();
        return false;
      });
    };
    
    // Extensible
    Lightbox.prototype.structure = function() {
    	$("<div class='" + this.options.classLightBoxOverlay + "'></div><div class='" + this.options.classLightBox + "'><div class='lb-outerContainer'><div class='lb-container'><img class='lb-image' src='' ><div class='lb-nav'><a class='lb-prev' href='' ></a><a class='lb-next' href='' ></a></div><div class='lb-loader'><a class='lb-cancel'><img src='" + this.options.fileLoadingImage + "'></a></div></div></div><div class='lb-dataContainer'><div class='lb-data'><div class='lb-details'><span class='lb-caption'></span><span class='lb-number'></span></div><div class='lb-closeContainer'><a class='lb-close'><img src='" + this.options.fileCloseImage + "'></a></div></div></div></div>").appendTo($(this.options.lightboxId));
    }

    // Extensible
    Lightbox.prototype.preBuildEvent = function() { }
    
    // Extensible
    Lightbox.prototype.posBuildEvent = function() { }
    
    Lightbox.prototype.build = function() 
    {
    	var _this = this;
    	this.preBuildEvent();
    	this.structure();
    	var $lightbox =  $(this.options.lightboxId + ' .' + this.options.classLightBox);
    	
    	$(this.options.lightboxId + ' .' + this.options.classLightBoxOverlay).hide().on('click', function(e) {
    		_this.end();
    		return false;
    	});
    	
    	$lightbox.hide().on('click', function(e) {
    		if ($(e.target).attr('id') === 'lightbox') {
    			_this.end();
    		}
    		return false;
    	});
    	
    	$lightbox.find('.lb-outerContainer').on('click', function(e) {
    		if ($(e.target).attr('id') === 'lightbox') {
    			_this.end();
    		}
    		return false;
    	});
    	
    	$lightbox.find('.lb-prev').on('click', function(e) {
    		_this.changeImage(_this.currentImageIndex - 1);
    		return false;
    	});
    	
    	$lightbox.find('.lb-next').on('click', function(e) {
    		_this.changeImage(_this.currentImageIndex + 1);
    		return false;
    	});
    	
    	$lightbox.find('.lb-loader, .lb-close').on('click', function(e) {
    		_this.end();
    		return false;
    	});
    	this.posBuildEvent($lightbox);
    };
    
    // Extensible
    Lightbox.prototype.createAlbum = function() {
    	var  a, i, _i, _len, _ref;
    	this.album = [];
        imageNumber = 0;
        $link = this.currentTarget;
        if ($link.attr('rel') === 'lightbox') {
            this.album.push({
              link: $link.attr('href'),
              title: $link.attr('title')
            });
          } else {
            _ref = $($link.prop("tagName") + '[rel="' + $link.attr('rel') + '"]');
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              a = _ref[i];
              this.album.push({
                link: $(a).attr('href'),
                title: $(a).attr('title')
              });
              if ($(a).attr('href') === $link.attr('href')) {
                imageNumber = i;
              }
            }
          }
        return imageNumber;
    }
    
    // Extensible
    Lightbox.prototype.getPositionConfiguration = function() {
    	var $window = $(window);
        return {
        	top : $window.scrollTop() + $window.height() / 10,
        	left : $window.scrollLeft()
        };
    }
    
    // Extensible
    Lightbox.prototype.preStartEvent = function() { }
    
    Lightbox.prototype.start = function() {
      var $lightbox, imageNumber;
      this.preStartEvent();
      $link = this.currentTarget; // captura add
      $(window).on("resize", this.sizeOverlay(this.options));
      $('select, object, embed').css({
        visibility: "hidden"
      });
      $(this.options.lightboxId + ' .' + this.options.classLightBoxOverlay).width($(document).width()).height($(document).height()).fadeIn(this.options.fadeDuration);
      this.options.linkrel = $link.attr('rel'); // captura add
      imageNumber = this.createAlbum();
      $lightbox = $(this.options.lightboxId + ' .' + this.options.classLightBox);
      $lightbox.css(this.getPositionConfiguration()).fadeIn(this.options.fadeDuration);
      this.changeImage(imageNumber);
    };

    // Extensible
    Lightbox.prototype.preChangeImageEvent = function($lightbox) {
    	$lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();
    }
    
    Lightbox.prototype.changeImage = function(imageNumber) {
      var $image, $lightbox, preloader,
        _this = this;
      
      imageNumber = imageNumber <= 0 ? 0 : imageNumber >= _this.album.length - 1 ? _this.album.length - 1 :  imageNumber; // captura fix for negative numbers
      
      $lightbox = $(this.options.lightboxId + ' .' + this.options.classLightBox);
      this.preChangeImageEvent($lightbox);
      this.disableKeyboardNav();
      $image = $lightbox.find('.lb-image');
      this.sizeOverlay(this.options);
      $(this.options.lightboxId + ' .' + this.options.classLightBoxOverlay).fadeIn(this.options.fadeDuration);
      $('.loader').fadeIn('slow');
      $lightbox.find('.lb-outerContainer').addClass('animating');
      preloader = new Image;
      preloader.onload = function() {
        $image.attr('src', _this.album[imageNumber].link);
        $image.width = preloader.width;
        $image.height = preloader.height;
        return _this.sizeContainer(preloader.width, preloader.height);
      };

      preloader.src = this.album[imageNumber].link;
      this.currentImageIndex = imageNumber;
    };

    Lightbox.prototype.sizeOverlay = function(options) {
      return $(this.options.lightboxId + ' .' + options.classLightBoxOverlay).width($(document).width()).height($(document).height());
    };

    Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
      var $container, $lightbox, $outerContainer, containerBottomPadding, containerLeftPadding, containerRightPadding, containerTopPadding, newHeight, newWidth, oldHeight, oldWidth,
        _this = this;
      $lightbox = $(this.options.lightboxId + ' .' + this.options.classLightBox);
      $outerContainer = $lightbox.find('.lb-outerContainer');
      oldWidth = $outerContainer.outerWidth();
      oldHeight = $outerContainer.outerHeight();
      $container = $lightbox.find('.lb-container');
      containerTopPadding = parseInt($container.css('padding-top'), 10);
      containerRightPadding = parseInt($container.css('padding-right'), 10);
      containerBottomPadding = parseInt($container.css('padding-bottom'), 10);
      containerLeftPadding = parseInt($container.css('padding-left'), 10);
      newWidth = imageWidth + containerLeftPadding + containerRightPadding;
      newHeight = imageHeight + containerTopPadding + containerBottomPadding;
      if (newWidth !== oldWidth && newHeight !== oldHeight) {
        $outerContainer.animate({
          width: newWidth,
          height: newHeight
        }, this.options.resizeDuration, 'swing');
      } else if (newWidth !== oldWidth) {
        $outerContainer.animate({
          width: newWidth
        }, this.options.resizeDuration, 'swing');
      } else if (newHeight !== oldHeight) {
        $outerContainer.animate({
          height: newHeight
        }, this.options.resizeDuration, 'swing');
      }
      setTimeout(function() {
        $lightbox.find('.lb-dataContainer').width(newWidth);
        $lightbox.find('.lb-prevLink').height(newHeight);
        $lightbox.find('.lb-nextLink').height(newHeight);
        _this.showImage();
      }, this.options.resizeDuration);
    };

    // Extensible
    Lightbox.prototype.showImageEffect = function($lightbox) {
    	$lightbox.find('.lb-image').fadeIn('slow');
    }
    
    Lightbox.prototype.showImage = function() {
      var $lightbox;
      $lightbox = $(this.options.lightboxId + ' .' + this.options.classLightBox);
      $lightbox.find('.lb-loader').hide();
      this.showImageEffect($('.' + this.options.classLightBox));
      this.updateNav();
      this.updateDetails();
      this.preloadNeighboringImages();
      this.enableKeyboardNav();
    };

    Lightbox.prototype.updateNav = function() {
      var $lightbox, _this = this;
      var options = this.options;
      $lightbox = $(this.options.lightboxId + ' .' + this.options.classLightBox);
      $lightbox.find('.lb-nav').show();
      if (this.currentImageIndex > 0) {
        $lightbox.find('.lb-prev').show();
      } 
      if(this.currentImageIndex == 0 && this.options.linkPreviousAlbum){
    	  $lightbox.find('.lb-prev').show();
    	  $lightbox.find('.lb-prev').click(function(){
    		  window.location  = options.linkPreviousAlbum + '/' + _this.album.length ;
    	  });
      }
      
      if (this.currentImageIndex < this.album.length - 1) {
        $lightbox.find('.lb-next').show();
      } 
      
      if(this.currentImageIndex >= this.album.length - 1 && this.options.linkNextAlbum){
    	  $lightbox.find('.lb-next').show();
    	  $lightbox.find('.lb-next').click(function(){
    		  window.location  = options.linkNextAlbum + '/1';
    	  });
      }
    };

    // Extensible
    Lightbox.prototype.populateDataLightBox = function($lightbox) {
    	
        if (typeof this.album[this.currentImageIndex].title !== 'undefined' && this.album[this.currentImageIndex].title !== "") {
          $lightbox.find('.lb-caption').html(this.album[this.currentImageIndex].title).fadeIn('fast');
        }
        if (this.album.length > 1) {
          $lightbox.find('.lb-number').html(this.options.labelImage + ' ' + (this.currentImageIndex + 1) + ' ' + this.options.labelOf + '  ' + this.album.length).fadeIn('fast');
        } else {
          $lightbox.find('.lb-number').hide();
        }
    }
    
    Lightbox.prototype.updateDetails = function() {
      var $lightbox,
        _this = this;
      $lightbox = $(this.options.lightboxId + ' .' + this.options.classLightBox);
      this.populateDataLightBox($lightbox);
      $lightbox.find('.lb-outerContainer').removeClass('animating');
      $lightbox.find('.lb-dataContainer').fadeIn(this.resizeDuration, function() {
        return _this.sizeOverlay(_this.options);
      });
    };

    Lightbox.prototype.preloadNeighboringImages = function() {
      var preloadNext, preloadPrev;
      if (this.album.length > this.currentImageIndex + 1) {
        preloadNext = new Image;
        preloadNext.src = this.album[this.currentImageIndex + 1].link;
      }
      if (this.currentImageIndex > 0) {
        preloadPrev = new Image;
        preloadPrev.src = this.album[this.currentImageIndex - 1].link;
      }
    };

    Lightbox.prototype.enableKeyboardNav = function() {
      $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
    };

    Lightbox.prototype.disableKeyboardNav = function() {
      $(document).off('.keyboard');
    };

    Lightbox.prototype.keyboardAction = function(event) {
      var KEYCODE_ESC, KEYCODE_LEFTARROW, KEYCODE_RIGHTARROW, key, keycode;
      KEYCODE_ESC = 27;
      KEYCODE_LEFTARROW = 37;
      KEYCODE_RIGHTARROW = 39;
      keycode = event.keyCode;
      key = String.fromCharCode(keycode).toLowerCase();
      if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
        this.end();
      } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
        if (this.currentImageIndex !== 0) {
          this.changeImage(this.currentImageIndex - 1);
        }
      } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
        if (this.currentImageIndex !== this.album.length - 1) {
          this.changeImage(this.currentImageIndex + 1);
        }
      }
    };

    // Extensible
    Lightbox.prototype.preEndEvent = function($lightbox){ }
    
    Lightbox.prototype.end = function() {
    	
    	var $lightbox =  $(this.options.lightboxId + ' .' + this.options.classLightBox);
    	this.preEndEvent($lightbox);
    	this.disableKeyboardNav();
    	$(window).off("resize", this.sizeOverlay(this.options));
    	$(this.options.lightboxId + ' .' + this.options.classLightBox).fadeOut(this.options.fadeDuration);
    	$(this.options.lightboxId + ' .' + this.options.classLightBoxOverlay).fadeOut(this.options.fadeDuration);
    	return $('select, object, embed').css({
    		visibility: "visible"
    	});
    };

    return Lightbox;

  })();

  

})(jQuery);
