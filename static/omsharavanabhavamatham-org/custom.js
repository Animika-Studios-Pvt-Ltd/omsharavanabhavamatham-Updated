var $menuTrigger = $('.js-menuToggle');
var $topNav = $('.js-topPushNav');
var $openLevel = $('.js-openLevel');
var $closeLevel = $('.js-closeLevel');
var $closeLevelTop = $('.js-closeLevelTop');
var $navLevel = $('.js-pushNavLevel');

function openPushNav() {
  $topNav.addClass('isOpen');
  $('body').addClass('pushNavIsOpen');
}

function closePushNav() {
  $topNav.removeClass('isOpen');
  $openLevel.siblings().removeClass('isOpen');
  $('body').removeClass('pushNavIsOpen');
}

$menuTrigger.on('click touchstart', function(e) {
  e.preventDefault();
  if ($topNav.hasClass('isOpen')) {
    closePushNav();
  } else {
    openPushNav();
  }
});

$openLevel.on('click touchstart', function(){
  $(this).next($navLevel).addClass('isOpen');
});

$closeLevel.on('click touchstart', function(){
  $(this).closest($navLevel).removeClass('isOpen');
});

$closeLevelTop.on('click touchstart', function(){
  closePushNav();
});

$('.screen').click(function() {
    closePushNav();
});



// $('a.show').click(function(e){
//     e.preventDefault();
// });

     $(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        
        $('#return-to-top').fadeIn(200);    
    } else {
        $('#return-to-top').fadeOut(200);   
    }
});
$('#return-to-top').click(function() {      
    $('body,html').animate({
        scrollTop : 0                       
    }, 500);
});


AOS.init({ 
  disable: 'phone', 
  delay: 0, 
  once: true, 
});


function toggleIcon(e) {
  $(e.target)
    .prev('.panel-heading')
    .find(".more-less")
    .toggleClass('glyphicon-plus glyphicon-minus');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);

$(document).ready(function() {
$(window).resize(function(){
  if ($(window).width() >= 980){ 

      $(".navbar .dropdown-toggle").hover(function () {
         $(this).parent().toggleClass("show");
         $(this).parent().find(".dropdown-menu").toggleClass("show"); 
       });

      $( ".navbar .dropdown-menu").mouseleave(function() {
        $(this).removeClass("show");  
      });
      
  } 
});  
 
});

  

  jQuery(document).ready(function() {
        function close_accordion_section() {
            jQuery('.accordion .accordion-section-title').removeClass('active');
            jQuery('.accordion .accordion-section-content').slideUp(500).removeClass('open');
        }

        jQuery('.accordion-section-title').click(function(e) {
            var currentAttrValue = jQuery(this).attr('href');

            if(jQuery(e.target).is('.active')) {
                close_accordion_section();
            }else {
                close_accordion_section();
                jQuery(this).addClass('active');
                jQuery('.accordion ' + currentAttrValue).slideDown(500).addClass('open');
            }

            e.preventDefault();
        });
    });



    // jQuery(document).ready(function() {
    //     function close_accordion_section() {
    //         jQuery('.accordion .accordion-section-title1').removeClass('active');
    //         jQuery('.accordion .accordion-section-content').slideUp(500).removeClass('open');
    //     }

    //     jQuery('.accordion-section-title1').click(function(e) {
    //         var currentAttrValue = jQuery(this).attr('href');

    //         if(jQuery(e.target).is('.active')) {
    //             close_accordion_section();
    //         }else {
    //             close_accordion_section();
    //             jQuery(this).addClass('active');
    //             jQuery('.accordion ' + currentAttrValue).slideDown(500).addClass('open');
    //         }

    //         e.preventDefault();
    //     });
    // });





$(document).ready(function() {
$(window).resize(function(){
  if ($(window).width() >= 980){  

      $(".navbar .dropdown-toggle").hover(function () {
         $(this).parent().toggleClass("show");
         $(this).parent().find(".dropdown-menu").toggleClass("show"); 
       });

      $( ".navbar .dropdown-menu" ).mouseleave(function() {
        $(this).removeClass("show");  
      });
  
  } 
});  
  
});


