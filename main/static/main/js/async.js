// Handle user submit chat form.
const userOnSubmit = () => {
    let submitButton = document.getElementById("send-chat-btn");

    const action = async (event) => {
        event.preventDefault();
        let responseDiv = document.getElementById("response");

        let input = document.getElementById("user-prompt");
        if (input.value.trim() === '') {
            return
        }
        let value = input.value;
        input.value = "";
        let promise = await fetchResponse(value);
        // populate response section
        responseDiv.innerHTML += "<span class='ai-span'>AI助理: </span>";
        responseDiv.innerHTML += promise.response.replaceAll("\n", "<br>");
        responseDiv.innerHTML += "<br><br>";
        responseDiv.scrollTop = responseDiv.scrollHeight;
    }

    submitButton.addEventListener("click", action);
    submitButton.addEventListener("touchstart", action);
}
userOnSubmit()

// get response from openai based on user prompt.
function fetchResponse(user_prompt) {
    const csrftoken = document.querySelector("[name='csrfmiddlewaretoken']").value;

    // Get loading element and show it
    let loadingDiv = document.createElement("div");
    loadingDiv.innerHTML = "<img src='static/main/loading.gif' style='width: 50px;'/>"

    document.getElementById("response").append(loadingDiv)

    return fetch("/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
            "user_prompt": user_prompt,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .catch(error => {
            console.log("An error occurred: " + error.message);
            // You can handle error state here
        })
        .finally(() => {
            // Hide loading element when promise is either resolved or rejected
            loadingDiv.style.display = "none";
        });
}

// Get the input field and button
const userInput = document.getElementById('user-prompt');
const sendButton = document.getElementById('send-chat-btn');

// Function to enable/disable button based on input value
const checkInput = () => {
    if (userInput.value.trim() === '') {
        sendButton.disabled = true;
    } else {
        sendButton.disabled = false;
    }
};

// Initialize the button state
checkInput();

// Attach the event listener to the input field
userInput.addEventListener('input', checkInput);