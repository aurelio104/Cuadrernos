AFRAME.registerComponent('mindar-video-handler', {
  init: function () {
    const el = this.el;
    const markerAttr = el.getAttribute('mindar-image-target');
    const markerId = parseInt(markerAttr?.targetIndex || 0, 10);

    const videoId = `video-${markerId + 1}`;
    const videoSrc = `assets/videos/video${markerId + 1}.mp4`;
    const markerInfo = document.getElementById("marker-info");

    let videoEl = null;
    let plane = null;
    let isVideoReady = false;

    const createAndPlayVideo = async () => {
      // Evitar múltiples cargas
      if (isVideoReady) return;
      isVideoReady = true;

      // Crear el elemento <video> dinámicamente
      videoEl = document.createElement("video");
      videoEl.setAttribute("id", videoId);
      videoEl.setAttribute("src", videoSrc);
      videoEl.setAttribute("loop", true);
      videoEl.setAttribute("muted", true);
      videoEl.setAttribute("playsinline", true);
      videoEl.setAttribute("webkit-playsinline", true);
      videoEl.setAttribute("crossorigin", "anonymous");
      videoEl.style.display = "none"; // Oculto, será usado en textura
      document.body.appendChild(videoEl);

      // Crear el plano de proyección del video
      plane = document.createElement("a-video");
      plane.setAttribute("src", `#${videoId}`);
      plane.setAttribute("width", "1");
      plane.setAttribute("height", "1.5");
      plane.setAttribute("position", "0 0 0");
      plane.setAttribute("rotation", "0 0 0");
      el.appendChild(plane);

      try {
        await videoEl.play();
        console.log(`▶️ Reproduciendo video ${videoId}`);
      } catch (err) {
        console.warn(`⚠️ Error al reproducir ${videoId}`, err);
      }
    };

    el.addEventListener('targetFound', () => {
      console.log(`✅ Marcador detectado: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${markerId}`;

      createAndPlayVideo();
    });

    el.addEventListener('targetLost', () => {
      console.log(`🕳️ Marcador perdido: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;

      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  }
});

// 🔁 Inicializa los 22 marcadores automáticamente
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