AOS.init({
  duration: 1000
});


$(document).ready(function(){
  $('#nav-icon1').click(function(){
    $(this).toggleClass('open');
  });
});




    $('.feedback_hood').click(function(){
    var check=$(this).data('enquiry');
    if(check=='no'){
        console.log('come forth');
        $('.feedback_container').animate({
            right:'0px'
        },
        {
            duration:1000

        });
        $('.feedback_hood').data('enquiry','yes');
    }
    else{
        $('.feedback_container').animate({
            right:'-340px'
            },
        {
            duration:1000

        });
        console.log('go back');
        $('.feedback_hood').data('enquiry','no');

    }

    $(".enq-c-btn img").click(function(){
    $('.feedback_container').animate({
            right:'-340px'
        });
    });
});


$('.slider-content').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  fade: false,
  infinite: false,
  speed: 4000,
  asNavFor: '.slider-thumb',
  arrows:false,
  autoplay:true
    // arrows: true,
    // prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
    // nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
});
$('.slider-thumb').slick({
  slidesToShow: 4,
  slidesToScroll: 4,
  asNavFor: '.slider-content',
  dots: false,
  centerMode: false,
  focusOnSelect: true
});

$('a[data-slide]').click(function(e) {
    e.preventDefault();
    var slideno = $(this).data('slide');
    $('.slider-content').slick('slickGoTo', slideno - 1);
});



 // $(document).ready(function () {
 //      setImageOne();
 //    });

 //    function setImageOne() {
 //      $('#imageSwap').fadeIn(500).html('<img src="Content/Public/images/Sri-Narayani-Peedam.jpg" class="img-responsive"/>').delay(5000).fadeOut(500, function () { setImageTwo(); });
 //    }

 //    function setImageTwo() {
 //      $('#imageSwap').fadeIn(500).html('<img src="Content/Public/images/1-Sri-Narayani-Peedam.jpg" class="img-responsive"/>').delay(5000).fadeOut(500, function () { setImageOne(); });
 //    }





function calculateTotalValue(length) {
  var minutes = Math.floor(length / 60),
    seconds_int = length - minutes * 60,
    seconds_str = seconds_int.toString(),
    seconds = seconds_str.substr(0, 2),
    time = minutes + ':' + seconds

  return time;
}

function calculateCurrentValue(currentTime) {
  var current_hour = parseInt(currentTime / 3600) % 24,
    current_minute = parseInt(currentTime / 60) % 60,
    current_seconds_long = currentTime % 60,
    current_seconds = current_seconds_long.toFixed(),
    current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

  return current_time;
}

// function initProgressBar() {
//   var player = document.getElementById('player');
//   var length = player.duration
//   var current_time = player.currentTime;

//   var totalLength = calculateTotalValue(length)
//   jQuery(".end-time").html(totalLength);

//   var currentTime = calculateCurrentValue(current_time);
//   jQuery(".start-time").html(currentTime);

//   var progressbar = document.getElementById('seekObj');
//   progressbar.value = (player.currentTime / player.duration);
//   progressbar.addEventListener("click", seek);

//   if (player.currentTime == player.duration) {
//     $('#play-btn').removeClass('pause');
//   }

//   function seek(evt) {
//     var percent = evt.offsetX / this.offsetWidth;
//     player.currentTime = percent * player.duration;
//     progressbar.value = percent / 100;
//   }
// };

// function initPlayers(num) {

//   for (var i = 0; i < num; i++) {
//     (function() {
//       var playerContainer = document.getElementById('player-container'),
//         player = document.getElementById('player'),
//         isPlaying = false,
//         playBtn = document.getElementById('play-btn');

//       if (playBtn != null) {
//         playBtn.addEventListener('click', function() {
//           togglePlay()
//         });
//       }

//       function togglePlay() {
//         if (player.paused === false) {
//           player.pause();
//           isPlaying = false;
//           $('#play-btn').removeClass('pause');

