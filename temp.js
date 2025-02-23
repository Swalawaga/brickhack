      var userInput = document.getElementById('userInput');
      var responseMessage = document.getElementById('responseMessage');

      var something = function(text) {
          
      }
      
      document.getElementById('form2').addEventListener("submit", function(event) {
          event.preventDefault();

              fetch('/save-message', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', },
                  body: JSON.stringify({ title: userInput.value, html: responseMessage.innerHTML })
              })
                  .then(response => response.json())
                  .then(data => {
                      console.log(data.receivedText);
                  }).catch(error => {
                      console.log('Error: ', error);
                  });
      });
      
      // Get the form element
      const form = document.getElementById("myForm");

      // Prevent form from submitting and reload the page
      form.addEventListener("submit", function(event) {
          event.preventDefault();  // Prevent page reload
          
          //userInput = responseMessage.innerHTML + userInput;
          // Send the data via a POST request using fetch
          fetch('/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', },
              body: JSON.stringify({ user_input: responseMessage + userInput.value })
          })
              .then(response => response.json())
              .then(data => {
                  document.getElementById("responseMessage").innerHTML = data.receivedText.replaceAll('```html', "").replaceAll('```', "");
              })
              .catch(error => {
                  console.error('Error:', error);
              });
      });
