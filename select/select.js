//           _           _      _
//  ___  ___| | ___  ___| |_   (_)___
// / __|/ _ \ |/ _ \/ __| __|  | / __|
// \__ \  __/ |  __/ (__| |_ _ | \__ \
// |___/\___|_|\___|\___|\__(_)/ |___/
//                          |__/

// this file works with selecting which pokedex you want to track, which includes:
// defining the pokedexes, and creating a frontend to go to the tracker.

// reading the code from your browser? the code is freely available here!
// https://github.com/deadfry42/pokedex-tracker

var pokedexes = [
    {
        label: "Generation 1",
        national: null,
        types: [
            {label: "Pokemon Red/Blue/Yellow", store: "rby"},
        ]
    },
    {
        label: "Generation 2",
        national: null,
        types: [
            {label: "Pokemon Gold/Silver/Crystal", store: "gsc"},
        ]
    },
    {
        label: "Generation 3",
        national: "gen3",
        types: [
            {label: "Pokemon Ruby/Sapphire/Emerald", dexType: "Hoenn", store: "rse"},
            {label: "Pokemon FireRed/LeafGreen", dexType: "Kanto", store: "frlg"},
            {label: "Pokemon Box: Ruby & Sapphire", store: "pbrs"},
        ]
    },
    {
        label: "Generation 4",
        national: "gen4",
        types: [
            {label: "Pokemon Diamond/Pearl/Platinum", dexType: "Sinnoh", store: "dppt"},
            {label: "Pokemon HeartGold/SoulSilver", dexType: "Johto", store: "hgss"},
        ]
    },
    {
        label: "Generation 5",
        national: "gen5",
        types: [
            {label: "Pokemon Black/White", dexType: "Unova", store: "bw"},
            {label: "Pokemon Black2/White2", dexType: "Hoenn", store: "b2w2"},
        ]
    },
    {
        label: "Generation 6",
        national: "gen6",
        types: [
            {label: "Pokemon X/Y", dexType: "Kalos", store: "xy"}, //we'll come to kalos later
            {label: "Pokemon Omega Ruby/Alpha Sapphire", dexType: "Hoenn", store: "oras"},
        ]
    },
    {
        label: "Generation 7",
        national: null,
        types: [
            {label: "Pokemon Sun/Moon", dexType: "Alola", store: "sm"},
            {label: "Pokemon Ultra Sun/Ultra Moon", dexType: "Alola", store: "usum"},
            {label: "Pokemon Bank", store: "pokebank"},
        ]
    },
]


var readyPokedexes = [ // all of the pokedexes that are ready and should be shown to the user
    pokedexes[0],
    pokedexes[1],
    pokedexes[2],
]

const allowRegionalSubtitles = false;
// turn to true when regional subtitles are implemented.

const CreatePokedexElement = (data) => {
    var pokedex = document.createElement("div")
    var title = document.createElement("h2")
    title.innerText = data.label+(allowRegionalSubtitles != true ? "" : data.dexType ? `\n(${data.dexType} Dex)` : "");
    title.style.margin = "1vw"

    var anchor = document.createElement("a")
    anchor.href = `../tracker/index.html?game=${data.store}`

    var image = document.createElement("img")
    image.src = `../assets/boxart/${data.store}.png`
    image.style.width = "10vw"
    image.classList = ["pokemon-claimed"]

    anchor.append(image)

    pokedex.append(title)
    pokedex.append(anchor)

    return pokedex
}

const CreateGroupElement = (data) => {
    var group = document.createElement("fieldset")
    group.style.display = "inline"
    group.style.borderRadius = "1rem"

    group.style.borderBottom = "none"
    group.style.marginBottom = "1rem"

    var inside = document.createElement("div")
    inside.style.display = "flex"
    inside.style.margin = "auto"
    inside.classList = ["center"]

    var title = document.createElement("legend")
    title.innerText = data.label;
    title.style.fontWeight = "900";
    title.style.fontSize = "1.5rem"

    group.append(title)
    group.append(inside);

    data.types.forEach((pokedex) => {
        inside.append(CreatePokedexElement(pokedex));
    })

    return group;
}

const workspace = document.getElementById("workspace")

var groups = []

readyPokedexes.forEach((element) => {
    var group = CreateGroupElement(element)
    groups.push(group)
})

window.addEventListener("load", () => {
    groups.forEach((group) => {
        workspace.append(group)
    })
})

window.addEventListener("keyup", (e) => {
    if (e.key == "Escape") document.getElementById("backbutton").click() //sometimes won't work
})