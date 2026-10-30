// All site content lives here. Edit text in this file; pages render from it.

export const person = {
  name: "Richard Alexander",
  role: "Design engineer",
  email: "richalex00@outlook.com",
  linkedin: "https://www.linkedin.com/in/richalex00",
  github: "https://github.com/richalex00",
  cv: "/Richard_Alexander_CV.pdf",
  headline: "I design what I build",
  subline: "HCI master's student at KTH, with engineering experience at IBM, General Motors and Ericsson.",
  // Homepage text, top to bottom
  intro: [
    "I'm a design engineer from Ireland. I've written production software at IBM, General Motors and Ericsson.",
    "I'm now doing an MSc in Human-Computer Interaction at KTH in Stockholm.",
  ],
  games: "I studied computer games development. It's why I like things you can poke, and interfaces that explain themselves without a manual.",
  lifting: "Away from the screen, I lift.",
  hobbies: ["Tinkering with electronics", "Daily-driving Fedora Linux", "Board games", "Sport", "Travel and the outdoors"],
};

export type Shot = { src: string; alt: string; caption?: string; wide?: boolean; poster?: string }; // poster = src is a video
export type Section = { heading: string; body: string[]; shots?: Shot[] };
export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  kind: string; // what the project is, for the browser tab: "StuddyBuddy, AI study planner"
  year: string;
  place: string;
  role: string;
  tools: string;
  cover: Shot;
  fan: string; // image used on the fanned card
  intro: string;
  sections: Section[];
  links?: { label: string; href: string }[];
  demo?: { href: string; label: string; note: string }; // opens in a window over the case study
  tile?: { src: string; bg: string; animated?: boolean }; // homepage tile image shown whole on a solid colour, instead of the cover; animated = live logo component
  tileVideo?: { src: string; poster: string; bg: string }; // homepage tile animation, played on hover
  tileAnim?: "skull" | "room" | "jelly"; // homepage tile is a live component: the Galleon skull, the pixel room or the pixel jellyfish
};

