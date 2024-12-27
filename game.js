document.addEventListener("DOMContentLoaded", () => {
  // Game elements
  const gameContainer = document.querySelector(".game-container");
  const slider = document.querySelector(".slider");
  const sliderFrame = document.querySelector(".slider-frame");
  const zone = document.querySelector(".zone");
  const promptElement = document.querySelector(".prompt");

  // Ensure all elements are initialized
  if (!gameContainer || !slider || !sliderFrame || !zone) {
    console.error("One or more game elements are missing in the DOM.");
    return;
  }

  // Game variables
  let isMovingRight = true;
  let gameActive = false;
  let score = 0;
  let attempts = 0;
  const maxAttempts = 3;

  // Game settings
  const minZonePosition = 100; // Minimum position for the zone (px from left)
  let initialSpeed = 1.15; // Initial speed (adjust this to change starting speed)
  let currentSpeed = initialSpeed;
  const speedIncreasePercentage = 20; // Speed increase after each success (%)
  const requiredOverlap = 0.35; // 65% overlap required for success

  function showGame() {
    gameContainer.style.display = "block";
  }

  function hideGame() {
    gameContainer.style.display = "none";
  }

  function startGame() {
    gameActive = true;
    score = 0;
    attempts = 0;
    currentSpeed = initialSpeed; // Reset speed to initial value
    resetSliderPosition();
    setRandomZonePosition();
    moveSlider();
  }

  function setRandomZonePosition() {
    const maxPosition = sliderFrame.offsetWidth - zone.offsetWidth - 10;
    const randomPosition =
      Math.floor(Math.random() * (maxPosition - minZonePosition + 1)) +
      minZonePosition;
    zone.style.right = `${
      sliderFrame.offsetWidth - randomPosition - zone.offsetWidth
    }px`;
  }

  function resetSliderPosition() {
    slider.style.left = "0px";
    isMovingRight = true;
  }

  function moveSlider() {
    if (!gameActive) return;

    const sliderRect = slider.getBoundingClientRect();
    const frameRect = sliderFrame.getBoundingClientRect();

    if (isMovingRight) {
      let newPosition = sliderRect.left - frameRect.left + currentSpeed;
      if (newPosition + sliderRect.width > frameRect.width) {
        endGame(false);
        return;
      }
      slider.style.left = `${newPosition}px`;
    } else {
      let newPosition = sliderRect.left - frameRect.left - currentSpeed;
      if (newPosition < 0) {
        endGame(false);
        return;
      }
      slider.style.left = `${newPosition}px`;
    }

    requestAnimationFrame(moveSlider);
  }

  function checkPosition() {
    const sliderRect = slider.getBoundingClientRect();
    const zoneRect = zone.getBoundingClientRect();

    // Calculate the overlap
    const overlapStart = Math.max(sliderRect.left, zoneRect.left);
    const overlapEnd = Math.min(sliderRect.right, zoneRect.right);
    const overlapWidth = Math.max(0, overlapEnd - overlapStart);
    const sliderWidth = sliderRect.width;

    // Check if at least 65% of the slider is inside the zone
    if (overlapWidth / sliderWidth >= requiredOverlap) {
      score++;
      attempts++;
      showSliderGlow("success");

      if (attempts === maxAttempts) {
        endGame(true);
        return;
      }

      // Pause the game and prepare for the next round
      gameActive = false;
      setTimeout(() => {
        // Increase difficulty
        increaseDifficulty();

        // Reset slider position and move zone for next round
        resetSliderPosition();
        setRandomZonePosition();

        // Resume the game
        gameActive = true;
        moveSlider();
      }, 1000); // 1-second pause
    } else {
      endGame(false);
    }
  }

  function showSliderGlow(type) {
    slider.style.boxShadow =
      type === "success" ? "0 0 10px #00ff00" : "0 0 10px #ff0000";
    setTimeout(() => {
      slider.style.boxShadow = "";
    }, 500);
  }

  function increaseDifficulty() {
    // Increase speed by speedIncreasePercentage
    currentSpeed *= 2 + speedIncreasePercentage / 100;
  }

  function endGame(completed) {
    gameActive = false;
    showSliderGlow(completed ? "success" : "failure");
    setTimeout(() => {
      hideGame();
      //   sendGameResult(completed);
    }, 600);
  }

  function sendGameResult(success) {
    fetch(`https://${GetParentResourceName()}/gameComplete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        success: success,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Game result sent to client script");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Event listeners
  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "e" && gameActive) {
      checkPosition();
    }
  });

  // Automatically show and start the game when DOM is ready
  showGame();
  startGame();
});
