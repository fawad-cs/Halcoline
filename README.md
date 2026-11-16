# HALOCLINE

A cinematic descent through five strata of a bioluminescent ocean.
React + Vite, Three.js (R3F), Motion, Lenis, React Router.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build
    npm run preview    # http://localhost:4173

## Edit content (no component changes needed)
- Dives, depths, colours ......... src/data/dives.js
- Experience chapters ............ src/data/experiences.js
- About / timeline / numbers ..... src/data/timeline.js
- Showcase specimens ............. src/data/specimens.js
- Menu, email, social links ...... src/data/navigation.js, socials.js, contact.js

## Contact form
Validated on the client. To really send mail, set ENDPOINT in
src/utils/submitContact.js (for example a Formspree URL). While it is empty the
form runs in demo mode and says so on the success screen.

## Deploy
Any static host. Single-page-app routing needs a fallback to index.html
(public/_redirects for Netlify is included; use vercel.json on Vercel).

## Performance notes
- One persistent WebGL canvas; stratum layers hide themselves outside their band.
- The two small canvases (specimens, sonar map) render only while on screen.
- Rendering pauses when the tab is hidden.
- Particle counts and DPR scale with device tier (src/hooks/useDeviceTier.js).