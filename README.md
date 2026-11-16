# FootballLineup

A lightweight, browser-based tool for planning football team line-ups and managing match-day substitutions. The app is a single HTML file with no build step or external dependencies.

## Screenshots

### Pitch and match management

![Match view showing the pitch, substitutes, playing-time report, substitution plan, and log](screenshots/match-lineup.png)

### Squad and warm-up

![Squad view showing player availability, preferred positions, and the warm-up routine](screenshots/squad-warmup.png)

Screenshots use fictional sample players and team data.

## Getting started

1. Clone or download this repository.
2. Serve the repository over `localhost` or HTTPS. For example:

   ```sh
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000` in your browser.
4. On first launch, create an administrator account. The password must be at least eight characters.

## Using the app

- **Set up a squad:** Add one or more players, mark their preferred positions, and set player availability in the **Squad** tab.
- **Arrange a line-up:** Choose a team format and formation. Drag players between pitch positions or the bench, or select a player and then a destination to swap them.
- **Manage a match:** Start the match clock to track playing time. Enter the match length to see a playing-time report and an automatic, equal-time substitution plan. Set an individual bench player's planned entry time if needed.
- **Plan a warm-up:** Add timed exercises, mark them complete, and reorder the routine.
- **Track match events:** Tap ⚽ under a player to log a goal (with an Undo toast), or ⋯ for labelled Goal / Assist / Amazing play / Great save buttons. Log opposition goals, see the score and a match timeline strip, and use **Undo** or delete timeline entries to correct mistakes. A bar on each player shows minutes played.
- **Match bar and tools:** The score, clock, big Start/Pause button and a "Next sub in" countdown stay pinned at the top. Sub plan, playing time, timeline, sharing, finish and reset live in **Match tools**. Pick a team colour in **Team settings** (⚙︎) to theme the app and share cards.
- **Periods and alerts:** Choose halves, thirds or quarters and end each period from the clock card (the clock pauses). Planned subs show a one-tap **Make sub** card, and the app vibrates and beeps when a sub is due. The screen stays awake while the clock runs where the browser supports it.
- **Season stats:** **Finish match & save to season** stores the result and each player's minutes and events; the **Season** tab totals them.
- **Share:** Share a result card, a line-up image, line-up text or a match summary using the device share sheet (falls back to saving or copying).
- **Install:** Host the files over HTTPS and use *Add to Home Screen* to install the app and use it offline.
- **Save and share:** Save line-ups in the browser, optionally set a default line-up, and import or export saved plans as JSON. Export the current or a saved line-up as a PDF.
- **Manage accounts:** An administrator can create users, reset passwords, and remove accounts from the Admin panel.

## Data and privacy

Line-ups, saved plans, account records, and match history are stored in the browser's local storage; session information is stored in browser storage as well. Data is local to that browser and origin and is not synchronized to a server. Export plans regularly if you need a backup or want to move them to another browser.
