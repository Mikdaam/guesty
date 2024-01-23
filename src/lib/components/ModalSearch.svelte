<script lang="ts">
  import { onMount, type SvelteComponent } from "svelte";
  import { getModalStore, getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
  import Search from "./Search.svelte";
  import { selectedCity } from "$lib/utils/store";
  
  // Props
  /** Exposes parent props to this component. */
  export let parent: SvelteComponent;

  // Local
  const modalStore = getModalStore();
  const toastStore = getToastStore();

  function successToast() {
    const t: ToastSettings = {
      message: "City added successfully",
      background: "bg-green-500",
    };

    modalStore.close();
    toastStore.trigger(t);
  }

  function errorToast() {
    const t: ToastSettings = {
      message: "Failed to add city",
      background: "bg-red-500",
    };

    modalStore.close();
    toastStore.trigger(t);
  }

  function infoToast() {
    const t: ToastSettings = {
      message: "You must select a city",
      background: "bg-blue-500",
    };

    toastStore.trigger(t);
  }

  // Handle Form Submission
  async function onFormSubmit(): Promise<void> {
    const city = $selectedCity;

    if (city) {
      try {
        const response = await fetch("/api/internal/addCity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cityId: city.id }),
        });

        if (response.ok) {
          successToast();
        } else {
          errorToast();
        }
      } catch (error) {
        errorToast();
      }
    } else {
      infoToast();
    }
  }

  onMount(() => {
    selectedCity.set(null);
  });

  // Base Classes
  const cBase = "card p-4 w-modal shadow-xl space-y-4";
  const cHeader = "text-2xl font-bold";
</script>

{#if $modalStore[0]}
  <div class="modal-example-form {cBase}">
    <header class={cHeader}>{$modalStore[0].title ?? "(title missing)"}</header>
    <article>{$modalStore[0].body ?? "(body missing)"}</article>
    <Search />
    <!-- prettier-ignore -->
    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Add city</button>
    </footer>
  </div>
{/if}
