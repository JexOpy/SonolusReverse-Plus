# SonolusReverse TODO

Mostly for developers and me, so I don't forgetting things.

### Architecture

- [ ] Il2Cpp Array short-hand
    - DRY
- [ ] Alert Sonolus System
    - You can see what I'm talking about when auto-exit is configured

### Features

- [ ] Monet theme on Android
    - very pain with Java, we **CANNOT** use frida-java-bridge, so there's Unity Java API.  
      I only managed to get a main color, so we can generate others using math
- [ ] Spoof themes and Vip without account (offline)
- [ ] Fix Theme button
    - Hook action from other settings tab  
      We had this in the past, you can see commits before global refactor
- [ ] Disable Background picture
- [ ] UwUify across all Sonolus
    - We can do this simply hook function related to I18n and UwUify the string  
      https://github.com/UntitledCharts/uc-sonoserver/blob/734097db2111ddfb2a5c1b3985d6ce7b3e637251/helpers/owoify.py  
      Licensed under GPL-3.0 tho, so we can take this
- [ ] Export / Import Sonolus Settings
- [ ] Export / Import Sonolus Account Info
- [ ] Alert if speed modified or autofail turned on (use notification popup (like auto-exit TIP))
    - Use Alert (notification) Sonolus Popup
- [ ] Sonolus_UI_Title\_\_GetTitleTheme (`0x28173C4`) maybe something do with that
    - Like, use certain theme on Title or remove it at all

### Fixes

- [ ] Set arrow button lower in Settings menu
    - Currently other button hover arrow button
- [ ] Tests?
    - We can do interactive tests, but I don't think we need this actually

### Some day idk

- [ ] Disable Analytics
    - There's a lot of .so files with some sort of analytics stuff
    - And java...
- [ ] Information about your recent plays on map (by replays)
    - Search your all replays in local database and show information about you best play on certain chart
- [ ] Auto saving replay - I tried to auto clicking these buttons, but it's game just crashed
      also some todos by searching `TODO` in project files
