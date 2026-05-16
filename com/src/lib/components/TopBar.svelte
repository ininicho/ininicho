<!-- src/lib/components/TopBar.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type ActivePage = 'index' | 'work' | 'photography' | 'cv' | 'contact';

  let {
    active,
    right,
  }: {
    active: ActivePage;
    right?: Snippet;
  } = $props();

  let menuOpen = $state(false);

  const navLinks = [
    { key: 'index' as ActivePage,       label: 'index',       href: '/' },
    { key: 'work' as ActivePage,        label: 'work',        href: '/#work' },
    { key: 'photography' as ActivePage, label: 'photography', href: '/photography' },
    { key: 'cv' as ActivePage,          label: 'cv',          href: '/cv' },
    { key: 'contact' as ActivePage,     label: 'contact',     href: '/#contact' },
  ];
</script>

<header class="topbar">
  <div class="topbar-inner">
    <!-- Left: idx label -->
    <span class="idx-label">idx · 2026</span>

    <!-- Centre: desktop nav -->
    <nav class="desktop-nav">
      {#each navLinks as link}
        <a
          href={link.href}
          class="nav-link"
          class:active={active === link.key}
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <!-- Centre: mobile menu toggle -->
    <button class="menu-toggle" onclick={() => (menuOpen = !menuOpen)}>
      {menuOpen ? 'close' : 'menu'}
    </button>

    <!-- Right slot -->
    <div class="right-slot">
      {@render right?.()}
    </div>
  </div>

  <!-- Mobile dropdown nav -->
  {#if menuOpen}
    <nav class="mobile-nav">
      {#each navLinks as link}
        <a
          href={link.href}
          class="nav-link"
          class:active={active === link.key}
          onclick={() => (menuOpen = false)}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  {/if}
</header>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-rule);
  }

  .topbar-inner {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 24px;
    padding: 24px 64px;
    align-items: center;
  }

  .idx-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
  }

  .desktop-nav {
    display: flex;
    gap: 32px;
    font-family: var(--font-mono);
    font-size: 12px;
  }

  .menu-toggle {
    display: none;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .nav-link {
    color: var(--color-ink-2);
    text-decoration: none;
    transition: text-underline-offset 120ms ease;
  }

  .nav-link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 1px;
  }

  .nav-link.active {
    color: var(--color-ink);
  }

  .right-slot {
    display: flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-ink-2);
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 64px 20px;
    font-family: var(--font-mono);
    font-size: 12px;
  }

  /* Responsive */
  @media (max-width: 767px) {
    .topbar-inner {
      grid-template-columns: 1fr auto auto;
      padding: 20px 40px;
      gap: 16px;
    }

    .idx-label {
      display: none;
    }

    .desktop-nav {
      display: none;
    }

    .menu-toggle {
      display: block;
    }

    .mobile-nav {
      padding: 0 40px 20px;
    }
  }
</style>