// Order = priority. First is the lead in the grid and the top card in the fan.
export const projects: Project[] = [
  {
    slug: "studdybuddy",
    title: "StuddyBuddy",
    subtitle: "An AI study planner that asks before it acts",
    kind: "AI study planner",
    year: "2025–2026",
    place: "Enschede and Stockholm",
    role: "Founder, product design, front end",
    tools: "React, TypeScript, Supabase, Cloudflare, Figma",
    cover: { src: "/img/studdybuddy/dashboard-2026.jpg", alt: "StuddyBuddy dashboard: today's study path, focus and XP stats, an AI suggestion and upcoming deadlines" },
    fan: "/img/studdybuddy/dashboard-2026.jpg",
    tile: { src: "/img/studdybuddy/logo.png", bg: "#F5FAF4", animated: true },
    demo: {
      href: "/studdybuddy-demo/",
      label: "Try the live demo",
      note: "In this demo, AI replies are scripted and your changes reset when you reload.",
    },
    links: [{ label: "Read the Business Development Lab report (PDF)", href: "/papers/studdybuddy-business-report.pdf" }],
    intro:
      "Students can see their deadlines, but not when to start. StuddyBuddy connects to Canvas, plans the week with AI and gives every course its own tutor. It started as a course project at the University of Twente and became a startup through Novel-T's Entrepreneurial Experience.",
    sections: [
      {
        heading: "From course project to startup",
        body: [
          "It began in the University of Twente's Business Development Lab under the working name SchedulAI. My course team and I interviewed students, tested the concept and built a first financial model. That work is in the report linked above.",
          "After the course I took it into Novel-T's Entrepreneurial Experience with two other UTwente students and a prototype we'd built over a hackathon weekend. As founder I led the team and the pitch. Together we shaped the business model and pitched to investors at the finals.",
        ],
        shots: [
          { src: "/img/studdybuddy/novelt-certificate.jpg", alt: "Richard shaking hands on stage as he receives his Entrepreneurial Experience certificate", caption: "Getting my certificate at the Novel-T finals, 17 June 2026." },
          { src: "/img/studdybuddy/novelt-finals.jpg", alt: "Teams from the Entrepreneurial Experience on stage at the finals, holding the award cheques, with gold confetti on the floor", caption: "All the teams on stage at the finals." },
        ],
      },
      {
        heading: "Building with AI",
        body: [
          "The first prototype came together on Lovable. After the programme I moved it to React and Supabase on Cloudflare, working with Claude Code, connected it to real Canvas and timetable data, and demoed it at the KTH Lovable Buildathon in Stockholm on 1 September 2026. I set the design and interaction rules and review every change.",
          "I keep the model away from anything that has to be exact. It says what to schedule and roughly when, and a tested scheduler in plain code places each block around lectures, personal plans and the student's sleep hours. A proposal can't clash with a class or land at 3am.",
        ],
        shots: [{ src: "/img/studdybuddy/building.jpg", alt: "Richard in headphones, typing on a laptop at a crowded table", caption: "Heads down on StuddyBuddy at the KTH Lovable Buildathon, 1 September 2026." }],
      },
      {
        heading: "Designing for trust",
        body: [
          "Letting an AI rewrite your calendar only works if you trust it, so I redesigned the two places where students act on its suggestions. These were the starting points: a dashboard card with just yes or dismiss, and a planner with one Accept or Reject for the whole batch, where liking four changes out of five meant taking all five or none.",
        ],
        shots: [
          { src: "/img/studdybuddy/before-suggestion.png", alt: "Dark suggestion card with Yes, plan it and Dismiss buttons", caption: "Before: one suggestion, yes or dismiss." },
          { src: "/img/studdybuddy/before-proposal.png", alt: "Proposed changes card listing three study blocks with a single Reject and Accept", caption: "Before: one Accept or Reject for every change at once." },
        ],
      },
      {
        heading: "What students told us",
        body: [
          "We ran 7 interviews and 3 observational studies with students, then 10 more interviews to test the concept.",
          "Two findings shaped the design. Our hypothesis that AI time estimates would reduce stress was not supported. Most students distrusted them, and wanted to keep control or have the AI learn from them over time. And again and again, students said they wanted less to think about but to stay in charge of their own schedule.",
          "So the AI only ever suggests changes, and the student approves each one.",
        ],
      },
      {
        heading: "Preview first, act inline",
        body: [
          "The AI's plan now appears on the calendar itself, as dashed ghost blocks in the free slots around lectures. Each block is accepted or skipped on its own. When the AI wants to move or remove something already there, it explains why in the chat beside it.",
        ],
        shots: [
          { src: "/img/studdybuddy/flow-2-choose.jpg", alt: "Week calendar with dashed ghost study blocks, one marked skipped, and a bar reading 2 of 3 selected", caption: "1. The AI drafts the week as ghost blocks. Tap one to skip it. Nothing is saved until you add the rest.", wide: true },
          { src: "/img/studdybuddy/flow-3-added.jpg", alt: "The calendar with the two accepted study blocks now solid", caption: "2. Only the ticked blocks land on the calendar.", wide: true },
        ],
      },
      {
        heading: "Next: group scheduling",
        body: [
          "6 of the 10 students we interviewed called group scheduling a real problem. The next feature shows when a team is free as a heatmap and suggests meeting times to vote on. In the demo it runs on sample teammates.",
        ],
        shots: [
          { src: "/img/studdybuddy/groups-concept.jpg", alt: "Heatmap of a team's free hours across the week, with suggested meeting times outlined and a vote list", caption: "Concept: who's free this week, with suggested times outlined.", wide: true },
        ],
      },
    ],
  },
  {
    slug: "vigil",
    title: "Vigil",
    subtitle: "A product passport that keeps itself up to date",
    kind: "product passport startup",
    year: "2026",
    place: "EIT Digital Summer School, Bari",
    role: "Team venture: brand, pitch, product. Then a solo build of the demo",
    tools: "Figma, business modelling, Python, Claude API, React, TypeScript",
    cover: { src: "/img/vigil/slide-02.jpg", alt: "Vigil title slide with the growth-ring mark" },
    fan: "/img/vigil/icon.png",
    tileVideo: { src: "/img/vigil/mark.mp4", poster: "/img/vigil/mark-end.jpg", bg: "#111F1B" },
    demo: {
      href: "/vigil-demo/",
      label: "Try the live demo",
      note: "Replays real AI output from real battery datasheets. Your decisions reset when you reload, and the Life tab uses simulated data.",
    },
    links: [
      { label: "See the pitch deck (PDF)", href: "/papers/vigil-pitch-deck.pdf" },
      { label: "Source on GitHub", href: "https://github.com/richalex00/vigil" },
    ],
    intro:
      "A two-week venture sprint at the Polytechnic University of Bari, from problem framing to Pitch Day in front of an industry and investor jury. The EU is making a Digital Product Passport mandatory, and Vigil helps companies earn from it instead of treating it as a cost.",
    sections: [
      {
        heading: "Where it is now",
        body: [
          "I kept building Vigil on my own after the summer school. In October 2026 that took me to the Builder Cohort at Claude Founder House in Stockholm, where I built an agent in a day that makes Vigil's checker more accurate.",
        ],
        shots: [{ src: "/img/vigil/founder-house.jpg", alt: "Richard standing in front of an orange wall with the sign Claude Founder House Stockholm", caption: "At Claude Founder House in Stockholm, October 2026." }],
      },
      {
        heading: "The idea",
        body: [
          "Every electronic device sold in the EU will need a Digital Product Passport, a record of what it's made of, where it came from and how to repair and recycle it. Vigil keeps that passport current over the device's life. AI fills data gaps and drafts supplier requests, and verified lifecycle data opens up value in the second-hand market.",
        ],
        shots: [
          { src: "/img/vigil/slide-03.jpg", alt: "Problem slide", caption: "The problem." },
          { src: "/img/vigil/slide-05.jpg", alt: "Solution slide with two products", caption: "One platform, two products." },
        ],
      },
      {
        heading: "The brand",
        body: [
          "The logo is a set of growth rings, like a slice through a tree trunk, standing for the record of a device's life. The gap where the rings are cut is the verified checkpoint.",
        ],
      },
      {
        heading: "Building the demo",
        body: [
          "After Bari I set out to test the pitch's core claim: that AI can fill most of a passport from documents that already exist. I started with batteries, whose passport becomes law in February 2027.",
          "Pick a real datasheet and watch the AI pull out 25 passport fields. Plain code checks each value against the exact line it came from, so hovering a field lights up its source, and anything it can't confirm comes to you. The growth rings from the logo fill as you decide, and when they close, the passport prints.",
          "Anything the checker can't confirm goes to a person, because a wrong value can still arrive with a convincing quote.",
        ],
        shots: [
          { src: "/img/vigil/demo-review.jpg", alt: "The demo's review screen: datasheet text on the left with one line highlighted, growth rings in the middle, fields to check on the right", caption: "Checking a field: its source line lights up, and the rings fill as you decide.", wide: true },
          { src: "/img/vigil/demo-passport.jpg", alt: "The printed passport: fields grouped by cluster, each tagged self-declared, verified, estimated or derived", caption: "The printed passport, with where every value came from.", wide: true },
        ],
      },
      {
        heading: "Tuning the checker",
        body: [
          "At Founder House I built an agent that improves the checker on its own. Each round it reads the checker's mistakes, changes one rule, runs the tests and re-scores. It keeps the change only if fewer correct values go to a person without any wrong ones getting through, and otherwise undoes it. It practised on 5 datasheets and was scored once at the end on the 21 it had never seen.",
          "On those 21 it sent fewer correct values to a person for no reason, without letting any wrong ones through. The main cause it fixed was PDFs breaking table cells and sentences across lines, so the value sat just past the quoted line.",
        ],
      },
    ],
  },
  {
    slug: "map-generator",
    title: "2D map generator",
    subtitle: "Procedural islands from noise and cellular automata",
    kind: "procedural generation thesis",
    year: "2023",
    place: "University of Limerick, BSc thesis (A1)",
    role: "Solo project",
    tools: "Unity, C#, Perlin noise, cellular automata",
    cover: { src: "/img/mapgen/cover.png", alt: "Close-up of a generated map: grassy islands with forests, rock fields and an inland lake, surrounded by sea" },
    fan: "/img/mapgen/cover.png",
    tileVideo: { src: "/img/mapgen/generate.mp4", poster: "/img/mapgen/generate-end.png", bg: "#2e86c1" },
    demo: {
      href: "/mapgen-demo/",
      label: "Try the generator",
      note: "A web port of the Unity tool: the same algorithm, tiles and controls. Drag a slider and the same map reshapes, press Space for a new one, or play through the five stages of generation.",
    },
    links: [
      { label: "Read the thesis (PDF)", href: "/papers/map-generator-thesis.pdf" },
      { label: "Source on GitHub", href: "https://github.com/richalex00/Procedural-Content-Generation" },
    ],
    intro:
      "My final-year project: a Unity tool that generates layered 2D terrain. It combines Perlin noise, cellular automata and flood fill, with live controls for map size, saturation, variation and minimum island size, plus saving and loading. It was graded A1.",
    sections: [
      {
        heading: "How it works",
        body: [
          "Noise sets the base terrain, cellular automata smooth it into natural coastlines, and flood fill finds and removes islands below a minimum size. Objects like trees and rocks are then placed in layers on top. A 10,000-word research survey of procedural generation methods set the algorithm choices.",
        ],
        shots: [
          { src: "/img/mapgen/stage-1.png", alt: "Scattered single tiles of land and water", caption: "1. Every tile starts as random land or water." },
          { src: "/img/mapgen/stage-2.png", alt: "The same area smoothed into islands with a lagoon", caption: "2. Cellular automata smooth the noise into coastlines." },
          { src: "/img/mapgen/stage-3.png", alt: "The same islands with patches of rocky ground", caption: "3. A rock layer grows inland, and flood fill clears up tiny islands and lakes." },
          { src: "/img/mapgen/stage-4.png", alt: "The same islands covered in trees and bushes, with rocks in the sea", caption: "4. Trees, bushes and sea rocks are placed on their layers." },
        ],
      },
      {
        heading: "At scale",
        body: [
          "The generator can also tile a grid of maps. Each one gets its own variation roll, so a 2×2 grid reads as four different regions rather than one repeated pattern.",
        ],
        shots: [
          { src: "/img/mapgen/grid.jpg", alt: "A large map made of four regions with different amounts of land", caption: "A 2×2 grid of 48×48 maps.", wide: true },
        ],
      },
    ],
  },
  {
    slug: "softy",
    title: "Softy",
    subtitle: "A jellyfish that only calms down when you put your phone to bed",
    kind: "interactive installation",
    year: "2026",
    place: "KTH, Physical Interaction Design and Realisation. Exhibited 20 October 2026",
    role: "Team project: concept, electronics, firmware, phone app and build",
    tools: "Arduino, servo, air pump, LED strip, soft inflatables, Android app, 3D printing",
    cover: { src: "/img/softy/cover.jpg", alt: "Softy, a jellyfish made of fabric and inflatable tentacles, glowing violet as she calms in a dark box" },
    fan: "/img/softy/cover.jpg",
    tileAnim: "jelly",
    intro:
      "Softy is a jellyfish who lives in a dark box next to a phone that never stops scrolling. Lift the curtain and she's red, shaking and panting. Put the phone face down, or tuck it into its little bed, and she slowly calms: the light fades to blue, her breathing slows and the shaking turns into a sway. Pick the phone up again and it all starts over.",
    sections: [
      {
        heading: "At the exhibition",
        body: [
          "Visitors found the bed on their own. Most picked the phone up first, watched Softy get worse, and worked out the rest from her.",
        ],
        shots: [
          { src: "/img/softy/exhibition.mp4", poster: "/img/softy/exhibition-poster.jpg", alt: "Handheld walkthrough of the installation: the sign outside, the phone and bed inside, Softy turning from red to blue", caption: "A walkthrough on the day.", wide: true },
          { src: "/img/softy/sign.jpg", alt: "A chalkboard sign reading Meet Softy beside the fabric-covered box", caption: "Outside the box." },
          { src: "/img/softy/bed.jpg", alt: "The phone beside its knitted blanket and printed bed inside the box", caption: "Inside: the phone and its bed." },
        ],
      },
      {
        heading: "The phone is the only control",
        body: [
          "There are no buttons and no instructions. We set ourselves one rule: nothing in the box tells you what to do. The phone plays an endless feed of real short-form clips, Softy reacts to it, and the bed beside it, with a pillow and a blanket, is the only hint.",
          "Once a visitor picks the phone up, the feed starts to drift: a viral clip cuts to a nature montage, then calm nature, then now and then someone telling you to stop scrolling. Put it down and Softy takes a breath. Leave it face up and she gets worse.",
        ],
        shots: [
          { src: "/img/softy/film.mp4", poster: "/img/softy/film-poster.jpg", alt: "Short film introducing Softy: her habitat, her distress at a scrolling phone, and how she calms", caption: "The film we made for the exhibition.", wide: true },
        ],
      },
      {
        heading: "One number drives her whole body",
        body: [
          "The phone measures how agitated Softy should be as a mood from 0 to 100, and sends it five times a second over Wi-Fi to an Arduino above the box, along with events like pickup and putdown. Every output reads the same number, so her light, motion, breathing and voice always agree. If the phone goes quiet for three seconds, she falls back to agitated on her own.",
          "Her servo, pump and lights all follow that number. The servo shakes her harder as the mood rises, sways her slowly when calm, and jolts her when the phone is picked up. An air pump inflates her soft tentacles: quick pants when she panics, ten-second breaths when calm, a gasp on every event. The inflatable was measured first (48 bubbles, about 220 mL) so the breaths could be timed to it. An LED strip flickers an angry red and settles into a slow blue wave. The servo and pump run off their own 5 V supply, sharing a ground with the Arduino, which handles only the logic and Wi-Fi.",
        ],
        shots: [
          { src: "/img/softy/angry.jpg", alt: "Softy lit red and orange, tentacles blurred from shaking", caption: "Phone face up: red, shaking, panting." },
          { src: "/img/softy/calm.jpg", alt: "Softy lit a calm blue, hanging still", caption: "Phone put to bed: blue, slow breaths." },
        ],
      },
    ],
  },
  {
    slug: "lactation-rooms",
    title: "Lactation rooms",
    subtitle: "Letting parents set the light and sound in a workplace lactation room",
    kind: "human-centred design project",
    year: "2026",
    place: "University of Twente, Enschede",
    role: "Team project: research, concept, prototype",
    tools: "Interviews, thematic analysis, Figma, Wizard of Oz",
    cover: { src: "/img/lactation/room.jpg", alt: "The prototype set up in the lactation room with a tablet, lamp and wall display" },
    fan: "/img/lactation/tablet-hand.jpg",
    tileAnim: "room",
    links: [{ label: "Read the full report (PDF)", href: "/papers/lactation-rooms-report.pdf" }],
    intro:
      "Workplace lactation rooms usually meet the legal minimum and nothing more. We researched what parents need from these rooms. Most of it came down to feeling safe, unhurried and in control.",
    sections: [
      {
        heading: "Research",
        body: [
          "We interviewed lactating parents and used thematic analysis to arrive at seven themes. We started out thinking the rooms lacked equipment. The interviews showed the bigger gap was emotional and organisational support for care work.",
          "From that we wrote ten design requirements, from a lock that tells others the room is in use to ambient presets you can set from the chair.",
        ],
      },
      {
        heading: "Before and after",
        body: [
          "We wrote the same scenario twice. Emily, a parent back at work, pumps in the room as it is, then in the room we wanted to build. The first storyboard marks every moment she hesitates, cleans up after someone else or feels exposed. The second takes those moments away one at a time, starting at the door.",
        ],
        shots: [
          { src: "/img/lactation/scenario-before.jpg", alt: "Six-panel storyboard of a mother in the current room: entering, finding it messy, unsure where to sit, pumping next to a noisy coffee machine, packing, cleaning up", caption: "Before: the room as it is. Storyboard frames generated with AI.", wide: true },
          { src: "/img/lactation/scenario-after.jpg", alt: "Six-panel storyboard of the improved room: harsh light, a wall tablet with Lights, Visuals and Sound, choosing a Tropical Relax mood, then pumping calmly surrounded by ocean screens", caption: "After: one tap on the wall tablet makes the room calm.", wide: true },
        ],
      },
      {
        heading: "From paper to the real room",
        body: [
          "We started on paper, with a sketch of the room and a paper prototype of the presets. Then we built an ambient personalisation system: a tablet interface designed in Figma that controls lighting, sound and wall visuals. We staged it in the actual lactation room and tested it Wizard-of-Oz style with six participants, using think-aloud and a follow-up survey.",
        ],
        shots: [
          { src: "/img/lactation/sketch.jpg", alt: "Pencil sketch of the lactation room layout", caption: "Early sketch of the room layout." },
          { src: "/img/lactation/paper.jpg", alt: "Paper prototype with a welcome screen of presets, a Light card and two paper speakers", caption: "Paper prototype: presets on a welcome screen, with paper speakers and a light card standing in for the room." },
          { src: "/img/lactation/ui.jpg", alt: "Tablet interface with ambience presets", caption: "The tablet interface, with presets for light, sound and visuals." },
          { src: "/img/lactation/tablet-hand.jpg", alt: "A hand using the tablet in the room", caption: "Testing in the room." },
          { src: "/img/lactation/room-2.jpg", alt: "The room set up for evaluation", caption: "The evaluation setup.", wide: true },
        ],
      },
      {
        heading: "What we learned",
        body: [
          "People mostly stuck to the presets. They didn't want to fine-tune anything, just tap once and get a setting they knew. Knowing the room was booked mattered as much as anything inside it. The report closes with the social and ethical implications of designing for people outside the team's own experience.",
        ],
      },
    ],
  },
  {
    slug: "galleon",
    title: "Pelle's Reflex Galleon",
    subtitle: "A pirate reflex game that runs itself",
    kind: "interactive installation",
    year: "2026",
    place: "University of Twente, demoed at a Dutch amusement park",
    role: "Team project: concept, mechanism, electronics, build and character",
    tools: "Arduino, servos, 3D printing, laser cutting, woodwork, ElevenLabs, projection",
    cover: { src: "/img/galleon/ship.jpg", alt: "The finished Pelle's Reflex Galleon: a wooden ship under a Reflex Galjoen sail, with Pelle projected beside it" },
    fan: "/img/galleon/logo-tile.jpg",
    tileAnim: "skull",
    intro:
      "An interactive installation that needs no operator. A projected cartoon pirate, Pelle, draws people in and talks them through the game. Treasure drops at random, players catch what they can, and raising the ship's flag hauls the missed treasure back out of the water and resets the game for the next person.",
    sections: [
      {
        heading: "The loop",
        body: [
          "Pick a difficulty on the compass and ring the bell. The music shifts and objects start falling. Catches go into the laser-cut ridges at the front, misses splash into the water below. When the round ends, Pelle tells you to raise the flag. Pulling the rope ends the round and resets the game.",
        ],
      },
      {
        heading: "Building the ship",
        body: [
          "We started with a Wizard-of-Oz version, then built the real thing. The ship is a wooden frame we cut, screwed and nailed together ourselves. It has a hand-painted sail, a net, portholes and a water reservoir under the deck for missed treasure. A laser-cut holder along the front catches the bottles, and pirate props finish the set.",
        ],
        shots: [
          { src: "/img/galleon/demo-2.jpg", alt: "An earlier version with hanging strings in front of a black curtain", caption: "Where it started: the Wizard-of-Oz version, before the mechanism was built.", wide: true },
          { src: "/img/galleon/logo.jpg", alt: "Pelle's Reflex Galjoen pirate logo", caption: "The logo, later painted onto the sail." },
        ],
      },
      {
        heading: "The mechanism",
        body: [
          "Under the mast, an Arduino drives a row of servos that hold the treasure bottles and let them go at random moments, so each round is different. 3D-printed gears on a wooden shaft wind the treasure back up when the flag is raised.",
        ],
        shots: [
          { src: "/img/galleon/bottles.jpg", alt: "Treasure bottles filled with sand and beads hanging from a row of servo-driven hooks", caption: "The treasure: bottles on servo hooks, released one at a time." },
          { src: "/img/galleon/gears.jpg", alt: "Underside of the mast with 3D-printed gears on a wooden shaft and a box of wiring", caption: "Under the mast: the geared shaft and the electronics." },
        ],
      },
      {
        heading: "Pelle runs the game",
        body: [
          "A round starts with a real ship's bell: a microphone listens for the ring and kicks off the game. From there Pelle runs everything. He's an animated cartoon pirate projected beside the ship, with a custom voice made in ElevenLabs. He calls people over, explains the compass and the bell, and tells them to raise the flag at the end. There's no instruction screen.",
        ],
      },
    ],
  },
];

