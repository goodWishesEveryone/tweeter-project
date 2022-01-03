// composer-char-counter.js. is the file solely responsible for the character counter.

// function to ensure the DOM has loaded
$(document).ready(function() {
  $("#tweet-text").on("input", function() {
    const count = $(this).val().length;
    let counter = 140 - count;
    $(".tweet-button-counter").children(".counter").text(counter);
    if (counter < 0) {
      $(".tweet-button-counter").children(".counter").addClass("red");
    } else {
      $(".tweet-button-counter").children(".counter").removeClass("red");
    }
  });
});
