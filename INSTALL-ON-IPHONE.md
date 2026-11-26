# Install Groundwork on an iPhone

## One-time publishing step

Groundwork is a static web app. For free hosting with GitHub Pages, the app files must be placed in a **public GitHub repository**. This means the app's code and web page are publicly accessible. Do not put personal training records, backups, names, or other private information in that repository.

1. Sign in to GitHub or create a free account.
2. Create a new repository, for example `groundwork-app`, and set it to **Public**.
3. Upload the contents of this folder to the repository's top level. `index.html` must be at the top level, not inside another folder.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`, then save.
7. Wait for GitHub Pages to publish. The Pages screen will show the website address.

GitHub's official instructions: https://docs.github.com/en/pages/quickstart

## Add it to the iPhone

1. On the iPhone, connect to the internet and open the published HTTPS address in **Safari** (not an in-app browser).
2. Wait for the Groundwork screen to finish loading. Leave it open for a short time so the offline files can be cached.
3. Tap Safari's **Share** button.
4. Choose **Add to Home Screen**.
5. If shown, turn on **Open as Web App**, then tap **Add**.
6. Open Groundwork from the new Home Screen icon while still online once, then test it by turning on Airplane Mode and reopening it.

## Privacy and offline use

- Profile, workout logs, weights, fixtures and notes are stored in this browser's local storage on the iPhone.
- The app contains no account, cloud database, analytics or automatic sync.
- The public host serves only the app's static code and files. It does not receive the athlete's training records.
- Internet is needed for the initial visit/install and for future app updates. After the app shell has been cached, the app is designed to open and work offline.
- iOS can clear website data in some circumstances. In Groundwork, use **Profile → Export backup** regularly and save the JSON backup in the iPhone Files app. Use **Import backup** to restore it.

## Important

This is an installable Home Screen web app (PWA), not an App Store application. It has not yet been tested on the target iPhone. After installing, test opening it in Airplane Mode and make a backup before entering substantial training history.
