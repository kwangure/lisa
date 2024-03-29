/**
 * Focus the tab in which the function is called from. Native `window.focus()`
 * calls are ignored by most browsers.
 * @returns {Promise<void>} A promise that resolves when the tab is focused
 */
export async function focus() {
    // Get the tab and window this script is running in
    const { id: tab_id, windowId: window_id } = await chrome.tabs.getCurrent();

    // In case the window running this script is not the active window,
    // Switch to this tab first, then the window so that the user only sees
    // the window switch
    await chrome.tabs.update(tab_id, { active: true, highlighted: true });
    await chrome.windows.update(window_id, { focused: true });
}

/**
 * Navigate a tab to a url
 * @param {number} tab_id The unique identifier for the tab
 * @param {string} url The url to navigate the tab with that id to
 * @returns {Promise<void>} A promise that resolves when navigation is completed
 */
export async function navigate(tab_id, url) {
    await chrome.tabs.update(tab_id, { url });
}