export type Job = { logo: string; title: string; company: string; dates: string; place: string; bullets: string[]; tags: string[] };

export const experience: Job[] = [
  {
    logo: "/logos/ibm-logo.svg",
    title: "Full-stack Developer", company: "IBM", dates: "Apr 2025 – Sep 2025", place: "Cork",
    bullets: [
      "Diagnosed and fixed enterprise customer integrations on IBM API Connect, IBM's API management platform.",
      "Took on the webMethods integration work after IBM acquired Software AG's API products.",
      "Worked across the whole stack, from React to PostgreSQL, on Kubernetes and OpenShift deployments.",
    ],
    tags: ["Node.js", "React", "PostgreSQL", "GraphQL", "Kubernetes", "OpenShift"],
  },
  {
    logo: "/logos/general-motors-logo.svg",
    title: "Software Developer", company: "General Motors", dates: "Feb 2024 – Apr 2025", place: "Limerick",
    bullets: [
      "Modernised and maintained production mainframe systems.",
      "Shipped changes through Azure DevOps CI/CD pipelines.",
      "Qualified through GM's intensive 8-month mainframe engineering programme.",
    ],
    tags: ["COBOL", "JCL", "REXX", "PL/I", "Azure DevOps", "Git"],
  },
  {
    logo: "/logos/ericsson-logo.svg",
    title: "Software Engineer", company: "Ericsson", dates: "Jan 2022 – Aug 2022", place: "Athlone",
    bullets: [
      "Set up and ran microservices on Linux in an agile team.",
      "Deployed with Docker and Kubernetes, with code review in Gerrit.",
    ],
    tags: ["Docker", "Kubernetes", "Linux", "JavaScript", "Gerrit"],
  },
  {
    logo: "/logos/ul-logo.svg",
    title: "Teaching Assistant", company: "University of Limerick", dates: "Sep 2020 – Jun 2021", place: "Limerick",
    bullets: [
      "Led weekly peer-learning groups for first-year Java students through the lockdowns.",
      "Taught web design, Java and Processing to secondary-school students at UL Cybercamps.",
    ],
    tags: ["Java", "HTML/CSS", "Processing"],
  },
];

export type School = { logo: string; degree: string; school: string; dates: string; place: string; note: string };

export const education: School[] = [
  {
    logo: "/logos/kth-logo.svg",
    degree: "MSc Human-Computer Interaction and Design", school: "KTH Royal Institute of Technology", dates: "2026 – 2027", place: "Stockholm",
    note: "EIT Digital double degree, second year. Minor in Innovation and Entrepreneurship. Full scholarship.",
  },
  {
    logo: "/logos/logo-ut.svg",
    degree: "MSc Interaction Technology", school: "University of Twente", dates: "2025 – 2026", place: "Enschede",
    note: "EIT Digital double degree, first year.",
  },
  {
    logo: "/logos/ul-logo.svg",
    degree: "BSc Computer Games Development", school: "University of Limerick", dates: "2019 – 2023", place: "Limerick",
    note: "Thesis graded A1. President's Volunteer Award, 2020/21.",
  },
];
