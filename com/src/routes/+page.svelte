<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
  import Section from '$lib/components/Section.svelte';
  import MetaField from '$lib/components/MetaField.svelte';
  import ProjectRow from '$lib/components/ProjectRow.svelte';
  import Photo from '$lib/components/Photo.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { fadeUp } from '$lib/actions/fadeUp';
  import { IDENTITY, PROJECTS, PHOTOS, SITE_META, COPY } from '$lib/content';

  const previewPhotos = PHOTOS.slice(0, 4);
</script>

<svelte:head>
  <title>Nicholaus Suprapto — Software Engineer</title>
</svelte:head>

<!-- TOP BAR -->
<TopBar active="index">
  <!--
    {#snippet right()}
      <span class="status">
        <span class="status-dot" aria-hidden="true"></span>
        Toronto · live
      </span>
    {/snippet}
  -->
</TopBar>

<!-- HERO -->
<section class="hero" use:fadeUp>
  <div class="hero-grid">
    <span class="hero-num">00 / intro</span>
    <div>
      <h1 class="hero-h1">
        <span class="hero-name">{IDENTITY.name}.</span><br />
        {COPY.heroTagline}
        <span class="hero-accent">Toronto.</span>
      </h1>
      <div class="hero-meta">
        <MetaField label="Role" value={IDENTITY.role.split(' · ')[0]} />
        <MetaField label="Organization" value={IDENTITY.org} />
        <MetaField label="Now" value={COPY.heroNow} />
        <MetaField label="Based" value={IDENTITY.location} />
      </div>
    </div>
  </div>
</section>

<div class="rule"></div>

<!-- ABOUT -->
<div use:fadeUp>
  <Section num="01" label="About">
    <div class="about-grid">
      <div>
        <p class="about-primary">{COPY.aboutPrimary}</p>
        <p class="about-secondary">{COPY.aboutSecondary}</p>
      </div>
      <Photo photo={{ id: '000', caption: 'Portrait', place: '', src: '/potrait.jpg', date: '2026', ratio: '4/5', tags: [] }} />
    </div>
  </Section>
</div>

<!-- SELECTED WORK -->
<div id="work" use:fadeUp>
  <Section num="02" label="Selected work" topPad="120px">
    {#each PROJECTS as project, i}
      <ProjectRow {project} last={i === PROJECTS.length - 1} />
    {/each}
  </Section>
</div>

<!-- PHOTOGRAPHY PREVIEW -->
<div use:fadeUp>
  <Section num="03" label="Photography" topPad="120px">
    <div class="photo-intro">
      <p class="photo-desc">{COPY.photographyIntro}</p>
      <a href="/photography" class="photo-link">
        view all ({SITE_META.photoCount}) →
      </a>
    </div>
    <div class="photo-grid">
      {#each previewPhotos as photo}
        <Photo {photo} />
      {/each}
    </div>
  </Section>
</div>

<!-- CONTACT -->
<div id="contact" use:fadeUp>
  <Section num="04" label="Contact" topPad="120px">
    <div class="contact-grid">
      <div>
        <p class="contact-statement">
          {COPY.contactStatement}<span class="accent">.</span>
        </p>
        <a href="mailto:{IDENTITY.email}" class="contact-btn">
          {IDENTITY.email} ↗
        </a>
      </div>
      <dl class="contact-dl">
        <dt>GitHub</dt>
        <dd><a href="https://{IDENTITY.github}" target="_blank" rel="noopener">{IDENTITY.github}</a></dd>
        <dt>LinkedIn</dt>
        <dd><a href="https://linkedin.com/{IDENTITY.linkedin}" target="_blank" rel="noopener">{IDENTITY.linkedin}</a></dd>
        <dt>Resume</dt>
        <dd><a href="/resume.pdf" download>resume.pdf ↓</a></dd>
        <dt>Location</dt>
        <dd>{IDENTITY.location}</dd>
      </dl>
    </div>
  </Section>
</div>

<div class="rule" style="margin-top: 96px;"></div>

<Footer />

<style>
  /* Status dot */
  .status {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 99px;
    background: #3a8a5a;
    display: inline-block;
    flex-shrink: 0;
  }

  /* Hero */
  .hero {
    padding: 160px 64px 140px;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .hero-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 8px;
  }
  .hero-h1 {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 80px;
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.03em;
    color: var(--color-ink);
    max-width: 980px;
  }
  .hero-name {
    color: var(--color-ink-3);
  }
  .hero-accent {
    color: var(--color-accent);
  }
  .hero-meta {
    display: flex;
    gap: 56px;
    margin-top: 72px;
  }

  /* Rule */
  .rule {
    height: 1px;
    background: var(--color-rule);
    margin: 0 64px;
  }

  /* About */
  .about-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 80px;
    max-width: 1080px;
    align-items: start;
  }
  .about-primary {
    margin: 0;
    font-size: 22px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: -0.005em;
    color: var(--color-ink);
  }
  .about-secondary {
    margin: 24px 0 0;
    font-size: 16px;
    line-height: 1.65;
    color: var(--color-ink-2);
  }

  /* Photography preview */
  .photo-intro {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 32px;
  }
  .photo-desc {
    margin: 0;
    color: var(--color-ink-2);
    max-width: 480px;
    font-size: 14px;
  }
  .photo-link {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-ink);
    text-decoration: none;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .photo-link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  /* Contact */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    max-width: 1000px;
  }
  .contact-statement {
    margin: 0;
    font-size: 36px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--color-ink);
  }
  .accent {
    color: var(--color-accent);
  }
  .contact-btn {
    display: inline-block;
    margin-top: 28px;
    padding: 14px 22px;
    border: 1px solid var(--color-ink);
    color: var(--color-ink);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 0.03em;
    transition: background 150ms ease, color 150ms ease;
  }
  .contact-btn:hover {
    background: var(--color-ink);
    color: var(--color-paper);
  }
  .contact-dl {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-ink-2);
    line-height: 2;
    display: grid;
    grid-template-columns: 80px 1fr;
    column-gap: 16px;
    align-content: start;
  }
  .contact-dl dt {
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .contact-dl dd {
    margin: 0;
    color: var(--color-ink);
  }
  .contact-dl dd a {
    color: inherit;
    text-decoration: none;
  }
  .contact-dl dd a:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  /* Responsive */
  @media (max-width: 1023px) {
    .hero {
      padding: 100px 40px 100px;
    }
    .hero-h1 {
      font-size: 56px;
    }
    .hero-meta {
      gap: 32px;
      flex-wrap: wrap;
    }
    .about-grid {
      gap: 40px;
    }
    .rule {
      margin: 0 40px;
    }
  }

  @media (max-width: 767px) {
    .hero {
      padding: 64px 40px 80px;
    }
    .hero-grid {
      display: block;
    }
    .hero-num {
      display: block;
      margin-bottom: 16px;
    }
    .hero-h1 {
      font-size: 40px;
      letter-spacing: -0.02em;
    }
    .hero-meta {
      flex-direction: column;
      gap: 16px;
      margin-top: 40px;
    }
    .about-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .photo-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .photo-intro {
      flex-direction: column;
      gap: 12px;
    }
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    .rule {
      margin: 0 40px;
    }
  }
</style>
