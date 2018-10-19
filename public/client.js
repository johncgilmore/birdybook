$(document).ready(function(){
  
  
  $("#exampleIsbn").on('click', function(event){
    event.preventDefault();
    
    $(".isbn-input").val("9780134414232")
    $(".isbn-input").focus();
    $(".zip-input").focus();
  });
  
  $(".isbn-input").on('blur', function(event){
    $("#submit").fadeOut("fast");
    var isbn = $('#isbn').val();
    if(isbn.length > 1){
    $.get('/isbn?' + $.param({query: isbn}), function(data) {
      var book = data.delivery;
      //$('h3').remove();
      console.log(book)
      if(!book.cover){
       console.log("no cover so we'll display the title")
      } else {
       console.log("showing cover of " + book.cover )
      };
        var cover = $("img");
        cover.addClass('book-cover');
       cover.attr("src", book.cover);
       //$('h1').prepend(cover)
      // $('form').append("<h3>" + book.volumeInfo.title + "</h3>");
    });
    }
  });
  
  $("#query").on('submit', function(event){
    event.preventDefault();
    
  })
  $( ".zip-input" ).keyup(function( event ) {
    
        var zipcode = $(this).val()
        if (zipcode.length > 2){
          $("#submit").fadeOut("fast");
          $(this).removeClass(".zip-input");
          
          $.get('/schools' + '?zipcode=' + zipcode, function(response){
            var schools = response.institutions.map(a)
            });
            var a = function(school){ 
            //  $('.school-button').remove();
              var button = "<button class='box black'><a class='institution' data-id='" +school.id + "' href='/ids/" + school.id + "/school/" + encodeURIComponent(school.name) + "'>" + school.name + "</a></button></a>"
              console.log(button)
              $('form').append(button);
            
           }
            
          }
        });
  
  $(".clip").on('click', function(){
    event.preventDefault();
    var repEmail = $('.repEmail').text()
    $('hidden').remove()
    $('button').remove();
    var request = $('.request').text()
    
    var name = $('#firstName').val() + " " + $('#lastName').val();
    var profEmail = $('#email').val();
    var button = "<button class='greyout'> copy to clipboard</button> "
    var message = request + "\n\n Thanks," + "\n " + name + " \n"
    var textArea = "<textarea>" + message + "</textarea>";
    var email = {
      to: repEmail,
      subject: 'Desk copy request for ' + name,
      body: message,
      from: profEmail
    }
    $('form').html(textArea + '<p> Modify the text above any way you like, then copy and paste it into an email to ' + email.to + '. ' + '\n' + 'Or click <a href="mailTo:' + email.to + '?From=' + email.from + '&Subject=' + email.subject + '&Body=' + email.body + '">send</a>')
    

  })
  
  function sendMail() {
    var link = "mailto:johncharlesgilmore@gmail.com"
             + "?cc=myCCaddress@example.com"
             + "&subject=" + escape("This is my subject")
             + "&body=" + escape(document.getElementById('myText').value)
    ;

    window.location.href = link;
}


  $('.resources').on('click', function(event){
    event.preventDefault();
    var need = $(this).text();
    $(this).addClass('greyed')
    $(this).text(need + " √")
    var name = $('#firstName').val() + " " + $('#lastName').val();
    var profEmail = $('#email').val();
    $('.request').append("<br><br>")
    //$('.request').append(name)
    $('#firstName').addClass('hidden')
    $('#lastName').addClass('hidden')
    if($('.needs').text()) {
     $('.needs').append(" and ");
    }
     $('.needs').append(need);
    // $('.hide').remove()
     $('.hidden').removeClass('hidden');
     $('#name').focus();
  });
  
  
});




