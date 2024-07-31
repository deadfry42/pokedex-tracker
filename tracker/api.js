//              _    _
//   __ _ _ __ (_)  (_)___
//  / _` | '_ \| |  | / __|
// | (_| | |_) | |_ | \__ \
// \__,_| .__/|_(_)/ |___/
//     |_|      |__/

// this file works with all of the backend, the things that are invisible to the user, including:
// getting pokemon images, getting data, changing data and more

const body = document.getElementById("body")

const getPokemonImageURL = (id, version = 0, shiny = false, form = "", subfolder = "") => {
    // version:
    // 0 - pkmn ruby
    // 1 - pkmn frlg
    // 2 - pkmn emerald
    // 3 - pkmn dp
    // 4 - pkmn pt
    // 5 - pkmn hgss
    // 6 - pkmn bw

    // url example: (frlg bulbasaur)
    // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/1.png

    if (id > maxPokemon || id < 0) return "../assets/blankSpace.png"

    if (version > 11) version = 11
    if (version < -5) version = -5
    var urlConstructor = localImages ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" : "../assets/pokemon/"
    var lastUrlConstructor = ""

    const createUrlForVersion = (version) => {
        var currentUrlConstructor = urlConstructor

        switch (version) {
            case -5:
                currentUrlConstructor += "versions/generation-i/red-blue/"
            break;

            case -4:
                currentUrlConstructor += "versions/generation-i/yellow/"
            break;

            case -3:
                currentUrlConstructor += "versions/generation-ii/gold/"
            break;

            case -2:
                currentUrlConstructor += "versions/generation-ii/silver/"
            break;

            case -1:
                currentUrlConstructor += "versions/generation-ii/crystal/"
            break;

            case 0:
                currentUrlConstructor += "versions/generation-iii/ruby-sapphire/"
            break;

            case 1:
                if (id > 151 && id != 216) currentUrlConstructor += "versions/generation-iii/ruby-sapphire/"
                else currentUrlConstructor += "versions/generation-iii/firered-leafgreen/"
            break;

            case 2:
                currentUrlConstructor += "versions/generation-iii/emerald/"
            break;

            case 3:
                currentUrlConstructor += "versions/generation-iv/diamond-pearl/"
            break;

            case 4:
                currentUrlConstructor += "versions/generation-iv/platinum/"
            break;

            case 5:
                currentUrlConstructor += "versions/generation-iv/heartgold-soulsilver/"
            break;
            
            case 6:
                currentUrlConstructor += "versions/generation-v/black-white/"
            break;

            case 7:
                currentUrlConstructor += "versions/generation-vii/ultra-sun-ultra-moon/"
            break;

            case 8:
                currentUrlConstructor += "versions/generation-vii/icons/"
            break;

            case 9:
                currentUrlConstructor += "versions/generation-viii/icons/"
            break;

            case 10:
                currentUrlConstructor += "other/home/"
            break;

            case 11:
                currentUrlConstructor += "other/official-artwork/"
            break;

            default:
                currentUrlConstructor += "versions/generation-iii/ruby-sapphire/"
            break;
        }

        if (shiny == "true" && generation > 1) currentUrlConstructor += "shiny/"

        currentUrlConstructor += subfolder;
    
        var formtext = form ? `-${form}` : ""
        currentUrlConstructor += `${id}${formtext}.png`
        lastUrlConstructor = currentUrlConstructor
        return currentUrlConstructor
    }

    createUrlForVersion(version)

    return lastUrlConstructor
}

const getAllowedGamesFromGeneration = (gen, allowOverlap, gentype=1) => {
    var gen1 = ["red", "blue", "yellow"]
    var gen2 = ["gold", "silver", "crystal"]
    var gen3 = ["ruby", "sapphire", "emerald", "firered", "leafgreen"]
    var gen4 = ["diamond", "pearl", "platinum", "heartgold", "soulsilver"]
    var gen5 = ["black", "white", "black2", "white2"]
    var gen6 = ["x", "y", "omegaruby", "alphasapphire"]
    var gen7 = ["sun", "moon", "ultrasun", "ultramoon"]
    // everything after gen7 is considered it's own mini generation lol
    var gen8_1 = ["sword", "shield"]
    var gen8_2 = ["brilliantdiamond", "shiningpearl"]
    var gen8_3 = ["legendsarceus"]
    var gen9_1 = ["scarlet", "violet"]
    switch (gen) {
        case 1: 
            return gen1
        break;
        case 2: 
            if (allowOverlap) return gen2 + gen1
            else return gen2
        break;
        case 3:
            return gen3
        break;
        case 4:
            if (allowOverlap) return gen4 + gen3
            else return gen4
        break;
        case 5:
            if (allowOverlap) return gen5 + gen4 + gen3
            else return gen5
        break;
        case 6: // pokemon bank's closure will isolate gen6 & 7
            return gen6
        break;
        case 7:
            return gen7
        break;
        case 8:
            if (gentype == 2) return gen8_2
            else if (gentype == 3) return gen8_3
            else return gen8_1
        break;
        case 9:
            return gen9_1 // will add more for pl:za
        break;
    }
}

const fetchPokemonDataFromID = (id) => {
    // pokeapi here
    // https://pokeapi.co/api/v2/pokemon/${id}

    return new Promise((resolve, reject) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => {
                if (!response.ok) reject(null)
                return response.json();
            }) .then((data) => {
                resolve(data)
            })
    })
}

