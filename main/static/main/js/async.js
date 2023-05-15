const userOnSubmit = () => {
    let submitButton = document.getElementById("send-chat-btn");

    const action = async (event) => {
        event.preventDefault();
        let responseDiv = document.getElementById("response");

        let promise = await fetchResponse(document.getElementById("user-prompt").value);
        if (promise) {
            // populate response section
            responseDiv.innerHTML += "<span class='ai-span'>AI助理: </span>";
            responseDiv.innerHTML += promise.response.replaceAll("\n", "<br>");
            responseDiv.innerHTML += "<br><br>";
        }
    }

    submitButton.addEventListener("click", action);
    submitButton.addEventListener("touchstart", action);
}

userOnSubmit()

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