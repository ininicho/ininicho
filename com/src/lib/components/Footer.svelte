<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { SITE_META } from '$lib/content';

  let {
    left = `© 2026 — built by hand`,
    right = `v ${SITE_META.version} · last updated ${SITE_META.updatedLabel}`,
  }: {
    left?: string;
    right?: string;
  } = $props();
</script>

<footer class="footer">
  <span>{left}</span>
  <span>{right}</span>
</footer>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    padding: 32px 64px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-3);
  }

  @media (max-width: 767px) {
    .footer {
      padding: 24px 40px;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
