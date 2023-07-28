(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aframe"), require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["aframe", "three"], factory);
	else if(typeof exports === 'object')
		exports["ARjs"] = factory(require("aframe"), require("three"));
	else
		root["ARjs"] = factory(root["AFRAME"], root["THREE"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_aframe__, __WEBPACK_EXTERNAL_MODULE_three__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe/src/location-based/arjs-webcam-texture.js":
/*!**********************************************************!*\
  !*** ./aframe/src/location-based/arjs-webcam-texture.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-webcam-texture", {
  init: function () {
    this.scene = this.el.sceneEl;
    this.texCamera = new three__WEBPACK_IMPORTED_MODULE_1__.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
    this.texScene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();

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
      this.geom = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneBufferGeometry(geomX, geomY);
      this.texture = new three__WEBPACK_IMPORTED_MODULE_1__.VideoTexture(this.video);
      this.material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: this.texture });
      const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(this.geom, this.material);
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


/***/ }),

/***/ "./aframe/src/new-location-based/arjs-device-orientation-controls.js":
/*!***************************************************************************!*\
  !*** ./aframe/src/new-location-based/arjs-device-orientation-controls.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/**
 * arjs-device-orientation-controls
 *
 * Replaces the standard look-controls component to provide mobile device
 * orientation controls.
 *
 * A lightweight A-Frame wrapper round the modified three.js
 * DeviceOrientationControls used in the three.js location-based API.
 *
 * Creates the THREE object using using the three.js camera, and allows update
 * of the smoothing factor.
 */



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-device-orientation-controls", {
  schema: {
    smoothingFactor: {
      type: "number",
      default: 1,
    },
  },

  init: function () {
    this._orientationControls = new THREEx.DeviceOrientationControls(
      this.el.object3D
    );
  },

  update: function () {
    this._orientationControls.smoothingFactor = this.data.smoothingFactor;
  },

  tick: function () {
    this._orientationControls.update();
  },
});


/***/ }),

/***/ "./aframe/src/new-location-based/gps-new-camera.js":
/*!*********************************************************!*\
  !*** ./aframe/src/new-location-based/gps-new-camera.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _three_js_build_ar_threex_location_only_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../three.js/build/ar-threex-location-only.js */ "./three.js/build/ar-threex-location-only.js");
/* harmony import */ var _three_js_build_ar_threex_location_only_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_three_js_build_ar_threex_location_only_js__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-new-camera", {
  schema: {
    simulateLatitude: {
      type: "number",
      default: 0,
    },
    simulateLongitude: {
      type: "number",
      default: 0,
    },
    simulateAltitude: {
      type: "number",
      default: -Number.MAX_VALUE,
    },
    gpsMinDistance: {
      type: "number",
      default: 0,
    },
    positionMinAccuracy: {
      type: "number",
      default: 100,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
    initialPositionAsOrigin: {
      type: "boolean",
      default: false,
    },
  },

  init: function () {
    this._testForOrientationControls();

    this.threeLoc = new _three_js_build_ar_threex_location_only_js__WEBPACK_IMPORTED_MODULE_1__.LocationBased(
      this.el.sceneEl.object3D,
      this.el.object3D,
      {
        initialPositionAsOrigin: this.data.initialPositionAsOrigin,
      }
    );

    this.threeLoc.on("gpsupdate", (gpspos) => {
      this._currentPosition = {
        longitude: gpspos.coords.longitude,
        latitude: gpspos.coords.latitude,
      };
      this._sendGpsUpdateEvent(gpspos.coords.longitude, gpspos.coords.latitude);
    });

    this.threeLoc.on("gpserror", (code) => {
      const msg = [
        "User denied access to GPS.",
        "GPS satellites not available.",
        "Timeout communicating with GPS satellites - try moving to a more open area.",
      ];
      if (code >= 1 && code <= 3) {
        this._displayError(msg[code - 1]);
      } else {
        this._displayError(`Unknown geolocation error code ${code}.`);
      }
    });

    // Use arjs-device-orientation-controls on mobile only, with standard
    // look-controls disabled (this interferes with the readings from the
    // sensors). On desktop, use standard look-controls instead.

    // const mobile = this._isMobile();
    // this.el.setAttribute("look-controls-enabled", !mobile);
    // if (mobile) {
    //   this.el.setAttribute("arjs-device-orientation-controls", true);
    // }

    // from original gps-camera component
    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      this._setupSafariOrientationPermissions();
    }

    this.el.sceneEl.addEventListener("gps-entity-place-added", (e) => {
      const entityPlace = e.detail.component.components["gps-new-entity-place"];
      if (this._currentPosition) {
        entityPlace.setDistanceFrom(this._currentPosition);
      }
    });
  },

  update: function (oldData) {
    this.threeLoc.setGpsOptions({
      gpsMinAccuracy: this.data.positionMinAccuracy,
      gpsMinDistance: this.data.gpsMinDistance,
      maximumAge: this.data.gpsTimeInterval,
    });
    if (
      (!this.data.fakeGpsStarted) &&
      (this.data.simulateLatitude !== 0 || this.data.simulateLongitude !== 0) &&
      (this.data.simulateLatitude != oldData.simulateLatitude ||
        this.data.simulateLongitude != oldData.simulateLongitude)
    ) {
      this.threeLoc.stopGps();
      this.threeLoc.fakeGps(
        this.data.simulateLongitude,
        this.data.simulateLatitude
      );
      this.data.fakeGpsStarted = true
    }
    if (this.data.simulateAltitude > -Number.MAX_VALUE) {
      this.threeLoc.setElevation(this.data.simulateAltitude + 1.6);
    }
  },

  play: function () {
    if (this.data.simulateLatitude === 0 && this.data.simulateLongitude === 0) {
      this.threeLoc.startGps();
    }
  },

  pause: function () {
    this.threeLoc.stopGps();
  },

  latLonToWorld: function (lat, lon) {
    return this.threeLoc.lonLatToWorldCoords(lon, lat);
  },

  getInitialPosition: function () {
    return this.threeLoc.initialPosition;
  },

  _sendGpsUpdateEvent: function (lon, lat) {
    this.el.emit("gps-camera-update-position", {
      position: {
        longitude: lon,
        latitude: lat,
      },
    });
  },

  _testForOrientationControls: function () {
    const msg =
      "WARNING - No orientation controls component, app will not respond to device rotation.";
    if (
      !this.el.components["arjs-device-orientation-controls"] &&
      !this.el.components["look-controls"]
    ) {
      this._displayError(msg);
    }
  },

  _displayError: function (error) {
    const arjs = this.el.sceneEl.systems["arjs"];
    if (arjs) {
      arjs._displayErrorPopup(error);
    } else {
      alert(error);
    }
  },

  // from original gps-camera component
  _setupSafariOrientationPermissions: function () {
    // iOS 13+
    if (
      typeof window.DeviceOrientationEvent?.requestPermission === "function"
    ) {
      var handler = function () {
        console.log("Requesting device orientation permissions...");
        DeviceOrientationEvent.requestPermission();
        document.removeEventListener("touchend", handler);
      };

      document.addEventListener(
        "touchend",
        function () {
          handler();
        },
        false
      );

      this.el.sceneEl.systems["arjs"]._displayErrorPopup(
        "After camera permission prompt, please tap the screen to activate geolocation."
      );
    } else {
      var timeout = setTimeout(() => {
        this.el.sceneEl.systems["arjs"]._displayErrorPopup(
          "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
        );
      }, 750);
      window.addEventListener(
        "deviceorientation",
        function () {
          clearTimeout(timeout);
        },
        { once: true }
      );
    }
  },

  _isMobile: function () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      return true;
    }
    return false;
  },
});


/***/ }),

/***/ "./aframe/src/new-location-based/gps-new-entity-place.js":
/*!***************************************************************!*\
  !*** ./aframe/src/new-location-based/gps-new-entity-place.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_1__.registerComponent("gps-new-entity-place", {
  schema: {
    longitude: {
      type: "number",
      default: 0,
    },
    latitude: {
      type: "number",
      default: 0,
    },
  },

  init: function () {
    const camera = document.querySelector("[gps-new-camera]");
    if (!camera.components["gps-new-camera"]) {
      console.error("gps-new-camera not initialised");
      return;
    }
    this._cameraGps = camera.components["gps-new-camera"];

    camera.addEventListener("gps-camera-update-position", (e) => {
      this.distance = this._haversineDist(e.detail.position, this.data);
    });

    this.el.sceneEl.emit("gps-entity-place-added", {
      component: this.el,
    });
  },

  update: function () {
    const projCoords = this._cameraGps.threeLoc.lonLatToWorldCoords(
      this.data.longitude,
      this.data.latitude
    );
    this.el.object3D.position.set(
      projCoords[0],
      this.el.object3D.position.y,
      projCoords[1]
    );
  },

  setDistanceFrom: function (position) {
    this.distance = this._haversineDist(position, this.data);
  },

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from gps-camera
   */
  _haversineDist: function (src, dest) {
    const dlongitude = three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(dest.longitude - src.longitude);
    const dlatitude = three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(src.latitude)) *
        Math.cos(three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },
});


/***/ }),

/***/ "./three.js/build/ar-threex-location-only.js":
/*!***************************************************!*\
  !*** ./three.js/build/ar-threex-location-only.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(/*! three */ "three"));
	else {}
})(this, (__WEBPACK_EXTERNAL_MODULE_three__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./three.js/src/location-based/js/device-orientation-controls.js":
/*!***********************************************************************!*\
  !*** ./three.js/src/location-based/js/device-orientation-controls.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_904__) => {

__nested_webpack_require_904__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_904__.d(__nested_webpack_exports__, {
/* harmony export */   DeviceOrientationControls: () => (/* binding */ DeviceOrientationControls)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_904__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_904__.n(three__WEBPACK_IMPORTED_MODULE_0__);
// Modified version of THREE.DeviceOrientationControls from three.js
// will use the deviceorientationabsolute event if available



const _zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1);
const _euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();
const _q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();
const _q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

const _changeEvent = { type: "change" };

class DeviceOrientationControls extends three__WEBPACK_IMPORTED_MODULE_0__.EventDispatcher {
  constructor(object) {
    super();

    if (window.isSecureContext === false) {
      console.error(
        "THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)"
      );
    }

    const scope = this;

    const EPS = 0.000001;
    const lastQuaternion = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alphaOffset = 0; // radians

    this.TWO_PI = 2 * Math.PI;
    this.HALF_PI = 0.5 * Math.PI;
    this.orientationChangeEventName =
      "ondeviceorientationabsolute" in window
        ? "deviceorientationabsolute"
        : "deviceorientation";

    this.smoothingFactor = 1;

    const onDeviceOrientationChangeEvent = function (event) {
      scope.deviceOrientation = event;
    };

    const onScreenOrientationChangeEvent = function () {
      scope.screenOrientation = window.orientation || 0;
    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    const setObjectQuaternion = function (
      quaternion,
      alpha,
      beta,
      gamma,
      orient
    ) {
      _euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(_euler); // orient the device

      quaternion.multiply(_q1); // camera looks out the back of the device, not the top

      quaternion.multiply(_q0.setFromAxisAngle(_zee, -orient)); // adjust for screen orientation
    };

    this.connect = function () {
      onScreenOrientationChangeEvent(); // run once on load

      // iOS 13+

      if (
        window.DeviceOrientationEvent !== undefined &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        window.DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener(
                "orientationchange",
                onScreenOrientationChangeEvent
              );
              window.addEventListener(
                scope.orientationChangeEventName,
                onDeviceOrientationChangeEvent
              );
            }
          })
          .catch(function (error) {
            console.error(
              "THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:",
              error
            );
          });
      } else {
        window.addEventListener(
          "orientationchange",
          onScreenOrientationChangeEvent
        );
        window.addEventListener(
          scope.orientationChangeEventName,
          onDeviceOrientationChangeEvent
        );
      }

      scope.enabled = true;
    };

    this.disconnect = function () {
      window.removeEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent
      );
      window.removeEventListener(
        scope.orientationChangeEventName,
        onDeviceOrientationChangeEvent
      );

      scope.enabled = false;
    };

    this.update = function () {
      if (scope.enabled === false) return;

      const device = scope.deviceOrientation;

      if (device) {
        let alpha = device.alpha
          ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.alpha) + scope.alphaOffset
          : 0; // Z

        let beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.beta) : 0; // X'

        let gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.gamma) : 0; // Y''

        const orient = scope.screenOrientation
          ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(scope.screenOrientation)
          : 0; // O

        if (this.smoothingFactor < 1) {
          if (this.lastOrientation) {
            const k = this.smoothingFactor;
            alpha = this._getSmoothedAngle(
              alpha,
              this.lastOrientation.alpha,
              k
            );
            beta = this._getSmoothedAngle(
              beta + Math.PI,
              this.lastOrientation.beta,
              k
            );
            gamma = this._getSmoothedAngle(
              gamma + this.HALF_PI,
              this.lastOrientation.gamma,
              k,
              Math.PI
            );
          } else {
            beta += Math.PI;
            gamma += this.HALF_PI;
          }

          this.lastOrientation = {
            alpha: alpha,
            beta: beta,
            gamma: gamma,
          };
        }

        setObjectQuaternion(
          scope.object.quaternion,
          alpha,
          this.smoothingFactor < 1 ? beta - Math.PI : beta,
          this.smoothingFactor < 1 ? gamma - this.HALF_PI : gamma,
          orient
        );

        if (8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
          lastQuaternion.copy(scope.object.quaternion);
          scope.dispatchEvent(_changeEvent);
        }
      }
    };

    // NW Added
    this._orderAngle = function (a, b, range = this.TWO_PI) {
      if (
        (b > a && Math.abs(b - a) < range / 2) ||
        (a > b && Math.abs(b - a) > range / 2)
      ) {
        return { left: a, right: b };
      } else {
        return { left: b, right: a };
      }
    };

    // NW Added
    this._getSmoothedAngle = function (a, b, k, range = this.TWO_PI) {
      const angles = this._orderAngle(a, b, range);
      const angleshift = angles.left;
      const origAnglesRight = angles.right;
      angles.left = 0;
      angles.right -= angleshift;
      if (angles.right < 0) angles.right += range;
      let newangle =
        origAnglesRight == b
          ? (1 - k) * angles.right + k * angles.left
          : k * angles.right + (1 - k) * angles.left;
      newangle += angleshift;
      if (newangle >= range) newangle -= range;
      return newangle;
    };

    this.dispose = function () {
      scope.disconnect();
    };

    this.connect();
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/location-based.js":
/*!**********************************************************!*\
  !*** ./three.js/src/location-based/js/location-based.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_8390__) => {

__nested_webpack_require_8390__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_8390__.d(__nested_webpack_exports__, {
/* harmony export */   LocationBased: () => (/* binding */ LocationBased)
/* harmony export */ });
/* harmony import */ var _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_8390__(/*! ./sphmerc-projection.js */ "./three.js/src/location-based/js/sphmerc-projection.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_8390__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_8390__.n(three__WEBPACK_IMPORTED_MODULE_1__);



class LocationBased {
  constructor(scene, camera, options = {}) {
    this._scene = scene;
    this._camera = camera;
    this._proj = new _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__.SphMercProjection();
    this._eventHandlers = {};
    this._lastCoords = null;
    this._gpsMinDistance = 0;
    this._gpsMinAccuracy = 100;
    this._maximumAge = 0;
    this._watchPositionId = null;
    this.setGpsOptions(options);
    this.initialPosition = null;
    this.initialPositionAsOrigin = options.initialPositionAsOrigin || false;
  }

  setProjection(proj) {
    this._proj = proj;
  }

  setGpsOptions(options = {}) {
    if (options.gpsMinDistance !== undefined) {
      this._gpsMinDistance = options.gpsMinDistance;
    }
    if (options.gpsMinAccuracy !== undefined) {
      this._gpsMinAccuracy = options.gpsMinAccuracy;
    }
    if (options.maximumAge !== undefined) {
      this._maximumAge = options.maximumAge;
    }
  }

  startGps(maximumAge = 0) {
    if (this._watchPositionId === null) {
      this._watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          this._gpsReceived(position);
        },
        (error) => {
          if (this._eventHandlers["gpserror"]) {
            this._eventHandlers["gpserror"](error.code);
          } else {
            alert(`GPS error: code ${error.code}`);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: maximumAge != 0 ? maximumAge : this._maximumAge,
        }
      );
      return true;
    }
    return false;
  }

  stopGps() {
    if (this._watchPositionId !== null) {
      navigator.geolocation.clearWatch(this._watchPositionId);
      this._watchPositionId = null;
      return true;
    }
    return false;
  }

  fakeGps(lon, lat, elev = null, acc = 0) {
    if (elev !== null) {
      this.setElevation(elev);
    }

    this._gpsReceived({
      coords: {
        longitude: lon,
        latitude: lat,
        accuracy: acc,
      },
    });
  }

  lonLatToWorldCoords(lon, lat) {
    const projectedPos = this._proj.project(lon, lat);
    if (this.initialPositionAsOrigin) {
      if (this.initialPosition) {
        projectedPos[0] -= this.initialPosition[0];
        projectedPos[1] -= this.initialPosition[1];
      } else {
        throw "Trying to use 'initial position as origin' mode with no initial position determined";
      }
    }
    return [projectedPos[0], -projectedPos[1]];
  }

  add(object, lon, lat, elev) {
    this.setWorldPosition(object, lon, lat, elev);
    this._scene.add(object);
  }

  setWorldPosition(object, lon, lat, elev) {
    const worldCoords = this.lonLatToWorldCoords(lon, lat);
    if (elev !== undefined) {
      object.position.y = elev;
    }
    [object.position.x, object.position.z] = worldCoords;
  }

  setElevation(elev) {
    this._camera.position.y = elev;
  }

  on(eventName, eventHandler) {
    this._eventHandlers[eventName] = eventHandler;
  }

  setWorldOrigin(lon, lat) {
    this.initialPosition = this._proj.project(lon, lat);
  }

  _gpsReceived(position) {
    let distMoved = Number.MAX_VALUE;
    if (position.coords.accuracy <= this._gpsMinAccuracy) {
      if (this._lastCoords === null) {
        this._lastCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } else {
        distMoved = this._haversineDist(this._lastCoords, position.coords);
      }
      if (distMoved >= this._gpsMinDistance) {
        this._lastCoords.longitude = position.coords.longitude;
        this._lastCoords.latitude = position.coords.latitude;

        if (this.initialPositionAsOrigin && !this.initialPosition) {
          this.setWorldOrigin(
            position.coords.longitude,
            position.coords.latitude
          );
        }

        this.setWorldPosition(
          this._camera,
          position.coords.longitude,
          position.coords.latitude
        );

        if (this._eventHandlers["gpsupdate"]) {
          this._eventHandlers["gpsupdate"](position, distMoved);
        }
      }
    }
  }

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from original A-Frame components
   */
  _haversineDist(src, dest) {
    const dlongitude = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.longitude - src.longitude);
    const dlatitude = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(src.latitude)) *
        Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/sphmerc-projection.js":
/*!**************************************************************!*\
  !*** ./three.js/src/location-based/js/sphmerc-projection.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_14278__) => {

__nested_webpack_require_14278__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_14278__.d(__nested_webpack_exports__, {
/* harmony export */   SphMercProjection: () => (/* binding */ SphMercProjection)
/* harmony export */ });
class SphMercProjection {
  constructor() {
    this.EARTH = 40075016.68;
    this.HALF_EARTH = 20037508.34;
  }

  project(lon, lat) {
    return [this.lonToSphMerc(lon), this.latToSphMerc(lat)];
  }

  unproject(projected) {
    return [this.sphMercToLon(projected[0]), this.sphMercToLat(projected[1])];
  }

  lonToSphMerc(lon) {
    return (lon / 180) * this.HALF_EARTH;
  }

  latToSphMerc(lat) {
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    return (y * this.HALF_EARTH) / 180.0;
  }

  sphMercToLon(x) {
    return (x / this.HALF_EARTH) * 180.0;
  }

  sphMercToLat(y) {
    var lat = (y / this.HALF_EARTH) * 180.0;
    lat =
      (180 / Math.PI) *
      (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
    return lat;
  }

  getID() {
    return "epsg:3857";
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/webcam-renderer.js":
/*!***********************************************************!*\
  !*** ./three.js/src/location-based/js/webcam-renderer.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_15674__) => {

__nested_webpack_require_15674__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_15674__.d(__nested_webpack_exports__, {
/* harmony export */   WebcamRenderer: () => (/* binding */ WebcamRenderer)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_15674__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_15674__.n(three__WEBPACK_IMPORTED_MODULE_0__);


class WebcamRenderer {
  constructor(renderer, videoElement) {
    this.renderer = renderer;
    this.renderer.autoClear = false;
    this.sceneWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
    let video;
    if (videoElement === undefined) {
      video = document.createElement("video");
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
      video.style.display = "none";
      document.body.appendChild(video);
    } else {
      video = document.querySelector(videoElement);
    }
    this.geom = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry();
    this.texture = new three__WEBPACK_IMPORTED_MODULE_0__.VideoTexture(video);
    this.material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({ map: this.texture });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(this.geom, this.material);
    this.sceneWebcam.add(mesh);
    this.cameraWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      0,
      10
    );
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          width: 1280,
          height: 720,
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log(`using the webcam successfully...`);
          video.srcObject = stream;
          video.play();
        })
        .catch((e) => {
          setTimeout(() => {
            this.createErrorPopup(
              "Webcam Error\nName: " + e.name + "\nMessage: " + e.message
            );
          }, 1000);
        });
    } else {
      setTimeout(() => {
        this.createErrorPopup("sorry - media devices API not supported");
      }, 1000);
    }
  }

  update() {
    this.renderer.clear();
    this.renderer.render(this.sceneWebcam, this.cameraWebcam);
    this.renderer.clearDepth();
  }

  dispose() {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  }

  createErrorPopup(msg) {
    if (!document.getElementById("error-popup")) {
      var errorPopup = document.createElement("div");
      errorPopup.innerHTML = msg;
      errorPopup.setAttribute("id", "error-popup");
      document.body.appendChild(errorPopup);
    }
  }
}