// this is quite possibly the worse function in this entire project
// explanation: all of the sources that can be chosen have different urls to each other.
const fetchPokemonInformationURL = (id, sourceType) => {
    if (sourceType == null) sourceType == 0
    return new Promise((resolve, reject) => {
        if (generation < 8 && sourceType == 1) { // skip getting data, serebii doesn't require pokemon name
            var pokedexType = "pokedex" //fallback
            switch (generation) {
                case 2:
                    pokedexType += "-gs"
                break;

                case 3:
                    pokedexType += "-rs"
                break;

                case 4:
                    pokedexType += "-dp"
                break;

                case 5:
                    pokedexType += "-bw"
                break;

                case 6:
                    pokedexType += "-xy"
                break;

                case 7:
                    pokedexType += "-sm"
                break;
            }
            var stringid = id.toString()
            if (stringid.length == 1) stringid = "0"+stringid
            if (stringid.length == 2) stringid = "0"+stringid
            resolve(`https://www.serebii.net/${pokedexType}/${stringid}.shtml`)
        }
        fetchPokemonDataFromID(id) .then((data) => {
            var name = data.name
            if (data == null) reject(null)    
            switch (sourceType) {
                default: //bulbapedia (fallback)
                    name = name.replace("-m", "♂") // nidoran-m fix
                    name = name.replace("-f", "♀") // nidoran-f fix
                    name = name.replace("-o", "-O") // ho-oh fix
                    name = name.replace("-normal", "") //deoxys fix
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                    resolve(`https://bulbapedia.bulbagarden.net/wiki/${name}_(Pokémon)`)
                break;

                case 1:
                    var name = data.name
                    name = name.replace("-m", "m") // nidoran-m fix
                    name = name.replace("-f", "f") // nidoran-f fix
                    name = name.replace("-normal", "") //deoxys fix
                    var pokedexType = "pokedex"
                    switch (Math.floor(generation)) {
                        default: //gen 8 (fallback)
                            pokedexType += "-swsh"
                        break;

                        case 9:
                            pokedexType += "-sv"
                        break;
                    }

                    resolve(`https://www.serebii.net/${pokedexType}/${name}`)
                break;

                case 2: //pokemondb, kept just in case some people REALLY want it
                    var name = data.name
                    resolve(`https://pokemondb.net/pokedex/${name}`)
                break;
            }
        }) .catch((e) => {
            reject(null)
        })
    })
}

const createBoxData = (includeUnownBox = false) => {
    var boxData = []
    var boxCount = Math.ceil(maxPokemon/(rowSize*rowCount))

    var boxIndex = 0;

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
        boxIndex++;
    }

    if (includeUnownBox == true) { // automatically create the unown box
        var unownBoxPokemon = []
        if (generation >= 3) {
            var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","exclamation","question"]
            for (i = 0; i < 60; i++) {
                if (i > 27) unownBoxPokemon.push({id: -1, form: 0}) // filling the rest with blank spots
                else unownBoxPokemon.push({id: 201, form: alphabet[i]})
            }
            boxData.push({
                id: boxIndex+1,
                pokemon: unownBoxPokemon
            })
        } else {
            var unownBoxPokemon2 = []
            var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
            for (i = 0; i < 20; i++) {
                if (i > 27) unownBoxPokemon.push({id: -1, form: 0}) // filling the rest with blank spots
                else unownBoxPokemon.push({id: 201, form: alphabet[i]})
            }
            for (i = 20; i < 40; i++) {
                if (i > 27) unownBoxPokemon2.push({id: -1, form: 0}) // filling the rest with blank spots
                else unownBoxPokemon2.push({id: 201, form: alphabet[i]})
            }
            boxData.push({
                id: boxIndex+1,
                pokemon: unownBoxPokemon
            })
            boxData.push({
                id: boxIndex+2,
                pokemon: unownBoxPokemon2
            })
        }
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
    if (data == null) data = {settings: {}}
    if (!data.settings) data.settings = {}
    settings.numbered = data.settings.numbered != null ? data.settings.numbered : "false"
    settings.sprite = data.settings.sprite != null ? parseInt(data.settings.sprite) : defSprite
    settings.unown = data.settings.unown != null ? data.settings.unown : "false"
    settings.shiny = data.settings.shiny != null ? data.settings.shiny : "false"
    settings.iframe = data.settings.iframe != null ? data.settings.iframe : "true"
    settings.source = data.settings.source != null ? parseInt(data.settings.source) : 1
    return settings
}

const saveSettings = (data, settings) => {
    if (!settings) return;
    if (!data) data = {}
    data.settings = settings
}

const saveData = (type, data) => {
    if (data) localStorage.setItem(type, JSON.stringify(data))
    else {
        localStorage.setItem(type, "{}")
    }
}

const setPokemonStatus = (data = null, pkmnId = null, form = null, status = false, statusType = 0) => {
    if (!pkmnId) return;
    if (!data) data = {}
    var pullTable = statusType == 0 ? "pokemon" : "marked"
    if (!data[pullTable]) data[pullTable] = []
    var includer = pkmnId;
    if (form != null && form != 0) includer = includer.toString()+form.toString()
    if (status) {
        if (!data[pullTable].includes(includer)) data[pullTable].push(includer);
    } else {
        var index = data[pullTable].indexOf(includer)
        if (index > -1) {
            data[pullTable].splice(index, 1);
        }
    }
}

const getPokemonStatus = (data = null, pkmnId = null, form = 0, statusType = 0) => {
    if (!pkmnId) return;
    if (!data) return;
    var pullTable = statusType == 0 ? "pokemon" : "marked"
    if (!data[pullTable]) return;
    var includer = pkmnId;
    if (form != null && form != 0) includer = includer.toString()+form.toString()
    return data[pullTable].includes(includer);
}

startFrontend()