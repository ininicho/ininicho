<!-- src/routes/cv/+page.svelte -->
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
  import MetaField from '$lib/components/MetaField.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { fadeUp } from '$lib/actions/fadeUp';
  import { IDENTITY, EXPERIENCE, EDUCATION, SKILLS } from '$lib/content';
</script>

<svelte:head>
  <title>CV — Nicholaus Suprapto</title>
</svelte:head>

<!-- TOP BAR -->
<TopBar active="cv">
  {#snippet right()}
    <a href="https://public.ininicho.com/resume.pdf" target="_blank" rel="noopener" class="dl-btn">Download · pdf ↓</a>
  {/snippet}
</TopBar>

<!-- TITLE BLOCK -->
<section class="title-block" use:fadeUp>
  <div class="title-grid">
    <span class="title-num">04 / cv</span>
    <div>
      <h1 class="title-h1">Curriculum vitae<span class="accent">.</span></h1>
      <div class="identity-row">
        <MetaField label="Name"    value={IDENTITY.name} />
        <MetaField label="Title"   value={IDENTITY.role} />
        <MetaField label="Based"   value={IDENTITY.location} />
        <MetaField label="Email"   value={IDENTITY.email} />
        <MetaField label="Updated" value={IDENTITY.updated} />
      </div>
    </div>
  </div>
</section>

<div class="rule"></div>

<!-- EXPERIENCE -->
<section class="cv-section" use:fadeUp>
  <span class="cv-section-num">01 / experience</span>
  <div class="experience-list">
    {#each EXPERIENCE as exp, i}
      <article class="exp-row" id="exp-{i}">
        <div class="exp-date">{exp.yr}</div>
        <div class="exp-body">
          <h3 class="exp-role">{exp.role}</h3>
          <div class="exp-org">{exp.org}</div>
          <ul class="exp-bullets">
            {#each exp.bullets as bullet}
              <li class="exp-bullet">
                <span class="bullet-dash" aria-hidden="true">—</span>
                <span>{bullet}</span>
              </li>
            {/each}
          </ul>
          <div class="exp-stack">
            {#each exp.stack as s}
              <Tag label={s} />
            {/each}
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>

<div class="rule"></div>

<!-- SKILLS -->
<section class="cv-section" use:fadeUp>
  <span class="cv-section-num">02 / skills</span>
  <div class="skills-grid">
    {#each SKILLS as group}
      <div class="skill-row">
        <span class="skill-group">{group.group}</span>
        <span class="skill-items">{group.items.join(' · ')}</span>
      </div>
    {/each}
  </div>
</section>

<div class="rule"></div>

<!-- EDUCATION -->
<section class="cv-section" use:fadeUp>
  <span class="cv-section-num">03 / education</span>
  <div class="experience-list">
    {#each EDUCATION as edu}
      <article class="exp-row">
        <div class="exp-date">{edu.yr}</div>
        <div class="exp-body">
          <h3 class="edu-org">{edu.org}</h3>
          <p class="edu-desc">{edu.description}</p>
        </div>
      </article>
    {/each}
  </div>
</section>

<div class="rule"></div>

<!-- COLOPHON -->
<section class="colophon" use:fadeUp>
  <span class="cv-section-num">—</span>
  <div class="colophon-inner">
    <p class="colophon-text">
      References available on request. Prefer to print this? The PDF is set on a single page
      in the same type.
    </p>
    <a href="https://public.ininicho.com/resume.pdf" target="_blank" rel="noopener" class="dl-btn dl-btn-large">Download résumé · pdf ↓</a>
  </div>
</section>

<style>
  /* Download button */
  .dl-btn {
    padding: 8px 14px;
    background: var(--color-ink);
    color: var(--color-paper);
    border: none;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    transition: opacity 150ms ease;
  }
  .dl-btn:hover {
    opacity: 0.85;
  }
  .dl-btn-large {
    padding: 14px 22px;
    font-size: 12px;
    white-space: nowrap;
  }

  /* Title block */
  .title-block {
    padding: 88px 64px 48px;
  }
  .title-grid {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
    align-items: start;
  }
  .title-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 8px;
  }
  .title-h1 {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 56px;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.025em;
  }
  .accent {
    color: var(--color-accent);
  }
  .identity-row {
    display: flex;
    gap: 48px;
    margin-top: 36px;
    flex-wrap: wrap;
  }

  /* Shared rule */
  .rule {
    height: 1px;
    background: var(--color-rule);
    margin: 0 64px;
  }

  /* CV sections (experience, skills, education, colophon) */
  .cv-section {
    padding: 64px 64px 32px;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .cv-section-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 4px;
  }

  /* Experience */
  .experience-list {
    display: flex;
    flex-direction: column;
    gap: 48px;
    max-width: 920px;
  }
  .exp-row {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 32px;
    align-items: baseline;
    scroll-margin-top: 128px;
  }
  .exp-date {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-ink-2);
    letter-spacing: 0.04em;
  }
  .exp-role {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.012em;
  }
  .exp-org {
    margin-top: 4px;
    color: var(--color-ink-2);
    font-size: 14px;
  }
  .exp-bullets {
    margin: 16px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .exp-bullet {
    display: grid;
    grid-template-columns: 16px 1fr;
    gap: 6px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-ink);
  }
  .bullet-dash {
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .exp-stack {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  /* Skills */
  .skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
    max-width: 920px;
  }
  .skill-row {
    border-top: 1px solid var(--color-rule-soft);
    padding-top: 14px;
    padding-bottom: 14px;
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 16px;
    align-items: baseline;
  }
  .skill-group {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-ink-2);
    letter-spacing: 0.04em;
  }
  .skill-items {
    color: var(--color-ink);
    font-size: 14px;
  }

  /* Education */
  .edu-org {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 18px;
    font-weight: 500;
    line-height: 1.3;
  }
  .edu-desc {
    margin: 6px 0 0;
    color: var(--color-ink-2);
    font-size: 14px;
  }

  /* Colophon */
  .colophon {
    padding: 64px 64px 96px;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .colophon-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .colophon-text {
    margin: 0;
    color: var(--color-ink-2);
    max-width: 520px;
    font-size: 14px;
  }

  /* Responsive */
  @media (max-width: 1023px) {
    .title-block,
    .cv-section,
    .colophon {
      padding-left: 40px;
      padding-right: 40px;
    }
    .rule {
      margin: 0 40px;
    }
    .identity-row {
      gap: 24px;
    }
  }

  @media (max-width: 767px) {
    .title-block {
      padding: 48px 40px 32px;
    }
    .title-grid {
      display: block;
    }
    .title-num {
      display: block;
      margin-bottom: 12px;
    }
    .title-h1 {
      font-size: 36px;
    }
    .identity-row {
      flex-direction: column;
      gap: 12px;
    }
    .cv-section {
      display: block;
      padding: 48px 40px 24px;
    }
    .cv-section-num {
      display: block;
      margin-bottom: 20px;
    }
    .exp-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .skills-grid {
      grid-template-columns: 1fr;
    }
    .skill-row {
      grid-template-columns: 1fr;
      gap: 4px;
    }
    .colophon {
      display: block;
      padding: 40px 40px 64px;
    }
    .colophon-inner {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
