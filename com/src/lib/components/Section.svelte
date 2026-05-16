<!-- src/lib/components/Section.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    num,
    label,
    topPad = '88px',
    children,
  }: {
    num: string;
    label: string;
    topPad?: string;
    children: Snippet;
  } = $props();
</script>

<section style:padding-top={topPad} class="section">
  <header class="section-header">
    <span class="section-num">{num}</span>
    <h2 class="section-label">{label}</h2>
  </header>
  <div class="section-body">
    <div class="section-gutter" aria-hidden="true"></div>
    <div class="section-content">
      {@render children()}
    </div>
  </div>
</section>

<style>
  .section {
    padding-right: 64px;
    padding-bottom: 0;
    padding-left: 64px;
  }

  .section-header {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
    margin-bottom: 56px;
    align-items: baseline;
  }

  .section-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 4px;
  }

  .section-label {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--color-ink);
  }

  .section-body {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }

  /* Responsive */
  @media (max-width: 767px) {
    .section {
      padding-right: 40px;
      padding-left: 40px;
    }

    .section-header {
      display: block;
      margin-bottom: 24px;
    }

    .section-num {
      display: block;
      margin-bottom: 8px;
    }

    .section-body {
      display: block;
    }

    .section-gutter {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .section {
      padding-right: 40px;
      padding-left: 40px;
    }
  }
</style>
