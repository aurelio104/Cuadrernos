document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const TOTAL_MARCADORES = 22;

  for (let i = 0; i < TOTAL_MARCADORES; i++) {
    const targetIndex = i;
    const target = document.createElement("a-entity");
    target.setAttribute("mindar-image-target", `targetIndex: ${targetIndex}`);

    let videoEl = null;
    let plane = null;
    const videoId = `video-${targetIndex + 1}`;
    const videoSrc = `assets/videos/video${targetIndex + 1}.mp4`;

    // ✅ Cuando se detecta el marcador
    target.addEventListener("targetFound", async () => {
      console.log(`✅ Marcador detectado: targetIndex = ${targetIndex}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${targetIndex}`;

      // Crear el video solo si aún no existe
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

      // Crear el plano de reproducción si aún no existe
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
        console.log(`▶️ Video ${videoId} reproducido`);
      } catch (err) {
        console.warn(`⚠️ No se pudo reproducir el video: ${videoId}`, err);
      }
    });

    // 🔁 Cuando se pierde el marcador
    target.addEventListener("targetLost", () => {
      console.log(`🕳️ Marcador perdido: targetIndex = ${targetIndex}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;

      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });

    // Agregar el target a la escena
    scene.appendChild(target);
  }
});
