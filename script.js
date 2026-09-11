const openTriggers = document.querySelectorAll("[data-window]");
const windows = document.querySelectorAll(".window");
const statusClock = document.querySelector(".status-clock");

let topZIndex = 10;

openTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openWindow(trigger.dataset.window);
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWindow(trigger.dataset.window);
    }
  });
});

windows.forEach((windowElement) => {
  const closeButton = windowElement.querySelector(".window-close");
  const titlebar = windowElement.querySelector(".window-titlebar");

  closeButton.addEventListener("click", () => {
    windowElement.classList.remove("is-open");
  });

  windowElement.addEventListener("pointerdown", () => {
    bringToFront(windowElement);
  });

  titlebar.addEventListener("pointerdown", (event) => {
    startDragging(event, windowElement);
  });
});

function openWindow(windowId) {
  const targetWindow = document.getElementById(windowId);

  if (targetWindow) {
    targetWindow.classList.add("is-open");
    bringToFront(targetWindow);
  }
}

function bringToFront(windowElement) {
  topZIndex += 1;
  windowElement.style.zIndex = topZIndex;
}

function startDragging(event, windowElement) {
  if (event.target.closest("button")) {
    return;
  }

  const startX = event.clientX;
  const startY = event.clientY;
  const startLeft = windowElement.offsetLeft;
  const startTop = windowElement.offsetTop;

  bringToFront(windowElement);

  function moveWindow(moveEvent) {
    const newLeft = startLeft + moveEvent.clientX - startX;
    const newTop = startTop + moveEvent.clientY - startY;

    windowElement.style.left = `${newLeft}px`;
    windowElement.style.top = `${newTop}px`;
  }

  function stopDragging() {
    window.removeEventListener("pointermove", moveWindow);
    window.removeEventListener("pointerup", stopDragging);
  }

  window.addEventListener("pointermove", moveWindow);
  window.addEventListener("pointerup", stopDragging);
}

function updateClock() {
  if (!statusClock) {
    return;
  }

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  statusClock.textContent = `${hours}:${minutes}`;
}

updateClock();
setInterval(updateClock, 1000);
