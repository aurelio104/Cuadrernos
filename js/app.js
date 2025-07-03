document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const TOTAL_MARCADORES = 22;

  for (let i = 0; i < TOTAL_MARCADORES; i++) {
    const targetIndex = i;
    const target = document.createElement("a-entity");
    target.setAttribute("mindar-image-target", `targetIndex: ${targetIndex}`);

    const videoId = `video-${targetIndex + 1}`;
    const videoEl = document.getElementById(videoId);
    let plane = null;

    // ✅ Cuando se detecta el marcador
    target.addEventListener("targetFound", () => {
      console.log(`✅ Marcador detectado: targetIndex = ${targetIndex}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${targetIndex}`;

      // Crear el plano si no existe aún
      if (!plane) {
        plane = document.createElement("a-video");
        plane.setAttribute("src", `#${videoId}`);
        plane.setAttribute("width", "1");
        plane.setAttribute("height", "1.5");
        plane.setAttribute("position", "0 0 0");
        plane.setAttribute("rotation", "0 0 0");
        target.appendChild(plane);
      }

      // Intentar reproducir el video
      if (videoEl) {
        videoEl.play().then(() => {
          console.log(`▶️ Video ${videoId} en reproducción`);
        }).catch((err) => {
          console.warn(`⚠️ No se pudo reproducir el video: ${videoId}`, err);
        });
      }
    });

    // 🔁 Cuando se pierde el marcador
    target.addEventListener("targetLost", () => {
      console.log(`🕳️ Marcador perdido: targetIndex = ${targetIndex}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;

      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0; // Reiniciar el video
      }
    });

    // Agregar el target a la escena
    scene.appendChild(target);
  }
});