//         } else {
//           player.play();
//           $('#play-btn').addClass('pause');
//           isPlaying = true;
//         }
//       }
//     }());
//   }
// }

// initPlayers(jQuery('#player-container').length);



mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
  var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [10, 20],
            zoom: 2,
        });

        map.addControl(new mapboxgl.FullscreenControl());

        var size = 60;
        var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd: function() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
        },
         
        render: function() {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;
         
        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();
        context.beginPath();
        context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();
        this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
        ).data;
        map.triggerRepaint();
        return true;
        }
        };


        map.on('load', function() {
            map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

            map.addSource('places', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [76.4158, 10.9067]
                        },
                        'properties': {
                            'title': 'Sreekrishnapuram',
                            'color': '#fff',
                            'icon': 'monument',
                            'description': '<strong> Palakkad, Sreekrishnapuram, Established in 2006, Birth place - Thirupurakundram Sri Kalyana Subramanya Temple, cum ashram .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [75.8595, 11.2734]
                        },
                        'properties': {
                            'title': 'Mayiladumkunnu',
                            'icon': 'monument',
                            'description': '<strong> Kozhikode,  Established in 2017, Melpalani Sri Jnana Dandhayuthapaani Temple cum ashram .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [75.7874, 11.2604]
                        },
                        'properties': {
                            'title': 'Kalluthankadavu',
                            'icon': 'monument',
                            'description': '<strong>Kozhikode - Established in 2005, First ashram  .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [77.6070, 13.1155]
                        },
                        'properties': {
                            'title': 'Yelahanka',
                            'icon': 'monument',
                            'description': '<strong>About Yelahanka ashram.</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-0.1278, 51.5074]
                        },
                        'properties': {
                            'title': 'London',
                            'icon': 'monument',
                            'description': '<strong>UK - Established in 2010 - Ashram & Community Centre .</p>',
                        }
                    }, {

                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [80.2707, 13.0827]
                        },
                        'properties': {
                            'title': 'Chennai',
                            'icon': 'monument',
                            'description': '<strong>About Chennai, Mission in India.</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [72.8777, 19.0760]
                        },
                        'properties': {
                            'title': 'Mumbai',
                            'icon': 'monument',
                            'description': '<strong>About Mumbai, Mission in India .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [72.8777, 19.0760]
                        },
                        'properties': {
                            'title': 'Mumbai',
                            'icon': 'monument',
                            'description': '<strong>About Mumbai, Mission in India .</p>',
                        }
                    }, {
                        
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [77.2090, 28.6139]
                        },
                        'properties': {
                            'title': 'New Delhi',
                            'icon': 'monument',
                            'description': '<strong>About New Delhi , Mission in India .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [76.9558, 11.0168]
                        },
                        'properties': {
                            'title': 'Coimbatore',
                            'icon': 'monument',
                            'description': '<strong>About Coimbatore , Mission in India .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [75.8069, 12.3375]
                        },
                        'properties': {
                            'title': 'kodagu',
                            'icon': 'monument',
                            'description': '<strong>About kodagu , Mission in India .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [76.2014, 10.9773]
                        },
                        'properties': {
                            'title': 'Angadipuram',
                            'icon': 'monument',
                            'description': '<strong>About Angadipuram , Mission in India .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [76.2673, 9.9312]
                        },
                        'properties': {
                            'title': 'Kochi',
                            'icon': 'monument',
                            'description': '<strong>About Kochi , Mission in India .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [75.3704, 11.8745]
                        },
                        'properties': {
                            'title': 'Kannur',
                            'icon': 'monument',
                            'description': '<strong>About Kannur , Mission in India .</p>',
                        }

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [76.5662, 11.0681]
                        },
                        'properties': {
                            'title': 'Attappadi',
                            'icon': 'monument',
                            'description': '<strong>About Attappadi , Mission in India .</p>',
                        }
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [76.4610, 10.9932]
                        },
                        'properties': {
                            'title': 'Mannarkkad',
                            'icon': 'monument',
                            'description': '<strong>About Mannarkkad , Mission in India .</p>',
                        }

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [76.1320, 11.6854]
                        },
                        'properties': {
                            'title': 'Wayanad',
                            'icon': 'monument',
                            'description': '<strong>About Wayanad , Mission in India .</p>',
                        }

                    }, {

                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [101.9758, 4.2105]
                        },
                        'properties': {
                            'title': 'Malaysia',
                            'icon': 'harbor',
                            'description': '<strong>About Malaysia , Overseas Mission .</p>',
                        }


                    }, { 
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [103.8198, 1.3521]
                        },
                        'properties': {
                            'title': 'Singapore',
                            'icon': 'harbor',
                            'description': '<strong>About Singapore  , Overseas Mission .</p>',
                        },


                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-3.4360, 55.3781]
                        },
                        'properties': {
                            'title': 'UK',
                            'icon': 'harbor',
                            'description': '<strong>About UK, Overseas Mission .</p>',
                        },


                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-3.7837, 52.1307]
                        },
                        'properties': {
                            'title': 'Wales',
                            'icon': 'harbor',
                            'description': '<strong>About Wales, Overseas Mission .</p>',
                        },


                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-1.8904, 52.4862]
                        },
                        'properties': {
                            'title': 'Birmingham',
                            'icon': 'harbor',
                            'description': '<strong>About Birmingham , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-2.2426, 53.4808]
                        },
                        'properties': {
                            'title': 'Manchester',
                            'icon': 'harbor',
                            'description': '<strong>About Manchester , Overseas Mission .</p>',
                        },


                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-1.1398, 52.6369]
                        },
                        'properties': {
                            'title': 'Leicester',
                            'icon': 'harbor',
                            'description': '<strong>About Leicester , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-1.2577, 51.7520]
                        },
                        'properties': {
                            'title': 'Oxford',
                            'icon': 'harbor',
                            'description': '<strong>About Oxford , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-4.2026, 56.4907]
                        },
                        'properties': {
                            'title': 'Scotland',
                            'icon': 'harbor',
                            'description': '<strong>About Scotland , Overseas Mission .</p>',
                        },



                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [22.9375, -30.5595]
                        },
                        'properties': {
                            'title': 'South Africa',
                            'icon': 'harbor',
                            'description': '<strong>About South Africa , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [28.0473, -26.2041]
                        },
                        'properties': {
                            'title': 'Johannesburg',
                            'icon': 'harbor',
                            'description': '<strong>About Johannesburg , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [31.0218, -29.8587]
                        },
                        'properties': {
                            'title': 'Durban',
                            'icon': 'harbor',
                            'description': '<strong>About Durban , Overseas Mission .</p>',
                        },


                    }, {
                        
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [2.2137, 46.2276]
                        },
                        'properties': {
                            'title': 'France',
                            'icon': 'harbor',
                            'description': '<strong>About France , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [10.4515, 51.1657]
                        },
                        'properties': {
                            'title': 'Germany',
                            'icon': 'harbor',
                            'description': '<strong>About Germany , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [8.2275, 46.8182]
                        },
                        'properties': {
                            'title': 'Switzerland',
                            'icon': 'harbor',
                            'description': '<strong>About Switzerland , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [7.4474, 46.9480]
                        },
                        'properties': {
                            'title': 'Bern',
                            'icon': 'harbor',
                            'description': '<strong>About Bern , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [8.5417, 47.3769]
                        },
                        'properties': {
                            'title': 'Zurich',
                            'icon': 'harbor',
                            'description': '<strong>About Zurich , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [7.6280, 46.7580]
                        },
                        'properties': {
                            'title': 'Thun',
                            'icon': 'harbor',
                            'description': '<strong>About Thun , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [9.8360, 46.8027]
                        },
                        'properties': {
                            'title': 'Davos',
                            'icon': 'harbor',
                            'description': '<strong>About Davos , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [6.1432, 46.2044]
                        },
                        'properties': {
                            'title': 'Geneva',
                            'icon': 'harbor',
                            'description': '<strong>About Geneva , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [5.2913, 52.1326]
                        },
                        'properties': {
                            'title': 'Netherlands',
                            'icon': 'harbor',
                            'description': '<strong>About Netherlands , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [8.4689, 60.4720]
                        },
                        'properties': {
                            'title': 'Norway',
                            'icon': 'harbor',
                            'description': '<strong>About Norway , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-106.3468, 56.1304]
                        },
                        'properties': {
                            'title': 'Canada',
                            'icon': 'harbor',
                            'description': '<strong>About Canada , Overseas Mission .</p>',
                        },


                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-79.3832, 43.6532]
                        },
                        'properties': {
                            'title': 'Toronto',
                            'icon': 'harbor',
                            'description': '<strong>About Toronto , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-113.4938, 53.5461]
                        },
                        'properties': {
                            'title': 'Edmonton',
                            'icon': 'harbor',
                            'description': '<strong>About Edmonton , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-95.7129, 37.0902]
                        },
                        'properties': {
                            'title': 'United States',
                            'icon': 'harbor',
                            'description': '<strong>About United States , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-119.4179, 36.7783]
                        },
                        'properties': {
                            'title': 'California',
                            'icon': 'harbor',
                            'description': '<strong>About California , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-81.5158, 27.6648]
                        },
                        'properties': {
                            'title': 'Florida',
                            'icon': 'harbor',
                            'description': '<strong>About Florida , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-74.4057, 40.0583]
                        },
                        'properties': {
                            'title': 'New Jersey',
                            'icon': 'harbor',
                            'description': '<strong>About New Jersey , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-74.0060, 40.7128]
                        },
                        'properties': {
                            'title': 'New York',
                            'icon': 'harbor',
                            'description': '<strong>About New York , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [57.5522, -20.3484]
                        },
                        'properties': {
                            'title': 'Mauritius',
                            'icon': 'harbor',
                            'description': '<strong>About  Mauritius , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [53.8478, 23.4241]
                        },
                        'properties': {
                            'title': 'United Arab Emirates',
                            'icon': 'harbor',
                            'description': '<strong>About United Arab Emirates , Overseas Mission .</p>',
                        },


                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [55.2708, 25.2048]
                        },
                        'properties': {
                            'title': 'Dubai',
                            'icon': 'harbor',
                            'description': '<strong>About Dubai , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [54.3773, 24.4539]
                        },
                        'properties': {
                            'title': 'Abu Dabhi',
                            'icon': 'harbor',
                            'description': '<strong>About Abu Dabhi , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [54.3773, 24.4539]
                        },
                        'properties': {
                            'title': 'Sharjah',
                            'icon': 'harbor',
                            'description': '<strong>About Sharjah , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [133.7751, -25.2744]
                        },
                        'properties': {
                            'title': 'Australia',
                            'icon': 'harbor',
                            'description': '<strong>About Australia , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [151.2093, -33.8688]
                        },
                        'properties': {
                            'title': 'Sydney',
                            'icon': 'harbor',
                            'description': '<strong>About Sydney , Overseas Mission .</p>',
                        },
                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [144.9631, -37.8136]
                        },
                        'properties': {
                            'title': 'Melbourne',
                            'icon': 'harbor',
                            'description': '<strong>About Melbourne , Overseas Mission .</p>',
                        },

                    }, {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [51.1839, 25.3548]
                        },
                        'properties': {
                            'title': 'Qatar',
                            'icon': 'harbor',
                            'description': '<strong>About Qatar , Overseas Mission .</p>',
                        },



                    }]
                }
            });

           
            map.addLayer({
                'id': 'places',
                'type': 'symbol',
                'source': 'places',
                'layout': {
                   'icon-image': 'pulsing-dot',
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top',

                    'icon-allow-overlap': true
                }
            });
            var popup = new mapboxgl.Popup({
                closeButton: true,
                closeOnClick: false
            });

            map.on('mouseenter', 'places', function(e) {
                map.getCanvas().style.cursor = 'pointer';

                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = e.features[0].properties.description;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                popup
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
            });

            map.on('mouseleave', 'places', function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        });