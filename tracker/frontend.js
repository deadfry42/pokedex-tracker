//  __                 _                 _    _
// / _|_ __ ___  _ __ | |_ ___ _ __   __| |  (_)___
// | |_| '__/ _ \| '_ \| __/ _ \ '_ \ / _` |  | / __|
// |  _| | | (_) | | | | ||  __/ | | | (_| |_ | \__ \
// |_| |_|  \___/|_| |_|\__\___|_| |_|\__,_(_)/ |___/
//                                         |__/

// this file works with everything visible to the user including:
// creating the boxes, sending things to the api and displaying things from the api.

// reading the code from your browser? the code is freely available here!
// https://github.com/deadfry42/pokedex-tracker

var data = getData(gamedatastore);
var settings = getSettings(data)
saveSettings(data, settings)
saveData(gamedatastore, data)
data = getData(gamedatastore);
settings = getSettings(data)


dexScale = settings.scale != null ? settings.scale : 1
if (dexScale == 0.4) {
    dexScale = (window.innerWidth/(rowSize*(48+rowSize))/(gamedatastore == "pbrs" ? 2 : 4))
    console.log("Automatic scale: "+dexScale)
}

var primaryMouseButtonDown = false;
var secondaryMouseButtonDown = false;
var lastAction = 0;
var inframe = false;

var iframeDiv;

const iframeDivContainer = document.getElementById("yes")

