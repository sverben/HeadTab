const categoriesEl = document.querySelector('.categories');
const settings = document.querySelector(".settings");
const close = document.querySelector(".close");
close.addEventListener('click', () => {
    window.history.back();
});
const els = [];

for (let category in categories) {
    category = categories[category];

    const el = document.createElement('div');
    el.classList.add('category');
    const accent = document.createElement('div');
    accent.classList.add('accent');
    const p = document.createElement('p');
    p.innerText = category.name;
    el.append(accent, p);
    el.addEventListener("click", () => {
        for (let el in els) {
            els[el].classList.remove('selected');
        }
        el.classList.add('selected');
        open(category);
    })

    categoriesEl.append(el);
    els.push(el);
}
els[0].click();

function open(category) {
    settings.innerHTML = "";
    const title = document.createElement("h1");
    title.innerText = category.name;
    settings.append(title);
    for (let setting in category.settings) {
        setting = category.settings[setting];

        const el = document.createElement("div");
        el.classList.add("setting");
        const line = document.createElement("div");
        line.classList.add("line");
        const name = document.createElement("p");
        name.innerText = setting.name;
        name.classList.add("name");
        const spacer = document.createElement("div");
        spacer.classList.add("spacer");
        line.append(name, spacer);
        if (setting.type === "check") {
            const check = document.createElement("div");
            check.classList.add("check");
            check.addEventListener("click", () => {
                check.classList.toggle("on");
                localStorage.setItem(setting.storage, check.classList.contains("on").toString());
            });
            if (localStorage.getItem(setting.storage) === "true") {
                check.classList.add("on");
            }
            line.append(check);
        }
        if (setting.description) {
            const help = document.createElement("div");
            help.classList.add("help");
            help.innerText = "?";
            const description = document.createElement("p");
            description.innerText = setting.description;
            help.addEventListener("click", () => {
                description.style.display = description.style.display === "none" ? "block" : "none";
            });
            document.body.addEventListener("click", e => {
                if (e.target !== help) {
                    description.style.display = "none";
                }
            })
            description.style.display = "none";
            help.append(description);
            line.append(help);
        }
        el.append(line);

        if (setting.type === "select") {
            const line = document.createElement("div");
            const select = document.createElement("select");
            for (let option in setting.options) {
                option = setting.options[option];
                const optionEl = document.createElement("option");
                optionEl.innerText = option.name;
                optionEl.value = option.value;
                select.append(optionEl);
            }
            select.value = localStorage.getItem(setting.storage);
            select.addEventListener("change", () => {
                localStorage.setItem(setting.storage, select.value);
            });
            line.append(select);

            el.append(line);
        }
        else if (setting.type === "text") {
            const line = document.createElement("div");
            line.classList.add("line");
            const input = document.createElement("input");
            input.type = "text";
            input.value = localStorage.getItem(setting.storage);
            input.addEventListener("input", () => {
                if (setting.file) return;
                localStorage.setItem(setting.storage, input.value);
            });
            line.append(input);
            input.classList.add("text");
            if (setting.file) {
                input.type = "file";
                input.addEventListener("change", e => {
                    if (!input.files) return;

                    localStorage.setItem(setting.storage, "upload");
                    getBase64(input.files[0]).then(async data => {
                        await chrome.storage.local.set({
                            [setting.storage]: data
                        })
                        input.value = null;
                    })
                })
                const reset = document.createElement("button");
                reset.innerText = "Reset";
                reset.addEventListener("click", async () => {
                    await chrome.storage.local.set({[setting.storage]: "default"});
                })
                reset.classList.add("text", "btn");
                line.append(reset);
            }

            el.append(line);
        }
        else if (setting.type === "info") {
            const line = document.createElement("div");
            const info = document.createElement("p");
            info.innerHTML = setting.text;
            line.append(info);
            info.classList.add("info");

            el.append(line);
        }
        settings.append(el);
    }
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}