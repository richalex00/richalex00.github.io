// All site content lives here. Edit text in this file; pages render from it.

export const person = {
  name: "Richard Alexander",
  role: "Design engineer",
  email: "richalex00@outlook.com",
  linkedin: "https://www.linkedin.com/in/richalex00",
  github: "https://github.com/richalex00",
  cv: "/Richard_Alexander_CV.pdf",
  headline: "I design what I build",
  subline: "HCI designer at KTH, with engineering experience at IBM, General Motors and Ericsson.",
  // Homepage text, top to bottom
  intro: [
    "I'm a design engineer from Ireland. I've written production software at IBM, General Motors and Ericsson.",
    "I'm now doing an MSc in Human-Computer Interaction at KTH in Stockholm.",
  ],
  games: "I studied computer games development, and it still shows. I like things you can poke, and I like interfaces that explain themselves without a manual.",
  lifting: "Away from the screen, I lift. I think of it as design in a much slower material.",
  hobbies: ["Tinkering with electronics", "Daily-driving Fedora Linux", "Board games", "Sport", "Travel and the outdoors"],
};

export type Shot = { src: string; alt: string; caption?: string; wide?: boolean };
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
  tileAnim?: "skull" | "room"; // homepage tile is a live component: the Galleon skull or the pixel room
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
      note: "StuddyBuddy isn't running publicly at the moment, because keeping the AI hosted costs more than it's worth between rounds of testing. In this demo, AI replies are scripted and your changes reset when you reload.",
    },
    links: [{ label: "Read the Business Development Lab report (PDF)", href: "/papers/studdybuddy-business-report.pdf" }],
    intro:
      "Students can see their deadlines, but not when to start. StuddyBuddy connects to Canvas, plans the week with AI and gives every course its own tutor. It started as a course project in the University of Twente's Business Development Lab. I carried it into Novel-T's Entrepreneurial Experience, pitched it to investors, and kept going after the programme ended.",
    sections: [
      {
        heading: "From course project to startup",
        body: [
          "StuddyBuddy began in the Business Development Lab at the University of Twente, under the working name SchedulAI. With my course team I interviewed students, tested the concept and built a first financial model. That work is in the report linked above.",
          "When the course ended, I took the idea into Novel-T's Entrepreneurial Experience: three UTwente students, a problem we lived every week, and a working prototype built over one hackathon weekend.",
          "As founder I set the vision and carried the pitch. We framed the problem, shaped a business model and pitched it to investors at the end of the programme.",
          "When the programme finished, I kept going. I moved the prototype onto a stack I control, connected it to real Canvas and timetable data, and demoed it at the KTH Lovable Buildathon in Stockholm on 1 September 2026.",
        ],
        shots: [{ src: "/img/studdybuddy/novelt-finals.jpg", alt: "Teams from the Entrepreneurial Experience on stage at the finals, holding the award cheques, with gold confetti on the floor", caption: "With the other teams at the finals of the first Entrepreneurial Experience, 17 June 2026.", wide: true }],
      },
      {
        heading: "The trust problem",
        body: [
          "Canvas tells students what's due, never when to start. StuddyBuddy's answer is an AI that plans the week, but an AI rewriting your calendar is a trust problem before it's a UI problem.",
          "The first version asked for blind trust in two places. The dashboard offered one suggestion at a time, with a yes-or-dismiss choice and no reason given. The planner listed its changes with a single Accept or Reject for the whole batch, so a student who liked four changes out of five had to take all five or none.",
        ],
        shots: [
          { src: "/img/studdybuddy/before-suggestion.png", alt: "Dark suggestion card with Yes, plan it and Dismiss buttons", caption: "Before: one suggestion, yes or dismiss." },
          { src: "/img/studdybuddy/before-proposal.png", alt: "Proposed changes card listing three study blocks with a single Reject and Accept", caption: "Before: one Accept or Reject for every change at once." },
        ],
      },
      {
        heading: "What students told us",
        body: [
          "In the Business Development Lab, my course team and I ran 7 interviews and 3 observational studies with students, then 10 more interviews to test the concept.",
          "Two findings shaped the design. Our hypothesis that AI time estimates would reduce stress was not supported: most students distrusted them, and wanted to keep control or have the AI learn from them over time. And across the interviews the same point kept coming back: the product should take away mental effort, not take over the schedule.",
          "That became the rule for the product. The AI proposes, the student decides.",
        ],
      },
      {
        heading: "Preview first, act inline",
        body: [
          "Instead of a list to approve, the AI's plan appears on the calendar itself, as dashed ghost blocks in the free slots around lectures. Each block is its own decision, made in place. When the AI wants to move or remove something already on the calendar, it explains why in the chat beside it.",
        ],
        shots: [
          { src: "/img/studdybuddy/flow-1-preview.jpg", alt: "Week calendar with three dashed ghost study blocks, and a bar reading 3 of 3 proposed slots selected", caption: "1. Asked to plan the week, the AI drafts three study blocks as ghosts. Nothing is saved yet.", wide: true },
          { src: "/img/studdybuddy/flow-2-choose.jpg", alt: "The same calendar with one ghost block marked skipped, and the bar reading 2 of 3 selected", caption: "2. Tap a ghost to skip it. The bar keeps count, so accepting is no longer all-or-nothing.", wide: true },
          { src: "/img/studdybuddy/flow-3-added.jpg", alt: "The calendar with the two accepted study blocks now solid", caption: "3. Only the ticked blocks land on the calendar.", wide: true },
        ],
      },
      {
        heading: "Building with AI",
        body: [
          "AI runs through the product: the planner drafts the week, and every course gets its own tutor that answers from that course's Canvas material.",
          "It's also how I build. The first prototype came together on Lovable; I then moved it to React and Supabase on Cloudflare, working with Claude Code. I set the design and interaction rules and review every change before it ships.",
          "Using AI well also means knowing where not to trust it. Early versions left the language model to choose the times, with the rules written only into its prompt. I moved slot-finding into plain, tested code: the model now says what to schedule and roughly when, and the scheduler places each block around lectures, personal plans and the student's sleep hours. A proposal can't clash with a class or land at 3am, whatever the model asks for.",
        ],
        shots: [{ src: "/img/studdybuddy/building.jpg", alt: "Richard in headphones, typing on a laptop at a crowded table", caption: "Heads down on StuddyBuddy at the KTH Lovable Buildathon, 1 September 2026." }],
      },
      {
        heading: "Next: group scheduling",
        body: [
          "Group scheduling was the other pain point students confirmed, with 6 of 10 calling it a real problem. The next piece shows when a team is free as a heatmap and suggests meeting times to vote on. It's a concept for now: in the demo it runs on sample teammates.",
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
    subtitle: "A living record for every device in Europe",
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
      note: "Real output from real battery datasheets, replayed. The AI ran offline beforehand, so nothing here calls an AI, and your decisions reset when you reload. The Life tab is a concept with simulated data.",
    },
    links: [{ label: "See the pitch deck (PDF)", href: "/papers/vigil-pitch-deck.pdf" }],
    intro:
      "A two-week venture sprint at the Polytechnic University of Bari, from problem framing to Pitch Day in front of an industry and investor jury. Vigil turns the EU's mandatory Digital Product Passport from a compliance cost into a source of revenue.",
    sections: [
      {
        heading: "The idea",
        body: [
          "Every electronic device sold in the EU will need a Digital Product Passport. Vigil builds it as a living record: AI fills data gaps and drafts supplier requests, and verified lifecycle data opens up value in the second-hand market.",
        ],
        shots: [
          { src: "/img/vigil/slide-03.jpg", alt: "Problem slide", caption: "The problem." },
          { src: "/img/vigil/slide-05.jpg", alt: "Solution slide with two products", caption: "One platform, two products." },
        ],
      },
      {
        heading: "The brand",
        body: [
          "Our first identity read like a video-game emblem, so I rebuilt it around a different idea: the record of a device's life. The mark is a set of growth rings, cut at one point like a single slice through a trunk. That shared gap is the one verified checkpoint. I tested three ring treatments in Figma and kept the cleanest.",
        ],
        shots: [{ src: "/img/vigil/slide-11.jpg", alt: "Revenue streams slide", caption: "Three-tier pricing from the pitch.", wide: true }],
      },
      {
        heading: "After the summer school",
        body: [
          "After Bari I kept going on my own, to test the pitch's core claim: that AI can fill most of a passport from documents that already exist. I started with batteries, whose passport becomes law in February 2027.",
          "Pick a real datasheet and watch the AI pull out 25 passport fields. Plain code checks each value against the exact line it came from, so hovering a field lights up its source, and anything it can't confirm comes to you. The growth rings from the logo fill as you decide, and when they close, the passport prints.",
          "Tested on 21 datasheets it had never seen, 98% of the fields it accepted were correct, and it made up nothing.",
        ],
        shots: [
          { src: "/img/vigil/demo-review.jpg", alt: "The demo's review screen: datasheet text on the left with one line highlighted, growth rings in the middle, fields to check on the right", caption: "Checking a field: its source line lights up, and the rings fill as you decide.", wide: true },
          { src: "/img/vigil/demo-passport.jpg", alt: "The printed passport: fields grouped by cluster, each tagged self-declared, verified, estimated or derived", caption: "The printed passport, with where every value came from.", wide: true },
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
    slug: "lactation-rooms",
    title: "Lactation rooms",
    subtitle: "Calm, personal control in a room built for care",
    kind: "human-centred design project",
    year: "2026",
    place: "University of Twente, Enschede (8/10)",
    role: "Team project: research, concept, prototype",
    tools: "Interviews, thematic analysis, Figma, Wizard of Oz",
    cover: { src: "/img/lactation/room.jpg", alt: "The prototype set up in the lactation room with a tablet, lamp and wall display" },
    fan: "/img/lactation/tablet-hand.jpg",
    tileAnim: "room",
    links: [{ label: "Read the full report (PDF)", href: "/papers/lactation-rooms-report.pdf" }],
    intro:
      "Workplace lactation rooms usually meet the legal minimum and nothing more. We set out to understand what parents actually need from them, and found the problem was less about furniture and more about feeling safe, unhurried and in control.",
    sections: [
      {
        heading: "Research",
        body: [
          "We interviewed lactating parents and used thematic analysis to arrive at seven themes. The biggest shift was in how we framed the problem: from missing infrastructure to a lack of emotional and organisational support for care work.",
          "From that we wrote ten design requirements, from a lock that tells others the room is in use to ambient presets you can set from the chair.",
        ],
        shots: [
          { src: "/img/lactation/sketch.jpg", alt: "Pencil sketch of the lactation room layout", caption: "Early sketch of the room layout." },
          { src: "/img/lactation/paper.jpg", alt: "Paper prototype with a welcome screen of presets, a Light card and two paper speakers", caption: "Paper prototype: presets on a welcome screen, with paper speakers and a light card standing in for the room." },
        ],
      },
      {
        heading: "Before and after",
        body: [
          "We wrote the same scenario twice. Emily, a parent back at work, pumps in the room as it is, then in the room we wanted to build. The first storyboard marks every moment she hesitates, cleans up after someone else or feels exposed. The second takes those moments away one at a time, starting at the door.",
        ],
        shots: [
          { src: "/img/lactation/scenario-before.jpg", alt: "Six-panel storyboard of a mother in the current room: entering, finding it messy, unsure where to sit, pumping next to a noisy coffee machine, packing, cleaning up", caption: "Before: the room as it is. Storyboard frames generated with AI.", wide: true },
          { src: "/img/lactation/scenario-after.jpg", alt: "Six-panel storyboard of the improved room: harsh light, a wall tablet with Lights, Visuals and Sound, choosing a Tropical Relax mood, then pumping calmly surrounded by ocean screens", caption: "After: one tap on the wall tablet turns a harsh room calm. Also AI-generated.", wide: true },
        ],
      },
      {
        heading: "Prototype in the real room",
        body: [
          "We built an ambient personalisation system: a tablet interface designed in Figma that controls lighting, sound and wall visuals. We staged it in the actual lactation room and tested it Wizard-of-Oz style with six participants, using think-aloud and a follow-up survey.",
        ],
        shots: [
          { src: "/img/lactation/ui.jpg", alt: "Tablet interface with ambience presets", caption: "The tablet interface, with presets for light, sound and visuals." },
          { src: "/img/lactation/tablet-hand.jpg", alt: "A hand using the tablet in the room", caption: "Testing in the room." },
          { src: "/img/lactation/room-2.jpg", alt: "The room set up for evaluation", caption: "The evaluation setup.", wide: true },
        ],
      },
      {
        heading: "What we learned",
        body: [
          "Presets worked as anchors: people did not want to fine-tune, they wanted one tap to a known state. Knowing the room was booked mattered as much as anything inside it. The report closes with the social and ethical implications of designing for a group none of us belonged to.",
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
    place: "University of Twente, demoed at a Dutch amusement park (8.2/10)",
    role: "Team project",
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
          "Pick a difficulty on the compass and ring the bell. The music shifts and objects start falling. Catches go into the laser-cut ridges at the front, misses splash into the water below. When the round ends, Pelle tells you to raise the flag, and that one rope pull is both the finale and the reset.",
        ],
        shots: [
          { src: "/img/galleon/bottles.jpg", alt: "Treasure bottles filled with sand and beads hanging from a row of servo-driven hooks", caption: "The treasure: bottles on servo hooks, released one at a time." },
          { src: "/img/galleon/gears.jpg", alt: "Underside of the mast with 3D-printed gears on a wooden shaft and a box of wiring", caption: "Under the mast: the geared shaft and the electronics." },
          { src: "/img/galleon/demo-2.jpg", alt: "An earlier version with hanging strings in front of a black curtain", caption: "Where it started: the Wizard-of-Oz version, before the mechanism was built.", wide: true },
        ],
      },
      {
        heading: "How it was made",
        body: [
          "The ship is a wooden frame we cut, screwed and nailed together ourselves. It has a hand-painted sail, a net, portholes and a water reservoir under the deck for missed treasure. A laser-cut holder along the front catches the bottles, and a pile of pirate props does the rest of the dressing.",
          "Under the mast, an Arduino drives a row of servos that hold the treasure bottles and let them go at random moments, so no two rounds play the same. 3D-printed gears on a wooden shaft wind the treasure back up when the flag is raised.",
          "A round starts with a real ship's bell: a microphone listens for the ring and kicks off the game. From there Pelle runs everything. He's an animated cartoon pirate projected beside the ship, with a custom voice made in ElevenLabs. He calls people over, explains the compass and the bell, and tells them to raise the flag at the end. There is no screen of instructions; the voice is the interface.",
        ],
        shots: [{ src: "/img/galleon/logo.jpg", alt: "Pelle's Reflex Galjoen pirate logo", caption: "The logo, later painted onto the sail." }],
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
      "Resolved customer integration issues on IBM API Connect, IBM's API management platform.",
      "Handled the webMethods integration work that followed IBM's acquisition of Software AG's API products.",
      "Worked across the whole stack, from React to PostgreSQL, on Kubernetes and OpenShift deployments.",
    ],
    tags: ["Node.js", "React", "PostgreSQL", "GraphQL", "Kubernetes", "OpenShift"],
  },
  {
    logo: "/logos/general-motors-logo.svg",
    title: "Software Developer", company: "General Motors", dates: "Feb 2024 – Apr 2025", place: "Limerick",
    bullets: [
      "Completed an intensive 8-month training and assessment programme in mainframe technologies.",
      "Maintained and modernised legacy production systems.",
      "Shipped through Azure DevOps pipelines in a team workflow.",
    ],
    tags: ["COBOL", "JCL", "REXX", "PL/I", "Azure DevOps", "Git"],
  },
  {
    logo: "/logos/ericsson-logo.svg",
    title: "Software Engineer", company: "Ericsson", dates: "Jan 2022 – Aug 2022", place: "Athlone",
    bullets: [
      "Set up and maintained microservices on Linux in an agile team.",
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
