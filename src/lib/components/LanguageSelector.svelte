<script lang="ts">
  import { language, getTranslations } from "$lib/stores/language";
  import { languages, type LanguageCode } from "$lib/i18n";
  import { clickOutside } from "$lib/actions/clickOutside";

  let isOpen = $state(false);
  let currentLang = $state<LanguageCode>("en");

  language.subscribe((lang) => {
    currentLang = lang;
  });

  function selectLanguage(code: LanguageCode) {
    language.set(code);
    isOpen = false;
  }

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function handleClickOutside() {
    isOpen = false;
  }
</script>

<div class="relative" use:clickOutside={handleClickOutside}>
  <button
    onclick={toggleDropdown}
    class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#00262a] border border-gray-200 dark:border-[#005159] hover:bg-gray-50 dark:hover:bg-[#003a3f] transition-colors"
    aria-label="Select language"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5 text-gray-600 dark:text-gray-300"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
      />
    </svg>
    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
      {languages.find((l) => l.code === currentLang)?.code.toUpperCase()}
    </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform {isOpen
        ? 'rotate-180'
        : ''}"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  </button>

  {#if isOpen}
    <div
      class="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-[#00262a] border border-gray-200 dark:border-[#005159] py-1 z-50"
    >
      {#each languages as lang}
        <button
          onclick={() => selectLanguage(lang.code)}
          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-[#003a3f] transition-colors {currentLang ===
          lang.code
            ? 'bg-gray-50 dark:bg-[#003a3f] text-[#37cca8] font-medium'
            : 'text-gray-700 dark:text-gray-200'}"
        >
          <div class="flex items-center justify-between">
            <span>{lang.nativeName}</span>
            {#if currentLang === lang.code}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
