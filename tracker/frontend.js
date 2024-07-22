// frontend.js works with all of the things that are visible to the user
// this includes creating the boxes, sending things to the api and displaying things from the api.

document.getElementById("gametitle").innerText = gametitle

var data = getData(gamedatastore);
var settings = getSettings(data)
saveSettings(data, settings)
saveData(gamedatastore, data)

var primaryMouseButtonDown = false;
var lastAction = 0;
var inframe = false;

var iframeDiv;

const setPrimaryButtonState = (e) => {
    var flags = e.buttons !== undefined ? e.buttons : e.which;
    primaryMouseButtonDown = (flags & 1) === 1;
}

document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", (e) => {
    lastAction = 0;
    setPrimaryButtonState(e)
    saveData(gamedatastore, data)
})

const iescape = () => {
    if (inframe == true) {
        inframe = false;
        iframeDiv.id = "noviewport"
        setTimeout(() => {
            iframeDiv.remove()
            primaryMouseButtonDown = false;
            console.log("--- End of Iframe ---")
        }, 1000);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key == "Control") document.body.style.cursor = "help";
    if (e.key == "Escape") {
        iescape()
    }
})

document.addEventListener("keyup", (e) => {
    if (e.key == "Control") document.body.style.cursor = "auto";
})

const createPokemonElement = (pokemonId) => {
    var pokemon = document.createElement("img")
    pokemon.src = getPokemonImageURL(pokemonId, settings.sprite, settings.shiny)

    pokemon.style.width = "48px"
    pokemon.style.height = "48px"
    pokemon.style.margin = "0px"
    pokemon.style.padding = "0px"
    pokemon.style.marginRight = "0px"
    pokemon.style.marginLeft = "0px"

    pokemon.style.userSelect = "none"
    pokemon.ondragstart = function() { return false; };

    if (pokemonId <= maxPokemon && pokemonId > 0) {
        if (getPokemonStatus(data, pokemonId) == 1) pokemon.classList = ["pokemon-claimed"]
        else pokemon.classList = ["pokemon-unclaimed"]
    }

    pokemon.onmousedown = (e) => {
        if (inframe) return;
        if (e.button != 0) return;
        if (e.ctrlKey == true) {
            inframe = true;
            return fetchPokemonInformationURL(pokemonId, settings.source) .then((url) => {
                if (settings.iframe == "true") {
                    console.log("--- Start of Iframe ---")
                    iframeDiv = document.createElement("div")
                    iframeDiv.style.position = "fixed"
                    iframeDiv.style.width = "97.5%"
                    iframeDiv.style.height = "95%"
                    iframeDiv.style.x = "5%"
                    iframeDiv.style.y = "5%"
                    iframeDiv.style.zIndex = 9999
                    iframeDiv.style.backgroundColor = "rgba(0, 0, 0, 0.3)"
                    iframeDiv.style.justifyContent = "right"
                    iframeDiv.style.display = "flex"
                    iframeDiv.style.borderRadius = "1vw"
                    iframeDiv.id = "viewport"
                    var iframeX = document.createElement("img")
                    iframeX.src = "../assets/x.png"
                    iframeX.style.borderRadius = "0px 1vw 0px 50% "
                    iframeX.style.backgroundColor = "rgba(150, 0, 0, 1)"
                    iframeX.style.width = "0.75%"
                    iframeX.style.padding = "0.5%"
                    // iframeX.style.height = "1%"
                    iframeX.style.position = "absolute"
                    iframeX.style.cursor = "pointer"
                    iframeX.onclick = () => iescape()
                    iframeDiv.append(iframeX)
                    var iframe = document.createElement("iframe")
                    iframe.src = url
                    iframe.style.width = "100%"
                    iframe.style.height = "100%"
                    iframe.style.border = "none"
                    iframe.style.borderRadius = "1vw"
                    iframeDiv.append(iframe)
                    document.getElementById("yes").append(iframeDiv)
                } else {
                    window.open(url, url).focus();
                    inframe = false;
                }
            })
        }
        if (pokemonId > maxPokemon || pokemonId < 0) return;
        if (pokemon.classList.contains("pokemon-unclaimed")) {
            pokemon.classList = ["pokemon-claimed"];
            lastAction = 1;
            setPokemonStatus(data, pokemonId, true)
            saveData(gamedatastore, data)
        } else {
            pokemon.classList = ["pokemon-unclaimed"];
            lastAction = -1;
            setPokemonStatus(data, pokemonId, false)
            saveData(gamedatastore, data)
        }
    }

    pokemon.onmouseenter = () => {
        if (inframe) return;
        if (pokemonId > maxPokemon || pokemonId < 0) return;
        if (primaryMouseButtonDown) {
            switch (lastAction) {
                case 0:
                    if (pokemon.classList.contains("pokemon-unclaimed")) {lastAction = 1; pokemon.classList = ["pokemon-claimed"]; setPokemonStatus(data, pokemonId, true)}
                    else {lastAction = -1; pokemon.classList = ["pokemon-unclaimed"]; setPokemonStatus(data, pokemonId, false)}
                break;

                case 1:
                    if (pokemon.classList.contains("pokemon-unclaimed")) {pokemon.classList = ["pokemon-claimed"]; setPokemonStatus(data, pokemonId, true)}
                break;

                case -1:
                    if (pokemon.classList.contains("pokemon-claimed")) {pokemon.classList = ["pokemon-unclaimed"]; setPokemonStatus(data, pokemonId, false)}
                break;
            }
        }
    }

    return pokemon
}

