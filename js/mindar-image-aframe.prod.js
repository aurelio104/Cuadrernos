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
    let isReady = false;

    // ⏱ Mostrar botón solo cuando se detecte el marcador
    el.addEventListener('targetFound', () => {
      console.log(`✅ Marcador detectado: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${markerId}`;
      startButton.style.display = "block";

      if (!isReady) {
        startButton.onclick = async () => {
          startButton.style.display = "none";
          isReady = true;

          // 🎥 Crear video dinámicamente
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

          // 🖼️ Crear plano una vez
          plane = document.createElement('a-video');
          plane.setAttribute('src', `#${videoId}`);
          plane.setAttribute('width', '1');
          plane.setAttribute('height', '1.5');
          plane.setAttribute('position', '0 0 0');
          plane.setAttribute('rotation', '0 0 0');
          el.appendChild(plane);

          try {
            await videoEl.play();
            console.log(`▶️ Reproduciendo: ${videoId}`);
          } catch (err) {
            console.warn(`⚠️ No se pudo reproducir el video ${videoId}`, err);
          }
        };
      }
    });

    // 🛑 Cuando se pierde el marcador
    el.addEventListener('targetLost', () => {
      console.log(`🕳️ Marcador perdido: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;
      startButton.style.display = "none";

      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  }
});

// 📦 Inicializar automáticamente los marcadores
document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const totalMarkers = 22;

  for (let i = 0; i < totalMarkers; i++) {
    const entity = document.createElement('a-entity');
    entity.setAttribute('mindar-image-target', `targetIndex: ${i}`);
    entity.setAttribute('mindar-video-handler', '');
    scene.appendChild(entity);
  }
});
