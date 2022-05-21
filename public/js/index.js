const main = document.querySelector("#main");
const search = document.querySelector("#search");
const hello = document.querySelector("#hello");
const day = document.querySelector("#day");
const clock = document.querySelector("#time");
const settings = document.querySelector("#settings");
const github = document.querySelector("#github");
const weatherLine = document.querySelector("#weatherLine");
const weather = document.querySelector("#weather");
const info = document.querySelector(".info");
const text = document.querySelector(".text");
const battery = document.querySelector(".battery");
const level = document.querySelector('.level');
const musicLine = document.querySelector(".musicLine");
const artwork = document.querySelector(".artwork");
const company = document.querySelector(".company");
const musicName = document.querySelector(".musicName");
const lyrics = document.querySelector(".lyric");
const oldLyrics = document.querySelector(".oldLyric");

if (parseFloat(localStorage.getItem("lastVersion")) < 2) {
    localStorage.clear();
}

(async () => {
    if (parseFloat(localStorage.getItem("lastVersion")) <= 2.1) {
        if (localStorage.getItem("background") && localStorage.getItem("background") !== "default") {
            await chrome.storage.local.set({
                background: localStorage.getItem("upload")
            });
            localStorage.removeItem("background");
            localStorage.removeItem("upload");
        }
    }

    let background = await chrome.storage.local.get("background");
    if (!background.background) {
        background.background = "default";
        await chrome.storage.local.set({
            background: "default"
        });
    }

    const url = background.background === "default" ? "../media/wallpaper.jpg" : background.background;
    document.body.style.background = `url(${url}) no-repeat`;
})()

if (!localStorage.getItem("background")) localStorage.setItem("background", "default");
if (!localStorage.getItem("location")) localStorage.setItem("location", "New York");
if (!localStorage.getItem("weather")) localStorage.setItem("weather", "true");
if (!localStorage.getItem("clockType")) localStorage.setItem("clockType", "24");
if (!localStorage.getItem("searchEngine")) localStorage.setItem("searchEngine", "https://google.com/search?q=%s");
if (!localStorage.getItem("info")) localStorage.setItem("info", "true");
if (!localStorage.getItem("bookmarks")) localStorage.setItem("bookmarks", "true");
if (!localStorage.getItem("audios")) localStorage.setItem("audios", "true");
if (!localStorage.getItem("text")) localStorage.setItem("text", "Hello World!");
if (!localStorage.getItem("battery")) localStorage.setItem("battery", "true");
if (!localStorage.getItem("spotify")) localStorage.setItem("spotify", "true");
if (!localStorage.getItem("youtube")) localStorage.setItem("youtube", "true");
if (!localStorage.getItem("lyrics")) localStorage.setItem("lyrics", "true");

text.innerText = localStorage.getItem("text");
if (localStorage.getItem("info") === "true") {
  info.style.display = "block";
} else {
  info.style.display = "none";
}
if (localStorage.getItem("lastVersion") !== "2.2") {
    localStorage.setItem("lastVersion", "2.2");
    window.location.assign("update.html");
}

settings.addEventListener("click", () => {
    window.location.assign("settings.html");
});
github.addEventListener("click", () => {
    window.location.assign("https://github.com/sverben/HeadTab");
})

search.focus();

search.addEventListener("input", () => {
    if (search.value.length > 0) {
        main.classList.remove("popout");
        setTimeout(() => {
            main.classList.add("popin");
        }, 0);
    } else {
        main.classList.remove("popin");
        setTimeout(() => {
            main.classList.add("popout");
        }, 0)
    }
})

document.body.addEventListener("click", () => {
    search.focus();
})

search.addEventListener("keyup", ev => {
    if (ev.key === "Escape") {
        search.value = "";
        main.classList.remove("popin");
        setTimeout(() => {
            main.classList.add("popout");
        }, 0)
    } else if (ev.key === "Enter") {
        window.location.assign(localStorage.getItem("searchEngine").replaceAll("%s", search.value));
    }
})

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function partOfDay(hour) {
    if (hour >= 0 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    if (hour >= 18) return "evening";
}

const name = localStorage.getItem("name");
function updateClock() {
    const date = new Date();
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    if (hour.length === 1) {
        hour = `0${hour}`;
    } else if (hour.length === 0) {
        hour = "00";
    }
    if (minute.length === 1) {
        minute = `0${minute}`;
    } else if (minute.length === 0) {
        minute = "00";
    }

    let append = "";
    if (localStorage.getItem("clockType") === "12") {
        append = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        hour = hour ? hour : 12;
    }
    clock.innerText = `${hour}:${minute}${append}`;
    day.innerText = `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    hello.innerText = `Good ${partOfDay(date.getHours())}, ${name ? name : "HeadTab"}`;

    setTimeout(updateClock, (60 - date.getSeconds()) * 1000);
}

updateClock();

function getWeather() {
    fetch(`https://api.sverben.nl/weather/${localStorage.getItem("location")}`)
        .then(res => res.json())
        .then(data => {
            const weather = document.querySelector(".weather");
            const img = weather.querySelector("img");
            const city = weather.querySelector(".city");
            const desc = weather.querySelector(".description");

            img.src = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0].icon}.svg`;
            city.innerText = data.name;
            desc.innerText = data.weather[0].description;
        })
}
if (localStorage.getItem("weather") === "true") getWeather();
else {
    weatherLine.style.display = "none";
    weather.style.display = "none";
}

let result = [];

function fetchBookmarks() {
    chrome.bookmarks.getTree(
        function(bookmarkTreeNodes) {
            parseBookmarks(bookmarkTreeNodes)
        }
    );
}

function parseFolder(folder) {
    for (let item in folder["children"]) {
        item = folder["children"][item];
        if (item["url"] !== undefined) {
            result.push([item["title"], item["url"], `https://www.google.com/s2/favicons?domain=${item["url"]}`]);
        } else {
            parseFolder(item);
        }
    }
}

