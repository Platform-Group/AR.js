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
    this.geom = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneBufferGeometry();
    this.texture = new three__WEBPACK_IMPORTED_MODULE_1__.VideoTexture(this.video);
    this.material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: this.texture });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(this.geom, this.material);
    this.texScene.add(mesh);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWZyYW1lLWFyLW5ldy1sb2NhdGlvbi1vbmx5LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7QUNWaUM7QUFDRjs7QUFFL0IscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQSx5QkFBeUIscURBQXdCO0FBQ2pELHdCQUF3Qix3Q0FBVzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNEQUF5QjtBQUM3Qyx1QkFBdUIsK0NBQWtCO0FBQ3pDLHdCQUF3QixvREFBdUIsR0FBRyxtQkFBbUI7QUFDckUscUJBQXFCLHVDQUFVO0FBQy9CO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsNkJBQTZCLEVBQUU7QUFDL0I7QUFDQSxTQUFTO0FBQ1QsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDaEVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFaUM7O0FBRWpDLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcENnQztBQUM0Qzs7QUFFN0UscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFQSx3QkFBd0IscUZBQW9CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsNkRBQTZELEtBQUs7QUFDbEU7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QSxXQUFXLGdDQUFtQjtBQUM5QixXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdDQUFtQjtBQUM5QjtBQUNBLGtFQUFrRSxpQkFBaUI7QUFDbkY7QUFDQSwyREFBMkQsYUFBYTtBQUN4RTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsSUFBSSwwQkFBbUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFtQixHQUFHLDBCQUFtQjtBQUN6QyxxQkFBcUIsZ0NBQW1CLEdBQUcsMEJBQW1CO0FBQzlEO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qiw4RUFBOEUsZ0NBQW1CO0FBQ2pHLCtFQUErRSxnQ0FBbUI7QUFDbEcsMkZBQTJGLGdDQUFtQjs7Ozs7OztBQU85RyxDQUFDOztBQUVELGlCQUFpQiwwQkFBbUI7QUFDcEMsVUFBVTtBQUNWO0FBQ0EsQ0FBQztBQUNELDJDQUEyQyxjQUFjOzs7Ozs7Ozs7OztBQ3BzQnpEOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7OztBQ04rQztBQUNyQjtBQUNNO0FBQ1kiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9hcmpzLXdlYmNhbS10ZXh0dXJlLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL25ldy1sb2NhdGlvbi1iYXNlZC9hcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvZ3BzLW5ldy1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbmV3LWxvY2F0aW9uLWJhc2VkL2dwcy1uZXctZW50aXR5LXBsYWNlLmpzIiwid2VicGFjazovL0FSanMvLi90aHJlZS5qcy9idWlsZC9hci10aHJlZXgtbG9jYXRpb24tb25seS5qcyIsIndlYnBhY2s6Ly9BUmpzL2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwiYWZyYW1lXCIsXCJjb21tb25qczJcIjpcImFmcmFtZVwiLFwiYW1kXCI6XCJhZnJhbWVcIixcInJvb3RcIjpcIkFGUkFNRVwifSIsIndlYnBhY2s6Ly9BUmpzL2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9Iiwid2VicGFjazovL0FSanMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL25ldy1sb2NhdGlvbi1iYXNlZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJhZnJhbWVcIiksIHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJhZnJhbWVcIiwgXCJ0aHJlZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJBUmpzXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkFSanNcIl0gPSBmYWN0b3J5KHJvb3RbXCJBRlJBTUVcIl0sIHJvb3RbXCJUSFJFRVwiXSk7XG59KSh0aGlzLCAoX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9hZnJhbWVfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJhcmpzLXdlYmNhbS10ZXh0dXJlXCIsIHtcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2NlbmUgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgdGhpcy50ZXhDYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKC0wLjUsIDAuNSwgMC41LCAtMC41LCAwLCAxMCk7XG4gICAgdGhpcy50ZXhTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICB0aGlzLnZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCB0cnVlKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy52aWRlbyk7XG4gICAgdGhpcy5nZW9tID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoKTtcbiAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHRoaXMudmlkZW8pO1xuICAgIHRoaXMubWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRoaXMudGV4dHVyZSB9KTtcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tLCB0aGlzLm1hdGVyaWFsKTtcbiAgICB0aGlzLnRleFNjZW5lLmFkZChtZXNoKTtcbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMgJiYgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcbiAgICAgIGNvbnN0IGNvbnN0cmFpbnRzID0ge1xuICAgICAgICB2aWRlbzoge1xuICAgICAgICAgIGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIixcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAgIC5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpXG4gICAgICAgIC50aGVuKChzdHJlYW0pID0+IHtcbiAgICAgICAgICB0aGlzLnZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIGBXZWJjYW0gZXJyb3I6ICR7ZX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgIFwic29ycnkgLSBtZWRpYSBkZXZpY2VzIEFQSSBub3Qgc3VwcG9ydGVkXCJcbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5yZW5kZXIodGhpcy50ZXhTY2VuZSwgdGhpcy50ZXhDYW1lcmEpO1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2xlYXJEZXB0aCgpO1xuICB9LFxuXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52aWRlby5zcmNPYmplY3QuZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgIHRyYWNrLnN0b3AoKTtcbiAgICB9KTtcbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ2VvbS5kaXNwb3NlKCk7XG4gIH0sXG59KTtcbiIsIi8qKlxuICogYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcbiAqXG4gKiBSZXBsYWNlcyB0aGUgc3RhbmRhcmQgbG9vay1jb250cm9scyBjb21wb25lbnQgdG8gcHJvdmlkZSBtb2JpbGUgZGV2aWNlXG4gKiBvcmllbnRhdGlvbiBjb250cm9scy5cbiAqXG4gKiBBIGxpZ2h0d2VpZ2h0IEEtRnJhbWUgd3JhcHBlciByb3VuZCB0aGUgbW9kaWZpZWQgdGhyZWUuanNcbiAqIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgdXNlZCBpbiB0aGUgdGhyZWUuanMgbG9jYXRpb24tYmFzZWQgQVBJLlxuICpcbiAqIENyZWF0ZXMgdGhlIFRIUkVFIG9iamVjdCB1c2luZyB1c2luZyB0aGUgdGhyZWUuanMgY2FtZXJhLCBhbmQgYWxsb3dzIHVwZGF0ZVxuICogb2YgdGhlIHNtb290aGluZyBmYWN0b3IuXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIiwge1xuICBzY2hlbWE6IHtcbiAgICBzbW9vdGhpbmdGYWN0b3I6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAxLFxuICAgIH0sXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX29yaWVudGF0aW9uQ29udHJvbHMgPSBuZXcgVEhSRUV4LkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMoXG4gICAgICB0aGlzLmVsLm9iamVjdDNEXG4gICAgKTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9vcmllbnRhdGlvbkNvbnRyb2xzLnNtb290aGluZ0ZhY3RvciA9IHRoaXMuZGF0YS5zbW9vdGhpbmdGYWN0b3I7XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX29yaWVudGF0aW9uQ29udHJvbHMudXBkYXRlKCk7XG4gIH0sXG59KTtcbiIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5pbXBvcnQgKiBhcyBUSFJFRXggZnJvbSBcIi4uLy4uLy4uL3RocmVlLmpzL2J1aWxkL2FyLXRocmVleC1sb2NhdGlvbi1vbmx5LmpzXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1uZXctY2FtZXJhXCIsIHtcbiAgc2NoZW1hOiB7XG4gICAgc2ltdWxhdGVMYXRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaW11bGF0ZUxvbmdpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaW11bGF0ZUFsdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogLU51bWJlci5NQVhfVkFMVUUsXG4gICAgfSxcbiAgICBncHNNaW5EaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBwb3NpdGlvbk1pbkFjY3VyYWN5OiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMTAwLFxuICAgIH0sXG4gICAgZ3BzVGltZUludGVydmFsOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIGluaXRpYWxQb3NpdGlvbkFzT3JpZ2luOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3Rlc3RGb3JPcmllbnRhdGlvbkNvbnRyb2xzKCk7XG5cbiAgICB0aGlzLnRocmVlTG9jID0gbmV3IFRIUkVFeC5Mb2NhdGlvbkJhc2VkKFxuICAgICAgdGhpcy5lbC5zY2VuZUVsLm9iamVjdDNELFxuICAgICAgdGhpcy5lbC5vYmplY3QzRCxcbiAgICAgIHtcbiAgICAgICAgaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW46IHRoaXMuZGF0YS5pbml0aWFsUG9zaXRpb25Bc09yaWdpbixcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy50aHJlZUxvYy5vbihcImdwc3VwZGF0ZVwiLCAoZ3BzcG9zKSA9PiB7XG4gICAgICB0aGlzLl9jdXJyZW50UG9zaXRpb24gPSB7XG4gICAgICAgIGxvbmdpdHVkZTogZ3BzcG9zLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgIGxhdGl0dWRlOiBncHNwb3MuY29vcmRzLmxhdGl0dWRlLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX3NlbmRHcHNVcGRhdGVFdmVudChncHNwb3MuY29vcmRzLmxvbmdpdHVkZSwgZ3BzcG9zLmNvb3Jkcy5sYXRpdHVkZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRocmVlTG9jLm9uKFwiZ3BzZXJyb3JcIiwgKGNvZGUpID0+IHtcbiAgICAgIGNvbnN0IG1zZyA9IFtcbiAgICAgICAgXCJVc2VyIGRlbmllZCBhY2Nlc3MgdG8gR1BTLlwiLFxuICAgICAgICBcIkdQUyBzYXRlbGxpdGVzIG5vdCBhdmFpbGFibGUuXCIsXG4gICAgICAgIFwiVGltZW91dCBjb21tdW5pY2F0aW5nIHdpdGggR1BTIHNhdGVsbGl0ZXMgLSB0cnkgbW92aW5nIHRvIGEgbW9yZSBvcGVuIGFyZWEuXCIsXG4gICAgICBdO1xuICAgICAgaWYgKGNvZGUgPj0gMSAmJiBjb2RlIDw9IDMpIHtcbiAgICAgICAgdGhpcy5fZGlzcGxheUVycm9yKG1zZ1tjb2RlIC0gMV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGlzcGxheUVycm9yKGBVbmtub3duIGdlb2xvY2F0aW9uIGVycm9yIGNvZGUgJHtjb2RlfS5gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFVzZSBhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9scyBvbiBtb2JpbGUgb25seSwgd2l0aCBzdGFuZGFyZFxuICAgIC8vIGxvb2stY29udHJvbHMgZGlzYWJsZWQgKHRoaXMgaW50ZXJmZXJlcyB3aXRoIHRoZSByZWFkaW5ncyBmcm9tIHRoZVxuICAgIC8vIHNlbnNvcnMpLiBPbiBkZXNrdG9wLCB1c2Ugc3RhbmRhcmQgbG9vay1jb250cm9scyBpbnN0ZWFkLlxuXG4gICAgLy8gY29uc3QgbW9iaWxlID0gdGhpcy5faXNNb2JpbGUoKTtcbiAgICAvLyB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImxvb2stY29udHJvbHMtZW5hYmxlZFwiLCAhbW9iaWxlKTtcbiAgICAvLyBpZiAobW9iaWxlKSB7XG4gICAgLy8gICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImFyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXCIsIHRydWUpO1xuICAgIC8vIH1cblxuICAgIC8vIGZyb20gb3JpZ2luYWwgZ3BzLWNhbWVyYSBjb21wb25lbnRcbiAgICAvLyBpZiBTYWZhcmlcbiAgICBpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvW1xcZC5dKy4qU2FmYXJpLykpIHtcbiAgICAgIHRoaXMuX3NldHVwU2FmYXJpT3JpZW50YXRpb25QZXJtaXNzaW9ucygpO1xuICAgIH1cblxuICAgIHRoaXMuZWwuc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKFwiZ3BzLWVudGl0eS1wbGFjZS1hZGRlZFwiLCAoZSkgPT4ge1xuICAgICAgY29uc3QgZW50aXR5UGxhY2UgPSBlLmRldGFpbC5jb21wb25lbnQuY29tcG9uZW50c1tcImdwcy1uZXctZW50aXR5LXBsYWNlXCJdO1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRQb3NpdGlvbikge1xuICAgICAgICBlbnRpdHlQbGFjZS5zZXREaXN0YW5jZUZyb20odGhpcy5fY3VycmVudFBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChvbGREYXRhKSB7XG4gICAgdGhpcy50aHJlZUxvYy5zZXRHcHNPcHRpb25zKHtcbiAgICAgIGdwc01pbkFjY3VyYWN5OiB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSxcbiAgICAgIGdwc01pbkRpc3RhbmNlOiB0aGlzLmRhdGEuZ3BzTWluRGlzdGFuY2UsXG4gICAgICBtYXhpbXVtQWdlOiB0aGlzLmRhdGEuZ3BzVGltZUludGVydmFsLFxuICAgIH0pO1xuICAgIGlmIChcbiAgICAgICghdGhpcy5kYXRhLmZha2VHcHNTdGFydGVkKSAmJlxuICAgICAgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwIHx8IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkgJiZcbiAgICAgICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPSBvbGREYXRhLnNpbXVsYXRlTGF0aXR1ZGUgfHxcbiAgICAgICAgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9IG9sZERhdGEuc2ltdWxhdGVMb25naXR1ZGUpXG4gICAgKSB7XG4gICAgICB0aGlzLnRocmVlTG9jLnN0b3BHcHMoKTtcbiAgICAgIHRoaXMudGhyZWVMb2MuZmFrZUdwcyhcbiAgICAgICAgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlLFxuICAgICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZVxuICAgICAgKTtcbiAgICAgIHRoaXMuZGF0YS5mYWtlR3BzU3RhcnRlZCA9IHRydWVcbiAgICB9XG4gICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlID4gLU51bWJlci5NQVhfVkFMVUUpIHtcbiAgICAgIHRoaXMudGhyZWVMb2Muc2V0RWxldmF0aW9uKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlICsgMS42KTtcbiAgICB9XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSA9PT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgPT09IDApIHtcbiAgICAgIHRoaXMudGhyZWVMb2Muc3RhcnRHcHMoKTtcbiAgICB9XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRocmVlTG9jLnN0b3BHcHMoKTtcbiAgfSxcblxuICBsYXRMb25Ub1dvcmxkOiBmdW5jdGlvbiAobGF0LCBsb24pIHtcbiAgICByZXR1cm4gdGhpcy50aHJlZUxvYy5sb25MYXRUb1dvcmxkQ29vcmRzKGxvbiwgbGF0KTtcbiAgfSxcblxuICBnZXRJbml0aWFsUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50aHJlZUxvYy5pbml0aWFsUG9zaXRpb247XG4gIH0sXG5cbiAgX3NlbmRHcHNVcGRhdGVFdmVudDogZnVuY3Rpb24gKGxvbiwgbGF0KSB7XG4gICAgdGhpcy5lbC5lbWl0KFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIiwge1xuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgbG9uZ2l0dWRlOiBsb24sXG4gICAgICAgIGxhdGl0dWRlOiBsYXQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9LFxuXG4gIF90ZXN0Rm9yT3JpZW50YXRpb25Db250cm9sczogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICBcIldBUk5JTkcgLSBObyBvcmllbnRhdGlvbiBjb250cm9scyBjb21wb25lbnQsIGFwcCB3aWxsIG5vdCByZXNwb25kIHRvIGRldmljZSByb3RhdGlvbi5cIjtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wiYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIl0gJiZcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJsb29rLWNvbnRyb2xzXCJdXG4gICAgKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5RXJyb3IobXNnKTtcbiAgICB9XG4gIH0sXG5cbiAgX2Rpc3BsYXlFcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgY29uc3QgYXJqcyA9IHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXTtcbiAgICBpZiAoYXJqcykge1xuICAgICAgYXJqcy5fZGlzcGxheUVycm9yUG9wdXAoZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbGVydChlcnJvcik7XG4gICAgfVxuICB9LFxuXG4gIC8vIGZyb20gb3JpZ2luYWwgZ3BzLWNhbWVyYSBjb21wb25lbnRcbiAgX3NldHVwU2FmYXJpT3JpZW50YXRpb25QZXJtaXNzaW9uczogZnVuY3Rpb24gKCkge1xuICAgIC8vIGlPUyAxMytcbiAgICBpZiAoXG4gICAgICB0eXBlb2Ygd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQ/LnJlcXVlc3RQZXJtaXNzaW9uID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3RpbmcgZGV2aWNlIG9yaWVudGF0aW9uIHBlcm1pc3Npb25zLi4uXCIpO1xuICAgICAgICBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVyKTtcbiAgICAgIH07XG5cbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwidG91Y2hlbmRcIixcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGhhbmRsZXIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgIFwiQWZ0ZXIgY2FtZXJhIHBlcm1pc3Npb24gcHJvbXB0LCBwbGVhc2UgdGFwIHRoZSBzY3JlZW4gdG8gYWN0aXZhdGUgZ2VvbG9jYXRpb24uXCJcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgXCJQbGVhc2UgZW5hYmxlIGRldmljZSBvcmllbnRhdGlvbiBpbiBTZXR0aW5ncyA+IFNhZmFyaSA+IE1vdGlvbiAmIE9yaWVudGF0aW9uIEFjY2Vzcy5cIlxuICAgICAgICApO1xuICAgICAgfSwgNzUwKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImRldmljZW9yaWVudGF0aW9uXCIsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH0sXG4gICAgICAgIHsgb25jZTogdHJ1ZSB9XG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBfaXNNb2JpbGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoXG4gICAgICAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QoXG4gICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnRcbiAgICAgIClcbiAgICApIHtcbiAgICAgIC8vIHRydWUgZm9yIG1vYmlsZSBkZXZpY2VcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG59KTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiZ3BzLW5ldy1lbnRpdHktcGxhY2VcIiwge1xuICBzY2hlbWE6IHtcbiAgICBsb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgbGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNhbWVyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZ3BzLW5ldy1jYW1lcmFdXCIpO1xuICAgIGlmICghY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtbmV3LWNhbWVyYVwiXSkge1xuICAgICAgY29uc29sZS5lcnJvcihcImdwcy1uZXctY2FtZXJhIG5vdCBpbml0aWFsaXNlZFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fY2FtZXJhR3BzID0gY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtbmV3LWNhbWVyYVwiXTtcblxuICAgIGNhbWVyYS5hZGRFdmVudExpc3RlbmVyKFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIiwgKGUpID0+IHtcbiAgICAgIHRoaXMuZGlzdGFuY2UgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KGUuZGV0YWlsLnBvc2l0aW9uLCB0aGlzLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lbC5zY2VuZUVsLmVtaXQoXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsIHtcbiAgICAgIGNvbXBvbmVudDogdGhpcy5lbCxcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwcm9qQ29vcmRzID0gdGhpcy5fY2FtZXJhR3BzLnRocmVlTG9jLmxvbkxhdFRvV29ybGRDb29yZHMoXG4gICAgICB0aGlzLmRhdGEubG9uZ2l0dWRlLFxuICAgICAgdGhpcy5kYXRhLmxhdGl0dWRlXG4gICAgKTtcbiAgICB0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uLnNldChcbiAgICAgIHByb2pDb29yZHNbMF0sXG4gICAgICB0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uLnksXG4gICAgICBwcm9qQ29vcmRzWzFdXG4gICAgKTtcbiAgfSxcblxuICBzZXREaXN0YW5jZUZyb206IGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgIHRoaXMuZGlzdGFuY2UgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KHBvc2l0aW9uLCB0aGlzLmRhdGEpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgaGF2ZXJzaW5lIGRpc3RhbmNlIGJldHdlZW4gdHdvIGxhdC9sb24gcGFpcnMuXG4gICAqXG4gICAqIFRha2VuIGZyb20gZ3BzLWNhbWVyYVxuICAgKi9cbiAgX2hhdmVyc2luZURpc3Q6IGZ1bmN0aW9uIChzcmMsIGRlc3QpIHtcbiAgICBjb25zdCBkbG9uZ2l0dWRlID0gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XG4gICAgY29uc3QgZGxhdGl0dWRlID0gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUgLSBzcmMubGF0aXR1ZGUpO1xuXG4gICAgY29uc3QgYSA9XG4gICAgICBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICtcbiAgICAgIE1hdGguY29zKFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChzcmMubGF0aXR1ZGUpKSAqXG4gICAgICAgIE1hdGguY29zKFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKSkgKlxuICAgICAgICAoTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpKTtcbiAgICBjb25zdCBhbmdsZSA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcbiAgfSxcbn0pO1xuIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1widGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVEhSRUV4XCJdID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlRIUkVFeFwiXSA9IGZhY3Rvcnkocm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIChfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pID0+IHtcbnJldHVybiAvKioqKioqLyAoKCkgPT4geyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdFwidXNlIHN0cmljdFwiO1xuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX21vZHVsZXNfXyA9ICh7XG5cbi8qKiovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKi8gKChfX3VudXNlZF93ZWJwYWNrX21vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykgPT4ge1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiAoKSA9PiAoLyogYmluZGluZyAqLyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIHRocmVlICovIFwidGhyZWVcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX19kZWZhdWx0ID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18ubih0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fKTtcbi8vIE1vZGlmaWVkIHZlcnNpb24gb2YgVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBmcm9tIHRocmVlLmpzXG4vLyB3aWxsIHVzZSB0aGUgZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZSBldmVudCBpZiBhdmFpbGFibGVcblxuXG5cbmNvbnN0IF96ZWUgPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5WZWN0b3IzKDAsIDAsIDEpO1xuY29uc3QgX2V1bGVyID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uRXVsZXIoKTtcbmNvbnN0IF9xMCA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlF1YXRlcm5pb24oKTtcbmNvbnN0IF9xMSA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlF1YXRlcm5pb24oLU1hdGguc3FydCgwLjUpLCAwLCAwLCBNYXRoLnNxcnQoMC41KSk7IC8vIC0gUEkvMiBhcm91bmQgdGhlIHgtYXhpc1xuXG5jb25zdCBfY2hhbmdlRXZlbnQgPSB7IHR5cGU6IFwiY2hhbmdlXCIgfTtcblxuY2xhc3MgRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBleHRlbmRzIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iob2JqZWN0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50IGlzIG9ubHkgYXZhaWxhYmxlIGluIHNlY3VyZSBjb250ZXh0cyAoaHR0cHMpXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xuXG4gICAgY29uc3QgRVBTID0gMC4wMDAwMDE7XG4gICAgY29uc3QgbGFzdFF1YXRlcm5pb24gPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5RdWF0ZXJuaW9uKCk7XG5cbiAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICB0aGlzLm9iamVjdC5yb3RhdGlvbi5yZW9yZGVyKFwiWVhaXCIpO1xuXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZGV2aWNlT3JpZW50YXRpb24gPSB7fTtcbiAgICB0aGlzLnNjcmVlbk9yaWVudGF0aW9uID0gMDtcblxuICAgIHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXG5cbiAgICB0aGlzLlRXT19QSSA9IDIgKiBNYXRoLlBJO1xuICAgIHRoaXMuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XG4gICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSA9XG4gICAgICBcIm9uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiIGluIHdpbmRvd1xuICAgICAgICA/IFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiXG4gICAgICAgIDogXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuXG4gICAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPSAxO1xuXG4gICAgY29uc3Qgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBzY29wZS5kZXZpY2VPcmllbnRhdGlvbiA9IGV2ZW50O1xuICAgIH07XG5cbiAgICBjb25zdCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYW5nbGVzIGFscGhhLCBiZXRhIGFuZCBnYW1tYSBmb3JtIGEgc2V0IG9mIGludHJpbnNpYyBUYWl0LUJyeWFuIGFuZ2xlcyBvZiB0eXBlIFotWCctWScnXG5cbiAgICBjb25zdCBzZXRPYmplY3RRdWF0ZXJuaW9uID0gZnVuY3Rpb24gKFxuICAgICAgcXVhdGVybmlvbixcbiAgICAgIGFscGhhLFxuICAgICAgYmV0YSxcbiAgICAgIGdhbW1hLFxuICAgICAgb3JpZW50XG4gICAgKSB7XG4gICAgICBfZXVsZXIuc2V0KGJldGEsIGFscGhhLCAtZ2FtbWEsIFwiWVhaXCIpOyAvLyAnWlhZJyBmb3IgdGhlIGRldmljZSwgYnV0ICdZWFonIGZvciB1c1xuXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihfZXVsZXIpOyAvLyBvcmllbnQgdGhlIGRldmljZVxuXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KF9xMSk7IC8vIGNhbWVyYSBsb29rcyBvdXQgdGhlIGJhY2sgb2YgdGhlIGRldmljZSwgbm90IHRoZSB0b3BcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShfcTAuc2V0RnJvbUF4aXNBbmdsZShfemVlLCAtb3JpZW50KSk7IC8vIGFkanVzdCBmb3Igc2NyZWVuIG9yaWVudGF0aW9uXG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpOyAvLyBydW4gb25jZSBvbiBsb2FkXG5cbiAgICAgIC8vIGlPUyAxMytcblxuICAgICAgaWYgKFxuICAgICAgICB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHR5cGVvZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICApIHtcbiAgICAgICAgd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBcImdyYW50ZWRcIikge1xuICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBVbmFibGUgdG8gdXNlIERldmljZU9yaWVudGF0aW9uIEFQSTpcIixcbiAgICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBzY29wZS5lbmFibGVkID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwib3JpZW50YXRpb25jaGFuZ2VcIixcbiAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICApO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICk7XG5cbiAgICAgIHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgY29uc3QgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XG5cbiAgICAgIGlmIChkZXZpY2UpIHtcbiAgICAgICAgbGV0IGFscGhhID0gZGV2aWNlLmFscGhhXG4gICAgICAgICAgPyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuYWxwaGEpICsgc2NvcGUuYWxwaGFPZmZzZXRcbiAgICAgICAgICA6IDA7IC8vIFpcblxuICAgICAgICBsZXQgYmV0YSA9IGRldmljZS5iZXRhID8gdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5NYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmJldGEpIDogMDsgLy8gWCdcblxuICAgICAgICBsZXQgZ2FtbWEgPSBkZXZpY2UuZ2FtbWEgPyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuZ2FtbWEpIDogMDsgLy8gWScnXG5cbiAgICAgICAgY29uc3Qgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb25cbiAgICAgICAgICA/IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWF0aFV0aWxzLmRlZ1RvUmFkKHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uKVxuICAgICAgICAgIDogMDsgLy8gT1xuXG4gICAgICAgIGlmICh0aGlzLnNtb290aGluZ0ZhY3RvciA8IDEpIHtcbiAgICAgICAgICBpZiAodGhpcy5sYXN0T3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSB0aGlzLnNtb290aGluZ0ZhY3RvcjtcbiAgICAgICAgICAgIGFscGhhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICAgICAgYWxwaGEsXG4gICAgICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmFscGhhLFxuICAgICAgICAgICAgICBrXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYmV0YSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgICAgIGJldGEgKyBNYXRoLlBJLFxuICAgICAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5iZXRhLFxuICAgICAgICAgICAgICBrXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZ2FtbWEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgICAgICBnYW1tYSArIHRoaXMuSEFMRl9QSSxcbiAgICAgICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uZ2FtbWEsXG4gICAgICAgICAgICAgIGssXG4gICAgICAgICAgICAgIE1hdGguUElcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJldGEgKz0gTWF0aC5QSTtcbiAgICAgICAgICAgIGdhbW1hICs9IHRoaXMuSEFMRl9QSTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbiA9IHtcbiAgICAgICAgICAgIGFscGhhOiBhbHBoYSxcbiAgICAgICAgICAgIGJldGE6IGJldGEsXG4gICAgICAgICAgICBnYW1tYTogZ2FtbWEsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldE9iamVjdFF1YXRlcm5pb24oXG4gICAgICAgICAgc2NvcGUub2JqZWN0LnF1YXRlcm5pb24sXG4gICAgICAgICAgYWxwaGEsXG4gICAgICAgICAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPCAxID8gYmV0YSAtIE1hdGguUEkgOiBiZXRhLFxuICAgICAgICAgIHRoaXMuc21vb3RoaW5nRmFjdG9yIDwgMSA/IGdhbW1hIC0gdGhpcy5IQUxGX1BJIDogZ2FtbWEsXG4gICAgICAgICAgb3JpZW50XG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKDggKiAoMSAtIGxhc3RRdWF0ZXJuaW9uLmRvdChzY29wZS5vYmplY3QucXVhdGVybmlvbikpID4gRVBTKSB7XG4gICAgICAgICAgbGFzdFF1YXRlcm5pb24uY29weShzY29wZS5vYmplY3QucXVhdGVybmlvbik7XG4gICAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChfY2hhbmdlRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIE5XIEFkZGVkXG4gICAgdGhpcy5fb3JkZXJBbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XG4gICAgICBpZiAoXG4gICAgICAgIChiID4gYSAmJiBNYXRoLmFicyhiIC0gYSkgPCByYW5nZSAvIDIpIHx8XG4gICAgICAgIChhID4gYiAmJiBNYXRoLmFicyhiIC0gYSkgPiByYW5nZSAvIDIpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHsgbGVmdDogYSwgcmlnaHQ6IGIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGxlZnQ6IGIsIHJpZ2h0OiBhIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIE5XIEFkZGVkXG4gICAgdGhpcy5fZ2V0U21vb3RoZWRBbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCBrLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XG4gICAgICBjb25zdCBhbmdsZXMgPSB0aGlzLl9vcmRlckFuZ2xlKGEsIGIsIHJhbmdlKTtcbiAgICAgIGNvbnN0IGFuZ2xlc2hpZnQgPSBhbmdsZXMubGVmdDtcbiAgICAgIGNvbnN0IG9yaWdBbmdsZXNSaWdodCA9IGFuZ2xlcy5yaWdodDtcbiAgICAgIGFuZ2xlcy5sZWZ0ID0gMDtcbiAgICAgIGFuZ2xlcy5yaWdodCAtPSBhbmdsZXNoaWZ0O1xuICAgICAgaWYgKGFuZ2xlcy5yaWdodCA8IDApIGFuZ2xlcy5yaWdodCArPSByYW5nZTtcbiAgICAgIGxldCBuZXdhbmdsZSA9XG4gICAgICAgIG9yaWdBbmdsZXNSaWdodCA9PSBiXG4gICAgICAgICAgPyAoMSAtIGspICogYW5nbGVzLnJpZ2h0ICsgayAqIGFuZ2xlcy5sZWZ0XG4gICAgICAgICAgOiBrICogYW5nbGVzLnJpZ2h0ICsgKDEgLSBrKSAqIGFuZ2xlcy5sZWZ0O1xuICAgICAgbmV3YW5nbGUgKz0gYW5nbGVzaGlmdDtcbiAgICAgIGlmIChuZXdhbmdsZSA+PSByYW5nZSkgbmV3YW5nbGUgLT0gcmFuZ2U7XG4gICAgICByZXR1cm4gbmV3YW5nbGU7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNjb3BlLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5jb25uZWN0KCk7XG4gIH1cbn1cblxuXG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvbG9jYXRpb24tYmFzZWQuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvbG9jYXRpb24tYmFzZWQuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKF9fdW51c2VkX3dlYnBhY2tfbW9kdWxlLCBfX3dlYnBhY2tfZXhwb3J0c19fLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSA9PiB7XG5cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIExvY2F0aW9uQmFzZWQ6ICgpID0+ICgvKiBiaW5kaW5nICovIExvY2F0aW9uQmFzZWQpXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfc3BobWVyY19wcm9qZWN0aW9uX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL3NwaG1lcmMtcHJvamVjdGlvbi5qcyAqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3NwaG1lcmMtcHJvamVjdGlvbi5qc1wiKTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgdGhyZWUgKi8gXCJ0aHJlZVwiKTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fX2RlZmF1bHQgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXy5uKHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18pO1xuXG5cblxuY2xhc3MgTG9jYXRpb25CYXNlZCB7XG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBjYW1lcmEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NjZW5lID0gc2NlbmU7XG4gICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xuICAgIHRoaXMuX3Byb2ogPSBuZXcgX3NwaG1lcmNfcHJvamVjdGlvbl9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlNwaE1lcmNQcm9qZWN0aW9uKCk7XG4gICAgdGhpcy5fZXZlbnRIYW5kbGVycyA9IHt9O1xuICAgIHRoaXMuX2xhc3RDb29yZHMgPSBudWxsO1xuICAgIHRoaXMuX2dwc01pbkRpc3RhbmNlID0gMDtcbiAgICB0aGlzLl9ncHNNaW5BY2N1cmFjeSA9IDEwMDtcbiAgICB0aGlzLl9tYXhpbXVtQWdlID0gMDtcbiAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICAgIHRoaXMuc2V0R3BzT3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA9IG51bGw7XG4gICAgdGhpcy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbiA9IG9wdGlvbnMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4gfHwgZmFsc2U7XG4gIH1cblxuICBzZXRQcm9qZWN0aW9uKHByb2opIHtcbiAgICB0aGlzLl9wcm9qID0gcHJvajtcbiAgfVxuXG4gIHNldEdwc09wdGlvbnMob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKG9wdGlvbnMuZ3BzTWluRGlzdGFuY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fZ3BzTWluRGlzdGFuY2UgPSBvcHRpb25zLmdwc01pbkRpc3RhbmNlO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5ncHNNaW5BY2N1cmFjeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9ncHNNaW5BY2N1cmFjeSA9IG9wdGlvbnMuZ3BzTWluQWNjdXJhY3k7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLm1heGltdW1BZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fbWF4aW11bUFnZSA9IG9wdGlvbnMubWF4aW11bUFnZTtcbiAgICB9XG4gIH1cblxuICBzdGFydEdwcyhtYXhpbXVtQWdlID0gMCkge1xuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKFxuICAgICAgICAocG9zaXRpb24pID0+IHtcbiAgICAgICAgICB0aGlzLl9ncHNSZWNlaXZlZChwb3NpdGlvbik7XG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzZXJyb3JcIl0pIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHNlcnJvclwiXShlcnJvci5jb2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoYEdQUyBlcnJvcjogY29kZSAke2Vycm9yLmNvZGV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgICAgIG1heGltdW1BZ2U6IG1heGltdW1BZ2UgIT0gMCA/IG1heGltdW1BZ2UgOiB0aGlzLl9tYXhpbXVtQWdlLFxuICAgICAgICB9XG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0b3BHcHMoKSB7XG4gICAgaWYgKHRoaXMuX3dhdGNoUG9zaXRpb25JZCAhPT0gbnVsbCkge1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy5fd2F0Y2hQb3NpdGlvbklkKTtcbiAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZmFrZUdwcyhsb24sIGxhdCwgZWxldiA9IG51bGwsIGFjYyA9IDApIHtcbiAgICBpZiAoZWxldiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRFbGV2YXRpb24oZWxldik7XG4gICAgfVxuXG4gICAgdGhpcy5fZ3BzUmVjZWl2ZWQoe1xuICAgICAgY29vcmRzOiB7XG4gICAgICAgIGxvbmdpdHVkZTogbG9uLFxuICAgICAgICBsYXRpdHVkZTogbGF0LFxuICAgICAgICBhY2N1cmFjeTogYWNjLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGxvbkxhdFRvV29ybGRDb29yZHMobG9uLCBsYXQpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWRQb3MgPSB0aGlzLl9wcm9qLnByb2plY3QobG9uLCBsYXQpO1xuICAgIGlmICh0aGlzLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luKSB7XG4gICAgICBpZiAodGhpcy5pbml0aWFsUG9zaXRpb24pIHtcbiAgICAgICAgcHJvamVjdGVkUG9zWzBdIC09IHRoaXMuaW5pdGlhbFBvc2l0aW9uWzBdO1xuICAgICAgICBwcm9qZWN0ZWRQb3NbMV0gLT0gdGhpcy5pbml0aWFsUG9zaXRpb25bMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIlRyeWluZyB0byB1c2UgJ2luaXRpYWwgcG9zaXRpb24gYXMgb3JpZ2luJyBtb2RlIHdpdGggbm8gaW5pdGlhbCBwb3NpdGlvbiBkZXRlcm1pbmVkXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbcHJvamVjdGVkUG9zWzBdLCAtcHJvamVjdGVkUG9zWzFdXTtcbiAgfVxuXG4gIGFkZChvYmplY3QsIGxvbiwgbGF0LCBlbGV2KSB7XG4gICAgdGhpcy5zZXRXb3JsZFBvc2l0aW9uKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpO1xuICAgIHRoaXMuX3NjZW5lLmFkZChvYmplY3QpO1xuICB9XG5cbiAgc2V0V29ybGRQb3NpdGlvbihvYmplY3QsIGxvbiwgbGF0LCBlbGV2KSB7XG4gICAgY29uc3Qgd29ybGRDb29yZHMgPSB0aGlzLmxvbkxhdFRvV29ybGRDb29yZHMobG9uLCBsYXQpO1xuICAgIGlmIChlbGV2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9iamVjdC5wb3NpdGlvbi55ID0gZWxldjtcbiAgICB9XG4gICAgW29iamVjdC5wb3NpdGlvbi54LCBvYmplY3QucG9zaXRpb24uel0gPSB3b3JsZENvb3JkcztcbiAgfVxuXG4gIHNldEVsZXZhdGlvbihlbGV2KSB7XG4gICAgdGhpcy5fY2FtZXJhLnBvc2l0aW9uLnkgPSBlbGV2O1xuICB9XG5cbiAgb24oZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50TmFtZV0gPSBldmVudEhhbmRsZXI7XG4gIH1cblxuICBzZXRXb3JsZE9yaWdpbihsb24sIGxhdCkge1xuICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uID0gdGhpcy5fcHJvai5wcm9qZWN0KGxvbiwgbGF0KTtcbiAgfVxuXG4gIF9ncHNSZWNlaXZlZChwb3NpdGlvbikge1xuICAgIGxldCBkaXN0TW92ZWQgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIGlmIChwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5fZ3BzTWluQWNjdXJhY3kpIHtcbiAgICAgIGlmICh0aGlzLl9sYXN0Q29vcmRzID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMgPSB7XG4gICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXN0TW92ZWQgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KHRoaXMuX2xhc3RDb29yZHMsIHBvc2l0aW9uLmNvb3Jkcyk7XG4gICAgICB9XG4gICAgICBpZiAoZGlzdE1vdmVkID49IHRoaXMuX2dwc01pbkRpc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMubG9uZ2l0dWRlID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgICAgdGhpcy5fbGFzdENvb3Jkcy5sYXRpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbiAmJiAhdGhpcy5pbml0aWFsUG9zaXRpb24pIHtcbiAgICAgICAgICB0aGlzLnNldFdvcmxkT3JpZ2luKFxuICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24oXG4gICAgICAgICAgdGhpcy5fY2FtZXJhLFxuICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHN1cGRhdGVcIl0pIHtcbiAgICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzdXBkYXRlXCJdKHBvc2l0aW9uLCBkaXN0TW92ZWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBoYXZlcnNpbmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gbGF0L2xvbiBwYWlycy5cbiAgICpcbiAgICogVGFrZW4gZnJvbSBvcmlnaW5hbCBBLUZyYW1lIGNvbXBvbmVudHNcbiAgICovXG4gIF9oYXZlcnNpbmVEaXN0KHNyYywgZGVzdCkge1xuICAgIGNvbnN0IGRsb25naXR1ZGUgPSB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgIGNvbnN0IGRsYXRpdHVkZSA9IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18uTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUgLSBzcmMubGF0aXR1ZGUpO1xuXG4gICAgY29uc3QgYSA9XG4gICAgICBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICtcbiAgICAgIE1hdGguY29zKHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18uTWF0aFV0aWxzLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcbiAgICAgICAgTWF0aC5jb3ModGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXy5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSkpICpcbiAgICAgICAgKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XG4gICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gIH1cbn1cblxuXG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvc3BobWVyYy1wcm9qZWN0aW9uLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9zcGhtZXJjLXByb2plY3Rpb24uanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKi8gKChfX3VudXNlZF93ZWJwYWNrX21vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykgPT4ge1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBTcGhNZXJjUHJvamVjdGlvbjogKCkgPT4gKC8qIGJpbmRpbmcgKi8gU3BoTWVyY1Byb2plY3Rpb24pXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbmNsYXNzIFNwaE1lcmNQcm9qZWN0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5FQVJUSCA9IDQwMDc1MDE2LjY4O1xuICAgIHRoaXMuSEFMRl9FQVJUSCA9IDIwMDM3NTA4LjM0O1xuICB9XG5cbiAgcHJvamVjdChsb24sIGxhdCkge1xuICAgIHJldHVybiBbdGhpcy5sb25Ub1NwaE1lcmMobG9uKSwgdGhpcy5sYXRUb1NwaE1lcmMobGF0KV07XG4gIH1cblxuICB1bnByb2plY3QocHJvamVjdGVkKSB7XG4gICAgcmV0dXJuIFt0aGlzLnNwaE1lcmNUb0xvbihwcm9qZWN0ZWRbMF0pLCB0aGlzLnNwaE1lcmNUb0xhdChwcm9qZWN0ZWRbMV0pXTtcbiAgfVxuXG4gIGxvblRvU3BoTWVyYyhsb24pIHtcbiAgICByZXR1cm4gKGxvbiAvIDE4MCkgKiB0aGlzLkhBTEZfRUFSVEg7XG4gIH1cblxuICBsYXRUb1NwaE1lcmMobGF0KSB7XG4gICAgdmFyIHkgPSBNYXRoLmxvZyhNYXRoLnRhbigoKDkwICsgbGF0KSAqIE1hdGguUEkpIC8gMzYwKSkgLyAoTWF0aC5QSSAvIDE4MCk7XG4gICAgcmV0dXJuICh5ICogdGhpcy5IQUxGX0VBUlRIKSAvIDE4MC4wO1xuICB9XG5cbiAgc3BoTWVyY1RvTG9uKHgpIHtcbiAgICByZXR1cm4gKHggLyB0aGlzLkhBTEZfRUFSVEgpICogMTgwLjA7XG4gIH1cblxuICBzcGhNZXJjVG9MYXQoeSkge1xuICAgIHZhciBsYXQgPSAoeSAvIHRoaXMuSEFMRl9FQVJUSCkgKiAxODAuMDtcbiAgICBsYXQgPVxuICAgICAgKDE4MCAvIE1hdGguUEkpICpcbiAgICAgICgyICogTWF0aC5hdGFuKE1hdGguZXhwKChsYXQgKiBNYXRoLlBJKSAvIDE4MCkpIC0gTWF0aC5QSSAvIDIpO1xuICAgIHJldHVybiBsYXQ7XG4gIH1cblxuICBnZXRJRCgpIHtcbiAgICByZXR1cm4gXCJlcHNnOjM4NTdcIjtcbiAgfVxufVxuXG5cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy93ZWJjYW0tcmVuZGVyZXIuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3dlYmNhbS1yZW5kZXJlci5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKF9fdW51c2VkX3dlYnBhY2tfbW9kdWxlLCBfX3dlYnBhY2tfZXhwb3J0c19fLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSA9PiB7XG5cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFdlYmNhbVJlbmRlcmVyOiAoKSA9PiAoLyogYmluZGluZyAqLyBXZWJjYW1SZW5kZXJlcilcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISB0aHJlZSAqLyBcInRocmVlXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19fZGVmYXVsdCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fLm4odGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyk7XG5cblxuY2xhc3MgV2ViY2FtUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihyZW5kZXJlciwgdmlkZW9FbGVtZW50KSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgIHRoaXMucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZVdlYmNhbSA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlNjZW5lKCk7XG4gICAgbGV0IHZpZGVvO1xuICAgIGlmICh2aWRlb0VsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik7XG4gICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJhdXRvcGxheVwiLCB0cnVlKTtcbiAgICAgIHZpZGVvLnNldEF0dHJpYnV0ZShcInBsYXlzaW5saW5lXCIsIHRydWUpO1xuICAgICAgdmlkZW8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWRlbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih2aWRlb0VsZW1lbnQpO1xuICAgIH1cbiAgICB0aGlzLmdlb20gPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5QbGFuZUJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgdGhpcy50ZXh0dXJlID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uVmlkZW9UZXh0dXJlKHZpZGVvKTtcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRoaXMudGV4dHVyZSB9KTtcbiAgICBjb25zdCBtZXNoID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWVzaCh0aGlzLmdlb20sIHRoaXMubWF0ZXJpYWwpO1xuICAgIHRoaXMuc2NlbmVXZWJjYW0uYWRkKG1lc2gpO1xuICAgIHRoaXMuY2FtZXJhV2ViY2FtID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uT3J0aG9ncmFwaGljQ2FtZXJhKFxuICAgICAgLTAuNSxcbiAgICAgIDAuNSxcbiAgICAgIDAuNSxcbiAgICAgIC0wLjUsXG4gICAgICAwLFxuICAgICAgMTBcbiAgICApO1xuICAgIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICB3aWR0aDogMTI4MCxcbiAgICAgICAgICBoZWlnaHQ6IDcyMCxcbiAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgICAuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKVxuICAgICAgICAudGhlbigoc3RyZWFtKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYHVzaW5nIHRoZSB3ZWJjYW0gc3VjY2Vzc2Z1bGx5Li4uYCk7XG4gICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUVycm9yUG9wdXAoXG4gICAgICAgICAgICAgIFwiV2ViY2FtIEVycm9yXFxuTmFtZTogXCIgKyBlLm5hbWUgKyBcIlxcbk1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlRXJyb3JQb3B1cChcInNvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZFwiKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZVdlYmNhbSwgdGhpcy5jYW1lcmFXZWJjYW0pO1xuICAgIHRoaXMucmVuZGVyZXIuY2xlYXJEZXB0aCgpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ2VvbS5kaXNwb3NlKCk7XG4gIH1cblxuICBjcmVhdGVFcnJvclBvcHVwKG1zZykge1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvci1wb3B1cFwiKSkge1xuICAgICAgdmFyIGVycm9yUG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZXJyb3JQb3B1cC5pbm5lckhUTUwgPSBtc2c7XG4gICAgICBlcnJvclBvcHVwLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiZXJyb3ItcG9wdXBcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVycm9yUG9wdXApO1xuICAgIH1cbiAgfVxufVxuXG5cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCJ0aHJlZVwiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKG1vZHVsZSkgPT4ge1xuXG5tb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXztcblxuLyoqKi8gfSlcblxuLyoqKioqKi8gXHR9KTtcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuLyoqKioqKi8gXHRcdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcbi8qKioqKiovIFx0XHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuLyoqKioqKi8gXHRcdFx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcbi8qKioqKiovIFx0XHRcdFx0KCkgPT4gKG1vZHVsZSk7XG4vKioqKioqLyBcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcbi8qKioqKiovIFx0XHRcdHJldHVybiBnZXR0ZXI7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuLyoqKioqKi8gXHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpXG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG4vKioqKioqLyBcdFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbi8qKioqKiovIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIG1vZHVsZXMgaW4gdGhlIGNodW5rLlxuKCgpID0+IHtcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiAoKSA9PiAoLyogcmVleHBvcnQgc2FmZSAqLyBfanNfZGV2aWNlX29yaWVudGF0aW9uX2NvbnRyb2xzX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8yX18uRGV2aWNlT3JpZW50YXRpb25Db250cm9scyksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIExvY2F0aW9uQmFzZWQ6ICgpID0+ICgvKiByZWV4cG9ydCBzYWZlICovIF9qc19sb2NhdGlvbl9iYXNlZF9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLkxvY2F0aW9uQmFzZWQpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBXZWJjYW1SZW5kZXJlcjogKCkgPT4gKC8qIHJlZXhwb3J0IHNhZmUgKi8gX2pzX3dlYmNhbV9yZW5kZXJlcl9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fLldlYmNhbVJlbmRlcmVyKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX2pzX2xvY2F0aW9uX2Jhc2VkX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2pzL2xvY2F0aW9uLWJhc2VkLmpzICovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvbG9jYXRpb24tYmFzZWQuanNcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX2pzX3dlYmNhbV9yZW5kZXJlcl9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9qcy93ZWJjYW0tcmVuZGVyZXIuanMgKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy93ZWJjYW0tcmVuZGVyZXIuanNcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX2pzX2RldmljZV9vcmllbnRhdGlvbl9jb250cm9sc19qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanMgKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanNcIik7XG5cblxuXG5cblxuXG59KSgpO1xuXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xuLyoqKioqKi8gfSkoKVxuO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVlYSXRkR2h5WldWNExXeHZZMkYwYVc5dUxXOXViSGt1YW5NaUxDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1EwRkJRenRCUVVORUxFODdPenM3T3pzN096czdPenM3T3pzN1FVTldRVHRCUVVOQk96dEJRVVVyUlRzN1FVRkZMMFVzYVVKQlFXbENMREJEUVVGUE8wRkJRM2hDTEcxQ1FVRnRRaXgzUTBGQlN6dEJRVU40UWl4blFrRkJaMElzTmtOQlFWVTdRVUZETVVJc1owSkJRV2RDTERaRFFVRlZMSGxEUVVGNVF6czdRVUZGYmtVc2RVSkJRWFZDT3p0QlFVVjJRaXgzUTBGQmQwTXNhMFJCUVdVN1FVRkRka1E3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCT3p0QlFVVkJPMEZCUTBFc0swSkJRU3RDTERaRFFVRlZPenRCUVVWNlF6dEJRVU5CT3p0QlFVVkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRXNNRUpCUVRCQ096dEJRVVV4UWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxEaERRVUU0UXpzN1FVRkZPVU1zZFVOQlFYVkRPenRCUVVWMlF5eG5RMEZCWjBNN08wRkJSV2hETEdkRlFVRm5SVHRCUVVOb1JUczdRVUZGUVR0QlFVTkJMSGREUVVGM1F6czdRVUZGZUVNN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hYUVVGWE8wRkJRMWc3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRmRCUVZjN1FVRkRXQ3hSUVVGUk8wRkJRMUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N3MFEwRkJVenRCUVVOeVFpeGxRVUZsT3p0QlFVVm1MR2xEUVVGcFF5dzBRMEZCVXl3MFFrRkJORUk3TzBGQlJYUkZMRzFEUVVGdFF5dzBRMEZCVXl3MlFrRkJOa0k3TzBGQlJYcEZPMEZCUTBFc1dVRkJXU3cwUTBGQlV6dEJRVU55UWl4bFFVRmxPenRCUVVWbU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEdsQ1FVRnBRanRCUVVOcVFpeFJRVUZSTzBGQlExSXNhVUpCUVdsQ08wRkJRMnBDTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZjVU03T3pzN096czdPenM3T3pzN096czdPenRCUTNCUGRVSTdRVUZETjBJN08wRkJSUzlDTzBGQlEwRXNlVU5CUVhsRE8wRkJRM3BETzBGQlEwRTdRVUZEUVN4eFFrRkJjVUlzY1VWQlFXbENPMEZCUTNSRE8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRU3cwUWtGQk5FSTdRVUZETlVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRk5CUVZNN1FVRkRWRHRCUVVOQk8wRkJRMEU3UVVGRFFTeFpRVUZaTzBGQlExb3NjVU5CUVhGRExGZEJRVmM3UVVGRGFFUTdRVUZEUVN4VFFVRlRPMEZCUTFRN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEU5QlFVODdRVUZEVUN4TFFVRkxPMEZCUTB3N08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1VVRkJVVHRCUVVOU08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxGRkJRVkU3UVVGRFVqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeDFRa0ZCZFVJc05FTkJRV1U3UVVGRGRFTXNjMEpCUVhOQ0xEUkRRVUZsT3p0QlFVVnlRenRCUVVOQk8wRkJRMEVzWlVGQlpTdzBRMEZCWlR0QlFVTTVRaXhwUWtGQmFVSXNORU5CUVdVN1FVRkRhRU03UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZlVUk3T3pzN096czdPenM3T3pzN096dEJRemRMZWtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVFpDT3pzN096czdPenM3T3pzN096czdPenRCUTNoRFJUczdRVUZGTDBJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTd3lRa0ZCTWtJc2QwTkJRVmM3UVVGRGRFTTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeE5RVUZOTzBGQlEwNDdRVUZEUVR0QlFVTkJMRzlDUVVGdlFpeHpSRUZCZVVJN1FVRkROME1zZFVKQlFYVkNMQ3REUVVGclFqdEJRVU42UXl4M1FrRkJkMElzYjBSQlFYVkNMRWRCUVVjc2JVSkJRVzFDTzBGQlEzSkZMSEZDUVVGeFFpeDFRMEZCVlR0QlFVTXZRanRCUVVOQkxEUkNRVUUwUWl4eFJFRkJkMEk3UVVGRGNFUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hUUVVGVE8wRkJRMVE3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hUUVVGVE8wRkJRMVE3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRmRCUVZjN1FVRkRXQ3hUUVVGVE8wRkJRMVFzVFVGQlRUdEJRVU5PTzBGQlEwRTdRVUZEUVN4UFFVRlBPMEZCUTFBN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVVd1FqczdPenM3T3pzN096czdRVU5xUmpGQ096czdPenM3VlVOQlFUdFZRVU5CT3p0VlFVVkJPMVZCUTBFN1ZVRkRRVHRWUVVOQk8xVkJRMEU3VlVGRFFUdFZRVU5CTzFWQlEwRTdWVUZEUVR0VlFVTkJPMVZCUTBFN1ZVRkRRVHRWUVVOQk96dFZRVVZCTzFWQlEwRTdPMVZCUlVFN1ZVRkRRVHRWUVVOQk96czdPenRYUTNSQ1FUdFhRVU5CTzFkQlEwRTdWMEZEUVR0WFFVTkJPMWRCUTBFc2FVTkJRV2xETEZkQlFWYzdWMEZETlVNN1YwRkRRVHM3T3pzN1YwTlFRVHRYUVVOQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhsRFFVRjVReXgzUTBGQmQwTTdWMEZEYWtZN1YwRkRRVHRYUVVOQk96czdPenRYUTFCQk96czdPenRYUTBGQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhWRVFVRjFSQ3hwUWtGQmFVSTdWMEZEZUVVN1YwRkRRU3huUkVGQlowUXNZVUZCWVR0WFFVTTNSRHM3T3pzN096czdPenM3T3pzN096czdPenRCUTA1MVJEdEJRVU5GTzBGQlEzVkNPenRCUVVWYUlpd2ljMjkxY21ObGN5STZXeUozWldKd1lXTnJPaTh2VkVoU1JVVjRMM2RsWW5CaFkyc3ZkVzVwZG1WeWMyRnNUVzlrZFd4bFJHVm1hVzVwZEdsdmJpSXNJbmRsWW5CaFkyczZMeTlVU0ZKRlJYZ3ZMaTkwYUhKbFpTNXFjeTl6Y21NdmJHOWpZWFJwYjI0dFltRnpaV1F2YW5NdlpHVjJhV05sTFc5eWFXVnVkR0YwYVc5dUxXTnZiblJ5YjJ4ekxtcHpJaXdpZDJWaWNHRmphem92TDFSSVVrVkZlQzh1TDNSb2NtVmxMbXB6TDNOeVl5OXNiMk5oZEdsdmJpMWlZWE5sWkM5cWN5OXNiMk5oZEdsdmJpMWlZWE5sWkM1cWN5SXNJbmRsWW5CaFkyczZMeTlVU0ZKRlJYZ3ZMaTkwYUhKbFpTNXFjeTl6Y21NdmJHOWpZWFJwYjI0dFltRnpaV1F2YW5NdmMzQm9iV1Z5WXkxd2NtOXFaV04wYVc5dUxtcHpJaXdpZDJWaWNHRmphem92TDFSSVVrVkZlQzh1TDNSb2NtVmxMbXB6TDNOeVl5OXNiMk5oZEdsdmJpMWlZWE5sWkM5cWN5OTNaV0pqWVcwdGNtVnVaR1Z5WlhJdWFuTWlMQ0ozWldKd1lXTnJPaTh2VkVoU1JVVjRMMlY0ZEdWeWJtRnNJSFZ0WkNCN1hDSmpiMjF0YjI1cWMxd2lPbHdpZEdoeVpXVmNJaXhjSW1OdmJXMXZibXB6TWx3aU9sd2lkR2h5WldWY0lpeGNJbUZ0WkZ3aU9sd2lkR2h5WldWY0lpeGNJbkp2YjNSY0lqcGNJbFJJVWtWRlhDSjlJaXdpZDJWaWNHRmphem92TDFSSVVrVkZlQzkzWldKd1lXTnJMMkp2YjNSemRISmhjQ0lzSW5kbFluQmhZMnM2THk5VVNGSkZSWGd2ZDJWaWNHRmpheTl5ZFc1MGFXMWxMMk52YlhCaGRDQm5aWFFnWkdWbVlYVnNkQ0JsZUhCdmNuUWlMQ0ozWldKd1lXTnJPaTh2VkVoU1JVVjRMM2RsWW5CaFkyc3ZjblZ1ZEdsdFpTOWtaV1pwYm1VZ2NISnZjR1Z5ZEhrZ1oyVjBkR1Z5Y3lJc0luZGxZbkJoWTJzNkx5OVVTRkpGUlhndmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJoaGMwOTNibEJ5YjNCbGNuUjVJSE5vYjNKMGFHRnVaQ0lzSW5kbFluQmhZMnM2THk5VVNGSkZSWGd2ZDJWaWNHRmpheTl5ZFc1MGFXMWxMMjFoYTJVZ2JtRnRaWE53WVdObElHOWlhbVZqZENJc0luZGxZbkJoWTJzNkx5OVVTRkpGUlhndkxpOTBhSEpsWlM1cWN5OXpjbU12Ykc5allYUnBiMjR0WW1GelpXUXZhVzVrWlhndWFuTWlYU3dpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpS0daMWJtTjBhVzl1SUhkbFluQmhZMnRWYm1sMlpYSnpZV3hOYjJSMWJHVkVaV1pwYm1sMGFXOXVLSEp2YjNRc0lHWmhZM1J2Y25rcElIdGNibHgwYVdZb2RIbHdaVzltSUdWNGNHOXlkSE1nUFQwOUlDZHZZbXBsWTNRbklDWW1JSFI1Y0dWdlppQnRiMlIxYkdVZ1BUMDlJQ2R2WW1wbFkzUW5LVnh1WEhSY2RHMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ptRmpkRzl5ZVNoeVpYRjFhWEpsS0Z3aWRHaHlaV1ZjSWlrcE8xeHVYSFJsYkhObElHbG1LSFI1Y0dWdlppQmtaV1pwYm1VZ1BUMDlJQ2RtZFc1amRHbHZiaWNnSmlZZ1pHVm1hVzVsTG1GdFpDbGNibHgwWEhSa1pXWnBibVVvVzF3aWRHaHlaV1ZjSWwwc0lHWmhZM1J2Y25rcE8xeHVYSFJsYkhObElHbG1LSFI1Y0dWdlppQmxlSEJ2Y25SeklEMDlQU0FuYjJKcVpXTjBKeWxjYmx4MFhIUmxlSEJ2Y25Selcxd2lWRWhTUlVWNFhDSmRJRDBnWm1GamRHOXllU2h5WlhGMWFYSmxLRndpZEdoeVpXVmNJaWtwTzF4dVhIUmxiSE5sWEc1Y2RGeDBjbTl2ZEZ0Y0lsUklVa1ZGZUZ3aVhTQTlJR1poWTNSdmNua29jbTl2ZEZ0Y0lsUklVa1ZGWENKZEtUdGNibjBwS0hSb2FYTXNJQ2hmWDFkRlFsQkJRMHRmUlZoVVJWSk9RVXhmVFU5RVZVeEZYM1JvY21WbFgxOHBJRDArSUh0Y2JuSmxkSFZ5YmlBaUxDSXZMeUJOYjJScFptbGxaQ0IyWlhKemFXOXVJRzltSUZSSVVrVkZMa1JsZG1salpVOXlhV1Z1ZEdGMGFXOXVRMjl1ZEhKdmJITWdabkp2YlNCMGFISmxaUzVxYzF4dUx5OGdkMmxzYkNCMWMyVWdkR2hsSUdSbGRtbGpaVzl5YVdWdWRHRjBhVzl1WVdKemIyeDFkR1VnWlhabGJuUWdhV1lnWVhaaGFXeGhZbXhsWEc1Y2JtbHRjRzl5ZENCN0lFVjFiR1Z5TENCRmRtVnVkRVJwYzNCaGRHTm9aWElzSUUxaGRHaFZkR2xzY3l3Z1VYVmhkR1Z5Ym1sdmJpd2dWbVZqZEc5eU15QjlJR1p5YjIwZ1hDSjBhSEpsWlZ3aU8xeHVYRzVqYjI1emRDQmZlbVZsSUQwZ2JtVjNJRlpsWTNSdmNqTW9NQ3dnTUN3Z01TazdYRzVqYjI1emRDQmZaWFZzWlhJZ1BTQnVaWGNnUlhWc1pYSW9LVHRjYm1OdmJuTjBJRjl4TUNBOUlHNWxkeUJSZFdGMFpYSnVhVzl1S0NrN1hHNWpiMjV6ZENCZmNURWdQU0J1WlhjZ1VYVmhkR1Z5Ym1sdmJpZ3RUV0YwYUM1emNYSjBLREF1TlNrc0lEQXNJREFzSUUxaGRHZ3VjM0Z5ZENnd0xqVXBLVHNnTHk4Z0xTQlFTUzh5SUdGeWIzVnVaQ0IwYUdVZ2VDMWhlR2x6WEc1Y2JtTnZibk4wSUY5amFHRnVaMlZGZG1WdWRDQTlJSHNnZEhsd1pUb2dYQ0pqYUdGdVoyVmNJaUI5TzF4dVhHNWpiR0Z6Y3lCRVpYWnBZMlZQY21sbGJuUmhkR2x2YmtOdmJuUnliMnh6SUdWNGRHVnVaSE1nUlhabGJuUkVhWE53WVhSamFHVnlJSHRjYmlBZ1kyOXVjM1J5ZFdOMGIzSW9iMkpxWldOMEtTQjdYRzRnSUNBZ2MzVndaWElvS1R0Y2JseHVJQ0FnSUdsbUlDaDNhVzVrYjNjdWFYTlRaV04xY21WRGIyNTBaWGgwSUQwOVBTQm1ZV3h6WlNrZ2UxeHVJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWhjYmlBZ0lDQWdJQ0FnWENKVVNGSkZSUzVFWlhacFkyVlBjbWxsYm5SaGRHbHZia052Ym5SeWIyeHpPaUJFWlhacFkyVlBjbWxsYm5SaGRHbHZia1YyWlc1MElHbHpJRzl1YkhrZ1lYWmhhV3hoWW14bElHbHVJSE5sWTNWeVpTQmpiMjUwWlhoMGN5QW9hSFIwY0hNcFhDSmNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1kyOXVjM1FnYzJOdmNHVWdQU0IwYUdsek8xeHVYRzRnSUNBZ1kyOXVjM1FnUlZCVElEMGdNQzR3TURBd01ERTdYRzRnSUNBZ1kyOXVjM1FnYkdGemRGRjFZWFJsY201cGIyNGdQU0J1WlhjZ1VYVmhkR1Z5Ym1sdmJpZ3BPMXh1WEc0Z0lDQWdkR2hwY3k1dlltcGxZM1FnUFNCdlltcGxZM1E3WEc0Z0lDQWdkR2hwY3k1dlltcGxZM1F1Y205MFlYUnBiMjR1Y21WdmNtUmxjaWhjSWxsWVdsd2lLVHRjYmx4dUlDQWdJSFJvYVhNdVpXNWhZbXhsWkNBOUlIUnlkV1U3WEc1Y2JpQWdJQ0IwYUdsekxtUmxkbWxqWlU5eWFXVnVkR0YwYVc5dUlEMGdlMzA3WEc0Z0lDQWdkR2hwY3k1elkzSmxaVzVQY21sbGJuUmhkR2x2YmlBOUlEQTdYRzVjYmlBZ0lDQjBhR2x6TG1Gc2NHaGhUMlptYzJWMElEMGdNRHNnTHk4Z2NtRmthV0Z1YzF4dVhHNGdJQ0FnZEdocGN5NVVWMDlmVUVrZ1BTQXlJQ29nVFdGMGFDNVFTVHRjYmlBZ0lDQjBhR2x6TGtoQlRFWmZVRWtnUFNBd0xqVWdLaUJOWVhSb0xsQkpPMXh1SUNBZ0lIUm9hWE11YjNKcFpXNTBZWFJwYjI1RGFHRnVaMlZGZG1WdWRFNWhiV1VnUFZ4dUlDQWdJQ0FnWENKdmJtUmxkbWxqWlc5eWFXVnVkR0YwYVc5dVlXSnpiMngxZEdWY0lpQnBiaUIzYVc1a2IzZGNiaUFnSUNBZ0lDQWdQeUJjSW1SbGRtbGpaVzl5YVdWdWRHRjBhVzl1WVdKemIyeDFkR1ZjSWx4dUlDQWdJQ0FnSUNBNklGd2laR1YyYVdObGIzSnBaVzUwWVhScGIyNWNJanRjYmx4dUlDQWdJSFJvYVhNdWMyMXZiM1JvYVc1blJtRmpkRzl5SUQwZ01UdGNibHh1SUNBZ0lHTnZibk4wSUc5dVJHVjJhV05sVDNKcFpXNTBZWFJwYjI1RGFHRnVaMlZGZG1WdWRDQTlJR1oxYm1OMGFXOXVJQ2hsZG1WdWRDa2dlMXh1SUNBZ0lDQWdjMk52Y0dVdVpHVjJhV05sVDNKcFpXNTBZWFJwYjI0Z1BTQmxkbVZ1ZER0Y2JpQWdJQ0I5TzF4dVhHNGdJQ0FnWTI5dWMzUWdiMjVUWTNKbFpXNVBjbWxsYm5SaGRHbHZia05vWVc1blpVVjJaVzUwSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdjMk52Y0dVdWMyTnlaV1Z1VDNKcFpXNTBZWFJwYjI0Z1BTQjNhVzVrYjNjdWIzSnBaVzUwWVhScGIyNGdmSHdnTUR0Y2JpQWdJQ0I5TzF4dVhHNGdJQ0FnTHk4Z1ZHaGxJR0Z1WjJ4bGN5QmhiSEJvWVN3Z1ltVjBZU0JoYm1RZ1oyRnRiV0VnWm05eWJTQmhJSE5sZENCdlppQnBiblJ5YVc1emFXTWdWR0ZwZEMxQ2NubGhiaUJoYm1kc1pYTWdiMllnZEhsd1pTQmFMVmduTFZrbkoxeHVYRzRnSUNBZ1kyOXVjM1FnYzJWMFQySnFaV04wVVhWaGRHVnlibWx2YmlBOUlHWjFibU4wYVc5dUlDaGNiaUFnSUNBZ0lIRjFZWFJsY201cGIyNHNYRzRnSUNBZ0lDQmhiSEJvWVN4Y2JpQWdJQ0FnSUdKbGRHRXNYRzRnSUNBZ0lDQm5ZVzF0WVN4Y2JpQWdJQ0FnSUc5eWFXVnVkRnh1SUNBZ0lDa2dlMXh1SUNBZ0lDQWdYMlYxYkdWeUxuTmxkQ2hpWlhSaExDQmhiSEJvWVN3Z0xXZGhiVzFoTENCY0lsbFlXbHdpS1RzZ0x5OGdKMXBZV1NjZ1ptOXlJSFJvWlNCa1pYWnBZMlVzSUdKMWRDQW5XVmhhSnlCbWIzSWdkWE5jYmx4dUlDQWdJQ0FnY1hWaGRHVnlibWx2Ymk1elpYUkdjbTl0UlhWc1pYSW9YMlYxYkdWeUtUc2dMeThnYjNKcFpXNTBJSFJvWlNCa1pYWnBZMlZjYmx4dUlDQWdJQ0FnY1hWaGRHVnlibWx2Ymk1dGRXeDBhWEJzZVNoZmNURXBPeUF2THlCallXMWxjbUVnYkc5dmEzTWdiM1YwSUhSb1pTQmlZV05ySUc5bUlIUm9aU0JrWlhacFkyVXNJRzV2ZENCMGFHVWdkRzl3WEc1Y2JpQWdJQ0FnSUhGMVlYUmxjbTVwYjI0dWJYVnNkR2x3Ykhrb1gzRXdMbk5sZEVaeWIyMUJlR2x6UVc1bmJHVW9YM3BsWlN3Z0xXOXlhV1Z1ZENrcE95QXZMeUJoWkdwMWMzUWdabTl5SUhOamNtVmxiaUJ2Y21sbGJuUmhkR2x2Ymx4dUlDQWdJSDA3WEc1Y2JpQWdJQ0IwYUdsekxtTnZibTVsWTNRZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0J2YmxOamNtVmxiazl5YVdWdWRHRjBhVzl1UTJoaGJtZGxSWFpsYm5Rb0tUc2dMeThnY25WdUlHOXVZMlVnYjI0Z2JHOWhaRnh1WEc0Z0lDQWdJQ0F2THlCcFQxTWdNVE1yWEc1Y2JpQWdJQ0FnSUdsbUlDaGNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVJYWmxiblFnSVQwOUlIVnVaR1ZtYVc1bFpDQW1KbHh1SUNBZ0lDQWdJQ0IwZVhCbGIyWWdkMmx1Wkc5M0xrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVJYWmxiblF1Y21WeGRXVnpkRkJsY20xcGMzTnBiMjRnUFQwOUlGd2lablZ1WTNScGIyNWNJbHh1SUNBZ0lDQWdLU0I3WEc0Z0lDQWdJQ0FnSUhkcGJtUnZkeTVFWlhacFkyVlBjbWxsYm5SaGRHbHZia1YyWlc1MExuSmxjWFZsYzNSUVpYSnRhWE56YVc5dUtDbGNiaUFnSUNBZ0lDQWdJQ0F1ZEdobGJpZ29jbVZ6Y0c5dWMyVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoeVpYTndiMjV6WlNBOVBUMGdYQ0puY21GdWRHVmtYQ0lwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZDJsdVpHOTNMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYQ0p2Y21sbGJuUmhkR2x2Ym1Ob1lXNW5aVndpTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUc5dVUyTnlaV1Z1VDNKcFpXNTBZWFJwYjI1RGFHRnVaMlZGZG1WdWRGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCM2FXNWtiM2N1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pTNXZjbWxsYm5SaGRHbHZia05vWVc1blpVVjJaVzUwVG1GdFpTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnZia1JsZG1salpVOXlhV1Z1ZEdGMGFXOXVRMmhoYm1kbFJYWmxiblJjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0I5S1Z4dUlDQWdJQ0FnSUNBZ0lDNWpZWFJqYUNobWRXNWpkR2x2YmlBb1pYSnliM0lwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR052Ym5OdmJHVXVaWEp5YjNJb1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUZ3aVZFaFNSVVV1UkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVEYjI1MGNtOXNjem9nVlc1aFlteGxJSFJ2SUhWelpTQkVaWFpwWTJWUGNtbGxiblJoZEdsdmJpQkJVRWs2WENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdWeWNtOXlYRzRnSUNBZ0lDQWdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZDJsdVpHOTNMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9YRzRnSUNBZ0lDQWdJQ0FnWENKdmNtbGxiblJoZEdsdmJtTm9ZVzVuWlZ3aUxGeHVJQ0FnSUNBZ0lDQWdJRzl1VTJOeVpXVnVUM0pwWlc1MFlYUnBiMjVEYUdGdVoyVkZkbVZ1ZEZ4dUlDQWdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loY2JpQWdJQ0FnSUNBZ0lDQnpZMjl3WlM1dmNtbGxiblJoZEdsdmJrTm9ZVzVuWlVWMlpXNTBUbUZ0WlN4Y2JpQWdJQ0FnSUNBZ0lDQnZia1JsZG1salpVOXlhV1Z1ZEdGMGFXOXVRMmhoYm1kbFJYWmxiblJjYmlBZ0lDQWdJQ0FnS1R0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2MyTnZjR1V1Wlc1aFlteGxaQ0E5SUhSeWRXVTdYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lIUm9hWE11WkdselkyOXVibVZqZENBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJSGRwYm1SdmR5NXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRnh1SUNBZ0lDQWdJQ0JjSW05eWFXVnVkR0YwYVc5dVkyaGhibWRsWENJc1hHNGdJQ0FnSUNBZ0lHOXVVMk55WldWdVQzSnBaVzUwWVhScGIyNURhR0Z1WjJWRmRtVnVkRnh1SUNBZ0lDQWdLVHRjYmlBZ0lDQWdJSGRwYm1SdmR5NXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRnh1SUNBZ0lDQWdJQ0J6WTI5d1pTNXZjbWxsYm5SaGRHbHZia05vWVc1blpVVjJaVzUwVG1GdFpTeGNiaUFnSUNBZ0lDQWdiMjVFWlhacFkyVlBjbWxsYm5SaGRHbHZia05vWVc1blpVVjJaVzUwWEc0Z0lDQWdJQ0FwTzF4dVhHNGdJQ0FnSUNCelkyOXdaUzVsYm1GaWJHVmtJRDBnWm1Gc2MyVTdYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lIUm9hWE11ZFhCa1lYUmxJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSE5qYjNCbExtVnVZV0pzWldRZ1BUMDlJR1poYkhObEtTQnlaWFIxY200N1hHNWNiaUFnSUNBZ0lHTnZibk4wSUdSbGRtbGpaU0E5SUhOamIzQmxMbVJsZG1salpVOXlhV1Z1ZEdGMGFXOXVPMXh1WEc0Z0lDQWdJQ0JwWmlBb1pHVjJhV05sS1NCN1hHNGdJQ0FnSUNBZ0lHeGxkQ0JoYkhCb1lTQTlJR1JsZG1salpTNWhiSEJvWVZ4dUlDQWdJQ0FnSUNBZ0lEOGdUV0YwYUZWMGFXeHpMbVJsWjFSdlVtRmtLR1JsZG1salpTNWhiSEJvWVNrZ0t5QnpZMjl3WlM1aGJIQm9ZVTltWm5ObGRGeHVJQ0FnSUNBZ0lDQWdJRG9nTURzZ0x5OGdXbHh1WEc0Z0lDQWdJQ0FnSUd4bGRDQmlaWFJoSUQwZ1pHVjJhV05sTG1KbGRHRWdQeUJOWVhSb1ZYUnBiSE11WkdWblZHOVNZV1FvWkdWMmFXTmxMbUpsZEdFcElEb2dNRHNnTHk4Z1dDZGNibHh1SUNBZ0lDQWdJQ0JzWlhRZ1oyRnRiV0VnUFNCa1pYWnBZMlV1WjJGdGJXRWdQeUJOWVhSb1ZYUnBiSE11WkdWblZHOVNZV1FvWkdWMmFXTmxMbWRoYlcxaEtTQTZJREE3SUM4dklGa25KMXh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl5YVdWdWRDQTlJSE5qYjNCbExuTmpjbVZsYms5eWFXVnVkR0YwYVc5dVhHNGdJQ0FnSUNBZ0lDQWdQeUJOWVhSb1ZYUnBiSE11WkdWblZHOVNZV1FvYzJOdmNHVXVjMk55WldWdVQzSnBaVzUwWVhScGIyNHBYRzRnSUNBZ0lDQWdJQ0FnT2lBd095QXZMeUJQWEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWMyMXZiM1JvYVc1blJtRmpkRzl5SUR3Z01Ta2dlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG14aGMzUlBjbWxsYm5SaGRHbHZiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ2F5QTlJSFJvYVhNdWMyMXZiM1JvYVc1blJtRmpkRzl5TzF4dUlDQWdJQ0FnSUNBZ0lDQWdZV3h3YUdFZ1BTQjBhR2x6TGw5blpYUlRiVzl2ZEdobFpFRnVaMnhsS0Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JoYkhCb1lTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVzWVhOMFQzSnBaVzUwWVhScGIyNHVZV3h3YUdFc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUd0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmlaWFJoSUQwZ2RHaHBjeTVmWjJWMFUyMXZiM1JvWldSQmJtZHNaU2hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZbVYwWVNBcklFMWhkR2d1VUVrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhSb2FYTXViR0Z6ZEU5eWFXVnVkR0YwYVc5dUxtSmxkR0VzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDazdYRzRnSUNBZ0lDQWdJQ0FnSUNCbllXMXRZU0E5SUhSb2FYTXVYMmRsZEZOdGIyOTBhR1ZrUVc1bmJHVW9YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHZGhiVzFoSUNzZ2RHaHBjeTVJUVV4R1gxQkpMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG14aGMzUlBjbWxsYm5SaGRHbHZiaTVuWVcxdFlTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2F5eGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1RXRjBhQzVRU1Z4dUlDQWdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZbVYwWVNBclBTQk5ZWFJvTGxCSk8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWjJGdGJXRWdLejBnZEdocGN5NUlRVXhHWDFCSk8xeHVJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YkdGemRFOXlhV1Z1ZEdGMGFXOXVJRDBnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZV3h3YUdFNklHRnNjR2hoTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZbVYwWVRvZ1ltVjBZU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHZGhiVzFoT2lCbllXMXRZU3hjYmlBZ0lDQWdJQ0FnSUNCOU8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnYzJWMFQySnFaV04wVVhWaGRHVnlibWx2YmloY2JpQWdJQ0FnSUNBZ0lDQnpZMjl3WlM1dlltcGxZM1F1Y1hWaGRHVnlibWx2Yml4Y2JpQWdJQ0FnSUNBZ0lDQmhiSEJvWVN4Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5OdGIyOTBhR2x1WjBaaFkzUnZjaUE4SURFZ1B5QmlaWFJoSUMwZ1RXRjBhQzVRU1NBNklHSmxkR0VzWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV6Ylc5dmRHaHBibWRHWVdOMGIzSWdQQ0F4SUQ4Z1oyRnRiV0VnTFNCMGFHbHpMa2hCVEVaZlVFa2dPaUJuWVcxdFlTeGNiaUFnSUNBZ0lDQWdJQ0J2Y21sbGJuUmNiaUFnSUNBZ0lDQWdLVHRjYmx4dUlDQWdJQ0FnSUNCcFppQW9PQ0FxSUNneElDMGdiR0Z6ZEZGMVlYUmxjbTVwYjI0dVpHOTBLSE5qYjNCbExtOWlhbVZqZEM1eGRXRjBaWEp1YVc5dUtTa2dQaUJGVUZNcElIdGNiaUFnSUNBZ0lDQWdJQ0JzWVhOMFVYVmhkR1Z5Ym1sdmJpNWpiM0I1S0hOamIzQmxMbTlpYW1WamRDNXhkV0YwWlhKdWFXOXVLVHRjYmlBZ0lDQWdJQ0FnSUNCelkyOXdaUzVrYVhOd1lYUmphRVYyWlc1MEtGOWphR0Z1WjJWRmRtVnVkQ2s3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnTHk4Z1RsY2dRV1JrWldSY2JpQWdJQ0IwYUdsekxsOXZjbVJsY2tGdVoyeGxJRDBnWm5WdVkzUnBiMjRnS0dFc0lHSXNJSEpoYm1kbElEMGdkR2hwY3k1VVYwOWZVRWtwSUh0Y2JpQWdJQ0FnSUdsbUlDaGNiaUFnSUNBZ0lDQWdLR0lnUGlCaElDWW1JRTFoZEdndVlXSnpLR0lnTFNCaEtTQThJSEpoYm1kbElDOGdNaWtnZkh4Y2JpQWdJQ0FnSUNBZ0tHRWdQaUJpSUNZbUlFMWhkR2d1WVdKektHSWdMU0JoS1NBK0lISmhibWRsSUM4Z01pbGNiaUFnSUNBZ0lDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdleUJzWldaME9pQmhMQ0J5YVdkb2REb2dZaUI5TzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSHNnYkdWbWREb2dZaXdnY21sbmFIUTZJR0VnZlR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnTHk4Z1RsY2dRV1JrWldSY2JpQWdJQ0IwYUdsekxsOW5aWFJUYlc5dmRHaGxaRUZ1WjJ4bElEMGdablZ1WTNScGIyNGdLR0VzSUdJc0lHc3NJSEpoYm1kbElEMGdkR2hwY3k1VVYwOWZVRWtwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR0Z1WjJ4bGN5QTlJSFJvYVhNdVgyOXlaR1Z5UVc1bmJHVW9ZU3dnWWl3Z2NtRnVaMlVwTzF4dUlDQWdJQ0FnWTI5dWMzUWdZVzVuYkdWemFHbG1kQ0E5SUdGdVoyeGxjeTVzWldaME8xeHVJQ0FnSUNBZ1kyOXVjM1FnYjNKcFowRnVaMnhsYzFKcFoyaDBJRDBnWVc1bmJHVnpMbkpwWjJoME8xeHVJQ0FnSUNBZ1lXNW5iR1Z6TG14bFpuUWdQU0F3TzF4dUlDQWdJQ0FnWVc1bmJHVnpMbkpwWjJoMElDMDlJR0Z1WjJ4bGMyaHBablE3WEc0Z0lDQWdJQ0JwWmlBb1lXNW5iR1Z6TG5KcFoyaDBJRHdnTUNrZ1lXNW5iR1Z6TG5KcFoyaDBJQ3M5SUhKaGJtZGxPMXh1SUNBZ0lDQWdiR1YwSUc1bGQyRnVaMnhsSUQxY2JpQWdJQ0FnSUNBZ2IzSnBaMEZ1WjJ4bGMxSnBaMmgwSUQwOUlHSmNiaUFnSUNBZ0lDQWdJQ0EvSUNneElDMGdheWtnS2lCaGJtZHNaWE11Y21sbmFIUWdLeUJySUNvZ1lXNW5iR1Z6TG14bFpuUmNiaUFnSUNBZ0lDQWdJQ0E2SUdzZ0tpQmhibWRzWlhNdWNtbG5hSFFnS3lBb01TQXRJR3NwSUNvZ1lXNW5iR1Z6TG14bFpuUTdYRzRnSUNBZ0lDQnVaWGRoYm1kc1pTQXJQU0JoYm1kc1pYTm9hV1owTzF4dUlDQWdJQ0FnYVdZZ0tHNWxkMkZ1WjJ4bElENDlJSEpoYm1kbEtTQnVaWGRoYm1kc1pTQXRQU0J5WVc1blpUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdVpYZGhibWRzWlR0Y2JpQWdJQ0I5TzF4dVhHNGdJQ0FnZEdocGN5NWthWE53YjNObElEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnYzJOdmNHVXVaR2x6WTI5dWJtVmpkQ2dwTzF4dUlDQWdJSDA3WEc1Y2JpQWdJQ0IwYUdsekxtTnZibTVsWTNRb0tUdGNiaUFnZlZ4dWZWeHVYRzVsZUhCdmNuUWdleUJFWlhacFkyVlBjbWxsYm5SaGRHbHZia052Ym5SeWIyeHpJSDA3WEc0aUxDSnBiWEJ2Y25RZ2V5QlRjR2hOWlhKalVISnZhbVZqZEdsdmJpQjlJR1p5YjIwZ1hDSXVMM053YUcxbGNtTXRjSEp2YW1WamRHbHZiaTVxYzF3aU8xeHVhVzF3YjNKMElDb2dZWE1nVkVoU1JVVWdabkp2YlNCY0luUm9jbVZsWENJN1hHNWNibU5zWVhOeklFeHZZMkYwYVc5dVFtRnpaV1FnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjaWh6WTJWdVpTd2dZMkZ0WlhKaExDQnZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0IwYUdsekxsOXpZMlZ1WlNBOUlITmpaVzVsTzF4dUlDQWdJSFJvYVhNdVgyTmhiV1Z5WVNBOUlHTmhiV1Z5WVR0Y2JpQWdJQ0IwYUdsekxsOXdjbTlxSUQwZ2JtVjNJRk53YUUxbGNtTlFjbTlxWldOMGFXOXVLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlpYWmxiblJJWVc1a2JHVnljeUE5SUh0OU8xeHVJQ0FnSUhSb2FYTXVYMnhoYzNSRGIyOXlaSE1nUFNCdWRXeHNPMXh1SUNBZ0lIUm9hWE11WDJkd2MwMXBia1JwYzNSaGJtTmxJRDBnTUR0Y2JpQWdJQ0IwYUdsekxsOW5jSE5OYVc1QlkyTjFjbUZqZVNBOUlERXdNRHRjYmlBZ0lDQjBhR2x6TGw5dFlYaHBiWFZ0UVdkbElEMGdNRHRjYmlBZ0lDQjBhR2x6TGw5M1lYUmphRkJ2YzJsMGFXOXVTV1FnUFNCdWRXeHNPMXh1SUNBZ0lIUm9hWE11YzJWMFIzQnpUM0IwYVc5dWN5aHZjSFJwYjI1ektUdGNiaUFnSUNCMGFHbHpMbWx1YVhScFlXeFFiM05wZEdsdmJpQTlJRzUxYkd3N1hHNGdJQ0FnZEdocGN5NXBibWwwYVdGc1VHOXphWFJwYjI1QmMwOXlhV2RwYmlBOUlHOXdkR2x2Ym5NdWFXNXBkR2xoYkZCdmMybDBhVzl1UVhOUGNtbG5hVzRnZkh3Z1ptRnNjMlU3WEc0Z0lIMWNibHh1SUNCelpYUlFjbTlxWldOMGFXOXVLSEJ5YjJvcElIdGNiaUFnSUNCMGFHbHpMbDl3Y205cUlEMGdjSEp2YWp0Y2JpQWdmVnh1WEc0Z0lITmxkRWR3YzA5d2RHbHZibk1vYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVaM0J6VFdsdVJHbHpkR0Z1WTJVZ0lUMDlJSFZ1WkdWbWFXNWxaQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NWZaM0J6VFdsdVJHbHpkR0Z1WTJVZ1BTQnZjSFJwYjI1ekxtZHdjMDFwYmtScGMzUmhibU5sTzF4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvYjNCMGFXOXVjeTVuY0hOTmFXNUJZMk4xY21GamVTQWhQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbDluY0hOTmFXNUJZMk4xY21GamVTQTlJRzl3ZEdsdmJuTXVaM0J6VFdsdVFXTmpkWEpoWTNrN1hHNGdJQ0FnZlZ4dUlDQWdJR2xtSUNodmNIUnBiMjV6TG0xaGVHbHRkVzFCWjJVZ0lUMDlJSFZ1WkdWbWFXNWxaQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NWZiV0Y0YVcxMWJVRm5aU0E5SUc5d2RHbHZibk11YldGNGFXMTFiVUZuWlR0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCemRHRnlkRWR3Y3lodFlYaHBiWFZ0UVdkbElEMGdNQ2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbDkzWVhSamFGQnZjMmwwYVc5dVNXUWdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzZGhkR05vVUc5emFYUnBiMjVKWkNBOUlHNWhkbWxuWVhSdmNpNW5aVzlzYjJOaGRHbHZiaTUzWVhSamFGQnZjMmwwYVc5dUtGeHVJQ0FnSUNBZ0lDQW9jRzl6YVhScGIyNHBJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5bmNITlNaV05sYVhabFpDaHdiM05wZEdsdmJpazdYRzRnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0FnSUNobGNuSnZjaWtnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbDlsZG1WdWRFaGhibVJzWlhKelcxd2laM0J6WlhKeWIzSmNJbDBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgyVjJaVzUwU0dGdVpHeGxjbk5iWENKbmNITmxjbkp2Y2x3aVhTaGxjbkp2Y2k1amIyUmxLVHRjYmlBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZV3hsY25Rb1lFZFFVeUJsY25KdmNqb2dZMjlrWlNBa2UyVnljbTl5TG1OdlpHVjlZQ2s3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdJQ0I3WEc0Z0lDQWdJQ0FnSUNBZ1pXNWhZbXhsU0dsbmFFRmpZM1Z5WVdONU9pQjBjblZsTEZ4dUlDQWdJQ0FnSUNBZ0lHMWhlR2x0ZFcxQloyVTZJRzFoZUdsdGRXMUJaMlVnSVQwZ01DQS9JRzFoZUdsdGRXMUJaMlVnT2lCMGFHbHpMbDl0WVhocGJYVnRRV2RsTEZ4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnZlZ4dVhHNGdJSE4wYjNCSGNITW9LU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM2RoZEdOb1VHOXphWFJwYjI1SlpDQWhQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdibUYyYVdkaGRHOXlMbWRsYjJ4dlkyRjBhVzl1TG1Oc1pXRnlWMkYwWTJnb2RHaHBjeTVmZDJGMFkyaFFiM05wZEdsdmJrbGtLVHRjYmlBZ0lDQWdJSFJvYVhNdVgzZGhkR05vVUc5emFYUnBiMjVKWkNBOUlHNTFiR3c3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlR0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQjlYRzVjYmlBZ1ptRnJaVWR3Y3loc2IyNHNJR3hoZEN3Z1pXeGxkaUE5SUc1MWJHd3NJR0ZqWXlBOUlEQXBJSHRjYmlBZ0lDQnBaaUFvWld4bGRpQWhQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1elpYUkZiR1YyWVhScGIyNG9aV3hsZGlrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NWZaM0J6VW1WalpXbDJaV1FvZTF4dUlDQWdJQ0FnWTI5dmNtUnpPaUI3WEc0Z0lDQWdJQ0FnSUd4dmJtZHBkSFZrWlRvZ2JHOXVMRnh1SUNBZ0lDQWdJQ0JzWVhScGRIVmtaVG9nYkdGMExGeHVJQ0FnSUNBZ0lDQmhZMk4xY21GamVUb2dZV05qTEZ4dUlDQWdJQ0FnZlN4Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1WEc0Z0lHeHZia3hoZEZSdlYyOXliR1JEYjI5eVpITW9iRzl1TENCc1lYUXBJSHRjYmlBZ0lDQmpiMjV6ZENCd2NtOXFaV04wWldSUWIzTWdQU0IwYUdsekxsOXdjbTlxTG5CeWIycGxZM1FvYkc5dUxDQnNZWFFwTzF4dUlDQWdJR2xtSUNoMGFHbHpMbWx1YVhScFlXeFFiM05wZEdsdmJrRnpUM0pwWjJsdUtTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXBibWwwYVdGc1VHOXphWFJwYjI0cElIdGNiaUFnSUNBZ0lDQWdjSEp2YW1WamRHVmtVRzl6V3pCZElDMDlJSFJvYVhNdWFXNXBkR2xoYkZCdmMybDBhVzl1V3pCZE8xeHVJQ0FnSUNBZ0lDQndjbTlxWldOMFpXUlFiM05iTVYwZ0xUMGdkR2hwY3k1cGJtbDBhV0ZzVUc5emFYUnBiMjViTVYwN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMGFISnZkeUJjSWxSeWVXbHVaeUIwYnlCMWMyVWdKMmx1YVhScFlXd2djRzl6YVhScGIyNGdZWE1nYjNKcFoybHVKeUJ0YjJSbElIZHBkR2dnYm04Z2FXNXBkR2xoYkNCd2IzTnBkR2x2YmlCa1pYUmxjbTFwYm1Wa1hDSTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJiY0hKdmFtVmpkR1ZrVUc5eld6QmRMQ0F0Y0hKdmFtVmpkR1ZrVUc5eld6RmRYVHRjYmlBZ2ZWeHVYRzRnSUdGa1pDaHZZbXBsWTNRc0lHeHZiaXdnYkdGMExDQmxiR1YyS1NCN1hHNGdJQ0FnZEdocGN5NXpaWFJYYjNKc1pGQnZjMmwwYVc5dUtHOWlhbVZqZEN3Z2JHOXVMQ0JzWVhRc0lHVnNaWFlwTzF4dUlDQWdJSFJvYVhNdVgzTmpaVzVsTG1Ga1pDaHZZbXBsWTNRcE8xeHVJQ0I5WEc1Y2JpQWdjMlYwVjI5eWJHUlFiM05wZEdsdmJpaHZZbXBsWTNRc0lHeHZiaXdnYkdGMExDQmxiR1YyS1NCN1hHNGdJQ0FnWTI5dWMzUWdkMjl5YkdSRGIyOXlaSE1nUFNCMGFHbHpMbXh2Ymt4aGRGUnZWMjl5YkdSRGIyOXlaSE1vYkc5dUxDQnNZWFFwTzF4dUlDQWdJR2xtSUNobGJHVjJJQ0U5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lHOWlhbVZqZEM1d2IzTnBkR2x2Ymk1NUlEMGdaV3hsZGp0Y2JpQWdJQ0I5WEc0Z0lDQWdXMjlpYW1WamRDNXdiM05wZEdsdmJpNTRMQ0J2WW1wbFkzUXVjRzl6YVhScGIyNHVlbDBnUFNCM2IzSnNaRU52YjNKa2N6dGNiaUFnZlZ4dVhHNGdJSE5sZEVWc1pYWmhkR2x2YmlobGJHVjJLU0I3WEc0Z0lDQWdkR2hwY3k1ZlkyRnRaWEpoTG5CdmMybDBhVzl1TG5rZ1BTQmxiR1YyTzF4dUlDQjlYRzVjYmlBZ2IyNG9aWFpsYm5ST1lXMWxMQ0JsZG1WdWRFaGhibVJzWlhJcElIdGNiaUFnSUNCMGFHbHpMbDlsZG1WdWRFaGhibVJzWlhKelcyVjJaVzUwVG1GdFpWMGdQU0JsZG1WdWRFaGhibVJzWlhJN1hHNGdJSDFjYmx4dUlDQnpaWFJYYjNKc1pFOXlhV2RwYmloc2IyNHNJR3hoZENrZ2UxeHVJQ0FnSUhSb2FYTXVhVzVwZEdsaGJGQnZjMmwwYVc5dUlEMGdkR2hwY3k1ZmNISnZhaTV3Y205cVpXTjBLR3h2Yml3Z2JHRjBLVHRjYmlBZ2ZWeHVYRzRnSUY5bmNITlNaV05sYVhabFpDaHdiM05wZEdsdmJpa2dlMXh1SUNBZ0lHeGxkQ0JrYVhOMFRXOTJaV1FnUFNCT2RXMWlaWEl1VFVGWVgxWkJURlZGTzF4dUlDQWdJR2xtSUNod2IzTnBkR2x2Ymk1amIyOXlaSE11WVdOamRYSmhZM2tnUEQwZ2RHaHBjeTVmWjNCelRXbHVRV05qZFhKaFkza3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbDlzWVhOMFEyOXZjbVJ6SUQwOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDJ4aGMzUkRiMjl5WkhNZ1BTQjdYRzRnSUNBZ0lDQWdJQ0FnYkdGMGFYUjFaR1U2SUhCdmMybDBhVzl1TG1OdmIzSmtjeTVzWVhScGRIVmtaU3hjYmlBZ0lDQWdJQ0FnSUNCc2IyNW5hWFIxWkdVNklIQnZjMmwwYVc5dUxtTnZiM0prY3k1c2IyNW5hWFIxWkdVc1hHNGdJQ0FnSUNBZ0lIMDdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQmthWE4wVFc5MlpXUWdQU0IwYUdsekxsOW9ZWFpsY25OcGJtVkVhWE4wS0hSb2FYTXVYMnhoYzNSRGIyOXlaSE1zSUhCdmMybDBhVzl1TG1OdmIzSmtjeWs3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JwWmlBb1pHbHpkRTF2ZG1Wa0lENDlJSFJvYVhNdVgyZHdjMDFwYmtScGMzUmhibU5sS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDJ4aGMzUkRiMjl5WkhNdWJHOXVaMmwwZFdSbElEMGdjRzl6YVhScGIyNHVZMjl2Y21SekxteHZibWRwZEhWa1pUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmJHRnpkRU52YjNKa2N5NXNZWFJwZEhWa1pTQTlJSEJ2YzJsMGFXOXVMbU52YjNKa2N5NXNZWFJwZEhWa1pUdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVwYm1sMGFXRnNVRzl6YVhScGIyNUJjMDl5YVdkcGJpQW1KaUFoZEdocGN5NXBibWwwYVdGc1VHOXphWFJwYjI0cElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuTmxkRmR2Y214a1QzSnBaMmx1S0Z4dUlDQWdJQ0FnSUNBZ0lDQWdjRzl6YVhScGIyNHVZMjl2Y21SekxteHZibWRwZEhWa1pTeGNiaUFnSUNBZ0lDQWdJQ0FnSUhCdmMybDBhVzl1TG1OdmIzSmtjeTVzWVhScGRIVmtaVnh1SUNBZ0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0IwYUdsekxuTmxkRmR2Y214a1VHOXphWFJwYjI0b1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZlkyRnRaWEpoTEZ4dUlDQWdJQ0FnSUNBZ0lIQnZjMmwwYVc5dUxtTnZiM0prY3k1c2IyNW5hWFIxWkdVc1hHNGdJQ0FnSUNBZ0lDQWdjRzl6YVhScGIyNHVZMjl2Y21SekxteGhkR2wwZFdSbFhHNGdJQ0FnSUNBZ0lDazdYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WDJWMlpXNTBTR0Z1Wkd4bGNuTmJYQ0puY0hOMWNHUmhkR1ZjSWwwcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxsOWxkbVZ1ZEVoaGJtUnNaWEp6VzF3aVozQnpkWEJrWVhSbFhDSmRLSEJ2YzJsMGFXOXVMQ0JrYVhOMFRXOTJaV1FwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTmhiR04xYkdGMFpTQm9ZWFpsY25OcGJtVWdaR2x6ZEdGdVkyVWdZbVYwZDJWbGJpQjBkMjhnYkdGMEwyeHZiaUJ3WVdseWN5NWNiaUFnSUNwY2JpQWdJQ29nVkdGclpXNGdabkp2YlNCdmNtbG5hVzVoYkNCQkxVWnlZVzFsSUdOdmJYQnZibVZ1ZEhOY2JpQWdJQ292WEc0Z0lGOW9ZWFpsY25OcGJtVkVhWE4wS0hOeVl5d2daR1Z6ZENrZ2UxeHVJQ0FnSUdOdmJuTjBJR1JzYjI1bmFYUjFaR1VnUFNCVVNGSkZSUzVOWVhSb1ZYUnBiSE11WkdWblZHOVNZV1FvWkdWemRDNXNiMjVuYVhSMVpHVWdMU0J6Y21NdWJHOXVaMmwwZFdSbEtUdGNiaUFnSUNCamIyNXpkQ0JrYkdGMGFYUjFaR1VnUFNCVVNGSkZSUzVOWVhSb1ZYUnBiSE11WkdWblZHOVNZV1FvWkdWemRDNXNZWFJwZEhWa1pTQXRJSE55WXk1c1lYUnBkSFZrWlNrN1hHNWNiaUFnSUNCamIyNXpkQ0JoSUQxY2JpQWdJQ0FnSUUxaGRHZ3VjMmx1S0dSc1lYUnBkSFZrWlNBdklESXBJQ29nVFdGMGFDNXphVzRvWkd4aGRHbDBkV1JsSUM4Z01pa2dLMXh1SUNBZ0lDQWdUV0YwYUM1amIzTW9WRWhTUlVVdVRXRjBhRlYwYVd4ekxtUmxaMVJ2VW1Ga0tITnlZeTVzWVhScGRIVmtaU2twSUNwY2JpQWdJQ0FnSUNBZ1RXRjBhQzVqYjNNb1ZFaFNSVVV1VFdGMGFGVjBhV3h6TG1SbFoxUnZVbUZrS0dSbGMzUXViR0YwYVhSMVpHVXBLU0FxWEc0Z0lDQWdJQ0FnSUNoTllYUm9Mbk5wYmloa2JHOXVaMmwwZFdSbElDOGdNaWtnS2lCTllYUm9Mbk5wYmloa2JHOXVaMmwwZFdSbElDOGdNaWtwTzF4dUlDQWdJR052Ym5OMElHRnVaMnhsSUQwZ01pQXFJRTFoZEdndVlYUmhiaklvVFdGMGFDNXpjWEowS0dFcExDQk5ZWFJvTG5OeGNuUW9NU0F0SUdFcEtUdGNiaUFnSUNCeVpYUjFjbTRnWVc1bmJHVWdLaUEyTXpjeE1EQXdPMXh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0I3SUV4dlkyRjBhVzl1UW1GelpXUWdmVHRjYmlJc0ltTnNZWE56SUZOd2FFMWxjbU5RY205cVpXTjBhVzl1SUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lvS1NCN1hHNGdJQ0FnZEdocGN5NUZRVkpVU0NBOUlEUXdNRGMxTURFMkxqWTRPMXh1SUNBZ0lIUm9hWE11U0VGTVJsOUZRVkpVU0NBOUlESXdNRE0zTlRBNExqTTBPMXh1SUNCOVhHNWNiaUFnY0hKdmFtVmpkQ2hzYjI0c0lHeGhkQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQmJkR2hwY3k1c2IyNVViMU53YUUxbGNtTW9iRzl1S1N3Z2RHaHBjeTVzWVhSVWIxTndhRTFsY21Nb2JHRjBLVjA3WEc0Z0lIMWNibHh1SUNCMWJuQnliMnBsWTNRb2NISnZhbVZqZEdWa0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUZ0MGFHbHpMbk53YUUxbGNtTlViMHh2Ymlod2NtOXFaV04wWldSYk1GMHBMQ0IwYUdsekxuTndhRTFsY21OVWIweGhkQ2h3Y205cVpXTjBaV1JiTVYwcFhUdGNiaUFnZlZ4dVhHNGdJR3h2YmxSdlUzQm9UV1Z5WXloc2IyNHBJSHRjYmlBZ0lDQnlaWFIxY200Z0tHeHZiaUF2SURFNE1Da2dLaUIwYUdsekxraEJURVpmUlVGU1ZFZzdYRzRnSUgxY2JseHVJQ0JzWVhSVWIxTndhRTFsY21Nb2JHRjBLU0I3WEc0Z0lDQWdkbUZ5SUhrZ1BTQk5ZWFJvTG14dlp5aE5ZWFJvTG5SaGJpZ29LRGt3SUNzZ2JHRjBLU0FxSUUxaGRHZ3VVRWtwSUM4Z016WXdLU2tnTHlBb1RXRjBhQzVRU1NBdklERTRNQ2s3WEc0Z0lDQWdjbVYwZFhKdUlDaDVJQ29nZEdocGN5NUlRVXhHWDBWQlVsUklLU0F2SURFNE1DNHdPMXh1SUNCOVhHNWNiaUFnYzNCb1RXVnlZMVJ2VEc5dUtIZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tIZ2dMeUIwYUdsekxraEJURVpmUlVGU1ZFZ3BJQ29nTVRnd0xqQTdYRzRnSUgxY2JseHVJQ0J6Y0doTlpYSmpWRzlNWVhRb2VTa2dlMXh1SUNBZ0lIWmhjaUJzWVhRZ1BTQW9lU0F2SUhSb2FYTXVTRUZNUmw5RlFWSlVTQ2tnS2lBeE9EQXVNRHRjYmlBZ0lDQnNZWFFnUFZ4dUlDQWdJQ0FnS0RFNE1DQXZJRTFoZEdndVVFa3BJQ3BjYmlBZ0lDQWdJQ2d5SUNvZ1RXRjBhQzVoZEdGdUtFMWhkR2d1Wlhod0tDaHNZWFFnS2lCTllYUm9MbEJKS1NBdklERTRNQ2twSUMwZ1RXRjBhQzVRU1NBdklESXBPMXh1SUNBZ0lISmxkSFZ5YmlCc1lYUTdYRzRnSUgxY2JseHVJQ0JuWlhSSlJDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1hDSmxjSE5uT2pNNE5UZGNJanRjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnZXlCVGNHaE5aWEpqVUhKdmFtVmpkR2x2YmlCOU8xeHVJaXdpYVcxd2IzSjBJQ29nWVhNZ1ZFaFNSVVVnWm5KdmJTQmNJblJvY21WbFhDSTdYRzVjYm1Oc1lYTnpJRmRsWW1OaGJWSmxibVJsY21WeUlIdGNiaUFnWTI5dWMzUnlkV04wYjNJb2NtVnVaR1Z5WlhJc0lIWnBaR1Z2Uld4bGJXVnVkQ2tnZTF4dUlDQWdJSFJvYVhNdWNtVnVaR1Z5WlhJZ1BTQnlaVzVrWlhKbGNqdGNiaUFnSUNCMGFHbHpMbkpsYm1SbGNtVnlMbUYxZEc5RGJHVmhjaUE5SUdaaGJITmxPMXh1SUNBZ0lIUm9hWE11YzJObGJtVlhaV0pqWVcwZ1BTQnVaWGNnVkVoU1JVVXVVMk5sYm1Vb0tUdGNiaUFnSUNCc1pYUWdkbWxrWlc4N1hHNGdJQ0FnYVdZZ0tIWnBaR1Z2Uld4bGJXVnVkQ0E5UFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQjJhV1JsYnlBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvWENKMmFXUmxiMXdpS1R0Y2JpQWdJQ0FnSUhacFpHVnZMbk5sZEVGMGRISnBZblYwWlNoY0ltRjFkRzl3YkdGNVhDSXNJSFJ5ZFdVcE8xeHVJQ0FnSUNBZ2RtbGtaVzh1YzJWMFFYUjBjbWxpZFhSbEtGd2ljR3hoZVhOcGJteHBibVZjSWl3Z2RISjFaU2s3WEc0Z0lDQWdJQ0IyYVdSbGJ5NXpkSGxzWlM1a2FYTndiR0Y1SUQwZ1hDSnViMjVsWENJN1hHNGdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbUZ3Y0dWdVpFTm9hV3hrS0hacFpHVnZLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2RtbGtaVzhnUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLSFpwWkdWdlJXeGxiV1Z1ZENrN1hHNGdJQ0FnZlZ4dUlDQWdJSFJvYVhNdVoyVnZiU0E5SUc1bGR5QlVTRkpGUlM1UWJHRnVaVUoxWm1abGNrZGxiMjFsZEhKNUtDazdYRzRnSUNBZ2RHaHBjeTUwWlhoMGRYSmxJRDBnYm1WM0lGUklVa1ZGTGxacFpHVnZWR1Y0ZEhWeVpTaDJhV1JsYnlrN1hHNGdJQ0FnZEdocGN5NXRZWFJsY21saGJDQTlJRzVsZHlCVVNGSkZSUzVOWlhOb1FtRnphV05OWVhSbGNtbGhiQ2g3SUcxaGNEb2dkR2hwY3k1MFpYaDBkWEpsSUgwcE8xeHVJQ0FnSUdOdmJuTjBJRzFsYzJnZ1BTQnVaWGNnVkVoU1JVVXVUV1Z6YUNoMGFHbHpMbWRsYjIwc0lIUm9hWE11YldGMFpYSnBZV3dwTzF4dUlDQWdJSFJvYVhNdWMyTmxibVZYWldKallXMHVZV1JrS0cxbGMyZ3BPMXh1SUNBZ0lIUm9hWE11WTJGdFpYSmhWMlZpWTJGdElEMGdibVYzSUZSSVVrVkZMazl5ZEdodlozSmhjR2hwWTBOaGJXVnlZU2hjYmlBZ0lDQWdJQzB3TGpVc1hHNGdJQ0FnSUNBd0xqVXNYRzRnSUNBZ0lDQXdMalVzWEc0Z0lDQWdJQ0F0TUM0MUxGeHVJQ0FnSUNBZ01DeGNiaUFnSUNBZ0lERXdYRzRnSUNBZ0tUdGNiaUFnSUNCcFppQW9ibUYyYVdkaGRHOXlMbTFsWkdsaFJHVjJhV05sY3lBbUppQnVZWFpwWjJGMGIzSXViV1ZrYVdGRVpYWnBZMlZ6TG1kbGRGVnpaWEpOWldScFlTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXVjM1J5WVdsdWRITWdQU0I3WEc0Z0lDQWdJQ0FnSUhacFpHVnZPaUI3WEc0Z0lDQWdJQ0FnSUNBZ2QybGtkR2c2SURFeU9EQXNYRzRnSUNBZ0lDQWdJQ0FnYUdWcFoyaDBPaUEzTWpBc1hHNGdJQ0FnSUNBZ0lDQWdabUZqYVc1blRXOWtaVG9nWENKbGJuWnBjbTl1YldWdWRGd2lMRnh1SUNBZ0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0FnSUc1aGRtbG5ZWFJ2Y2k1dFpXUnBZVVJsZG1salpYTmNiaUFnSUNBZ0lDQWdMbWRsZEZWelpYSk5aV1JwWVNoamIyNXpkSEpoYVc1MGN5bGNiaUFnSUNBZ0lDQWdMblJvWlc0b0tITjBjbVZoYlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuTnZiR1V1Ykc5bktHQjFjMmx1WnlCMGFHVWdkMlZpWTJGdElITjFZMk5sYzNObWRXeHNlUzR1TG1BcE8xeHVJQ0FnSUNBZ0lDQWdJSFpwWkdWdkxuTnlZMDlpYW1WamRDQTlJSE4wY21WaGJUdGNiaUFnSUNBZ0lDQWdJQ0IyYVdSbGJ5NXdiR0Y1S0NrN1hHNGdJQ0FnSUNBZ0lIMHBYRzRnSUNBZ0lDQWdJQzVqWVhSamFDZ29aU2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVqY21WaGRHVkZjbkp2Y2xCdmNIVndLRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQmNJbGRsWW1OaGJTQkZjbkp2Y2x4Y2JrNWhiV1U2SUZ3aUlDc2daUzV1WVcxbElDc2dYQ0pjWEc1TlpYTnpZV2RsT2lCY0lpQXJJR1V1YldWemMyRm5aVnh1SUNBZ0lDQWdJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lDQWdJQ0I5TENBeE1EQXdLVHRjYmlBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtTnlaV0YwWlVWeWNtOXlVRzl3ZFhBb1hDSnpiM0p5ZVNBdElHMWxaR2xoSUdSbGRtbGpaWE1nUVZCSklHNXZkQ0J6ZFhCd2IzSjBaV1JjSWlrN1hHNGdJQ0FnSUNCOUxDQXhNREF3S1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCMWNHUmhkR1VvS1NCN1hHNGdJQ0FnZEdocGN5NXlaVzVrWlhKbGNpNWpiR1ZoY2lncE8xeHVJQ0FnSUhSb2FYTXVjbVZ1WkdWeVpYSXVjbVZ1WkdWeUtIUm9hWE11YzJObGJtVlhaV0pqWVcwc0lIUm9hWE11WTJGdFpYSmhWMlZpWTJGdEtUdGNiaUFnSUNCMGFHbHpMbkpsYm1SbGNtVnlMbU5zWldGeVJHVndkR2dvS1R0Y2JpQWdmVnh1WEc0Z0lHUnBjM0J2YzJVb0tTQjdYRzRnSUNBZ2RHaHBjeTV0WVhSbGNtbGhiQzVrYVhOd2IzTmxLQ2s3WEc0Z0lDQWdkR2hwY3k1MFpYaDBkWEpsTG1ScGMzQnZjMlVvS1R0Y2JpQWdJQ0IwYUdsekxtZGxiMjB1WkdsemNHOXpaU2dwTzF4dUlDQjlYRzVjYmlBZ1kzSmxZWFJsUlhKeWIzSlFiM0IxY0NodGMyY3BJSHRjYmlBZ0lDQnBaaUFvSVdSdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SQ2VVbGtLRndpWlhKeWIzSXRjRzl3ZFhCY0lpa3BJSHRjYmlBZ0lDQWdJSFpoY2lCbGNuSnZjbEJ2Y0hWd0lEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENoY0ltUnBkbHdpS1R0Y2JpQWdJQ0FnSUdWeWNtOXlVRzl3ZFhBdWFXNXVaWEpJVkUxTUlEMGdiWE5uTzF4dUlDQWdJQ0FnWlhKeWIzSlFiM0IxY0M1elpYUkJkSFJ5YVdKMWRHVW9YQ0pwWkZ3aUxDQmNJbVZ5Y205eUxYQnZjSFZ3WENJcE8xeHVJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzVoY0hCbGJtUkRhR2xzWkNobGNuSnZjbEJ2Y0hWd0tUdGNiaUFnSUNCOVhHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElIc2dWMlZpWTJGdFVtVnVaR1Z5WlhJZ2ZUdGNiaUlzSW0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWDE5WFJVSlFRVU5MWDBWWVZFVlNUa0ZNWDAxUFJGVk1SVjkwYUhKbFpWOWZPeUlzSWk4dklGUm9aU0J0YjJSMWJHVWdZMkZqYUdWY2JuWmhjaUJmWDNkbFluQmhZMnRmYlc5a2RXeGxYMk5oWTJobFgxOGdQU0I3ZlR0Y2JseHVMeThnVkdobElISmxjWFZwY21VZ1puVnVZM1JwYjI1Y2JtWjFibU4wYVc5dUlGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOG9iVzlrZFd4bFNXUXBJSHRjYmx4MEx5OGdRMmhsWTJzZ2FXWWdiVzlrZFd4bElHbHpJR2x1SUdOaFkyaGxYRzVjZEhaaGNpQmpZV05vWldSTmIyUjFiR1VnUFNCZlgzZGxZbkJoWTJ0ZmJXOWtkV3hsWDJOaFkyaGxYMTliYlc5a2RXeGxTV1JkTzF4dVhIUnBaaUFvWTJGamFHVmtUVzlrZFd4bElDRTlQU0IxYm1SbFptbHVaV1FwSUh0Y2JseDBYSFJ5WlhSMWNtNGdZMkZqYUdWa1RXOWtkV3hsTG1WNGNHOXlkSE03WEc1Y2RIMWNibHgwTHk4Z1EzSmxZWFJsSUdFZ2JtVjNJRzF2WkhWc1pTQW9ZVzVrSUhCMWRDQnBkQ0JwYm5SdklIUm9aU0JqWVdOb1pTbGNibHgwZG1GeUlHMXZaSFZzWlNBOUlGOWZkMlZpY0dGamExOXRiMlIxYkdWZlkyRmphR1ZmWDF0dGIyUjFiR1ZKWkYwZ1BTQjdYRzVjZEZ4MEx5OGdibThnYlc5a2RXeGxMbWxrSUc1bFpXUmxaRnh1WEhSY2RDOHZJRzV2SUcxdlpIVnNaUzVzYjJGa1pXUWdibVZsWkdWa1hHNWNkRngwWlhod2IzSjBjem9nZTMxY2JseDBmVHRjYmx4dVhIUXZMeUJGZUdWamRYUmxJSFJvWlNCdGIyUjFiR1VnWm5WdVkzUnBiMjVjYmx4MFgxOTNaV0p3WVdOclgyMXZaSFZzWlhOZlgxdHRiMlIxYkdWSlpGMG9iVzlrZFd4bExDQnRiMlIxYkdVdVpYaHdiM0owY3l3Z1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5azdYRzVjYmx4MEx5OGdVbVYwZFhKdUlIUm9aU0JsZUhCdmNuUnpJRzltSUhSb1pTQnRiMlIxYkdWY2JseDBjbVYwZFhKdUlHMXZaSFZzWlM1bGVIQnZjblJ6TzF4dWZWeHVYRzRpTENJdkx5Qm5aWFJFWldaaGRXeDBSWGh3YjNKMElHWjFibU4wYVc5dUlHWnZjaUJqYjIxd1lYUnBZbWxzYVhSNUlIZHBkR2dnYm05dUxXaGhjbTF2Ym5rZ2JXOWtkV3hsYzF4dVgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXVJRDBnS0cxdlpIVnNaU2tnUFQ0Z2UxeHVYSFIyWVhJZ1oyVjBkR1Z5SUQwZ2JXOWtkV3hsSUNZbUlHMXZaSFZzWlM1ZlgyVnpUVzlrZFd4bElEOWNibHgwWEhRb0tTQTlQaUFvYlc5a2RXeGxXeWRrWldaaGRXeDBKMTBwSURwY2JseDBYSFFvS1NBOVBpQW9iVzlrZFd4bEtUdGNibHgwWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1a0tHZGxkSFJsY2l3Z2V5QmhPaUJuWlhSMFpYSWdmU2s3WEc1Y2RISmxkSFZ5YmlCblpYUjBaWEk3WEc1OU95SXNJaTh2SUdSbFptbHVaU0JuWlhSMFpYSWdablZ1WTNScGIyNXpJR1p2Y2lCb1lYSnRiMjU1SUdWNGNHOXlkSE5jYmw5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dVpDQTlJQ2hsZUhCdmNuUnpMQ0JrWldacGJtbDBhVzl1S1NBOVBpQjdYRzVjZEdadmNpaDJZWElnYTJWNUlHbHVJR1JsWm1sdWFYUnBiMjRwSUh0Y2JseDBYSFJwWmloZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOG9aR1ZtYVc1cGRHbHZiaXdnYTJWNUtTQW1KaUFoWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1dktHVjRjRzl5ZEhNc0lHdGxlU2twSUh0Y2JseDBYSFJjZEU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaGxlSEJ2Y25SekxDQnJaWGtzSUhzZ1pXNTFiV1Z5WVdKc1pUb2dkSEoxWlN3Z1oyVjBPaUJrWldacGJtbDBhVzl1VzJ0bGVWMGdmU2s3WEc1Y2RGeDBmVnh1WEhSOVhHNTlPeUlzSWw5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWJ5QTlJQ2h2WW1vc0lIQnliM0FwSUQwK0lDaFBZbXBsWTNRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1TG1OaGJHd29iMkpxTENCd2NtOXdLU2tpTENJdkx5QmtaV1pwYm1VZ1gxOWxjMDF2WkhWc1pTQnZiaUJsZUhCdmNuUnpYRzVmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG5JZ1BTQW9aWGh3YjNKMGN5a2dQVDRnZTF4dVhIUnBaaWgwZVhCbGIyWWdVM2x0WW05c0lDRTlQU0FuZFc1a1pXWnBibVZrSnlBbUppQlRlVzFpYjJ3dWRHOVRkSEpwYm1kVVlXY3BJSHRjYmx4MFhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnVTNsdFltOXNMblJ2VTNSeWFXNW5WR0ZuTENCN0lIWmhiSFZsT2lBblRXOWtkV3hsSnlCOUtUdGNibHgwZlZ4dVhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnSjE5ZlpYTk5iMlIxYkdVbkxDQjdJSFpoYkhWbE9pQjBjblZsSUgwcE8xeHVmVHNpTENKcGJYQnZjblFnZXlCTWIyTmhkR2x2YmtKaGMyVmtJSDBnWm5KdmJTQmNJaTR2YW5NdmJHOWpZWFJwYjI0dFltRnpaV1F1YW5OY0lqdGNibWx0Y0c5eWRDQjdJRmRsWW1OaGJWSmxibVJsY21WeUlIMGdabkp2YlNCY0lpNHZhbk12ZDJWaVkyRnRMWEpsYm1SbGNtVnlMbXB6WENJN1hHNXBiWEJ2Y25RZ2V5QkVaWFpwWTJWUGNtbGxiblJoZEdsdmJrTnZiblJ5YjJ4eklIMGdabkp2YlNCY0lpNHZhbk12WkdWMmFXTmxMVzl5YVdWdWRHRjBhVzl1TFdOdmJuUnliMnh6TG1welhDSTdYRzVjYm1WNGNHOXlkQ0I3SUV4dlkyRjBhVzl1UW1GelpXUXNJRmRsWW1OaGJWSmxibVJsY21WeUxDQkVaWFpwWTJWUGNtbGxiblJoZEdsdmJrTnZiblJ5YjJ4eklIMDdYRzRpWFN3aWJtRnRaWE1pT2x0ZExDSnpiM1Z5WTJWU2IyOTBJam9pSW4wPSIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9hZnJhbWVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi4vbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZVwiO1xuaW1wb3J0IFwiLi9ncHMtbmV3LWNhbWVyYVwiO1xuaW1wb3J0IFwiLi9ncHMtbmV3LWVudGl0eS1wbGFjZVwiO1xuaW1wb3J0IFwiLi9hcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9sc1wiO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9