const setPrimaryButtonState = (e) => {
    var flags = e.buttons !== undefined ? e.buttons : e.which;
    primaryMouseButtonDown = (flags & 1) === 1;
    secondaryMouseButtonDown = (flags & 2) === 2;

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
            iframeDivContainer.innerHTML = ""
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

const createPokemonElement = (pokemonId, form) => {
    var pokemon = document.createElement("div")
    pokemon.style.display = "inline-block"

    var image = document.createElement("div")
    image.style.backgroundImage = `url('${getPokemonImageURL(pokemonId, settings.sprite, settings.shiny, form)}')`
    image.style.backgroundSize = "contain"
    image.style.backgroundRepeat = "no-repeat"
    image.style.width = "100%"
    image.style.height = "100%"
    image.style.float = "right"

    pokemon.append(image)

    pokemon.style.width = `${48*dexScale}px`
    pokemon.style.height = `${48*dexScale}px`
    pokemon.style.margin = "0px"
    pokemon.style.padding = "0px"
    pokemon.style.marginRight = "0px"
    pokemon.style.marginLeft = "0px"

    pokemon.style.userSelect = "none"
    pokemon.ondragstart = function() { return false; };

    if (pokemonId <= maxPokemon && pokemonId > 0) {
        if (getPokemonStatus(data, pokemonId, form, 0) == 1) image.classList = ["pokemon-claimed"]
        else image.classList = ["pokemon-unclaimed"]

        var indicator = document.createElement("div")
        indicator.style.width = `${10*dexScale}px`
        indicator.style.height = `${10*dexScale}px`
        indicator.style.borderRadius = "100%"
        indicator.style.backgroundColor = "rgba(255, 0, 0, 1)"
        indicator.style.position = "initial"
        indicator.style.display = "none"
        indicator.classList = ["indicator"]
        indicator.userSelect = "none"

        pokemon.append(indicator)

        if (getPokemonStatus(data, pokemonId, form, 1) == 1) indicator.style.display = "block"
        else indicator.style.display = "none"
    }

    pokemon.oncontextmenu = (e) => {
        e.preventDefault();
    }

    pokemon.onmousedown = (e) => {
        if (pokemonId > maxPokemon || pokemonId < 0) return;
        if (inframe) return;
        if (e.button == 2 ) {
            if (indicator.style.display == "none") {
                indicator.style.display = "block"; setPokemonStatus(data, pokemonId, form, true, 1)
                lastAction = 2;
            }
            else {
                indicator.style.display = "none"; setPokemonStatus(data, pokemonId, form, false, 1)
                lastAction = -2
            }
        }
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
                    iframeDivContainer.append(iframeDiv)
                } else {
                    window.open(url, url).focus();
                    inframe = false;
                }
            })
        }
        if (image.classList.contains("pokemon-unclaimed")) {
            image.classList = ["pokemon-claimed"];
            lastAction = 1;
            setPokemonStatus(data, pokemonId, form, true)
            saveData(gamedatastore, data)
        } else {
            image.classList = ["pokemon-unclaimed"];
            lastAction = -1;
            setPokemonStatus(data, pokemonId, form, false)
            saveData(gamedatastore, data)
        }
    }

    pokemon.onmouseenter = () => {
        if (inframe) return;
        if (pokemonId > maxPokemon || pokemonId < 0) return;
        if (primaryMouseButtonDown || secondaryMouseButtonDown) {
            switch (lastAction) {
                case 0:
                    if (image.classList.contains("pokemon-unclaimed")) {lastAction = 1; image.classList = ["pokemon-claimed"]; setPokemonStatus(data, pokemonId, form, true, 0)}
                    else {lastAction = -1; image.classList = ["pokemon-unclaimed"]; setPokemonStatus(data, pokemonId, form, false, 0)}
                break;

                case 1:
                    if (image.classList.contains("pokemon-unclaimed")) {image.classList = ["pokemon-claimed"]; setPokemonStatus(data, pokemonId, form, true, 0)}
                break;

                case -1:
                    if (image.classList.contains("pokemon-claimed")) {image.classList = ["pokemon-unclaimed"]; setPokemonStatus(data, pokemonId, form, false, 0)}
                break;

                case 2:
                    if (indicator.style.display = "none") {indicator.style.display = "block"; setPokemonStatus(data, pokemonId, form, true, 1)}
                break;

                case -2:
                    if (indicator.style.display = "block") {indicator.style.display = "none"; setPokemonStatus(data, pokemonId, form, false, 1)}
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
    row.style.height = `${48*dexScale}px`

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
                pokemon[listIndex].id,
                pokemon[listIndex].form
            ))
        }
        box.append(row)
    }
    box.classList = ["box", "center"]

    if (boxImageOverrides[name]) {
        if (boxVariations == true) box.style.backgroundImage = `url('../assets/boxes/${boxBgName}/body/${boxImageOverrides[name]}.png')`
        else box.style.backgroundImage = `url('../assets/boxes/${boxBgName}/body/box.png')`
    } else {
        if (boxVariations == true) box.style.backgroundImage = `url('../assets/boxes/${boxBgName}/body/${name}.png')`
        else box.style.backgroundImage = `url('../assets/boxes/${boxBgName}/body/box.png')`
    }
    box.style.backgroundPosition = "center"
    box.style.backgroundRepeat = "no-repeat"
    box.style.backgroundSize = "contain"

    box.style.margin = "auto"
    box.style.width = `${rowSize*(48+rowSize)*dexScale}px`
    box.style.height = `${rowCount*48*dexScale}px`

    box.style.alignItems = "center"
    box.style.display = "grid"

    box.id = name

    var boxHeader = document.createElement("img")
    if (boxHeaderOverrides[name]) {
        if (settings.numbered == "true") boxHeader.src = `../assets/boxes/${boxBgName}/head/numbered/${boxHeaderOverrides[name]}.png`
        else boxHeader.src = `../assets/boxes/${boxBgName}/head/standard/${boxHeaderOverrides[name]}.png`
    } else {
        if (settings.numbered == "true") boxHeader.src = `../assets/boxes/${boxBgName}/head/numbered/${name}.png`
        else boxHeader.src = `../assets/boxes/${boxBgName}/head/standard/${name}.png`
    }
    boxHeader.style.width = `${200*dexScale}px`
    boxHeader.style.margin = `${3*dexScale}px`

    boxContainer.append(boxHeader)
    boxContainer.append(box)

    boxContainer.style.display = "flexbox"

    boxContainer.style.marginBottom = `${5*dexScale}px`
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

    if (!settingInfo) return console.log("failed to get setting info");
    if (settings[settingInfo.settingName] == null) return console.log("failed to get setting name");

    // check if setting is supported
    if (!settingInfo.supportedGameStores.includes("*") && !settingInfo.supportedGameStores.includes(gamedatastore)) return null;
    if(settingInfo.supportedGameStores.find(x => x == "-"+gamedatastore)) return null;

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

        case "range":
            newSettingElement = document.createElement("div")
            newSettingElement.style.display = "inline"
            newSettingElement.style.marginBottom = "3px"

            var rangeElement = document.createElement("input")
            rangeElement.name = name
            rangeElement.type = "range"
            rangeElement.min = settingInfo.min
            rangeElement.max = settingInfo.max
            rangeElement.step = settingInfo.step

            rangeElement.value = parseFloat(settings[settingInfo.settingName])

            var label = document.createElement("label")
            label.for = name
            label.innerText = `${name} -> `
            label.style.marginRight = "10px"

            var value = document.createElement("p")
            value.innerText = `Value: ${(settingInfo.overrides[rangeElement.value] ? settingInfo.overrides[rangeElement.value] : rangeElement.value)}`
            value.style.margin = "0px"
            value.style.padding = "0px"

            rangeElement.oninput = () => {
                // while dragging
                value.innerText = `Value: ${(settingInfo.overrides[rangeElement.value] ? settingInfo.overrides[rangeElement.value] : rangeElement.value)}`
            }

            rangeElement.onchange = () => {
                // when finished dragging
                settingsWarning.style.display = "block"
                console.log(parseFloat(rangeElement.value))
                settings[settingInfo.settingName] = parseFloat(rangeElement.value)
                saveSettings(data, settings)
                saveData(gamedatastore, data)
            }

            newSettingElement.append(label)
            newSettingElement.append(rangeElement)
            newSettingElement.append(value)
            newSettingElement.append(document.createElement("br"))
        break;

        default:
            console.log(`Setting element ${name} has an invalid type!!`)
        break;
    }

    return newSettingElement
}

