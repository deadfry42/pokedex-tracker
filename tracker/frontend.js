// frontend.js works with all of the things that are visible to the user
// this includes creating the boxes, sending things to the api and displaying things from the api.

document.getElementById("gametitle").innerText = gametitle

var data = getData("pbrs");
var settings = getSettings(data)
saveSettings(data, settings)
saveData("pbrs", data)

var primaryMouseButtonDown = false;
var lastAction = 0;

function setPrimaryButtonState(e) {
    var flags = e.buttons !== undefined ? e.buttons : e.which;
    primaryMouseButtonDown = (flags & 1) === 1;
}

document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", (e) => {
    lastAction = 0;
    setPrimaryButtonState(e)
})

const createPokemonElement = (pokemonId) => {
    var pokemon = document.createElement("img")
    pokemon.src = getPokemonImageURL(pokemonId, settings.sprite)

    pokemon.style.width = "48px"
    pokemon.style.height = "48px"
    pokemon.style.margin = "0px"
    pokemon.style.padding = "0px"
    pokemon.style.marginRight = "0px"
    pokemon.style.marginLeft = "0px"

    pokemon.style.userSelect = "none"
    pokemon.ondragstart = function() { return false; };

    if (pokemonId <= maxPokemon) pokemon.classList = ["pokemon-unclaimed"]

    pokemon.onmousedown = (e) => {
        if (e.button != 0) return;
        if (pokemonId > maxPokemon) return;
        if (pokemon.classList.contains("pokemon-unclaimed")) {pokemon.classList = ["pokemon-claimed"]; lastAction = 1}
        else {pokemon.classList = ["pokemon-unclaimed"]; lastAction = -1;}
    }

    pokemon.onmouseenter = () => {
        if (pokemonId > maxPokemon) return;
        if (primaryMouseButtonDown) {
            switch (lastAction) {
                case 0:
                    if (pokemon.classList.contains("pokemon-unclaimed")) {lastAction = 1; pokemon.classList = ["pokemon-claimed"]}
                    else {lastAction = -1; pokemon.classList = ["pokemon-unclaimed"]}
                break;

                case 1:
                    if (pokemon.classList.contains("pokemon-unclaimed")) pokemon.classList = ["pokemon-claimed"]
                break;

                case -1:
                    if (pokemon.classList.contains("pokemon-claimed")) pokemon.classList = ["pokemon-unclaimed"]
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

    //background-image: url('../assets/boxes/body/standard/box1.png'); background-position: center; background-repeat: no-repeat; background-size:110ch

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
                console.log(element)
                var Option = document.createElement("option")
                Option.value = element.val
                Option.innerText = element.label
                dropdownElement.append(Option)
            });

            dropdownElement.value = settings[settingInfo.settingName]

            dropdownElement.onchange = () => {
                settingsWarning.style.display = "block"
                settings[settingInfo.settingName] = dropdownElement.value
                saveSettings(data, settings)
                saveData("pbrs", data)
            }

            newSettingElement.append(label)
            newSettingElement.append(dropdownElement)
            newSettingElement.append(document.createElement("br"))
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

settingsPage.append(createSettingElement(
    "Sprite", {
        type: "dropdown",
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
settingsPage.append(createSettingElement(
    "Box titles", {
        type: "dropdown",
        settingName: "numbered",
        options: [
            {val: false, label: "Default box number"},
            {val: true, label: "Pokemon id range"},
        ]
    }
))

var helpTitle = document.createElement("h1")
helpTitle.innerText = "help"
var helpText = document.createElement("p")
helpText.innerText = `This pokedex tracker is quite simple. Click on a pokemon to mark it as "obtained". Click on it again to revoke its "obtained" status. Click and drag over all of the pokemon you want to mark/unmark as "obtained".`
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