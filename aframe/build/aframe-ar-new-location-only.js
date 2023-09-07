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
    if (!this.data.fakeGpsStarted && this.data.simulateLatitude === 0 && this.data.simulateLongitude === 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWZyYW1lLWFyLW5ldy1sb2NhdGlvbi1vbmx5LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7QUNWaUM7QUFDRjs7QUFFL0IscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQSx5QkFBeUIscURBQXdCO0FBQ2pELHdCQUF3Qix3Q0FBVzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNEQUF5QjtBQUM3Qyx1QkFBdUIsK0NBQWtCO0FBQ3pDLHdCQUF3QixvREFBdUIsR0FBRyxtQkFBbUI7QUFDckUscUJBQXFCLHVDQUFVO0FBQy9CO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsNkJBQTZCLEVBQUU7QUFDL0I7QUFDQSxTQUFTO0FBQ1QsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDaEVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFaUM7O0FBRWpDLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcENnQztBQUM0Qzs7QUFFN0UscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFQSx3QkFBd0IscUZBQW9CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsNkRBQTZELEtBQUs7QUFDbEU7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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VyxnQ0FBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQ0FBbUI7QUFDOUI7QUFDQSxrRUFBa0UsaUJBQWlCO0FBQ25GO0FBQ0EsMkRBQTJELGFBQWE7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLElBQUksMEJBQW1CO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBbUIsR0FBRywwQkFBbUI7QUFDekMscUJBQXFCLGdDQUFtQixHQUFHLDBCQUFtQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsOEVBQThFLGdDQUFtQjtBQUNqRywrRUFBK0UsZ0NBQW1CO0FBQ2xHLDJGQUEyRixnQ0FBbUI7Ozs7Ozs7QUFPOUcsQ0FBQzs7QUFFRCxpQkFBaUIsMEJBQW1CO0FBQ3BDLFVBQVU7QUFDVjtBQUNBLENBQUM7QUFDRCwyQ0FBMkMsY0FBYzs7Ozs7Ozs7Ozs7QUNwc0J6RDs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOK0M7QUFDckI7QUFDTTtBQUNZIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbmV3LWxvY2F0aW9uLWJhc2VkL2dwcy1uZXctY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL25ldy1sb2NhdGlvbi1iYXNlZC9ncHMtbmV3LWVudGl0eS1wbGFjZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vdGhyZWUuanMvYnVpbGQvYXItdGhyZWV4LWxvY2F0aW9uLW9ubHkuanMiLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcImFmcmFtZVwiLFwiY29tbW9uanMyXCI6XCJhZnJhbWVcIixcImFtZFwiOlwiYWZyYW1lXCIsXCJyb290XCI6XCJBRlJBTUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYWZyYW1lXCIsIFwidGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQVJqc1wiXSA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJBUmpzXCJdID0gZmFjdG9yeShyb290W1wiQUZSQU1FXCJdLCByb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuICIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiYXJqcy13ZWJjYW0tdGV4dHVyZVwiLCB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNjZW5lID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIHRoaXMudGV4Q2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgtMC41LCAwLjUsIDAuNSwgLTAuNSwgMCwgMTApO1xuICAgIHRoaXMudGV4U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIHRydWUpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwicGxheXNpbmxpbmVcIiwgdHJ1ZSk7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xuICAgIHRoaXMuZ2VvbSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgdGhpcy50ZXh0dXJlID0gbmV3IFRIUkVFLlZpZGVvVGV4dHVyZSh0aGlzLnZpZGVvKTtcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0aGlzLnRleHR1cmUgfSk7XG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgdGhpcy50ZXhTY2VuZS5hZGQobWVzaCk7XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgICAuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKVxuICAgICAgICAudGhlbigoc3RyZWFtKSA9PiB7XG4gICAgICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QgPSBzdHJlYW07XG4gICAgICAgICAgdGhpcy52aWRlby5wbGF5KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgICBgV2ViY2FtIGVycm9yOiAke2V9YFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICBcInNvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZFwiXG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICB0aWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhcigpO1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIucmVuZGVyKHRoaXMudGV4U2NlbmUsIHRoaXMudGV4Q2FtZXJhKTtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyRGVwdGgoKTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0LmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICB0cmFjay5zdG9wKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tYXRlcmlhbC5kaXNwb3NlKCk7XG4gICAgdGhpcy50ZXh0dXJlLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xuICB9LFxufSk7XG4iLCIvKipcbiAqIGFyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXG4gKlxuICogUmVwbGFjZXMgdGhlIHN0YW5kYXJkIGxvb2stY29udHJvbHMgY29tcG9uZW50IHRvIHByb3ZpZGUgbW9iaWxlIGRldmljZVxuICogb3JpZW50YXRpb24gY29udHJvbHMuXG4gKlxuICogQSBsaWdodHdlaWdodCBBLUZyYW1lIHdyYXBwZXIgcm91bmQgdGhlIG1vZGlmaWVkIHRocmVlLmpzXG4gKiBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIHVzZWQgaW4gdGhlIHRocmVlLmpzIGxvY2F0aW9uLWJhc2VkIEFQSS5cbiAqXG4gKiBDcmVhdGVzIHRoZSBUSFJFRSBvYmplY3QgdXNpbmcgdXNpbmcgdGhlIHRocmVlLmpzIGNhbWVyYSwgYW5kIGFsbG93cyB1cGRhdGVcbiAqIG9mIHRoZSBzbW9vdGhpbmcgZmFjdG9yLlxuICovXG5cbmltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImFyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXCIsIHtcbiAgc2NoZW1hOiB7XG4gICAgc21vb3RoaW5nRmFjdG9yOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMSxcbiAgICB9LFxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9vcmllbnRhdGlvbkNvbnRyb2xzID0gbmV3IFRIUkVFeC5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzKFxuICAgICAgdGhpcy5lbC5vYmplY3QzRFxuICAgICk7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fb3JpZW50YXRpb25Db250cm9scy5zbW9vdGhpbmdGYWN0b3IgPSB0aGlzLmRhdGEuc21vb3RoaW5nRmFjdG9yO1xuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9vcmllbnRhdGlvbkNvbnRyb2xzLnVwZGF0ZSgpO1xuICB9LFxufSk7XG4iLCJpbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuaW1wb3J0ICogYXMgVEhSRUV4IGZyb20gXCIuLi8uLi8uLi90aHJlZS5qcy9idWlsZC9hci10aHJlZXgtbG9jYXRpb24tb25seS5qc1wiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtbmV3LWNhbWVyYVwiLCB7XG4gIHNjaGVtYToge1xuICAgIHNpbXVsYXRlTGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVMb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVBbHRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IC1OdW1iZXIuTUFYX1ZBTFVFLFxuICAgIH0sXG4gICAgZ3BzTWluRGlzdGFuY2U6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgcG9zaXRpb25NaW5BY2N1cmFjeToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDEwMCxcbiAgICB9LFxuICAgIGdwc1RpbWVJbnRlcnZhbDoge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBpbml0aWFsUG9zaXRpb25Bc09yaWdpbjoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl90ZXN0Rm9yT3JpZW50YXRpb25Db250cm9scygpO1xuXG4gICAgdGhpcy50aHJlZUxvYyA9IG5ldyBUSFJFRXguTG9jYXRpb25CYXNlZChcbiAgICAgIHRoaXMuZWwuc2NlbmVFbC5vYmplY3QzRCxcbiAgICAgIHRoaXMuZWwub2JqZWN0M0QsXG4gICAgICB7XG4gICAgICAgIGluaXRpYWxQb3NpdGlvbkFzT3JpZ2luOiB0aGlzLmRhdGEuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4sXG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMudGhyZWVMb2Mub24oXCJncHN1cGRhdGVcIiwgKGdwc3BvcykgPT4ge1xuICAgICAgdGhpcy5fY3VycmVudFBvc2l0aW9uID0ge1xuICAgICAgICBsb25naXR1ZGU6IGdwc3Bvcy5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICBsYXRpdHVkZTogZ3BzcG9zLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgIH07XG4gICAgICB0aGlzLl9zZW5kR3BzVXBkYXRlRXZlbnQoZ3BzcG9zLmNvb3Jkcy5sb25naXR1ZGUsIGdwc3Bvcy5jb29yZHMubGF0aXR1ZGUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy50aHJlZUxvYy5vbihcImdwc2Vycm9yXCIsIChjb2RlKSA9PiB7XG4gICAgICBjb25zdCBtc2cgPSBbXG4gICAgICAgIFwiVXNlciBkZW5pZWQgYWNjZXNzIHRvIEdQUy5cIixcbiAgICAgICAgXCJHUFMgc2F0ZWxsaXRlcyBub3QgYXZhaWxhYmxlLlwiLFxuICAgICAgICBcIlRpbWVvdXQgY29tbXVuaWNhdGluZyB3aXRoIEdQUyBzYXRlbGxpdGVzIC0gdHJ5IG1vdmluZyB0byBhIG1vcmUgb3BlbiBhcmVhLlwiLFxuICAgICAgXTtcbiAgICAgIGlmIChjb2RlID49IDEgJiYgY29kZSA8PSAzKSB7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlFcnJvcihtc2dbY29kZSAtIDFdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlFcnJvcihgVW5rbm93biBnZW9sb2NhdGlvbiBlcnJvciBjb2RlICR7Y29kZX0uYCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBVc2UgYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMgb24gbW9iaWxlIG9ubHksIHdpdGggc3RhbmRhcmRcbiAgICAvLyBsb29rLWNvbnRyb2xzIGRpc2FibGVkICh0aGlzIGludGVyZmVyZXMgd2l0aCB0aGUgcmVhZGluZ3MgZnJvbSB0aGVcbiAgICAvLyBzZW5zb3JzKS4gT24gZGVza3RvcCwgdXNlIHN0YW5kYXJkIGxvb2stY29udHJvbHMgaW5zdGVhZC5cblxuICAgIC8vIGNvbnN0IG1vYmlsZSA9IHRoaXMuX2lzTW9iaWxlKCk7XG4gICAgLy8gdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJsb29rLWNvbnRyb2xzLWVuYWJsZWRcIiwgIW1vYmlsZSk7XG4gICAgLy8gaWYgKG1vYmlsZSkge1xuICAgIC8vICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9sc1wiLCB0cnVlKTtcbiAgICAvLyB9XG5cbiAgICAvLyBmcm9tIG9yaWdpbmFsIGdwcy1jYW1lcmEgY29tcG9uZW50XG4gICAgLy8gaWYgU2FmYXJpXG4gICAgaWYgKCEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcL1tcXGQuXSsuKlNhZmFyaS8pKSB7XG4gICAgICB0aGlzLl9zZXR1cFNhZmFyaU9yaWVudGF0aW9uUGVybWlzc2lvbnMoKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsLnNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcihcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIiwgKGUpID0+IHtcbiAgICAgIGNvbnN0IGVudGl0eVBsYWNlID0gZS5kZXRhaWwuY29tcG9uZW50LmNvbXBvbmVudHNbXCJncHMtbmV3LWVudGl0eS1wbGFjZVwiXTtcbiAgICAgIGlmICh0aGlzLl9jdXJyZW50UG9zaXRpb24pIHtcbiAgICAgICAgZW50aXR5UGxhY2Uuc2V0RGlzdGFuY2VGcm9tKHRoaXMuX2N1cnJlbnRQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAob2xkRGF0YSkge1xuICAgIHRoaXMudGhyZWVMb2Muc2V0R3BzT3B0aW9ucyh7XG4gICAgICBncHNNaW5BY2N1cmFjeTogdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3ksXG4gICAgICBncHNNaW5EaXN0YW5jZTogdGhpcy5kYXRhLmdwc01pbkRpc3RhbmNlLFxuICAgICAgbWF4aW11bUFnZTogdGhpcy5kYXRhLmdwc1RpbWVJbnRlcnZhbCxcbiAgICB9KTtcbiAgICBpZiAoXG4gICAgICAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgfHwgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSAmJlxuICAgICAgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9IG9sZERhdGEuc2ltdWxhdGVMYXRpdHVkZSB8fFxuICAgICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT0gb2xkRGF0YS5zaW11bGF0ZUxvbmdpdHVkZSlcbiAgICApIHtcbiAgICAgIHRoaXMudGhyZWVMb2Muc3RvcEdwcygpO1xuICAgICAgdGhpcy50aHJlZUxvYy5mYWtlR3BzKFxuICAgICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUsXG4gICAgICAgIHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlXG4gICAgICApO1xuICAgICAgdGhpcy5kYXRhLmZha2VHcHNTdGFydGVkID0gdHJ1ZVxuICAgIH1cbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgPiAtTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgdGhpcy50aHJlZUxvYy5zZXRFbGV2YXRpb24odGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgKyAxLjYpO1xuICAgIH1cbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmRhdGEuZmFrZUdwc1N0YXJ0ZWQgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgPT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlID09PSAwKSB7XG4gICAgICB0aGlzLnRocmVlTG9jLnN0YXJ0R3BzKCk7XG4gICAgfVxuICB9LFxuXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50aHJlZUxvYy5zdG9wR3BzKCk7XG4gIH0sXG5cbiAgbGF0TG9uVG9Xb3JsZDogZnVuY3Rpb24gKGxhdCwgbG9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhyZWVMb2MubG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCk7XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGhyZWVMb2MuaW5pdGlhbFBvc2l0aW9uO1xuICB9LFxuXG4gIF9zZW5kR3BzVXBkYXRlRXZlbnQ6IGZ1bmN0aW9uIChsb24sIGxhdCkge1xuICAgIHRoaXMuZWwuZW1pdChcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsIHtcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIGxvbmdpdHVkZTogbG9uLFxuICAgICAgICBsYXRpdHVkZTogbGF0LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSxcblxuICBfdGVzdEZvck9yaWVudGF0aW9uQ29udHJvbHM6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtc2cgPVxuICAgICAgXCJXQVJOSU5HIC0gTm8gb3JpZW50YXRpb24gY29udHJvbHMgY29tcG9uZW50LCBhcHAgd2lsbCBub3QgcmVzcG9uZCB0byBkZXZpY2Ugcm90YXRpb24uXCI7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuZWwuY29tcG9uZW50c1tcImFyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXCJdICYmXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXVxuICAgICkge1xuICAgICAgdGhpcy5fZGlzcGxheUVycm9yKG1zZyk7XG4gICAgfVxuICB9LFxuXG4gIF9kaXNwbGF5RXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGNvbnN0IGFyanMgPSB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl07XG4gICAgaWYgKGFyanMpIHtcbiAgICAgIGFyanMuX2Rpc3BsYXlFcnJvclBvcHVwKGVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoZXJyb3IpO1xuICAgIH1cbiAgfSxcblxuICAvLyBmcm9tIG9yaWdpbmFsIGdwcy1jYW1lcmEgY29tcG9uZW50XG4gIF9zZXR1cFNhZmFyaU9yaWVudGF0aW9uUGVybWlzc2lvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBpT1MgMTMrXG4gICAgaWYgKFxuICAgICAgdHlwZW9mIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50Py5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiXG4gICAgKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0aW5nIGRldmljZSBvcmllbnRhdGlvbiBwZXJtaXNzaW9ucy4uLlwiKTtcbiAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XG4gICAgICB9O1xuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcInRvdWNoZW5kXCIsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBoYW5kbGVyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuXG4gICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICBcIkFmdGVyIGNhbWVyYSBwZXJtaXNzaW9uIHByb21wdCwgcGxlYXNlIHRhcCB0aGUgc2NyZWVuIHRvIGFjdGl2YXRlIGdlb2xvY2F0aW9uLlwiXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgIFwiUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuXCJcbiAgICAgICAgKTtcbiAgICAgIH0sIDc1MCk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJkZXZpY2VvcmllbnRhdGlvblwiLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9LFxuICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgX2lzTW9iaWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFxuICAgICAgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KFxuICAgICAgICBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgICApXG4gICAgKSB7XG4gICAgICAvLyB0cnVlIGZvciBtb2JpbGUgZGV2aWNlXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxufSk7XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1uZXctZW50aXR5LXBsYWNlXCIsIHtcbiAgc2NoZW1hOiB7XG4gICAgbG9uZ2l0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIGxhdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2dwcy1uZXctY2FtZXJhXVwiKTtcbiAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLW5ldy1jYW1lcmFcIl0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJncHMtbmV3LWNhbWVyYSBub3QgaW5pdGlhbGlzZWRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLW5ldy1jYW1lcmFcIl07XG5cbiAgICBjYW1lcmEuYWRkRXZlbnRMaXN0ZW5lcihcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsIChlKSA9PiB7XG4gICAgICB0aGlzLmRpc3RhbmNlID0gdGhpcy5faGF2ZXJzaW5lRGlzdChlLmRldGFpbC5wb3NpdGlvbiwgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWwuc2NlbmVFbC5lbWl0KFwiZ3BzLWVudGl0eS1wbGFjZS1hZGRlZFwiLCB7XG4gICAgICBjb21wb25lbnQ6IHRoaXMuZWwsXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHJvakNvb3JkcyA9IHRoaXMuX2NhbWVyYUdwcy50aHJlZUxvYy5sb25MYXRUb1dvcmxkQ29vcmRzKFxuICAgICAgdGhpcy5kYXRhLmxvbmdpdHVkZSxcbiAgICAgIHRoaXMuZGF0YS5sYXRpdHVkZVxuICAgICk7XG4gICAgdGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbi5zZXQoXG4gICAgICBwcm9qQ29vcmRzWzBdLFxuICAgICAgdGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbi55LFxuICAgICAgcHJvakNvb3Jkc1sxXVxuICAgICk7XG4gIH0sXG5cbiAgc2V0RGlzdGFuY2VGcm9tOiBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICB0aGlzLmRpc3RhbmNlID0gdGhpcy5faGF2ZXJzaW5lRGlzdChwb3NpdGlvbiwgdGhpcy5kYXRhKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGhhdmVyc2luZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBsYXQvbG9uIHBhaXJzLlxuICAgKlxuICAgKiBUYWtlbiBmcm9tIGdwcy1jYW1lcmFcbiAgICovXG4gIF9oYXZlcnNpbmVEaXN0OiBmdW5jdGlvbiAoc3JjLCBkZXN0KSB7XG4gICAgY29uc3QgZGxvbmdpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgIGNvbnN0IGRsYXRpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgIGNvbnN0IGEgPVxuICAgICAgTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgKiBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSArXG4gICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKlxuICAgICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSkpICpcbiAgICAgICAgKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XG4gICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gIH0sXG59KTtcbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcInRocmVlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlRIUkVFeFwiXSA9IGZhY3RvcnkocmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJUSFJFRXhcIl0gPSBmYWN0b3J5KHJvb3RbXCJUSFJFRVwiXSk7XG59KSh0aGlzLCAoX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fKSA9PiB7XG5yZXR1cm4gLyoqKioqKi8gKCgpID0+IHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHRcInVzZSBzdHJpY3RcIjtcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19tb2R1bGVzX18gPSAoe1xuXG4vKioqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2RldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKiovICgoX191bnVzZWRfd2VicGFja19tb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pID0+IHtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgRGV2aWNlT3JpZW50YXRpb25Db250cm9sczogKCkgPT4gKC8qIGJpbmRpbmcgKi8gRGV2aWNlT3JpZW50YXRpb25Db250cm9scylcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISB0aHJlZSAqLyBcInRocmVlXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19fZGVmYXVsdCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fLm4odGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyk7XG4vLyBNb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSB0aHJlZS5qc1xuLy8gd2lsbCB1c2UgdGhlIGRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUgZXZlbnQgaWYgYXZhaWxhYmxlXG5cblxuXG5jb25zdCBfemVlID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uVmVjdG9yMygwLCAwLCAxKTtcbmNvbnN0IF9ldWxlciA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLkV1bGVyKCk7XG5jb25zdCBfcTAgPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5RdWF0ZXJuaW9uKCk7XG5jb25zdCBfcTEgPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5RdWF0ZXJuaW9uKC1NYXRoLnNxcnQoMC41KSwgMCwgMCwgTWF0aC5zcXJ0KDAuNSkpOyAvLyAtIFBJLzIgYXJvdW5kIHRoZSB4LWF4aXNcblxuY29uc3QgX2NoYW5nZUV2ZW50ID0geyB0eXBlOiBcImNoYW5nZVwiIH07XG5cbmNsYXNzIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZXh0ZW5kcyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLkV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKG9iamVjdCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAod2luZG93LmlzU2VjdXJlQ29udGV4dCA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIFwiVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9sczogRGV2aWNlT3JpZW50YXRpb25FdmVudCBpcyBvbmx5IGF2YWlsYWJsZSBpbiBzZWN1cmUgY29udGV4dHMgKGh0dHBzKVwiXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHNjb3BlID0gdGhpcztcblxuICAgIGNvbnN0IEVQUyA9IDAuMDAwMDAxO1xuICAgIGNvbnN0IGxhc3RRdWF0ZXJuaW9uID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uUXVhdGVybmlvbigpO1xuXG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgdGhpcy5vYmplY3Qucm90YXRpb24ucmVvcmRlcihcIllYWlwiKTtcblxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgICB0aGlzLmRldmljZU9yaWVudGF0aW9uID0ge307XG4gICAgdGhpcy5zY3JlZW5PcmllbnRhdGlvbiA9IDA7XG5cbiAgICB0aGlzLmFscGhhT2Zmc2V0ID0gMDsgLy8gcmFkaWFuc1xuXG4gICAgdGhpcy5UV09fUEkgPSAyICogTWF0aC5QSTtcbiAgICB0aGlzLkhBTEZfUEkgPSAwLjUgKiBNYXRoLlBJO1xuICAgIHRoaXMub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUgPVxuICAgICAgXCJvbmRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIiBpbiB3aW5kb3dcbiAgICAgICAgPyBcImRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIlxuICAgICAgICA6IFwiZGV2aWNlb3JpZW50YXRpb25cIjtcblxuICAgIHRoaXMuc21vb3RoaW5nRmFjdG9yID0gMTtcblxuICAgIGNvbnN0IG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgc2NvcGUuZGV2aWNlT3JpZW50YXRpb24gPSBldmVudDtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2NvcGUuc2NyZWVuT3JpZW50YXRpb24gPSB3aW5kb3cub3JpZW50YXRpb24gfHwgMDtcbiAgICB9O1xuXG4gICAgLy8gVGhlIGFuZ2xlcyBhbHBoYSwgYmV0YSBhbmQgZ2FtbWEgZm9ybSBhIHNldCBvZiBpbnRyaW5zaWMgVGFpdC1CcnlhbiBhbmdsZXMgb2YgdHlwZSBaLVgnLVknJ1xuXG4gICAgY29uc3Qgc2V0T2JqZWN0UXVhdGVybmlvbiA9IGZ1bmN0aW9uIChcbiAgICAgIHF1YXRlcm5pb24sXG4gICAgICBhbHBoYSxcbiAgICAgIGJldGEsXG4gICAgICBnYW1tYSxcbiAgICAgIG9yaWVudFxuICAgICkge1xuICAgICAgX2V1bGVyLnNldChiZXRhLCBhbHBoYSwgLWdhbW1hLCBcIllYWlwiKTsgLy8gJ1pYWScgZm9yIHRoZSBkZXZpY2UsIGJ1dCAnWVhaJyBmb3IgdXNcblxuICAgICAgcXVhdGVybmlvbi5zZXRGcm9tRXVsZXIoX2V1bGVyKTsgLy8gb3JpZW50IHRoZSBkZXZpY2VcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShfcTEpOyAvLyBjYW1lcmEgbG9va3Mgb3V0IHRoZSBiYWNrIG9mIHRoZSBkZXZpY2UsIG5vdCB0aGUgdG9wXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkoX3EwLnNldEZyb21BeGlzQW5nbGUoX3plZSwgLW9yaWVudCkpOyAvLyBhZGp1c3QgZm9yIHNjcmVlbiBvcmllbnRhdGlvblxuICAgIH07XG5cbiAgICB0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQoKTsgLy8gcnVuIG9uY2Ugb24gbG9hZFxuXG4gICAgICAvLyBpT1MgMTMrXG5cbiAgICAgIGlmIChcbiAgICAgICAgd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB0eXBlb2Ygd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIlxuICAgICAgKSB7XG4gICAgICAgIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKClcbiAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJncmFudGVkXCIpIHtcbiAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgICAgICAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBzY29wZS5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwiVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9sczogVW5hYmxlIHRvIHVzZSBEZXZpY2VPcmllbnRhdGlvbiBBUEk6XCIsXG4gICAgICAgICAgICAgIGVycm9yXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICApO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBzY29wZS5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcbiAgICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgc2NvcGUuZW5hYmxlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICBzY29wZS5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcbiAgICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICApO1xuXG4gICAgICBzY29wZS5lbmFibGVkID0gZmFsc2U7XG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGRldmljZSA9IHNjb3BlLmRldmljZU9yaWVudGF0aW9uO1xuXG4gICAgICBpZiAoZGV2aWNlKSB7XG4gICAgICAgIGxldCBhbHBoYSA9IGRldmljZS5hbHBoYVxuICAgICAgICAgID8gdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5NYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmFscGhhKSArIHNjb3BlLmFscGhhT2Zmc2V0XG4gICAgICAgICAgOiAwOyAvLyBaXG5cbiAgICAgICAgbGV0IGJldGEgPSBkZXZpY2UuYmV0YSA/IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWF0aFV0aWxzLmRlZ1RvUmFkKGRldmljZS5iZXRhKSA6IDA7IC8vIFgnXG5cbiAgICAgICAgbGV0IGdhbW1hID0gZGV2aWNlLmdhbW1hID8gdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5NYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmdhbW1hKSA6IDA7IC8vIFknJ1xuXG4gICAgICAgIGNvbnN0IG9yaWVudCA9IHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uXG4gICAgICAgICAgPyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk1hdGhVdGlscy5kZWdUb1JhZChzY29wZS5zY3JlZW5PcmllbnRhdGlvbilcbiAgICAgICAgICA6IDA7IC8vIE9cblxuICAgICAgICBpZiAodGhpcy5zbW9vdGhpbmdGYWN0b3IgPCAxKSB7XG4gICAgICAgICAgaWYgKHRoaXMubGFzdE9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gdGhpcy5zbW9vdGhpbmdGYWN0b3I7XG4gICAgICAgICAgICBhbHBoYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgICAgIGFscGhhLFxuICAgICAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5hbHBoYSxcbiAgICAgICAgICAgICAga1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJldGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgICAgICBiZXRhICsgTWF0aC5QSSxcbiAgICAgICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uYmV0YSxcbiAgICAgICAgICAgICAga1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGdhbW1hID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICAgICAgZ2FtbWEgKyB0aGlzLkhBTEZfUEksXG4gICAgICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmdhbW1hLFxuICAgICAgICAgICAgICBrLFxuICAgICAgICAgICAgICBNYXRoLlBJXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXRhICs9IE1hdGguUEk7XG4gICAgICAgICAgICBnYW1tYSArPSB0aGlzLkhBTEZfUEk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24gPSB7XG4gICAgICAgICAgICBhbHBoYTogYWxwaGEsXG4gICAgICAgICAgICBiZXRhOiBiZXRhLFxuICAgICAgICAgICAgZ2FtbWE6IGdhbW1hLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBzZXRPYmplY3RRdWF0ZXJuaW9uKFxuICAgICAgICAgIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uLFxuICAgICAgICAgIGFscGhhLFxuICAgICAgICAgIHRoaXMuc21vb3RoaW5nRmFjdG9yIDwgMSA/IGJldGEgLSBNYXRoLlBJIDogYmV0YSxcbiAgICAgICAgICB0aGlzLnNtb290aGluZ0ZhY3RvciA8IDEgPyBnYW1tYSAtIHRoaXMuSEFMRl9QSSA6IGdhbW1hLFxuICAgICAgICAgIG9yaWVudFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICg4ICogKDEgLSBsYXN0UXVhdGVybmlvbi5kb3Qoc2NvcGUub2JqZWN0LnF1YXRlcm5pb24pKSA+IEVQUykge1xuICAgICAgICAgIGxhc3RRdWF0ZXJuaW9uLmNvcHkoc2NvcGUub2JqZWN0LnF1YXRlcm5pb24pO1xuICAgICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoX2NoYW5nZUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBOVyBBZGRlZFxuICAgIHRoaXMuX29yZGVyQW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgICAgaWYgKFxuICAgICAgICAoYiA+IGEgJiYgTWF0aC5hYnMoYiAtIGEpIDwgcmFuZ2UgLyAyKSB8fFxuICAgICAgICAoYSA+IGIgJiYgTWF0aC5hYnMoYiAtIGEpID4gcmFuZ2UgLyAyKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB7IGxlZnQ6IGEsIHJpZ2h0OiBiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyBsZWZ0OiBiLCByaWdodDogYSB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBOVyBBZGRlZFxuICAgIHRoaXMuX2dldFNtb290aGVkQW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgaywgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgICAgY29uc3QgYW5nbGVzID0gdGhpcy5fb3JkZXJBbmdsZShhLCBiLCByYW5nZSk7XG4gICAgICBjb25zdCBhbmdsZXNoaWZ0ID0gYW5nbGVzLmxlZnQ7XG4gICAgICBjb25zdCBvcmlnQW5nbGVzUmlnaHQgPSBhbmdsZXMucmlnaHQ7XG4gICAgICBhbmdsZXMubGVmdCA9IDA7XG4gICAgICBhbmdsZXMucmlnaHQgLT0gYW5nbGVzaGlmdDtcbiAgICAgIGlmIChhbmdsZXMucmlnaHQgPCAwKSBhbmdsZXMucmlnaHQgKz0gcmFuZ2U7XG4gICAgICBsZXQgbmV3YW5nbGUgPVxuICAgICAgICBvcmlnQW5nbGVzUmlnaHQgPT0gYlxuICAgICAgICAgID8gKDEgLSBrKSAqIGFuZ2xlcy5yaWdodCArIGsgKiBhbmdsZXMubGVmdFxuICAgICAgICAgIDogayAqIGFuZ2xlcy5yaWdodCArICgxIC0gaykgKiBhbmdsZXMubGVmdDtcbiAgICAgIG5ld2FuZ2xlICs9IGFuZ2xlc2hpZnQ7XG4gICAgICBpZiAobmV3YW5nbGUgPj0gcmFuZ2UpIG5ld2FuZ2xlIC09IHJhbmdlO1xuICAgICAgcmV0dXJuIG5ld2FuZ2xlO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZS5kaXNjb25uZWN0KCk7XG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCgpO1xuICB9XG59XG5cblxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2xvY2F0aW9uLWJhc2VkLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2xvY2F0aW9uLWJhc2VkLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKi8gKChfX3VudXNlZF93ZWJwYWNrX21vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykgPT4ge1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBMb2NhdGlvbkJhc2VkOiAoKSA9PiAoLyogYmluZGluZyAqLyBMb2NhdGlvbkJhc2VkKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX3NwaG1lcmNfcHJvamVjdGlvbl9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9zcGhtZXJjLXByb2plY3Rpb24uanMgKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9zcGhtZXJjLXByb2plY3Rpb24uanNcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIHRocmVlICovIFwidGhyZWVcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX19kZWZhdWx0ID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18ubih0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fKTtcblxuXG5cbmNsYXNzIExvY2F0aW9uQmFzZWQge1xuICBjb25zdHJ1Y3RvcihzY2VuZSwgY2FtZXJhLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcbiAgICB0aGlzLl9wcm9qID0gbmV3IF9zcGhtZXJjX3Byb2plY3Rpb25fanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5TcGhNZXJjUHJvamVjdGlvbigpO1xuICAgIHRoaXMuX2V2ZW50SGFuZGxlcnMgPSB7fTtcbiAgICB0aGlzLl9sYXN0Q29vcmRzID0gbnVsbDtcbiAgICB0aGlzLl9ncHNNaW5EaXN0YW5jZSA9IDA7XG4gICAgdGhpcy5fZ3BzTWluQWNjdXJhY3kgPSAxMDA7XG4gICAgdGhpcy5fbWF4aW11bUFnZSA9IDA7XG4gICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcbiAgICB0aGlzLnNldEdwc09wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSBudWxsO1xuICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4gPSBvcHRpb25zLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luIHx8IGZhbHNlO1xuICB9XG5cbiAgc2V0UHJvamVjdGlvbihwcm9qKSB7XG4gICAgdGhpcy5fcHJvaiA9IHByb2o7XG4gIH1cblxuICBzZXRHcHNPcHRpb25zKG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChvcHRpb25zLmdwc01pbkRpc3RhbmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2dwc01pbkRpc3RhbmNlID0gb3B0aW9ucy5ncHNNaW5EaXN0YW5jZTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuZ3BzTWluQWNjdXJhY3kgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fZ3BzTWluQWNjdXJhY3kgPSBvcHRpb25zLmdwc01pbkFjY3VyYWN5O1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5tYXhpbXVtQWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX21heGltdW1BZ2UgPSBvcHRpb25zLm1heGltdW1BZ2U7XG4gICAgfVxuICB9XG5cbiAgc3RhcnRHcHMobWF4aW11bUFnZSA9IDApIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkID09PSBudWxsKSB7XG4gICAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24ud2F0Y2hQb3NpdGlvbihcbiAgICAgICAgKHBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZ3BzUmVjZWl2ZWQocG9zaXRpb24pO1xuICAgICAgICB9LFxuICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc2Vycm9yXCJdKSB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzZXJyb3JcIl0oZXJyb3IuY29kZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KGBHUFMgZXJyb3I6IGNvZGUgJHtlcnJvci5jb2RlfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcbiAgICAgICAgICBtYXhpbXVtQWdlOiBtYXhpbXVtQWdlICE9IDAgPyBtYXhpbXVtQWdlIDogdGhpcy5fbWF4aW11bUFnZSxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdG9wR3BzKCkge1xuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQgIT09IG51bGwpIHtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMuX3dhdGNoUG9zaXRpb25JZCk7XG4gICAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZha2VHcHMobG9uLCBsYXQsIGVsZXYgPSBudWxsLCBhY2MgPSAwKSB7XG4gICAgaWYgKGVsZXYgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0RWxldmF0aW9uKGVsZXYpO1xuICAgIH1cblxuICAgIHRoaXMuX2dwc1JlY2VpdmVkKHtcbiAgICAgIGNvb3Jkczoge1xuICAgICAgICBsb25naXR1ZGU6IGxvbixcbiAgICAgICAgbGF0aXR1ZGU6IGxhdCxcbiAgICAgICAgYWNjdXJhY3k6IGFjYyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBsb25MYXRUb1dvcmxkQ29vcmRzKGxvbiwgbGF0KSB7XG4gICAgY29uc3QgcHJvamVjdGVkUG9zID0gdGhpcy5fcHJvai5wcm9qZWN0KGxvbiwgbGF0KTtcbiAgICBpZiAodGhpcy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbikge1xuICAgICAgaWYgKHRoaXMuaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgIHByb2plY3RlZFBvc1swXSAtPSB0aGlzLmluaXRpYWxQb3NpdGlvblswXTtcbiAgICAgICAgcHJvamVjdGVkUG9zWzFdIC09IHRoaXMuaW5pdGlhbFBvc2l0aW9uWzFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgXCJUcnlpbmcgdG8gdXNlICdpbml0aWFsIHBvc2l0aW9uIGFzIG9yaWdpbicgbW9kZSB3aXRoIG5vIGluaXRpYWwgcG9zaXRpb24gZGV0ZXJtaW5lZFwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW3Byb2plY3RlZFBvc1swXSwgLXByb2plY3RlZFBvc1sxXV07XG4gIH1cblxuICBhZGQob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xuICAgIHRoaXMuc2V0V29ybGRQb3NpdGlvbihvYmplY3QsIGxvbiwgbGF0LCBlbGV2KTtcbiAgICB0aGlzLl9zY2VuZS5hZGQob2JqZWN0KTtcbiAgfVxuXG4gIHNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xuICAgIGNvbnN0IHdvcmxkQ29vcmRzID0gdGhpcy5sb25MYXRUb1dvcmxkQ29vcmRzKGxvbiwgbGF0KTtcbiAgICBpZiAoZWxldiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvYmplY3QucG9zaXRpb24ueSA9IGVsZXY7XG4gICAgfVxuICAgIFtvYmplY3QucG9zaXRpb24ueCwgb2JqZWN0LnBvc2l0aW9uLnpdID0gd29ybGRDb29yZHM7XG4gIH1cblxuICBzZXRFbGV2YXRpb24oZWxldikge1xuICAgIHRoaXMuX2NhbWVyYS5wb3NpdGlvbi55ID0gZWxldjtcbiAgfVxuXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tldmVudE5hbWVdID0gZXZlbnRIYW5kbGVyO1xuICB9XG5cbiAgc2V0V29ybGRPcmlnaW4obG9uLCBsYXQpIHtcbiAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA9IHRoaXMuX3Byb2oucHJvamVjdChsb24sIGxhdCk7XG4gIH1cblxuICBfZ3BzUmVjZWl2ZWQocG9zaXRpb24pIHtcbiAgICBsZXQgZGlzdE1vdmVkID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICBpZiAocG9zaXRpb24uY29vcmRzLmFjY3VyYWN5IDw9IHRoaXMuX2dwc01pbkFjY3VyYWN5KSB7XG4gICAgICBpZiAodGhpcy5fbGFzdENvb3JkcyA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9sYXN0Q29vcmRzID0ge1xuICAgICAgICAgIGxhdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgbG9uZ2l0dWRlOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzdE1vdmVkID0gdGhpcy5faGF2ZXJzaW5lRGlzdCh0aGlzLl9sYXN0Q29vcmRzLCBwb3NpdGlvbi5jb29yZHMpO1xuICAgICAgfVxuICAgICAgaWYgKGRpc3RNb3ZlZCA+PSB0aGlzLl9ncHNNaW5EaXN0YW5jZSkge1xuICAgICAgICB0aGlzLl9sYXN0Q29vcmRzLmxvbmdpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMubGF0aXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4gJiYgIXRoaXMuaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgICAgdGhpcy5zZXRXb3JsZE9yaWdpbihcbiAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRXb3JsZFBvc2l0aW9uKFxuICAgICAgICAgIHRoaXMuX2NhbWVyYSxcbiAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZVxuICAgICAgICApO1xuXG4gICAgICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzdXBkYXRlXCJdKSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc3VwZGF0ZVwiXShwb3NpdGlvbiwgZGlzdE1vdmVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgaGF2ZXJzaW5lIGRpc3RhbmNlIGJldHdlZW4gdHdvIGxhdC9sb24gcGFpcnMuXG4gICAqXG4gICAqIFRha2VuIGZyb20gb3JpZ2luYWwgQS1GcmFtZSBjb21wb25lbnRzXG4gICAqL1xuICBfaGF2ZXJzaW5lRGlzdChzcmMsIGRlc3QpIHtcbiAgICBjb25zdCBkbG9uZ2l0dWRlID0gdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXy5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sb25naXR1ZGUgLSBzcmMubG9uZ2l0dWRlKTtcbiAgICBjb25zdCBkbGF0aXR1ZGUgPSB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgIGNvbnN0IGEgPVxuICAgICAgTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgKiBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSArXG4gICAgICBNYXRoLmNvcyh0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fLk1hdGhVdGlscy5kZWdUb1JhZChzcmMubGF0aXR1ZGUpKSAqXG4gICAgICAgIE1hdGguY29zKHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18uTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMSAtIGEpKTtcbiAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICB9XG59XG5cblxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3NwaG1lcmMtcHJvamVjdGlvbi5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvc3BobWVyYy1wcm9qZWN0aW9uLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKiovICgoX191bnVzZWRfd2VicGFja19tb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pID0+IHtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgU3BoTWVyY1Byb2plY3Rpb246ICgpID0+ICgvKiBiaW5kaW5nICovIFNwaE1lcmNQcm9qZWN0aW9uKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG5jbGFzcyBTcGhNZXJjUHJvamVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuRUFSVEggPSA0MDA3NTAxNi42ODtcbiAgICB0aGlzLkhBTEZfRUFSVEggPSAyMDAzNzUwOC4zNDtcbiAgfVxuXG4gIHByb2plY3QobG9uLCBsYXQpIHtcbiAgICByZXR1cm4gW3RoaXMubG9uVG9TcGhNZXJjKGxvbiksIHRoaXMubGF0VG9TcGhNZXJjKGxhdCldO1xuICB9XG5cbiAgdW5wcm9qZWN0KHByb2plY3RlZCkge1xuICAgIHJldHVybiBbdGhpcy5zcGhNZXJjVG9Mb24ocHJvamVjdGVkWzBdKSwgdGhpcy5zcGhNZXJjVG9MYXQocHJvamVjdGVkWzFdKV07XG4gIH1cblxuICBsb25Ub1NwaE1lcmMobG9uKSB7XG4gICAgcmV0dXJuIChsb24gLyAxODApICogdGhpcy5IQUxGX0VBUlRIO1xuICB9XG5cbiAgbGF0VG9TcGhNZXJjKGxhdCkge1xuICAgIHZhciB5ID0gTWF0aC5sb2coTWF0aC50YW4oKCg5MCArIGxhdCkgKiBNYXRoLlBJKSAvIDM2MCkpIC8gKE1hdGguUEkgLyAxODApO1xuICAgIHJldHVybiAoeSAqIHRoaXMuSEFMRl9FQVJUSCkgLyAxODAuMDtcbiAgfVxuXG4gIHNwaE1lcmNUb0xvbih4KSB7XG4gICAgcmV0dXJuICh4IC8gdGhpcy5IQUxGX0VBUlRIKSAqIDE4MC4wO1xuICB9XG5cbiAgc3BoTWVyY1RvTGF0KHkpIHtcbiAgICB2YXIgbGF0ID0gKHkgLyB0aGlzLkhBTEZfRUFSVEgpICogMTgwLjA7XG4gICAgbGF0ID1cbiAgICAgICgxODAgLyBNYXRoLlBJKSAqXG4gICAgICAoMiAqIE1hdGguYXRhbihNYXRoLmV4cCgobGF0ICogTWF0aC5QSSkgLyAxODApKSAtIE1hdGguUEkgLyAyKTtcbiAgICByZXR1cm4gbGF0O1xuICB9XG5cbiAgZ2V0SUQoKSB7XG4gICAgcmV0dXJuIFwiZXBzZzozODU3XCI7XG4gIH1cbn1cblxuXG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvd2ViY2FtLXJlbmRlcmVyLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy93ZWJjYW0tcmVuZGVyZXIuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKi8gKChfX3VudXNlZF93ZWJwYWNrX21vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykgPT4ge1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBXZWJjYW1SZW5kZXJlcjogKCkgPT4gKC8qIGJpbmRpbmcgKi8gV2ViY2FtUmVuZGVyZXIpXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgdGhyZWUgKi8gXCJ0aHJlZVwiKTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fX2RlZmF1bHQgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXy5uKHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18pO1xuXG5cbmNsYXNzIFdlYmNhbVJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocmVuZGVyZXIsIHZpZGVvRWxlbWVudCkge1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICB0aGlzLnJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgIHRoaXMuc2NlbmVXZWJjYW0gPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5TY2VuZSgpO1xuICAgIGxldCB2aWRlbztcbiAgICBpZiAodmlkZW9FbGVtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xuICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XG4gICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCB0cnVlKTtcbiAgICAgIHZpZGVvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlkZW8pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodmlkZW9FbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy5nZW9tID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uUGxhbmVCdWZmZXJHZW9tZXRyeSgpO1xuICAgIHRoaXMudGV4dHVyZSA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlZpZGVvVGV4dHVyZSh2aWRlbyk7XG4gICAgdGhpcy5tYXRlcmlhbCA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0aGlzLnRleHR1cmUgfSk7XG4gICAgY29uc3QgbWVzaCA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk1lc2godGhpcy5nZW9tLCB0aGlzLm1hdGVyaWFsKTtcbiAgICB0aGlzLnNjZW5lV2ViY2FtLmFkZChtZXNoKTtcbiAgICB0aGlzLmNhbWVyYVdlYmNhbSA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk9ydGhvZ3JhcGhpY0NhbWVyYShcbiAgICAgIC0wLjUsXG4gICAgICAwLjUsXG4gICAgICAwLjUsXG4gICAgICAtMC41LFxuICAgICAgMCxcbiAgICAgIDEwXG4gICAgKTtcbiAgICBpZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICAgIHZpZGVvOiB7XG4gICAgICAgICAgd2lkdGg6IDEyODAsXG4gICAgICAgICAgaGVpZ2h0OiA3MjAsXG4gICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgICAgLmdldFVzZXJNZWRpYShjb25zdHJhaW50cylcbiAgICAgICAgLnRoZW4oKHN0cmVhbSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGB1c2luZyB0aGUgd2ViY2FtIHN1Y2Nlc3NmdWxseS4uLmApO1xuICAgICAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFcnJvclBvcHVwKFxuICAgICAgICAgICAgICBcIldlYmNhbSBFcnJvclxcbk5hbWU6IFwiICsgZS5uYW1lICsgXCJcXG5NZXNzYWdlOiBcIiArIGUubWVzc2FnZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZUVycm9yUG9wdXAoXCJzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5jbGVhcigpO1xuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmVXZWJjYW0sIHRoaXMuY2FtZXJhV2ViY2FtKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyRGVwdGgoKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5tYXRlcmlhbC5kaXNwb3NlKCk7XG4gICAgdGhpcy50ZXh0dXJlLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xuICB9XG5cbiAgY3JlYXRlRXJyb3JQb3B1cChtc2cpIHtcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3ItcG9wdXBcIikpIHtcbiAgICAgIHZhciBlcnJvclBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGVycm9yUG9wdXAuaW5uZXJIVE1MID0gbXNnO1xuICAgICAgZXJyb3JQb3B1cC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImVycm9yLXBvcHVwXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlcnJvclBvcHVwKTtcbiAgICB9XG4gIH1cbn1cblxuXG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwidGhyZWVcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJ0aHJlZVwiLFwiY29tbW9uanMyXCI6XCJ0aHJlZVwiLFwiYW1kXCI6XCJ0aHJlZVwiLFwicm9vdFwiOlwiVEhSRUVcIn0gKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKi8gKChtb2R1bGUpID0+IHtcblxubW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187XG5cbi8qKiovIH0pXG5cbi8qKioqKiovIFx0fSk7XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcbi8qKioqKiovIFx0XHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG4vKioqKioqLyBcdFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbi8qKioqKiovIFx0XHRcdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG4vKioqKioqLyBcdFx0XHRcdCgpID0+IChtb2R1bGUpO1xuLyoqKioqKi8gXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gZ2V0dGVyO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuLyoqKioqKi8gXHRcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4vKioqKioqLyBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBtb2R1bGVzIGluIHRoZSBjaHVuay5cbigoKSA9PiB7XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2luZGV4LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgRGV2aWNlT3JpZW50YXRpb25Db250cm9sczogKCkgPT4gKC8qIHJlZXhwb3J0IHNhZmUgKi8gX2pzX2RldmljZV9vcmllbnRhdGlvbl9jb250cm9sc19qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBMb2NhdGlvbkJhc2VkOiAoKSA9PiAoLyogcmVleHBvcnQgc2FmZSAqLyBfanNfbG9jYXRpb25fYmFzZWRfanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5Mb2NhdGlvbkJhc2VkKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgV2ViY2FtUmVuZGVyZXI6ICgpID0+ICgvKiByZWV4cG9ydCBzYWZlICovIF9qc193ZWJjYW1fcmVuZGVyZXJfanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXy5XZWJjYW1SZW5kZXJlcilcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9qc19sb2NhdGlvbl9iYXNlZF9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9qcy9sb2NhdGlvbi1iYXNlZC5qcyAqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2xvY2F0aW9uLWJhc2VkLmpzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9qc193ZWJjYW1fcmVuZGVyZXJfanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vanMvd2ViY2FtLXJlbmRlcmVyLmpzICovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvd2ViY2FtLXJlbmRlcmVyLmpzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9qc19kZXZpY2Vfb3JpZW50YXRpb25fY29udHJvbHNfanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzICovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzXCIpO1xuXG5cblxuXG5cblxufSkoKTtcblxuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX2V4cG9ydHNfXztcbi8qKioqKiovIH0pKClcbjtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lZWEl0ZEdoeVpXVjRMV3h2WTJGMGFXOXVMVzl1YkhrdWFuTWlMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNRMEZCUXp0QlFVTkVMRTg3T3pzN096czdPenM3T3pzN096czdRVU5XUVR0QlFVTkJPenRCUVVVclJUczdRVUZGTDBVc2FVSkJRV2xDTERCRFFVRlBPMEZCUTNoQ0xHMUNRVUZ0UWl4M1EwRkJTenRCUVVONFFpeG5Ra0ZCWjBJc05rTkJRVlU3UVVGRE1VSXNaMEpCUVdkQ0xEWkRRVUZWTEhsRFFVRjVRenM3UVVGRmJrVXNkVUpCUVhWQ096dEJRVVYyUWl4M1EwRkJkME1zYTBSQlFXVTdRVUZEZGtRN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk96dEJRVVZCTzBGQlEwRXNLMEpCUVN0Q0xEWkRRVUZWT3p0QlFVVjZRenRCUVVOQk96dEJRVVZCT3p0QlFVVkJPMEZCUTBFN08wRkJSVUVzTUVKQlFUQkNPenRCUVVVeFFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRGhEUVVFNFF6czdRVUZGT1VNc2RVTkJRWFZET3p0QlFVVjJReXhuUTBGQlowTTdPMEZCUldoRExHZEZRVUZuUlR0QlFVTm9SVHM3UVVGRlFUdEJRVU5CTEhkRFFVRjNRenM3UVVGRmVFTTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4WFFVRlhPMEZCUTFnN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEZkQlFWYzdRVUZEV0N4UlFVRlJPMEZCUTFJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzV1VGQldTdzBRMEZCVXp0QlFVTnlRaXhsUVVGbE96dEJRVVZtTEdsRFFVRnBReXcwUTBGQlV5dzBRa0ZCTkVJN08wRkJSWFJGTEcxRFFVRnRReXcwUTBGQlV5dzJRa0ZCTmtJN08wRkJSWHBGTzBGQlEwRXNXVUZCV1N3MFEwRkJVenRCUVVOeVFpeGxRVUZsT3p0QlFVVm1PMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxHbENRVUZwUWp0QlFVTnFRaXhSUVVGUk8wRkJRMUlzYVVKQlFXbENPMEZCUTJwQ08wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGY1VNN096czdPenM3T3pzN096czdPenM3T3p0QlEzQlBkVUk3UVVGRE4wSTdPMEZCUlM5Q08wRkJRMEVzZVVOQlFYbERPMEZCUTNwRE8wRkJRMEU3UVVGRFFTeHhRa0ZCY1VJc2NVVkJRV2xDTzBGQlEzUkRPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVN3MFFrRkJORUk3UVVGRE5VSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEZOQlFWTTdRVUZEVkR0QlFVTkJPMEZCUTBFN1FVRkRRU3haUVVGWk8wRkJRMW9zY1VOQlFYRkRMRmRCUVZjN1FVRkRhRVE3UVVGRFFTeFRRVUZUTzBGQlExUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFOUJRVTg3UVVGRFVDeExRVUZMTzBGQlEwdzdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNVVUZCVVR0QlFVTlNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRkZCUVZFN1FVRkRVanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3gxUWtGQmRVSXNORU5CUVdVN1FVRkRkRU1zYzBKQlFYTkNMRFJEUVVGbE96dEJRVVZ5UXp0QlFVTkJPMEZCUTBFc1pVRkJaU3cwUTBGQlpUdEJRVU01UWl4cFFrRkJhVUlzTkVOQlFXVTdRVUZEYUVNN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGZVVJN096czdPenM3T3pzN096czdPenRCUXpkTGVrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlRaQ096czdPenM3T3pzN096czdPenM3T3p0QlEzaERSVHM3UVVGRkwwSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3d5UWtGQk1rSXNkME5CUVZjN1FVRkRkRU03UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hOUVVGTk8wRkJRMDQ3UVVGRFFUdEJRVU5CTEc5Q1FVRnZRaXh6UkVGQmVVSTdRVUZETjBNc2RVSkJRWFZDTEN0RFFVRnJRanRCUVVONlF5eDNRa0ZCZDBJc2IwUkJRWFZDTEVkQlFVY3NiVUpCUVcxQ08wRkJRM0pGTEhGQ1FVRnhRaXgxUTBGQlZUdEJRVU12UWp0QlFVTkJMRFJDUVVFMFFpeHhSRUZCZDBJN1FVRkRjRVE3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4VFFVRlRPMEZCUTFRN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4VFFVRlRPMEZCUTFRN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEZkQlFWYzdRVUZEV0N4VFFVRlRPMEZCUTFRc1RVRkJUVHRCUVVOT08wRkJRMEU3UVVGRFFTeFBRVUZQTzBGQlExQTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVXdRanM3T3pzN096czdPenM3UVVOcVJqRkNPenM3T3pzN1ZVTkJRVHRWUVVOQk96dFZRVVZCTzFWQlEwRTdWVUZEUVR0VlFVTkJPMVZCUTBFN1ZVRkRRVHRWUVVOQk8xVkJRMEU3VlVGRFFUdFZRVU5CTzFWQlEwRTdWVUZEUVR0VlFVTkJPenRWUVVWQk8xVkJRMEU3TzFWQlJVRTdWVUZEUVR0VlFVTkJPenM3T3p0WFEzUkNRVHRYUVVOQk8xZEJRMEU3VjBGRFFUdFhRVU5CTzFkQlEwRXNhVU5CUVdsRExGZEJRVmM3VjBGRE5VTTdWMEZEUVRzN096czdWME5RUVR0WFFVTkJPMWRCUTBFN1YwRkRRVHRYUVVOQkxIbERRVUY1UXl4M1EwRkJkME03VjBGRGFrWTdWMEZEUVR0WFFVTkJPenM3T3p0WFExQkJPenM3T3p0WFEwRkJPMWRCUTBFN1YwRkRRVHRYUVVOQkxIVkVRVUYxUkN4cFFrRkJhVUk3VjBGRGVFVTdWMEZEUVN4blJFRkJaMFFzWVVGQllUdFhRVU0zUkRzN096czdPenM3T3pzN096czdPenM3T3p0QlEwNTFSRHRCUVVORk8wRkJRM1ZDT3p0QlFVVmFJaXdpYzI5MWNtTmxjeUk2V3lKM1pXSndZV05yT2k4dlZFaFNSVVY0TDNkbFluQmhZMnN2ZFc1cGRtVnljMkZzVFc5a2RXeGxSR1ZtYVc1cGRHbHZiaUlzSW5kbFluQmhZMnM2THk5VVNGSkZSWGd2TGk5MGFISmxaUzVxY3k5emNtTXZiRzlqWVhScGIyNHRZbUZ6WldRdmFuTXZaR1YyYVdObExXOXlhV1Z1ZEdGMGFXOXVMV052Ym5SeWIyeHpMbXB6SWl3aWQyVmljR0ZqYXpvdkwxUklVa1ZGZUM4dUwzUm9jbVZsTG1wekwzTnlZeTlzYjJOaGRHbHZiaTFpWVhObFpDOXFjeTlzYjJOaGRHbHZiaTFpWVhObFpDNXFjeUlzSW5kbFluQmhZMnM2THk5VVNGSkZSWGd2TGk5MGFISmxaUzVxY3k5emNtTXZiRzlqWVhScGIyNHRZbUZ6WldRdmFuTXZjM0JvYldWeVl5MXdjbTlxWldOMGFXOXVMbXB6SWl3aWQyVmljR0ZqYXpvdkwxUklVa1ZGZUM4dUwzUm9jbVZsTG1wekwzTnlZeTlzYjJOaGRHbHZiaTFpWVhObFpDOXFjeTkzWldKallXMHRjbVZ1WkdWeVpYSXVhbk1pTENKM1pXSndZV05yT2k4dlZFaFNSVVY0TDJWNGRHVnlibUZzSUhWdFpDQjdYQ0pqYjIxdGIyNXFjMXdpT2x3aWRHaHlaV1ZjSWl4Y0ltTnZiVzF2Ym1wek1sd2lPbHdpZEdoeVpXVmNJaXhjSW1GdFpGd2lPbHdpZEdoeVpXVmNJaXhjSW5KdmIzUmNJanBjSWxSSVVrVkZYQ0o5SWl3aWQyVmljR0ZqYXpvdkwxUklVa1ZGZUM5M1pXSndZV05yTDJKdmIzUnpkSEpoY0NJc0luZGxZbkJoWTJzNkx5OVVTRkpGUlhndmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJOdmJYQmhkQ0JuWlhRZ1pHVm1ZWFZzZENCbGVIQnZjblFpTENKM1pXSndZV05yT2k4dlZFaFNSVVY0TDNkbFluQmhZMnN2Y25WdWRHbHRaUzlrWldacGJtVWdjSEp2Y0dWeWRIa2daMlYwZEdWeWN5SXNJbmRsWW5CaFkyczZMeTlVU0ZKRlJYZ3ZkMlZpY0dGamF5OXlkVzUwYVcxbEwyaGhjMDkzYmxCeWIzQmxjblI1SUhOb2IzSjBhR0Z1WkNJc0luZGxZbkJoWTJzNkx5OVVTRkpGUlhndmQyVmljR0ZqYXk5eWRXNTBhVzFsTDIxaGEyVWdibUZ0WlhOd1lXTmxJRzlpYW1WamRDSXNJbmRsWW5CaFkyczZMeTlVU0ZKRlJYZ3ZMaTkwYUhKbFpTNXFjeTl6Y21NdmJHOWpZWFJwYjI0dFltRnpaV1F2YVc1a1pYZ3Vhbk1pWFN3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUtHWjFibU4wYVc5dUlIZGxZbkJoWTJ0VmJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1S0hKdmIzUXNJR1poWTNSdmNua3BJSHRjYmx4MGFXWW9kSGx3Wlc5bUlHVjRjRzl5ZEhNZ1BUMDlJQ2R2WW1wbFkzUW5JQ1ltSUhSNWNHVnZaaUJ0YjJSMWJHVWdQVDA5SUNkdlltcGxZM1FuS1Z4dVhIUmNkRzF2WkhWc1pTNWxlSEJ2Y25SeklEMGdabUZqZEc5eWVTaHlaWEYxYVhKbEtGd2lkR2h5WldWY0lpa3BPMXh1WEhSbGJITmxJR2xtS0hSNWNHVnZaaUJrWldacGJtVWdQVDA5SUNkbWRXNWpkR2x2YmljZ0ppWWdaR1ZtYVc1bExtRnRaQ2xjYmx4MFhIUmtaV1pwYm1Vb1cxd2lkR2h5WldWY0lsMHNJR1poWTNSdmNua3BPMXh1WEhSbGJITmxJR2xtS0hSNWNHVnZaaUJsZUhCdmNuUnpJRDA5UFNBbmIySnFaV04wSnlsY2JseDBYSFJsZUhCdmNuUnpXMXdpVkVoU1JVVjRYQ0pkSUQwZ1ptRmpkRzl5ZVNoeVpYRjFhWEpsS0Z3aWRHaHlaV1ZjSWlrcE8xeHVYSFJsYkhObFhHNWNkRngwY205dmRGdGNJbFJJVWtWRmVGd2lYU0E5SUdaaFkzUnZjbmtvY205dmRGdGNJbFJJVWtWRlhDSmRLVHRjYm4wcEtIUm9hWE1zSUNoZlgxZEZRbEJCUTB0ZlJWaFVSVkpPUVV4ZlRVOUVWVXhGWDNSb2NtVmxYMThwSUQwK0lIdGNibkpsZEhWeWJpQWlMQ0l2THlCTmIyUnBabWxsWkNCMlpYSnphVzl1SUc5bUlGUklVa1ZGTGtSbGRtbGpaVTl5YVdWdWRHRjBhVzl1UTI5dWRISnZiSE1nWm5KdmJTQjBhSEpsWlM1cWMxeHVMeThnZDJsc2JDQjFjMlVnZEdobElHUmxkbWxqWlc5eWFXVnVkR0YwYVc5dVlXSnpiMngxZEdVZ1pYWmxiblFnYVdZZ1lYWmhhV3hoWW14bFhHNWNibWx0Y0c5eWRDQjdJRVYxYkdWeUxDQkZkbVZ1ZEVScGMzQmhkR05vWlhJc0lFMWhkR2hWZEdsc2N5d2dVWFZoZEdWeWJtbHZiaXdnVm1WamRHOXlNeUI5SUdaeWIyMGdYQ0owYUhKbFpWd2lPMXh1WEc1amIyNXpkQ0JmZW1WbElEMGdibVYzSUZabFkzUnZjak1vTUN3Z01Dd2dNU2s3WEc1amIyNXpkQ0JmWlhWc1pYSWdQU0J1WlhjZ1JYVnNaWElvS1R0Y2JtTnZibk4wSUY5eE1DQTlJRzVsZHlCUmRXRjBaWEp1YVc5dUtDazdYRzVqYjI1emRDQmZjVEVnUFNCdVpYY2dVWFZoZEdWeWJtbHZiaWd0VFdGMGFDNXpjWEowS0RBdU5Ta3NJREFzSURBc0lFMWhkR2d1YzNGeWRDZ3dMalVwS1RzZ0x5OGdMU0JRU1M4eUlHRnliM1Z1WkNCMGFHVWdlQzFoZUdselhHNWNibU52Ym5OMElGOWphR0Z1WjJWRmRtVnVkQ0E5SUhzZ2RIbHdaVG9nWENKamFHRnVaMlZjSWlCOU8xeHVYRzVqYkdGemN5QkVaWFpwWTJWUGNtbGxiblJoZEdsdmJrTnZiblJ5YjJ4eklHVjRkR1Z1WkhNZ1JYWmxiblJFYVhOd1lYUmphR1Z5SUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lvYjJKcVpXTjBLU0I3WEc0Z0lDQWdjM1Z3WlhJb0tUdGNibHh1SUNBZ0lHbG1JQ2gzYVc1a2IzY3VhWE5UWldOMWNtVkRiMjUwWlhoMElEMDlQU0JtWVd4elpTa2dlMXh1SUNBZ0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2loY2JpQWdJQ0FnSUNBZ1hDSlVTRkpGUlM1RVpYWnBZMlZQY21sbGJuUmhkR2x2YmtOdmJuUnliMnh6T2lCRVpYWnBZMlZQY21sbGJuUmhkR2x2YmtWMlpXNTBJR2x6SUc5dWJIa2dZWFpoYVd4aFlteGxJR2x1SUhObFkzVnlaU0JqYjI1MFpYaDBjeUFvYUhSMGNITXBYQ0pjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdZMjl1YzNRZ2MyTnZjR1VnUFNCMGFHbHpPMXh1WEc0Z0lDQWdZMjl1YzNRZ1JWQlRJRDBnTUM0d01EQXdNREU3WEc0Z0lDQWdZMjl1YzNRZ2JHRnpkRkYxWVhSbGNtNXBiMjRnUFNCdVpYY2dVWFZoZEdWeWJtbHZiaWdwTzF4dVhHNGdJQ0FnZEdocGN5NXZZbXBsWTNRZ1BTQnZZbXBsWTNRN1hHNGdJQ0FnZEdocGN5NXZZbXBsWTNRdWNtOTBZWFJwYjI0dWNtVnZjbVJsY2loY0lsbFlXbHdpS1R0Y2JseHVJQ0FnSUhSb2FYTXVaVzVoWW14bFpDQTlJSFJ5ZFdVN1hHNWNiaUFnSUNCMGFHbHpMbVJsZG1salpVOXlhV1Z1ZEdGMGFXOXVJRDBnZTMwN1hHNGdJQ0FnZEdocGN5NXpZM0psWlc1UGNtbGxiblJoZEdsdmJpQTlJREE3WEc1Y2JpQWdJQ0IwYUdsekxtRnNjR2hoVDJabWMyVjBJRDBnTURzZ0x5OGdjbUZrYVdGdWMxeHVYRzRnSUNBZ2RHaHBjeTVVVjA5ZlVFa2dQU0F5SUNvZ1RXRjBhQzVRU1R0Y2JpQWdJQ0IwYUdsekxraEJURVpmVUVrZ1BTQXdMalVnS2lCTllYUm9MbEJKTzF4dUlDQWdJSFJvYVhNdWIzSnBaVzUwWVhScGIyNURhR0Z1WjJWRmRtVnVkRTVoYldVZ1BWeHVJQ0FnSUNBZ1hDSnZibVJsZG1salpXOXlhV1Z1ZEdGMGFXOXVZV0p6YjJ4MWRHVmNJaUJwYmlCM2FXNWtiM2RjYmlBZ0lDQWdJQ0FnUHlCY0ltUmxkbWxqWlc5eWFXVnVkR0YwYVc5dVlXSnpiMngxZEdWY0lseHVJQ0FnSUNBZ0lDQTZJRndpWkdWMmFXTmxiM0pwWlc1MFlYUnBiMjVjSWp0Y2JseHVJQ0FnSUhSb2FYTXVjMjF2YjNSb2FXNW5SbUZqZEc5eUlEMGdNVHRjYmx4dUlDQWdJR052Ym5OMElHOXVSR1YyYVdObFQzSnBaVzUwWVhScGIyNURhR0Z1WjJWRmRtVnVkQ0E5SUdaMWJtTjBhVzl1SUNobGRtVnVkQ2tnZTF4dUlDQWdJQ0FnYzJOdmNHVXVaR1YyYVdObFQzSnBaVzUwWVhScGIyNGdQU0JsZG1WdWREdGNiaUFnSUNCOU8xeHVYRzRnSUNBZ1kyOXVjM1FnYjI1VFkzSmxaVzVQY21sbGJuUmhkR2x2YmtOb1lXNW5aVVYyWlc1MElEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnYzJOdmNHVXVjMk55WldWdVQzSnBaVzUwWVhScGIyNGdQU0IzYVc1a2IzY3ViM0pwWlc1MFlYUnBiMjRnZkh3Z01EdGNiaUFnSUNCOU8xeHVYRzRnSUNBZ0x5OGdWR2hsSUdGdVoyeGxjeUJoYkhCb1lTd2dZbVYwWVNCaGJtUWdaMkZ0YldFZ1ptOXliU0JoSUhObGRDQnZaaUJwYm5SeWFXNXphV01nVkdGcGRDMUNjbmxoYmlCaGJtZHNaWE1nYjJZZ2RIbHdaU0JhTFZnbkxWa25KMXh1WEc0Z0lDQWdZMjl1YzNRZ2MyVjBUMkpxWldOMFVYVmhkR1Z5Ym1sdmJpQTlJR1oxYm1OMGFXOXVJQ2hjYmlBZ0lDQWdJSEYxWVhSbGNtNXBiMjRzWEc0Z0lDQWdJQ0JoYkhCb1lTeGNiaUFnSUNBZ0lHSmxkR0VzWEc0Z0lDQWdJQ0JuWVcxdFlTeGNiaUFnSUNBZ0lHOXlhV1Z1ZEZ4dUlDQWdJQ2tnZTF4dUlDQWdJQ0FnWDJWMWJHVnlMbk5sZENoaVpYUmhMQ0JoYkhCb1lTd2dMV2RoYlcxaExDQmNJbGxZV2x3aUtUc2dMeThnSjFwWVdTY2dabTl5SUhSb1pTQmtaWFpwWTJVc0lHSjFkQ0FuV1ZoYUp5Qm1iM0lnZFhOY2JseHVJQ0FnSUNBZ2NYVmhkR1Z5Ym1sdmJpNXpaWFJHY205dFJYVnNaWElvWDJWMWJHVnlLVHNnTHk4Z2IzSnBaVzUwSUhSb1pTQmtaWFpwWTJWY2JseHVJQ0FnSUNBZ2NYVmhkR1Z5Ym1sdmJpNXRkV3gwYVhCc2VTaGZjVEVwT3lBdkx5QmpZVzFsY21FZ2JHOXZhM01nYjNWMElIUm9aU0JpWVdOcklHOW1JSFJvWlNCa1pYWnBZMlVzSUc1dmRDQjBhR1VnZEc5d1hHNWNiaUFnSUNBZ0lIRjFZWFJsY201cGIyNHViWFZzZEdsd2JIa29YM0V3TG5ObGRFWnliMjFCZUdselFXNW5iR1VvWDNwbFpTd2dMVzl5YVdWdWRDa3BPeUF2THlCaFpHcDFjM1FnWm05eUlITmpjbVZsYmlCdmNtbGxiblJoZEdsdmJseHVJQ0FnSUgwN1hHNWNiaUFnSUNCMGFHbHpMbU52Ym01bFkzUWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNCdmJsTmpjbVZsYms5eWFXVnVkR0YwYVc5dVEyaGhibWRsUlhabGJuUW9LVHNnTHk4Z2NuVnVJRzl1WTJVZ2IyNGdiRzloWkZ4dVhHNGdJQ0FnSUNBdkx5QnBUMU1nTVRNclhHNWNiaUFnSUNBZ0lHbG1JQ2hjYmlBZ0lDQWdJQ0FnZDJsdVpHOTNMa1JsZG1salpVOXlhV1Z1ZEdGMGFXOXVSWFpsYm5RZ0lUMDlJSFZ1WkdWbWFXNWxaQ0FtSmx4dUlDQWdJQ0FnSUNCMGVYQmxiMllnZDJsdVpHOTNMa1JsZG1salpVOXlhV1Z1ZEdGMGFXOXVSWFpsYm5RdWNtVnhkV1Z6ZEZCbGNtMXBjM05wYjI0Z1BUMDlJRndpWm5WdVkzUnBiMjVjSWx4dUlDQWdJQ0FnS1NCN1hHNGdJQ0FnSUNBZ0lIZHBibVJ2ZHk1RVpYWnBZMlZQY21sbGJuUmhkR2x2YmtWMlpXNTBMbkpsY1hWbGMzUlFaWEp0YVhOemFXOXVLQ2xjYmlBZ0lDQWdJQ0FnSUNBdWRHaGxiaWdvY21WemNHOXVjMlVwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHlaWE53YjI1elpTQTlQVDBnWENKbmNtRnVkR1ZrWENJcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWENKdmNtbGxiblJoZEdsdmJtTm9ZVzVuWlZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHOXVVMk55WldWdVQzSnBaVzUwWVhScGIyNURhR0Z1WjJWRmRtVnVkRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelkyOXdaUzV2Y21sbGJuUmhkR2x2YmtOb1lXNW5aVVYyWlc1MFRtRnRaU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J2YmtSbGRtbGpaVTl5YVdWdWRHRjBhVzl1UTJoaGJtZGxSWFpsYm5SY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ0lDQWdJQzVqWVhSamFDaG1kVzVqZEdsdmJpQW9aWEp5YjNJcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOdmJuTnZiR1V1WlhKeWIzSW9YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lGd2lWRWhTUlVVdVJHVjJhV05sVDNKcFpXNTBZWFJwYjI1RGIyNTBjbTlzY3pvZ1ZXNWhZbXhsSUhSdklIVnpaU0JFWlhacFkyVlBjbWxsYm5SaGRHbHZiaUJCVUVrNlhDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHVnljbTl5WEc0Z0lDQWdJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvWEc0Z0lDQWdJQ0FnSUNBZ1hDSnZjbWxsYm5SaGRHbHZibU5vWVc1blpWd2lMRnh1SUNBZ0lDQWdJQ0FnSUc5dVUyTnlaV1Z1VDNKcFpXNTBZWFJwYjI1RGFHRnVaMlZGZG1WdWRGeHVJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdJQ0IzYVc1a2IzY3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpaGNiaUFnSUNBZ0lDQWdJQ0J6WTI5d1pTNXZjbWxsYm5SaGRHbHZia05vWVc1blpVVjJaVzUwVG1GdFpTeGNiaUFnSUNBZ0lDQWdJQ0J2YmtSbGRtbGpaVTl5YVdWdWRHRjBhVzl1UTJoaGJtZGxSWFpsYm5SY2JpQWdJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjMk52Y0dVdVpXNWhZbXhsWkNBOUlIUnlkV1U3WEc0Z0lDQWdmVHRjYmx4dUlDQWdJSFJvYVhNdVpHbHpZMjl1Ym1WamRDQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FnSUhkcGJtUnZkeTV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0Z4dUlDQWdJQ0FnSUNCY0ltOXlhV1Z1ZEdGMGFXOXVZMmhoYm1kbFhDSXNYRzRnSUNBZ0lDQWdJRzl1VTJOeVpXVnVUM0pwWlc1MFlYUnBiMjVEYUdGdVoyVkZkbVZ1ZEZ4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0FnSUhkcGJtUnZkeTV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0Z4dUlDQWdJQ0FnSUNCelkyOXdaUzV2Y21sbGJuUmhkR2x2YmtOb1lXNW5aVVYyWlc1MFRtRnRaU3hjYmlBZ0lDQWdJQ0FnYjI1RVpYWnBZMlZQY21sbGJuUmhkR2x2YmtOb1lXNW5aVVYyWlc1MFhHNGdJQ0FnSUNBcE8xeHVYRzRnSUNBZ0lDQnpZMjl3WlM1bGJtRmliR1ZrSUQwZ1ptRnNjMlU3WEc0Z0lDQWdmVHRjYmx4dUlDQWdJSFJvYVhNdWRYQmtZWFJsSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdhV1lnS0hOamIzQmxMbVZ1WVdKc1pXUWdQVDA5SUdaaGJITmxLU0J5WlhSMWNtNDdYRzVjYmlBZ0lDQWdJR052Ym5OMElHUmxkbWxqWlNBOUlITmpiM0JsTG1SbGRtbGpaVTl5YVdWdWRHRjBhVzl1TzF4dVhHNGdJQ0FnSUNCcFppQW9aR1YyYVdObEtTQjdYRzRnSUNBZ0lDQWdJR3hsZENCaGJIQm9ZU0E5SUdSbGRtbGpaUzVoYkhCb1lWeHVJQ0FnSUNBZ0lDQWdJRDhnVFdGMGFGVjBhV3h6TG1SbFoxUnZVbUZrS0dSbGRtbGpaUzVoYkhCb1lTa2dLeUJ6WTI5d1pTNWhiSEJvWVU5bVpuTmxkRnh1SUNBZ0lDQWdJQ0FnSURvZ01Ec2dMeThnV2x4dVhHNGdJQ0FnSUNBZ0lHeGxkQ0JpWlhSaElEMGdaR1YyYVdObExtSmxkR0VnUHlCTllYUm9WWFJwYkhNdVpHVm5WRzlTWVdRb1pHVjJhV05sTG1KbGRHRXBJRG9nTURzZ0x5OGdXQ2RjYmx4dUlDQWdJQ0FnSUNCc1pYUWdaMkZ0YldFZ1BTQmtaWFpwWTJVdVoyRnRiV0VnUHlCTllYUm9WWFJwYkhNdVpHVm5WRzlTWVdRb1pHVjJhV05sTG1kaGJXMWhLU0E2SURBN0lDOHZJRmtuSjF4dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUc5eWFXVnVkQ0E5SUhOamIzQmxMbk5qY21WbGJrOXlhV1Z1ZEdGMGFXOXVYRzRnSUNBZ0lDQWdJQ0FnUHlCTllYUm9WWFJwYkhNdVpHVm5WRzlTWVdRb2MyTnZjR1V1YzJOeVpXVnVUM0pwWlc1MFlYUnBiMjRwWEc0Z0lDQWdJQ0FnSUNBZ09pQXdPeUF2THlCUFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVjMjF2YjNSb2FXNW5SbUZqZEc5eUlEd2dNU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxteGhjM1JQY21sbGJuUmhkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdheUE5SUhSb2FYTXVjMjF2YjNSb2FXNW5SbUZqZEc5eU8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWVd4d2FHRWdQU0IwYUdsekxsOW5aWFJUYlc5dmRHaGxaRUZ1WjJ4bEtGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCaGJIQm9ZU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1c1lYTjBUM0pwWlc1MFlYUnBiMjR1WVd4d2FHRXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHdGNiaUFnSUNBZ0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JpWlhSaElEMGdkR2hwY3k1ZloyVjBVMjF2YjNSb1pXUkJibWRzWlNoY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnWW1WMFlTQXJJRTFoZEdndVVFa3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YkdGemRFOXlhV1Z1ZEdGMGFXOXVMbUpsZEdFc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUd0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQm5ZVzF0WVNBOUlIUm9hWE11WDJkbGRGTnRiMjkwYUdWa1FXNW5iR1VvWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR2RoYlcxaElDc2dkR2hwY3k1SVFVeEdYMUJKTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxteGhjM1JQY21sbGJuUmhkR2x2Ymk1bllXMXRZU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdheXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdUV0YwYUM1UVNWeHVJQ0FnSUNBZ0lDQWdJQ0FnS1R0Y2JpQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWW1WMFlTQXJQU0JOWVhSb0xsQkpPMXh1SUNBZ0lDQWdJQ0FnSUNBZ1oyRnRiV0VnS3owZ2RHaHBjeTVJUVV4R1gxQkpPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWJHRnpkRTl5YVdWdWRHRjBhVzl1SUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWVd4d2FHRTZJR0ZzY0doaExGeHVJQ0FnSUNBZ0lDQWdJQ0FnWW1WMFlUb2dZbVYwWVN4Y2JpQWdJQ0FnSUNBZ0lDQWdJR2RoYlcxaE9pQm5ZVzF0WVN4Y2JpQWdJQ0FnSUNBZ0lDQjlPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2MyVjBUMkpxWldOMFVYVmhkR1Z5Ym1sdmJpaGNiaUFnSUNBZ0lDQWdJQ0J6WTI5d1pTNXZZbXBsWTNRdWNYVmhkR1Z5Ym1sdmJpeGNiaUFnSUNBZ0lDQWdJQ0JoYkhCb1lTeGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuTnRiMjkwYUdsdVowWmhZM1J2Y2lBOElERWdQeUJpWlhSaElDMGdUV0YwYUM1UVNTQTZJR0psZEdFc1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1emJXOXZkR2hwYm1kR1lXTjBiM0lnUENBeElEOGdaMkZ0YldFZ0xTQjBhR2x6TGtoQlRFWmZVRWtnT2lCbllXMXRZU3hjYmlBZ0lDQWdJQ0FnSUNCdmNtbGxiblJjYmlBZ0lDQWdJQ0FnS1R0Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvT0NBcUlDZ3hJQzBnYkdGemRGRjFZWFJsY201cGIyNHVaRzkwS0hOamIzQmxMbTlpYW1WamRDNXhkV0YwWlhKdWFXOXVLU2tnUGlCRlVGTXBJSHRjYmlBZ0lDQWdJQ0FnSUNCc1lYTjBVWFZoZEdWeWJtbHZiaTVqYjNCNUtITmpiM0JsTG05aWFtVmpkQzV4ZFdGMFpYSnVhVzl1S1R0Y2JpQWdJQ0FnSUNBZ0lDQnpZMjl3WlM1a2FYTndZWFJqYUVWMlpXNTBLRjlqYUdGdVoyVkZkbVZ1ZENrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOU8xeHVYRzRnSUNBZ0x5OGdUbGNnUVdSa1pXUmNiaUFnSUNCMGFHbHpMbDl2Y21SbGNrRnVaMnhsSUQwZ1puVnVZM1JwYjI0Z0tHRXNJR0lzSUhKaGJtZGxJRDBnZEdocGN5NVVWMDlmVUVrcElIdGNiaUFnSUNBZ0lHbG1JQ2hjYmlBZ0lDQWdJQ0FnS0dJZ1BpQmhJQ1ltSUUxaGRHZ3VZV0p6S0dJZ0xTQmhLU0E4SUhKaGJtZGxJQzhnTWlrZ2ZIeGNiaUFnSUNBZ0lDQWdLR0VnUGlCaUlDWW1JRTFoZEdndVlXSnpLR0lnTFNCaEtTQStJSEpoYm1kbElDOGdNaWxjYmlBZ0lDQWdJQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZXlCc1pXWjBPaUJoTENCeWFXZG9kRG9nWWlCOU8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhzZ2JHVm1kRG9nWWl3Z2NtbG5hSFE2SUdFZ2ZUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOU8xeHVYRzRnSUNBZ0x5OGdUbGNnUVdSa1pXUmNiaUFnSUNCMGFHbHpMbDluWlhSVGJXOXZkR2hsWkVGdVoyeGxJRDBnWm5WdVkzUnBiMjRnS0dFc0lHSXNJR3NzSUhKaGJtZGxJRDBnZEdocGN5NVVWMDlmVUVrcElIdGNiaUFnSUNBZ0lHTnZibk4wSUdGdVoyeGxjeUE5SUhSb2FYTXVYMjl5WkdWeVFXNW5iR1VvWVN3Z1lpd2djbUZ1WjJVcE8xeHVJQ0FnSUNBZ1kyOXVjM1FnWVc1bmJHVnphR2xtZENBOUlHRnVaMnhsY3k1c1pXWjBPMXh1SUNBZ0lDQWdZMjl1YzNRZ2IzSnBaMEZ1WjJ4bGMxSnBaMmgwSUQwZ1lXNW5iR1Z6TG5KcFoyaDBPMXh1SUNBZ0lDQWdZVzVuYkdWekxteGxablFnUFNBd08xeHVJQ0FnSUNBZ1lXNW5iR1Z6TG5KcFoyaDBJQzA5SUdGdVoyeGxjMmhwWm5RN1hHNGdJQ0FnSUNCcFppQW9ZVzVuYkdWekxuSnBaMmgwSUR3Z01Da2dZVzVuYkdWekxuSnBaMmgwSUNzOUlISmhibWRsTzF4dUlDQWdJQ0FnYkdWMElHNWxkMkZ1WjJ4bElEMWNiaUFnSUNBZ0lDQWdiM0pwWjBGdVoyeGxjMUpwWjJoMElEMDlJR0pjYmlBZ0lDQWdJQ0FnSUNBL0lDZ3hJQzBnYXlrZ0tpQmhibWRzWlhNdWNtbG5hSFFnS3lCcklDb2dZVzVuYkdWekxteGxablJjYmlBZ0lDQWdJQ0FnSUNBNklHc2dLaUJoYm1kc1pYTXVjbWxuYUhRZ0t5QW9NU0F0SUdzcElDb2dZVzVuYkdWekxteGxablE3WEc0Z0lDQWdJQ0J1WlhkaGJtZHNaU0FyUFNCaGJtZHNaWE5vYVdaME8xeHVJQ0FnSUNBZ2FXWWdLRzVsZDJGdVoyeGxJRDQ5SUhKaGJtZGxLU0J1WlhkaGJtZHNaU0F0UFNCeVlXNW5aVHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnVaWGRoYm1kc1pUdGNiaUFnSUNCOU8xeHVYRzRnSUNBZ2RHaHBjeTVrYVhOd2IzTmxJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2MyTnZjR1V1WkdselkyOXVibVZqZENncE8xeHVJQ0FnSUgwN1hHNWNiaUFnSUNCMGFHbHpMbU52Ym01bFkzUW9LVHRjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnZXlCRVpYWnBZMlZQY21sbGJuUmhkR2x2YmtOdmJuUnliMnh6SUgwN1hHNGlMQ0pwYlhCdmNuUWdleUJUY0doTlpYSmpVSEp2YW1WamRHbHZiaUI5SUdaeWIyMGdYQ0l1TDNOd2FHMWxjbU10Y0hKdmFtVmpkR2x2Ymk1cWMxd2lPMXh1YVcxd2IzSjBJQ29nWVhNZ1ZFaFNSVVVnWm5KdmJTQmNJblJvY21WbFhDSTdYRzVjYm1Oc1lYTnpJRXh2WTJGMGFXOXVRbUZ6WldRZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2loelkyVnVaU3dnWTJGdFpYSmhMQ0J2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNCMGFHbHpMbDl6WTJWdVpTQTlJSE5qWlc1bE8xeHVJQ0FnSUhSb2FYTXVYMk5oYldWeVlTQTlJR05oYldWeVlUdGNiaUFnSUNCMGFHbHpMbDl3Y205cUlEMGdibVYzSUZOd2FFMWxjbU5RY205cVpXTjBhVzl1S0NrN1hHNGdJQ0FnZEdocGN5NWZaWFpsYm5SSVlXNWtiR1Z5Y3lBOUlIdDlPMXh1SUNBZ0lIUm9hWE11WDJ4aGMzUkRiMjl5WkhNZ1BTQnVkV3hzTzF4dUlDQWdJSFJvYVhNdVgyZHdjMDFwYmtScGMzUmhibU5sSUQwZ01EdGNiaUFnSUNCMGFHbHpMbDluY0hOTmFXNUJZMk4xY21GamVTQTlJREV3TUR0Y2JpQWdJQ0IwYUdsekxsOXRZWGhwYlhWdFFXZGxJRDBnTUR0Y2JpQWdJQ0IwYUdsekxsOTNZWFJqYUZCdmMybDBhVzl1U1dRZ1BTQnVkV3hzTzF4dUlDQWdJSFJvYVhNdWMyVjBSM0J6VDNCMGFXOXVjeWh2Y0hScGIyNXpLVHRjYmlBZ0lDQjBhR2x6TG1sdWFYUnBZV3hRYjNOcGRHbHZiaUE5SUc1MWJHdzdYRzRnSUNBZ2RHaHBjeTVwYm1sMGFXRnNVRzl6YVhScGIyNUJjMDl5YVdkcGJpQTlJRzl3ZEdsdmJuTXVhVzVwZEdsaGJGQnZjMmwwYVc5dVFYTlBjbWxuYVc0Z2ZId2dabUZzYzJVN1hHNGdJSDFjYmx4dUlDQnpaWFJRY205cVpXTjBhVzl1S0hCeWIyb3BJSHRjYmlBZ0lDQjBhR2x6TGw5d2NtOXFJRDBnY0hKdmFqdGNiaUFnZlZ4dVhHNGdJSE5sZEVkd2MwOXdkR2x2Ym5Nb2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdhV1lnS0c5d2RHbHZibk11WjNCelRXbHVSR2x6ZEdGdVkyVWdJVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVmWjNCelRXbHVSR2x6ZEdGdVkyVWdQU0J2Y0hScGIyNXpMbWR3YzAxcGJrUnBjM1JoYm1ObE8xeHVJQ0FnSUgxY2JpQWdJQ0JwWmlBb2IzQjBhVzl1Y3k1bmNITk5hVzVCWTJOMWNtRmplU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5bmNITk5hVzVCWTJOMWNtRmplU0E5SUc5d2RHbHZibk11WjNCelRXbHVRV05qZFhKaFkzazdYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaHZjSFJwYjI1ekxtMWhlR2x0ZFcxQloyVWdJVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVmYldGNGFXMTFiVUZuWlNBOUlHOXdkR2x2Ym5NdWJXRjRhVzExYlVGblpUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnpkR0Z5ZEVkd2N5aHRZWGhwYlhWdFFXZGxJRDBnTUNrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TGw5M1lYUmphRkJ2YzJsMGFXOXVTV1FnUFQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYM2RoZEdOb1VHOXphWFJwYjI1SlpDQTlJRzVoZG1sbllYUnZjaTVuWlc5c2IyTmhkR2x2Ymk1M1lYUmphRkJ2YzJsMGFXOXVLRnh1SUNBZ0lDQWdJQ0FvY0c5emFYUnBiMjRwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxsOW5jSE5TWldObGFYWmxaQ2h3YjNOcGRHbHZiaWs3WEc0Z0lDQWdJQ0FnSUgwc1hHNGdJQ0FnSUNBZ0lDaGxjbkp2Y2lrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5bGRtVnVkRWhoYm1Sc1pYSnpXMXdpWjNCelpYSnliM0pjSWwwcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYMlYyWlc1MFNHRnVaR3hsY25OYlhDSm5jSE5sY25KdmNsd2lYU2hsY25KdmNpNWpiMlJsS1R0Y2JpQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWVd4bGNuUW9ZRWRRVXlCbGNuSnZjam9nWTI5a1pTQWtlMlZ5Y205eUxtTnZaR1Y5WUNrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lDQWdaVzVoWW14bFNHbG5hRUZqWTNWeVlXTjVPaUIwY25WbExGeHVJQ0FnSUNBZ0lDQWdJRzFoZUdsdGRXMUJaMlU2SUcxaGVHbHRkVzFCWjJVZ0lUMGdNQ0EvSUcxaGVHbHRkVzFCWjJVZ09pQjBhR2x6TGw5dFlYaHBiWFZ0UVdkbExGeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1U3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjYmlBZ2ZWeHVYRzRnSUhOMGIzQkhjSE1vS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11WDNkaGRHTm9VRzl6YVhScGIyNUpaQ0FoUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnYm1GMmFXZGhkRzl5TG1kbGIyeHZZMkYwYVc5dUxtTnNaV0Z5VjJGMFkyZ29kR2hwY3k1ZmQyRjBZMmhRYjNOcGRHbHZia2xrS1R0Y2JpQWdJQ0FnSUhSb2FYTXVYM2RoZEdOb1VHOXphWFJwYjI1SlpDQTlJRzUxYkd3N1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpUdGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0I5WEc1Y2JpQWdabUZyWlVkd2N5aHNiMjRzSUd4aGRDd2daV3hsZGlBOUlHNTFiR3dzSUdGall5QTlJREFwSUh0Y2JpQWdJQ0JwWmlBb1pXeGxkaUFoUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXpaWFJGYkdWMllYUnBiMjRvWld4bGRpazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVmWjNCelVtVmpaV2wyWldRb2UxeHVJQ0FnSUNBZ1kyOXZjbVJ6T2lCN1hHNGdJQ0FnSUNBZ0lHeHZibWRwZEhWa1pUb2diRzl1TEZ4dUlDQWdJQ0FnSUNCc1lYUnBkSFZrWlRvZ2JHRjBMRnh1SUNBZ0lDQWdJQ0JoWTJOMWNtRmplVG9nWVdOakxGeHVJQ0FnSUNBZ2ZTeGNiaUFnSUNCOUtUdGNiaUFnZlZ4dVhHNGdJR3h2Ymt4aGRGUnZWMjl5YkdSRGIyOXlaSE1vYkc5dUxDQnNZWFFwSUh0Y2JpQWdJQ0JqYjI1emRDQndjbTlxWldOMFpXUlFiM01nUFNCMGFHbHpMbDl3Y205cUxuQnliMnBsWTNRb2JHOXVMQ0JzWVhRcE8xeHVJQ0FnSUdsbUlDaDBhR2x6TG1sdWFYUnBZV3hRYjNOcGRHbHZia0Z6VDNKcFoybHVLU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVwYm1sMGFXRnNVRzl6YVhScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnY0hKdmFtVmpkR1ZrVUc5eld6QmRJQzA5SUhSb2FYTXVhVzVwZEdsaGJGQnZjMmwwYVc5dVd6QmRPMXh1SUNBZ0lDQWdJQ0J3Y205cVpXTjBaV1JRYjNOYk1WMGdMVDBnZEdocGN5NXBibWwwYVdGc1VHOXphWFJwYjI1Yk1WMDdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCY0lsUnllV2x1WnlCMGJ5QjFjMlVnSjJsdWFYUnBZV3dnY0c5emFYUnBiMjRnWVhNZ2IzSnBaMmx1SnlCdGIyUmxJSGRwZEdnZ2JtOGdhVzVwZEdsaGJDQndiM05wZEdsdmJpQmtaWFJsY20xcGJtVmtYQ0k3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCYmNISnZhbVZqZEdWa1VHOXpXekJkTENBdGNISnZhbVZqZEdWa1VHOXpXekZkWFR0Y2JpQWdmVnh1WEc0Z0lHRmtaQ2h2WW1wbFkzUXNJR3h2Yml3Z2JHRjBMQ0JsYkdWMktTQjdYRzRnSUNBZ2RHaHBjeTV6WlhSWGIzSnNaRkJ2YzJsMGFXOXVLRzlpYW1WamRDd2diRzl1TENCc1lYUXNJR1ZzWlhZcE8xeHVJQ0FnSUhSb2FYTXVYM05qWlc1bExtRmtaQ2h2WW1wbFkzUXBPMXh1SUNCOVhHNWNiaUFnYzJWMFYyOXliR1JRYjNOcGRHbHZiaWh2WW1wbFkzUXNJR3h2Yml3Z2JHRjBMQ0JsYkdWMktTQjdYRzRnSUNBZ1kyOXVjM1FnZDI5eWJHUkRiMjl5WkhNZ1BTQjBhR2x6TG14dmJreGhkRlJ2VjI5eWJHUkRiMjl5WkhNb2JHOXVMQ0JzWVhRcE8xeHVJQ0FnSUdsbUlDaGxiR1YySUNFOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJRzlpYW1WamRDNXdiM05wZEdsdmJpNTVJRDBnWld4bGRqdGNiaUFnSUNCOVhHNGdJQ0FnVzI5aWFtVmpkQzV3YjNOcGRHbHZiaTU0TENCdlltcGxZM1F1Y0c5emFYUnBiMjR1ZWwwZ1BTQjNiM0pzWkVOdmIzSmtjenRjYmlBZ2ZWeHVYRzRnSUhObGRFVnNaWFpoZEdsdmJpaGxiR1YyS1NCN1hHNGdJQ0FnZEdocGN5NWZZMkZ0WlhKaExuQnZjMmwwYVc5dUxua2dQU0JsYkdWMk8xeHVJQ0I5WEc1Y2JpQWdiMjRvWlhabGJuUk9ZVzFsTENCbGRtVnVkRWhoYm1Sc1pYSXBJSHRjYmlBZ0lDQjBhR2x6TGw5bGRtVnVkRWhoYm1Sc1pYSnpXMlYyWlc1MFRtRnRaVjBnUFNCbGRtVnVkRWhoYm1Sc1pYSTdYRzRnSUgxY2JseHVJQ0J6WlhSWGIzSnNaRTl5YVdkcGJpaHNiMjRzSUd4aGRDa2dlMXh1SUNBZ0lIUm9hWE11YVc1cGRHbGhiRkJ2YzJsMGFXOXVJRDBnZEdocGN5NWZjSEp2YWk1d2NtOXFaV04wS0d4dmJpd2diR0YwS1R0Y2JpQWdmVnh1WEc0Z0lGOW5jSE5TWldObGFYWmxaQ2h3YjNOcGRHbHZiaWtnZTF4dUlDQWdJR3hsZENCa2FYTjBUVzkyWldRZ1BTQk9kVzFpWlhJdVRVRllYMVpCVEZWRk8xeHVJQ0FnSUdsbUlDaHdiM05wZEdsdmJpNWpiMjl5WkhNdVlXTmpkWEpoWTNrZ1BEMGdkR2hwY3k1ZlozQnpUV2x1UVdOamRYSmhZM2twSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TGw5c1lYTjBRMjl2Y21SeklEMDlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgyeGhjM1JEYjI5eVpITWdQU0I3WEc0Z0lDQWdJQ0FnSUNBZ2JHRjBhWFIxWkdVNklIQnZjMmwwYVc5dUxtTnZiM0prY3k1c1lYUnBkSFZrWlN4Y2JpQWdJQ0FnSUNBZ0lDQnNiMjVuYVhSMVpHVTZJSEJ2YzJsMGFXOXVMbU52YjNKa2N5NXNiMjVuYVhSMVpHVXNYRzRnSUNBZ0lDQWdJSDA3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0JrYVhOMFRXOTJaV1FnUFNCMGFHbHpMbDlvWVhabGNuTnBibVZFYVhOMEtIUm9hWE11WDJ4aGMzUkRiMjl5WkhNc0lIQnZjMmwwYVc5dUxtTnZiM0prY3lrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCcFppQW9aR2x6ZEUxdmRtVmtJRDQ5SUhSb2FYTXVYMmR3YzAxcGJrUnBjM1JoYm1ObEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgyeGhjM1JEYjI5eVpITXViRzl1WjJsMGRXUmxJRDBnY0c5emFYUnBiMjR1WTI5dmNtUnpMbXh2Ym1kcGRIVmtaVHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiR0Z6ZEVOdmIzSmtjeTVzWVhScGRIVmtaU0E5SUhCdmMybDBhVzl1TG1OdmIzSmtjeTVzWVhScGRIVmtaVHRjYmx4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1cGJtbDBhV0ZzVUc5emFYUnBiMjVCYzA5eWFXZHBiaUFtSmlBaGRHaHBjeTVwYm1sMGFXRnNVRzl6YVhScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbk5sZEZkdmNteGtUM0pwWjJsdUtGeHVJQ0FnSUNBZ0lDQWdJQ0FnY0c5emFYUnBiMjR1WTI5dmNtUnpMbXh2Ym1kcGRIVmtaU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lIQnZjMmwwYVc5dUxtTnZiM0prY3k1c1lYUnBkSFZrWlZ4dUlDQWdJQ0FnSUNBZ0lDazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbk5sZEZkdmNteGtVRzl6YVhScGIyNG9YRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NWZZMkZ0WlhKaExGeHVJQ0FnSUNBZ0lDQWdJSEJ2YzJsMGFXOXVMbU52YjNKa2N5NXNiMjVuYVhSMVpHVXNYRzRnSUNBZ0lDQWdJQ0FnY0c5emFYUnBiMjR1WTI5dmNtUnpMbXhoZEdsMGRXUmxYRzRnSUNBZ0lDQWdJQ2s3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVgyVjJaVzUwU0dGdVpHeGxjbk5iWENKbmNITjFjR1JoZEdWY0lsMHBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbDlsZG1WdWRFaGhibVJzWlhKelcxd2laM0J6ZFhCa1lYUmxYQ0pkS0hCdmMybDBhVzl1TENCa2FYTjBUVzkyWldRcE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU5oYkdOMWJHRjBaU0JvWVhabGNuTnBibVVnWkdsemRHRnVZMlVnWW1WMGQyVmxiaUIwZDI4Z2JHRjBMMnh2YmlCd1lXbHljeTVjYmlBZ0lDcGNiaUFnSUNvZ1ZHRnJaVzRnWm5KdmJTQnZjbWxuYVc1aGJDQkJMVVp5WVcxbElHTnZiWEJ2Ym1WdWRITmNiaUFnSUNvdlhHNGdJRjlvWVhabGNuTnBibVZFYVhOMEtITnlZeXdnWkdWemRDa2dlMXh1SUNBZ0lHTnZibk4wSUdSc2IyNW5hWFIxWkdVZ1BTQlVTRkpGUlM1TllYUm9WWFJwYkhNdVpHVm5WRzlTWVdRb1pHVnpkQzVzYjI1bmFYUjFaR1VnTFNCemNtTXViRzl1WjJsMGRXUmxLVHRjYmlBZ0lDQmpiMjV6ZENCa2JHRjBhWFIxWkdVZ1BTQlVTRkpGUlM1TllYUm9WWFJwYkhNdVpHVm5WRzlTWVdRb1pHVnpkQzVzWVhScGRIVmtaU0F0SUhOeVl5NXNZWFJwZEhWa1pTazdYRzVjYmlBZ0lDQmpiMjV6ZENCaElEMWNiaUFnSUNBZ0lFMWhkR2d1YzJsdUtHUnNZWFJwZEhWa1pTQXZJRElwSUNvZ1RXRjBhQzV6YVc0b1pHeGhkR2wwZFdSbElDOGdNaWtnSzF4dUlDQWdJQ0FnVFdGMGFDNWpiM01vVkVoU1JVVXVUV0YwYUZWMGFXeHpMbVJsWjFSdlVtRmtLSE55WXk1c1lYUnBkSFZrWlNrcElDcGNiaUFnSUNBZ0lDQWdUV0YwYUM1amIzTW9WRWhTUlVVdVRXRjBhRlYwYVd4ekxtUmxaMVJ2VW1Ga0tHUmxjM1F1YkdGMGFYUjFaR1VwS1NBcVhHNGdJQ0FnSUNBZ0lDaE5ZWFJvTG5OcGJpaGtiRzl1WjJsMGRXUmxJQzhnTWlrZ0tpQk5ZWFJvTG5OcGJpaGtiRzl1WjJsMGRXUmxJQzhnTWlrcE8xeHVJQ0FnSUdOdmJuTjBJR0Z1WjJ4bElEMGdNaUFxSUUxaGRHZ3VZWFJoYmpJb1RXRjBhQzV6Y1hKMEtHRXBMQ0JOWVhSb0xuTnhjblFvTVNBdElHRXBLVHRjYmlBZ0lDQnlaWFIxY200Z1lXNW5iR1VnS2lBMk16Y3hNREF3TzF4dUlDQjlYRzU5WEc1Y2JtVjRjRzl5ZENCN0lFeHZZMkYwYVc5dVFtRnpaV1FnZlR0Y2JpSXNJbU5zWVhOeklGTndhRTFsY21OUWNtOXFaV04wYVc5dUlIdGNiaUFnWTI5dWMzUnlkV04wYjNJb0tTQjdYRzRnSUNBZ2RHaHBjeTVGUVZKVVNDQTlJRFF3TURjMU1ERTJMalk0TzF4dUlDQWdJSFJvYVhNdVNFRk1SbDlGUVZKVVNDQTlJREl3TURNM05UQTRMak0wTzF4dUlDQjlYRzVjYmlBZ2NISnZhbVZqZENoc2IyNHNJR3hoZENrZ2UxeHVJQ0FnSUhKbGRIVnliaUJiZEdocGN5NXNiMjVVYjFOd2FFMWxjbU1vYkc5dUtTd2dkR2hwY3k1c1lYUlViMU53YUUxbGNtTW9iR0YwS1YwN1hHNGdJSDFjYmx4dUlDQjFibkJ5YjJwbFkzUW9jSEp2YW1WamRHVmtLU0I3WEc0Z0lDQWdjbVYwZFhKdUlGdDBhR2x6TG5Od2FFMWxjbU5VYjB4dmJpaHdjbTlxWldOMFpXUmJNRjBwTENCMGFHbHpMbk53YUUxbGNtTlViMHhoZENod2NtOXFaV04wWldSYk1WMHBYVHRjYmlBZ2ZWeHVYRzRnSUd4dmJsUnZVM0JvVFdWeVl5aHNiMjRwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLR3h2YmlBdklERTRNQ2tnS2lCMGFHbHpMa2hCVEVaZlJVRlNWRWc3WEc0Z0lIMWNibHh1SUNCc1lYUlViMU53YUUxbGNtTW9iR0YwS1NCN1hHNGdJQ0FnZG1GeUlIa2dQU0JOWVhSb0xteHZaeWhOWVhSb0xuUmhiaWdvS0Rrd0lDc2diR0YwS1NBcUlFMWhkR2d1VUVrcElDOGdNell3S1NrZ0x5QW9UV0YwYUM1UVNTQXZJREU0TUNrN1hHNGdJQ0FnY21WMGRYSnVJQ2g1SUNvZ2RHaHBjeTVJUVV4R1gwVkJVbFJJS1NBdklERTRNQzR3TzF4dUlDQjlYRzVjYmlBZ2MzQm9UV1Z5WTFSdlRHOXVLSGdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLSGdnTHlCMGFHbHpMa2hCVEVaZlJVRlNWRWdwSUNvZ01UZ3dMakE3WEc0Z0lIMWNibHh1SUNCemNHaE5aWEpqVkc5TVlYUW9lU2tnZTF4dUlDQWdJSFpoY2lCc1lYUWdQU0FvZVNBdklIUm9hWE11U0VGTVJsOUZRVkpVU0NrZ0tpQXhPREF1TUR0Y2JpQWdJQ0JzWVhRZ1BWeHVJQ0FnSUNBZ0tERTRNQ0F2SUUxaGRHZ3VVRWtwSUNwY2JpQWdJQ0FnSUNneUlDb2dUV0YwYUM1aGRHRnVLRTFoZEdndVpYaHdLQ2hzWVhRZ0tpQk5ZWFJvTGxCSktTQXZJREU0TUNrcElDMGdUV0YwYUM1UVNTQXZJRElwTzF4dUlDQWdJSEpsZEhWeWJpQnNZWFE3WEc0Z0lIMWNibHh1SUNCblpYUkpSQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdYQ0psY0hObk9qTTROVGRjSWp0Y2JpQWdmVnh1ZlZ4dVhHNWxlSEJ2Y25RZ2V5QlRjR2hOWlhKalVISnZhbVZqZEdsdmJpQjlPMXh1SWl3aWFXMXdiM0owSUNvZ1lYTWdWRWhTUlVVZ1puSnZiU0JjSW5Sb2NtVmxYQ0k3WEc1Y2JtTnNZWE56SUZkbFltTmhiVkpsYm1SbGNtVnlJSHRjYmlBZ1kyOXVjM1J5ZFdOMGIzSW9jbVZ1WkdWeVpYSXNJSFpwWkdWdlJXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUhSb2FYTXVjbVZ1WkdWeVpYSWdQU0J5Wlc1a1pYSmxjanRjYmlBZ0lDQjBhR2x6TG5KbGJtUmxjbVZ5TG1GMWRHOURiR1ZoY2lBOUlHWmhiSE5sTzF4dUlDQWdJSFJvYVhNdWMyTmxibVZYWldKallXMGdQU0J1WlhjZ1ZFaFNSVVV1VTJObGJtVW9LVHRjYmlBZ0lDQnNaWFFnZG1sa1pXODdYRzRnSUNBZ2FXWWdLSFpwWkdWdlJXeGxiV1Z1ZENBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0IyYVdSbGJ5QTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb1hDSjJhV1JsYjF3aUtUdGNiaUFnSUNBZ0lIWnBaR1Z2TG5ObGRFRjBkSEpwWW5WMFpTaGNJbUYxZEc5d2JHRjVYQ0lzSUhSeWRXVXBPMXh1SUNBZ0lDQWdkbWxrWlc4dWMyVjBRWFIwY21saWRYUmxLRndpY0d4aGVYTnBibXhwYm1WY0lpd2dkSEoxWlNrN1hHNGdJQ0FnSUNCMmFXUmxieTV6ZEhsc1pTNWthWE53YkdGNUlEMGdYQ0p1YjI1bFhDSTdYRzRnSUNBZ0lDQmtiMk4xYldWdWRDNWliMlI1TG1Gd2NHVnVaRU5vYVd4a0tIWnBaR1Z2S1R0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdkbWxrWlc4Z1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0hacFpHVnZSV3hsYldWdWRDazdYRzRnSUNBZ2ZWeHVJQ0FnSUhSb2FYTXVaMlZ2YlNBOUlHNWxkeUJVU0ZKRlJTNVFiR0Z1WlVKMVptWmxja2RsYjIxbGRISjVLQ2s3WEc0Z0lDQWdkR2hwY3k1MFpYaDBkWEpsSUQwZ2JtVjNJRlJJVWtWRkxsWnBaR1Z2VkdWNGRIVnlaU2gyYVdSbGJ5azdYRzRnSUNBZ2RHaHBjeTV0WVhSbGNtbGhiQ0E5SUc1bGR5QlVTRkpGUlM1TlpYTm9RbUZ6YVdOTllYUmxjbWxoYkNoN0lHMWhjRG9nZEdocGN5NTBaWGgwZFhKbElIMHBPMXh1SUNBZ0lHTnZibk4wSUcxbGMyZ2dQU0J1WlhjZ1ZFaFNSVVV1VFdWemFDaDBhR2x6TG1kbGIyMHNJSFJvYVhNdWJXRjBaWEpwWVd3cE8xeHVJQ0FnSUhSb2FYTXVjMk5sYm1WWFpXSmpZVzB1WVdSa0tHMWxjMmdwTzF4dUlDQWdJSFJvYVhNdVkyRnRaWEpoVjJWaVkyRnRJRDBnYm1WM0lGUklVa1ZGTGs5eWRHaHZaM0poY0docFkwTmhiV1Z5WVNoY2JpQWdJQ0FnSUMwd0xqVXNYRzRnSUNBZ0lDQXdMalVzWEc0Z0lDQWdJQ0F3TGpVc1hHNGdJQ0FnSUNBdE1DNDFMRnh1SUNBZ0lDQWdNQ3hjYmlBZ0lDQWdJREV3WEc0Z0lDQWdLVHRjYmlBZ0lDQnBaaUFvYm1GMmFXZGhkRzl5TG0xbFpHbGhSR1YyYVdObGN5QW1KaUJ1WVhacFoyRjBiM0l1YldWa2FXRkVaWFpwWTJWekxtZGxkRlZ6WlhKTlpXUnBZU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1YzNSeVlXbHVkSE1nUFNCN1hHNGdJQ0FnSUNBZ0lIWnBaR1Z2T2lCN1hHNGdJQ0FnSUNBZ0lDQWdkMmxrZEdnNklERXlPREFzWEc0Z0lDQWdJQ0FnSUNBZ2FHVnBaMmgwT2lBM01qQXNYRzRnSUNBZ0lDQWdJQ0FnWm1GamFXNW5UVzlrWlRvZ1hDSmxiblpwY205dWJXVnVkRndpTEZ4dUlDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNBZ0lHNWhkbWxuWVhSdmNpNXRaV1JwWVVSbGRtbGpaWE5jYmlBZ0lDQWdJQ0FnTG1kbGRGVnpaWEpOWldScFlTaGpiMjV6ZEhKaGFXNTBjeWxjYmlBZ0lDQWdJQ0FnTG5Sb1pXNG9LSE4wY21WaGJTa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lHTnZibk52YkdVdWJHOW5LR0IxYzJsdVp5QjBhR1VnZDJWaVkyRnRJSE4xWTJObGMzTm1kV3hzZVM0dUxtQXBPMXh1SUNBZ0lDQWdJQ0FnSUhacFpHVnZMbk55WTA5aWFtVmpkQ0E5SUhOMGNtVmhiVHRjYmlBZ0lDQWdJQ0FnSUNCMmFXUmxieTV3YkdGNUtDazdYRzRnSUNBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0FnSUM1allYUmphQ2dvWlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1amNtVmhkR1ZGY25KdmNsQnZjSFZ3S0Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JjSWxkbFltTmhiU0JGY25KdmNseGNiazVoYldVNklGd2lJQ3NnWlM1dVlXMWxJQ3NnWENKY1hHNU5aWE56WVdkbE9pQmNJaUFySUdVdWJXVnpjMkZuWlZ4dUlDQWdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJQ0FnSUNCOUxDQXhNREF3S1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbU55WldGMFpVVnljbTl5VUc5d2RYQW9YQ0p6YjNKeWVTQXRJRzFsWkdsaElHUmxkbWxqWlhNZ1FWQkpJRzV2ZENCemRYQndiM0owWldSY0lpazdYRzRnSUNBZ0lDQjlMQ0F4TURBd0tUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQjFjR1JoZEdVb0tTQjdYRzRnSUNBZ2RHaHBjeTV5Wlc1a1pYSmxjaTVqYkdWaGNpZ3BPMXh1SUNBZ0lIUm9hWE11Y21WdVpHVnlaWEl1Y21WdVpHVnlLSFJvYVhNdWMyTmxibVZYWldKallXMHNJSFJvYVhNdVkyRnRaWEpoVjJWaVkyRnRLVHRjYmlBZ0lDQjBhR2x6TG5KbGJtUmxjbVZ5TG1Oc1pXRnlSR1Z3ZEdnb0tUdGNiaUFnZlZ4dVhHNGdJR1JwYzNCdmMyVW9LU0I3WEc0Z0lDQWdkR2hwY3k1dFlYUmxjbWxoYkM1a2FYTndiM05sS0NrN1hHNGdJQ0FnZEdocGN5NTBaWGgwZFhKbExtUnBjM0J2YzJVb0tUdGNiaUFnSUNCMGFHbHpMbWRsYjIwdVpHbHpjRzl6WlNncE8xeHVJQ0I5WEc1Y2JpQWdZM0psWVhSbFJYSnliM0pRYjNCMWNDaHRjMmNwSUh0Y2JpQWdJQ0JwWmlBb0lXUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0Z3aVpYSnliM0l0Y0c5d2RYQmNJaWtwSUh0Y2JpQWdJQ0FnSUhaaGNpQmxjbkp2Y2xCdmNIVndJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDaGNJbVJwZGx3aUtUdGNiaUFnSUNBZ0lHVnljbTl5VUc5d2RYQXVhVzV1WlhKSVZFMU1JRDBnYlhObk8xeHVJQ0FnSUNBZ1pYSnliM0pRYjNCMWNDNXpaWFJCZEhSeWFXSjFkR1VvWENKcFpGd2lMQ0JjSW1WeWNtOXlMWEJ2Y0hWd1hDSXBPMXh1SUNBZ0lDQWdaRzlqZFcxbGJuUXVZbTlrZVM1aGNIQmxibVJEYUdsc1pDaGxjbkp2Y2xCdmNIVndLVHRjYmlBZ0lDQjlYRzRnSUgxY2JuMWNibHh1Wlhod2IzSjBJSHNnVjJWaVkyRnRVbVZ1WkdWeVpYSWdmVHRjYmlJc0ltMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1gxOVhSVUpRUVVOTFgwVllWRVZTVGtGTVgwMVBSRlZNUlY5MGFISmxaVjlmT3lJc0lpOHZJRlJvWlNCdGIyUjFiR1VnWTJGamFHVmNiblpoY2lCZlgzZGxZbkJoWTJ0ZmJXOWtkV3hsWDJOaFkyaGxYMThnUFNCN2ZUdGNibHh1THk4Z1ZHaGxJSEpsY1hWcGNtVWdablZ1WTNScGIyNWNibVoxYm1OMGFXOXVJRjlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMThvYlc5a2RXeGxTV1FwSUh0Y2JseDBMeThnUTJobFkyc2dhV1lnYlc5a2RXeGxJR2x6SUdsdUlHTmhZMmhsWEc1Y2RIWmhjaUJqWVdOb1pXUk5iMlIxYkdVZ1BTQmZYM2RsWW5CaFkydGZiVzlrZFd4bFgyTmhZMmhsWDE5YmJXOWtkV3hsU1dSZE8xeHVYSFJwWmlBb1kyRmphR1ZrVFc5a2RXeGxJQ0U5UFNCMWJtUmxabWx1WldRcElIdGNibHgwWEhSeVpYUjFjbTRnWTJGamFHVmtUVzlrZFd4bExtVjRjRzl5ZEhNN1hHNWNkSDFjYmx4MEx5OGdRM0psWVhSbElHRWdibVYzSUcxdlpIVnNaU0FvWVc1a0lIQjFkQ0JwZENCcGJuUnZJSFJvWlNCallXTm9aU2xjYmx4MGRtRnlJRzF2WkhWc1pTQTlJRjlmZDJWaWNHRmphMTl0YjJSMWJHVmZZMkZqYUdWZlgxdHRiMlIxYkdWSlpGMGdQU0I3WEc1Y2RGeDBMeThnYm04Z2JXOWtkV3hsTG1sa0lHNWxaV1JsWkZ4dVhIUmNkQzh2SUc1dklHMXZaSFZzWlM1c2IyRmtaV1FnYm1WbFpHVmtYRzVjZEZ4MFpYaHdiM0owY3pvZ2UzMWNibHgwZlR0Y2JseHVYSFF2THlCRmVHVmpkWFJsSUhSb1pTQnRiMlIxYkdVZ1puVnVZM1JwYjI1Y2JseDBYMTkzWldKd1lXTnJYMjF2WkhWc1pYTmZYMXR0YjJSMWJHVkpaRjBvYlc5a2RXeGxMQ0J0YjJSMWJHVXVaWGh3YjNKMGN5d2dYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeWs3WEc1Y2JseDBMeThnVW1WMGRYSnVJSFJvWlNCbGVIQnZjblJ6SUc5bUlIUm9aU0J0YjJSMWJHVmNibHgwY21WMGRYSnVJRzF2WkhWc1pTNWxlSEJ2Y25Sek8xeHVmVnh1WEc0aUxDSXZMeUJuWlhSRVpXWmhkV3gwUlhod2IzSjBJR1oxYm1OMGFXOXVJR1p2Y2lCamIyMXdZWFJwWW1sc2FYUjVJSGRwZEdnZ2JtOXVMV2hoY20xdmJua2diVzlrZFd4bGMxeHVYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTV1SUQwZ0tHMXZaSFZzWlNrZ1BUNGdlMXh1WEhSMllYSWdaMlYwZEdWeUlEMGdiVzlrZFd4bElDWW1JRzF2WkhWc1pTNWZYMlZ6VFc5a2RXeGxJRDljYmx4MFhIUW9LU0E5UGlBb2JXOWtkV3hsV3lka1pXWmhkV3gwSjEwcElEcGNibHgwWEhRb0tTQTlQaUFvYlc5a2RXeGxLVHRjYmx4MFgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NWtLR2RsZEhSbGNpd2dleUJoT2lCblpYUjBaWElnZlNrN1hHNWNkSEpsZEhWeWJpQm5aWFIwWlhJN1hHNTlPeUlzSWk4dklHUmxabWx1WlNCblpYUjBaWElnWm5WdVkzUnBiMjV6SUdadmNpQm9ZWEp0YjI1NUlHVjRjRzl5ZEhOY2JsOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVaQ0E5SUNobGVIQnZjblJ6TENCa1pXWnBibWwwYVc5dUtTQTlQaUI3WEc1Y2RHWnZjaWgyWVhJZ2EyVjVJR2x1SUdSbFptbHVhWFJwYjI0cElIdGNibHgwWEhScFppaGZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbThvWkdWbWFXNXBkR2x2Yml3Z2EyVjVLU0FtSmlBaFgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXZLR1Y0Y0c5eWRITXNJR3RsZVNrcElIdGNibHgwWEhSY2RFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hsZUhCdmNuUnpMQ0JyWlhrc0lIc2daVzUxYldWeVlXSnNaVG9nZEhKMVpTd2daMlYwT2lCa1pXWnBibWwwYVc5dVcydGxlVjBnZlNrN1hHNWNkRngwZlZ4dVhIUjlYRzU5T3lJc0lsOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVieUE5SUNodlltb3NJSEJ5YjNBcElEMCtJQ2hQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMbWhoYzA5M2JsQnliM0JsY25SNUxtTmhiR3dvYjJKcUxDQndjbTl3S1NraUxDSXZMeUJrWldacGJtVWdYMTlsYzAxdlpIVnNaU0J2YmlCbGVIQnZjblJ6WEc1ZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxuSWdQU0FvWlhod2IzSjBjeWtnUFQ0Z2UxeHVYSFJwWmloMGVYQmxiMllnVTNsdFltOXNJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5QW1KaUJUZVcxaWIyd3VkRzlUZEhKcGJtZFVZV2NwSUh0Y2JseDBYSFJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pYaHdiM0owY3l3Z1UzbHRZbTlzTG5SdlUzUnlhVzVuVkdGbkxDQjdJSFpoYkhWbE9pQW5UVzlrZFd4bEp5QjlLVHRjYmx4MGZWeHVYSFJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pYaHdiM0owY3l3Z0oxOWZaWE5OYjJSMWJHVW5MQ0I3SUhaaGJIVmxPaUIwY25WbElIMHBPMXh1ZlRzaUxDSnBiWEJ2Y25RZ2V5Qk1iMk5oZEdsdmJrSmhjMlZrSUgwZ1puSnZiU0JjSWk0dmFuTXZiRzlqWVhScGIyNHRZbUZ6WldRdWFuTmNJanRjYm1sdGNHOXlkQ0I3SUZkbFltTmhiVkpsYm1SbGNtVnlJSDBnWm5KdmJTQmNJaTR2YW5NdmQyVmlZMkZ0TFhKbGJtUmxjbVZ5TG1welhDSTdYRzVwYlhCdmNuUWdleUJFWlhacFkyVlBjbWxsYm5SaGRHbHZia052Ym5SeWIyeHpJSDBnWm5KdmJTQmNJaTR2YW5NdlpHVjJhV05sTFc5eWFXVnVkR0YwYVc5dUxXTnZiblJ5YjJ4ekxtcHpYQ0k3WEc1Y2JtVjRjRzl5ZENCN0lFeHZZMkYwYVc5dVFtRnpaV1FzSUZkbFltTmhiVkpsYm1SbGNtVnlMQ0JFWlhacFkyVlBjbWxsYm5SaGRHbHZia052Ym5SeWIyeHpJSDA3WEc0aVhTd2libUZ0WlhNaU9sdGRMQ0p6YjNWeVkyVlNiMjkwSWpvaUluMD0iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4uL2xvY2F0aW9uLWJhc2VkL2FyanMtd2ViY2FtLXRleHR1cmVcIjtcbmltcG9ydCBcIi4vZ3BzLW5ldy1jYW1lcmFcIjtcbmltcG9ydCBcIi4vZ3BzLW5ldy1lbnRpdHktcGxhY2VcIjtcbmltcG9ydCBcIi4vYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==