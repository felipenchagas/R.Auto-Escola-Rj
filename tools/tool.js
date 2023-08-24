
	$(document).ready(function () {
		console.log('fdsfd')
		function clearColor(){
			$('body').removeClass('color-green color-blue color-violet')
		}
		
		$('.tools a').on('click', function(e){
			e.preventDefault();
			var $this = $(this);
			if ($this.hasClass('color-green')){
				clearColor();
				$('body').addClass('color-green')
			}
			if ($this.hasClass('color-blue')){
				clearColor();
				$('body').addClass('color-blue')
			}
			if ($this.hasClass('color-violet')){
				clearColor();
				$('body').addClass('color-violet')
			}
			if ($this.hasClass('color-yellow')){
				clearColor();
			}
		})
	
	})
