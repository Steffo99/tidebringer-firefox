async function addItemToCollection(itemElement) {
    const collectionId = document.querySelector(`#AddChildItemForm [name="id"]`).value;
    const sessionId = document.querySelector(`#AddChildItemForm [name="sessionid"]`).value;
    const itemId = /choice_\w+_([0-9]+)/.exec(itemElement.id)[1];

    const formdata = new FormData();
    formdata.append("id", collectionId);
    formdata.append("sessionid", sessionId);
    formdata.append("childid", itemId);

    //This endpoint has no rate limits?!
    let response = await fetch("https://steamcommunity.com/sharedfiles/addchild", {
        "method": "POST",
        "body": formdata
    })
    if (response.status === 200) {
        itemElement.className = itemElement.className + " inCollection";
    }
}

async function addAllSubscribedToCollection() {
    const buttonElement = document.querySelector("#tidebringer-btn-add-all-subscribed");
    buttonElement.removeEventListener("click", addAllSubscribedToCollection)
    buttonElement.className += " tidebringer-running";
    buttonElement.setAttribute("disabled", "true")

    const itemElements = document.querySelectorAll(".itemChoice");
    for (let i = 0; i < itemElements.length; i++) {
        let element = itemElements[i];
        const match_sub = /MySubscribedItems/.exec(element.id);
        if (match_sub === null) {
            continue;
        }
        const match_class = /inCollection/.exec(element.className);
        if (match_class !== null) {
            continue;
        }
        await addItemToCollection(element);
        await new Promise(r => setTimeout(r, 100));
    }
}

function tidebringer() {
    const whereTheContainerShouldBePlaced = document.querySelector(".collectionAddItemsSection");
    if(!whereTheContainerShouldBePlaced) return
    
    console.log("%c Tidebringer %chttps://github.com/Steffo99/tidebringer-firefox", "background-color: black; color: #a0f3f6;");

    const container = document.createElement("div")
    container.id = "tidebringer-container"
    whereTheContainerShouldBePlaced.appendChild(container)
    
    const addAllSubscribedButton = document.createElement("button");
    addAllSubscribedButton.className = "btn_darkblue_white_innerfade btn_medium"
    addAllSubscribedButton.addEventListener("click", addAllSubscribedToCollection);
    addAllSubscribedButton.id = "tidebringer-btn-add-all-subscribed";
    const addAllSubscribedSpan = document.createElement("span");
    const addAllSubscribedText = document.createTextNode("Add all subscribed elements");
    addAllSubscribedSpan.appendChild(addAllSubscribedText);
    addAllSubscribedButton.appendChild(addAllSubscribedSpan);

    container.appendChild(addAllSubscribedButton);
}

tidebringer();