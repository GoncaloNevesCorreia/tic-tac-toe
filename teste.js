const textArea = document.querySelector("#messageInput");
const btnSend = document.querySelector("#idBtnSendMessage");

function sendSpam(text, limit) {
    for (let i = 0; i < limit; i++) {
        textArea.value = text;
        btnSend.click();
    }
}