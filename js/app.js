document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const startButton = document.getElementById("start-ar");
  const TOTAL_MARCADORES = 22;

  let activeIdx = null;
  let activeVideo = null;
  let activePlane = null;

  for (let i = 0; i < TOTAL_MARCADORES; i++) {
    const idx = i;
    const target = document.createElement("a-entity");
    target.setAttribute("mindar-image-target", `targetIndex: ${idx}`);

    target.addEventListener("targetFound", () => {
      console.log(`✅ Marcador detectado: ${idx}`);
      markerInfo.innerText = `Marcador: ${idx}`;
      startButton.style.display = "block";
      activeIdx = idx;
    });

    target.addEventListener("targetLost", () => {
      console.log(`🕳️ Marcador perdido: ${idx}`);
      markerInfo.innerText = "Marcador: ---";
      startButton.style.display = "none";

      if (activeVideo) {
        activeVideo.pause();
        activeVideo.currentTime = 0;
      }

      activeIdx = null;
    });

    scene.appendChild(target);
  }

  // 🎬 Reproducir video solo cuando el usuario presione el botón
  startButton.addEventListener("click", async () => {
    if (activeIdx === null) return;

    const videoId = `video-${activeIdx + 1}`;
    const videoSrc = `assets/videos/video${activeIdx + 1}.mp4`;

    // Si el video no existe aún, lo creamos dinámicamente
    if (!activeVideo || activeVideo.id !== videoId) {
      if (activeVideo) activeVideo.remove(); // elimina el anterior

      activeVideo = document.createElement("video");
      activeVideo.setAttribute("id", videoId);
      activeVideo.setAttribute("src", videoSrc);
      activeVideo.setAttribute("loop", true);
      activeVideo.setAttribute("muted", true);
      activeVideo.setAttribute("playsinline", true);
      activeVideo.setAttribute("webkit-playsinline", true);
      activeVideo.setAttribute("crossorigin", "anonymous");
      activeVideo.style.display = "none";
      document.body.appendChild(activeVideo);
    }

    // Buscamos o creamos el plano de proyección del video
    const currentTarget = scene.querySelector(`[mindar-image-target="targetIndex: ${activeIdx}"]`);

    if (!activePlane || !currentTarget.contains(activePlane)) {
      if (activePlane) activePlane.remove();

      activePlane = document.createElement("a-video");
      activePlane.setAttribute("src", `#${videoId}`);
      activePlane.setAttribute("width", "1");
      activePlane.setAttribute("height", "1.5");
      activePlane.setAttribute("position", "0 0 0");
      activePlane.setAttribute("rotation", "0 0 0");
      currentTarget.appendChild(activePlane);
    }

    try {
      await activeVideo.play();
      console.log(`▶️ Video ${videoId} en reproducción`);
    } catch (err) {
      console.warn(`⚠️ No se pudo reproducir el video ${videoId}`, err);
    }

    startButton.style.display = "none";
  });
});
