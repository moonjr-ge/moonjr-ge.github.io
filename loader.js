(() => {
  const loader = document.querySelector("[data-site-loader]");

  if (!loader) {
    document.documentElement.classList.remove("is-loading");
    return;
  }

  const startedAt = performance.now();
  let isClosing = false;

  const delay = (milliseconds) => new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

  const finishLoader = async () => {
    if (isClosing) return;
    isClosing = true;

    const minimumDelay = Math.max(0, 500 - (performance.now() - startedAt));
    await delay(minimumDelay);

    loader.classList.add("is-complete");
    window.setTimeout(() => {
      document.documentElement.classList.remove("is-loading");
      loader.hidden = true;
    }, 340);
  };

  const waitForResources = async () => {
    if (document.readyState !== "complete") {
      await new Promise((resolve) => {
        window.addEventListener("load", resolve, { once: true });
      });
    }

    if (document.fonts?.ready) {
      await Promise.race([document.fonts.ready, delay(4000)]);
    }

    finishLoader();
  };

  waitForResources();
  window.setTimeout(finishLoader, 12000);
})();
