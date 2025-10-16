<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { theme } from "$lib/stores/theme";
  import { page } from "$app/state";
  import logo from "$lib/assets/logo.png";
  import { onMount } from "svelte";

  let { children } = $props();

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
    theme.init();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  {#if page.error}
    <title>Error {page.status}</title>
  {/if}
</svelte:head>

{#if page.error}
  <!-- Error Page -->
  <div
    class="min-h-screen flex items-center justify-center bg-white dark:bg-[#00262a] py-8 px-4 sm:py-12 sm:px-6 lg:px-8 transition-colors"
  >
    <!-- Theme Toggle -->
    {#if mounted}
      <button
        onclick={() => theme.toggle()}
        class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-[#003a3f] hover:bg-gray-200 dark:hover:bg-[#004a50] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Toggle dark mode"
      >
        {#if $theme === "dark"}
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clip-rule="evenodd"
            />
          </svg>
        {:else}
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-[#37cca8]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            />
          </svg>
        {/if}
      </button>
    {/if}

    <div class="max-w-md w-full text-center space-y-6 sm:space-y-8">
      <!-- Logo -->
      <div class="mb-6">
        <div
          class="w-20 h-20 mx-auto rounded-xl p-2"
          style="background: #00262a;"
        >
          <img src={logo} alt="Logo" class="object-contain" />
        </div>
      </div>

      {#if page.status === 403}
        <!-- 403 Forbidden - Custom Design -->
        <div
          class="mx-auto flex items-center justify-center h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30"
        >
          <svg
            class="h-12 w-12 sm:h-16 sm:w-16 text-red-600 dark:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div>
          <h1
            class="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6"
          >
            Uh Oh... Are you lost?
          </h1>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">
            {page.error?.message || "Access to this page is restricted."}
          </p>
          <p class="text-sm sm:text-base text-gray-500 dark:text-gray-500">
            You don't have permission to access this page.
          </p>
        </div>
      {:else}
        <!-- Generic Error Page -->
        <div
          class="mx-auto flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-red-100 dark:bg-red-900/30"
        >
          <svg
            class="h-10 w-10 sm:h-12 sm:w-12 text-red-600 dark:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div>
          <h1
            class="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4"
          >
            {page.status}
          </h1>
          <h2
            class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
          >
            Something went wrong
          </h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {page.error?.message || "An unexpected error occurred."}
          </p>
        </div>
      {/if}
    </div>
  </div>

  <style>
    :global(html.dark) {
      color-scheme: dark;
    }
  </style>
{:else}
  <!-- Normal page content -->
  {@render children?.()}
{/if}
