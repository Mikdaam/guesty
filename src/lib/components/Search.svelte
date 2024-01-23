<script lang="ts">
  import { selectedCity } from "$lib/utils/store";
  import type { City } from "@prisma/client";
  import { createEventDispatcher, onDestroy } from "svelte";

  const dispatcher = createEventDispatcher();

  let searchTerm: string = "";
  let searchResults: City[] = [];
  let selectedResultIndex: number = -1;


  async function handleInputChange(event: Event) {
    searchTerm = (event.target as HTMLInputElement).value;

    // Check if the input has at least 3 characters before querying the database
    if (searchTerm.trim().length >= 3) {
      await filterResults();
    } else {
      // If the input has less than 3 characters, clear the results
      searchResults = [];
      selectedResultIndex = -1;
    }
  }

  async function filterResults() {
    // Limit the result to 10
    try {
      const response = await fetch(`/api/internal/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      const json = await response.json();

      if (response.ok) {
        searchResults = json.data;
        selectedResultIndex = -1;
      } else {
        console.error(json.message);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (
      event.key === "ArrowDown" &&
      selectedResultIndex < searchResults.length - 1
    ) {
      selectedResultIndex++;
    } else if (event.key === "ArrowUp" && selectedResultIndex > 0) {
      selectedResultIndex--;
    } else if (event.key === "Enter" && selectedResultIndex !== -1) {
      selectResult(selectedResultIndex);
    }
  }

  function selectResult(index: number) {
    const selectedResult = searchResults[index];
    const displayText = `${selectedResult.name}, ${selectedResult.adminName || ''}, ${selectedResult.country}`;
    dispatcher('selected', selectedResult);
    selectedCity.set(searchResults[index]);
    searchTerm = displayText;
    closeDropdown();
  }

  function clearSearch() {
    searchTerm = '';
    searchResults = [];
    selectedResultIndex = -1;
  }

  function closeDropdown() {
    searchResults = [];
    selectedResultIndex = -1;
  }

  // Event listener to close dropdown when clicking outside the input field
  window.addEventListener("click", (event) => {
    const input = document.querySelector(".search-input");
    if (input && !input.contains(event.target as Node)) {
      closeDropdown();
    }
  });

  // Cleanup the event listener when the component is destroyed
  onDestroy(() => {
    window.removeEventListener("click", closeDropdown);
  });
</script>

<div class="search-container">
  <input
    type="text"
    bind:value={searchTerm}
    on:input={handleInputChange}
    on:keydown={handleKeyDown}
    class="search-input"
    placeholder="Search cities..."
  />

  {#if searchResults.length > 0}
    <div class="search-results">
      {#each searchResults as result, index (index)}
        <div
          class:result-item={true}
          class:selected={index === selectedResultIndex}
          on:click={() => selectResult(index)}
          on:keydown={(event) => handleKeyDown(event)} 
          role="button"
          tabindex="0"
        >
          {result.name}, {result.adminName ? result.adminName + ", " : ""} {result.country}
        </div>
      {/each}
    </div>
  {/if}

  {#if searchTerm.length > 0}
    <div 
      class="clear-button" 
      aria-label="Clear Search" 
      role="button" 
      tabindex="0"
      on:click={clearSearch}
      on:keydown={clearSearch}
    >
      &#10006;
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Tailwind CSS classes */
  .search-container {
    @apply relative w-80 m-1;
  }

  .search-input {
    @apply w-full p-4 rounded bg-opacity-5 bg-surface-500 text-base;
  }

  .search-results {
    @apply absolute top-full left-0 w-full border border-solid border-gray-300 shadow bg-surface-500 max-h-52 overflow-auto z-10;
  }

  .result-item {
    @apply p-4 cursor-pointer;
  }

  .result-item:hover, .result-item.selected {
    @apply bg-surface-300;
  }

  .clear-button {
    @apply absolute right-0 top-0 flex items-center h-full p-2 cursor-pointer;
  }
</style>
