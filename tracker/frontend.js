document.getElementById("gametitle").innerText = gametitle

var data = getData("pbrs");
var settings = getSettings(data)
saveSettings(data, settings)
saveData("pbrs", data)

const createPokemonElement = (pokemonId) => {
    var pokemon = document.createElement("img")
    pokemon.src = getPokemonImageURL(pokemonId, settings.sprite)

    pokemon.style.width = "48px"
    pokemon.style.height = "48px"
    pokemon.style.margin = "0px"
    pokemon.style.padding = "0px"
    pokemon.style.marginRight = "0px"
    pokemon.style.marginLeft = "0px"

    pokemon.classList = ["pokemon"]

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

const content = document.getElementById("tracker")

const boxData = createBoxData(false)
for (i = 0; i < boxData.length; i++) {
    var box = boxData[i]
    content.append(createBox(`box${box.id}`, box.id, box.pokemon))
}