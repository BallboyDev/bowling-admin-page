<script>
  import { onMount } from 'svelte';

  // The current value of the input, bound to the <input> element.
  let currentValue = '';
  // The initial value of the input, loaded from an API or set on component mount.
  let initialValue = '';
  // A flag to indicate if data is currently being saved.
  let isSaving = false;
  // A flag to indicate if the data has been changed by the user.
  let isDirty = false;

  // --- Life Cycle ---
  onMount(async () => {
    // Simulate fetching initial data from an API.
    const fetchedData = await fetchData();
    initialValue = fetchedData;
    currentValue = fetchedData;
  });

  // --- Functions ---

  /**
   * Simulates fetching data from an API.
   * @returns {Promise<string>}
   */
  async function fetchData() {
    // In a real application, you would fetch this data from your backend.
    console.log('Fetching initial data...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const data = 'Initial Data';
    console.log('Initial data fetched:', data);
    return data;
  }

  /**
   * Handles the input event on the text field.
   */
  function handleInput() {
    isDirty = currentValue !== initialValue;
  }

  /**
   * Preprocesses the data before saving.
   * @param {string} value The value to preprocess.
   * @returns {string} The preprocessed value.
   */
  function preprocessData(value) {
    // Example: trim whitespace from the input.
    return value.trim();
  }

  /**
   * Simulates calling an API to save the data.
   * @param {string} data The data to save.
   */
  async function saveToApi(data) {
    console.log('Calling API to save data:', data);
    isSaving = true;

    try {
      // Simulate an API call with a delay.
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Data saved successfully!');
      // After successful save, update the initial value and reset the dirty flag.
      initialValue = data;
      isDirty = false;
    } catch (error) {
      console.error('Failed to save data:', error);
      // Handle API errors here (e.g., show an error message to the user).
    } finally {
      isSaving = false;
    }
  }

  /**
   * Handles the save button click.
   */
  async function handleSave() {
    // 1. Preprocess the data.
    const processedValue = preprocessData(currentValue);

    // 2. Check if the data has actually changed after preprocessing.
    if (processedValue === initialValue) {
      console.log('Data has not changed. No need to save.');
      // Optionally, reset the input to the processed value if it was different
      // e.g. if the user only added whitespace.
      currentValue = processedValue;
      isDirty = false;
      return;
    }

    // 3. Call the API to save the data.
    await saveToApi(processedValue);
  }
</script>

<!-- HTML Template -->
<main>
  <h1>Input Change Handling Template</h1>

  <div class="input-container">
    <label for="data-input">Data:</label>
    <input
      type="text"
      id="data-input"
      bind:value={currentValue}
      on:input={handleInput}
      disabled={isSaving}
      placeholder="Enter data here"
    />
  </div>

  <div class="button-container">
    <button on:click={handleSave} disabled={!isDirty || isSaving}>
      {#if isSaving}
        Saving...
      {:else if isDirty}
        Save Changes
      {:else}
        No Changes to Save
      {/if}
    </button>
  </div>

  <div class="info">
    <p>Initial Value: {initialValue}</p>
    <p>Current Value: {currentValue}</p>
    <p>Is Dirty (changed): {isDirty}</p>
  </div>
</main>

<style>
  main {
    font-family: sans-serif;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }
  .input-container {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    box-sizing: border-box;
  }
  .button-container {
    text-align: right;
  }
  button {
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
  }
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  .info {
    margin-top: 20px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }
</style>
