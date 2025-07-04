document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const startButton = document.getElementById("start-ar");
  const TOTAL_MARCADORES = 22;

  for (let i = 0; i < TOTAL_MARCADORES; i++) {
    const idx = i;
    const target = document.createElement("a-entity");
    target.setAttribute("mindar-image-target", `targetIndex: ${idx}`);

    let videoEl = null;
    let plane = null;
    const videoId = `video-${idx + 1}`;
    const videoSrc = `assets/videos/video${idx + 1}.mp4`;

    target.addEventListener("targetFound", () => {
      console.log(`✅ Marcador detectado: ${idx}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${idx}`;
      startButton.style.display = "block";

      // ⚠️ Definir el evento de clic al detectar el marcador
      startButton.onclick = async () => {
        startButton.style.display = "none";

        if (!videoEl) {
          videoEl = document.createElement("video");
          videoEl.setAttribute("id", videoId);
          videoEl.setAttribute("src", videoSrc);
          videoEl.setAttribute("loop", true);
          videoEl.setAttribute("muted", true);
          videoEl.setAttribute("playsinline", true);
          videoEl.setAttribute("webkit-playsinline", true);
          videoEl.setAttribute("crossorigin", "anonymous");
          videoEl.style.display = "none";
          document.body.appendChild(videoEl);
        }

        if (!plane) {
          plane = document.createElement("a-video");
          plane.setAttribute("src", `#${videoId}`);
          plane.setAttribute("width", "1");
          plane.setAttribute("height", "1.5");
          plane.setAttribute("position", "0 0 0");
          plane.setAttribute("rotation", "0 0 0");
          target.appendChild(plane);
        }

        try {
          await videoEl.play();
          console.log(`▶️ Video ${idx + 1} en reproducción`);
        } catch (err) {
          console.warn(`⚠️ No se pudo reproducir el video ${idx + 1}`, err);
        }
      };
    });

    target.addEventListener("targetLost", () => {
      console.log(`🕳️ Marcador perdido: ${idx}`);
      if (markerInfo) markerInfo.innerText = "Marcador: ---";
      startButton.style.display = "none";

      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });

    scene.appendChild(target);
  }
});
