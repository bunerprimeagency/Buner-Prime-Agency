# Buner Prime Agency website

Open `index.html` in a browser, or upload the folder to a static host such as Netlify.

## Files
- `index.html`: page structure
- `css/style.css`: styling
- `js/script.js`: content lists, rendering, animations, contact details
- `js/db.js`: database and admin panel (Supabase)
- `js/demo.js`: demo data used only until real keys are added
- `database/schema.sql`: tables, access rules, starter data
- `images/`: logo, `team/` photos, `portfolio/` images

## Contact details
Defaults are at the top of `js/script.js` (`CONTACT`). With the database on, the owner changes them from the Admin panel and they update everywhere (Contact section, footer and all WhatsApp buttons).

## Two admin accounts
The agency owner (CEO) and the developer each get their own login, with the same access. Both can change contact details, add services, team members, courses and portfolio projects, upload photos, and read inquiries.

## Try the admin panel first
Open the site and press **Admin login** in the footer. Until real keys are added the panel runs in demo mode (only the developer email, password `demo`; a banner says so): you can try every tab, but nothing is saved. Demo mode works when the page is opened from your own phone or computer (a local file), and stays off on a real website address.

## Turn on the database and admin
1. Create a free project at supabase.com.
2. Authentication > Users: add two users (owner email and developer email). In Authentication settings turn off public sign-ups.
3. SQL editor: paste and run `database/schema.sql`. Then run the last two lines of that file (remove the `--`) with the two emails.
4. Settings > API: copy the project URL and anon key to the top of `js/db.js`.
5. Open `index.html#admin` (or yourdomain.com/#admin), press the Admin button and sign in.

## Photos
Without the database: put team photos in `images/team/` named like `kamran-khan.jpg`, and portfolio images in `images/portfolio/`. With the database: the developer uploads photos from the Admin panel (they are resized automatically and stored in Supabase).

## Portfolio
Add a project from the Admin panel (title, service, optional link), then upload its image in the Photos tab. Without the database, add a line in `js/script.js`: `{s:"Graphic Design", t:"Project name", i:"images/portfolio/p1.jpg", l:"https://link"},`.

## Modern Admin Suite & Features
The Admin Panel has been modernized into a sleek suite with:
- **Branded Design**: Glassmorphic dark theme with BPA brand accents (`#B6FF3C` neon lime and `#0A1530` navy).
- **Password Eye Toggle**: Easily show or hide password while typing.
- **Quick Metric Counters**: Live dashboard stats for active Services, Team Members, Portfolio showcases, and Client Inquiries.
- **Live Image Previews**: When choosing photos for team members or portfolio works, an instant thumbnail preview displays before upload.
- **Interactive Inquiries Stream**: Read contact form submissions with client avatar badges and 1-click **"Reply on WhatsApp"** direct links.

## Forgot Password & Password Reset Setup
If an admin ever forgets their password:
1. Click **"Forgot password?"** on the Admin sign-in screen.
2. Enter the registered admin email and click **"Send New Password to My Email"**.
3. A secure new temporary password is automatically generated and dispatched directly to the admin's email inbox.
4. For quick testing in Demo Mode, a 1-click **"Auto-fill & Sign In Now"** button is also displayed with copy-to-clipboard functionality.
5. Once logged in, administrators can update their password anytime under the **Security & Password** tab.

## Not included yet
Editing and deleting existing items from the panel (use the Supabase dashboard for that).