const createBoxRow = () => {
    var row = document.createElement("div")
    row.classList = ["center", "boxrow"]

    row.style.padding = "0px"
    row.style.margin = "0px"
    row.style.height = "48px"

    return row
}

const createBox = (name, id, pokemon) => {
    var boxContainer = document.createElement("div")
    var box = document.createElement("div")

    for (inc = 0; inc < rowCount; inc++) {
        var row = createBoxRow()
        for (inc2 = 0; inc2 < rowSize; inc2++) {
            listIndex = (inc2)+(inc*rowSize)
            if (listIndex > pokemon.length-1) return
            row.append(createPokemonElement(
                pokemon[listIndex].id
            ))
        }
        box.append(row)
    }
    box.classList = ["box", "center"]

    box.style.backgroundImage = `url('../assets/boxes/body/standard/${name}.png')`
    box.style.backgroundPosition = "center"
    box.style.backgroundRepeat = "no-repeat"
    box.style.backgroundSize = "contain"

    box.style.margin = "auto"
    box.style.width = `${rowSize*48+rowSize}px`
    box.style.height = `${rowCount*48}px`

    box.style.alignItems = "center"
    box.style.display = "grid"

    box.id = name

    var boxHeader = document.createElement("img")
    if (settings.numbered == "true") boxHeader.src = `../assets/boxes/head/numbered/${name}.png`
    else boxHeader.src = `../assets/boxes/head/standard/${name}.png`
    boxHeader.style.width = "200px"
    boxHeader.style.margin = "3px"

    boxContainer.append(boxHeader)
    boxContainer.append(box)

    boxContainer.style.display = "flexbox"

    boxContainer.style.marginBottom = "5px"
    boxContainer.classList = ["center"]

    return boxContainer
}

const createSettingElement = (name, settingInfo = null) => {
    // name - the name placed next to the setting element
    // settingInfo - (example below)
    // {
    //     type: "dropdown",
    //     supportedGameStores: ["*"], // is included in all versions of this tracker
    //     settingName: "sprite"
    //     options: {
    //          {val: 0, label: "Ruby/Sapphire sprites"},
    //          {val: 1, label: "Firered/Leafgreen sprites"},
    //          {val: 2, label: "Emerald sprites"},
    //          {val: 3, label: "Diamond/Pearl sprites"},
    //          {val: 4, label: "Platinum sprites"},
    //          {val: 5, label: "Heartgold/Soulsilver sprites"},
    //     }
    // }

    if (!settingInfo) return;

    // check if setting is supported
    if (!settingInfo.supportedGameStores.includes("*") && !settingInfo.supportedGameStores.includes(gamedatastore)) return null

    var newSettingElement;
    switch (settingInfo.type) {
        case "dropdown":
            newSettingElement = document.createElement("div")
            newSettingElement.style.display = "inline"
            newSettingElement.style.marginBottom = "3px"

            var dropdownElement = document.createElement("select")
            dropdownElement.name = name

            var label = document.createElement("label")
            label.for = name
            label.innerText = `${name} -> `
            label.style.marginRight = "10px"

            settingInfo.options.forEach(element => {
                var Option = document.createElement("option")
                Option.value = element.val
                Option.innerText = element.label
                dropdownElement.append(Option)
            });

            if (settings[settingInfo.settingName] != null) dropdownElement.value = settings[settingInfo.settingName]

            dropdownElement.onchange = () => {
                settingsWarning.style.display = "block"
                console.log(dropdownElement.value)
                settings[settingInfo.settingName] = dropdownElement.value
                saveSettings(data, settings)
                saveData(gamedatastore, data)
            }

            newSettingElement.append(label)
            newSettingElement.append(dropdownElement)
            newSettingElement.append(document.createElement("br"))
        break;

        case "checkmark":
            newSettingElement = document.createElement("div")
            newSettingElement.style.display = "inline"
            newSettingElement.style.marginBottom = "3px"

            var checkmarkElement = document.createElement("input")
            checkmarkElement.name = name
            checkmarkElement.type = "checkbox"

            var label = document.createElement("label")
            label.for = name
            label.innerText = `${name} -> `
            label.style.marginRight = "10px"

            checkmarkElement.checked = settings[settingInfo.settingName].toString().toLowerCase() === "true" ? true : false

            checkmarkElement.onchange = () => {
                settingsWarning.style.display = "block"
                settings[settingInfo.settingName] = checkmarkElement.checked == true ? "true" : "false"
                saveSettings(data, settings)
                saveData(gamedatastore, data)
            }

            newSettingElement.append(label)
            newSettingElement.append(checkmarkElement)
            newSettingElement.append(document.createElement("br"))
        break;

        default:
            console.log(`Setting element ${name} has an invalid type!!`)
        break;
    }

    return newSettingElement
}