/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_19147__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_19147__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nested_webpack_require_19147__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nested_webpack_require_19147__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_19147__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_19147__.o(definition, key) && !__nested_webpack_require_19147__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_19147__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_19147__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************************!*\
  !*** ./three.js/src/location-based/index.js ***!
  \**********************************************/
__nested_webpack_require_19147__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_19147__.d(__nested_webpack_exports__, {
/* harmony export */   DeviceOrientationControls: () => (/* reexport safe */ _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__.DeviceOrientationControls),
/* harmony export */   LocationBased: () => (/* reexport safe */ _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__.LocationBased),
/* harmony export */   WebcamRenderer: () => (/* reexport safe */ _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__.WebcamRenderer)
/* harmony export */ });
/* harmony import */ var _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_19147__(/*! ./js/location-based.js */ "./three.js/src/location-based/js/location-based.js");
/* harmony import */ var _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_19147__(/*! ./js/webcam-renderer.js */ "./three.js/src/location-based/js/webcam-renderer.js");
/* harmony import */ var _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_19147__(/*! ./js/device-orientation-controls.js */ "./three.js/src/location-based/js/device-orientation-controls.js");






})();

/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsbUJBQW1CO0FBQ3JFLHFCQUFxQix1Q0FBVTtBQUMvQjtBQUNBLDRCQUE0QixxREFBd0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsTUFBTTtBQUNOO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUwQjs7Ozs7Ozs7Ozs7QUNqRjFCOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ051RDtBQUNFO0FBQ3VCOztBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9sb2NhdGlvbi1iYXNlZC5qcyIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvc3BobWVyYy1wcm9qZWN0aW9uLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy93ZWJjYW0tcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vVEhSRUV4L2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9Iiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1widGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVEhSRUV4XCJdID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlRIUkVFeFwiXSA9IGZhY3Rvcnkocm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIChfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pID0+IHtcbnJldHVybiAiLCIvLyBNb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSB0aHJlZS5qc1xuLy8gd2lsbCB1c2UgdGhlIGRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUgZXZlbnQgaWYgYXZhaWxhYmxlXG5cbmltcG9ydCB7IEV1bGVyLCBFdmVudERpc3BhdGNoZXIsIE1hdGhVdGlscywgUXVhdGVybmlvbiwgVmVjdG9yMyB9IGZyb20gXCJ0aHJlZVwiO1xuXG5jb25zdCBfemVlID0gbmV3IFZlY3RvcjMoMCwgMCwgMSk7XG5jb25zdCBfZXVsZXIgPSBuZXcgRXVsZXIoKTtcbmNvbnN0IF9xMCA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5jb25zdCBfcTEgPSBuZXcgUXVhdGVybmlvbigtTWF0aC5zcXJ0KDAuNSksIDAsIDAsIE1hdGguc3FydCgwLjUpKTsgLy8gLSBQSS8yIGFyb3VuZCB0aGUgeC1heGlzXG5cbmNvbnN0IF9jaGFuZ2VFdmVudCA9IHsgdHlwZTogXCJjaGFuZ2VcIiB9O1xuXG5jbGFzcyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iob2JqZWN0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50IGlzIG9ubHkgYXZhaWxhYmxlIGluIHNlY3VyZSBjb250ZXh0cyAoaHR0cHMpXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xuXG4gICAgY29uc3QgRVBTID0gMC4wMDAwMDE7XG4gICAgY29uc3QgbGFzdFF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuXG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgdGhpcy5vYmplY3Qucm90YXRpb24ucmVvcmRlcihcIllYWlwiKTtcblxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgICB0aGlzLmRldmljZU9yaWVudGF0aW9uID0ge307XG4gICAgdGhpcy5zY3JlZW5PcmllbnRhdGlvbiA9IDA7XG5cbiAgICB0aGlzLmFscGhhT2Zmc2V0ID0gMDsgLy8gcmFkaWFuc1xuXG4gICAgdGhpcy5UV09fUEkgPSAyICogTWF0aC5QSTtcbiAgICB0aGlzLkhBTEZfUEkgPSAwLjUgKiBNYXRoLlBJO1xuICAgIHRoaXMub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUgPVxuICAgICAgXCJvbmRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIiBpbiB3aW5kb3dcbiAgICAgICAgPyBcImRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIlxuICAgICAgICA6IFwiZGV2aWNlb3JpZW50YXRpb25cIjtcblxuICAgIHRoaXMuc21vb3RoaW5nRmFjdG9yID0gMTtcblxuICAgIGNvbnN0IG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgc2NvcGUuZGV2aWNlT3JpZW50YXRpb24gPSBldmVudDtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2NvcGUuc2NyZWVuT3JpZW50YXRpb24gPSB3aW5kb3cub3JpZW50YXRpb24gfHwgMDtcbiAgICB9O1xuXG4gICAgLy8gVGhlIGFuZ2xlcyBhbHBoYSwgYmV0YSBhbmQgZ2FtbWEgZm9ybSBhIHNldCBvZiBpbnRyaW5zaWMgVGFpdC1CcnlhbiBhbmdsZXMgb2YgdHlwZSBaLVgnLVknJ1xuXG4gICAgY29uc3Qgc2V0T2JqZWN0UXVhdGVybmlvbiA9IGZ1bmN0aW9uIChcbiAgICAgIHF1YXRlcm5pb24sXG4gICAgICBhbHBoYSxcbiAgICAgIGJldGEsXG4gICAgICBnYW1tYSxcbiAgICAgIG9yaWVudFxuICAgICkge1xuICAgICAgX2V1bGVyLnNldChiZXRhLCBhbHBoYSwgLWdhbW1hLCBcIllYWlwiKTsgLy8gJ1pYWScgZm9yIHRoZSBkZXZpY2UsIGJ1dCAnWVhaJyBmb3IgdXNcblxuICAgICAgcXVhdGVybmlvbi5zZXRGcm9tRXVsZXIoX2V1bGVyKTsgLy8gb3JpZW50IHRoZSBkZXZpY2VcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShfcTEpOyAvLyBjYW1lcmEgbG9va3Mgb3V0IHRoZSBiYWNrIG9mIHRoZSBkZXZpY2UsIG5vdCB0aGUgdG9wXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkoX3EwLnNldEZyb21BeGlzQW5nbGUoX3plZSwgLW9yaWVudCkpOyAvLyBhZGp1c3QgZm9yIHNjcmVlbiBvcmllbnRhdGlvblxuICAgIH07XG5cbiAgICB0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQoKTsgLy8gcnVuIG9uY2Ugb24gbG9hZFxuXG4gICAgICAvLyBpT1MgMTMrXG5cbiAgICAgIGlmIChcbiAgICAgICAgd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB0eXBlb2Ygd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIlxuICAgICAgKSB7XG4gICAgICAgIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKClcbiAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJncmFudGVkXCIpIHtcbiAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgICAgICAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBzY29wZS5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwiVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9sczogVW5hYmxlIHRvIHVzZSBEZXZpY2VPcmllbnRhdGlvbiBBUEk6XCIsXG4gICAgICAgICAgICAgIGVycm9yXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICApO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBzY29wZS5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcbiAgICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgc2NvcGUuZW5hYmxlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICBzY29wZS5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcbiAgICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICApO1xuXG4gICAgICBzY29wZS5lbmFibGVkID0gZmFsc2U7XG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGRldmljZSA9IHNjb3BlLmRldmljZU9yaWVudGF0aW9uO1xuXG4gICAgICBpZiAoZGV2aWNlKSB7XG4gICAgICAgIGxldCBhbHBoYSA9IGRldmljZS5hbHBoYVxuICAgICAgICAgID8gTWF0aFV0aWxzLmRlZ1RvUmFkKGRldmljZS5hbHBoYSkgKyBzY29wZS5hbHBoYU9mZnNldFxuICAgICAgICAgIDogMDsgLy8gWlxuXG4gICAgICAgIGxldCBiZXRhID0gZGV2aWNlLmJldGEgPyBNYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmJldGEpIDogMDsgLy8gWCdcblxuICAgICAgICBsZXQgZ2FtbWEgPSBkZXZpY2UuZ2FtbWEgPyBNYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmdhbW1hKSA6IDA7IC8vIFknJ1xuXG4gICAgICAgIGNvbnN0IG9yaWVudCA9IHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uXG4gICAgICAgICAgPyBNYXRoVXRpbHMuZGVnVG9SYWQoc2NvcGUuc2NyZWVuT3JpZW50YXRpb24pXG4gICAgICAgICAgOiAwOyAvLyBPXG5cbiAgICAgICAgaWYgKHRoaXMuc21vb3RoaW5nRmFjdG9yIDwgMSkge1xuICAgICAgICAgIGlmICh0aGlzLmxhc3RPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgayA9IHRoaXMuc21vb3RoaW5nRmFjdG9yO1xuICAgICAgICAgICAgYWxwaGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgICAgICBhbHBoYSxcbiAgICAgICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uYWxwaGEsXG4gICAgICAgICAgICAgIGtcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBiZXRhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICAgICAgYmV0YSArIE1hdGguUEksXG4gICAgICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmJldGEsXG4gICAgICAgICAgICAgIGtcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBnYW1tYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgICAgIGdhbW1hICsgdGhpcy5IQUxGX1BJLFxuICAgICAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5nYW1tYSxcbiAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgTWF0aC5QSVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmV0YSArPSBNYXRoLlBJO1xuICAgICAgICAgICAgZ2FtbWEgKz0gdGhpcy5IQUxGX1BJO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uID0ge1xuICAgICAgICAgICAgYWxwaGE6IGFscGhhLFxuICAgICAgICAgICAgYmV0YTogYmV0YSxcbiAgICAgICAgICAgIGdhbW1hOiBnYW1tYSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0T2JqZWN0UXVhdGVybmlvbihcbiAgICAgICAgICBzY29wZS5vYmplY3QucXVhdGVybmlvbixcbiAgICAgICAgICBhbHBoYSxcbiAgICAgICAgICB0aGlzLnNtb290aGluZ0ZhY3RvciA8IDEgPyBiZXRhIC0gTWF0aC5QSSA6IGJldGEsXG4gICAgICAgICAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPCAxID8gZ2FtbWEgLSB0aGlzLkhBTEZfUEkgOiBnYW1tYSxcbiAgICAgICAgICBvcmllbnRcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoOCAqICgxIC0gbGFzdFF1YXRlcm5pb24uZG90KHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uKSkgPiBFUFMpIHtcbiAgICAgICAgICBsYXN0UXVhdGVybmlvbi5jb3B5KHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uKTtcbiAgICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KF9jaGFuZ2VFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gTlcgQWRkZWRcbiAgICB0aGlzLl9vcmRlckFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgKGIgPiBhICYmIE1hdGguYWJzKGIgLSBhKSA8IHJhbmdlIC8gMikgfHxcbiAgICAgICAgKGEgPiBiICYmIE1hdGguYWJzKGIgLSBhKSA+IHJhbmdlIC8gMilcbiAgICAgICkge1xuICAgICAgICByZXR1cm4geyBsZWZ0OiBhLCByaWdodDogYiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgbGVmdDogYiwgcmlnaHQ6IGEgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gTlcgQWRkZWRcbiAgICB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIGssIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcbiAgICAgIGNvbnN0IGFuZ2xlcyA9IHRoaXMuX29yZGVyQW5nbGUoYSwgYiwgcmFuZ2UpO1xuICAgICAgY29uc3QgYW5nbGVzaGlmdCA9IGFuZ2xlcy5sZWZ0O1xuICAgICAgY29uc3Qgb3JpZ0FuZ2xlc1JpZ2h0ID0gYW5nbGVzLnJpZ2h0O1xuICAgICAgYW5nbGVzLmxlZnQgPSAwO1xuICAgICAgYW5nbGVzLnJpZ2h0IC09IGFuZ2xlc2hpZnQ7XG4gICAgICBpZiAoYW5nbGVzLnJpZ2h0IDwgMCkgYW5nbGVzLnJpZ2h0ICs9IHJhbmdlO1xuICAgICAgbGV0IG5ld2FuZ2xlID1cbiAgICAgICAgb3JpZ0FuZ2xlc1JpZ2h0ID09IGJcbiAgICAgICAgICA/ICgxIC0gaykgKiBhbmdsZXMucmlnaHQgKyBrICogYW5nbGVzLmxlZnRcbiAgICAgICAgICA6IGsgKiBhbmdsZXMucmlnaHQgKyAoMSAtIGspICogYW5nbGVzLmxlZnQ7XG4gICAgICBuZXdhbmdsZSArPSBhbmdsZXNoaWZ0O1xuICAgICAgaWYgKG5ld2FuZ2xlID49IHJhbmdlKSBuZXdhbmdsZSAtPSByYW5nZTtcbiAgICAgIHJldHVybiBuZXdhbmdsZTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2NvcGUuZGlzY29ubmVjdCgpO1xuICAgIH07XG5cbiAgICB0aGlzLmNvbm5lY3QoKTtcbiAgfVxufVxuXG5leHBvcnQgeyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIH07XG4iLCJpbXBvcnQgeyBTcGhNZXJjUHJvamVjdGlvbiB9IGZyb20gXCIuL3NwaG1lcmMtcHJvamVjdGlvbi5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmNsYXNzIExvY2F0aW9uQmFzZWQge1xuICBjb25zdHJ1Y3RvcihzY2VuZSwgY2FtZXJhLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcbiAgICB0aGlzLl9wcm9qID0gbmV3IFNwaE1lcmNQcm9qZWN0aW9uKCk7XG4gICAgdGhpcy5fZXZlbnRIYW5kbGVycyA9IHt9O1xuICAgIHRoaXMuX2xhc3RDb29yZHMgPSBudWxsO1xuICAgIHRoaXMuX2dwc01pbkRpc3RhbmNlID0gMDtcbiAgICB0aGlzLl9ncHNNaW5BY2N1cmFjeSA9IDEwMDtcbiAgICB0aGlzLl9tYXhpbXVtQWdlID0gMDtcbiAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICAgIHRoaXMuc2V0R3BzT3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA9IG51bGw7XG4gICAgdGhpcy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbiA9IG9wdGlvbnMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4gfHwgZmFsc2U7XG4gIH1cblxuICBzZXRQcm9qZWN0aW9uKHByb2opIHtcbiAgICB0aGlzLl9wcm9qID0gcHJvajtcbiAgfVxuXG4gIHNldEdwc09wdGlvbnMob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKG9wdGlvbnMuZ3BzTWluRGlzdGFuY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fZ3BzTWluRGlzdGFuY2UgPSBvcHRpb25zLmdwc01pbkRpc3RhbmNlO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5ncHNNaW5BY2N1cmFjeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9ncHNNaW5BY2N1cmFjeSA9IG9wdGlvbnMuZ3BzTWluQWNjdXJhY3k7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLm1heGltdW1BZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fbWF4aW11bUFnZSA9IG9wdGlvbnMubWF4aW11bUFnZTtcbiAgICB9XG4gIH1cblxuICBzdGFydEdwcyhtYXhpbXVtQWdlID0gMCkge1xuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKFxuICAgICAgICAocG9zaXRpb24pID0+IHtcbiAgICAgICAgICB0aGlzLl9ncHNSZWNlaXZlZChwb3NpdGlvbik7XG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzZXJyb3JcIl0pIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHNlcnJvclwiXShlcnJvci5jb2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoYEdQUyBlcnJvcjogY29kZSAke2Vycm9yLmNvZGV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgICAgIG1heGltdW1BZ2U6IG1heGltdW1BZ2UgIT0gMCA/IG1heGltdW1BZ2UgOiB0aGlzLl9tYXhpbXVtQWdlLFxuICAgICAgICB9XG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0b3BHcHMoKSB7XG4gICAgaWYgKHRoaXMuX3dhdGNoUG9zaXRpb25JZCAhPT0gbnVsbCkge1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy5fd2F0Y2hQb3NpdGlvbklkKTtcbiAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZmFrZUdwcyhsb24sIGxhdCwgZWxldiA9IG51bGwsIGFjYyA9IDApIHtcbiAgICBpZiAoZWxldiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRFbGV2YXRpb24oZWxldik7XG4gICAgfVxuXG4gICAgdGhpcy5fZ3BzUmVjZWl2ZWQoe1xuICAgICAgY29vcmRzOiB7XG4gICAgICAgIGxvbmdpdHVkZTogbG9uLFxuICAgICAgICBsYXRpdHVkZTogbGF0LFxuICAgICAgICBhY2N1cmFjeTogYWNjLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGxvbkxhdFRvV29ybGRDb29yZHMobG9uLCBsYXQpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWRQb3MgPSB0aGlzLl9wcm9qLnByb2plY3QobG9uLCBsYXQpO1xuICAgIGlmICh0aGlzLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luKSB7XG4gICAgICBpZiAodGhpcy5pbml0aWFsUG9zaXRpb24pIHtcbiAgICAgICAgcHJvamVjdGVkUG9zWzBdIC09IHRoaXMuaW5pdGlhbFBvc2l0aW9uWzBdO1xuICAgICAgICBwcm9qZWN0ZWRQb3NbMV0gLT0gdGhpcy5pbml0aWFsUG9zaXRpb25bMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIlRyeWluZyB0byB1c2UgJ2luaXRpYWwgcG9zaXRpb24gYXMgb3JpZ2luJyBtb2RlIHdpdGggbm8gaW5pdGlhbCBwb3NpdGlvbiBkZXRlcm1pbmVkXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbcHJvamVjdGVkUG9zWzBdLCAtcHJvamVjdGVkUG9zWzFdXTtcbiAgfVxuXG4gIGFkZChvYmplY3QsIGxvbiwgbGF0LCBlbGV2KSB7XG4gICAgdGhpcy5zZXRXb3JsZFBvc2l0aW9uKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpO1xuICAgIHRoaXMuX3NjZW5lLmFkZChvYmplY3QpO1xuICB9XG5cbiAgc2V0V29ybGRQb3NpdGlvbihvYmplY3QsIGxvbiwgbGF0LCBlbGV2KSB7XG4gICAgY29uc3Qgd29ybGRDb29yZHMgPSB0aGlzLmxvbkxhdFRvV29ybGRDb29yZHMobG9uLCBsYXQpO1xuICAgIGlmIChlbGV2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9iamVjdC5wb3NpdGlvbi55ID0gZWxldjtcbiAgICB9XG4gICAgW29iamVjdC5wb3NpdGlvbi54LCBvYmplY3QucG9zaXRpb24uel0gPSB3b3JsZENvb3JkcztcbiAgfVxuXG4gIHNldEVsZXZhdGlvbihlbGV2KSB7XG4gICAgdGhpcy5fY2FtZXJhLnBvc2l0aW9uLnkgPSBlbGV2O1xuICB9XG5cbiAgb24oZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50TmFtZV0gPSBldmVudEhhbmRsZXI7XG4gIH1cblxuICBzZXRXb3JsZE9yaWdpbihsb24sIGxhdCkge1xuICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uID0gdGhpcy5fcHJvai5wcm9qZWN0KGxvbiwgbGF0KTtcbiAgfVxuXG4gIF9ncHNSZWNlaXZlZChwb3NpdGlvbikge1xuICAgIGxldCBkaXN0TW92ZWQgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIGlmIChwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5fZ3BzTWluQWNjdXJhY3kpIHtcbiAgICAgIGlmICh0aGlzLl9sYXN0Q29vcmRzID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMgPSB7XG4gICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXN0TW92ZWQgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KHRoaXMuX2xhc3RDb29yZHMsIHBvc2l0aW9uLmNvb3Jkcyk7XG4gICAgICB9XG4gICAgICBpZiAoZGlzdE1vdmVkID49IHRoaXMuX2dwc01pbkRpc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMubG9uZ2l0dWRlID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgICAgdGhpcy5fbGFzdENvb3Jkcy5sYXRpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbiAmJiAhdGhpcy5pbml0aWFsUG9zaXRpb24pIHtcbiAgICAgICAgICB0aGlzLnNldFdvcmxkT3JpZ2luKFxuICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24oXG4gICAgICAgICAgdGhpcy5fY2FtZXJhLFxuICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHN1cGRhdGVcIl0pIHtcbiAgICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzdXBkYXRlXCJdKHBvc2l0aW9uLCBkaXN0TW92ZWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBoYXZlcnNpbmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gbGF0L2xvbiBwYWlycy5cbiAgICpcbiAgICogVGFrZW4gZnJvbSBvcmlnaW5hbCBBLUZyYW1lIGNvbXBvbmVudHNcbiAgICovXG4gIF9oYXZlcnNpbmVEaXN0KHNyYywgZGVzdCkge1xuICAgIGNvbnN0IGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sb25naXR1ZGUgLSBzcmMubG9uZ2l0dWRlKTtcbiAgICBjb25zdCBkbGF0aXR1ZGUgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSAtIHNyYy5sYXRpdHVkZSk7XG5cbiAgICBjb25zdCBhID1cbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xuICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcbiAgICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMSAtIGEpKTtcbiAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICB9XG59XG5cbmV4cG9ydCB7IExvY2F0aW9uQmFzZWQgfTtcbiIsImNsYXNzIFNwaE1lcmNQcm9qZWN0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5FQVJUSCA9IDQwMDc1MDE2LjY4O1xuICAgIHRoaXMuSEFMRl9FQVJUSCA9IDIwMDM3NTA4LjM0O1xuICB9XG5cbiAgcHJvamVjdChsb24sIGxhdCkge1xuICAgIHJldHVybiBbdGhpcy5sb25Ub1NwaE1lcmMobG9uKSwgdGhpcy5sYXRUb1NwaE1lcmMobGF0KV07XG4gIH1cblxuICB1bnByb2plY3QocHJvamVjdGVkKSB7XG4gICAgcmV0dXJuIFt0aGlzLnNwaE1lcmNUb0xvbihwcm9qZWN0ZWRbMF0pLCB0aGlzLnNwaE1lcmNUb0xhdChwcm9qZWN0ZWRbMV0pXTtcbiAgfVxuXG4gIGxvblRvU3BoTWVyYyhsb24pIHtcbiAgICByZXR1cm4gKGxvbiAvIDE4MCkgKiB0aGlzLkhBTEZfRUFSVEg7XG4gIH1cblxuICBsYXRUb1NwaE1lcmMobGF0KSB7XG4gICAgdmFyIHkgPSBNYXRoLmxvZyhNYXRoLnRhbigoKDkwICsgbGF0KSAqIE1hdGguUEkpIC8gMzYwKSkgLyAoTWF0aC5QSSAvIDE4MCk7XG4gICAgcmV0dXJuICh5ICogdGhpcy5IQUxGX0VBUlRIKSAvIDE4MC4wO1xuICB9XG5cbiAgc3BoTWVyY1RvTG9uKHgpIHtcbiAgICByZXR1cm4gKHggLyB0aGlzLkhBTEZfRUFSVEgpICogMTgwLjA7XG4gIH1cblxuICBzcGhNZXJjVG9MYXQoeSkge1xuICAgIHZhciBsYXQgPSAoeSAvIHRoaXMuSEFMRl9FQVJUSCkgKiAxODAuMDtcbiAgICBsYXQgPVxuICAgICAgKDE4MCAvIE1hdGguUEkpICpcbiAgICAgICgyICogTWF0aC5hdGFuKE1hdGguZXhwKChsYXQgKiBNYXRoLlBJKSAvIDE4MCkpIC0gTWF0aC5QSSAvIDIpO1xuICAgIHJldHVybiBsYXQ7XG4gIH1cblxuICBnZXRJRCgpIHtcbiAgICByZXR1cm4gXCJlcHNnOjM4NTdcIjtcbiAgfVxufVxuXG5leHBvcnQgeyBTcGhNZXJjUHJvamVjdGlvbiB9O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmNsYXNzIFdlYmNhbVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocmVuZGVyZXIsIHZpZGVvRWxlbWVudCkge1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICB0aGlzLnJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgIHRoaXMuc2NlbmVXZWJjYW0gPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICBsZXQgdmlkZW87XG4gICAgaWYgKHZpZGVvRWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcbiAgICAgIHZpZGVvLnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIHRydWUpO1xuICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwicGxheXNpbmxpbmVcIiwgdHJ1ZSk7XG4gICAgICB2aWRlby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZGVvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHZpZGVvRWxlbWVudCk7XG4gICAgfVxuICAgIHRoaXMuZ2VvbSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgdGhpcy50ZXh0dXJlID0gbmV3IFRIUkVFLlZpZGVvVGV4dHVyZSh2aWRlbyk7XG4gICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGhpcy50ZXh0dXJlIH0pO1xuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLmdlb20sIHRoaXMubWF0ZXJpYWwpO1xuICAgIHRoaXMuc2NlbmVXZWJjYW0uYWRkKG1lc2gpO1xuICAgIHRoaXMuY2FtZXJhV2ViY2FtID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYShcbiAgICAgIC0wLjUsXG4gICAgICAwLjUsXG4gICAgICAwLjUsXG4gICAgICAtMC41LFxuICAgICAgMCxcbiAgICAgIDEwXG4gICAgKTtcbiAgICBpZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICAgIHZpZGVvOiB7XG4gICAgICAgICAgd2lkdGg6IDEyODAsXG4gICAgICAgICAgaGVpZ2h0OiA3MjAsXG4gICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgICAgLmdldFVzZXJNZWRpYShjb25zdHJhaW50cylcbiAgICAgICAgLnRoZW4oKHN0cmVhbSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGB1c2luZyB0aGUgd2ViY2FtIHN1Y2Nlc3NmdWxseS4uLmApO1xuICAgICAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFcnJvclBvcHVwKFxuICAgICAgICAgICAgICBcIldlYmNhbSBFcnJvclxcbk5hbWU6IFwiICsgZS5uYW1lICsgXCJcXG5NZXNzYWdlOiBcIiArIGUubWVzc2FnZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZUVycm9yUG9wdXAoXCJzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5jbGVhcigpO1xuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmVXZWJjYW0sIHRoaXMuY2FtZXJhV2ViY2FtKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyRGVwdGgoKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5tYXRlcmlhbC5kaXNwb3NlKCk7XG4gICAgdGhpcy50ZXh0dXJlLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xuICB9XG5cbiAgY3JlYXRlRXJyb3JQb3B1cChtc2cpIHtcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3ItcG9wdXBcIikpIHtcbiAgICAgIHZhciBlcnJvclBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGVycm9yUG9wdXAuaW5uZXJIVE1MID0gbXNnO1xuICAgICAgZXJyb3JQb3B1cC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImVycm9yLXBvcHVwXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlcnJvclBvcHVwKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgV2ViY2FtUmVuZGVyZXIgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBMb2NhdGlvbkJhc2VkIH0gZnJvbSBcIi4vanMvbG9jYXRpb24tYmFzZWQuanNcIjtcbmltcG9ydCB7IFdlYmNhbVJlbmRlcmVyIH0gZnJvbSBcIi4vanMvd2ViY2FtLXJlbmRlcmVyLmpzXCI7XG5pbXBvcnQgeyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIH0gZnJvbSBcIi4vanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzXCI7XG5cbmV4cG9ydCB7IExvY2F0aW9uQmFzZWQsIFdlYmNhbVJlbmRlcmVyLCBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=

