document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const TOTAL_MARCADORES = 22;

  for (let i = 0; i < TOTAL_MARCADORES; i++) {
    const idx = i;
    const target = document.createElement("a-entity");
    target.setAttribute("mindar-image-target", `targetIndex: ${idx}`);
    let videoEl, plane;

    target.addEventListener("targetFound", async () => {
      if (markerInfo) markerInfo.innerText = `Marcador: ${idx}`;
      if (!videoEl) {
        videoEl = document.createElement("video");
        videoEl.setAttribute("id", `video-${idx + 1}`);
        videoEl.src = `assets/videos/video${idx + 1}.mp4`;
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        videoEl.setAttribute("webkit-playsinline", true);
        videoEl.crossOrigin = "anonymous";
        videoEl.style.display = "none";
        document.body.appendChild(videoEl);
      }

      if (!plane) {
        plane = document.createElement("a-video");
        plane.setAttribute("src", `#video-${idx + 1}`);
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
        console.warn(`⚠️ Error al reproducir video ${idx + 1}`, err);
      }
    });

    target.addEventListener("targetLost", () => {
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });

    scene.appendChild(target);
  }
});
