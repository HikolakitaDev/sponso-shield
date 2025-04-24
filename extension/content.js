
function waitForYouTubePlayer() {
    if (document.querySelector('video')) {
      initializeSkipButton();
    } else {
      setTimeout(waitForYouTubePlayer, 1000);
    }
  }

  function initializeSkipButton() {
    const videoElement = document.querySelector('video');
    let skipButtonShown = false;
    let skipButton = null;

    function checkAndShowSkipButton() {
      if (videoElement.currentTime >= 60 && videoElement.currentTime < 65 && !skipButtonShown) {
        showSkipButton();
        skipButtonShown = true;
      }

      if (videoElement.currentTime < 60 && skipButtonShown) {
        hideSkipButton();
        skipButtonShown = false;
      }

      if (videoElement.currentTime > 75 && skipButtonShown) {
        hideSkipButton();
        skipButtonShown = false;
      }
    }

    function showSkipButton() {
      if (!skipButton) {
        skipButton = document.createElement('div');
        skipButton.className = 'yt-skip-button';
        skipButton.innerHTML = '<span>Skip to 1:30 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>';

        skipButton.addEventListener('click', function() {
          videoElement.currentTime = 90; 
          hideSkipButton();
        });

        const playerContainer = document.querySelector('.html5-video-container') || document.querySelector('.ytp-player-content');
        if (playerContainer) {
          playerContainer.appendChild(skipButton);
        } else {
          document.body.appendChild(skipButton);
        }

        setTimeout(() => {
          skipButton.style.opacity = '1';
          skipButton.style.transform = 'translateY(0)';
        }, 10);
      }
    }

    function hideSkipButton() {
      if (skipButton) {
        skipButton.style.opacity = '0';
        skipButton.style.transform = 'translateY(10px)';

        setTimeout(() => {
          if (skipButton && skipButton.parentNode) {
            skipButton.parentNode.removeChild(skipButton);
            skipButton = null;
          }
        }, 300); 
      }
    }

    const timeInterval = setInterval(checkAndShowSkipButton, 250);

    function resetOnNewVideo() {
      skipButtonShown = false;
      if (skipButton && skipButton.parentNode) {
        skipButton.parentNode.removeChild(skipButton);
        skipButton = null;
      }
    }

    const urlObserver = new MutationObserver(function(mutations) {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        resetOnNewVideo();
      }
    });

    let lastUrl = window.location.href;
    urlObserver.observe(document.querySelector('head > title'), { subtree: true, characterData: true, childList: true });

    window.addEventListener('beforeunload', function() {
      clearInterval(timeInterval);
      urlObserver.disconnect();
    });
  }

  waitForYouTubePlayer();
 
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(waitForYouTubePlayer, 1500); 
    }
  }).observe(document, {subtree: true, childList: true});