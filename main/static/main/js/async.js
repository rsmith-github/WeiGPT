

const userOnSubmit = () => {
    let submitButton = document.getElementById("send-chat-btn");
    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();
        let responseDiv = document.getElementById("response");
        let promise = await fetchResponse(document.getElementById("user-prompt").value);
        if (promise) {
            // populate response section
            responseDiv.innerHTML += "<span class='ai-span'>AI助理: </span>";
            responseDiv.innerHTML += promise.response.replaceAll("\n", "<br>");
            responseDiv.innerHTML += "<br><br>";
        }
    })
}

userOnSubmit()

async function fetchResponse(user_prompt) {
    const csrftoken = document.querySelector("[name='csrfmiddlewaretoken']").value;
    const response = await fetch("http://localHost:8000/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
            "user_prompt": user_prompt,
        })
    });
    const jsonData = await response.json();
    return jsonData
}