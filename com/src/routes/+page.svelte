<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
</script>

<TopBar active="index">
  {#snippet right()}
    <span style="display:flex;align-items:center;gap:10px;">
      <span style="width:6px;height:6px;border-radius:99px;background:#3a8a5a;display:inline-block;"></span>
      Toronto · live
    </span>
  {/snippet}
</TopBar>

<p style="padding:40px 64px;">coming soon</p>
