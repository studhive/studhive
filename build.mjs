import { mkdir, writeFile, cp, rm } from "node:fs/promises";
import config from "./site.config.mjs";

const esc = (s = "") =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.7"/></svg>';
const external =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.7"/></svg>';
const icons = {
  civic:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
  innovation:
    '<path d="M9 18h6m-5 3h4m-6-7a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z"/>',
  policy: '<path d="M4 20h16M6 20V10m6 10V10m6 10V10M3 7l9-5 9 5v3H3V7Z"/>',
  book: '<path d="M12 5v16M3 3c4-1 7 0 9 2 2-2 5-3 9-2v16c-4-1-7 0-9 2-2-2-5-3-9-2V3Z"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a18 18 0 0 1 0 20 18 18 0 0 1 0-20Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  speech: '<path d="M21 3H3v14h5v5l6-5h7V3Z"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter" aria-hidden="true">${icons[name] || icons.book}</svg>`;
const link = (href, label, cls = "text-link") =>
  `<a class="${cls}" href="${esc(href)}">${label}${arrow}</a>`;
const label = (text) =>
  `<p class="eyebrow"><span aria-hidden="true">⬢</span> ${text}</p>`;
const image = (key, cls = "", alt = "") =>
  config.photos[key]
    ? `<figure class="media ${cls}"><img src="${esc(config.photos[key])}" alt="${esc(alt)}" loading="lazy"></figure>`
    : `<div class="media-placeholder ${key} ${cls}" role="img" aria-label="${esc(alt || "Programme photography placeholder")}"><div class="placeholder-art" aria-hidden="true">${icon(key === "dialogue" ? "speech" : key === "career" ? "book" : "civic")}<span>${key === "dialogue" ? "Ideas into dialogue." : key === "career" ? "Dream beyond the classroom." : "Lead where you are."}</span></div><span class="photo-note">Programme photo placeholder</span></div>`;
const programmes = [
  {
    slug: "ambassador-fellowship",
    category: "civic innovation",
    key: "fellowship",
    name: "Studhive Ambassador Fellowship",
    short: "A campus voice. A community builder.",
    tag: "Civic leadership",
    type: "Virtual fellowship",
    description:
      "Represent Studhive on your campus, mobilise your peers, and turn ideas into social impact projects in your community.",
    audience: "Undergraduate and postgraduate students",
    format: "100% virtual fellowship, followed by community projects",
    focus: "Civic leadership & development innovation",
  },
  {
    slug: "nigeria-education-dialogue",
    category: "policy",
    key: "dialogue",
    name: "Nigeria Education Dialogue",
    short: "Students belong in the conversation.",
    tag: "Policy & advocacy",
    type: "Dialogue & ideas",
    description:
      "Bringing students and stakeholders together to ask important questions and explore the future of education in Nigeria.",
    audience:
      "Students, journalists, development leaders, industry experts and legal professionals",
    format: "Education dialogue",
    focus: "Policy & advocacy",
  },
  {
    slug: "career-sensitization",
    category: "civic",
    key: "career",
    name: "Studhive Career Sensitization Program",
    short: "Big dreams need clear direction.",
    tag: "Education & opportunity",
    type: "School outreach",
    description:
      "Helping secondary school students discover their potential, explore career pathways, and make informed decisions about their future.",
    audience: "Secondary school students",
    format: "Educational outreach",
    focus: "Career guidance & education",
  },
];
const values = [
  [
    "Radical Ownership",
    "Don’t wait for somebody. Take the lead. We act with the conviction that our community’s success depends on each of us.",
  ],
  [
    "Integrity",
    "We lead with character and honesty. The talent we nurture should be as trustworthy as it is capable.",
  ],
  [
    "Inclusivity",
    "The person who changes the world can come from anywhere. Every background and every voice belongs in the Hive.",
  ],
  [
    "Innovation",
    "We question the way things have always been done and turn systemic obstacles into practical opportunities.",
  ],
  [
    "Collaboration",
    "We build bridges with institutions and communities, working together for change that lasts.",
  ],
  [
    "Unity",
    "When one member acts, they carry the support of the whole Hive. We move forward together.",
  ],
];
const stories = [
  {
    href: "ned-2025.html",
    category: "dialogue",
    key: "dialogue",
    tag: "NED 2025 · Programme recap",
    title: "A seat at the table. A voice in education.",
    description:
      "Inside the first Nigeria Education Dialogue and its conversation about students’ role in education transformation.",
  },
  {
    href: "ambassador-fellowship.html",
    category: "spotlight",
    key: "fellowship",
    tag: "Programme spotlight",
    title: "From campus leadership to community action.",
    description:
      "Discover the fellowship that asks young leaders to move beyond awareness and build practical solutions.",
  },
  {
    href: "career-sensitization.html",
    category: "spotlight",
    key: "career",
    tag: "Programme spotlight",
    title: "Beyond the classroom. Into possibility.",
    description:
      "How career guidance helps students connect what they learn today to the futures they imagine.",
  },
];
function brand(dark = false) {
  const src = dark ? config.logo.reversed : config.logo.primary;
  return `<a href="index.html" class="brand" title="Studhive home">${src ? `<img class="brand-image" src="${esc(src)}" alt="Studhive">` : '<span class="brand-text">Studhive<span class="brand-caption">Logo placeholder</span></span>'}</a>`;
}
function header(active) {
  const nav = [
    ["about", "Who we are", "about.html"],
    ["programmes", "Our programmes", "programmes.html"],
    ["stories", "Stories & updates", "stories.html"],
    ["contact", "Contact", "contact.html"],
  ];
  return `<a class="skip-link" href="#main">Skip to content</a><div class="announcement"><div class="container"><span>A youth-led hive. A future we build together.</span><a href="about.html">Meet Studhive <span aria-hidden="true">↗</span></a></div></div><header class="site-header"><div class="container nav-wrap">${brand()}<button class="menu-toggle" aria-controls="primary-nav" aria-expanded="false"><span>Menu</span><span class="menu-icon" aria-hidden="true"></span></button><nav id="primary-nav" aria-label="Main navigation">${nav.map(([key, name, href]) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${name}</a>`).join("")}${link("get-involved.html", "Join the Hive", "button button-honey nav-cta")}</nav></div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-main"><div class="footer-about">${brand(true)}<p>Pollinating education champions.</p><p class="footer-description">Students’ Hive is a youth-led organisation transforming education through civic leadership, development innovation, and policy and advocacy.</p><span class="footer-hashtag">#JoinTheHive</span></div><div><h2>Explore the Hive</h2><a href="about.html">Who we are</a><a href="programmes.html">Our programmes</a><a href="stories.html">Stories & updates</a><a href="get-involved.html">Get involved</a></div><div><h2>Let’s connect</h2><a href="contact.html">Contact Studhive ${external}</a><a href="contact.html?interest=partnership">Partner with us ${external}</a><div class="social-links">${
    Object.entries(config.contact.social)
      .filter(([, url]) => url)
      .map(
        ([name, url]) =>
          `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ${external}</a>`,
      )
      .join("") ||
    '<span class="pending-detail">Social links coming soon</span>'
  }</div></div></div><div class="footer-bottom"><p>© ${new Date().getFullYear()} Students’ Hive. All rights reserved.</p><a href="privacy.html">Privacy & accessibility</a><span>Built cell by cell.</span></div></div></footer><dialog id="application-dialog" class="application-dialog" aria-labelledby="dialog-title"><button class="dialog-close" aria-label="Close application information">×</button>${label("Join the Hive")}<h2 id="dialog-title">Your next chapter starts here.</h2><p>The Studhive Ambassador Fellowship is designed for undergraduate and postgraduate students ready to lead on campus and in their communities.</p><div class="notice"><strong>Application details coming soon</strong><p>The official application link, dates and eligibility details will be added here once confirmed. Applications cannot be submitted through this preview.</p></div>${link("ambassador-fellowship.html", "Explore the fellowship", "button button-ink")}</dialog>`;
}
const cta = () =>
  `<section class="join-banner"><div class="container join-inner"><div>${label("There’s room for you in the Hive")}<h2>Don’t wait for somebody.<br><span>Be the somebody.</span></h2></div>${link("get-involved.html", "Join the Hive", "button button-honey")}</div></section>`;
function programmeCard(p) {
  return `<article class="programme-card" data-category="${p.category}"><a class="card-media-link" href="${p.slug}.html" tabindex="-1" aria-hidden="true">${image(p.key, "", `${p.name} photo placeholder`)}</a><div class="card-content"><p class="card-tag">${p.tag}</p><h3><a href="${p.slug}.html">${p.name}</a></h3><p>${p.description}</p>${link(`${p.slug}.html`, "Explore programme")}</div></article>`;
}
function storyCard(s) {
  return `<article class="story-card" data-category="${s.category}"><a class="card-media-link" href="${s.href}" tabindex="-1" aria-hidden="true">${image(s.key, "", `${s.title} photo placeholder`)}</a><p class="card-tag">${s.tag}</p><h3><a href="${s.href}">${s.title}</a></h3><p>${s.description}</p>${link(s.href, s.category === "dialogue" ? "Read the recap" : "Explore the programme")}</article>`;
}
function pageHero(kicker, title, copy, extra = "") {
  return `<section class="page-hero"><div class="container">${label(kicker)}<h1>${title}</h1><p class="hero-lead">${copy}</p>${extra}</div><div class="page-hero-cell" aria-hidden="true"></div></section>`;
}
function home() {
  return `<section class="hero"><div class="container hero-grid"><div class="hero-copy">${label("Students’ Hive · Youth-led. Action-driven.")}<h1>Education changes<br>when students<br><span class="underline">take the lead.</span></h1><p>We’re building a hive of young leaders who turn ideas into action—and help shape the future of education.</p><div class="hero-actions">${link("get-involved.html", "Join the Hive", "button button-honey")}${link("programmes.html", "Explore our work", "button button-outline")}</div><div class="hero-footnote"><span class="mini-cell" aria-hidden="true"></span><span>Pollinating education champions.<br><strong>One campus. One community. Together.</strong></span></div></div><figure class="hero-visual">${config.photos.hero ? `<img src="${esc(config.photos.hero)}" alt="Studhive students collaborating on a community project" fetchpriority="high">` : '<img src="assets/community.svg" alt="Illustrative placeholder: young people collaborating around a table" fetchpriority="high">'}<div class="hero-stamp"><span aria-hidden="true">↗</span><strong>No bystanders.<br>Only builders.</strong></div>${config.photos.hero ? "" : "<figcaption>Illustration placeholder · Your programme photos go here</figcaption>"}</figure></div></section><div class="belief-strip"><div class="container"><span>Student voices.</span><i aria-hidden="true">⬢</i><span>Bold ideas.</span><i aria-hidden="true">⬢</i><span>Collective action.</span><i aria-hidden="true">⬢</i><span>Better education.</span></div></div><section class="section about-intro"><div class="container intro-grid"><div>${label("This is Studhive")}<h2>Students don’t just<br>receive education.<br><span class="blue-text">We shape it.</span></h2></div><div class="intro-copy"><p class="large-copy">The future of education belongs to the people bold enough to build it.</p><p>Students’ Hive (Studhive) is a youth-led organisation turning that belief into action. We champion, pollinate and invest in young leaders to challenge systemic barriers and advance equitable, quality education.</p><p>From a conversation on campus to a seat in the policy room, we believe students should help create the systems that shape their lives.</p>${link("about.html", "Get to know the Hive")}</div></div></section><section class="section pillars-section"><div class="container"><div class="section-heading"><div>${label("What moves us")}<h2>Three pillars.<br>One shared purpose.</h2></div><p>We connect leadership, ideas and advocacy so young people can turn their concern for education into meaningful action.</p></div><div class="pillars"><article class="pillar"><div class="pillar-top"><span class="pillar-num">01</span>${icon("civic")}</div><h3>Civic leadership<br>& engagement</h3><p>Build the confidence and skills to lead, mobilise your peers, and take action in your community.</p>${link("programmes.html?pillar=civic", "Find your voice")}</article><article class="pillar"><div class="pillar-top"><span class="pillar-num">02</span>${icon("innovation")}</div><h3>Development<br>innovation</h3><p>See a challenge. Imagine a better way. Turn student ideas into practical solutions that serve communities.</p>${link("programmes.html?pillar=innovation", "Build something better")}</article><article class="pillar"><div class="pillar-top"><span class="pillar-num">03</span>${icon("policy")}</div><h3>Policy<br>& advocacy</h3><p>Bring student perspectives into the conversations and decisions that shape education.</p>${link("programmes.html?pillar=policy", "Shape the conversation")}</article></div></div></section><section class="section"><div class="container"><div class="section-heading"><div>${label("Ideas into action")}<h2>Where the Hive gets to work.</h2></div>${link("programmes.html", "All programmes")}</div><div class="programme-grid">${programmes.map(programmeCard).join("")}</div></div></section><section class="feature-section"><div class="container feature-grid">${image("dialogue", "feature-media", "Nigeria Education Dialogue 2025 event photography placeholder")}<div class="feature-copy">${label("A conversation that matters")}<span class="feature-year">NED <span>2025</span></span><h2>Education reform starts with a better conversation.</h2><p>The first Nigeria Education Dialogue brought students, journalists, development leaders, industry experts and legal professionals together around one question: what role should students play in transforming education?</p>${link("ned-2025.html", "Inside the first dialogue", "button button-honey")}</div></div></section><section class="section"><div class="container"><div class="section-heading"><div>${label("From the Hive")}<h2>Stories. Ideas. Possibilities.</h2></div>${link("stories.html", "Explore our stories")}</div><div class="story-grid">${stories.map(storyCard).join("")}</div></div></section>${cta()}`;
}
function about() {
  return `${pageHero("Who we are", 'A hive of students.<br><span class="blue-text">A force for change.</span>', "We believe students should co-create the future of education—and that building a better society is a responsibility we share.")}<section class="section"><div class="container intro-grid"><div>${label("Why we exist")}<h2>Education is the foundation.<br>Young people are the builders.</h2></div><div class="intro-copy"><p class="large-copy">Quality education is fundamental to a prosperous and equitable society.</p><p>Students’ Hive (Studhive) was established on two beliefs: students should help shape education, and nation building is a joint task. We engage young leaders to become champions of education transformation and reform.</p><p>Our work connects civic leadership and engagement, development innovation, and policy and advocacy. The Hive brings those ideas together in programmes that invite students to participate, build and lead.</p></div></div></section><section class="section cream-section"><div class="container mission-grid"><article>${label("Our vision")}<h2>The future we’re working towards.</h2><p class="large-copy">Young leaders champion education transformation and reform through civic participation and policy.</p></article><article>${label("Our mission")}<h2>What we’re here to do.</h2><p>We champion, pollinate and invest in young leaders to act against systemic barriers and advance equitable, quality education across the world.</p></article></div></section><section class="section" id="values"><div class="container"><div class="section-heading"><div>${label("Our core values")}<h2>What holds the Hive together.</h2></div><p>Our values guide how we lead, how we work with others, and how we show up in our communities.</p></div><div class="values-grid">${values.map(([name, text], i) => `<article class="value"><span class="value-number">0${i + 1}</span><div><h3>${name}</h3><p>${text}</p></div></article>`).join("")}</div></div></section><section class="section dark-section"><div class="container"><div class="section-heading"><div>${label("Built cell by cell")}<h2>One Hive. Many places to lead.</h2></div><p>The Hive connects strategic leadership with action on campuses and in communities.</p></div><div class="structure-grid"><article><span>01 / STRATEGY</span><h3>The Queen Hive</h3><p>Our head office leads strategy, partnerships, fundraising and programme development, and sets the standard for the Hive.</p></article><article><span>02 / CONNECTION</span><h3>National Hives</h3><p>Country-level Hives connect the shared mission with local contexts and communities.</p></article><article><span>03 / ACTION</span><h3>Campus ambassadors</h3><p>Student representatives bring the Hive to their universities, mobilise their peers, and develop community projects.</p></article></div></div></section><section class="section"><div class="container audience-row"><div>${label("A place for your perspective")}<h2>The future needs<br>all of us.</h2></div><div><p>Our primary community is undergraduate and postgraduate students in tertiary institutions. We also work with secondary school students through career guidance and outreach.</p><p>Educators, institutions, policymakers and development partners have a part to play. Together, we can turn student insight into constructive, lasting change.</p>${link("get-involved.html", "Find your place in the Hive")}</div></div></section>${cta()}`;
}
function programmesPage() {
  return `${pageHero("Our programmes", 'Big ideas.<br><span class="blue-text">Real ways to act.</span>', "From building leadership on campus to asking better questions about education, our programmes create space for young people to step forward.")}<section class="section"><div class="container"><div class="filter-bar" data-filter-group="programmes"><span class="filter-label">Explore by focus</span><div class="filter-buttons" role="group" aria-label="Filter programmes by focus"><button class="filter active" data-filter="all" aria-pressed="true">All programmes</button><button class="filter" data-filter="civic" aria-pressed="false">Civic leadership</button><button class="filter" data-filter="innovation" aria-pressed="false">Development innovation</button><button class="filter" data-filter="policy" aria-pressed="false">Policy & advocacy</button></div></div><p class="filter-status sr-only" aria-live="polite"></p><div class="programme-grid filter-grid">${programmes.map(programmeCard).join("")}</div></div></section><section class="section cream-section"><div class="container"><div class="section-heading"><div>${label("The path from idea to action")}<h2>Notice. Organise. Build. Share.</h2></div><p>Our approach encourages young leaders to connect what they learn with what their communities need.</p></div><ol class="steps"><li><span>01</span><h3>See the challenge</h3><p>Listen to students and communities. Understand the barriers in front of them.</p></li><li><span>02</span><h3>Bring people together</h3><p>Build shared understanding through civic participation and dialogue.</p></li><li><span>03</span><h3>Put ideas to work</h3><p>Develop practical responses and lead projects with your community.</p></li><li><span>04</span><h3>Learn and pollinate</h3><p>Evaluate, document and share learning so good ideas can travel further.</p></li></ol></div></section>${cta()}`;
}
function programmeDetail(p) {
  let body;
  if (p.key === "fellowship")
    body = `<h2>Leadership is something you do.</h2><p>The Studhive Ambassador Fellowship is a 100% virtual programme in which selected students represent Studhive within their universities. Ambassadors mobilise peers, promote civic leadership, champion social innovation, and advocate for meaningful improvements in education.</p><p>Ambassadors are encouraged to move beyond awareness. They identify challenges on their campuses and in their communities, develop practical solutions, and engage stakeholders.</p><h2>From learning to community action.</h2><p>In the programme’s second phase, ambassadors implement social impact projects in their target communities. Pre- and post-project evaluations and documentary storytelling capture results and lessons learned.</p><h3>As an ambassador, the work centres on:</h3><ul class="hex-list"><li>Representing the Hive and mobilising fellow students.</li><li>Building civic leadership through participation and action.</li><li>Developing practical responses to education challenges.</li><li>Working with community stakeholders.</li><li>Evaluating projects and sharing what you learn.</li></ul>${config.joinUrl ? `<div class="notice"><strong>Application information</strong><p>Visit the official application page for eligibility, dates and instructions.</p></div>${link(config.joinUrl, "View application details", "button button-honey")}` : `<div class="notice"><strong>Looking to apply?</strong><p>The official application link and next intake details will be added once confirmed.</p></div><button class="button button-honey" data-apply>Application details ${arrow}</button>`}`;
  else if (p.key === "dialogue")
    body = `<h2>Put students at the table.</h2><p>The Nigeria Education Dialogue brings students into conversation with journalists, development leaders, industry experts and legal professionals to discuss education transformation and reform in Nigeria.</p><p>The first edition, NED 2025, explored “The role of students in educational transformation and reform”. The dialogue raised questions about education quality, civic engagement, accountability, human rights, institutional failures and community development.</p><h2>A space to question and contribute.</h2><p>The programme reflects Studhive’s belief that students should help shape the future of education. Bringing different perspectives together creates room for constructive conversations about the systems students experience every day.</p>${link("ned-2025.html", "Read about NED 2025", "button button-ink")}<div class="notice"><strong>Future editions</strong><p>Dates, speakers and participation details will be shared here when confirmed.</p></div>`;
  else
    body = `<h2>Beyond the classroom.</h2><p>The Studhive Career Sensitization Program is an educational outreach initiative helping secondary school students discover their potential, make informed career decisions, and develop the confidence and direction to pursue their aspirations.</p><blockquote>Beyond the Classroom: Inspiring Dreams, Shaping Futures.</blockquote><p>The programme recognises that education is more than attending classes, passing examinations and obtaining certificates. Students also need exposure to career possibilities, guidance on educational pathways, and practical knowledge of the world of work.</p><h2>Connect ambition with direction.</h2><ul class="hex-list"><li>Discover personal interests and potential.</li><li>Explore career possibilities and educational pathways.</li><li>Understand the world of work beyond the classroom.</li><li>Build confidence to make informed decisions.</li></ul><p>Interested in bringing this conversation to students in your school? Connect with Studhive about outreach and collaboration.</p>${link("contact.html?interest=school", "Talk about school outreach", "button button-honey")}`;
  return `<section class="programme-detail-hero"><div class="container"><a class="back-link" href="programmes.html">← All programmes</a><div class="detail-hero-grid"><div>${label(p.tag)}<h1>${p.name}</h1><p class="hero-lead">${p.short}</p></div>${image(p.key, "", `${p.name} photography placeholder`)}</div></div></section><section class="section"><div class="container article-layout"><article class="article-body">${body}</article><aside class="programme-facts"><h2>At a glance</h2><dl><dt>Who it’s for</dt><dd>${p.audience}</dd><dt>Format</dt><dd>${p.format}</dd><dt>Focus</dt><dd>${p.focus}</dd></dl>${link("get-involved.html", "Find your place", "button button-outline")}</aside></div></section><section class="section cream-section"><div class="container"><div class="section-heading"><div>${label("Keep exploring")}<h2>More ways to be the somebody.</h2></div>${link("programmes.html", "All programmes")}</div><div class="programme-grid related-grid">${programmes
    .filter((x) => x.key !== p.key)
    .map(programmeCard)
    .join("")}</div></div></section>${cta()}`;
}
function storiesPage() {
  const gallery = config.photos.gallery.length
    ? `<div class="gallery-grid">${config.photos.gallery.map((p) => `<figure><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy"><figcaption>${esc(p.caption)}</figcaption></figure>`).join("")}</div>`
    : `<div class="gallery-placeholder"><div class="gallery-placeholder-icon">${icon("civic")}</div><div><h3>Real people. Real moments.</h3><p>Programme photography and moments from the Hive will appear here. This space is reserved for approved Studhive images.</p><span class="placeholder-label">Photo gallery placeholder</span></div></div>`;
  return `${pageHero("Stories & updates", 'Good ideas travel.<br><span class="blue-text">Let’s pollinate.</span>', "Explore our first education dialogue, get to know our programmes, and discover the ideas behind the Hive.")}<section class="section"><div class="container"><div class="filter-bar" data-filter-group="stories"><span class="filter-label">Explore the Hive</span><div class="filter-buttons" role="group" aria-label="Filter stories"><button class="filter active" data-filter="all" aria-pressed="true">All stories</button><button class="filter" data-filter="dialogue" aria-pressed="false">Education dialogue</button><button class="filter" data-filter="spotlight" aria-pressed="false">Programme spotlights</button></div></div><p class="filter-status sr-only" aria-live="polite"></p><div class="story-grid filter-grid">${stories.map(storyCard).join("")}</div></div></section><section class="section cream-section"><div class="container"><div class="section-heading"><div>${label("Picture speaks")}<h2>A glimpse into the Hive.</h2></div><p>The voices, connections and shared moments behind our work.</p></div>${gallery}</div></section>${cta()}`;
}
function nedArticle() {
  return `<section class="page-hero article-hero"><div class="container"><a class="back-link" href="stories.html">← Stories & updates</a>${label("Nigeria Education Dialogue · 2025")}<h1>A seat at the table.<br><span class="blue-text">A voice in education.</span></h1><p class="hero-lead">The first Nigeria Education Dialogue asked what happens when students help shape the systems they learn within.</p></div></section><section class="section article-section"><div class="container article-narrow">${image("dialogue", "article-cover", "Photography from the first Nigeria Education Dialogue will be added here")}<article class="article-body"><p class="article-intro">Nigeria Education Dialogue (NED 2025) brought students and professionals together to discuss education transformation and reform in Nigeria.</p><h2>The role of students in transformation.</h2><p>The first edition centred on the theme “The role of students in educational transformation and reform”. Journalists, development leaders, industry experts, legal professionals and students joined the conversation.</p><p>The dialogue raised questions about the quality of education, civic engagement, national development, accountability, human rights, institutional failures, educational frameworks and community development.</p><blockquote>Students should not only be beneficiaries of education. They should help shape its future.</blockquote><h2>Questions worth asking together.</h2><p>For Studhive, dialogue is part of a wider commitment to civic leadership and participation. The first NED created a space for different perspectives on the challenges facing education and the role students can play in responding.</p><p>It reflects the Hive’s founding belief: quality education is foundational to a prosperous, equitable society, and building that society is a task we share.</p><h2>Carry the conversation forward.</h2><p>Discover Studhive’s policy and advocacy work, or explore ways to contribute as a student, educator or partner.</p><div class="hero-actions">${link("nigeria-education-dialogue.html", "Explore the dialogue", "button button-ink")}${link("get-involved.html", "Get involved", "button button-outline")}</div></article></div></section>${cta()}`;
}
function involved() {
  const join = config.joinUrl
    ? link(config.joinUrl, "Apply to the fellowship", "button button-honey")
    : `<button class="button button-honey" data-apply>Application details ${arrow}</button>`;
  return `${pageHero("Join the Hive", 'Your voice matters.<br><span class="blue-text">Put it to work.</span>', "You don’t have to wait to care about education. Find a way to bring your ideas, energy and perspective to the Hive.")}<section class="section"><div class="container involvement-grid"><article class="involvement-card featured"><div class="involvement-icon">${icon("civic")}</div><p class="card-tag">For university students</p><h2>Become an ambassador.</h2><p>Represent Studhive at your university. Mobilise your peers, build civic leadership, and develop a social impact project in your community.</p><p class="small-copy">For undergraduate and postgraduate students. The fellowship is 100% virtual, followed by community projects.</p>${join}${link("ambassador-fellowship.html", "Learn about the fellowship")}</article><article class="involvement-card"><div class="involvement-icon">${icon("heart")}</div><p class="card-tag">For institutions & partners</p><h2>Build with the Hive.</h2><p>Bring your expertise, institutional perspective or resources to a shared commitment to equitable, quality education.</p><p class="small-copy">Connect about programme collaboration, partnerships and ways to support student leadership.</p>${link("contact.html?interest=partnership", "Let’s collaborate", "button button-ink")}</article><article class="involvement-card"><div class="involvement-icon">${icon("book")}</div><p class="card-tag">For schools & educators</p><h2>Open up possibilities.</h2><p>Help secondary school students connect their potential with the future through the Studhive Career Sensitization Program.</p><p class="small-copy">Start a conversation about career guidance and educational outreach for your students.</p>${link("contact.html?interest=school", "Connect about outreach", "button button-outline")}</article></div></section><section class="section cream-section"><div class="container faq-grid"><div>${label("A few things to know")}<h2>Curious about<br>the Hive?</h2><p>Here’s a place to start.</p></div><div class="faq-list"><details><summary>Who can join the Ambassador Fellowship? ${icon("plus")}</summary><p>The programme is designed for undergraduate and postgraduate students enrolled in tertiary institutions. Full eligibility and application details will be shared with the official application link.</p></details><details><summary>Is the fellowship virtual? ${icon("plus")}</summary><p>Yes. The fellowship is 100% virtual. In its second phase, ambassadors implement social impact projects in their target communities.</p></details><details><summary>Are applications currently open? ${icon("plus")}</summary><p>An application window has not been confirmed on this website. The official application link and dates will be added when available.</p></details><details><summary>Can my organisation partner with Studhive? ${icon("plus")}</summary><p>Studhive values collaboration with institutions, communities and development partners. Visit our contact page to explore a conversation about partnerships.</p></details><details><summary>Does Studhive work with secondary schools? ${icon("plus")}</summary><p>Yes. The Studhive Career Sensitization Program helps secondary school students discover their potential and make informed career decisions.</p></details></div></div></section><section class="section"><div class="container small-cta"><div>${label("Start with a conversation")}<h2>Not sure where you fit?<br>There’s room to explore.</h2></div>${link("contact.html", "Talk to the Hive", "button button-ink")}</div></section>`;
}
function contact() {
  return `${pageHero("Let’s connect", 'Great things begin<br><span class="blue-text">with a conversation.</span>', "Have a question, a collaboration in mind, or an idea for education? Let’s find a way to build together.")}<section class="section"><div class="container contact-grid"><div class="contact-info">${label("Reach the Queen Hive")}<h2>What’s on<br>your mind?</h2><p>Whether you’re a student, educator, institution or potential partner, your perspective belongs in the conversation.</p><dl class="contact-details"><dt>Email</dt><dd>${config.contact.email ? `<a href="mailto:${esc(config.contact.email)}">${esc(config.contact.email)}</a>` : '<span class="pending-detail">Official email coming soon</span>'}</dd><dt>Phone</dt><dd>${config.contact.phone ? `<a href="tel:${esc(config.contact.phone.replace(/[^+\d]/g, ""))}">${esc(config.contact.phone)}</a>` : '<span class="pending-detail">Contact number coming soon</span>'}</dd><dt>Find us</dt><dd>${config.contact.address ? esc(config.contact.address) : '<span class="pending-detail">Office details coming soon</span>'}</dd></dl><div class="contact-note">${icon("mail")}<p>${config.contact.email ? "Prepare a message and open it in your email app." : "Contact details are being finalised. You can prepare and download an enquiry below; messages are not sent through this preview."}</p></div></div><form id="contact-form" class="contact-form" data-email="${esc(config.contact.email || "")}"><h2>Let’s start here.</h2><p>Tell us a little about yourself and what you have in mind.</p><div class="form-row"><div class="field"><label for="name">Your name <span>(required)</span></label><input id="name" name="name" autocomplete="name" required maxlength="120" placeholder="Your full name"></div><div class="field"><label for="email">Email address <span>(required)</span></label><input id="email" name="email" type="email" autocomplete="email" required maxlength="200" placeholder="you@example.com"></div></div><div class="field"><label for="organisation">School or organisation <span>(optional)</span></label><input id="organisation" name="organisation" autocomplete="organization" maxlength="200" placeholder="Where you study or work"></div><div class="field"><label for="interest">I’d like to talk about <span>(required)</span></label><select id="interest" name="interest" required><option value="">Choose a topic</option><option value="fellowship">Ambassador Fellowship</option><option value="partnership">Partnerships & collaboration</option><option value="school">School outreach</option><option value="dialogue">Nigeria Education Dialogue</option><option value="other">Something else</option></select></div><div class="field"><label for="message">Your message <span>(required)</span></label><textarea id="message" name="message" required minlength="10" maxlength="5000" rows="5" placeholder="Share your idea or question…"></textarea></div><p class="form-privacy">Your entries stay in this browser until you choose to download a draft or open your email app. <a href="privacy.html">Privacy details</a>.</p><button type="submit" class="button button-honey">${config.contact.email ? "Prepare email" : "Prepare my message"} ${arrow}</button><div id="form-result" class="form-result" tabindex="-1" role="status" hidden><strong id="form-result-title"></strong><p id="form-result-text"></p><button type="button" id="download-message" class="text-link">Download message ${arrow}</button></div></form></div></section>`;
}
function privacy() {
  return `${pageHero("Privacy & accessibility", 'Clear information.<br><span class="blue-text">Open to everyone.</span>', "How this preview handles your information, and the steps we take to make the Hive accessible.")}<section class="section"><div class="container article-narrow article-body"><h2>Your information in this preview</h2><p>This website does not have a connected contact-form service, membership database or payment system. The enquiry form prepares a message locally in your browser. Nothing is sent to Studhive when you prepare or download a draft.</p><p>If an official email address is added, you can choose to open your prepared enquiry in your email app. Sending that email is a separate action in your email service.</p><p>The website does not use analytics, advertising cookies or browser storage for form entries. Hosting providers may process ordinary request information to deliver the site. Any account sign-in required to access this private preview is managed by the hosting platform.</p><h2>Application and social links</h2><p>Official application destinations and social accounts will be added when provided. Once those links are available, the destination services will have their own privacy practices.</p><h2>Accessibility</h2><p>The website uses semantic page structure, descriptive links, labelled form controls, visible keyboard focus, a skip-to-content link, and support for reduced motion. Text and interactive controls use the accessible pairings in the Studhive colour palette.</p><p>Programme photographs will include text alternatives when the approved images are supplied. The current illustrations and photography placeholders are labelled.</p><h2>Before public launch</h2><p>A full organisational privacy notice and official contact information will be added before enquiry collection or new external services are enabled.</p>${link("contact.html", "Contact information")}</div></section>`;
}
const pages = [
  [
    "index.html",
    "home",
    "Pollinating education champions",
    "A youth-led hive transforming education through civic leadership, development innovation, and policy and advocacy. Join Studhive and help shape the future.",
    home,
  ],
  [
    "about.html",
    "about",
    "Who we are",
    "Discover Students’ Hive, our mission, vision and values, and our belief that students should co-create the future of education.",
    about,
  ],
  [
    "programmes.html",
    "programmes",
    "Our programmes",
    "Explore the Studhive Ambassador Fellowship, Nigeria Education Dialogue, and Studhive Career Sensitization Program.",
    programmesPage,
  ],
  [
    "stories.html",
    "stories",
    "Stories & updates",
    "Explore NED 2025 and the ideas and programmes behind Students’ Hive.",
    storiesPage,
  ],
  [
    "get-involved.html",
    "involved",
    "Join the Hive",
    "Discover ways to get involved in student leadership, education advocacy, school outreach and partnerships with Studhive.",
    involved,
  ],
  [
    "contact.html",
    "contact",
    "Contact the Hive",
    "Start a conversation with Studhive about student leadership, partnerships, school outreach and education transformation.",
    contact,
  ],
  [
    "ned-2025.html",
    "stories",
    "NED 2025: A voice in education",
    "Read about the first Nigeria Education Dialogue and its conversation on students’ role in education transformation and reform.",
    nedArticle,
  ],
  [
    "privacy.html",
    "privacy",
    "Privacy & accessibility",
    "How the Studhive website preview handles information and supports accessible browsing.",
    privacy,
  ],
  ...programmes.map((p) => [
    `${p.slug}.html`,
    "programmes",
    p.name,
    p.description,
    () => programmeDetail(p),
  ]),
  [
    "404.html",
    "404",
    "Page not found",
    "Find your way back to the Hive.",
    () =>
      `${pageHero("404 · Page not found", 'Let’s get you<br><span class="blue-text">back to the Hive.</span>', "This page may have moved, or the address might be incomplete.", link("index.html", "Back to the home page", "button button-honey"))}`,
  ],
];
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
for (const [file, active, title, description, render] of pages) {
  const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} | Studhive</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#F5EFE1"><meta name="robots" content="noindex, nofollow"><meta property="og:type" content="website"><meta property="og:site_name" content="Studhive"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><link rel="canonical" href="${esc(config.origin)}/${file === "index.html" ? "" : file}"><meta property="og:url" content="${esc(config.origin)}/${file === "index.html" ? "" : file}"><meta property="og:image" content="${esc(config.origin)}/assets/community.svg"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="styles.css"><script src="app.js" defer></script></head><body data-page="${active}">${header(active)}<main id="main">${render()}</main>${footer()}</body></html>`;
  await writeFile(`dist/${file}`, html);
}
await writeFile("dist/robots.txt", "User-agent: *\nDisallow: /\n");
console.log(
  `Built ${pages.length} pages in dist/. Placeholder settings: site.config.mjs`,
);
