var userInput = document.getElementById('userInput');
var responseMessage = document.getElementById('responseMessage');


var something = function(text) {
    responseMessage.innerHTML = atob(text);
}

var iFrame = false;

// Get the form element
const form = document.getElementById("myForm");

// Prevent form from submitting and reload the page
form.addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent page reload
    fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ user_input: responseMessage + userInput.value })
    })
        .then(response => response.json())
        .then(data => {
            var text = data.receivedText.replaceAll('```html', "").replaceAll('```', "")
            if(!iFrame) {
                document.getElementById("responseMessage").innerHTML = text;
            } else {
                text = btoa(text);
                document.getElementById("responseMessage").innerHTML += `<iframe src='data:text/html;base64,${text}'></iframe>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


document.getElementById('settingsDiv').style = 'display: none';
document.getElementById('toggleSettings').addEventListener('click', function () {
    const settingsDiv = document.getElementById('settingsDiv');
    if (settingsDiv.style.display === 'none') {
        settingsDiv.style.display = 'block';
        this.textContent = 'Hide Settings';
    } else {
        settingsDiv.style.display = 'none';
        this.textContent = 'Show Settings';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetch('/fetch-file')
        .then(response => response.json())
        .then(data => {
            document.querySelector(".dropcontent").innerHTML = data.recievedText;
            console.log(data);

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
        })
        .catch(error => console.error('Error fetching file:', error));
});
