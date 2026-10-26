# Philosophy Quiz Website — GitHub Pages

This package turns your 10-page Philosophy PDF into a scrolling mobile-friendly website.

## Files
- `index.html` — page layout and quiz content
- `style.css` — mobile-friendly styling
- `script.js` — saves answers in the browser and compiles a clean answer PDF
- `pages/` — the ten page backgrounds exported from your original PDF

## Publish on GitHub Pages
1. Create a **public** GitHub repository.
2. Upload **all contents of this folder** (not just the ZIP) into the repository root.
3. Commit the files.
4. Open **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**.
6. Select branch `main` and folder `/(root)`, then Save.
7. Wait for publishing, then open the URL GitHub shows you. It will usually look like `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## MIT App Inventor
Add a WebViewer and set its `HomeUrl` to the published GitHub Pages URL.

## Notes
- Answer text fields are on the five answer pages and have a green outline.
- Answers are stored locally in the browser on that device. They are not sent to a server. Browser storage can be cleared by the user or device.
- The PDF download uses jsPDF from jsDelivr, so the device needs an internet connection for that library to load.
- The downloaded PDF is a clean compilation: each original question followed by the typed answer. It does not reproduce the worksheet backgrounds.