function parseBookmarks(bookmarks) {
    parseFolder(bookmarks[0]);
    printBookmarks(result);
}

function printBookmarks(bookmarks) {
    const icons = document.querySelector("#icons");

    if (bookmarks.length === 0) return;
    const divider = document.createElement("div");
    divider.classList.add("divider");
    icons.append(divider);
    for (let icon in bookmarks) {
        icon = bookmarks[icon];

        const img = document.createElement("img");
        img.src = icon[2];
        img.title = `${icon[0]}\n${icon[1]}`;

        img.addEventListener("click", () => {
            window.location.assign(icon[1]);
        })
        icons.append(img);
    }
}

if (localStorage.getItem("bookmarks") === "true") fetchBookmarks();

const audicons = document.querySelector("#audio");
function audioPlaying(tabs) {
    for (let tab in tabs) {
        if (tab === 'length')
            return false;

        tab = tabs[tab];

        const audicon = document.createElement('img');
        audicon.classList.add('audicon');
        audicon.src = tab['favIconUrl'];
        if (!tab['favIconUrl']) {
            audicon.src = '../media/globe.svg';
            audicon.classList.add("notFound");
        }
        audicon.title = tab['title'];
        audicon.addEventListener("click", () => {
            chrome.tabs.update(tab["id"], {active: true});
        })

        if (tab['url'].includes("spotify.com/") && !oldaudios.includes(tab) && localStorage.getItem("spotify") === "true") {
            handleMusicIntegration(tab, getArtwork);
        }
        if (tab['url'].includes("spotify.com/") && !oldaudios.includes(tab) && localStorage.getItem("lyrics") === "true") {
            spotifyWorker(tab["id"]);
        }
        if (tab['url'].includes("youtube.com/") && !oldaudios.includes(tab) && localStorage.getItem("youtube") === "true") {
            handleMusicIntegration(tab, getYoutubeArtwork);
        }

        if (localStorage.getItem("audios") === "true")
            audicons.append(audicon);
    }
}

function handleMusicIntegration(tab, getArtwork) {
    musicLine.style.display = "flex";
    company.src = tab['favIconUrl'];

    setTimeout(() => {
        musicLine.style.transform = "translateX(-200%)";
        musicName.style.animation = "1s fromLeft ease forwards";
        setTimeout(() => {
            musicLine.style.display = "none";
            musicLine.style.transform = "";
        }, 1000);
    }, 5000);
    setTimeout(() => {
        musicName.style.animation = "1s toLeft ease forwards";
    }, 4000);
    chrome.scripting.executeScript({
        target: {tabId: tab["id"]},
        func: getArtwork
    }, src => {
        artwork.src = src[0].result;
    })
    musicName.innerText = tab['title'];
}

function getArtwork() {
    const artwork = document.querySelector(".cover-art-image");

    return artwork.src;
}
function getYoutubeArtwork() {
    const artwork = document.querySelector("#avatar.style-scope.ytd-video-owner-renderer.no-transition img")

    return artwork.src;
}

let oldWorker = null;
let lyric = null;
function spotifyWorker(id) {
    if (oldWorker) clearInterval(oldWorker);

    oldWorker = setInterval(() => {
        chrome.scripting.executeScript({
            target: {tabId: id},
            func: getLyric
        }, result => {
            if (result[0].result === lyric) return;
            if (!result[0].result) {
                lyrics.innerText = "";
                oldLyrics.innerText = "";
                return;
            }
            lyrics.style.animation = "1s swipeIn ease forwards";
            lyrics.innerText = result[0].result;
            oldLyrics.innerText = lyric;
            oldLyrics.style.transform = "translateY(-110%)";
            oldLyrics.style.filter = "opacity(0)";
            setTimeout(() => {
                oldLyrics.style.filter = "opacity(1)";
                oldLyrics.style.transform = "";
                oldLyrics.innerText = "";
                lyrics.style.animation = "";
            }, 1000);

            lyric = result[0].result;
        })
    }, 60)
}

function getLyric() {
    let el;
    if (!window.lyricsParent) {
        document.querySelectorAll("*").forEach(e => {
            if (getComputedStyle(e).getPropertyValue("--animation-index") === "1") {
                el = e;
            }
        })
    } else {
        window.lyricsParent.querySelectorAll("*").forEach(e => {
            if (getComputedStyle(e).getPropertyValue("--animation-index") === "1") {
                el = e;
            }
        })
    }

    if (!el) return null;
    window.lyricsParent = el.parentElement;

    return el.innerText;
}

let audios;
let oldaudios = [];
function audioUpdates() {
    chrome.tabs.query({
        audible: !0
    }, function(tabs) {
        audios = tabs;
        if (!isEqual(audios, oldaudios)) {
            audicons.innerHTML = '';
            audioPlaying(tabs);
        }
        oldaudios = audios;
    });

    setTimeout(() => {
        audioUpdates()
    }, 1000);
}

function isEqual (value, other) {

    // Get the value type
    const type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    const compare = function (item1, item2) {

        // Get the object type
        const itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    }

    // Compare properties
    if (type === '[object Array]') {
        for (let i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;

}

audioUpdates();
if (localStorage.getItem("battery") !== "true") battery.style.display = "none";

(async () => {
    await navigator.getBattery().then(battery => {
        level.style.height = `${battery.level * 100}%`;
        level.title = `Battery: ${battery.level * 100}%${battery.charging ? '\nCharging' : ''}`;
    });
})();