const trackerPage = document.createElement("div")
trackerPage.style.display = "block"
const settingsPage = document.createElement("div")
settingsPage.style.display = "none"
const helpPage = document.createElement("div")
helpPage.style.display = "none"

const createTabs = () => {
    var tabsContainer = document.createElement("p")
    tabsContainer.style.userSelect = "none"

    var trackerTab = document.createElement("a")
    var settingsTab = document.createElement("a")
    var helpTab = document.createElement("a")
    
    trackerTab.innerText = "tracker"
    trackerTab.style.textDecoration = "underline"
    trackerTab.style.cursor = "pointer"
    trackerTab.style.marginLeft = "10px"
    trackerTab.style.marginRight = "10px"
    trackerTab.onclick = () => {
        trackerPage.style.display = "block"
        settingsPage.style.display = "none"
        helpPage.style.display = "none"
        trackerTab.style.textDecoration = "underline"
        settingsTab.style.textDecoration = "none"
        helpTab.style.textDecoration = "none"
    }

    
    settingsTab.innerText = "settings"
    settingsTab.style.textDecoration = "none"
    settingsTab.style.cursor = "pointer"
    settingsTab.style.marginLeft = "10px"
    settingsTab.style.marginRight = "10px"
    settingsTab.onclick = () => {
        trackerPage.style.display = "none"
        settingsPage.style.display = "block"
        helpPage.style.display = "none"
        trackerTab.style.textDecoration = "none"
        settingsTab.style.textDecoration = "underline"
        helpTab.style.textDecoration = "none"
    }

    helpTab.innerText = "help"
    helpTab.style.textDecoration = "none"
    helpTab.style.cursor = "pointer"
    helpTab.style.marginLeft = "10px"
    helpTab.style.marginRight = "10px"
    helpTab.onclick = () => {
        trackerPage.style.display = "none"
        settingsPage.style.display = "none"
        helpPage.style.display = "block"
        trackerTab.style.textDecoration = "none"
        settingsTab.style.textDecoration = "none"
        helpTab.style.textDecoration = "underline"
    }

    tabsContainer.append(trackerTab)
    tabsContainer.append(settingsTab)
    tabsContainer.append(helpTab)

    return tabsContainer
}

trackerPage.style.userSelect = "none"

const boxData = createBoxData(false)
for (i = 0; i < boxData.length; i++) {
    var box = boxData[i]
    trackerPage.append(createBox(`box${box.id}`, box.id, box.pokemon))
}

var settingsTitle = document.createElement("h1")
settingsTitle.innerText = "settings"
var settingsWarning = document.createElement("p")
settingsWarning.innerHTML = `you have made a change, you must <a href="${window.location.href}" style="color: white;">refresh</a> see them.`
settingsWarning.style.display = "none"

settingsPage.append(settingsTitle)
settingsPage.append(settingsWarning)

const appendSettingElement = (settingElement) => {
    if (!settingElement) return;
    settingsPage.append(settingElement)
}

