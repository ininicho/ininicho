<!-- src/routes/photography/+page.svelte -->
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
  import Photo from '$lib/components/Photo.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { filterPhotos, paginatePhotos, photoColumns } from '$lib/utils/photos';
  import { SITE_META } from '$lib/content';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const FILTERS = ['All', 'Toronto', 'Travel', 'Film', 'Digital'] as const;
  const PAGE_SIZE = 18;

  let activeFilter = $state<string>('All');
  let visible = $state(PAGE_SIZE);

  const filtered = $derived(filterPhotos(data.photos, activeFilter));
  const paginated = $derived(paginatePhotos(filtered, visible));
  const columns = $derived(photoColumns(paginated, 3));
  const previewColumns = $derived(photoColumns(data.photos.slice(PAGE_SIZE, PAGE_SIZE + 3), 3));

  function setFilter(f: string) {
    activeFilter = f;
    visible = PAGE_SIZE;
  }

  function loadMore() {
    visible += PAGE_SIZE;
  }
</script>

<svelte:head>
  <title>Photography — Nicholaus Suprapto</title>
</svelte:head>

<!-- TOP BAR -->
<TopBar active="photography">
  {#snippet right()}
    <span>{SITE_META.photoCount} photos · since {SITE_META.photosSince}</span>
  {/snippet}
</TopBar>

<!-- PAGE TITLE -->
<section class="page-title">
  <div class="title-grid">
    <span class="title-num">03 / photography</span>
    <div class="title-right">
      <h1 class="title-h1">
        Things I've noticed while walking around<span class="accent">.</span>
      </h1>
      <div class="filter-pills">
        {#each FILTERS as f}
          <button
            class="pill"
            class:pill-active={activeFilter === f}
            onclick={() => setFilter(f)}
          >
            {f}
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- PHOTO GRID -->
<section class="grid-section">
  <div class="grid-gutter" aria-hidden="true"></div>
  <div class="masonry">
    {#each columns as col}
      <div class="masonry-col">
        {#each col as photo}
          <Photo {photo} />
        {/each}
      </div>
    {/each}
  </div>
</section>

<!-- LOAD MORE -->
{#if visible < filtered.length}
  <section class="load-more-section">
    <div class="grid-gutter" aria-hidden="true"></div>
    <div class="load-more-inner">
      <div class="load-rule"></div>
      <button class="load-btn" onclick={loadMore}>
        Load {Math.min(PAGE_SIZE, filtered.length - visible)} more
      </button>
      <div class="load-rule"></div>
    </div>
    <div class="grid-gutter" aria-hidden="true"></div>
    <p class="load-status">
      {Math.min(visible, filtered.length)} of {filtered.length} · scroll or click to continue
    </p>

    <!-- Faded preview of next batch -->
    {#if previewColumns.some((col) => col.length > 0)}
      <div class="grid-gutter" aria-hidden="true"></div>
      <div class="masonry preview-fade">
        {#each previewColumns as col}
          <div class="masonry-col">
            {#each col as photo}
              <Photo {photo} />
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if}

<div class="rule"></div>

<Footer
  left="← back to index"
  right="{SITE_META.photoCount} photos · updated {SITE_META.updatedLabel}"
/>

<style>
  /* Page title */
  .page-title {
    padding: 88px 64px 56px;
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
  .title-right {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
  }
  .title-h1 {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 48px;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.025em;
    max-width: 720px;
  }
  .accent {
    color: var(--color-accent);
  }

  /* Filter pills */
  .filter-pills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .pill {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 99px;
    cursor: pointer;
    border: 1px solid var(--color-rule);
    background: transparent;
    color: var(--color-ink-2);
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }
  .pill-active {
    background: var(--color-ink);
    color: var(--color-paper);
    border-color: var(--color-ink);
  }

  /* Masonry grid */
  .grid-section {
    padding: 0 64px 56px;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .masonry {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .masonry-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Load more */
  .load-more-section {
    padding: 32px 64px 0;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .load-more-inner {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .load-rule {
    height: 1px;
    flex: 1;
    background: var(--color-rule);
  }
  .load-btn {
    padding: 14px 28px;
    background: var(--color-ink);
    color: var(--color-paper);
    border: none;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
    transition: opacity 150ms ease;
  }
  .load-btn:hover {
    opacity: 0.85;
  }
  .load-status {
    margin: 12px 0 0;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-ink-3);
    letter-spacing: 0.04em;
    grid-column: 2;
  }

  /* Faded preview */
  .preview-fade {
    grid-column: 2;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 90%);
    -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 90%);
    padding-top: 56px;
  }

  .rule {
    height: 1px;
    background: var(--color-rule);
    margin: 32px 64px 0;
  }

  .grid-gutter {
    /* spacer in grid */
  }

  /* Responsive */
  @media (max-width: 1023px) {
    .page-title {
      padding: 64px 40px 40px;
    }
    .grid-section {
      padding: 0 40px 40px;
    }
    .load-more-section {
      padding: 32px 40px 0;
    }
    .rule {
      margin: 32px 40px 0;
    }
  }

  @media (max-width: 767px) {
    .page-title {
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
      font-size: 32px;
    }
    .title-right {
      flex-direction: column;
      gap: 24px;
      align-items: flex-start;
    }
    .grid-section {
      display: block;
      padding: 0 40px 40px;
    }
    .masonry {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .load-more-section {
      display: block;
      padding: 32px 40px 0;
    }
    .load-status {
      grid-column: auto;
    }
    .preview-fade {
      grid-column: auto;
    }
  }
</style>
