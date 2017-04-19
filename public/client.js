
$(document).ready(function(){
  setTimeout(function(){
    //  animation of title
    $('#headline').animate({opacity: 1}, 'slow'); 
    $('.first').fadeIn(100);
    $('.second').fadeIn("slow");
    $('#isbn').focus();
  }, 800);
  $("#isbn").on('blur', function(event){
    var isbn = $('#isbn').val();
    $.get('/check?' + $.param({isbn: isbn}), function(response) {
      
      console.log("showing cover of " + response.delivery.query.title)
      var cover = $(".book-cover")
      cover.addClass('hidden')
      cover.attr('src', response.delivery.query.imageLinks.thumbnail)
      cover.slideDown()
      $('#headline').text(response.delivery.headline)
        

    });
  });  
      /*$('<li></li>').text(dream).appendTo('ul#dreams');
      $('input').val('');
      $('input').focus();*/
  $("#zipcode").on('focus', function(){
     var xTriggered = 0;
    $( "#zipcode" ).keyup(function( event ) {
      xTriggered++;
      if (xTriggered > 3){
        
        var zipcode = $(this).val()
        $.get('/books' + '?zipcode=' + zipcode, function(response){
          $('main').html(response);
});
        //this.off('focus'); //doesn't work

        
        
      } else {

    }})
  });
  $("#demo").on('click', function(event){
    event.preventDefault();
    var buttonText = $(this).text()
    if (buttonText === "demo"){
    $(this).text('back');
    } else {
      $(this).text('demo');
    }

    $('header frame ').toggleClass('hidden');
    $(".video").toggleClass('hidden');
    
  });
  $("button").on('click', function(event){
    console.log("clicked on a button item");
  });
  $(".clip").on('click', function(){
    event.preventDefault();
    var repEmail = $('.repEmail').text()
    $('hidden').remove()
    console.log("trying")
    $('button').remove();
    var request = $('p').text()
    
    var name = $('#firstName').val() + " " + $('#lastName').val();
    var profEmail = $('#email').val();
    var button = "<button class='greyout'> copy to clipboard</button> "
    var message = "<textarea>" + request + "\n\n" + name + "\n\n" + profEmail + "</textarea>";
    var mailTo = "<a href='mailto:" + repEmail + "'>" + repEmail + "</a>"
    
   // var emailLong = '<a href="mailto:' + repEmail + '"?cc=john@birdybook.com&bcc=johncgilmore@gmail.com, john@birdybook.com&subject=Desk%20Copy%20Request%For%20' + $('#firstName').val() + "%20" + $('#lastName').val() + '&body=' + message + '>Make Request</a>'

    
    var mail1 = "<p> This is in beta; for now you'll just have to copy this and paste it in an email!</p><p> Send it to "
    console.log(message)
    $('.pad').html(message + '<p> This is a beta. Do it the old fashioned way by simply copying and pasting this into an email to' + '\n' + '<h3>' + repEmail + '</h3>');
    

  })
  // for random emojis: TODO: select from a relavant list 
  $('.switch').on('mouseenter', function(){
    $.get('/research', function(emojis){
      console.log(emojis)
      $('.switch').find('#emojis').text(emojis);
    });
  });
  $('.resources').on('click', function(event){
    event.preventDefault();
    var need = $(this).val();
    $(this).fadeOut('fast')
    if($('.needs').text()) {
     $('.needs').append(" and ");
    }
     $('.needs').append(need);
     $('.hidden').removeClass('hidden');
     $('#name').focus();
  });

  /*
  $('.preference').on('click', 'button', function(event){
    event.preventDefault();
    var preference = $(this).value();
    $('.physical-digital').html(preference)
    
  })
  
  $('#go').on('click', function(event){
    event.preventDefault();    
    if(!$('#isbn').val()){ 
      var isbn = 9780393937510; 
      alert("you didn't enter an isbn, but we'll use an example isbn of " + isbn + " so you can see how it works!");
    }
    else if(!$('#zipcode').val()){
      var zipcode = 12467;
      alert("you didn't enter your zipcode, but we'll show results for schools near zipcode "+ zipcode +" so you can see how it works!")
    }
    else if(!$('#zipcode').val()&& !$('#isbn').val()) {
      var zipcode = 12467;
      var isbn = 9780393937510;
      alert("you didn't enter an isbn or zipcode, so we'll show demo data as an example!")
    }
    else {
      var zipcode = $('#zipcode').val()
      var isbn = $('#isbn').val() 
    }
    $('.wire').html('<span class="purple">Where</span> do you teach?');
    $.get('/books?isbn=' + isbn + '&zipcode=' + zipcode, function (req, res){
      console.log(res)
      });
  });*/
});