const trackerPage = document.createElement("div")
trackerPage.style.display = "none"
const progressPage = document.createElement("div")
progressPage.style.display = "none"
const settingsPage = document.createElement("div")
settingsPage.style.display = "none"
const helpPage = document.createElement("div")
helpPage.style.display = "none"

const newTab = (name) => {
    var newTabElement = document.createElement("a")
    newTabElement.innerText = name
    newTabElement.style.textDecoration = "none"
    newTabElement.style.cursor = "pointer"
    newTabElement.style.marginLeft = "10px"
    newTabElement.style.marginRight = "10px"
    newTabElement.id = name+"-tab"

    return newTabElement
}

const createTabs = () => {
    var tabsContainer = document.createElement("p")
    tabsContainer.style.userSelect = "none"

    var trackerTab = newTab("tracker");
    var progressTab = newTab("progress");
    var settingsTab = newTab("settings");
    var helpTab = newTab("help");

    trackerTab.style.textDecoration = "underline"
    trackerTab.onclick = () => {
        trackerPage.style.display = "block"
        progressPage.style.display = "none"
        settingsPage.style.display = "none"
        helpPage.style.display = "none"
        trackerTab.style.textDecoration = "underline"
        progressTab.style.textDecoration = "none"
        settingsTab.style.textDecoration = "none"
        helpTab.style.textDecoration = "none"
    }

    progressTab.onclick = () => {
        progressText.innerText = "Loading..."
        trackerPage.style.display = "none"
        progressPage.style.display = "block"
        settingsPage.style.display = "none"
        helpPage.style.display = "none"
        trackerTab.style.textDecoration = "none"
        progressTab.style.textDecoration = "underline"
        settingsTab.style.textDecoration = "none"
        helpTab.style.textDecoration = "none"

        updateProgress();
    }

    settingsTab.onclick = () => {
        trackerPage.style.display = "none"
        progressPage.style.display = "none"
        settingsPage.style.display = "block"
        helpPage.style.display = "none"
        trackerTab.style.textDecoration = "none"
        progressTab.style.textDecoration = "none"
        settingsTab.style.textDecoration = "underline"
        helpTab.style.textDecoration = "none"
    }

    helpTab.onclick = () => {
        trackerPage.style.display = "none"
        progressPage.style.display = "none"
        settingsPage.style.display = "none"
        helpPage.style.display = "block"
        trackerTab.style.textDecoration = "none"
        progressTab.style.textDecoration = "none"
        settingsTab.style.textDecoration = "none"
        helpTab.style.textDecoration = "underline"
    }

    tabsContainer.append(trackerTab)
    tabsContainer.append(progressTab)
    tabsContainer.append(settingsTab)
    tabsContainer.append(helpTab)

    return tabsContainer
}