/***/ }),

/***/ "aframe":
/*!******************************************************************************************!*\
  !*** external {"commonjs":"aframe","commonjs2":"aframe","amd":"aframe","root":"AFRAME"} ***!
  \******************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************!*\
  !*** ./aframe/src/new-location-based/index.js ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _location_based_arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../location-based/arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _gps_new_camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gps-new-camera */ "./aframe/src/new-location-based/gps-new-camera.js");
/* harmony import */ var _gps_new_entity_place__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gps-new-entity-place */ "./aframe/src/new-location-based/gps-new-entity-place.js");
/* harmony import */ var _arjs_device_orientation_controls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./arjs-device-orientation-controls */ "./aframe/src/new-location-based/arjs-device-orientation-controls.js");





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWZyYW1lLWFyLW5ldy1sb2NhdGlvbi1vbmx5LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7QUNWaUM7QUFDRjs7QUFFL0IscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQSx5QkFBeUIscURBQXdCO0FBQ2pELHdCQUF3Qix3Q0FBVzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixhQUFhO0FBQzlCLGtCQUFrQjtBQUNsQixPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHNEQUF5QjtBQUMvQyx5QkFBeUIsK0NBQWtCO0FBQzNDLDBCQUEwQixvREFBdUIsR0FBRyxtQkFBbUI7QUFDdkUsdUJBQXVCLHVDQUFVO0FBQ2pDO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLDZCQUE2QixFQUFFO0FBQy9CO0FBQ0EsU0FBUztBQUNULE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3pGRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWlDOztBQUVqQyxxREFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3BDZ0M7QUFDNEM7O0FBRTdFLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsd0JBQXdCLHFGQUFvQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLDZEQUE2RCxLQUFLO0FBQ2xFO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsVUFBVTtBQUNWO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcE44QjtBQUNFOztBQUVqQyxxREFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsNENBQWU7QUFDdEMsc0JBQXNCLDRDQUFlOztBQUVyQztBQUNBO0FBQ0EsZUFBZSw0Q0FBZTtBQUM5QixpQkFBaUIsNENBQWU7QUFDaEM7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7O0FDakVEO0FBQ0EsSUFBSSxJQUF5RDtBQUM3RCwyQkFBMkIsbUJBQU8sQ0FBQyxvQkFBTztBQUMxQyxNQUFNLEVBS29DO0FBQzFDLENBQUM7QUFDRCx5QkFBeUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywwQkFBbUIsRUFBRSw4QkFBbUI7O0FBRXpFLDhCQUFtQixHQUFHLDBCQUFtQjtBQUN6QyxxQkFBcUIsOEJBQW1CLEdBQUcsMEJBQW1CO0FBQzlEO0FBQ0Esc0JBQXNCO0FBQ3RCLDhEQUE4RCw4QkFBbUI7QUFDakYsbUZBQW1GLDhCQUFtQjtBQUN0RztBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0Esc0dBQXNHOztBQUV0Ryx1QkFBdUI7O0FBRXZCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7O0FBRTlDLHVDQUF1Qzs7QUFFdkMsZ0NBQWdDOztBQUVoQyxnRUFBZ0U7QUFDaEU7O0FBRUE7QUFDQSx3Q0FBd0M7O0FBRXhDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7QUFFZix5R0FBeUc7O0FBRXpHLDRHQUE0Rzs7QUFFNUc7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLFFBQVE7QUFDUixpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7OztBQUtBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsMEJBQW1CLEVBQUUsK0JBQW1COztBQUV6RSwrQkFBbUIsR0FBRywwQkFBbUI7QUFDekMscUJBQXFCLCtCQUFtQixHQUFHLDBCQUFtQjtBQUM5RDtBQUNBLHNCQUFzQjtBQUN0QiwrRUFBK0UsK0JBQW1CO0FBQ2xHLDhEQUE4RCwrQkFBbUI7QUFDakYsbUZBQW1GLCtCQUFtQjs7OztBQUl0RztBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaLHFDQUFxQyxXQUFXO0FBQ2hEO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywwQkFBbUIsRUFBRSxnQ0FBbUI7O0FBRXpFLGdDQUFtQixHQUFHLDBCQUFtQjtBQUN6QyxxQkFBcUIsZ0NBQW1CLEdBQUcsMEJBQW1CO0FBQzlEO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsMEJBQW1CLEVBQUUsZ0NBQW1COztBQUV6RSxnQ0FBbUIsR0FBRywwQkFBbUI7QUFDekMscUJBQXFCLGdDQUFtQixHQUFHLDBCQUFtQjtBQUM5RDtBQUNBLHNCQUFzQjtBQUN0Qiw4REFBOEQsZ0NBQW1CO0FBQ2pGLG1GQUFtRixnQ0FBbUI7OztBQUd0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0UsbUJBQW1CO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNULE1BQU07QUFDTjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQSxPQUFPOztBQUVQO0FBQ0E7QUFDQSxpQkFBaUIscUVBQXFFO0FBQ3RGO0FBQ0E7O0FBRUE7O0FBRUEsT0FBTzs7QUFFUCxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnQ0FBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsZ0NBQW1CO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsZ0NBQW1CO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLFlBQVksZ0NBQW1CLGFBQWEsV0FBVztBQUN2RDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQ0FBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsZ0NBQW1CLHdCQUF3QixnQ0FBbUI7QUFDOUUsb0RBQW9ELHdDQUF3QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQ0FBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQ0FBbUI7QUFDOUI7QUFDQSxrRUFBa0UsaUJBQWlCO0FBQ25GO0FBQ0EsMkRBQTJELGFBQWE7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLElBQUksMEJBQW1CO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBbUIsR0FBRywwQkFBbUI7QUFDekMscUJBQXFCLGdDQUFtQixHQUFHLDBCQUFtQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsOEVBQThFLGdDQUFtQjtBQUNqRywrRUFBK0UsZ0NBQW1CO0FBQ2xHLDJGQUEyRixnQ0FBbUI7Ozs7Ozs7QUFPOUcsQ0FBQzs7QUFFRCxpQkFBaUIsMEJBQW1CO0FBQ3BDLFVBQVU7QUFDVjtBQUNBLENBQUM7QUFDRCwyQ0FBMkMsY0FBYzs7Ozs7Ozs7Ozs7QUNwc0J6RDs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOK0M7QUFDckI7QUFDTTtBQUNZIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbmV3LWxvY2F0aW9uLWJhc2VkL2dwcy1uZXctY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL25ldy1sb2NhdGlvbi1iYXNlZC9ncHMtbmV3LWVudGl0eS1wbGFjZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vdGhyZWUuanMvYnVpbGQvYXItdGhyZWV4LWxvY2F0aW9uLW9ubHkuanMiLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcImFmcmFtZVwiLFwiY29tbW9uanMyXCI6XCJhZnJhbWVcIixcImFtZFwiOlwiYWZyYW1lXCIsXCJyb290XCI6XCJBRlJBTUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYWZyYW1lXCIsIFwidGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQVJqc1wiXSA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJBUmpzXCJdID0gZmFjdG9yeShyb290W1wiQUZSQU1FXCJdLCByb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuICIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiYXJqcy13ZWJjYW0tdGV4dHVyZVwiLCB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNjZW5lID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIHRoaXMudGV4Q2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgtMC41LCAwLjUsIDAuNSwgLTAuNSwgMCwgMTApO1xuICAgIHRoaXMudGV4U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIHRydWUpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwicGxheXNpbmxpbmVcIiwgdHJ1ZSk7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xuICAgIGNvbnNvbGUubG9nKCdkYXRhIGJ5IGdlb20gJywgdGhpcylcbiAgICBcbiAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgIHZpZGVvOiB7XG4gICAgICAgIGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIixcbiAgICAgICAgd2lkdGg6IHsgaWRlYWw6IDE5MjAgfSwgXG4gICAgICAgIGhlaWdodDogeyBpZGVhbDogMTA4MCB9XG4gICAgICB9LFxuICAgIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpLnRoZW4oc3RyZWFtID0+IHtcbiAgICAgIGxldCBzdHJlYW1TZXR0aW5ncyA9IHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdLmdldFNldHRpbmdzKClcblxuICAgICAgXG4gICAgICBsZXQgc291cmNlQXNwZWN0UmF0aW8gPSBzdHJlYW1TZXR0aW5ncy53aWR0aCAvIHN0cmVhbVNldHRpbmdzLmhlaWdodDtcbiAgICAgIGxldCBkaXNwbGF5QXNwZWN0UmF0aW8gPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIGxldCBnZW9tWCA9IDE7XG4gICAgICBsZXQgZ2VvbVkgPSAxO1xuICAgICAgaWYgKGRpc3BsYXlBc3BlY3RSYXRpbyA+IHNvdXJjZUFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgLy8gRGlzcGxheSBpcyB3aWRlciB0aGFuIHNvdXJjZVxuICAgICAgICAgIGdlb21YID0gc291cmNlQXNwZWN0UmF0aW8gLyBkaXNwbGF5QXNwZWN0UmF0aW87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERpc3BsYXkgaXMgdGFsbGVyIHRoYW4gc291cmNlXG4gICAgICAgICAgZ2VvbVkgPSBkaXNwbGF5QXNwZWN0UmF0aW8gLyBzb3VyY2VBc3BlY3RSYXRpbztcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VvbSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KGdlb21YLCBnZW9tWSk7XG4gICAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHRoaXMudmlkZW8pO1xuICAgICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGhpcy50ZXh0dXJlIH0pO1xuICAgICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgICB0aGlzLnRleFNjZW5lLmFkZChtZXNoKTtcbiAgICB9KVxuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICAgIHZpZGVvOiB7XG4gICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgICAgLmdldFVzZXJNZWRpYShjb25zdHJhaW50cylcbiAgICAgICAgLnRoZW4oKHN0cmVhbSkgPT4ge1xuICAgICAgICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgYFdlYmNhbSBlcnJvcjogJHtlfWBcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgXCJzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWRcIlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2xlYXIoKTtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLnJlbmRlcih0aGlzLnRleFNjZW5lLCB0aGlzLnRleENhbWVyYSk7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZpZGVvLnNyY09iamVjdC5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgdHJhY2suc3RvcCgpO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XG4gICAgdGhpcy5nZW9tLmRpc3Bvc2UoKTtcbiAgfSxcbn0pO1xuIiwiLyoqXG4gKiBhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9sc1xuICpcbiAqIFJlcGxhY2VzIHRoZSBzdGFuZGFyZCBsb29rLWNvbnRyb2xzIGNvbXBvbmVudCB0byBwcm92aWRlIG1vYmlsZSBkZXZpY2VcbiAqIG9yaWVudGF0aW9uIGNvbnRyb2xzLlxuICpcbiAqIEEgbGlnaHR3ZWlnaHQgQS1GcmFtZSB3cmFwcGVyIHJvdW5kIHRoZSBtb2RpZmllZCB0aHJlZS5qc1xuICogRGV2aWNlT3JpZW50YXRpb25Db250cm9scyB1c2VkIGluIHRoZSB0aHJlZS5qcyBsb2NhdGlvbi1iYXNlZCBBUEkuXG4gKlxuICogQ3JlYXRlcyB0aGUgVEhSRUUgb2JqZWN0IHVzaW5nIHVzaW5nIHRoZSB0aHJlZS5qcyBjYW1lcmEsIGFuZCBhbGxvd3MgdXBkYXRlXG4gKiBvZiB0aGUgc21vb3RoaW5nIGZhY3Rvci5cbiAqL1xuXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9sc1wiLCB7XG4gIHNjaGVtYToge1xuICAgIHNtb290aGluZ0ZhY3Rvcjoge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDEsXG4gICAgfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fb3JpZW50YXRpb25Db250cm9scyA9IG5ldyBUSFJFRXguRGV2aWNlT3JpZW50YXRpb25Db250cm9scyhcbiAgICAgIHRoaXMuZWwub2JqZWN0M0RcbiAgICApO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX29yaWVudGF0aW9uQ29udHJvbHMuc21vb3RoaW5nRmFjdG9yID0gdGhpcy5kYXRhLnNtb290aGluZ0ZhY3RvcjtcbiAgfSxcblxuICB0aWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fb3JpZW50YXRpb25Db250cm9scy51cGRhdGUoKTtcbiAgfSxcbn0pO1xuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcbmltcG9ydCAqIGFzIFRIUkVFeCBmcm9tIFwiLi4vLi4vLi4vdGhyZWUuanMvYnVpbGQvYXItdGhyZWV4LWxvY2F0aW9uLW9ubHkuanNcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiZ3BzLW5ldy1jYW1lcmFcIiwge1xuICBzY2hlbWE6IHtcbiAgICBzaW11bGF0ZUxhdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIHNpbXVsYXRlTG9uZ2l0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIHNpbXVsYXRlQWx0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAtTnVtYmVyLk1BWF9WQUxVRSxcbiAgICB9LFxuICAgIGdwc01pbkRpc3RhbmNlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIHBvc2l0aW9uTWluQWNjdXJhY3k6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAxMDAsXG4gICAgfSxcbiAgICBncHNUaW1lSW50ZXJ2YWw6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW46IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fdGVzdEZvck9yaWVudGF0aW9uQ29udHJvbHMoKTtcblxuICAgIHRoaXMudGhyZWVMb2MgPSBuZXcgVEhSRUV4LkxvY2F0aW9uQmFzZWQoXG4gICAgICB0aGlzLmVsLnNjZW5lRWwub2JqZWN0M0QsXG4gICAgICB0aGlzLmVsLm9iamVjdDNELFxuICAgICAge1xuICAgICAgICBpbml0aWFsUG9zaXRpb25Bc09yaWdpbjogdGhpcy5kYXRhLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luLFxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnRocmVlTG9jLm9uKFwiZ3BzdXBkYXRlXCIsIChncHNwb3MpID0+IHtcbiAgICAgIHRoaXMuX2N1cnJlbnRQb3NpdGlvbiA9IHtcbiAgICAgICAgbG9uZ2l0dWRlOiBncHNwb3MuY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgbGF0aXR1ZGU6IGdwc3Bvcy5jb29yZHMubGF0aXR1ZGUsXG4gICAgICB9O1xuICAgICAgdGhpcy5fc2VuZEdwc1VwZGF0ZUV2ZW50KGdwc3Bvcy5jb29yZHMubG9uZ2l0dWRlLCBncHNwb3MuY29vcmRzLmxhdGl0dWRlKTtcbiAgICB9KTtcblxuICAgIHRoaXMudGhyZWVMb2Mub24oXCJncHNlcnJvclwiLCAoY29kZSkgPT4ge1xuICAgICAgY29uc3QgbXNnID0gW1xuICAgICAgICBcIlVzZXIgZGVuaWVkIGFjY2VzcyB0byBHUFMuXCIsXG4gICAgICAgIFwiR1BTIHNhdGVsbGl0ZXMgbm90IGF2YWlsYWJsZS5cIixcbiAgICAgICAgXCJUaW1lb3V0IGNvbW11bmljYXRpbmcgd2l0aCBHUFMgc2F0ZWxsaXRlcyAtIHRyeSBtb3ZpbmcgdG8gYSBtb3JlIG9wZW4gYXJlYS5cIixcbiAgICAgIF07XG4gICAgICBpZiAoY29kZSA+PSAxICYmIGNvZGUgPD0gMykge1xuICAgICAgICB0aGlzLl9kaXNwbGF5RXJyb3IobXNnW2NvZGUgLSAxXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kaXNwbGF5RXJyb3IoYFVua25vd24gZ2VvbG9jYXRpb24gZXJyb3IgY29kZSAke2NvZGV9LmApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVXNlIGFyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzIG9uIG1vYmlsZSBvbmx5LCB3aXRoIHN0YW5kYXJkXG4gICAgLy8gbG9vay1jb250cm9scyBkaXNhYmxlZCAodGhpcyBpbnRlcmZlcmVzIHdpdGggdGhlIHJlYWRpbmdzIGZyb20gdGhlXG4gICAgLy8gc2Vuc29ycykuIE9uIGRlc2t0b3AsIHVzZSBzdGFuZGFyZCBsb29rLWNvbnRyb2xzIGluc3RlYWQuXG5cbiAgICAvLyBjb25zdCBtb2JpbGUgPSB0aGlzLl9pc01vYmlsZSgpO1xuICAgIC8vIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwibG9vay1jb250cm9scy1lbmFibGVkXCIsICFtb2JpbGUpO1xuICAgIC8vIGlmIChtb2JpbGUpIHtcbiAgICAvLyAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIiwgdHJ1ZSk7XG4gICAgLy8gfVxuXG4gICAgLy8gZnJvbSBvcmlnaW5hbCBncHMtY2FtZXJhIGNvbXBvbmVudFxuICAgIC8vIGlmIFNhZmFyaVxuICAgIGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC9bXFxkLl0rLipTYWZhcmkvKSkge1xuICAgICAgdGhpcy5fc2V0dXBTYWZhcmlPcmllbnRhdGlvblBlcm1pc3Npb25zKCk7XG4gICAgfVxuXG4gICAgdGhpcy5lbC5zY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsIChlKSA9PiB7XG4gICAgICBjb25zdCBlbnRpdHlQbGFjZSA9IGUuZGV0YWlsLmNvbXBvbmVudC5jb21wb25lbnRzW1wiZ3BzLW5ldy1lbnRpdHktcGxhY2VcIl07XG4gICAgICBpZiAodGhpcy5fY3VycmVudFBvc2l0aW9uKSB7XG4gICAgICAgIGVudGl0eVBsYWNlLnNldERpc3RhbmNlRnJvbSh0aGlzLl9jdXJyZW50UG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKG9sZERhdGEpIHtcbiAgICB0aGlzLnRocmVlTG9jLnNldEdwc09wdGlvbnMoe1xuICAgICAgZ3BzTWluQWNjdXJhY3k6IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5LFxuICAgICAgZ3BzTWluRGlzdGFuY2U6IHRoaXMuZGF0YS5ncHNNaW5EaXN0YW5jZSxcbiAgICAgIG1heGltdW1BZ2U6IHRoaXMuZGF0YS5ncHNUaW1lSW50ZXJ2YWwsXG4gICAgfSk7XG4gICAgaWYgKFxuICAgICAgKCF0aGlzLmRhdGEuZmFrZUdwc1N0YXJ0ZWQpICYmXG4gICAgICAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgfHwgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSAmJlxuICAgICAgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9IG9sZERhdGEuc2ltdWxhdGVMYXRpdHVkZSB8fFxuICAgICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT0gb2xkRGF0YS5zaW11bGF0ZUxvbmdpdHVkZSlcbiAgICApIHtcbiAgICAgIHRoaXMudGhyZWVMb2Muc3RvcEdwcygpO1xuICAgICAgdGhpcy50aHJlZUxvYy5mYWtlR3BzKFxuICAgICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUsXG4gICAgICAgIHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlXG4gICAgICApO1xuICAgICAgdGhpcy5kYXRhLmZha2VHcHNTdGFydGVkID0gdHJ1ZVxuICAgIH1cbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgPiAtTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgdGhpcy50aHJlZUxvYy5zZXRFbGV2YXRpb24odGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgKyAxLjYpO1xuICAgIH1cbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlID09PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSA9PT0gMCkge1xuICAgICAgdGhpcy50aHJlZUxvYy5zdGFydEdwcygpO1xuICAgIH1cbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGhyZWVMb2Muc3RvcEdwcygpO1xuICB9LFxuXG4gIGxhdExvblRvV29ybGQ6IGZ1bmN0aW9uIChsYXQsIGxvbikge1xuICAgIHJldHVybiB0aGlzLnRocmVlTG9jLmxvbkxhdFRvV29ybGRDb29yZHMobG9uLCBsYXQpO1xuICB9LFxuXG4gIGdldEluaXRpYWxQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRocmVlTG9jLmluaXRpYWxQb3NpdGlvbjtcbiAgfSxcblxuICBfc2VuZEdwc1VwZGF0ZUV2ZW50OiBmdW5jdGlvbiAobG9uLCBsYXQpIHtcbiAgICB0aGlzLmVsLmVtaXQoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCB7XG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICBsb25naXR1ZGU6IGxvbixcbiAgICAgICAgbGF0aXR1ZGU6IGxhdCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0sXG5cbiAgX3Rlc3RGb3JPcmllbnRhdGlvbkNvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbXNnID1cbiAgICAgIFwiV0FSTklORyAtIE5vIG9yaWVudGF0aW9uIGNvbnRyb2xzIGNvbXBvbmVudCwgYXBwIHdpbGwgbm90IHJlc3BvbmQgdG8gZGV2aWNlIHJvdGF0aW9uLlwiO1xuICAgIGlmIChcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9sc1wiXSAmJlxuICAgICAgIXRoaXMuZWwuY29tcG9uZW50c1tcImxvb2stY29udHJvbHNcIl1cbiAgICApIHtcbiAgICAgIHRoaXMuX2Rpc3BsYXlFcnJvcihtc2cpO1xuICAgIH1cbiAgfSxcblxuICBfZGlzcGxheUVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBjb25zdCBhcmpzID0gdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdO1xuICAgIGlmIChhcmpzKSB7XG4gICAgICBhcmpzLl9kaXNwbGF5RXJyb3JQb3B1cChlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gZnJvbSBvcmlnaW5hbCBncHMtY2FtZXJhIGNvbXBvbmVudFxuICBfc2V0dXBTYWZhcmlPcmllbnRhdGlvblBlcm1pc3Npb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaU9TIDEzK1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudD8ucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyBkZXZpY2Ugb3JpZW50YXRpb24gcGVybWlzc2lvbnMuLi5cIik7XG4gICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgfTtcblxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJ0b3VjaGVuZFwiLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICB9LFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcblxuICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgXCJBZnRlciBjYW1lcmEgcGVybWlzc2lvbiBwcm9tcHQsIHBsZWFzZSB0YXAgdGhlIHNjcmVlbiB0byBhY3RpdmF0ZSBnZW9sb2NhdGlvbi5cIlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICBcIlBsZWFzZSBlbmFibGUgZGV2aWNlIG9yaWVudGF0aW9uIGluIFNldHRpbmdzID4gU2FmYXJpID4gTW90aW9uICYgT3JpZW50YXRpb24gQWNjZXNzLlwiXG4gICAgICAgICk7XG4gICAgICB9LCA3NTApO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiZGV2aWNlb3JpZW50YXRpb25cIixcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIF9pc01vYmlsZTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChcbiAgICAgIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChcbiAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgICAgKVxuICAgICkge1xuICAgICAgLy8gdHJ1ZSBmb3IgbW9iaWxlIGRldmljZVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbn0pO1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtbmV3LWVudGl0eS1wbGFjZVwiLCB7XG4gIHNjaGVtYToge1xuICAgIGxvbmdpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBsYXRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2FtZXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltncHMtbmV3LWNhbWVyYV1cIik7XG4gICAgaWYgKCFjYW1lcmEuY29tcG9uZW50c1tcImdwcy1uZXctY2FtZXJhXCJdKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiZ3BzLW5ldy1jYW1lcmEgbm90IGluaXRpYWxpc2VkXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9jYW1lcmFHcHMgPSBjYW1lcmEuY29tcG9uZW50c1tcImdwcy1uZXctY2FtZXJhXCJdO1xuXG4gICAgY2FtZXJhLmFkZEV2ZW50TGlzdGVuZXIoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCAoZSkgPT4ge1xuICAgICAgdGhpcy5kaXN0YW5jZSA9IHRoaXMuX2hhdmVyc2luZURpc3QoZS5kZXRhaWwucG9zaXRpb24sIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsLnNjZW5lRWwuZW1pdChcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIiwge1xuICAgICAgY29tcG9uZW50OiB0aGlzLmVsLFxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHByb2pDb29yZHMgPSB0aGlzLl9jYW1lcmFHcHMudGhyZWVMb2MubG9uTGF0VG9Xb3JsZENvb3JkcyhcbiAgICAgIHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICB0aGlzLmRhdGEubGF0aXR1ZGVcbiAgICApO1xuICAgIHRoaXMuZWwub2JqZWN0M0QucG9zaXRpb24uc2V0KFxuICAgICAgcHJvakNvb3Jkc1swXSxcbiAgICAgIHRoaXMuZWwub2JqZWN0M0QucG9zaXRpb24ueSxcbiAgICAgIHByb2pDb29yZHNbMV1cbiAgICApO1xuICB9LFxuXG4gIHNldERpc3RhbmNlRnJvbTogZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5kaXN0YW5jZSA9IHRoaXMuX2hhdmVyc2luZURpc3QocG9zaXRpb24sIHRoaXMuZGF0YSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBoYXZlcnNpbmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gbGF0L2xvbiBwYWlycy5cbiAgICpcbiAgICogVGFrZW4gZnJvbSBncHMtY2FtZXJhXG4gICAqL1xuICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24gKHNyYywgZGVzdCkge1xuICAgIGNvbnN0IGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sb25naXR1ZGUgLSBzcmMubG9uZ2l0dWRlKTtcbiAgICBjb25zdCBkbGF0aXR1ZGUgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSAtIHNyYy5sYXRpdHVkZSk7XG5cbiAgICBjb25zdCBhID1cbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xuICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcbiAgICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMSAtIGEpKTtcbiAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICB9LFxufSk7XG4iLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJ0aHJlZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJUSFJFRXhcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiVEhSRUV4XCJdID0gZmFjdG9yeShyb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuIC8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlc19fID0gKHtcblxuLyoqKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2RldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKF9fdW51c2VkX3dlYnBhY2tfbW9kdWxlLCBfX3dlYnBhY2tfZXhwb3J0c19fLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSA9PiB7XG5cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIERldmljZU9yaWVudGF0aW9uQ29udHJvbHM6ICgpID0+ICgvKiBiaW5kaW5nICovIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMpXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgdGhyZWUgKi8gXCJ0aHJlZVwiKTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fX2RlZmF1bHQgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXy5uKHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18pO1xuLy8gTW9kaWZpZWQgdmVyc2lvbiBvZiBUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIGZyb20gdGhyZWUuanNcbi8vIHdpbGwgdXNlIHRoZSBkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlIGV2ZW50IGlmIGF2YWlsYWJsZVxuXG5cblxuY29uc3QgX3plZSA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlZlY3RvcjMoMCwgMCwgMSk7XG5jb25zdCBfZXVsZXIgPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5FdWxlcigpO1xuY29uc3QgX3EwID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uUXVhdGVybmlvbigpO1xuY29uc3QgX3ExID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uUXVhdGVybmlvbigtTWF0aC5zcXJ0KDAuNSksIDAsIDAsIE1hdGguc3FydCgwLjUpKTsgLy8gLSBQSS8yIGFyb3VuZCB0aGUgeC1heGlzXG5cbmNvbnN0IF9jaGFuZ2VFdmVudCA9IHsgdHlwZTogXCJjaGFuZ2VcIiB9O1xuXG5jbGFzcyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIGV4dGVuZHMgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5FdmVudERpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3RvcihvYmplY3QpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKHdpbmRvdy5pc1NlY3VyZUNvbnRleHQgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBcIlRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHM6IERldmljZU9yaWVudGF0aW9uRXZlbnQgaXMgb25seSBhdmFpbGFibGUgaW4gc2VjdXJlIGNvbnRleHRzIChodHRwcylcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY29wZSA9IHRoaXM7XG5cbiAgICBjb25zdCBFUFMgPSAwLjAwMDAwMTtcbiAgICBjb25zdCBsYXN0UXVhdGVybmlvbiA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlF1YXRlcm5pb24oKTtcblxuICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICAgIHRoaXMub2JqZWN0LnJvdGF0aW9uLnJlb3JkZXIoXCJZWFpcIik7XG5cbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5kZXZpY2VPcmllbnRhdGlvbiA9IHt9O1xuICAgIHRoaXMuc2NyZWVuT3JpZW50YXRpb24gPSAwO1xuXG4gICAgdGhpcy5hbHBoYU9mZnNldCA9IDA7IC8vIHJhZGlhbnNcblxuICAgIHRoaXMuVFdPX1BJID0gMiAqIE1hdGguUEk7XG4gICAgdGhpcy5IQUxGX1BJID0gMC41ICogTWF0aC5QSTtcbiAgICB0aGlzLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lID1cbiAgICAgIFwib25kZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCIgaW4gd2luZG93XG4gICAgICAgID8gXCJkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCJcbiAgICAgICAgOiBcImRldmljZW9yaWVudGF0aW9uXCI7XG5cbiAgICB0aGlzLnNtb290aGluZ0ZhY3RvciA9IDE7XG5cbiAgICBjb25zdCBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHNjb3BlLmRldmljZU9yaWVudGF0aW9uID0gZXZlbnQ7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uID0gd2luZG93Lm9yaWVudGF0aW9uIHx8IDA7XG4gICAgfTtcblxuICAgIC8vIFRoZSBhbmdsZXMgYWxwaGEsIGJldGEgYW5kIGdhbW1hIGZvcm0gYSBzZXQgb2YgaW50cmluc2ljIFRhaXQtQnJ5YW4gYW5nbGVzIG9mIHR5cGUgWi1YJy1ZJydcblxuICAgIGNvbnN0IHNldE9iamVjdFF1YXRlcm5pb24gPSBmdW5jdGlvbiAoXG4gICAgICBxdWF0ZXJuaW9uLFxuICAgICAgYWxwaGEsXG4gICAgICBiZXRhLFxuICAgICAgZ2FtbWEsXG4gICAgICBvcmllbnRcbiAgICApIHtcbiAgICAgIF9ldWxlci5zZXQoYmV0YSwgYWxwaGEsIC1nYW1tYSwgXCJZWFpcIik7IC8vICdaWFknIGZvciB0aGUgZGV2aWNlLCBidXQgJ1lYWicgZm9yIHVzXG5cbiAgICAgIHF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKF9ldWxlcik7IC8vIG9yaWVudCB0aGUgZGV2aWNlXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkoX3ExKTsgLy8gY2FtZXJhIGxvb2tzIG91dCB0aGUgYmFjayBvZiB0aGUgZGV2aWNlLCBub3QgdGhlIHRvcFxuXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KF9xMC5zZXRGcm9tQXhpc0FuZ2xlKF96ZWUsIC1vcmllbnQpKTsgLy8gYWRqdXN0IGZvciBzY3JlZW4gb3JpZW50YXRpb25cbiAgICB9O1xuXG4gICAgdGhpcy5jb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50KCk7IC8vIHJ1biBvbmNlIG9uIGxvYWRcblxuICAgICAgLy8gaU9TIDEzK1xuXG4gICAgICBpZiAoXG4gICAgICAgIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICkge1xuICAgICAgICB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpXG4gICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IFwiZ3JhbnRlZFwiKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwib3JpZW50YXRpb25jaGFuZ2VcIixcbiAgICAgICAgICAgICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgc2NvcGUub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcIlRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHM6IFVuYWJsZSB0byB1c2UgRGV2aWNlT3JpZW50YXRpb24gQVBJOlwiLFxuICAgICAgICAgICAgICBlcnJvclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwib3JpZW50YXRpb25jaGFuZ2VcIixcbiAgICAgICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICAgKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgc2NvcGUub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUsXG4gICAgICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHNjb3BlLmVuYWJsZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgc2NvcGUub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUsXG4gICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgKTtcblxuICAgICAgc2NvcGUuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBkZXZpY2UgPSBzY29wZS5kZXZpY2VPcmllbnRhdGlvbjtcblxuICAgICAgaWYgKGRldmljZSkge1xuICAgICAgICBsZXQgYWxwaGEgPSBkZXZpY2UuYWxwaGFcbiAgICAgICAgICA/IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWF0aFV0aWxzLmRlZ1RvUmFkKGRldmljZS5hbHBoYSkgKyBzY29wZS5hbHBoYU9mZnNldFxuICAgICAgICAgIDogMDsgLy8gWlxuXG4gICAgICAgIGxldCBiZXRhID0gZGV2aWNlLmJldGEgPyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuYmV0YSkgOiAwOyAvLyBYJ1xuXG4gICAgICAgIGxldCBnYW1tYSA9IGRldmljZS5nYW1tYSA/IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWF0aFV0aWxzLmRlZ1RvUmFkKGRldmljZS5nYW1tYSkgOiAwOyAvLyBZJydcblxuICAgICAgICBjb25zdCBvcmllbnQgPSBzY29wZS5zY3JlZW5PcmllbnRhdGlvblxuICAgICAgICAgID8gdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5NYXRoVXRpbHMuZGVnVG9SYWQoc2NvcGUuc2NyZWVuT3JpZW50YXRpb24pXG4gICAgICAgICAgOiAwOyAvLyBPXG5cbiAgICAgICAgaWYgKHRoaXMuc21vb3RoaW5nRmFjdG9yIDwgMSkge1xuICAgICAgICAgIGlmICh0aGlzLmxhc3RPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgayA9IHRoaXMuc21vb3RoaW5nRmFjdG9yO1xuICAgICAgICAgICAgYWxwaGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgICAgICBhbHBoYSxcbiAgICAgICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uYWxwaGEsXG4gICAgICAgICAgICAgIGtcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBiZXRhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICAgICAgYmV0YSArIE1hdGguUEksXG4gICAgICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmJldGEsXG4gICAgICAgICAgICAgIGtcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBnYW1tYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgICAgIGdhbW1hICsgdGhpcy5IQUxGX1BJLFxuICAgICAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5nYW1tYSxcbiAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgTWF0aC5QSVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmV0YSArPSBNYXRoLlBJO1xuICAgICAgICAgICAgZ2FtbWEgKz0gdGhpcy5IQUxGX1BJO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uID0ge1xuICAgICAgICAgICAgYWxwaGE6IGFscGhhLFxuICAgICAgICAgICAgYmV0YTogYmV0YSxcbiAgICAgICAgICAgIGdhbW1hOiBnYW1tYSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0T2JqZWN0UXVhdGVybmlvbihcbiAgICAgICAgICBzY29wZS5vYmplY3QucXVhdGVybmlvbixcbiAgICAgICAgICBhbHBoYSxcbiAgICAgICAgICB0aGlzLnNtb290aGluZ0ZhY3RvciA8IDEgPyBiZXRhIC0gTWF0aC5QSSA6IGJldGEsXG4gICAgICAgICAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPCAxID8gZ2FtbWEgLSB0aGlzLkhBTEZfUEkgOiBnYW1tYSxcbiAgICAgICAgICBvcmllbnRcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoOCAqICgxIC0gbGFzdFF1YXRlcm5pb24uZG90KHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uKSkgPiBFUFMpIHtcbiAgICAgICAgICBsYXN0UXVhdGVybmlvbi5jb3B5KHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uKTtcbiAgICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KF9jaGFuZ2VFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gTlcgQWRkZWRcbiAgICB0aGlzLl9vcmRlckFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgKGIgPiBhICYmIE1hdGguYWJzKGIgLSBhKSA8IHJhbmdlIC8gMikgfHxcbiAgICAgICAgKGEgPiBiICYmIE1hdGguYWJzKGIgLSBhKSA+IHJhbmdlIC8gMilcbiAgICAgICkge1xuICAgICAgICByZXR1cm4geyBsZWZ0OiBhLCByaWdodDogYiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgbGVmdDogYiwgcmlnaHQ6IGEgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gTlcgQWRkZWRcbiAgICB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIGssIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcbiAgICAgIGNvbnN0IGFuZ2xlcyA9IHRoaXMuX29yZGVyQW5nbGUoYSwgYiwgcmFuZ2UpO1xuICAgICAgY29uc3QgYW5nbGVzaGlmdCA9IGFuZ2xlcy5sZWZ0O1xuICAgICAgY29uc3Qgb3JpZ0FuZ2xlc1JpZ2h0ID0gYW5nbGVzLnJpZ2h0O1xuICAgICAgYW5nbGVzLmxlZnQgPSAwO1xuICAgICAgYW5nbGVzLnJpZ2h0IC09IGFuZ2xlc2hpZnQ7XG4gICAgICBpZiAoYW5nbGVzLnJpZ2h0IDwgMCkgYW5nbGVzLnJpZ2h0ICs9IHJhbmdlO1xuICAgICAgbGV0IG5ld2FuZ2xlID1cbiAgICAgICAgb3JpZ0FuZ2xlc1JpZ2h0ID09IGJcbiAgICAgICAgICA/ICgxIC0gaykgKiBhbmdsZXMucmlnaHQgKyBrICogYW5nbGVzLmxlZnRcbiAgICAgICAgICA6IGsgKiBhbmdsZXMucmlnaHQgKyAoMSAtIGspICogYW5nbGVzLmxlZnQ7XG4gICAgICBuZXdhbmdsZSArPSBhbmdsZXNoaWZ0O1xuICAgICAgaWYgKG5ld2FuZ2xlID49IHJhbmdlKSBuZXdhbmdsZSAtPSByYW5nZTtcbiAgICAgIHJldHVybiBuZXdhbmdsZTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2NvcGUuZGlzY29ubmVjdCgpO1xuICAgIH07XG5cbiAgICB0aGlzLmNvbm5lY3QoKTtcbiAgfVxufVxuXG5cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9sb2NhdGlvbi1iYXNlZC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9sb2NhdGlvbi1iYXNlZC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKiovICgoX191bnVzZWRfd2VicGFja19tb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pID0+IHtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgTG9jYXRpb25CYXNlZDogKCkgPT4gKC8qIGJpbmRpbmcgKi8gTG9jYXRpb25CYXNlZClcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9zcGhtZXJjX3Byb2plY3Rpb25fanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vc3BobWVyYy1wcm9qZWN0aW9uLmpzICovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvc3BobWVyYy1wcm9qZWN0aW9uLmpzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISB0aHJlZSAqLyBcInRocmVlXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19fZGVmYXVsdCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fLm4odGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXyk7XG5cblxuXG5jbGFzcyBMb2NhdGlvbkJhc2VkIHtcbiAgY29uc3RydWN0b3Ioc2NlbmUsIGNhbWVyYSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2NlbmUgPSBzY2VuZTtcbiAgICB0aGlzLl9jYW1lcmEgPSBjYW1lcmE7XG4gICAgdGhpcy5fcHJvaiA9IG5ldyBfc3BobWVyY19wcm9qZWN0aW9uX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uU3BoTWVyY1Byb2plY3Rpb24oKTtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXJzID0ge307XG4gICAgdGhpcy5fbGFzdENvb3JkcyA9IG51bGw7XG4gICAgdGhpcy5fZ3BzTWluRGlzdGFuY2UgPSAwO1xuICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gMTAwO1xuICAgIHRoaXMuX21heGltdW1BZ2UgPSAwO1xuICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gICAgdGhpcy5zZXRHcHNPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uID0gbnVsbDtcbiAgICB0aGlzLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luID0gb3B0aW9ucy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbiB8fCBmYWxzZTtcbiAgfVxuXG4gIHNldFByb2plY3Rpb24ocHJvaikge1xuICAgIHRoaXMuX3Byb2ogPSBwcm9qO1xuICB9XG5cbiAgc2V0R3BzT3B0aW9ucyhvcHRpb25zID0ge30pIHtcbiAgICBpZiAob3B0aW9ucy5ncHNNaW5EaXN0YW5jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9ncHNNaW5EaXN0YW5jZSA9IG9wdGlvbnMuZ3BzTWluRGlzdGFuY2U7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmdwc01pbkFjY3VyYWN5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gb3B0aW9ucy5ncHNNaW5BY2N1cmFjeTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMubWF4aW11bUFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9tYXhpbXVtQWdlID0gb3B0aW9ucy5tYXhpbXVtQWdlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0R3BzKG1heGltdW1BZ2UgPSAwKSB7XG4gICAgaWYgKHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24oXG4gICAgICAgIChwb3NpdGlvbikgPT4ge1xuICAgICAgICAgIHRoaXMuX2dwc1JlY2VpdmVkKHBvc2l0aW9uKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHNlcnJvclwiXSkge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc2Vycm9yXCJdKGVycm9yLmNvZGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChgR1BTIGVycm9yOiBjb2RlICR7ZXJyb3IuY29kZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICAgICAgbWF4aW11bUFnZTogbWF4aW11bUFnZSAhPSAwID8gbWF4aW11bUFnZSA6IHRoaXMuX21heGltdW1BZ2UsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RvcEdwcygpIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkICE9PSBudWxsKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmYWtlR3BzKGxvbiwgbGF0LCBlbGV2ID0gbnVsbCwgYWNjID0gMCkge1xuICAgIGlmIChlbGV2ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldEVsZXZhdGlvbihlbGV2KTtcbiAgICB9XG5cbiAgICB0aGlzLl9ncHNSZWNlaXZlZCh7XG4gICAgICBjb29yZHM6IHtcbiAgICAgICAgbG9uZ2l0dWRlOiBsb24sXG4gICAgICAgIGxhdGl0dWRlOiBsYXQsXG4gICAgICAgIGFjY3VyYWN5OiBhY2MsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgbG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCkge1xuICAgIGNvbnN0IHByb2plY3RlZFBvcyA9IHRoaXMuX3Byb2oucHJvamVjdChsb24sIGxhdCk7XG4gICAgaWYgKHRoaXMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4pIHtcbiAgICAgIGlmICh0aGlzLmluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICBwcm9qZWN0ZWRQb3NbMF0gLT0gdGhpcy5pbml0aWFsUG9zaXRpb25bMF07XG4gICAgICAgIHByb2plY3RlZFBvc1sxXSAtPSB0aGlzLmluaXRpYWxQb3NpdGlvblsxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiVHJ5aW5nIHRvIHVzZSAnaW5pdGlhbCBwb3NpdGlvbiBhcyBvcmlnaW4nIG1vZGUgd2l0aCBubyBpbml0aWFsIHBvc2l0aW9uIGRldGVybWluZWRcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtwcm9qZWN0ZWRQb3NbMF0sIC1wcm9qZWN0ZWRQb3NbMV1dO1xuICB9XG5cbiAgYWRkKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcbiAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldik7XG4gICAgdGhpcy5fc2NlbmUuYWRkKG9iamVjdCk7XG4gIH1cblxuICBzZXRXb3JsZFBvc2l0aW9uKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcbiAgICBjb25zdCB3b3JsZENvb3JkcyA9IHRoaXMubG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCk7XG4gICAgaWYgKGVsZXYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb2JqZWN0LnBvc2l0aW9uLnkgPSBlbGV2O1xuICAgIH1cbiAgICBbb2JqZWN0LnBvc2l0aW9uLngsIG9iamVjdC5wb3NpdGlvbi56XSA9IHdvcmxkQ29vcmRzO1xuICB9XG5cbiAgc2V0RWxldmF0aW9uKGVsZXYpIHtcbiAgICB0aGlzLl9jYW1lcmEucG9zaXRpb24ueSA9IGVsZXY7XG4gIH1cblxuICBvbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbZXZlbnROYW1lXSA9IGV2ZW50SGFuZGxlcjtcbiAgfVxuXG4gIHNldFdvcmxkT3JpZ2luKGxvbiwgbGF0KSB7XG4gICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSB0aGlzLl9wcm9qLnByb2plY3QobG9uLCBsYXQpO1xuICB9XG5cbiAgX2dwc1JlY2VpdmVkKHBvc2l0aW9uKSB7XG4gICAgbGV0IGRpc3RNb3ZlZCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgaWYgKHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSA8PSB0aGlzLl9ncHNNaW5BY2N1cmFjeSkge1xuICAgICAgaWYgKHRoaXMuX2xhc3RDb29yZHMgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fbGFzdENvb3JkcyA9IHtcbiAgICAgICAgICBsYXRpdHVkZTogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgIGxvbmdpdHVkZTogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QodGhpcy5fbGFzdENvb3JkcywgcG9zaXRpb24uY29vcmRzKTtcbiAgICAgIH1cbiAgICAgIGlmIChkaXN0TW92ZWQgPj0gdGhpcy5fZ3BzTWluRGlzdGFuY2UpIHtcbiAgICAgICAgdGhpcy5fbGFzdENvb3Jkcy5sb25naXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICB0aGlzLl9sYXN0Q29vcmRzLmxhdGl0dWRlID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luICYmICF0aGlzLmluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICAgIHRoaXMuc2V0V29ybGRPcmlnaW4oXG4gICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0V29ybGRQb3NpdGlvbihcbiAgICAgICAgICB0aGlzLl9jYW1lcmEsXG4gICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc3VwZGF0ZVwiXSkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHN1cGRhdGVcIl0ocG9zaXRpb24sIGRpc3RNb3ZlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGhhdmVyc2luZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBsYXQvbG9uIHBhaXJzLlxuICAgKlxuICAgKiBUYWtlbiBmcm9tIG9yaWdpbmFsIEEtRnJhbWUgY29tcG9uZW50c1xuICAgKi9cbiAgX2hhdmVyc2luZURpc3Qoc3JjLCBkZXN0KSB7XG4gICAgY29uc3QgZGxvbmdpdHVkZSA9IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18uTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XG4gICAgY29uc3QgZGxhdGl0dWRlID0gdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXy5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSAtIHNyYy5sYXRpdHVkZSk7XG5cbiAgICBjb25zdCBhID1cbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xuICAgICAgTWF0aC5jb3ModGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXy5NYXRoVXRpbHMuZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKlxuICAgICAgICBNYXRoLmNvcyh0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKSkgKlxuICAgICAgICAoTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpKTtcbiAgICBjb25zdCBhbmdsZSA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcbiAgfVxufVxuXG5cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9zcGhtZXJjLXByb2plY3Rpb24uanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3NwaG1lcmMtcHJvamVjdGlvbi5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKF9fdW51c2VkX3dlYnBhY2tfbW9kdWxlLCBfX3dlYnBhY2tfZXhwb3J0c19fLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSA9PiB7XG5cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFNwaE1lcmNQcm9qZWN0aW9uOiAoKSA9PiAoLyogYmluZGluZyAqLyBTcGhNZXJjUHJvamVjdGlvbilcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuY2xhc3MgU3BoTWVyY1Byb2plY3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkVBUlRIID0gNDAwNzUwMTYuNjg7XG4gICAgdGhpcy5IQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG4gIH1cblxuICBwcm9qZWN0KGxvbiwgbGF0KSB7XG4gICAgcmV0dXJuIFt0aGlzLmxvblRvU3BoTWVyYyhsb24pLCB0aGlzLmxhdFRvU3BoTWVyYyhsYXQpXTtcbiAgfVxuXG4gIHVucHJvamVjdChwcm9qZWN0ZWQpIHtcbiAgICByZXR1cm4gW3RoaXMuc3BoTWVyY1RvTG9uKHByb2plY3RlZFswXSksIHRoaXMuc3BoTWVyY1RvTGF0KHByb2plY3RlZFsxXSldO1xuICB9XG5cbiAgbG9uVG9TcGhNZXJjKGxvbikge1xuICAgIHJldHVybiAobG9uIC8gMTgwKSAqIHRoaXMuSEFMRl9FQVJUSDtcbiAgfVxuXG4gIGxhdFRvU3BoTWVyYyhsYXQpIHtcbiAgICB2YXIgeSA9IE1hdGgubG9nKE1hdGgudGFuKCgoOTAgKyBsYXQpICogTWF0aC5QSSkgLyAzNjApKSAvIChNYXRoLlBJIC8gMTgwKTtcbiAgICByZXR1cm4gKHkgKiB0aGlzLkhBTEZfRUFSVEgpIC8gMTgwLjA7XG4gIH1cblxuICBzcGhNZXJjVG9Mb24oeCkge1xuICAgIHJldHVybiAoeCAvIHRoaXMuSEFMRl9FQVJUSCkgKiAxODAuMDtcbiAgfVxuXG4gIHNwaE1lcmNUb0xhdCh5KSB7XG4gICAgdmFyIGxhdCA9ICh5IC8gdGhpcy5IQUxGX0VBUlRIKSAqIDE4MC4wO1xuICAgIGxhdCA9XG4gICAgICAoMTgwIC8gTWF0aC5QSSkgKlxuICAgICAgKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoKGxhdCAqIE1hdGguUEkpIC8gMTgwKSkgLSBNYXRoLlBJIC8gMik7XG4gICAgcmV0dXJuIGxhdDtcbiAgfVxuXG4gIGdldElEKCkge1xuICAgIHJldHVybiBcImVwc2c6Mzg1N1wiO1xuICB9XG59XG5cblxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3dlYmNhbS1yZW5kZXJlci5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvd2ViY2FtLXJlbmRlcmVyLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKiovICgoX191bnVzZWRfd2VicGFja19tb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pID0+IHtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgV2ViY2FtUmVuZGVyZXI6ICgpID0+ICgvKiBiaW5kaW5nICovIFdlYmNhbVJlbmRlcmVyKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIHRocmVlICovIFwidGhyZWVcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX19kZWZhdWx0ID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18ubih0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fKTtcblxuXG5jbGFzcyBXZWJjYW1SZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHJlbmRlcmVyLCB2aWRlb0VsZW1lbnQpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgdGhpcy5yZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICB0aGlzLnNjZW5lV2ViY2FtID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uU2NlbmUoKTtcbiAgICBsZXQgdmlkZW87XG4gICAgaWYgKHZpZGVvRWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcbiAgICAgIHZpZGVvLnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIHRydWUpO1xuICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwicGxheXNpbmxpbmVcIiwgdHJ1ZSk7XG4gICAgICB2aWRlby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZGVvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHZpZGVvRWxlbWVudCk7XG4gICAgfVxuICAgIHRoaXMuZ2VvbSA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlBsYW5lQnVmZmVyR2VvbWV0cnkoKTtcbiAgICB0aGlzLnRleHR1cmUgPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5WaWRlb1RleHR1cmUodmlkZW8pO1xuICAgIHRoaXMubWF0ZXJpYWwgPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGhpcy50ZXh0dXJlIH0pO1xuICAgIGNvbnN0IG1lc2ggPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZVdlYmNhbS5hZGQobWVzaCk7XG4gICAgdGhpcy5jYW1lcmFXZWJjYW0gPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5PcnRob2dyYXBoaWNDYW1lcmEoXG4gICAgICAtMC41LFxuICAgICAgMC41LFxuICAgICAgMC41LFxuICAgICAgLTAuNSxcbiAgICAgIDAsXG4gICAgICAxMFxuICAgICk7XG4gICAgaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMgJiYgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcbiAgICAgIGNvbnN0IGNvbnN0cmFpbnRzID0ge1xuICAgICAgICB2aWRlbzoge1xuICAgICAgICAgIHdpZHRoOiAxMjgwLFxuICAgICAgICAgIGhlaWdodDogNzIwLFxuICAgICAgICAgIGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIixcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAgIC5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpXG4gICAgICAgIC50aGVuKChzdHJlYW0pID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgdXNpbmcgdGhlIHdlYmNhbSBzdWNjZXNzZnVsbHkuLi5gKTtcbiAgICAgICAgICB2aWRlby5zcmNPYmplY3QgPSBzdHJlYW07XG4gICAgICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRXJyb3JQb3B1cChcbiAgICAgICAgICAgICAgXCJXZWJjYW0gRXJyb3JcXG5OYW1lOiBcIiArIGUubmFtZSArIFwiXFxuTWVzc2FnZTogXCIgKyBlLm1lc3NhZ2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5jcmVhdGVFcnJvclBvcHVwKFwic29ycnkgLSBtZWRpYSBkZXZpY2VzIEFQSSBub3Qgc3VwcG9ydGVkXCIpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMucmVuZGVyZXIuY2xlYXIoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lV2ViY2FtLCB0aGlzLmNhbWVyYVdlYmNhbSk7XG4gICAgdGhpcy5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XG4gICAgdGhpcy5nZW9tLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGNyZWF0ZUVycm9yUG9wdXAobXNnKSB7XG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yLXBvcHVwXCIpKSB7XG4gICAgICB2YXIgZXJyb3JQb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBlcnJvclBvcHVwLmlubmVySFRNTCA9IG1zZztcbiAgICAgIGVycm9yUG9wdXAuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJlcnJvci1wb3B1cFwiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZXJyb3JQb3B1cCk7XG4gICAgfVxuICB9XG59XG5cblxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcInRocmVlXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9ICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKiovICgobW9kdWxlKSA9PiB7XG5cbm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fO1xuXG4vKioqLyB9KVxuXG4vKioqKioqLyBcdH0pO1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG4vKioqKioqLyBcdFx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG4vKioqKioqLyBcdFx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge31cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4vKioqKioqLyBcdFx0XHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuLyoqKioqKi8gXHRcdFx0XHQoKSA9PiAobW9kdWxlKTtcbi8qKioqKiovIFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGdldHRlcjtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSlcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgbW9kdWxlcyBpbiB0aGUgY2h1bmsuXG4oKCkgPT4ge1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIERldmljZU9yaWVudGF0aW9uQ29udHJvbHM6ICgpID0+ICgvKiByZWV4cG9ydCBzYWZlICovIF9qc19kZXZpY2Vfb3JpZW50YXRpb25fY29udHJvbHNfanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfXy5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgTG9jYXRpb25CYXNlZDogKCkgPT4gKC8qIHJlZXhwb3J0IHNhZmUgKi8gX2pzX2xvY2F0aW9uX2Jhc2VkX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTG9jYXRpb25CYXNlZCksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFdlYmNhbVJlbmRlcmVyOiAoKSA9PiAoLyogcmVleHBvcnQgc2FmZSAqLyBfanNfd2ViY2FtX3JlbmRlcmVyX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18uV2ViY2FtUmVuZGVyZXIpXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfanNfbG9jYXRpb25fYmFzZWRfanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vanMvbG9jYXRpb24tYmFzZWQuanMgKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9sb2NhdGlvbi1iYXNlZC5qc1wiKTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfanNfd2ViY2FtX3JlbmRlcmVyX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2pzL3dlYmNhbS1yZW5kZXJlci5qcyAqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3dlYmNhbS1yZW5kZXJlci5qc1wiKTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfanNfZGV2aWNlX29yaWVudGF0aW9uX2NvbnRyb2xzX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8yX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2pzL2RldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qcyAqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2RldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qc1wiKTtcblxuXG5cblxuXG5cbn0pKCk7XG5cbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyB9KSgpXG47XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWVhJdGRHaHlaV1Y0TFd4dlkyRjBhVzl1TFc5dWJIa3Vhbk1pTENKdFlYQndhVzVuY3lJNklrRkJRVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUTBGQlF6dEJRVU5FTEU4N096czdPenM3T3pzN096czdPenM3UVVOV1FUdEJRVU5CT3p0QlFVVXJSVHM3UVVGRkwwVXNhVUpCUVdsQ0xEQkRRVUZQTzBGQlEzaENMRzFDUVVGdFFpeDNRMEZCU3p0QlFVTjRRaXhuUWtGQlowSXNOa05CUVZVN1FVRkRNVUlzWjBKQlFXZENMRFpEUVVGVkxIbERRVUY1UXpzN1FVRkZia1VzZFVKQlFYVkNPenRCUVVWMlFpeDNRMEZCZDBNc2EwUkJRV1U3UVVGRGRrUTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPenRCUVVWQk8wRkJRMEVzSzBKQlFTdENMRFpEUVVGVk96dEJRVVY2UXp0QlFVTkJPenRCUVVWQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFc01FSkJRVEJDT3p0QlFVVXhRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTERoRFFVRTRRenM3UVVGRk9VTXNkVU5CUVhWRE96dEJRVVYyUXl4blEwRkJaME03TzBGQlJXaERMR2RGUVVGblJUdEJRVU5vUlRzN1FVRkZRVHRCUVVOQkxIZERRVUYzUXpzN1FVRkZlRU03TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeFhRVUZYTzBGQlExZzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxGZEJRVmM3UVVGRFdDeFJRVUZSTzBGQlExSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3cwUTBGQlV6dEJRVU55UWl4bFFVRmxPenRCUVVWbUxHbERRVUZwUXl3MFEwRkJVeXcwUWtGQk5FSTdPMEZCUlhSRkxHMURRVUZ0UXl3MFEwRkJVeXcyUWtGQk5rSTdPMEZCUlhwRk8wRkJRMEVzV1VGQldTdzBRMEZCVXp0QlFVTnlRaXhsUVVGbE96dEJRVVZtTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMR2xDUVVGcFFqdEJRVU5xUWl4UlFVRlJPMEZCUTFJc2FVSkJRV2xDTzBGQlEycENPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRmNVTTdPenM3T3pzN096czdPenM3T3pzN096dEJRM0JQZFVJN1FVRkROMEk3TzBGQlJTOUNPMEZCUTBFc2VVTkJRWGxETzBGQlEzcERPMEZCUTBFN1FVRkRRU3h4UWtGQmNVSXNjVVZCUVdsQ08wRkJRM1JETzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFTdzBRa0ZCTkVJN1FVRkROVUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxGTkJRVk03UVVGRFZEdEJRVU5CTzBGQlEwRTdRVUZEUVN4WlFVRlpPMEZCUTFvc2NVTkJRWEZETEZkQlFWYzdRVUZEYUVRN1FVRkRRU3hUUVVGVE8wRkJRMVE3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRTlCUVU4N1FVRkRVQ3hMUVVGTE8wRkJRMHc3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzVVVGQlVUdEJRVU5TTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEZGQlFWRTdRVUZEVWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4MVFrRkJkVUlzTkVOQlFXVTdRVUZEZEVNc2MwSkJRWE5DTERSRFFVRmxPenRCUVVWeVF6dEJRVU5CTzBGQlEwRXNaVUZCWlN3MFEwRkJaVHRCUVVNNVFpeHBRa0ZCYVVJc05FTkJRV1U3UVVGRGFFTTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRmVVSTdPenM3T3pzN096czdPenM3T3p0QlF6ZExla0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJUWkNPenM3T3pzN096czdPenM3T3pzN096dEJRM2hEUlRzN1FVRkZMMEk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN3eVFrRkJNa0lzZDBOQlFWYzdRVUZEZEVNN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4TlFVRk5PMEZCUTA0N1FVRkRRVHRCUVVOQkxHOUNRVUZ2UWl4elJFRkJlVUk3UVVGRE4wTXNkVUpCUVhWQ0xDdERRVUZyUWp0QlFVTjZReXgzUWtGQmQwSXNiMFJCUVhWQ0xFZEJRVWNzYlVKQlFXMUNPMEZCUTNKRkxIRkNRVUZ4UWl4MVEwRkJWVHRCUVVNdlFqdEJRVU5CTERSQ1FVRTBRaXh4UkVGQmQwSTdRVUZEY0VRN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeFRRVUZUTzBGQlExUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeFRRVUZUTzBGQlExUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxGZEJRVmM3UVVGRFdDeFRRVUZUTzBGQlExUXNUVUZCVFR0QlFVTk9PMEZCUTBFN1FVRkRRU3hQUVVGUE8wRkJRMUE3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVV3UWpzN096czdPenM3T3pzN1FVTnFSakZDT3pzN096czdWVU5CUVR0VlFVTkJPenRWUVVWQk8xVkJRMEU3VlVGRFFUdFZRVU5CTzFWQlEwRTdWVUZEUVR0VlFVTkJPMVZCUTBFN1ZVRkRRVHRWUVVOQk8xVkJRMEU3VlVGRFFUdFZRVU5CT3p0VlFVVkJPMVZCUTBFN08xVkJSVUU3VlVGRFFUdFZRVU5CT3pzN096dFhRM1JDUVR0WFFVTkJPMWRCUTBFN1YwRkRRVHRYUVVOQk8xZEJRMEVzYVVOQlFXbERMRmRCUVZjN1YwRkROVU03VjBGRFFUczdPenM3VjBOUVFUdFhRVU5CTzFkQlEwRTdWMEZEUVR0WFFVTkJMSGxEUVVGNVF5eDNRMEZCZDBNN1YwRkRha1k3VjBGRFFUdFhRVU5CT3pzN096dFhRMUJCT3pzN096dFhRMEZCTzFkQlEwRTdWMEZEUVR0WFFVTkJMSFZFUVVGMVJDeHBRa0ZCYVVJN1YwRkRlRVU3VjBGRFFTeG5SRUZCWjBRc1lVRkJZVHRYUVVNM1JEczdPenM3T3pzN096czdPenM3T3pzN096dEJRMDUxUkR0QlFVTkZPMEZCUTNWQ096dEJRVVZhSWl3aWMyOTFjbU5sY3lJNld5SjNaV0p3WVdOck9pOHZWRWhTUlVWNEwzZGxZbkJoWTJzdmRXNXBkbVZ5YzJGc1RXOWtkV3hsUkdWbWFXNXBkR2x2YmlJc0luZGxZbkJoWTJzNkx5OVVTRkpGUlhndkxpOTBhSEpsWlM1cWN5OXpjbU12Ykc5allYUnBiMjR0WW1GelpXUXZhbk12WkdWMmFXTmxMVzl5YVdWdWRHRjBhVzl1TFdOdmJuUnliMnh6TG1weklpd2lkMlZpY0dGamF6b3ZMMVJJVWtWRmVDOHVMM1JvY21WbExtcHpMM055WXk5c2IyTmhkR2x2YmkxaVlYTmxaQzlxY3k5c2IyTmhkR2x2YmkxaVlYTmxaQzVxY3lJc0luZGxZbkJoWTJzNkx5OVVTRkpGUlhndkxpOTBhSEpsWlM1cWN5OXpjbU12Ykc5allYUnBiMjR0WW1GelpXUXZhbk12YzNCb2JXVnlZeTF3Y205cVpXTjBhVzl1TG1weklpd2lkMlZpY0dGamF6b3ZMMVJJVWtWRmVDOHVMM1JvY21WbExtcHpMM055WXk5c2IyTmhkR2x2YmkxaVlYTmxaQzlxY3k5M1pXSmpZVzB0Y21WdVpHVnlaWEl1YW5NaUxDSjNaV0p3WVdOck9pOHZWRWhTUlVWNEwyVjRkR1Z5Ym1Gc0lIVnRaQ0I3WENKamIyMXRiMjVxYzF3aU9sd2lkR2h5WldWY0lpeGNJbU52YlcxdmJtcHpNbHdpT2x3aWRHaHlaV1ZjSWl4Y0ltRnRaRndpT2x3aWRHaHlaV1ZjSWl4Y0luSnZiM1JjSWpwY0lsUklVa1ZGWENKOUlpd2lkMlZpY0dGamF6b3ZMMVJJVWtWRmVDOTNaV0p3WVdOckwySnZiM1J6ZEhKaGNDSXNJbmRsWW5CaFkyczZMeTlVU0ZKRlJYZ3ZkMlZpY0dGamF5OXlkVzUwYVcxbEwyTnZiWEJoZENCblpYUWdaR1ZtWVhWc2RDQmxlSEJ2Y25RaUxDSjNaV0p3WVdOck9pOHZWRWhTUlVWNEwzZGxZbkJoWTJzdmNuVnVkR2x0WlM5a1pXWnBibVVnY0hKdmNHVnlkSGtnWjJWMGRHVnljeUlzSW5kbFluQmhZMnM2THk5VVNGSkZSWGd2ZDJWaWNHRmpheTl5ZFc1MGFXMWxMMmhoYzA5M2JsQnliM0JsY25SNUlITm9iM0owYUdGdVpDSXNJbmRsWW5CaFkyczZMeTlVU0ZKRlJYZ3ZkMlZpY0dGamF5OXlkVzUwYVcxbEwyMWhhMlVnYm1GdFpYTndZV05sSUc5aWFtVmpkQ0lzSW5kbFluQmhZMnM2THk5VVNGSkZSWGd2TGk5MGFISmxaUzVxY3k5emNtTXZiRzlqWVhScGIyNHRZbUZ6WldRdmFXNWtaWGd1YW5NaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLR1oxYm1OMGFXOXVJSGRsWW5CaFkydFZibWwyWlhKellXeE5iMlIxYkdWRVpXWnBibWwwYVc5dUtISnZiM1FzSUdaaFkzUnZjbmtwSUh0Y2JseDBhV1lvZEhsd1pXOW1JR1Y0Y0c5eWRITWdQVDA5SUNkdlltcGxZM1FuSUNZbUlIUjVjR1Z2WmlCdGIyUjFiR1VnUFQwOUlDZHZZbXBsWTNRbktWeHVYSFJjZEcxdlpIVnNaUzVsZUhCdmNuUnpJRDBnWm1GamRHOXllU2h5WlhGMWFYSmxLRndpZEdoeVpXVmNJaWtwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCa1pXWnBibVVnUFQwOUlDZG1kVzVqZEdsdmJpY2dKaVlnWkdWbWFXNWxMbUZ0WkNsY2JseDBYSFJrWldacGJtVW9XMXdpZEdoeVpXVmNJbDBzSUdaaFkzUnZjbmtwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCbGVIQnZjblJ6SUQwOVBTQW5iMkpxWldOMEp5bGNibHgwWEhSbGVIQnZjblJ6VzF3aVZFaFNSVVY0WENKZElEMGdabUZqZEc5eWVTaHlaWEYxYVhKbEtGd2lkR2h5WldWY0lpa3BPMXh1WEhSbGJITmxYRzVjZEZ4MGNtOXZkRnRjSWxSSVVrVkZlRndpWFNBOUlHWmhZM1J2Y25rb2NtOXZkRnRjSWxSSVVrVkZYQ0pkS1R0Y2JuMHBLSFJvYVhNc0lDaGZYMWRGUWxCQlEwdGZSVmhVUlZKT1FVeGZUVTlFVlV4RlgzUm9jbVZsWDE4cElEMCtJSHRjYm5KbGRIVnliaUFpTENJdkx5Qk5iMlJwWm1sbFpDQjJaWEp6YVc5dUlHOW1JRlJJVWtWRkxrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVEyOXVkSEp2YkhNZ1puSnZiU0IwYUhKbFpTNXFjMXh1THk4Z2QybHNiQ0IxYzJVZ2RHaGxJR1JsZG1salpXOXlhV1Z1ZEdGMGFXOXVZV0p6YjJ4MWRHVWdaWFpsYm5RZ2FXWWdZWFpoYVd4aFlteGxYRzVjYm1sdGNHOXlkQ0I3SUVWMWJHVnlMQ0JGZG1WdWRFUnBjM0JoZEdOb1pYSXNJRTFoZEdoVmRHbHNjeXdnVVhWaGRHVnlibWx2Yml3Z1ZtVmpkRzl5TXlCOUlHWnliMjBnWENKMGFISmxaVndpTzF4dVhHNWpiMjV6ZENCZmVtVmxJRDBnYm1WM0lGWmxZM1J2Y2pNb01Dd2dNQ3dnTVNrN1hHNWpiMjV6ZENCZlpYVnNaWElnUFNCdVpYY2dSWFZzWlhJb0tUdGNibU52Ym5OMElGOXhNQ0E5SUc1bGR5QlJkV0YwWlhKdWFXOXVLQ2s3WEc1amIyNXpkQ0JmY1RFZ1BTQnVaWGNnVVhWaGRHVnlibWx2YmlndFRXRjBhQzV6Y1hKMEtEQXVOU2tzSURBc0lEQXNJRTFoZEdndWMzRnlkQ2d3TGpVcEtUc2dMeThnTFNCUVNTOHlJR0Z5YjNWdVpDQjBhR1VnZUMxaGVHbHpYRzVjYm1OdmJuTjBJRjlqYUdGdVoyVkZkbVZ1ZENBOUlIc2dkSGx3WlRvZ1hDSmphR0Z1WjJWY0lpQjlPMXh1WEc1amJHRnpjeUJFWlhacFkyVlBjbWxsYm5SaGRHbHZia052Ym5SeWIyeHpJR1Y0ZEdWdVpITWdSWFpsYm5SRWFYTndZWFJqYUdWeUlIdGNiaUFnWTI5dWMzUnlkV04wYjNJb2IySnFaV04wS1NCN1hHNGdJQ0FnYzNWd1pYSW9LVHRjYmx4dUlDQWdJR2xtSUNoM2FXNWtiM2N1YVhOVFpXTjFjbVZEYjI1MFpYaDBJRDA5UFNCbVlXeHpaU2tnZTF4dUlDQWdJQ0FnWTI5dWMyOXNaUzVsY25KdmNpaGNiaUFnSUNBZ0lDQWdYQ0pVU0ZKRlJTNUVaWFpwWTJWUGNtbGxiblJoZEdsdmJrTnZiblJ5YjJ4ek9pQkVaWFpwWTJWUGNtbGxiblJoZEdsdmJrVjJaVzUwSUdseklHOXViSGtnWVhaaGFXeGhZbXhsSUdsdUlITmxZM1Z5WlNCamIyNTBaWGgwY3lBb2FIUjBjSE1wWENKY2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWTI5dWMzUWdjMk52Y0dVZ1BTQjBhR2x6TzF4dVhHNGdJQ0FnWTI5dWMzUWdSVkJUSUQwZ01DNHdNREF3TURFN1hHNGdJQ0FnWTI5dWMzUWdiR0Z6ZEZGMVlYUmxjbTVwYjI0Z1BTQnVaWGNnVVhWaGRHVnlibWx2YmlncE8xeHVYRzRnSUNBZ2RHaHBjeTV2WW1wbFkzUWdQU0J2WW1wbFkzUTdYRzRnSUNBZ2RHaHBjeTV2WW1wbFkzUXVjbTkwWVhScGIyNHVjbVZ2Y21SbGNpaGNJbGxZV2x3aUtUdGNibHh1SUNBZ0lIUm9hWE11Wlc1aFlteGxaQ0E5SUhSeWRXVTdYRzVjYmlBZ0lDQjBhR2x6TG1SbGRtbGpaVTl5YVdWdWRHRjBhVzl1SUQwZ2UzMDdYRzRnSUNBZ2RHaHBjeTV6WTNKbFpXNVBjbWxsYm5SaGRHbHZiaUE5SURBN1hHNWNiaUFnSUNCMGFHbHpMbUZzY0doaFQyWm1jMlYwSUQwZ01Ec2dMeThnY21Ga2FXRnVjMXh1WEc0Z0lDQWdkR2hwY3k1VVYwOWZVRWtnUFNBeUlDb2dUV0YwYUM1UVNUdGNiaUFnSUNCMGFHbHpMa2hCVEVaZlVFa2dQU0F3TGpVZ0tpQk5ZWFJvTGxCSk8xeHVJQ0FnSUhSb2FYTXViM0pwWlc1MFlYUnBiMjVEYUdGdVoyVkZkbVZ1ZEU1aGJXVWdQVnh1SUNBZ0lDQWdYQ0p2Ym1SbGRtbGpaVzl5YVdWdWRHRjBhVzl1WVdKemIyeDFkR1ZjSWlCcGJpQjNhVzVrYjNkY2JpQWdJQ0FnSUNBZ1B5QmNJbVJsZG1salpXOXlhV1Z1ZEdGMGFXOXVZV0p6YjJ4MWRHVmNJbHh1SUNBZ0lDQWdJQ0E2SUZ3aVpHVjJhV05sYjNKcFpXNTBZWFJwYjI1Y0lqdGNibHh1SUNBZ0lIUm9hWE11YzIxdmIzUm9hVzVuUm1GamRHOXlJRDBnTVR0Y2JseHVJQ0FnSUdOdmJuTjBJRzl1UkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVEYUdGdVoyVkZkbVZ1ZENBOUlHWjFibU4wYVc5dUlDaGxkbVZ1ZENrZ2UxeHVJQ0FnSUNBZ2MyTnZjR1V1WkdWMmFXTmxUM0pwWlc1MFlYUnBiMjRnUFNCbGRtVnVkRHRjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdZMjl1YzNRZ2IyNVRZM0psWlc1UGNtbGxiblJoZEdsdmJrTm9ZVzVuWlVWMlpXNTBJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2MyTnZjR1V1YzJOeVpXVnVUM0pwWlc1MFlYUnBiMjRnUFNCM2FXNWtiM2N1YjNKcFpXNTBZWFJwYjI0Z2ZId2dNRHRjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdMeThnVkdobElHRnVaMnhsY3lCaGJIQm9ZU3dnWW1WMFlTQmhibVFnWjJGdGJXRWdabTl5YlNCaElITmxkQ0J2WmlCcGJuUnlhVzV6YVdNZ1ZHRnBkQzFDY25saGJpQmhibWRzWlhNZ2IyWWdkSGx3WlNCYUxWZ25MVmtuSjF4dVhHNGdJQ0FnWTI5dWMzUWdjMlYwVDJKcVpXTjBVWFZoZEdWeWJtbHZiaUE5SUdaMWJtTjBhVzl1SUNoY2JpQWdJQ0FnSUhGMVlYUmxjbTVwYjI0c1hHNGdJQ0FnSUNCaGJIQm9ZU3hjYmlBZ0lDQWdJR0psZEdFc1hHNGdJQ0FnSUNCbllXMXRZU3hjYmlBZ0lDQWdJRzl5YVdWdWRGeHVJQ0FnSUNrZ2UxeHVJQ0FnSUNBZ1gyVjFiR1Z5TG5ObGRDaGlaWFJoTENCaGJIQm9ZU3dnTFdkaGJXMWhMQ0JjSWxsWVdsd2lLVHNnTHk4Z0oxcFlXU2NnWm05eUlIUm9aU0JrWlhacFkyVXNJR0oxZENBbldWaGFKeUJtYjNJZ2RYTmNibHh1SUNBZ0lDQWdjWFZoZEdWeWJtbHZiaTV6WlhSR2NtOXRSWFZzWlhJb1gyVjFiR1Z5S1RzZ0x5OGdiM0pwWlc1MElIUm9aU0JrWlhacFkyVmNibHh1SUNBZ0lDQWdjWFZoZEdWeWJtbHZiaTV0ZFd4MGFYQnNlU2hmY1RFcE95QXZMeUJqWVcxbGNtRWdiRzl2YTNNZ2IzVjBJSFJvWlNCaVlXTnJJRzltSUhSb1pTQmtaWFpwWTJVc0lHNXZkQ0IwYUdVZ2RHOXdYRzVjYmlBZ0lDQWdJSEYxWVhSbGNtNXBiMjR1YlhWc2RHbHdiSGtvWDNFd0xuTmxkRVp5YjIxQmVHbHpRVzVuYkdVb1gzcGxaU3dnTFc5eWFXVnVkQ2twT3lBdkx5QmhaR3AxYzNRZ1ptOXlJSE5qY21WbGJpQnZjbWxsYm5SaGRHbHZibHh1SUNBZ0lIMDdYRzVjYmlBZ0lDQjBhR2x6TG1OdmJtNWxZM1FnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQnZibE5qY21WbGJrOXlhV1Z1ZEdGMGFXOXVRMmhoYm1kbFJYWmxiblFvS1RzZ0x5OGdjblZ1SUc5dVkyVWdiMjRnYkc5aFpGeHVYRzRnSUNBZ0lDQXZMeUJwVDFNZ01UTXJYRzVjYmlBZ0lDQWdJR2xtSUNoY2JpQWdJQ0FnSUNBZ2QybHVaRzkzTGtSbGRtbGpaVTl5YVdWdWRHRjBhVzl1UlhabGJuUWdJVDA5SUhWdVpHVm1hVzVsWkNBbUpseHVJQ0FnSUNBZ0lDQjBlWEJsYjJZZ2QybHVaRzkzTGtSbGRtbGpaVTl5YVdWdWRHRjBhVzl1UlhabGJuUXVjbVZ4ZFdWemRGQmxjbTFwYzNOcGIyNGdQVDA5SUZ3aVpuVnVZM1JwYjI1Y0lseHVJQ0FnSUNBZ0tTQjdYRzRnSUNBZ0lDQWdJSGRwYm1SdmR5NUVaWFpwWTJWUGNtbGxiblJoZEdsdmJrVjJaVzUwTG5KbGNYVmxjM1JRWlhKdGFYTnphVzl1S0NsY2JpQWdJQ0FnSUNBZ0lDQXVkR2hsYmlnb2NtVnpjRzl1YzJVcElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2h5WlhOd2IyNXpaU0E5UFQwZ1hDSm5jbUZ1ZEdWa1hDSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hDSnZjbWxsYm5SaGRHbHZibU5vWVc1blpWd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzl1VTJOeVpXVnVUM0pwWlc1MFlYUnBiMjVEYUdGdVoyVkZkbVZ1ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0IzYVc1a2IzY3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpaGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpZMjl3WlM1dmNtbGxiblJoZEdsdmJrTm9ZVzVuWlVWMlpXNTBUbUZ0WlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdmJrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVEyaGhibWRsUlhabGJuUmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQjlLVnh1SUNBZ0lDQWdJQ0FnSUM1allYUmphQ2htZFc1amRHbHZiaUFvWlhKeWIzSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk52YkdVdVpYSnliM0lvWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRndpVkVoU1JVVXVSR1YyYVdObFQzSnBaVzUwWVhScGIyNURiMjUwY205c2N6b2dWVzVoWW14bElIUnZJSFZ6WlNCRVpYWnBZMlZQY21sbGJuUmhkR2x2YmlCQlVFazZYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR1Z5Y205eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1hHNGdJQ0FnSUNBZ0lDQWdYQ0p2Y21sbGJuUmhkR2x2Ym1Ob1lXNW5aVndpTEZ4dUlDQWdJQ0FnSUNBZ0lHOXVVMk55WldWdVQzSnBaVzUwWVhScGIyNURhR0Z1WjJWRmRtVnVkRnh1SUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnSUNCM2FXNWtiM2N1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhjYmlBZ0lDQWdJQ0FnSUNCelkyOXdaUzV2Y21sbGJuUmhkR2x2YmtOb1lXNW5aVVYyWlc1MFRtRnRaU3hjYmlBZ0lDQWdJQ0FnSUNCdmJrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVEyaGhibWRsUlhabGJuUmNiaUFnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYzJOdmNHVXVaVzVoWW14bFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnZlR0Y2JseHVJQ0FnSUhSb2FYTXVaR2x6WTI5dWJtVmpkQ0E5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lIZHBibVJ2ZHk1eVpXMXZkbVZGZG1WdWRFeHBjM1JsYm1WeUtGeHVJQ0FnSUNBZ0lDQmNJbTl5YVdWdWRHRjBhVzl1WTJoaGJtZGxYQ0lzWEc0Z0lDQWdJQ0FnSUc5dVUyTnlaV1Z1VDNKcFpXNTBZWFJwYjI1RGFHRnVaMlZGZG1WdWRGeHVJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lIZHBibVJ2ZHk1eVpXMXZkbVZGZG1WdWRFeHBjM1JsYm1WeUtGeHVJQ0FnSUNBZ0lDQnpZMjl3WlM1dmNtbGxiblJoZEdsdmJrTm9ZVzVuWlVWMlpXNTBUbUZ0WlN4Y2JpQWdJQ0FnSUNBZ2IyNUVaWFpwWTJWUGNtbGxiblJoZEdsdmJrTm9ZVzVuWlVWMlpXNTBYRzRnSUNBZ0lDQXBPMXh1WEc0Z0lDQWdJQ0J6WTI5d1pTNWxibUZpYkdWa0lEMGdabUZzYzJVN1hHNGdJQ0FnZlR0Y2JseHVJQ0FnSUhSb2FYTXVkWEJrWVhSbElEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tITmpiM0JsTG1WdVlXSnNaV1FnUFQwOUlHWmhiSE5sS1NCeVpYUjFjbTQ3WEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR1JsZG1salpTQTlJSE5qYjNCbExtUmxkbWxqWlU5eWFXVnVkR0YwYVc5dU8xeHVYRzRnSUNBZ0lDQnBaaUFvWkdWMmFXTmxLU0I3WEc0Z0lDQWdJQ0FnSUd4bGRDQmhiSEJvWVNBOUlHUmxkbWxqWlM1aGJIQm9ZVnh1SUNBZ0lDQWdJQ0FnSUQ4Z1RXRjBhRlYwYVd4ekxtUmxaMVJ2VW1Ga0tHUmxkbWxqWlM1aGJIQm9ZU2tnS3lCelkyOXdaUzVoYkhCb1lVOW1abk5sZEZ4dUlDQWdJQ0FnSUNBZ0lEb2dNRHNnTHk4Z1dseHVYRzRnSUNBZ0lDQWdJR3hsZENCaVpYUmhJRDBnWkdWMmFXTmxMbUpsZEdFZ1B5Qk5ZWFJvVlhScGJITXVaR1ZuVkc5U1lXUW9aR1YyYVdObExtSmxkR0VwSURvZ01Ec2dMeThnV0NkY2JseHVJQ0FnSUNBZ0lDQnNaWFFnWjJGdGJXRWdQU0JrWlhacFkyVXVaMkZ0YldFZ1B5Qk5ZWFJvVlhScGJITXVaR1ZuVkc5U1lXUW9aR1YyYVdObExtZGhiVzFoS1NBNklEQTdJQzh2SUZrbkoxeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHOXlhV1Z1ZENBOUlITmpiM0JsTG5OamNtVmxiazl5YVdWdWRHRjBhVzl1WEc0Z0lDQWdJQ0FnSUNBZ1B5Qk5ZWFJvVlhScGJITXVaR1ZuVkc5U1lXUW9jMk52Y0dVdWMyTnlaV1Z1VDNKcFpXNTBZWFJwYjI0cFhHNGdJQ0FnSUNBZ0lDQWdPaUF3T3lBdkx5QlBYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11YzIxdmIzUm9hVzVuUm1GamRHOXlJRHdnTVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbXhoYzNSUGNtbGxiblJoZEdsdmJpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXVjM1FnYXlBOUlIUm9hWE11YzIxdmIzUm9hVzVuUm1GamRHOXlPMXh1SUNBZ0lDQWdJQ0FnSUNBZ1lXeHdhR0VnUFNCMGFHbHpMbDluWlhSVGJXOXZkR2hsWkVGdVoyeGxLRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQmhiSEJvWVN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXNZWE4wVDNKcFpXNTBZWFJwYjI0dVlXeHdhR0VzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDazdYRzRnSUNBZ0lDQWdJQ0FnSUNCaVpYUmhJRDBnZEdocGN5NWZaMlYwVTIxdmIzUm9aV1JCYm1kc1pTaGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1ltVjBZU0FySUUxaGRHZ3VVRWtzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWJHRnpkRTl5YVdWdWRHRjBhVzl1TG1KbGRHRXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHdGNiaUFnSUNBZ0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JuWVcxdFlTQTlJSFJvYVhNdVgyZGxkRk50YjI5MGFHVmtRVzVuYkdVb1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdkaGJXMWhJQ3NnZEdocGN5NUlRVXhHWDFCSkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbXhoYzNSUGNtbGxiblJoZEdsdmJpNW5ZVzF0WVN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnYXl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnVFdGMGFDNVFTVnh1SUNBZ0lDQWdJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1ltVjBZU0FyUFNCTllYUm9MbEJKTzF4dUlDQWdJQ0FnSUNBZ0lDQWdaMkZ0YldFZ0t6MGdkR2hwY3k1SVFVeEdYMUJKTzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXViR0Z6ZEU5eWFXVnVkR0YwYVc5dUlEMGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1lXeHdhR0U2SUdGc2NHaGhMRnh1SUNBZ0lDQWdJQ0FnSUNBZ1ltVjBZVG9nWW1WMFlTeGNiaUFnSUNBZ0lDQWdJQ0FnSUdkaGJXMWhPaUJuWVcxdFlTeGNiaUFnSUNBZ0lDQWdJQ0I5TzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdjMlYwVDJKcVpXTjBVWFZoZEdWeWJtbHZiaWhjYmlBZ0lDQWdJQ0FnSUNCelkyOXdaUzV2WW1wbFkzUXVjWFZoZEdWeWJtbHZiaXhjYmlBZ0lDQWdJQ0FnSUNCaGJIQm9ZU3hjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbk50YjI5MGFHbHVaMFpoWTNSdmNpQThJREVnUHlCaVpYUmhJQzBnVFdGMGFDNVFTU0E2SUdKbGRHRXNYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NXpiVzl2ZEdocGJtZEdZV04wYjNJZ1BDQXhJRDhnWjJGdGJXRWdMU0IwYUdsekxraEJURVpmVUVrZ09pQm5ZVzF0WVN4Y2JpQWdJQ0FnSUNBZ0lDQnZjbWxsYm5SY2JpQWdJQ0FnSUNBZ0tUdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb09DQXFJQ2d4SUMwZ2JHRnpkRkYxWVhSbGNtNXBiMjR1Wkc5MEtITmpiM0JsTG05aWFtVmpkQzV4ZFdGMFpYSnVhVzl1S1NrZ1BpQkZVRk1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQnNZWE4wVVhWaGRHVnlibWx2Ymk1amIzQjVLSE5qYjNCbExtOWlhbVZqZEM1eGRXRjBaWEp1YVc5dUtUdGNiaUFnSUNBZ0lDQWdJQ0J6WTI5d1pTNWthWE53WVhSamFFVjJaVzUwS0Y5amFHRnVaMlZGZG1WdWRDazdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdMeThnVGxjZ1FXUmtaV1JjYmlBZ0lDQjBhR2x6TGw5dmNtUmxja0Z1WjJ4bElEMGdablZ1WTNScGIyNGdLR0VzSUdJc0lISmhibWRsSUQwZ2RHaHBjeTVVVjA5ZlVFa3BJSHRjYmlBZ0lDQWdJR2xtSUNoY2JpQWdJQ0FnSUNBZ0tHSWdQaUJoSUNZbUlFMWhkR2d1WVdKektHSWdMU0JoS1NBOElISmhibWRsSUM4Z01pa2dmSHhjYmlBZ0lDQWdJQ0FnS0dFZ1BpQmlJQ1ltSUUxaGRHZ3VZV0p6S0dJZ0xTQmhLU0ErSUhKaGJtZGxJQzhnTWlsY2JpQWdJQ0FnSUNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2V5QnNaV1owT2lCaExDQnlhV2RvZERvZ1lpQjlPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIc2diR1ZtZERvZ1lpd2djbWxuYUhRNklHRWdmVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdMeThnVGxjZ1FXUmtaV1JjYmlBZ0lDQjBhR2x6TGw5blpYUlRiVzl2ZEdobFpFRnVaMnhsSUQwZ1puVnVZM1JwYjI0Z0tHRXNJR0lzSUdzc0lISmhibWRsSUQwZ2RHaHBjeTVVVjA5ZlVFa3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHRnVaMnhsY3lBOUlIUm9hWE11WDI5eVpHVnlRVzVuYkdVb1lTd2dZaXdnY21GdVoyVXBPMXh1SUNBZ0lDQWdZMjl1YzNRZ1lXNW5iR1Z6YUdsbWRDQTlJR0Z1WjJ4bGN5NXNaV1owTzF4dUlDQWdJQ0FnWTI5dWMzUWdiM0pwWjBGdVoyeGxjMUpwWjJoMElEMGdZVzVuYkdWekxuSnBaMmgwTzF4dUlDQWdJQ0FnWVc1bmJHVnpMbXhsWm5RZ1BTQXdPMXh1SUNBZ0lDQWdZVzVuYkdWekxuSnBaMmgwSUMwOUlHRnVaMnhsYzJocFpuUTdYRzRnSUNBZ0lDQnBaaUFvWVc1bmJHVnpMbkpwWjJoMElEd2dNQ2tnWVc1bmJHVnpMbkpwWjJoMElDczlJSEpoYm1kbE8xeHVJQ0FnSUNBZ2JHVjBJRzVsZDJGdVoyeGxJRDFjYmlBZ0lDQWdJQ0FnYjNKcFowRnVaMnhsYzFKcFoyaDBJRDA5SUdKY2JpQWdJQ0FnSUNBZ0lDQS9JQ2d4SUMwZ2F5a2dLaUJoYm1kc1pYTXVjbWxuYUhRZ0t5QnJJQ29nWVc1bmJHVnpMbXhsWm5SY2JpQWdJQ0FnSUNBZ0lDQTZJR3NnS2lCaGJtZHNaWE11Y21sbmFIUWdLeUFvTVNBdElHc3BJQ29nWVc1bmJHVnpMbXhsWm5RN1hHNGdJQ0FnSUNCdVpYZGhibWRzWlNBclBTQmhibWRzWlhOb2FXWjBPMXh1SUNBZ0lDQWdhV1lnS0c1bGQyRnVaMnhsSUQ0OUlISmhibWRsS1NCdVpYZGhibWRzWlNBdFBTQnlZVzVuWlR0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1WlhkaGJtZHNaVHRjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdkR2hwY3k1a2FYTndiM05sSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdjMk52Y0dVdVpHbHpZMjl1Ym1WamRDZ3BPMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQjBhR2x6TG1OdmJtNWxZM1FvS1R0Y2JpQWdmVnh1ZlZ4dVhHNWxlSEJ2Y25RZ2V5QkVaWFpwWTJWUGNtbGxiblJoZEdsdmJrTnZiblJ5YjJ4eklIMDdYRzRpTENKcGJYQnZjblFnZXlCVGNHaE5aWEpqVUhKdmFtVmpkR2x2YmlCOUlHWnliMjBnWENJdUwzTndhRzFsY21NdGNISnZhbVZqZEdsdmJpNXFjMXdpTzF4dWFXMXdiM0owSUNvZ1lYTWdWRWhTUlVVZ1puSnZiU0JjSW5Sb2NtVmxYQ0k3WEc1Y2JtTnNZWE56SUV4dlkyRjBhVzl1UW1GelpXUWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpaHpZMlZ1WlN3Z1kyRnRaWEpoTENCdmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQjBhR2x6TGw5elkyVnVaU0E5SUhOalpXNWxPMXh1SUNBZ0lIUm9hWE11WDJOaGJXVnlZU0E5SUdOaGJXVnlZVHRjYmlBZ0lDQjBhR2x6TGw5d2NtOXFJRDBnYm1WM0lGTndhRTFsY21OUWNtOXFaV04wYVc5dUtDazdYRzRnSUNBZ2RHaHBjeTVmWlhabGJuUklZVzVrYkdWeWN5QTlJSHQ5TzF4dUlDQWdJSFJvYVhNdVgyeGhjM1JEYjI5eVpITWdQU0J1ZFd4c08xeHVJQ0FnSUhSb2FYTXVYMmR3YzAxcGJrUnBjM1JoYm1ObElEMGdNRHRjYmlBZ0lDQjBhR2x6TGw5bmNITk5hVzVCWTJOMWNtRmplU0E5SURFd01EdGNiaUFnSUNCMGFHbHpMbDl0WVhocGJYVnRRV2RsSUQwZ01EdGNiaUFnSUNCMGFHbHpMbDkzWVhSamFGQnZjMmwwYVc5dVNXUWdQU0J1ZFd4c08xeHVJQ0FnSUhSb2FYTXVjMlYwUjNCelQzQjBhVzl1Y3lodmNIUnBiMjV6S1R0Y2JpQWdJQ0IwYUdsekxtbHVhWFJwWVd4UWIzTnBkR2x2YmlBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k1cGJtbDBhV0ZzVUc5emFYUnBiMjVCYzA5eWFXZHBiaUE5SUc5d2RHbHZibk11YVc1cGRHbGhiRkJ2YzJsMGFXOXVRWE5QY21sbmFXNGdmSHdnWm1Gc2MyVTdYRzRnSUgxY2JseHVJQ0J6WlhSUWNtOXFaV04wYVc5dUtIQnliMm9wSUh0Y2JpQWdJQ0IwYUdsekxsOXdjbTlxSUQwZ2NISnZhanRjYmlBZ2ZWeHVYRzRnSUhObGRFZHdjMDl3ZEdsdmJuTW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnYVdZZ0tHOXdkR2x2Ym5NdVozQnpUV2x1UkdsemRHRnVZMlVnSVQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1ZlozQnpUV2x1UkdsemRHRnVZMlVnUFNCdmNIUnBiMjV6TG1kd2MwMXBia1JwYzNSaGJtTmxPMXh1SUNBZ0lIMWNiaUFnSUNCcFppQW9iM0IwYVc5dWN5NW5jSE5OYVc1QlkyTjFjbUZqZVNBaFBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOW5jSE5OYVc1QlkyTjFjbUZqZVNBOUlHOXdkR2x2Ym5NdVozQnpUV2x1UVdOamRYSmhZM2s3WEc0Z0lDQWdmVnh1SUNBZ0lHbG1JQ2h2Y0hScGIyNXpMbTFoZUdsdGRXMUJaMlVnSVQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1ZmJXRjRhVzExYlVGblpTQTlJRzl3ZEdsdmJuTXViV0Y0YVcxMWJVRm5aVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J6ZEdGeWRFZHdjeWh0WVhocGJYVnRRV2RsSUQwZ01Da2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxsOTNZWFJqYUZCdmMybDBhVzl1U1dRZ1BUMDlJRzUxYkd3cElIdGNiaUFnSUNBZ0lIUm9hWE11WDNkaGRHTm9VRzl6YVhScGIyNUpaQ0E5SUc1aGRtbG5ZWFJ2Y2k1blpXOXNiMk5oZEdsdmJpNTNZWFJqYUZCdmMybDBhVzl1S0Z4dUlDQWdJQ0FnSUNBb2NHOXphWFJwYjI0cElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbDluY0hOU1pXTmxhWFpsWkNod2IzTnBkR2x2YmlrN1hHNGdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ2hsY25KdmNpa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOWxkbVZ1ZEVoaGJtUnNaWEp6VzF3aVozQnpaWEp5YjNKY0lsMHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDJWMlpXNTBTR0Z1Wkd4bGNuTmJYQ0puY0hObGNuSnZjbHdpWFNobGNuSnZjaTVqYjJSbEtUdGNiaUFnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1lXeGxjblFvWUVkUVV5Qmxjbkp2Y2pvZ1kyOWtaU0FrZTJWeWNtOXlMbU52WkdWOVlDazdYRzRnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQjdYRzRnSUNBZ0lDQWdJQ0FnWlc1aFlteGxTR2xuYUVGalkzVnlZV041T2lCMGNuVmxMRnh1SUNBZ0lDQWdJQ0FnSUcxaGVHbHRkVzFCWjJVNklHMWhlR2x0ZFcxQloyVWdJVDBnTUNBL0lHMWhlR2x0ZFcxQloyVWdPaUIwYUdsekxsOXRZWGhwYlhWdFFXZGxMRnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FwTzF4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdmVnh1WEc0Z0lITjBiM0JIY0hNb0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdVgzZGhkR05vVUc5emFYUnBiMjVKWkNBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2JtRjJhV2RoZEc5eUxtZGxiMnh2WTJGMGFXOXVMbU5zWldGeVYyRjBZMmdvZEdocGN5NWZkMkYwWTJoUWIzTnBkR2x2Ymtsa0tUdGNiaUFnSUNBZ0lIUm9hWE11WDNkaGRHTm9VRzl6YVhScGIyNUpaQ0E5SUc1MWJHdzdYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNCOVhHNWNiaUFnWm1GclpVZHdjeWhzYjI0c0lHeGhkQ3dnWld4bGRpQTlJRzUxYkd3c0lHRmpZeUE5SURBcElIdGNiaUFnSUNCcFppQW9aV3hsZGlBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV6WlhSRmJHVjJZWFJwYjI0b1pXeGxkaWs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1ZlozQnpVbVZqWldsMlpXUW9lMXh1SUNBZ0lDQWdZMjl2Y21Sek9pQjdYRzRnSUNBZ0lDQWdJR3h2Ym1kcGRIVmtaVG9nYkc5dUxGeHVJQ0FnSUNBZ0lDQnNZWFJwZEhWa1pUb2diR0YwTEZ4dUlDQWdJQ0FnSUNCaFkyTjFjbUZqZVRvZ1lXTmpMRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzRnSUd4dmJreGhkRlJ2VjI5eWJHUkRiMjl5WkhNb2JHOXVMQ0JzWVhRcElIdGNiaUFnSUNCamIyNXpkQ0J3Y205cVpXTjBaV1JRYjNNZ1BTQjBhR2x6TGw5d2NtOXFMbkJ5YjJwbFkzUW9iRzl1TENCc1lYUXBPMXh1SUNBZ0lHbG1JQ2gwYUdsekxtbHVhWFJwWVd4UWIzTnBkR2x2YmtGelQzSnBaMmx1S1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1cGJtbDBhV0ZzVUc5emFYUnBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ2NISnZhbVZqZEdWa1VHOXpXekJkSUMwOUlIUm9hWE11YVc1cGRHbGhiRkJ2YzJsMGFXOXVXekJkTzF4dUlDQWdJQ0FnSUNCd2NtOXFaV04wWldSUWIzTmJNVjBnTFQwZ2RHaHBjeTVwYm1sMGFXRnNVRzl6YVhScGIyNWJNVjA3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QmNJbFJ5ZVdsdVp5QjBieUIxYzJVZ0oybHVhWFJwWVd3Z2NHOXphWFJwYjI0Z1lYTWdiM0pwWjJsdUp5QnRiMlJsSUhkcGRHZ2dibThnYVc1cGRHbGhiQ0J3YjNOcGRHbHZiaUJrWlhSbGNtMXBibVZrWENJN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQmJjSEp2YW1WamRHVmtVRzl6V3pCZExDQXRjSEp2YW1WamRHVmtVRzl6V3pGZFhUdGNiaUFnZlZ4dVhHNGdJR0ZrWkNodlltcGxZM1FzSUd4dmJpd2diR0YwTENCbGJHVjJLU0I3WEc0Z0lDQWdkR2hwY3k1elpYUlhiM0pzWkZCdmMybDBhVzl1S0c5aWFtVmpkQ3dnYkc5dUxDQnNZWFFzSUdWc1pYWXBPMXh1SUNBZ0lIUm9hWE11WDNOalpXNWxMbUZrWkNodlltcGxZM1FwTzF4dUlDQjlYRzVjYmlBZ2MyVjBWMjl5YkdSUWIzTnBkR2x2YmlodlltcGxZM1FzSUd4dmJpd2diR0YwTENCbGJHVjJLU0I3WEc0Z0lDQWdZMjl1YzNRZ2QyOXliR1JEYjI5eVpITWdQU0IwYUdsekxteHZia3hoZEZSdlYyOXliR1JEYjI5eVpITW9iRzl1TENCc1lYUXBPMXh1SUNBZ0lHbG1JQ2hsYkdWMklDRTlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUc5aWFtVmpkQzV3YjNOcGRHbHZiaTU1SUQwZ1pXeGxkanRjYmlBZ0lDQjlYRzRnSUNBZ1cyOWlhbVZqZEM1d2IzTnBkR2x2Ymk1NExDQnZZbXBsWTNRdWNHOXphWFJwYjI0dWVsMGdQU0IzYjNKc1pFTnZiM0prY3p0Y2JpQWdmVnh1WEc0Z0lITmxkRVZzWlhaaGRHbHZiaWhsYkdWMktTQjdYRzRnSUNBZ2RHaHBjeTVmWTJGdFpYSmhMbkJ2YzJsMGFXOXVMbmtnUFNCbGJHVjJPMXh1SUNCOVhHNWNiaUFnYjI0b1pYWmxiblJPWVcxbExDQmxkbVZ1ZEVoaGJtUnNaWElwSUh0Y2JpQWdJQ0IwYUdsekxsOWxkbVZ1ZEVoaGJtUnNaWEp6VzJWMlpXNTBUbUZ0WlYwZ1BTQmxkbVZ1ZEVoaGJtUnNaWEk3WEc0Z0lIMWNibHh1SUNCelpYUlhiM0pzWkU5eWFXZHBiaWhzYjI0c0lHeGhkQ2tnZTF4dUlDQWdJSFJvYVhNdWFXNXBkR2xoYkZCdmMybDBhVzl1SUQwZ2RHaHBjeTVmY0hKdmFpNXdjbTlxWldOMEtHeHZiaXdnYkdGMEtUdGNiaUFnZlZ4dVhHNGdJRjluY0hOU1pXTmxhWFpsWkNod2IzTnBkR2x2YmlrZ2UxeHVJQ0FnSUd4bGRDQmthWE4wVFc5MlpXUWdQU0JPZFcxaVpYSXVUVUZZWDFaQlRGVkZPMXh1SUNBZ0lHbG1JQ2h3YjNOcGRHbHZiaTVqYjI5eVpITXVZV05qZFhKaFkza2dQRDBnZEdocGN5NWZaM0J6VFdsdVFXTmpkWEpoWTNrcElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxsOXNZWE4wUTI5dmNtUnpJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMnhoYzNSRGIyOXlaSE1nUFNCN1hHNGdJQ0FnSUNBZ0lDQWdiR0YwYVhSMVpHVTZJSEJ2YzJsMGFXOXVMbU52YjNKa2N5NXNZWFJwZEhWa1pTeGNiaUFnSUNBZ0lDQWdJQ0JzYjI1bmFYUjFaR1U2SUhCdmMybDBhVzl1TG1OdmIzSmtjeTVzYjI1bmFYUjFaR1VzWEc0Z0lDQWdJQ0FnSUgwN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCa2FYTjBUVzkyWldRZ1BTQjBhR2x6TGw5b1lYWmxjbk5wYm1WRWFYTjBLSFJvYVhNdVgyeGhjM1JEYjI5eVpITXNJSEJ2YzJsMGFXOXVMbU52YjNKa2N5azdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnBaaUFvWkdsemRFMXZkbVZrSUQ0OUlIUm9hWE11WDJkd2MwMXBia1JwYzNSaGJtTmxLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMnhoYzNSRGIyOXlaSE11Ykc5dVoybDBkV1JsSUQwZ2NHOXphWFJwYjI0dVkyOXZjbVJ6TG14dmJtZHBkSFZrWlR0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmYkdGemRFTnZiM0prY3k1c1lYUnBkSFZrWlNBOUlIQnZjMmwwYVc5dUxtTnZiM0prY3k1c1lYUnBkSFZrWlR0Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXBibWwwYVdGc1VHOXphWFJwYjI1QmMwOXlhV2RwYmlBbUppQWhkR2hwY3k1cGJtbDBhV0ZzVUc5emFYUnBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRGZHZjbXhrVDNKcFoybHVLRnh1SUNBZ0lDQWdJQ0FnSUNBZ2NHOXphWFJwYjI0dVkyOXZjbVJ6TG14dmJtZHBkSFZrWlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJSEJ2YzJsMGFXOXVMbU52YjNKa2N5NXNZWFJwZEhWa1pWeHVJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRGZHZjbXhrVUc5emFYUnBiMjRvWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVmWTJGdFpYSmhMRnh1SUNBZ0lDQWdJQ0FnSUhCdmMybDBhVzl1TG1OdmIzSmtjeTVzYjI1bmFYUjFaR1VzWEc0Z0lDQWdJQ0FnSUNBZ2NHOXphWFJwYjI0dVkyOXZjbVJ6TG14aGRHbDBkV1JsWEc0Z0lDQWdJQ0FnSUNrN1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVYMlYyWlc1MFNHRnVaR3hsY25OYlhDSm5jSE4xY0dSaGRHVmNJbDBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5bGRtVnVkRWhoYm1Sc1pYSnpXMXdpWjNCemRYQmtZWFJsWENKZEtIQnZjMmwwYVc5dUxDQmthWE4wVFc5MlpXUXBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVOaGJHTjFiR0YwWlNCb1lYWmxjbk5wYm1VZ1pHbHpkR0Z1WTJVZ1ltVjBkMlZsYmlCMGQyOGdiR0YwTDJ4dmJpQndZV2x5Y3k1Y2JpQWdJQ3BjYmlBZ0lDb2dWR0ZyWlc0Z1puSnZiU0J2Y21sbmFXNWhiQ0JCTFVaeVlXMWxJR052YlhCdmJtVnVkSE5jYmlBZ0lDb3ZYRzRnSUY5b1lYWmxjbk5wYm1WRWFYTjBLSE55WXl3Z1pHVnpkQ2tnZTF4dUlDQWdJR052Ym5OMElHUnNiMjVuYVhSMVpHVWdQU0JVU0ZKRlJTNU5ZWFJvVlhScGJITXVaR1ZuVkc5U1lXUW9aR1Z6ZEM1c2IyNW5hWFIxWkdVZ0xTQnpjbU11Ykc5dVoybDBkV1JsS1R0Y2JpQWdJQ0JqYjI1emRDQmtiR0YwYVhSMVpHVWdQU0JVU0ZKRlJTNU5ZWFJvVlhScGJITXVaR1ZuVkc5U1lXUW9aR1Z6ZEM1c1lYUnBkSFZrWlNBdElITnlZeTVzWVhScGRIVmtaU2s3WEc1Y2JpQWdJQ0JqYjI1emRDQmhJRDFjYmlBZ0lDQWdJRTFoZEdndWMybHVLR1JzWVhScGRIVmtaU0F2SURJcElDb2dUV0YwYUM1emFXNG9aR3hoZEdsMGRXUmxJQzhnTWlrZ0sxeHVJQ0FnSUNBZ1RXRjBhQzVqYjNNb1ZFaFNSVVV1VFdGMGFGVjBhV3h6TG1SbFoxUnZVbUZrS0hOeVl5NXNZWFJwZEhWa1pTa3BJQ3BjYmlBZ0lDQWdJQ0FnVFdGMGFDNWpiM01vVkVoU1JVVXVUV0YwYUZWMGFXeHpMbVJsWjFSdlVtRmtLR1JsYzNRdWJHRjBhWFIxWkdVcEtTQXFYRzRnSUNBZ0lDQWdJQ2hOWVhSb0xuTnBiaWhrYkc5dVoybDBkV1JsSUM4Z01pa2dLaUJOWVhSb0xuTnBiaWhrYkc5dVoybDBkV1JsSUM4Z01pa3BPMXh1SUNBZ0lHTnZibk4wSUdGdVoyeGxJRDBnTWlBcUlFMWhkR2d1WVhSaGJqSW9UV0YwYUM1emNYSjBLR0VwTENCTllYUm9Mbk54Y25Rb01TQXRJR0VwS1R0Y2JpQWdJQ0J5WlhSMWNtNGdZVzVuYkdVZ0tpQTJNemN4TURBd08xeHVJQ0I5WEc1OVhHNWNibVY0Y0c5eWRDQjdJRXh2WTJGMGFXOXVRbUZ6WldRZ2ZUdGNiaUlzSW1Oc1lYTnpJRk53YUUxbGNtTlFjbTlxWldOMGFXOXVJSHRjYmlBZ1kyOXVjM1J5ZFdOMGIzSW9LU0I3WEc0Z0lDQWdkR2hwY3k1RlFWSlVTQ0E5SURRd01EYzFNREUyTGpZNE8xeHVJQ0FnSUhSb2FYTXVTRUZNUmw5RlFWSlVTQ0E5SURJd01ETTNOVEE0TGpNME8xeHVJQ0I5WEc1Y2JpQWdjSEp2YW1WamRDaHNiMjRzSUd4aGRDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCYmRHaHBjeTVzYjI1VWIxTndhRTFsY21Nb2JHOXVLU3dnZEdocGN5NXNZWFJVYjFOd2FFMWxjbU1vYkdGMEtWMDdYRzRnSUgxY2JseHVJQ0IxYm5CeWIycGxZM1FvY0hKdmFtVmpkR1ZrS1NCN1hHNGdJQ0FnY21WMGRYSnVJRnQwYUdsekxuTndhRTFsY21OVWIweHZiaWh3Y205cVpXTjBaV1JiTUYwcExDQjBhR2x6TG5Od2FFMWxjbU5VYjB4aGRDaHdjbTlxWldOMFpXUmJNVjBwWFR0Y2JpQWdmVnh1WEc0Z0lHeHZibFJ2VTNCb1RXVnlZeWhzYjI0cElIdGNiaUFnSUNCeVpYUjFjbTRnS0d4dmJpQXZJREU0TUNrZ0tpQjBhR2x6TGtoQlRFWmZSVUZTVkVnN1hHNGdJSDFjYmx4dUlDQnNZWFJVYjFOd2FFMWxjbU1vYkdGMEtTQjdYRzRnSUNBZ2RtRnlJSGtnUFNCTllYUm9MbXh2WnloTllYUm9MblJoYmlnb0tEa3dJQ3NnYkdGMEtTQXFJRTFoZEdndVVFa3BJQzhnTXpZd0tTa2dMeUFvVFdGMGFDNVFTU0F2SURFNE1DazdYRzRnSUNBZ2NtVjBkWEp1SUNoNUlDb2dkR2hwY3k1SVFVeEdYMFZCVWxSSUtTQXZJREU0TUM0d08xeHVJQ0I5WEc1Y2JpQWdjM0JvVFdWeVkxUnZURzl1S0hncElIdGNiaUFnSUNCeVpYUjFjbTRnS0hnZ0x5QjBhR2x6TGtoQlRFWmZSVUZTVkVncElDb2dNVGd3TGpBN1hHNGdJSDFjYmx4dUlDQnpjR2hOWlhKalZHOU1ZWFFvZVNrZ2UxeHVJQ0FnSUhaaGNpQnNZWFFnUFNBb2VTQXZJSFJvYVhNdVNFRk1SbDlGUVZKVVNDa2dLaUF4T0RBdU1EdGNiaUFnSUNCc1lYUWdQVnh1SUNBZ0lDQWdLREU0TUNBdklFMWhkR2d1VUVrcElDcGNiaUFnSUNBZ0lDZ3lJQ29nVFdGMGFDNWhkR0Z1S0UxaGRHZ3VaWGh3S0Noc1lYUWdLaUJOWVhSb0xsQkpLU0F2SURFNE1Da3BJQzBnVFdGMGFDNVFTU0F2SURJcE8xeHVJQ0FnSUhKbGRIVnliaUJzWVhRN1hHNGdJSDFjYmx4dUlDQm5aWFJKUkNncElIdGNiaUFnSUNCeVpYUjFjbTRnWENKbGNITm5Pak00TlRkY0lqdGNiaUFnZlZ4dWZWeHVYRzVsZUhCdmNuUWdleUJUY0doTlpYSmpVSEp2YW1WamRHbHZiaUI5TzF4dUlpd2lhVzF3YjNKMElDb2dZWE1nVkVoU1JVVWdabkp2YlNCY0luUm9jbVZsWENJN1hHNWNibU5zWVhOeklGZGxZbU5oYlZKbGJtUmxjbVZ5SUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lvY21WdVpHVnlaWElzSUhacFpHVnZSV3hsYldWdWRDa2dlMXh1SUNBZ0lIUm9hWE11Y21WdVpHVnlaWElnUFNCeVpXNWtaWEpsY2p0Y2JpQWdJQ0IwYUdsekxuSmxibVJsY21WeUxtRjFkRzlEYkdWaGNpQTlJR1poYkhObE8xeHVJQ0FnSUhSb2FYTXVjMk5sYm1WWFpXSmpZVzBnUFNCdVpYY2dWRWhTUlVVdVUyTmxibVVvS1R0Y2JpQWdJQ0JzWlhRZ2RtbGtaVzg3WEc0Z0lDQWdhV1lnS0hacFpHVnZSV3hsYldWdWRDQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnSUNCMmFXUmxieUE5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9YQ0oyYVdSbGIxd2lLVHRjYmlBZ0lDQWdJSFpwWkdWdkxuTmxkRUYwZEhKcFluVjBaU2hjSW1GMWRHOXdiR0Y1WENJc0lIUnlkV1VwTzF4dUlDQWdJQ0FnZG1sa1pXOHVjMlYwUVhSMGNtbGlkWFJsS0Z3aWNHeGhlWE5wYm14cGJtVmNJaXdnZEhKMVpTazdYRzRnSUNBZ0lDQjJhV1JsYnk1emRIbHNaUzVrYVhOd2JHRjVJRDBnWENKdWIyNWxYQ0k3WEc0Z0lDQWdJQ0JrYjJOMWJXVnVkQzVpYjJSNUxtRndjR1Z1WkVOb2FXeGtLSFpwWkdWdktUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnZG1sa1pXOGdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtIWnBaR1Z2Uld4bGJXVnVkQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lIUm9hWE11WjJWdmJTQTlJRzVsZHlCVVNGSkZSUzVRYkdGdVpVSjFabVpsY2tkbGIyMWxkSEo1S0NrN1hHNGdJQ0FnZEdocGN5NTBaWGgwZFhKbElEMGdibVYzSUZSSVVrVkZMbFpwWkdWdlZHVjRkSFZ5WlNoMmFXUmxieWs3WEc0Z0lDQWdkR2hwY3k1dFlYUmxjbWxoYkNBOUlHNWxkeUJVU0ZKRlJTNU5aWE5vUW1GemFXTk5ZWFJsY21saGJDaDdJRzFoY0RvZ2RHaHBjeTUwWlhoMGRYSmxJSDBwTzF4dUlDQWdJR052Ym5OMElHMWxjMmdnUFNCdVpYY2dWRWhTUlVVdVRXVnphQ2gwYUdsekxtZGxiMjBzSUhSb2FYTXViV0YwWlhKcFlXd3BPMXh1SUNBZ0lIUm9hWE11YzJObGJtVlhaV0pqWVcwdVlXUmtLRzFsYzJncE8xeHVJQ0FnSUhSb2FYTXVZMkZ0WlhKaFYyVmlZMkZ0SUQwZ2JtVjNJRlJJVWtWRkxrOXlkR2h2WjNKaGNHaHBZME5oYldWeVlTaGNiaUFnSUNBZ0lDMHdMalVzWEc0Z0lDQWdJQ0F3TGpVc1hHNGdJQ0FnSUNBd0xqVXNYRzRnSUNBZ0lDQXRNQzQxTEZ4dUlDQWdJQ0FnTUN4Y2JpQWdJQ0FnSURFd1hHNGdJQ0FnS1R0Y2JpQWdJQ0JwWmlBb2JtRjJhV2RoZEc5eUxtMWxaR2xoUkdWMmFXTmxjeUFtSmlCdVlYWnBaMkYwYjNJdWJXVmthV0ZFWlhacFkyVnpMbWRsZEZWelpYSk5aV1JwWVNrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dWMzUnlZV2x1ZEhNZ1BTQjdYRzRnSUNBZ0lDQWdJSFpwWkdWdk9pQjdYRzRnSUNBZ0lDQWdJQ0FnZDJsa2RHZzZJREV5T0RBc1hHNGdJQ0FnSUNBZ0lDQWdhR1ZwWjJoME9pQTNNakFzWEc0Z0lDQWdJQ0FnSUNBZ1ptRmphVzVuVFc5a1pUb2dYQ0psYm5acGNtOXViV1Z1ZEZ3aUxGeHVJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdmVHRjYmlBZ0lDQWdJRzVoZG1sbllYUnZjaTV0WldScFlVUmxkbWxqWlhOY2JpQWdJQ0FnSUNBZ0xtZGxkRlZ6WlhKTlpXUnBZU2hqYjI1emRISmhhVzUwY3lsY2JpQWdJQ0FnSUNBZ0xuUm9aVzRvS0hOMGNtVmhiU2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJR052Ym5OdmJHVXViRzluS0dCMWMybHVaeUIwYUdVZ2QyVmlZMkZ0SUhOMVkyTmxjM05tZFd4c2VTNHVMbUFwTzF4dUlDQWdJQ0FnSUNBZ0lIWnBaR1Z2TG5OeVkwOWlhbVZqZENBOUlITjBjbVZoYlR0Y2JpQWdJQ0FnSUNBZ0lDQjJhV1JsYnk1d2JHRjVLQ2s3WEc0Z0lDQWdJQ0FnSUgwcFhHNGdJQ0FnSUNBZ0lDNWpZWFJqYUNnb1pTa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWpjbVZoZEdWRmNuSnZjbEJ2Y0hWd0tGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCY0lsZGxZbU5oYlNCRmNuSnZjbHhjYms1aGJXVTZJRndpSUNzZ1pTNXVZVzFsSUNzZ1hDSmNYRzVOWlhOellXZGxPaUJjSWlBcklHVXViV1Z6YzJGblpWeHVJQ0FnSUNBZ0lDQWdJQ0FnS1R0Y2JpQWdJQ0FnSUNBZ0lDQjlMQ0F4TURBd0tUdGNiaUFnSUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG1OeVpXRjBaVVZ5Y205eVVHOXdkWEFvWENKemIzSnllU0F0SUcxbFpHbGhJR1JsZG1salpYTWdRVkJKSUc1dmRDQnpkWEJ3YjNKMFpXUmNJaWs3WEc0Z0lDQWdJQ0I5TENBeE1EQXdLVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0IxY0dSaGRHVW9LU0I3WEc0Z0lDQWdkR2hwY3k1eVpXNWtaWEpsY2k1amJHVmhjaWdwTzF4dUlDQWdJSFJvYVhNdWNtVnVaR1Z5WlhJdWNtVnVaR1Z5S0hSb2FYTXVjMk5sYm1WWFpXSmpZVzBzSUhSb2FYTXVZMkZ0WlhKaFYyVmlZMkZ0S1R0Y2JpQWdJQ0IwYUdsekxuSmxibVJsY21WeUxtTnNaV0Z5UkdWd2RHZ29LVHRjYmlBZ2ZWeHVYRzRnSUdScGMzQnZjMlVvS1NCN1hHNGdJQ0FnZEdocGN5NXRZWFJsY21saGJDNWthWE53YjNObEtDazdYRzRnSUNBZ2RHaHBjeTUwWlhoMGRYSmxMbVJwYzNCdmMyVW9LVHRjYmlBZ0lDQjBhR2x6TG1kbGIyMHVaR2x6Y0c5elpTZ3BPMXh1SUNCOVhHNWNiaUFnWTNKbFlYUmxSWEp5YjNKUWIzQjFjQ2h0YzJjcElIdGNiaUFnSUNCcFppQW9JV1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tGd2laWEp5YjNJdGNHOXdkWEJjSWlrcElIdGNiaUFnSUNBZ0lIWmhjaUJsY25KdmNsQnZjSFZ3SUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2hjSW1ScGRsd2lLVHRjYmlBZ0lDQWdJR1Z5Y205eVVHOXdkWEF1YVc1dVpYSklWRTFNSUQwZ2JYTm5PMXh1SUNBZ0lDQWdaWEp5YjNKUWIzQjFjQzV6WlhSQmRIUnlhV0oxZEdVb1hDSnBaRndpTENCY0ltVnljbTl5TFhCdmNIVndYQ0lwTzF4dUlDQWdJQ0FnWkc5amRXMWxiblF1WW05a2VTNWhjSEJsYm1SRGFHbHNaQ2hsY25KdmNsQnZjSFZ3S1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibjFjYmx4dVpYaHdiM0owSUhzZ1YyVmlZMkZ0VW1WdVpHVnlaWElnZlR0Y2JpSXNJbTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdYMTlYUlVKUVFVTkxYMFZZVkVWU1RrRk1YMDFQUkZWTVJWOTBhSEpsWlY5Zk95SXNJaTh2SUZSb1pTQnRiMlIxYkdVZ1kyRmphR1ZjYm5aaGNpQmZYM2RsWW5CaFkydGZiVzlrZFd4bFgyTmhZMmhsWDE4Z1BTQjdmVHRjYmx4dUx5OGdWR2hsSUhKbGNYVnBjbVVnWm5WdVkzUnBiMjVjYm1aMWJtTjBhVzl1SUY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4b2JXOWtkV3hsU1dRcElIdGNibHgwTHk4Z1EyaGxZMnNnYVdZZ2JXOWtkV3hsSUdseklHbHVJR05oWTJobFhHNWNkSFpoY2lCallXTm9aV1JOYjJSMWJHVWdQU0JmWDNkbFluQmhZMnRmYlc5a2RXeGxYMk5oWTJobFgxOWJiVzlrZFd4bFNXUmRPMXh1WEhScFppQW9ZMkZqYUdWa1RXOWtkV3hsSUNFOVBTQjFibVJsWm1sdVpXUXBJSHRjYmx4MFhIUnlaWFIxY200Z1kyRmphR1ZrVFc5a2RXeGxMbVY0Y0c5eWRITTdYRzVjZEgxY2JseDBMeThnUTNKbFlYUmxJR0VnYm1WM0lHMXZaSFZzWlNBb1lXNWtJSEIxZENCcGRDQnBiblJ2SUhSb1pTQmpZV05vWlNsY2JseDBkbUZ5SUcxdlpIVnNaU0E5SUY5ZmQyVmljR0ZqYTE5dGIyUjFiR1ZmWTJGamFHVmZYMXR0YjJSMWJHVkpaRjBnUFNCN1hHNWNkRngwTHk4Z2JtOGdiVzlrZFd4bExtbGtJRzVsWldSbFpGeHVYSFJjZEM4dklHNXZJRzF2WkhWc1pTNXNiMkZrWldRZ2JtVmxaR1ZrWEc1Y2RGeDBaWGh3YjNKMGN6b2dlMzFjYmx4MGZUdGNibHh1WEhRdkx5QkZlR1ZqZFhSbElIUm9aU0J0YjJSMWJHVWdablZ1WTNScGIyNWNibHgwWDE5M1pXSndZV05yWDIxdlpIVnNaWE5mWDF0dGIyUjFiR1ZKWkYwb2JXOWtkV3hsTENCdGIyUjFiR1V1Wlhod2IzSjBjeXdnWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHlrN1hHNWNibHgwTHk4Z1VtVjBkWEp1SUhSb1pTQmxlSEJ2Y25SeklHOW1JSFJvWlNCdGIyUjFiR1ZjYmx4MGNtVjBkWEp1SUcxdlpIVnNaUzVsZUhCdmNuUnpPMXh1ZlZ4dVhHNGlMQ0l2THlCblpYUkVaV1poZFd4MFJYaHdiM0owSUdaMWJtTjBhVzl1SUdadmNpQmpiMjF3WVhScFltbHNhWFI1SUhkcGRHZ2dibTl1TFdoaGNtMXZibmtnYlc5a2RXeGxjMXh1WDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1dUlEMGdLRzF2WkhWc1pTa2dQVDRnZTF4dVhIUjJZWElnWjJWMGRHVnlJRDBnYlc5a2RXeGxJQ1ltSUcxdlpIVnNaUzVmWDJWelRXOWtkV3hsSUQ5Y2JseDBYSFFvS1NBOVBpQW9iVzlrZFd4bFd5ZGtaV1poZFd4MEoxMHBJRHBjYmx4MFhIUW9LU0E5UGlBb2JXOWtkV3hsS1R0Y2JseDBYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTVrS0dkbGRIUmxjaXdnZXlCaE9pQm5aWFIwWlhJZ2ZTazdYRzVjZEhKbGRIVnliaUJuWlhSMFpYSTdYRzU5T3lJc0lpOHZJR1JsWm1sdVpTQm5aWFIwWlhJZ1puVnVZM1JwYjI1eklHWnZjaUJvWVhKdGIyNTVJR1Y0Y0c5eWRITmNibDlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMTh1WkNBOUlDaGxlSEJ2Y25SekxDQmtaV1pwYm1sMGFXOXVLU0E5UGlCN1hHNWNkR1p2Y2loMllYSWdhMlY1SUdsdUlHUmxabWx1YVhScGIyNHBJSHRjYmx4MFhIUnBaaWhmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG04b1pHVm1hVzVwZEdsdmJpd2dhMlY1S1NBbUppQWhYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTV2S0dWNGNHOXlkSE1zSUd0bGVTa3BJSHRjYmx4MFhIUmNkRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNobGVIQnZjblJ6TENCclpYa3NJSHNnWlc1MWJXVnlZV0pzWlRvZ2RISjFaU3dnWjJWME9pQmtaV1pwYm1sMGFXOXVXMnRsZVYwZ2ZTazdYRzVjZEZ4MGZWeHVYSFI5WEc1OU95SXNJbDlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMTh1YnlBOUlDaHZZbW9zSUhCeWIzQXBJRDArSUNoUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2IySnFMQ0J3Y205d0tTa2lMQ0l2THlCa1pXWnBibVVnWDE5bGMwMXZaSFZzWlNCdmJpQmxlSEJ2Y25SelhHNWZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbklnUFNBb1pYaHdiM0owY3lrZ1BUNGdlMXh1WEhScFppaDBlWEJsYjJZZ1UzbHRZbTlzSUNFOVBTQW5kVzVrWldacGJtVmtKeUFtSmlCVGVXMWliMnd1ZEc5VGRISnBibWRVWVdjcElIdGNibHgwWEhSUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29aWGh3YjNKMGN5d2dVM2x0WW05c0xuUnZVM1J5YVc1blZHRm5MQ0I3SUhaaGJIVmxPaUFuVFc5a2RXeGxKeUI5S1R0Y2JseDBmVnh1WEhSUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29aWGh3YjNKMGN5d2dKMTlmWlhOTmIyUjFiR1VuTENCN0lIWmhiSFZsT2lCMGNuVmxJSDBwTzF4dWZUc2lMQ0pwYlhCdmNuUWdleUJNYjJOaGRHbHZia0poYzJWa0lIMGdabkp2YlNCY0lpNHZhbk12Ykc5allYUnBiMjR0WW1GelpXUXVhbk5jSWp0Y2JtbHRjRzl5ZENCN0lGZGxZbU5oYlZKbGJtUmxjbVZ5SUgwZ1puSnZiU0JjSWk0dmFuTXZkMlZpWTJGdExYSmxibVJsY21WeUxtcHpYQ0k3WEc1cGJYQnZjblFnZXlCRVpYWnBZMlZQY21sbGJuUmhkR2x2YmtOdmJuUnliMnh6SUgwZ1puSnZiU0JjSWk0dmFuTXZaR1YyYVdObExXOXlhV1Z1ZEdGMGFXOXVMV052Ym5SeWIyeHpMbXB6WENJN1hHNWNibVY0Y0c5eWRDQjdJRXh2WTJGMGFXOXVRbUZ6WldRc0lGZGxZbU5oYlZKbGJtUmxjbVZ5TENCRVpYWnBZMlZQY21sbGJuUmhkR2x2YmtOdmJuUnliMnh6SUgwN1hHNGlYU3dpYm1GdFpYTWlPbHRkTENKemIzVnlZMlZTYjI5MElqb2lJbjA9IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FmcmFtZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuLi9sb2NhdGlvbi1iYXNlZC9hcmpzLXdlYmNhbS10ZXh0dXJlXCI7XG5pbXBvcnQgXCIuL2dwcy1uZXctY2FtZXJhXCI7XG5pbXBvcnQgXCIuL2dwcy1uZXctZW50aXR5LXBsYWNlXCI7XG5pbXBvcnQgXCIuL2FyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=