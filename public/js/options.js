const categories = [
    {
        "name": "General",
        "settings": [
            {
                "name": "Clock type",
                "type": "select",
                "options": [
                    {
                        "name": "24 hour",
                        "value": "24"
                    },
                    {
                        "name": "12 hour",
                        "value": "12"
                    }
                ],
                "storage": "clockType"
            },
            {
                "name": "Search engine",
                "description": "Search engine url, use %s for search query e.g. https://www.google.com/search?q=%s",
                "type": "text",
                "storage": "searchEngine"
            },
            {
                "name": "Text",
                "description": "Text to display bellow the clock",
                "type": "text",
                "storage": "text"
            },
            {
                "name": "Wallpaper",
                "type": "background",
                "file": true,
                "storage": "background"
            }
        ]
    },
    {
        "name": "Info dashboard",
        "settings": [
            {
                "name": "Info dashboard",
                "description": "Displays the info dashboard",
                "type": "check",
                "storage": "info",
            },
            {
                "name": "Name",
                "description": "Your name",
                "type": "text",
                "storage": "name"
            },
            {
                "name": "Weather",
                "description": "Turn on weather",
                "type": "check",
                "storage": "weather"
            },
            {
                "name": "Location",
                "description": "The city you want weather info for",
                "type": "text",
                "storage": "location"
            }
        ]
    },
    {
        "name": "Integrations",
        "settings": [
            {
                "name": "Spotify integration",
                "description": "Display currently playing songs and artworks on the info dashboard",
                "type": "check",
                "storage": "spotify"
            },
            {
                "name": "YouTube integration",
                "description": "Display currently playing videos on the info dashboard",
                "type": "check",
                "storage": "youtube"
            },
            {
                "name": "Lyrics",
                "description": "Display lyrics from spotify on the info dashboard when turned on in Spotify",
                "type": "check",
                "storage": "lyrics"
            }
        ]
    },
    {
        "name": "Additional features",
        "settings": [
            {
                "name": "Bookmarks",
                "description": "Displays the bookmarks on the bottom left",
                "type": "check",
                "storage": "bookmarks"
            },
            {
                "name": "Audios",
                "description": "Displays the tabs playing audio on the bottom right",
                "type": "check",
                "storage": "audios"
            },
            {
                "name": "Battery",
                "description": "Displays the battery percentage on the bottom left",
                "type": "check",
                "storage": "battery"
            }
        ]
    },
    {
        "name": "About",
        "settings": [
            {
                "name": "",
                "type": "info",
                "text": "<b>Version</b><br>HeadTab 2.0<br><b>Creator</b><br>sverben<br><b>Default wallpaper</b><br>Photo by <a href=\"https://unsplash.com/@danielleone?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText\">Daniel Leone</a> on <a href=\"https://unsplash.com/collections/4474938/new-tab-backgrounds?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText\">Unsplash</a>"
            }
        ]
    }
]