# AniDB-File-Filter

I wrote this script to learn JS basics. It's pretty messy but it gets the job done. It filters the 'files' table on AniDB's episode pages. The script works by scanning through the language and codec icon's hover texts and saves unique values. Then it simply adds the hide class to any file that doesn't have the selected parameters.

It can filter by Chapters, one Audio track (Language, Codec, Channels), one Subtitle Track (Language, Codec, Type), and the Video Track (Extension, Codec, Width, Height, Bit-Depth, Source).

![Filters](https://files.catbox.moe/58toat.png)

![Audio Filters](https://files.catbox.moe/xlqf94.png)

# Installation

You will need to install [TamperMonkey](https://www.tampermonkey.net/) or some similar browser extension. Then simply install the script using the extension.
