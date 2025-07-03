document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const TOTAL_MARCADORES = 22;

  for (let i = 0; i < TOTAL_MARCADORES; i++) {
    const target = document.createElement("a-entity");
    target.setAttribute("mindar-image-target", `targetIndex: ${i}`);

    const videoId = `video-${i + 1}`;
    const videoEl = document.getElementById(videoId);
    let plane = null;

    target.addEventListener("targetFound", () => {
      console.log(`✅ Marcador detectado: targetIndex = ${i}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${i}`;

      if (!plane) {
        plane = document.createElement("a-video");
        plane.setAttribute("src", `#${videoId}`);
        plane.setAttribute("width", "1");
        plane.setAttribute("height", "1.5");
        plane.setAttribute("position", "0 0 0");
        plane.setAttribute("rotation", "0 0 0");
        target.appendChild(plane);
      }

      if (videoEl) {
        videoEl.play().catch((err) => {
          console.warn(`⚠️ No se pudo reproducir el video: ${videoId}`, err);
        });
      }
    });

    target.addEventListener("targetLost", () => {
      console.log(`🕳️ Marcador perdido: targetIndex = ${i}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;
      if (videoEl) videoEl.pause();
    });

    scene.appendChild(target);
  }
});
