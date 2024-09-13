# AniDB-File-Filter

I wrote this script to learn JS basics. It's pretty messy but it gets the job done. It filters the 'files' table on AniDB's episode pages. The script works by scanning through the language and codec icon's hover texts and saves unique values. Then it simply adds the hide class to any file that doesn't have the selected parameters.

It can filter by Chapters, one Audio track (Language, Codec, Channels), one Subtitle Track (Language, Codec, Type), and the Video Track (Extension, Length, Codec, Width, Height, Bit-Depth, Source).

# Changelog
1.0

Initial Release

1.1

Added 'Length' filter to 'Video'.

Reworked video filter to be more efficient (Also fixes odd line marking).

Change 'Presentation Graphic Stream' to 'PGS' to save space.

1.2

Replaced "Type" subs filter with checkboxes for supplementary tracks (Signs & Songs) and Hard Subs.

Fixed a bug with "extension" video filter.

# Screenshots
![Filters](https://files.catbox.moe/58toat.png)

![Audio Filters](https://files.catbox.moe/xlqf94.png)

# Installation

You will need to install [TamperMonkey](https://www.tampermonkey.net/) or some similar browser extension. Then simply install the script using the extension.
