# Groundwork — development build

Groundwork is a static progressive web app for a rugby league athlete. It includes a weekly planner, starter workout templates, exercise-by-exercise session logging (sets, reps and optional load), technique cues with YouTube demonstration search links for every exercise, progress summaries, manual fixture entry with editable results, editable team training nights and local JSON backup/restore.

## Run on a laptop

1. Extract the ZIP.
2. Open a terminal in this folder.
3. Run `python -m http.server 8000`.
4. Visit `http://localhost:8000`.

For iPhone use, publish the folder to a free HTTPS static host, open its address in Safari while online, then use Share → Add to Home Screen. On iPhone, enable “Open as Web App” if that option appears. Keep the app open briefly on the first visit so its service worker can cache the complete app shell. Then test it by enabling Airplane Mode and opening Groundwork from the Home Screen. HTTPS is required for installation and service-worker caching.

The hosting address serves only the app's static files. Groundwork does not send athlete records to that host: profile, workouts and fixtures are stored in localStorage on the iPhone. The app shell and training records work offline after the first successful load and cache. Exercise demonstration links open YouTube and therefore require an internet connection. Updates require internet access. Browser/device storage can still be cleared by iOS, so use Profile → Export backup and save the JSON file somewhere safe (for example, On My iPhone in Files).

## Current planning defaults

- Off-season (October–January): three gym templates plus optional recovery.
- Pre-season (February–March): two gym sessions, one optional light primer/recovery session; Monday and Wednesday team training are provisional.
- In-season (April–September): one main strength session plus an optional short, light primer when the match schedule allows. Saturday is the usual match day; Friday-night games are supported, and Sunday remains available as an alternate.
- Team training nights default to Monday and Wednesday, based on the previous season, and can be edited in Profile.
- Actual fixture dates override the usual match day in that week. Friday fixtures trigger pre-game recovery on Thursday and post-game recovery on Saturday; Saturday fixtures protect Friday for rest. Fixtures can be entered manually. Automatic Play Rugby League fixture syncing is not implemented; it depends on the 2027 competition data being published and technically accessible.

## Data

All profile, workout and fixture data is stored in this browser's localStorage. There is no account, cloud sync or automatic backup. Use Profile → Export backup regularly. Import accepts a Groundwork JSON backup.

## Safety and scope

This app is an organiser and basic tracker, not a medically or individually prescribed training program. The exercise templates are conservative examples and require review by a qualified youth strength and conditioning coach before use. Sessions for a 16-year-old should be supervised, technique-led, progressed gradually and adjusted for soreness, fatigue, growth and match load. The optional in-season primer should be skipped if tired, sore or advised otherwise by the coach. Do not train through pain. The app does not prescribe weights, max lifts or training to failure.

## Testing

Run `node --check app.js` to check JavaScript syntax and `node test.js` for the included logic checks. These are code-level checks, not a substitute for manual browser, iPhone, accessibility or coach testing.


## Off-season weekly plan

- Tuesday: gym lower-body strength
- Wednesday: park speed, agility and rugby fitness (cones, 12-step ground agility ladder, football and available 200m+ grass space)
- Thursday: gym upper-body strength
- Friday: gym full-body strength and power

The park session includes a warm-up, ladder footwork, short accelerations, controlled running efforts, football carries, cone changes of direction and a cooldown. The athlete should use a level appropriate to current ability, keep repetitions technically sound, and have gym exercise selection and resistance checked by a qualified youth strength and conditioning coach. Do not train through pain or fatigue that changes technique.


## Exercise demonstrations

Selected exercise demonstrations play in an in-app video window using YouTube's privacy-enhanced embed player. Video playback needs an internet connection and is not cached for offline use. The app shell and personal training records remain local to the device. Some less common movements do not yet have a curated in-app demonstration. If a video owner blocks embedding or a video is unavailable in your region, playback may not work; close the player and use the written exercise cues or ask a qualified coach.
