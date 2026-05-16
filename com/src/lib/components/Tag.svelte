<!-- src/lib/components/Tag.svelte -->
<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<span class="tag">{label}</span>

<style>
  .tag {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--color-ink-2);
    padding: 4px 8px;
    border: 1px solid var(--color-rule);
    border-radius: 99px;
    white-space: nowrap;
  }
</style>
