# Spring Hill Advising Planner

1. Unzip this package and commit its contents to your GitHub repository, with index.html at the repository root.
2. In Settings → Pages, select Deploy from a branch, choose main and /(root), and save.
3. Open the published Pages URL and select an adviser profile. The planner loads the included program catalog and offerings from the repository.

To move existing plans, use **Back up all students** in the current planner and restore the downloaded backup from **Settings & backups** on the new site. The GitHub site has its own browser storage.

Keep student audits, plans, and backups outside the repository. The repository contains the app and curriculum data. Adviser profiles organize local plans on the device. Access to the published app follows your GitHub Pages settings.

For local testing, serve this folder with `python -m http.server 8000` and open http://localhost:8000.
