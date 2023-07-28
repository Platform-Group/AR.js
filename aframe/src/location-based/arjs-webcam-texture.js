import * as AFRAME from "aframe";
import * as THREE from "three";

AFRAME.registerComponent("arjs-webcam-texture", {
  init: function () {
    this.scene = this.el.sceneEl;
    this.texCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
    this.texScene = new THREE.Scene();

    this.scene.renderer.autoClear = false;
    this.video = document.createElement("video");
    this.video.setAttribute("autoplay", true);
    this.video.setAttribute("playsinline", true);
    this.video.setAttribute("display", "none");
    document.body.appendChild(this.video);
    console.log('data by geom ', this)
    
    const constraints = {
      video: {
        facingMode: "environment",
        width: { ideal: 1920 }, 
        height: { ideal: 1080 }
      },
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      let streamSettings = stream.getVideoTracks()[0].getSettings()

      
      let sourceAspectRatio = streamSettings.width / streamSettings.height;
      let displayAspectRatio = window.innerWidth / window.innerHeight;
      let geomX = 1;
      let geomY = 1;
      if (displayAspectRatio > sourceAspectRatio) {
          // Display is wider than source
          geomX = sourceAspectRatio / displayAspectRatio;
      } else {
          // Display is taller than source
          geomY = displayAspectRatio / sourceAspectRatio;
      }
      this.geom = new THREE.PlaneBufferGeometry(geomX, geomY);
      this.texture = new THREE.VideoTexture(this.video);
      this.material = new THREE.MeshBasicMaterial({ map: this.texture });
      const mesh = new THREE.Mesh(this.geom, this.material);
      this.texScene.add(mesh);
    })
  },

  play: function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch((e) => {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            `Webcam error: ${e}`
          );
        });
    } else {
      this.el.sceneEl.systems["arjs"]._displayErrorPopup(
        "sorry - media devices API not supported"
      );
    }
  },

  tick: function () {
    this.scene.renderer.clear();
    this.scene.renderer.render(this.texScene, this.texCamera);
    this.scene.renderer.clearDepth();
  },

  pause: function () {
    this.video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
  },

  remove: function () {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  },
});
