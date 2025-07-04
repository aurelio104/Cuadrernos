// Evita doble registro del componente
if (!AFRAME.components['mindar-video-handler']) {
  AFRAME.registerComponent('mindar-video-handler', {
    init: function () {
      const el = this.el;
      const markerId = parseInt(el.getAttribute('mindar-image-target').targetIndex, 10);
      const videoId = `video-${markerId + 1}`;
      const videoSrc = `assets/videos/video${markerId + 1}.mp4`;
      const markerInfo = document.getElementById("marker-info");
      const startButton = document.getElementById("start-ar");

      let videoEl = null;
      let plane = null;
      let hasStarted = false;

      el.addEventListener('targetFound', () => {
        console.log(`✅ Marcador detectado: ${markerId}`);
        if (markerInfo) markerInfo.innerText = `Marcador: ${markerId}`;
        startButton.style.display = "block";

        // Solo definimos el click si aún no se ha lanzado para este marcador
        if (!hasStarted) {
          startButton.onclick = async () => {
            startButton.style.display = "none";
            hasStarted = true;

            // Crear y configurar el <video>
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

            // Crear el plano
            plane = document.createElement("a-video");
            plane.setAttribute("src", `#${videoId}`);
            plane.setAttribute("width", "1");
            plane.setAttribute("height", "1.5");
            plane.setAttribute("position", "0 0 0");
            el.appendChild(plane);

            // Intentar reproducir
            try {
              await videoEl.play();
              console.log(`▶️ Video ${videoId} en reproducción`);
            } catch (err) {
              console.warn(`⚠️ Error al reproducir ${videoId}`, err);
            }
          };
        }
      });

      el.addEventListener('targetLost', () => {
        console.log(`🕳️ Marcador perdido: ${markerId}`);
        if (markerInfo) markerInfo.innerText = "Marcador: ---";
        startButton.style.display = "none";

        if (videoEl) {
          videoEl.pause();
          videoEl.currentTime = 0;
        }
      });
    }
  });
}

// Al iniciar el documento, registrar los 22 marcadores
document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const totalMarkers = 22;
  for (let i = 0; i < totalMarkers; i++) {
    const entity = document.createElement("a-entity");
    entity.setAttribute("mindar-image-target", `targetIndex: ${i}`);
    entity.setAttribute("mindar-video-handler", "");
    scene.appendChild(entity);
  }
});
