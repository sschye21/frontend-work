
function openBachelor() {
    bachelorContent = document.querySelector(".bachelor-container")
    mastersDocContent = document.querySelector(".masters-doc-container")
    bachelorContent.style.display = ""
    mastersDocContent.style.display = "none";

    bachelorTab = document.getElementById("bachelor-tab")
    mastersTab = document.getElementById("masters-tab")
    doctorateTab = document.getElementById("doctorate-tab")

    bachelorTab.style.backgroundColor = "white"
    bachelorTab.style.color = "#4949E4"

    bachelorTab.onblur = function() {
        if (mastersTab.onclick || doctorateTab.onclick) {
            bachelorTab.style.backgroundColor = "#000D47"
            bachelorTab.style.color = "white"
        }
    }
}

function openMasters() {
    bachelorTab = document.getElementById("bachelor-tab")
    mastersTab = document.getElementById("masters-tab")
    doctorateTab = document.getElementById("doctorate-tab")
    mastersTab.style.backgroundColor = "white"
    mastersTab.style.color = "#4949E4"
    
    bachelorContent = document.querySelector(".bachelor-container")
    docContent = document.querySelector(".doctorate-container")
    mastersContent = document.querySelector(".masters-container")
    mastersContent.style.display = ""
    bachelorContent.style.display = "none";
    docContent.style.display = "none";

    mastersTab.onblur = function() {
        if (bachelorTab.onclick || doctorateTab.onclick) {
            mastersTab.style.backgroundColor = "#000D47"
            mastersTab.style.color = "white"
        }
    }
}

function openDoctorate() {
    bachelorTab = document.getElementById("bachelor-tab")
    mastersTab = document.getElementById("masters-tab")
    doctorateTab = document.getElementById("doctorate-tab")
    doctorateTab.style.backgroundColor = "white"
    doctorateTab.style.color = "#4949E4"

    bachelorContent = document.querySelector(".bachelor-container")
    mastersContent = document.querySelector(".masters-container")
    docContent = document.querySelector(".doctorate-container")
    bachelorContent.style.display = "none";
    mastersContent.style.display = "none";
    docContent.style.display = ""

    doctorateTab.onblur = function() {
        if (bachelorTab.onclick || mastersTab.onclick) {
            doctorateTab.style.backgroundColor = "#000D47"
            doctorateTab.style.color = "white"
        }
    }
}