<!-- src/lib/components/MetaField.svelte -->
<script lang="ts">
  let { label, value }: { label: string; value: string } = $props();
</script>

<div class="meta-field">
  <span class="meta-label">{label}</span>
  <span class="meta-value">{value}</span>
</div>

<style>
  .meta-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .meta-label {
    color: var(--color-ink-3);
  }

  .meta-value {
    color: var(--color-ink);
  }
</style>
