document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video-1");
  const plane = document.getElementById("video-plane");
  const startButton = document.getElementById("start-ar");
  const markerInfo = document.getElementById("marker-info");
  const marker = document.getElementById("custom-marker");

  marker.addEventListener("markerFound", () => {
    console.log("✅ Marcador detectado");
    markerInfo.innerText = "Marcador detectado";
    startButton.style.display = "block";

    startButton.onclick = () => {
      video.play().then(() => {
        console.log("▶️ Video reproduciéndose");
        startButton.style.display = "none";
      }).catch(err => {
        console.warn("⚠️ No se pudo reproducir el video", err);
      });
    };
  });

  marker.addEventListener("markerLost", () => {
    console.log("🕳️ Marcador perdido");
    markerInfo.innerText = "Marcador: ---";
    startButton.style.display = "none";
    video.pause();
    video.currentTime = 0;
  });
});
