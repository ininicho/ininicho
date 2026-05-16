<!-- src/lib/components/Photo.svelte -->
<script lang="ts">
  import type { Photo } from '$lib/content';

  let { photo }: { photo: Photo } = $props();

  // 8 warm duotone swatches — cycle by photo index parsed from id
  const SWATCHES = [
    '#c8bfb0', '#bfc8c0', '#c0b8c8', '#c8c0b8',
    '#b8c0c8', '#c8b8b8', '#bec8b8', '#c8c4b8',
  ];

  const swatchColor = SWATCHES[(parseInt(photo.id, 10) - 1) % SWATCHES.length];
</script>

<figure class="photo-figure">
  <div class="photo-media" style="aspect-ratio: {photo.ratio};">
    {#if photo.src}
      <img src={photo.src} alt={photo.caption} class="photo-img" />
    {:else}
      <div class="photo-placeholder" style="background-color: {swatchColor};"></div>
    {/if}
  </div>
  <figcaption class="photo-caption">
    <span>{photo.caption}</span>
    <span>#{photo.id}</span>
  </figcaption>
</figure>

<style>
  .photo-figure {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .photo-media {
    width: 100%;
    overflow: hidden;
  }

  .photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .photo-placeholder {
    width: 100%;
    height: 100%;
  }

  .photo-caption {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--color-ink-2);
  }
</style>