//tracker page init

trackerPage.style.userSelect = "none"

const boxData = createBoxData(settings.unown == "true" ? true : false)
for (i = 0; i < boxData.length; i++) {
    var box = boxData[i]
    trackerPage.append(createBox(`box${box.id}`, box.id, box.pokemon))
}

// progress page init

var progressTitle = document.createElement("h1")
progressTitle.innerText = "pokedex progress"
var progressText = document.createElement("p")
progressText.innerText = "Loading..."

const updateProgress = () => {
    var pokemonObtained = 0;
    var pokemonMarked = 0;
    if (data) {
        if (data.pokemon) pokemonObtained = data.pokemon.length != null ? data.pokemon.length : 0
        if (data.marked) pokemonMarked  = data.marked.length != null ? data.marked.length : 0
    }
    var percentage = Math.floor(pokemonObtained/maxPokemon*100)
    var completion = pokemonObtained >= maxPokemon ? "(COMPLETED) " : ""
    var catchLeft = pokemonObtained >= maxPokemon ? "" : `\n${maxPokemon-pokemonObtained} left to catch!`
    var markedCount = pokemonMarked > 0 ? `\n${pokemonMarked} pokemon marked!` : ""
    progressText.innerText = `${completion}Pokedex completion: ${pokemonObtained}/${maxPokemon} (${percentage}%)${catchLeft}${markedCount}`
}

updateProgress()

var actionsTitle = document.createElement("h1")
actionsTitle.innerText = "quick actions"
actionsTitle.style.marginTop = "40px"
var actionsDiv = document.createElement("div")

var clearMarked = document.createElement("button")
clearMarked.innerText = "clear all marked pokemon"
clearMarked.onclick = () => {
    if (confirm("Are you sure you want to clear ALL of your *marked* pokemon? Are you sure you want to continue?") != true) return;
    if (confirm("This action is irreversable!! Are you still sure you want to clear ALL of your *marked* pokemon?") != true) return;
    if (!data) return;
    if (!data.marked) return;
    data.marked = []
    updateProgress()
    saveData(gamedatastore, data)
    window.location.reload();
}

actionsDiv.append(clearMarked)

var clearPokemon = document.createElement("button")
clearPokemon.innerText = "clear all pokemon"
clearPokemon.onclick = () => {
    if (confirm("Are you sure you want to clear ALL of your pokemon? Are you sure you want to continue?") != true) return;
    if (confirm("This action is irreversable!! Are you still sure you want to clear ALL of your pokemon?") != true) return;
    if (!data) return;
    if (!data.pokemon) return;
    data.pokemon = []
    updateProgress()
    saveData(gamedatastore, data)
    window.location.reload();
}

actionsDiv.append(clearPokemon)

progressPage.append(progressTitle)
progressPage.append(progressText)
progressPage.append(actionsTitle)
progressPage.append(actionsDiv)

// settings page init

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

