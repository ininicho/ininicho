<!-- src/lib/components/ProjectRow.svelte -->
<script lang="ts">
  import Tag from './Tag.svelte';
  import type { Project } from '$lib/content';

  let { project, last = false }: { project: Project; last?: boolean } = $props();
</script>

<svelte:element
  this={project.href ? 'a' : 'article'}
  href={project.href ?? undefined}
  class="row"
  class:last
>
  <span class="row-num">{project.no}</span>

  <div class="row-title-col">
    <div class="row-title">{project.title}</div>
    <div class="row-sub">{project.client} · {project.year}</div>
  </div>

  <p class="row-blurb">{project.blurb}</p>

  <div class="row-tags">
    {#each project.tags as tag}
      <Tag label={tag} />
    {/each}
  </div>
</svelte:element>

<style>
  .row {
    padding: 32px 0;
    border-top: 1px solid var(--color-rule);
    text-decoration: none;
    color: inherit;
    display: grid;
    grid-template-columns: 60px 1fr 1fr auto;
    gap: 32px;
    align-items: baseline;
    cursor: pointer;
    transition: background 150ms ease;
  }

  .row:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  .row.last {
    border-bottom: 1px solid var(--color-rule);
  }

  .row-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
  }

  .row-title {
    font-family: var(--font-sans);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--color-ink);
  }

  .row-sub {
    margin-top: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
  }

  .row-blurb {
    margin: 0;
    color: var(--color-ink-2);
    font-size: 14px;
    line-height: 1.55;
    max-width: 380px;
  }

  .row-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 220px;
  }

  @media (max-width: 767px) {
    .row {
      grid-template-columns: 40px 1fr;
      grid-template-rows: auto auto auto;
      gap: 12px 16px;
    }

    .row-blurb {
      grid-column: 2;
      max-width: none;
    }

    .row-tags {
      grid-column: 2;
      justify-content: flex-start;
      max-width: none;
    }
  }
</style>
