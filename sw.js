const setBackground = async (img, tab) => {
    fetch(`https://api.sverben.nl/safeImage?url=${img}`)
        .then(res => res.blob())
        .then(async blob => {
            const imageBitmap = await createImageBitmap(blob);
            const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageBitmap, 0, 0);

            const fr = new FileReader();
            fr.onload =
                function(e) {
                    chrome.storage.local.set({"background": e.target.result});
                }
            fr.readAsDataURL(await canvas.convertToBlob());
        });
}

chrome.contextMenus.create({
    title: "Set Background",
    contexts: ["image"],
    id: "setBackground"
})
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "setBackground") {
        await setBackground(info.srcUrl, tab);
    }
})