var spriteOptions = [
    {val: -5, label: "Red/Blue sprites"},
    {val: -4, label: "Yellow sprites"},
    {val: -3, label: "Gold sprites"},
    {val: -2, label: "Silver sprites"},
    {val: -1, label: "Crystal sprites"},
    {val: 0, label: "Ruby/Sapphire sprites"},
    {val: 1, label: "Firered/Leafgreen sprites"},
    {val: 2, label: "Emerald sprites"},
    {val: 3, label: "Diamond/Pearl sprites"},
    {val: 4, label: "Platinum sprites"},
    {val: 5, label: "Heartgold/Soulsilver sprites"},
    {val: 6, label: "Black/White sprites"},
    {val: 7, label: "Gen 6/7 sprites"},
    {val: 8, label: "Gen 7 Menu icon sprites"},
    {val: 9, label: "Gen 8 Menu icon sprites"},
    {val: 12, label: "Generic pixel art sprites"}, // i'm not remapping the values
    {val: 10, label: "Pokemon Home sprites (slow)"},
    {val: 11, label: "Official Artwork (slow)"},
]

spriteOptions = spriteOptions.splice(minSprite+5, spriteOptions.length)

appendSettingElement(createSettingElement(
    "Sprite", {
        type: "dropdown",
        supportedGameStores: ["*"],
        settingName: "sprite",
        options: spriteOptions
    }
))
appendSettingElement(createSettingElement(
    "Box titles", {
        type: "dropdown",
        supportedGameStores: ["pbrs", "rby", "gsc"],
        settingName: "numbered",
        options: [
            {val: false, label: "Default box number"},
            {val: true, label: "Pokemon id range"},
        ]
    }
))
appendSettingElement(createSettingElement(
    generation >= 3 ? "Unown Box" : "Unown Boxes", {
        type: "checkmark",
        supportedGameStores: ["*", "-rby", "-lpge", "-swsh", "-sv"],
        settingName: "unown",
    }
))
appendSettingElement(createSettingElement(
    "Shiny sprites", {
        type: "checkmark",
        supportedGameStores: ["*", "-rby"],
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
appendSettingElement(createSettingElement(
    "Pokedex Scale", {
        type: "range",
        supportedGameStores: ["*"],
        settingName: "scale",
        min: 0.4,
        max: 3,
        step: 0.1,
        overrides: {
            0.4: "Auto"
        }
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

exportImportDiv.style.marginTop = "25px"

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
        if (confirm("Importing this data is irreversible and any data you currently have will be removed. Are you sure you want to continue?") != true) return;
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

// help page init

helpPage.style.width = "80vw"
helpPage.style.margin = "auto"

var helpTitle = document.createElement("h1")
helpTitle.innerText = "help"
var helpText = document.createElement("p")
helpText.innerText = `Note: This pokedex tracker is designed for a mouse and keyboard. Most features will likely not be available on mobile devices.\n\nThis pokedex tracker is quite simple. Click on a pokemon to mark it as "obtained". Click on it again to revoke its "obtained" status. Click and drag over all of the pokemon you want to mark/unmark as "obtained". To quickly see the information of a Pokemon, hold down the Control key and click on the Pokemon you want to see the information of.\n\nData is saved live, so any changes you make will retain throughout each refresh. It is recommended to often backup your data, as to not lose it. Your data is saved with localstorage, which depending on your browser (such as safari) may be cleared after one week of inactivity.`
helpPage.append(helpTitle)
helpPage.append(helpText)

// load all pages

trackerPage.id = "tracker"
progressPage.id = "progress"
settingsPage.id = "settings"
helpPage.id = "help"

const workspace = document.getElementById("workspace")
const tabs = createTabs()
tabs.style.display = "none"
workspace.append(tabs)
workspace.append(trackerPage)
workspace.append(progressPage)
workspace.append(settingsPage)
workspace.append(helpPage)

window.addEventListener("load", () => {
    tabs.style.display = "block"
    trackerPage.style.display = "block"
    document.getElementById("gametitle").innerText = gametitle
})