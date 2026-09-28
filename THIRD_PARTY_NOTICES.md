# Third-party notices

## Echo Music

- Project: [Echo Music](https://github.com/EchoMusicApp/Echo-Music)
- Source revision used: `cefa51f64b244bb7eb91d4008012d5ca8315ec3c`
- License: GNU General Public License version 3
- Original copyright: Echo Music contributors
- Adaptation date: 2026-09-28

The Android application shell is derived from Echo Music. The following areas were copied or closely adapted and then reworked for the Karnataka Ration Card e-KYC workflow:

- pinned `TopAppBarScrollBehavior` from `ui/utils/AppBar.kt`;
- dynamic Material theme structure from `ui/theme/Theme.kt`;
- app-bar dimensions from `core/.../Dimensions.kt`;
- `Scaffold`, `WindowInsets.systemBars`, `WindowInsets.displayCutout`, and edge-to-edge activity structure from `MainActivity.kt`.

All music playback, provider, database, account, recognition, artwork, and Echo Music branding code was removed. Modified source files identify their origin and modification date. This combined application is distributed under GPLv3; the complete corresponding source and build workflow are included in the repository.
