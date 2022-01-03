/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Sample data from initial-tweets.json
const data = [
  {
    user: {
      name: "Newton",
      avatars: "https://i.imgur.com/73hZDYK.png",
      handle: "@SirIsaac",
    },
    content: {
      text: "If I have seen further it is by standing on the shoulders of giants",
    },
    created_at: 1461116232227,
  },
  {
    user: {
      name: "Descartes",
      avatars: "https://i.imgur.com/nlhLi3I.png",
      handle: "@rd",
    },
    content: {
      text: "Je pense , donc je suis",
    },
    created_at: 1461113959088,
  },
];

// returns a tweet article element containing the full HTML of the tweet
$(() => {
  const loadTweets = () => {
    $.ajax({
      url: "/tweets",
      method: "GET",
      datatype: "json",
      success: (tweets) => {
        renderTweets(tweets);
      },
      error: (error) => {
        console.log(`There is an error: ${error}`);
      },
    });
  };
  //shows sample tweets
  loadTweets();

  const renderTweets = (tweets) => {
    // loops through tweets
    for (const tweet of tweets) {
      // calls createTweetElement for each tweet
      const $tweetElement = createTweetElement(tweet);
      // takes return value and appends it to the tweets container. "prepend" makes the latest posts come first
      $("#tweets-container").prepend($tweetElement);
    }
  };

  //prevents harmful text inputs from altering the page
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //Creating the tweet element
  const createTweetElement = (tweet) => {
    const $tweet = `<article class="article-tweets">
    <header class="article-tweet-header">
      <div class="user-profile">
        <img class="user-icon" src=${tweet.user.avatars}/>
      <h5>${tweet.user.name}</h5>
    </div>
    <div class="username">
      <h5>${tweet.user.handle}</h5>
    </div>
  </header>
      <p class="tweet-text">${escape(tweet.content.text)}</p>
    <footer>
      <p class="date">${timeago.format(new Date(tweet.created_at))}</p>
      <section class="icons">
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
      </section>
    </footer> 
  </article>`;
    return $tweet;
  };

  $("#tweet-form").submit(function(event) {
    //stops form from refreshing
    event.preventDefault();
    //grabs the tweet text submitted on the page
    const serializedData = $(this).serialize();
    const tweetLength = $("#tweet-text").val();
    //!tweetLength.trim() captures invalid inputs of blank spaces
    if (tweetLength.trim().length === 0 || !tweetLength.trim()) {
      return $(".error-msg")
        .text("⚠️  Please write something!  ⚠️")
        .slideDown(() => {
          setTimeout(() => {
            $(".error-msg").slideUp();
          }, 3000);
        });
    }
    // limits maximum of 140 characters per tweet
    if (tweetLength.length > 140) {
      return $(".error-msg")
        .text("⚠️ Maximum limit of 140 characters only per tweet! ⚠️")
        .slideDown(() => {
          setTimeout(() => {
            $(".error-msg").slideUp();
          }, 3000);
        });
    }
    $.post("/tweets", serializedData, (response) => {
      //empties input textbox after submission
      $("#tweet-text").val("");
      //rewrites 140 after submission
      $(".counter").text("140");
      //prevents tweet from posting again
      $("#tweets-container").empty();
      //updates new tweet on blog
      loadTweets();
    });
  });
});