appendSettingElement(createSettingElement(
    "Sprite", {
        type: "dropdown",
        supportedGameStores: ["*"],
        settingName: "sprite",
        options: [
            {val: 0, label: "Ruby/Sapphire sprites"},
            {val: 1, label: "Firered/Leafgreen sprites"},
            {val: 2, label: "Emerald sprites"},
            {val: 3, label: "Diamond/Pearl sprites"},
            {val: 4, label: "Platinum sprites"},
            {val: 5, label: "Heartgold/Soulsilver sprites"},
        ]
    }
))
appendSettingElement(createSettingElement(
    "Box titles", {
        type: "dropdown",
        supportedGameStores: ["pbrs"],
        settingName: "numbered",
        options: [
            {val: false, label: "Default box number"},
            {val: true, label: "Pokemon id range"},
        ]
    }
))
appendSettingElement(createSettingElement(
    "Shiny sprites", {
        type: "checkmark",
        supportedGameStores: ["*"],
        settingName: "shiny",
    }
))
appendSettingElement(createSettingElement(
    "Pokemon Information Source", {
        type: "dropdown",
        supportedGameStores: ["*"],
        settingName: "source",
        options: [
            {val: 0, label: "Bulbapedia"},
            {val: 1, label: "Serebii"},
            // RIP PokemonDB (they can't be put into an iframe)
        ]
    }
))
appendSettingElement(createSettingElement(
    "Information display type", {
        type: "dropdown",
        supportedGameStores: ["*"],
        settingName: "iframe",
        options: [
            {val: false, label: "Create another tab"},
            {val: true, label: "Inside this website"},
        ]
    }
))

var exportImportDiv = document.createElement("div")
var eititle = document.createElement("h1")
var exportBtn = document.createElement("button")
var eiinput = document.createElement("input")
var importBtn = document.createElement("button")
var eiexplain = document.createElement("p")
var eistatus = document.createElement("p")
var randombr = document.createElement("br")

exportImportDiv.style.marginTop = "50px"

exportBtn.innerText = "export data"
importBtn.innerText = "import data"
eititle.innerText = "export/import data"
eiexplain.innerText = `press "export" to show your pokedex's data in the textbox to save for later\npress "import" to save the data in the textbox for use.\ndo not blindly import incorrect data as it will remove your existing data!!!`

exportBtn.onclick = () => {
    eiinput.value = localStorage.getItem(gamedatastore)
    eistatus.innerText = "exported!"
}

importBtn.onclick = () => {
    if (eiinput.value.length <= 1) return eistatus.innerText = "import failed: data cannot be 0!"
    try { // safeguard just in case someone inputs fake data for the lolz
        JSON.parse(eiinput.value)
        try {
            localStorage.setItem(gamedatastore, eiinput.value)
            eistatus.innerHTML = `imported! <a href="${window.location.href}" style="color: white;">refresh</a> to see changes!`
            data = getData(gamedatastore) // update the data in use to ensure the imported data isn't overwritten
            settings = getSettings(data)
        } catch(e) {
            console.log(e)
            eistatus.innerText = "import failed: check console for more information!"
        }
    } catch(e) {
        console.log(e)
        eistatus.innerText = "import failed: data is not JSON!"
    }
}

eiinput.onfocus = () => {
    eiinput.selectionStart = 0
    eiinput.selectionEnd = eiinput.value.length
}

exportImportDiv.append(eititle)
exportImportDiv.append(eiinput)
exportImportDiv.append(randombr)
exportImportDiv.append(exportBtn)
exportImportDiv.append(importBtn)
exportImportDiv.append(eistatus)
exportImportDiv.append(eiexplain)

settingsPage.append(exportImportDiv)

var helpTitle = document.createElement("h1")
helpTitle.innerText = "help"
var helpText = document.createElement("p")
helpText.innerText = `Note: This pokedex tracker is designed for a mouse and keyboard. Most features will likely not be available on mobile devices.\n\nThis pokedex tracker is quite simple. Click on a pokemon to mark it as "obtained". Click on it again to revoke its "obtained" status. Click and drag over all of the pokemon you want to mark/unmark as "obtained". To quickly see the information of a Pokemon, hold down the Control key and click on the Pokemon you want to see the information of.\n\nData is saved live, so any changes you make will retain throughout each refresh. It is recommended to often backup your data, as to not lose it. Your data is saved with localstorage, which depending on your browser (such as safari) may be cleared after one week of inactivity.`
helpPage.append(helpTitle)
helpPage.append(helpText)

trackerPage.id = "tracker"
settingsPage.id = "settings"
helpPage.id = "help"

const workspace = document.getElementById("workspace")
workspace.append(createTabs())
workspace.append(trackerPage)
workspace.append(settingsPage)
workspace.append(helpPage)