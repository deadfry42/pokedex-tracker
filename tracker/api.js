// api.js works with all of the backend, the things that are invisible to the user
// this includes getting pokemon images, getting data, changing data and more

const rowSize = 12
const rowCount = 5
const maxPokemon = 386
const gametitle = "Pokemon Box: Ruby & Sapphire"
const gamedatastore = "pbrs"

const body = document.getElementById("body")
const startFrontend = () => {
    var script = document.createElement("script")
    script.src = "frontend.js"
    body.append(script)
}

const getPokemonImageURL = (id, version = 0, shiny = false) => {
    // version:
    // 0 - pkmn ruby
    // 1 - pkmn frlg
    // 2 - pkmn emerald
    // 3 - pkmn dp
    // 4 - pkmn pt
    // 5 - pkmn hgss

    // url example: (frlg bulbasaur)
    // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/1.png

    if (id > maxPokemon) return "../assets/blankSpace.png"

    if (version > 5) version = 5
    if (version < 0) version = 0
    var urlConstructor = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/"
    var lastUrlConstructor = ""

    var good = false

    const createUrlForVersion = (version) => {
        var currentUrlConstructor = urlConstructor
        switch (version) {
            case 0:
                currentUrlConstructor += "generation-iii/ruby-sapphire/"
            break;

            case 1:
                if (id > 151 && id != 216) currentUrlConstructor += "generation-iii/ruby-sapphire/"
                else currentUrlConstructor += "generation-iii/firered-leafgreen/"
            break;

            case 2:
                currentUrlConstructor += "generation-iii/emerald/"
            break;

            case 3:
                currentUrlConstructor += "generation-iv/diamond-pearl/"
            break;

            case 4:
                currentUrlConstructor += "generation-iv/platinum/"
            break;

            case 5:
                currentUrlConstructor += "generation-iv/heartgold-soulsilver/"
            break;

            default:
                currentUrlConstructor += "generation-iii/ruby-sapphire/"
            break;
        }

        if (shiny == true) currentUrlConstructor += "shiny/"
    
        currentUrlConstructor += `${id}.png`
        lastUrlConstructor = currentUrlConstructor
        return currentUrlConstructor
    }

    createUrlForVersion(version)

    return lastUrlConstructor
}

const createBoxData = (includeUnownBox = false) => {
    var boxData = []
    var boxCount = Math.ceil(maxPokemon/(rowSize*rowCount))

    for (i = 1; i <= boxCount; i++) {
        var pkmn = []
        for (pi = (i*rowSize*rowCount)-((rowSize*rowCount)-1); pi <= i*(rowSize*rowCount); pi++) {
            pkmn.push(
                {
                    id: pi,
                    form: 0,
                }
            )
        }
        boxData.push(
            {
                id: i,
                pokemon: pkmn,
            }
        )
    }

    if (includeUnownBox == true) {
        boxData.push(
            {
                id: 8,
                pokemon: [
                    {id: 201, form: 0},
                    {id: 201, form: 1},
                    {id: 201, form: 2},
                    {id: 201, form: 3},
                    {id: 201, form: 4},
                    {id: 201, form: 5},
                    {id: 201, form: 6},
                    {id: 201, form: 7},
                    {id: 201, form: 8},
                    {id: 201, form: 9},
                    {id: 201, form: 10},
                    {id: 201, form: 11},
                    {id: 201, form: 12},
                    {id: 201, form: 13},
                    {id: 201, form: 14},
                    {id: 201, form: 15},
                    {id: 201, form: 16},
                    {id: 201, form: 17},
                    {id: 201, form: 18},
                    {id: 201, form: 19},
                    {id: 201, form: 20},
                    {id: 201, form: 21},
                    {id: 201, form: 22},
                    {id: 201, form: 23},
                    {id: 201, form: 24},
                    {id: 201, form: 25},
                    {id: 201, form: 26},
                    {id: 201, form: 27},

                    {id: 999, form: 0}, // blank spots
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},
                    {id: 999, form: 0},

                ]
            }
        )
    }

    return boxData
}

const getData = (type) => {
    var returnVal = null;
    try {
        returnVal = JSON.parse(localStorage.getItem(type))
    } catch(e) {
        console.log("ERROR PARSING DATA!!!!")
        console.log(e)
    }
    return returnVal
    // {
    //     pbrs: { // (pbrs is a type)
    //         settings: {}
    //         pokemon : {
    //             1: 1,
    //             24: 0,
    //             55: 1,
    //             254: 0,
    //             386: 1,
    //             ...
    //         }
    //     }   
    // }
} 

const getSettings = (data = null) => {
    var settings = {}
    if (data != null && data.settings != null) {
        settings.numbered = data.settings.numbered != null ? data.settings.numbered : false
        settings.sprite = parseInt(data.settings.sprite) != null ? parseInt(data.settings.sprite) : 0
        settings.shiny = data.settings.shiny != null ? data.settings.shiny : false
    }
    return settings
}

const saveSettings = (data, settings) => {
    if (!data) data = {}
    data.settings = settings
}

const saveData = (type, data) => {
    if (data) localStorage.setItem(type, JSON.stringify(data))
    else {
        localStorage.setItem(type, "{}")
    }
}

const setPokemonStatus = (data = null, pkmnId = null, status = false) => {
    if (!pkmnId) return;
    if (!data) data = {}
    if (!data.pokemon) data.pokemon = []
    if (status) {
        if (!data.pokemon.includes(pkmnId)) data.pokemon.push(pkmnId);
    } else {
        var index = data.pokemon.indexOf(pkmnId)
        if (index > -1) {
            data.pokemon.splice(index, 1);
        }
    }
}

const getPokemonStatus = (data = null, pkmnId = null) => {
    if (!pkmnId) return;
    if (!data) return;
    if (!data.pokemon) return;
    return data.pokemon.includes(pkmnId);
}

startFrontend()