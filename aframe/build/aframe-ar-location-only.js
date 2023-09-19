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
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe/src/location-based/ArjsDeviceOrientationControls.js":
/*!********************************************************************!*\
  !*** ./aframe/src/location-based/ArjsDeviceOrientationControls.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

/* NOTE that this is a modified version of THREE.DeviceOrientationControls to
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */



const ArjsDeviceOrientationControls = function (object) {
  var scope = this;

  this.object = object;
  this.object.rotation.reorder("YXZ");

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  this.smoothingFactor = 1;

  this.TWO_PI = 2 * Math.PI;
  this.HALF_PI = 0.5 * Math.PI;

  var onDeviceOrientationChangeEvent = function (event) {
    scope.deviceOrientation = event;
  };

  var onScreenOrientationChangeEvent = function () {
    scope.screenOrientation = window.orientation || 0;
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = (function () {
    var zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1);

    var euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();

    var q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    var q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    };
  })();

  this.connect = function () {
    onScreenOrientationChangeEvent();

    window.addEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false
    );
    window.addEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false
    );

    scope.enabled = true;
  };

  this.disconnect = function () {
    window.removeEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false
    );
    window.removeEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false
    );

    scope.enabled = false;
  };

  this.update = function () {
    if (scope.enabled === false) return;

    var device = scope.deviceOrientation;

    if (device) {
      var alpha = device.alpha
        ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.alpha) + scope.alphaOffset
        : 0; // Z

      var beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.beta) : 0; // X'

      var gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.gamma) : 0; // Y''

      var orient = scope.screenOrientation
        ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(scope.screenOrientation)
        : 0; // O

      // NW Added smoothing code
      var k = this.smoothingFactor;

      if (this.lastOrientation) {
        alpha = this._getSmoothedAngle(alpha, this.lastOrientation.alpha, k);
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
      setObjectQuaternion(
        scope.object.quaternion,
        alpha,
        beta - Math.PI,
        gamma - this.HALF_PI,
        orient
      );
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
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArjsDeviceOrientationControls);


/***/ }),

/***/ "./aframe/src/location-based/arjs-look-controls.js":
/*!*********************************************************!*\
  !*** ./aframe/src/location-based/arjs-look-controls.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
// To avoid recalculation at every mouse movement tick
var PI_2 = Math.PI / 2;

/**
 * look-controls. Update entity pose, factoring mouse, touch, and WebVR API data.
 */

/* NOTE that this is a modified version of A-Frame's look-controls to
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-look-controls", {
  dependencies: ["position", "rotation"],

  schema: {
    enabled: { default: true },
    magicWindowTrackingEnabled: { default: true },
    pointerLockEnabled: { default: false },
    reverseMouseDrag: { default: false },
    reverseTouchDrag: { default: false },
    touchEnabled: { default: true },
    smoothingFactor: { type: "number", default: 1 },
  },

  init: function () {
    this.deltaYaw = 0;
    this.previousHMDPosition = new THREE.Vector3();
    this.hmdQuaternion = new THREE.Quaternion();
    this.magicWindowAbsoluteEuler = new THREE.Euler();
    this.magicWindowDeltaEuler = new THREE.Euler();
    this.position = new THREE.Vector3();
    this.magicWindowObject = new THREE.Object3D();
    this.rotation = {};
    this.deltaRotation = {};
    this.savedPose = null;
    this.pointerLocked = false;
    this.setupMouseControls();
    this.bindMethods();
    this.previousMouseEvent = {};

    this.setupMagicWindowControls();

    // To save / restore camera pose
    this.savedPose = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
    };

    // Call enter VR handler if the scene has entered VR before the event listeners attached.
    if (this.el.sceneEl.is("vr-mode")) {
      this.onEnterVR();
    }
  },

  setupMagicWindowControls: function () {
    var magicWindowControls;
    var data = this.data;

    // Only on mobile devices and only enabled if DeviceOrientation permission has been granted.
    if (aframe__WEBPACK_IMPORTED_MODULE_0__.utils.device.isMobile()) {
      magicWindowControls = this.magicWindowControls =
        new _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__["default"](this.magicWindowObject);
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        DeviceOrientationEvent.requestPermission
      ) {
        magicWindowControls.enabled = false;
        if (
          this.el.sceneEl.components["device-orientation-permission-ui"]
            .permissionGranted
        ) {
          magicWindowControls.enabled = data.magicWindowTrackingEnabled;
        } else {
          this.el.sceneEl.addEventListener(
            "deviceorientationpermissiongranted",
            function () {
              magicWindowControls.enabled = data.magicWindowTrackingEnabled;
            }
          );
        }
      }
    }
  },

  update: function (oldData) {
    var data = this.data;

    // Disable grab cursor classes if no longer enabled.
    if (data.enabled !== oldData.enabled) {
      this.updateGrabCursor(data.enabled);
    }

    // Reset magic window eulers if tracking is disabled.
    if (
      oldData &&
      !data.magicWindowTrackingEnabled &&
      oldData.magicWindowTrackingEnabled
    ) {
      this.magicWindowAbsoluteEuler.set(0, 0, 0);
      this.magicWindowDeltaEuler.set(0, 0, 0);
    }

    // Pass on magic window tracking setting to magicWindowControls.
    if (this.magicWindowControls) {
      this.magicWindowControls.enabled = data.magicWindowTrackingEnabled;
      this.magicWindowControls.smoothingFactor = data.smoothingFactor;
    }

    if (oldData && !data.pointerLockEnabled !== oldData.pointerLockEnabled) {
      this.removeEventListeners();
      this.addEventListeners();
      if (this.pointerLocked) {
        this.exitPointerLock();
      }
    }
  },

  tick: function (t) {
    var data = this.data;
    if (!data.enabled) {
      return;
    }
    this.updateOrientation();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    if (this.pointerLocked) {
      this.exitPointerLock();
    }
  },

  remove: function () {
    this.removeEventListeners();
    if (this.pointerLocked) {
      this.exitPointerLock();
    }
  },

  bindMethods: function () {
    this.onMouseDown = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseDown, this);
    this.onMouseMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseMove, this);
    this.onMouseUp = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseUp, this);
    this.onTouchStart = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchStart, this);
    this.onTouchMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchMove, this);
    this.onTouchEnd = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchEnd, this);
    this.onEnterVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onEnterVR, this);
    this.onExitVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onExitVR, this);
    this.onPointerLockChange = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(
      this.onPointerLockChange,
      this
    );
    this.onPointerLockError = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onPointerLockError, this);
  },

  /**
   * Set up states and Object3Ds needed to store rotation data.
   */
  setupMouseControls: function () {
    this.mouseDown = false;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
  },

  /**
   * Add mouse and touch event listeners to canvas.
   */
  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // Wait for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener(
        "render-target-loaded",
        aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.addEventListeners, this)
      );
      return;
    }

    // Mouse events.
    canvasEl.addEventListener("mousedown", this.onMouseDown, false);
    window.addEventListener("mousemove", this.onMouseMove, false);
    window.addEventListener("mouseup", this.onMouseUp, false);

    // Touch events.
    canvasEl.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);

    // sceneEl events.
    sceneEl.addEventListener("enter-vr", this.onEnterVR);
    sceneEl.addEventListener("exit-vr", this.onExitVR);

    // Pointer Lock events.
    if (this.data.pointerLockEnabled) {
      document.addEventListener(
        "pointerlockchange",
        this.onPointerLockChange,
        false
      );
      document.addEventListener(
        "mozpointerlockchange",
        this.onPointerLockChange,
        false
      );
      document.addEventListener(
        "pointerlockerror",
        this.onPointerLockError,
        false
      );
    }
  },

  /**
   * Remove mouse and touch event listeners from canvas.
   */
  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;

    if (!canvasEl) {
      return;
    }

    // Mouse events.
    canvasEl.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);

    // Touch events.
    canvasEl.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);

    // sceneEl events.
    sceneEl.removeEventListener("enter-vr", this.onEnterVR);
    sceneEl.removeEventListener("exit-vr", this.onExitVR);

    // Pointer Lock events.
    document.removeEventListener(
      "pointerlockchange",
      this.onPointerLockChange,
      false
    );
    document.removeEventListener(
      "mozpointerlockchange",
      this.onPointerLockChange,
      false
    );
    document.removeEventListener(
      "pointerlockerror",
      this.onPointerLockError,
      false
    );
  },

  /**
   * Update orientation for mobile, mouse drag, and headset.
   * Mouse-drag only enabled if HMD is not active.
   */
  updateOrientation: (function () {
    var poseMatrix = new THREE.Matrix4();

    return function () {
      var object3D = this.el.object3D;
      var pitchObject = this.pitchObject;
      var yawObject = this.yawObject;
      var pose;
      var sceneEl = this.el.sceneEl;

      // In VR mode, THREE is in charge of updating the camera pose.
      if (sceneEl.is("vr-mode") && sceneEl.checkHeadsetConnected()) {
        // With WebXR THREE applies headset pose to the object3D matrixWorld internally.
        // Reflect values back on position, rotation, scale for getAttribute to return the expected values.
        if (sceneEl.hasWebXR) {
          pose = sceneEl.renderer.xr.getCameraPose();
          if (pose) {
            poseMatrix.elements = pose.transform.matrix;
            poseMatrix.decompose(
              object3D.position,
              object3D.rotation,
              object3D.scale
            );
          }
        }
        return;
      }

      this.updateMagicWindowOrientation();

      // On mobile, do camera rotation with touch events and sensors.
      object3D.rotation.x =
        this.magicWindowDeltaEuler.x + pitchObject.rotation.x;
      object3D.rotation.y = this.magicWindowDeltaEuler.y + yawObject.rotation.y;
      object3D.rotation.z = this.magicWindowDeltaEuler.z;
    };
  })(),

  updateMagicWindowOrientation: function () {
    var magicWindowAbsoluteEuler = this.magicWindowAbsoluteEuler;
    var magicWindowDeltaEuler = this.magicWindowDeltaEuler;
    // Calculate magic window HMD quaternion.
    if (this.magicWindowControls && this.magicWindowControls.enabled) {
      this.magicWindowControls.update();
      magicWindowAbsoluteEuler.setFromQuaternion(
        this.magicWindowObject.quaternion,
        "YXZ"
      );
      if (!this.previousMagicWindowYaw && magicWindowAbsoluteEuler.y !== 0) {
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
      if (this.previousMagicWindowYaw) {
        magicWindowDeltaEuler.x = magicWindowAbsoluteEuler.x;
        magicWindowDeltaEuler.y +=
          magicWindowAbsoluteEuler.y - this.previousMagicWindowYaw;
        magicWindowDeltaEuler.z = magicWindowAbsoluteEuler.z;
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
    }
  },

  /**
   * Translate mouse drag into rotation.
   *
   * Dragging up and down rotates the camera around the X-axis (yaw).
   * Dragging left and right rotates the camera around the Y-axis (pitch).
   */
  onMouseMove: function (evt) {
    var direction;
    var movementX;
    var movementY;
    var pitchObject = this.pitchObject;
    var previousMouseEvent = this.previousMouseEvent;
    var yawObject = this.yawObject;

    // Not dragging or not enabled.
    if (!this.data.enabled || (!this.mouseDown && !this.pointerLocked)) {
      return;
    }

    // Calculate delta.
    if (this.pointerLocked) {
      movementX = evt.movementX || evt.mozMovementX || 0;
      movementY = evt.movementY || evt.mozMovementY || 0;
    } else {
      movementX = evt.screenX - previousMouseEvent.screenX;
      movementY = evt.screenY - previousMouseEvent.screenY;
    }
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;

    // Calculate rotation.
    direction = this.data.reverseMouseDrag ? 1 : -1;
    yawObject.rotation.y += movementX * 0.002 * direction;
    pitchObject.rotation.x += movementY * 0.002 * direction;
    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );
  },

  /**
   * Register mouse down to detect mouse drag.
   */
  onMouseDown: function (evt) {
    var sceneEl = this.el.sceneEl;
    if (
      !this.data.enabled ||
      (sceneEl.is("vr-mode") && sceneEl.checkHeadsetConnected())
    ) {
      return;
    }
    // Handle only primary button.
    if (evt.button !== 0) {
      return;
    }

    var canvasEl = sceneEl && sceneEl.canvas;

    this.mouseDown = true;
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;
    this.showGrabbingCursor();

    if (this.data.pointerLockEnabled && !this.pointerLocked) {
      if (canvasEl.requestPointerLock) {
        canvasEl.requestPointerLock();
      } else if (canvasEl.mozRequestPointerLock) {
        canvasEl.mozRequestPointerLock();
      }
    }
  },

  /**
   * Shows grabbing cursor on scene
   */
  showGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = "grabbing";
  },

  /**
   * Hides grabbing cursor on scene
   */
  hideGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = "";
  },

  /**
   * Register mouse up to detect release of mouse drag.
   */
  onMouseUp: function () {
    this.mouseDown = false;
    this.hideGrabbingCursor();
  },

  /**
   * Register touch down to detect touch drag.
   */
  onTouchStart: function (evt) {
    if (
      evt.touches.length !== 1 ||
      !this.data.touchEnabled ||
      this.el.sceneEl.is("vr-mode")
    ) {
      return;
    }
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY,
    };
    this.touchStarted = true;
  },

  /**
   * Translate touch move to Y-axis rotation.
   */
  onTouchMove: function (evt) {
    var direction;
    var canvas = this.el.sceneEl.canvas;
    var deltaY;
    var yawObject = this.yawObject;

    if (!this.touchStarted || !this.data.touchEnabled) {
      return;
    }

    deltaY =
      (2 * Math.PI * (evt.touches[0].pageX - this.touchStart.x)) /
      canvas.clientWidth;

    direction = this.data.reverseTouchDrag ? 1 : -1;
    // Limit touch orientaion to to yaw (y axis).
    yawObject.rotation.y -= deltaY * 0.5 * direction;
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY,
    };
  },

  /**
   * Register touch end to detect release of touch drag.
   */
  onTouchEnd: function () {
    this.touchStarted = false;
  },

  /**
   * Save pose.
   */
  onEnterVR: function () {
    var sceneEl = this.el.sceneEl;
    if (!sceneEl.checkHeadsetConnected()) {
      return;
    }
    this.saveCameraPose();
    this.el.object3D.position.set(0, 0, 0);
    this.el.object3D.rotation.set(0, 0, 0);
    if (sceneEl.hasWebXR) {
      this.el.object3D.matrixAutoUpdate = false;
      this.el.object3D.updateMatrix();
    }
  },

  /**
   * Restore the pose.
   */
  onExitVR: function () {
    if (!this.el.sceneEl.checkHeadsetConnected()) {
      return;
    }
    this.restoreCameraPose();
    this.previousHMDPosition.set(0, 0, 0);
    this.el.object3D.matrixAutoUpdate = true;
  },

  /**
   * Update Pointer Lock state.
   */
  onPointerLockChange: function () {
    this.pointerLocked = !!(
      document.pointerLockElement || document.mozPointerLockElement
    );
  },

  /**
   * Recover from Pointer Lock error.
   */
  onPointerLockError: function () {
    this.pointerLocked = false;
  },

  // Exits pointer-locked mode.
  exitPointerLock: function () {
    document.exitPointerLock();
    this.pointerLocked = false;
  },

  /**
   * Toggle the feature of showing/hiding the grab cursor.
   */
  updateGrabCursor: function (enabled) {
    var sceneEl = this.el.sceneEl;

    function enableGrabCursor() {
      sceneEl.canvas.classList.add("a-grab-cursor");
    }
    function disableGrabCursor() {
      sceneEl.canvas.classList.remove("a-grab-cursor");
    }

    if (!sceneEl.canvas) {
      if (enabled) {
        sceneEl.addEventListener("render-target-loaded", enableGrabCursor);
      } else {
        sceneEl.addEventListener("render-target-loaded", disableGrabCursor);
      }
      return;
    }

    if (enabled) {
      enableGrabCursor();
      return;
    }
    disableGrabCursor();
  },

  /**
   * Save camera pose before entering VR to restore later if exiting.
   */
  saveCameraPose: function () {
    var el = this.el;

    this.savedPose.position.copy(el.object3D.position);
    this.savedPose.rotation.copy(el.object3D.rotation);
    this.hasSavedPose = true;
  },

  /**
   * Reset camera pose to before entering VR.
   */
  restoreCameraPose: function () {
    var el = this.el;
    var savedPose = this.savedPose;

    if (!this.hasSavedPose) {
      return;
    }

    // Reset camera orientation.
    el.object3D.position.copy(savedPose.position);
    el.object3D.rotation.copy(savedPose.rotation);
    this.hasSavedPose = false;
  },
});


/***/ }),

/***/ "./aframe/src/location-based/arjs-webcam-texture.js":
/*!**********************************************************!*\
  !*** ./aframe/src/location-based/arjs-webcam-texture.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./aframe/src/location-based/gps-camera.js":
/*!*************************************************!*\
  !*** ./aframe/src/location-based/gps-camera.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);
/*
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-camera", {
  _watchPositionId: null,
  originCoords: null,
  currentCoords: null,
  lookControls: null,
  heading: null,
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
      default: 0,
    },
    positionMinAccuracy: {
      type: "int",
      default: 100,
    },
    alert: {
      type: "boolean",
      default: false,
    },
    minDistance: {
      type: "int",
      default: 0,
    },
    maxDistance: {
      type: "int",
      default: 0,
    },
    gpsMinDistance: {
      type: "number",
      default: 5,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
  },
  update: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.longitude = this.data.simulateLongitude;
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.altitude = this.data.simulateAltitude;
      this.currentCoords = localPosition;

      // re-trigger initialization for new origin
      this.originCoords = null;
      this._updatePosition();
    }
  },
  init: function () {
    if (
      !this.el.components["arjs-look-controls"] &&
      !this.el.components["look-controls"]
    ) {
      return;
    }

    this.lastPosition = {
      latitude: 0,
      longitude: 0,
    };

    this.loader = document.createElement("DIV");
    this.loader.classList.add("arjs-loader");
    document.body.appendChild(this.loader);

    this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
    window.addEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );

    this.lookControls =
      this.el.components["arjs-look-controls"] ||
      this.el.components["look-controls"];

    // listen to deviceorientation event
    var eventName = this._getDeviceOrientationEventName();
    this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      // iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
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
        var timeout = setTimeout(function () {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
          );
        }, 750);
        window.addEventListener(eventName, function () {
          clearTimeout(timeout);
        });
      }
    }

    window.addEventListener(eventName, this._onDeviceOrientation, false);
  },

  play: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.longitude = this.data.simulateLongitude;
      if (this.data.simulateAltitude !== 0) {
        localPosition.altitude = this.data.simulateAltitude;
      }
      this.currentCoords = localPosition;
      this._updatePosition();
    } else {
      this._watchPositionId = this._initWatchGPS(
        function (position) {
          var localPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
          };

          if (this.data.simulateAltitude !== 0) {
            localPosition.altitude = this.data.simulateAltitude;
          }

          this.currentCoords = localPosition;
          var distMoved = this._haversineDist(
            this.lastPosition,
            this.currentCoords
          );

          if (distMoved >= this.data.gpsMinDistance || !this.originCoords) {
            this._updatePosition();
            this.lastPosition = {
              longitude: this.currentCoords.longitude,
              latitude: this.currentCoords.latitude,
            };
          }
        }.bind(this)
      );
    }
  },

  tick: function () {
    if (this.heading === null) {
      return;
    }
    this._updateRotation();
  },

  pause: function () {
    if (this._watchPositionId) {
      navigator.geolocation.clearWatch(this._watchPositionId);
    }
    this._watchPositionId = null;
  },

  remove: function () {
    var eventName = this._getDeviceOrientationEventName();
    window.removeEventListener(eventName, this._onDeviceOrientation, false);

    window.removeEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );
  },

  /**
   * Get device orientation event name, depends on browser implementation.
   * @returns {string} event name
   */
  _getDeviceOrientationEventName: function () {
    if ("ondeviceorientationabsolute" in window) {
      var eventName = "deviceorientationabsolute";
    } else if ("ondeviceorientation" in window) {
      var eventName = "deviceorientation";
    } else {
      var eventName = "";
      console.error("Compass not supported");
    }

    return eventName;
  },

  /**
   * Get current user position.
   *
   * @param {function} onSuccess
   * @param {function} onError
   * @returns {Promise}
   */
  _initWatchGPS: function (onSuccess, onError) {
    if (!onError) {
      const that = this
      onError = function (err) {
        console.warn("ERROR(" + err.code + "): " + err.message);

        if (err.code === 1) {
          // User denied GeoLocation, let their know that
          that.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website."
          );
          return;
        }

        if (err.code === 3) {
          that.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Cannot retrieve GPS position. Signal is absent."
          );
          return;
        }
      };
    }

    if ("geolocation" in navigator === false) {
      onError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
      return Promise.resolve();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    return navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: this.data.gpsTimeInterval,
      timeout: 27000,
    });
  },

  /**
   * Update user position.
   *
   * @returns {void}
   */
  _updatePosition: function () {
    // don't update if accuracy is not good enough
    if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
      if (this.data.alert && !document.getElementById("alert-popup")) {
        var popup = document.createElement("div");
        popup.innerHTML =
          "GPS signal is very poor. Try move outdoor or to an area with a better signal.";
        popup.setAttribute("id", "alert-popup");
        document.body.appendChild(popup);
      }
      return;
    }

    var alertPopup = document.getElementById("alert-popup");
    if (
      this.currentCoords.accuracy <= this.data.positionMinAccuracy &&
      alertPopup
    ) {
      document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
      // first camera initialization
      this.originCoords = this.currentCoords;
      this._setPosition();

      var loader = document.querySelector(".arjs-loader");
      if (loader) {
        loader.remove();
      }
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    } else {
      this._setPosition();
    }
  },
  _setPosition: function () {
    var position = this.el.getAttribute("position");

    // compute position.x
    var dstCoords = {
      longitude: this.currentCoords.longitude,
      latitude: this.originCoords.latitude,
    };

    position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.x *=
      this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

    // compute position.z
    var dstCoords = {
      longitude: this.originCoords.longitude,
      latitude: this.currentCoords.latitude,
    };

    position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.z *=
      this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

    // update position
    this.el.setAttribute("position", position);

    window.dispatchEvent(
      new CustomEvent("gps-camera-update-position", {
        detail: { position: this.currentCoords, origin: this.originCoords },
      })
    );
  },
  /**
   * Returns distance in meters between source and destination inputs.
   *
   *  Calculate distance, bearing and more between Latitude/Longitude points
   *  Details: https://www.movable-type.co.uk/scripts/latlong.html
   *
   * @param {Position} src
   * @param {Position} dest
   * @param {Boolean} isPlace
   *
   * @returns {number} distance | Number.MAX_SAFE_INTEGER
   */
  computeDistanceMeters: function (src, dest, isPlace) {
    var distance = this._haversineDist(src, dest);

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the caller
    if (
      isPlace &&
      this.data.minDistance &&
      this.data.minDistance > 0 &&
      distance < this.data.minDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    // if function has been called for a place, and if it's too far and a max distance has been set,
    // return max distance possible - to be handled by the caller
    if (
      isPlace &&
      this.data.maxDistance &&
      this.data.maxDistance > 0 &&
      distance > this.data.maxDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    return distance;
  },

  _haversineDist: function (src, dest) {
    var dlongitude = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.longitude - src.longitude);
    var dlatitude = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.latitude - src.latitude);

    var a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(src.latitude)) *
        Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },

  /**
   * Compute compass heading.
   *
   * @param {number} alpha
   * @param {number} beta
   * @param {number} gamma
   *
   * @returns {number} compass heading
   */
  _computeCompassHeading: function (alpha, beta, gamma) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
      compassHeading += Math.PI;
    } else if (rA < 0) {
      compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
  },

  /**
   * Handler for device orientation event.
   *
   * @param {Event} event
   * @returns {void}
   */
  _onDeviceOrientation: function (event) {
    if (event.webkitCompassHeading !== undefined) {
      if (event.webkitCompassAccuracy < 50) {
        this.heading = event.webkitCompassHeading;
      } else {
        console.warn("webkitCompassAccuracy is event.webkitCompassAccuracy");
      }
    } else if (event.alpha !== null) {
      if (event.absolute === true || event.absolute === undefined) {
        this.heading = this._computeCompassHeading(
          event.alpha,
          event.beta,
          event.gamma
        );
      } else {
        console.warn("event.absolute === false");
      }
    } else {
      console.warn("event.alpha === null");
    }
  },

  /**
   * Update user rotation data.
   *
   * @returns {void}
   */
  _updateRotation: function () {
    var heading = 360 - this.heading;
    var cameraRotation = this.el.getAttribute("rotation").y;
    var yawRotation = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.radToDeg(
      this.lookControls.yawObject.rotation.y
    );
    var offset = (heading - (cameraRotation - yawRotation)) % 360;
    this.lookControls.yawObject.rotation.y = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(offset);
  },

  _onGpsEntityPlaceAdded: function () {
    // if places are added after camera initialization is finished
    if (this.originCoords) {
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    }
    if (this.loader && this.loader.parentElement) {
      document.body.removeChild(this.loader);
    }
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-entity-place.js":
/*!*******************************************************!*\
  !*** ./aframe/src/location-based/gps-entity-place.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-entity-place", {
  _cameraGps: null,
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
  remove: function () {
    // cleaning listeners when the entity is removed from the DOM
    window.removeEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.removeEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );
  },
  init: function () {
    this.coordSetListener = () => {
      if (!this._cameraGps) {
        var camera = document.querySelector("[gps-camera]");
        if (!camera.components["gps-camera"]) {
          console.error("gps-camera not initialized");
          return;
        }
        this._cameraGps = camera.components["gps-camera"];
      }
      this._updatePosition();
    };

    this.updatePositionListener = (ev) => {
      if (!this.data || !this._cameraGps) {
        return;
      }

      var dstCoords = {
        longitude: this.data.longitude,
        latitude: this.data.latitude,
      };

      // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
      var distanceForMsg = this._cameraGps.computeDistanceMeters(
        ev.detail.position,
        dstCoords
      );

      this.el.setAttribute("distance", distanceForMsg);
      this.el.setAttribute("distanceMsg", this._formatDistance(distanceForMsg));
      this.el.dispatchEvent(
        new CustomEvent("gps-entity-place-update-position", {
          detail: { distance: distanceForMsg },
        })
      );

      var actualDistance = this._cameraGps.computeDistanceMeters(
        ev.detail.position,
        dstCoords,
        true
      );

      if (actualDistance === Number.MAX_SAFE_INTEGER) {
        this.hideForMinDistance(this.el, true);
      } else {
        this.hideForMinDistance(this.el, false);
      }
    };

    window.addEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.addEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );

    this._positionXDebug = 0;

    window.dispatchEvent(
      new CustomEvent("gps-entity-place-added", {
        detail: { component: this.el },
      })
    );
  },
  /**
   * Hide entity according to minDistance property
   * @returns {void}
   */
  hideForMinDistance: function (el, hideEntity) {
    if (hideEntity) {
      el.setAttribute("visible", "false");
    } else {
      el.setAttribute("visible", "true");
    }
  },
  /**
   * Update place position
   * @returns {void}
   */
  _updatePosition: function () {
    var position = { x: 0, y: this.el.getAttribute("position").y || 0, z: 0 };

    // update position.x
    var dstCoords = {
      longitude: this.data.longitude,
      latitude: this._cameraGps.originCoords.latitude,
    };

    position.x = this._cameraGps.computeDistanceMeters(
      this._cameraGps.originCoords,
      dstCoords
    );

    this._positionXDebug = position.x;

    position.x *=
      this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1;

    // update position.z
    var dstCoords = {
      longitude: this._cameraGps.originCoords.longitude,
      latitude: this.data.latitude,
    };

    position.z = this._cameraGps.computeDistanceMeters(
      this._cameraGps.originCoords,
      dstCoords
    );

    position.z *=
      this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1;

    if (position.y !== 0) {
      var altitude =
        this._cameraGps.originCoords.altitude !== undefined
          ? this._cameraGps.originCoords.altitude
          : 0;
      position.y = position.y - altitude;
    }

    // update element's position in 3D world
    this.el.setAttribute("position", position);
  },

  /**
   * Format distances string
   *
   * @param {String} distance
   */

  _formatDistance: function (distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
      return distance / 1000 + " kilometers";
    }

    return distance + " meters";
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-camera.js":
/*!***********************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-camera.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-camera
 *
 * based on the original gps-camera, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original position (lat/lon) is projected into Spherical Mercator and
 * stored.
 *
 * Then, when we receive a new position (lat/lon), this new position is
 * projected into Spherical Mercator and then its world position calculated
 * by comparing against the original position.
 *
 * The same is also the case for 'entity-places'; when these are added, their
 * Spherical Mercator coords are calculated (see gps-projected-entity-place).
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 *
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-projected-camera", {
  _watchPositionId: null,
  originCoords: null, // original coords now in Spherical Mercator
  currentCoords: null,
  lookControls: null,
  heading: null,
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
      default: 0,
    },
    positionMinAccuracy: {
      type: "int",
      default: 100,
    },
    alert: {
      type: "boolean",
      default: false,
    },
    minDistance: {
      type: "int",
      default: 0,
    },
    gpsMinDistance: {
      type: "number",
      default: 0,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
  },
  update: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.longitude = this.data.simulateLongitude;
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.altitude = this.data.simulateAltitude;
      this.currentCoords = localPosition;

      // re-trigger initialization for new origin
      this.originCoords = null;
      this._updatePosition();
    }
  },
  init: function () {
    if (
      !this.el.components["arjs-look-controls"] &&
      !this.el.components["look-controls"]
    ) {
      return;
    }

    this.lastPosition = {
      latitude: 0,
      longitude: 0,
    };

    this.loader = document.createElement("DIV");
    this.loader.classList.add("arjs-loader");
    document.body.appendChild(this.loader);

    this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
    window.addEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );

    this.lookControls =
      this.el.components["arjs-look-controls"] ||
      this.el.components["look-controls"];

    // listen to deviceorientation event
    var eventName = this._getDeviceOrientationEventName();
    this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      // iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
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
        var timeout = setTimeout(function () {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
          );
        }, 750);
        window.addEventListener(eventName, function () {
          clearTimeout(timeout);
        });
      }
    }

    window.addEventListener(eventName, this._onDeviceOrientation, false);
  },

  play: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.longitude = this.data.simulateLongitude;
      if (this.data.simulateAltitude !== 0) {
        localPosition.altitude = this.data.simulateAltitude;
      }
      this.currentCoords = localPosition;
      this._updatePosition();
    } else {
      this._watchPositionId = this._initWatchGPS(
        function (position) {
          var localPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
          };

          if (this.data.simulateAltitude !== 0) {
            localPosition.altitude = this.data.simulateAltitude;
          }

          this.currentCoords = localPosition;
          var distMoved = this._haversineDist(
            this.lastPosition,
            this.currentCoords
          );

          if (distMoved >= this.data.gpsMinDistance || !this.originCoords) {
            this._updatePosition();
            this.lastPosition = {
              longitude: this.currentCoords.longitude,
              latitude: this.currentCoords.latitude,
            };
          }
        }.bind(this)
      );
    }
  },

  tick: function () {
    if (this.heading === null) {
      return;
    }
    this._updateRotation();
  },

  pause: function () {
    if (this._watchPositionId) {
      navigator.geolocation.clearWatch(this._watchPositionId);
    }
    this._watchPositionId = null;
  },

  remove: function () {
    var eventName = this._getDeviceOrientationEventName();
    window.removeEventListener(eventName, this._onDeviceOrientation, false);
    window.removeEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );
  },

  /**
   * Get device orientation event name, depends on browser implementation.
   * @returns {string} event name
   */
  _getDeviceOrientationEventName: function () {
    if ("ondeviceorientationabsolute" in window) {
      var eventName = "deviceorientationabsolute";
    } else if ("ondeviceorientation" in window) {
      var eventName = "deviceorientation";
    } else {
      var eventName = "";
      console.error("Compass not supported");
    }

    return eventName;
  },

  /**
   * Get current user position.
   *
   * @param {function} onSuccess
   * @param {function} onError
   * @returns {Promise}
   */
  _initWatchGPS: function (onSuccess, onError) {
    if (!onError) {
      onError = function (err) {
        console.warn("ERROR(" + err.code + "): " + err.message);

        if (err.code === 1) {
          // User denied GeoLocation, let their know that
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website."
          );
          return;
        }

        if (err.code === 3) {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Cannot retrieve GPS position. Signal is absent."
          );
          return;
        }
      };
    }

    if ("geolocation" in navigator === false) {
      onError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
      return Promise.resolve();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    return navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: this.data.gpsTimeInterval,
      timeout: 27000,
    });
  },

  /**
   * Update user position.
   *
   * @returns {void}
   */
  _updatePosition: function () {
    // don't update if accuracy is not good enough
    if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
      if (this.data.alert && !document.getElementById("alert-popup")) {
        var popup = document.createElement("div");
        popup.innerHTML =
          "GPS signal is very poor. Try move outdoor or to an area with a better signal.";
        popup.setAttribute("id", "alert-popup");
        document.body.appendChild(popup);
      }
      return;
    }

    var alertPopup = document.getElementById("alert-popup");
    if (
      this.currentCoords.accuracy <= this.data.positionMinAccuracy &&
      alertPopup
    ) {
      document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
      // first camera initialization
      // Now store originCoords as PROJECTED original lat/lon, so that
      // we can set the world origin to the original position in "metres"
      this.originCoords = this._project(
        this.currentCoords.latitude,
        this.currentCoords.longitude
      );
      this._setPosition();

      var loader = document.querySelector(".arjs-loader");
      if (loader) {
        loader.remove();
      }
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    } else {
      this._setPosition();
    }
  },
  /**
   * Set the current position (in world coords, based on Spherical Mercator)
   *
   * @returns {void}
   */
  _setPosition: function () {
    var position = this.el.getAttribute("position");

    var worldCoords = this.latLonToWorld(
      this.currentCoords.latitude,
      this.currentCoords.longitude
    );

    position.x = worldCoords[0];
    position.z = worldCoords[1];

    // update position
    this.el.setAttribute("position", position);

    // add the sphmerc position to the event (for testing only)
    window.dispatchEvent(
      new CustomEvent("gps-camera-update-position", {
        detail: { position: this.currentCoords, origin: this.originCoords },
      })
    );
  },
  /**
   * Returns distance in meters between camera and destination input.
   *
   * Assume we are using a metre-based projection. Not all 'metre-based'
   * projections give exact metres, e.g. Spherical Mercator, but it appears
   * close enough to be used for AR at least in middle temperate
   * latitudes (40 - 55). It is heavily distorted near the poles, however.
   *
   * @param {Position} dest
   * @param {Boolean} isPlace
   *
   * @returns {number} distance | Number.MAX_SAFE_INTEGER
   */
  computeDistanceMeters: function (dest, isPlace) {
    var src = this.el.getAttribute("position");
    var dx = dest.x - src.x;
    var dz = dest.z - src.z;
    var distance = Math.sqrt(dx * dx + dz * dz);

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the  method caller
    if (
      isPlace &&
      this.data.minDistance &&
      this.data.minDistance > 0 &&
      distance < this.data.minDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    return distance;
  },
  /**
   * Converts latitude/longitude to OpenGL world coordinates.
   *
   * First projects lat/lon to absolute Spherical Mercator and then
   * calculates the world coordinates by comparing the Spherical Mercator
   * coordinates with the Spherical Mercator coordinates of the origin point.
   *
   * @param {Number} lat
   * @param {Number} lon
   *
   * @returns {array} world coordinates
   */
  latLonToWorld: function (lat, lon) {
    var projected = this._project(lat, lon);
    // Sign of z needs to be reversed compared to projected coordinates
    return [
      projected[0] - this.originCoords[0],
      -(projected[1] - this.originCoords[1]),
    ];
  },
  /**
   * Converts latitude/longitude to Spherical Mercator coordinates.
   * Algorithm is used in several OpenStreetMap-related applications.
   *
   * @param {Number} lat
   * @param {Number} lon
   *
   * @returns {array} Spherical Mercator coordinates
   */
  _project: function (lat, lon) {
    const HALF_EARTH = 20037508.34;

    // Convert the supplied coords to Spherical Mercator (EPSG:3857), also
    // known as 'Google Projection', using the algorithm used extensively
    // in various OpenStreetMap software.
    var y =
      Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
    return [(lon / 180.0) * HALF_EARTH, (y * HALF_EARTH) / 180.0];
  },
  /**
   * Converts Spherical Mercator coordinates to latitude/longitude.
   * Algorithm is used in several OpenStreetMap-related applications.
   *
   * @param {Number} spherical mercator easting
   * @param {Number} spherical mercator northing
   *
   * @returns {object} lon/lat
   */
  _unproject: function (e, n) {
    const HALF_EARTH = 20037508.34;
    var yp = (n / HALF_EARTH) * 180.0;
    return {
      longitude: (e / HALF_EARTH) * 180.0,
      latitude:
        (180.0 / Math.PI) *
        (2 * Math.atan(Math.exp((yp * Math.PI) / 180.0)) - Math.PI / 2),
    };
  },
  /**
   * Compute compass heading.
   *
   * @param {number} alpha
   * @param {number} beta
   * @param {number} gamma
   *
   * @returns {number} compass heading
   */
  _computeCompassHeading: function (alpha, beta, gamma) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
      compassHeading += Math.PI;
    } else if (rA < 0) {
      compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
  },

  /**
   * Handler for device orientation event.
   *
   * @param {Event} event
   * @returns {void}
   */
  _onDeviceOrientation: function (event) {
    if (event.webkitCompassHeading !== undefined) {
      if (event.webkitCompassAccuracy < 50) {
        this.heading = event.webkitCompassHeading;
      } else {
        console.warn("webkitCompassAccuracy is event.webkitCompassAccuracy");
      }
    } else if (event.alpha !== null) {
      if (event.absolute === true || event.absolute === undefined) {
        this.heading = this._computeCompassHeading(
          event.alpha,
          event.beta,
          event.gamma
        );
      } else {
        console.warn("event.absolute === false");
      }
    } else {
      console.warn("event.alpha === null");
    }
  },

  /**
   * Update user rotation data.
   *
   * @returns {void}
   */
  _updateRotation: function () {
    var heading = 360 - this.heading;
    var cameraRotation = this.el.getAttribute("rotation").y;
    var yawRotation = THREE.MathUtils.radToDeg(
      this.lookControls.yawObject.rotation.y
    );
    var offset = (heading - (cameraRotation - yawRotation)) % 360;
    this.lookControls.yawObject.rotation.y = THREE.MathUtils.degToRad(offset);
  },

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from gps-camera
   */
  _haversineDist: function (src, dest) {
    var dlongitude = THREE.MathUtils.degToRad(dest.longitude - src.longitude);
    var dlatitude = THREE.MathUtils.degToRad(dest.latitude - src.latitude);

    var a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(THREE.MathUtils.degToRad(src.latitude)) *
        Math.cos(THREE.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },

  _onGpsEntityPlaceAdded: function () {
    // if places are added after camera initialization is finished
    if (this.originCoords) {
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    }
    if (this.loader && this.loader.parentElement) {
      document.body.removeChild(this.loader);
    }
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-entity-place.js":
/*!*****************************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-entity-place.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-entity-place
 *
 * based on the original gps-entity-place, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original location on startup (lat/lon) is projected into Spherical
 * Mercator and stored.
 *
 * When 'entity-places' are added, their Spherical Mercator coords are
 * calculated and converted into world coordinates, relative to the original
 * position, using the Spherical Mercator projection calculation in
 * gps-projected-camera.
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 */


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-projected-entity-place", {
  _cameraGps: null,
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
  remove: function () {
    // cleaning listeners when the entity is removed from the DOM
    window.removeEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );
  },
  init: function () {
    // Used now to get the GPS camera when it's been setup
    this.coordSetListener = () => {
      if (!this._cameraGps) {
        var camera = document.querySelector("[gps-projected-camera]");
        if (!camera.components["gps-projected-camera"]) {
          console.error("gps-projected-camera not initialized");
          return;
        }
        this._cameraGps = camera.components["gps-projected-camera"];
        this._updatePosition();
      }
    };

    // update position needs to worry about distance but nothing else?
    this.updatePositionListener = (ev) => {
      if (!this.data || !this._cameraGps) {
        return;
      }

      var dstCoords = this.el.getAttribute("position");

      // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
      // _computeDistanceMeters is now going to use the projected
      var distanceForMsg = this._cameraGps.computeDistanceMeters(dstCoords);

      this.el.setAttribute("distance", distanceForMsg);
      this.el.setAttribute("distanceMsg", this._formatDistance(distanceForMsg));

      this.el.dispatchEvent(
        new CustomEvent("gps-entity-place-update-position", {
          detail: { distance: distanceForMsg },
        })
      );

      var actualDistance = this._cameraGps.computeDistanceMeters(
        dstCoords,
        true
      );

      if (actualDistance === Number.MAX_SAFE_INTEGER) {
        this.hideForMinDistance(this.el, true);
      } else {
        this.hideForMinDistance(this.el, false);
      }
    };

    // Retain as this event is fired when the GPS camera is set up
    window.addEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.addEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );

    this._positionXDebug = 0;

    window.dispatchEvent(
      new CustomEvent("gps-entity-place-added", {
        detail: { component: this.el },
      })
    );
  },
  /**
   * Hide entity according to minDistance property
   * @returns {void}
   */
  hideForMinDistance: function (el, hideEntity) {
    if (hideEntity) {
      el.setAttribute("visible", "false");
    } else {
      el.setAttribute("visible", "true");
    }
  },
  /**
   * Update place position
   * @returns {void}
   */

  // set position to world coords using the lat/lon
  _updatePosition: function () {
    var worldPos = this._cameraGps.latLonToWorld(
      this.data.latitude,
      this.data.longitude
    );
    var position = this.el.getAttribute("position");

    // update element's position in 3D world
    //this.el.setAttribute('position', position);
    this.el.setAttribute("position", {
      x: worldPos[0],
      y: position.y,
      z: worldPos[1],
    });
  },

  /**
   * Format distances string
   *
   * @param {String} distance
   */

  _formatDistance: function (distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
      return distance / 1000 + " kilometers";
    }

    return distance + " meters";
  },
});


/***/ }),

/***/ "aframe":
/*!******************************************************************************************!*\
  !*** external {"commonjs":"aframe","commonjs2":"aframe","amd":"aframe","root":"AFRAME"} ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./aframe/src/location-based/index.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arjs_look_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arjs-look-controls */ "./aframe/src/location-based/arjs-look-controls.js");
/* harmony import */ var _arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
/* harmony import */ var _gps_camera__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gps-camera */ "./aframe/src/location-based/gps-camera.js");
/* harmony import */ var _gps_entity_place__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gps-entity-place */ "./aframe/src/location-based/gps-entity-place.js");
/* harmony import */ var _gps_projected_camera__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gps-projected-camera */ "./aframe/src/location-based/gps-projected-camera.js");
/* harmony import */ var _gps_projected_entity_place__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./gps-projected-entity-place */ "./aframe/src/location-based/gps-projected-entity-place.js");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsMENBQTBDLDBCQUEwQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCLGFBQWEsVUFBVTtBQUN2QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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QSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUN2S0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWlDOztBQUVqQyxxREFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBLDBDQUEwQywwQkFBMEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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QTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ044QjtBQUNDO0FBQ1U7QUFDbkI7QUFDTTtBQUNJO0FBQ00iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scy5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9hcmpzLWxvb2stY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9ncHMtY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1lbnRpdHktcGxhY2UuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLXByb2plY3RlZC1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2UuanMiLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcImFmcmFtZVwiLFwiY29tbW9uanMyXCI6XCJhZnJhbWVcIixcImFtZFwiOlwiYWZyYW1lXCIsXCJyb290XCI6XCJBRlJBTUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJhZnJhbWVcIiksIHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJhZnJhbWVcIiwgXCJ0aHJlZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJBUmpzXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkFSanNcIl0gPSBmYWN0b3J5KHJvb3RbXCJBRlJBTUVcIl0sIHJvb3RbXCJUSFJFRVwiXSk7XG59KSh0aGlzLCAoX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9hZnJhbWVfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fKSA9PiB7XG5yZXR1cm4gIiwiLyoqXG4gKiBAYXV0aG9yIHJpY2h0IC8gaHR0cDovL3JpY2h0Lm1lXG4gKiBAYXV0aG9yIFdlc3RMYW5nbGV5IC8gaHR0cDovL2dpdGh1Yi5jb20vV2VzdExhbmdsZXlcbiAqXG4gKiBXM0MgRGV2aWNlIE9yaWVudGF0aW9uIGNvbnRyb2wgKGh0dHA6Ly93M2MuZ2l0aHViLmlvL2RldmljZW9yaWVudGF0aW9uL3NwZWMtc291cmNlLW9yaWVudGF0aW9uLmh0bWwpXG4gKi9cblxuLyogTk9URSB0aGF0IHRoaXMgaXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgdG9cbiAqIGFsbG93IGV4cG9uZW50aWFsIHNtb290aGluZywgZm9yIHVzZSBpbiBBUi5qcy5cbiAqXG4gKiBNb2RpZmljYXRpb25zIE5pY2sgV2hpdGVsZWdnIChuaWNrdzEgZ2l0aHViKVxuICovXG5cbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5jb25zdCBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgdmFyIHNjb3BlID0gdGhpcztcblxuICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgdGhpcy5vYmplY3Qucm90YXRpb24ucmVvcmRlcihcIllYWlwiKTtcblxuICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gIHRoaXMuZGV2aWNlT3JpZW50YXRpb24gPSB7fTtcbiAgdGhpcy5zY3JlZW5PcmllbnRhdGlvbiA9IDA7XG5cbiAgdGhpcy5hbHBoYU9mZnNldCA9IDA7IC8vIHJhZGlhbnNcblxuICB0aGlzLnNtb290aGluZ0ZhY3RvciA9IDE7XG5cbiAgdGhpcy5UV09fUEkgPSAyICogTWF0aC5QSTtcbiAgdGhpcy5IQUxGX1BJID0gMC41ICogTWF0aC5QSTtcblxuICB2YXIgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgc2NvcGUuZGV2aWNlT3JpZW50YXRpb24gPSBldmVudDtcbiAgfTtcblxuICB2YXIgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uID0gd2luZG93Lm9yaWVudGF0aW9uIHx8IDA7XG4gIH07XG5cbiAgLy8gVGhlIGFuZ2xlcyBhbHBoYSwgYmV0YSBhbmQgZ2FtbWEgZm9ybSBhIHNldCBvZiBpbnRyaW5zaWMgVGFpdC1CcnlhbiBhbmdsZXMgb2YgdHlwZSBaLVgnLVknJ1xuXG4gIHZhciBzZXRPYmplY3RRdWF0ZXJuaW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgemVlID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSk7XG5cbiAgICB2YXIgZXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoKTtcblxuICAgIHZhciBxMCA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XG5cbiAgICB2YXIgcTEgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigtTWF0aC5zcXJ0KDAuNSksIDAsIDAsIE1hdGguc3FydCgwLjUpKTsgLy8gLSBQSS8yIGFyb3VuZCB0aGUgeC1heGlzXG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHF1YXRlcm5pb24sIGFscGhhLCBiZXRhLCBnYW1tYSwgb3JpZW50KSB7XG4gICAgICBldWxlci5zZXQoYmV0YSwgYWxwaGEsIC1nYW1tYSwgXCJZWFpcIik7IC8vICdaWFknIGZvciB0aGUgZGV2aWNlLCBidXQgJ1lYWicgZm9yIHVzXG5cbiAgICAgIHF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKGV1bGVyKTsgLy8gb3JpZW50IHRoZSBkZXZpY2VcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShxMSk7IC8vIGNhbWVyYSBsb29rcyBvdXQgdGhlIGJhY2sgb2YgdGhlIGRldmljZSwgbm90IHRoZSB0b3BcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShxMC5zZXRGcm9tQXhpc0FuZ2xlKHplZSwgLW9yaWVudCkpOyAvLyBhZGp1c3QgZm9yIHNjcmVlbiBvcmllbnRhdGlvblxuICAgIH07XG4gIH0pKCk7XG5cbiAgdGhpcy5jb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImRldmljZW9yaWVudGF0aW9uXCIsXG4gICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsXG4gICAgICBmYWxzZVxuICAgICk7XG5cbiAgICBzY29wZS5lbmFibGVkID0gdHJ1ZTtcbiAgfTtcblxuICB0aGlzLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcImRldmljZW9yaWVudGF0aW9uXCIsXG4gICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsXG4gICAgICBmYWxzZVxuICAgICk7XG5cbiAgICBzY29wZS5lbmFibGVkID0gZmFsc2U7XG4gIH07XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICB2YXIgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XG5cbiAgICBpZiAoZGV2aWNlKSB7XG4gICAgICB2YXIgYWxwaGEgPSBkZXZpY2UuYWxwaGFcbiAgICAgICAgPyBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmFscGhhKSArIHNjb3BlLmFscGhhT2Zmc2V0XG4gICAgICAgIDogMDsgLy8gWlxuXG4gICAgICB2YXIgYmV0YSA9IGRldmljZS5iZXRhID8gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRldmljZS5iZXRhKSA6IDA7IC8vIFgnXG5cbiAgICAgIHZhciBnYW1tYSA9IGRldmljZS5nYW1tYSA/IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuZ2FtbWEpIDogMDsgLy8gWScnXG5cbiAgICAgIHZhciBvcmllbnQgPSBzY29wZS5zY3JlZW5PcmllbnRhdGlvblxuICAgICAgICA/IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChzY29wZS5zY3JlZW5PcmllbnRhdGlvbilcbiAgICAgICAgOiAwOyAvLyBPXG5cbiAgICAgIC8vIE5XIEFkZGVkIHNtb290aGluZyBjb2RlXG4gICAgICB2YXIgayA9IHRoaXMuc21vb3RoaW5nRmFjdG9yO1xuXG4gICAgICBpZiAodGhpcy5sYXN0T3JpZW50YXRpb24pIHtcbiAgICAgICAgYWxwaGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKGFscGhhLCB0aGlzLmxhc3RPcmllbnRhdGlvbi5hbHBoYSwgayk7XG4gICAgICAgIGJldGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgIGJldGEgKyBNYXRoLlBJLFxuICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmJldGEsXG4gICAgICAgICAga1xuICAgICAgICApO1xuICAgICAgICBnYW1tYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgZ2FtbWEgKyB0aGlzLkhBTEZfUEksXG4gICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uZ2FtbWEsXG4gICAgICAgICAgayxcbiAgICAgICAgICBNYXRoLlBJXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiZXRhICs9IE1hdGguUEk7XG4gICAgICAgIGdhbW1hICs9IHRoaXMuSEFMRl9QSTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24gPSB7XG4gICAgICAgIGFscGhhOiBhbHBoYSxcbiAgICAgICAgYmV0YTogYmV0YSxcbiAgICAgICAgZ2FtbWE6IGdhbW1hLFxuICAgICAgfTtcbiAgICAgIHNldE9iamVjdFF1YXRlcm5pb24oXG4gICAgICAgIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uLFxuICAgICAgICBhbHBoYSxcbiAgICAgICAgYmV0YSAtIE1hdGguUEksXG4gICAgICAgIGdhbW1hIC0gdGhpcy5IQUxGX1BJLFxuICAgICAgICBvcmllbnRcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIC8vIE5XIEFkZGVkXG4gIHRoaXMuX29yZGVyQW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgIGlmIChcbiAgICAgIChiID4gYSAmJiBNYXRoLmFicyhiIC0gYSkgPCByYW5nZSAvIDIpIHx8XG4gICAgICAoYSA+IGIgJiYgTWF0aC5hYnMoYiAtIGEpID4gcmFuZ2UgLyAyKVxuICAgICkge1xuICAgICAgcmV0dXJuIHsgbGVmdDogYSwgcmlnaHQ6IGIgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgbGVmdDogYiwgcmlnaHQ6IGEgfTtcbiAgICB9XG4gIH07XG5cbiAgLy8gTlcgQWRkZWRcbiAgdGhpcy5fZ2V0U21vb3RoZWRBbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCBrLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XG4gICAgY29uc3QgYW5nbGVzID0gdGhpcy5fb3JkZXJBbmdsZShhLCBiLCByYW5nZSk7XG4gICAgY29uc3QgYW5nbGVzaGlmdCA9IGFuZ2xlcy5sZWZ0O1xuICAgIGNvbnN0IG9yaWdBbmdsZXNSaWdodCA9IGFuZ2xlcy5yaWdodDtcbiAgICBhbmdsZXMubGVmdCA9IDA7XG4gICAgYW5nbGVzLnJpZ2h0IC09IGFuZ2xlc2hpZnQ7XG4gICAgaWYgKGFuZ2xlcy5yaWdodCA8IDApIGFuZ2xlcy5yaWdodCArPSByYW5nZTtcbiAgICBsZXQgbmV3YW5nbGUgPVxuICAgICAgb3JpZ0FuZ2xlc1JpZ2h0ID09IGJcbiAgICAgICAgPyAoMSAtIGspICogYW5nbGVzLnJpZ2h0ICsgayAqIGFuZ2xlcy5sZWZ0XG4gICAgICAgIDogayAqIGFuZ2xlcy5yaWdodCArICgxIC0gaykgKiBhbmdsZXMubGVmdDtcbiAgICBuZXdhbmdsZSArPSBhbmdsZXNoaWZ0O1xuICAgIGlmIChuZXdhbmdsZSA+PSByYW5nZSkgbmV3YW5nbGUgLT0gcmFuZ2U7XG4gICAgcmV0dXJuIG5ld2FuZ2xlO1xuICB9O1xuXG4gIHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBzY29wZS5kaXNjb25uZWN0KCk7XG4gIH07XG5cbiAgdGhpcy5jb25uZWN0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scztcbiIsIi8vIFRvIGF2b2lkIHJlY2FsY3VsYXRpb24gYXQgZXZlcnkgbW91c2UgbW92ZW1lbnQgdGlja1xudmFyIFBJXzIgPSBNYXRoLlBJIC8gMjtcblxuLyoqXG4gKiBsb29rLWNvbnRyb2xzLiBVcGRhdGUgZW50aXR5IHBvc2UsIGZhY3RvcmluZyBtb3VzZSwgdG91Y2gsIGFuZCBXZWJWUiBBUEkgZGF0YS5cbiAqL1xuXG4vKiBOT1RFIHRoYXQgdGhpcyBpcyBhIG1vZGlmaWVkIHZlcnNpb24gb2YgQS1GcmFtZSdzIGxvb2stY29udHJvbHMgdG9cbiAqIGFsbG93IGV4cG9uZW50aWFsIHNtb290aGluZywgZm9yIHVzZSBpbiBBUi5qcy5cbiAqXG4gKiBNb2RpZmljYXRpb25zIE5pY2sgV2hpdGVsZWdnIChuaWNrdzEgZ2l0aHViKVxuICovXG5cbmltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5pbXBvcnQgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSBcIi4vQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHNcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiYXJqcy1sb29rLWNvbnRyb2xzXCIsIHtcbiAgZGVwZW5kZW5jaWVzOiBbXCJwb3NpdGlvblwiLCBcInJvdGF0aW9uXCJdLFxuXG4gIHNjaGVtYToge1xuICAgIGVuYWJsZWQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIG1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBwb2ludGVyTG9ja0VuYWJsZWQ6IHsgZGVmYXVsdDogZmFsc2UgfSxcbiAgICByZXZlcnNlTW91c2VEcmFnOiB7IGRlZmF1bHQ6IGZhbHNlIH0sXG4gICAgcmV2ZXJzZVRvdWNoRHJhZzogeyBkZWZhdWx0OiBmYWxzZSB9LFxuICAgIHRvdWNoRW5hYmxlZDogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgc21vb3RoaW5nRmFjdG9yOiB7IHR5cGU6IFwibnVtYmVyXCIsIGRlZmF1bHQ6IDEgfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kZWx0YVlhdyA9IDA7XG4gICAgdGhpcy5wcmV2aW91c0hNRFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLmhtZFF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuICAgIHRoaXMubWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyID0gbmV3IFRIUkVFLkV1bGVyKCk7XG4gICAgdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoKTtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLm1hZ2ljV2luZG93T2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHt9O1xuICAgIHRoaXMuZGVsdGFSb3RhdGlvbiA9IHt9O1xuICAgIHRoaXMuc2F2ZWRQb3NlID0gbnVsbDtcbiAgICB0aGlzLnBvaW50ZXJMb2NrZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNldHVwTW91c2VDb250cm9scygpO1xuICAgIHRoaXMuYmluZE1ldGhvZHMoKTtcbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudCA9IHt9O1xuXG4gICAgdGhpcy5zZXR1cE1hZ2ljV2luZG93Q29udHJvbHMoKTtcblxuICAgIC8vIFRvIHNhdmUgLyByZXN0b3JlIGNhbWVyYSBwb3NlXG4gICAgdGhpcy5zYXZlZFBvc2UgPSB7XG4gICAgICBwb3NpdGlvbjogbmV3IFRIUkVFLlZlY3RvcjMoKSxcbiAgICAgIHJvdGF0aW9uOiBuZXcgVEhSRUUuRXVsZXIoKSxcbiAgICB9O1xuXG4gICAgLy8gQ2FsbCBlbnRlciBWUiBoYW5kbGVyIGlmIHRoZSBzY2VuZSBoYXMgZW50ZXJlZCBWUiBiZWZvcmUgdGhlIGV2ZW50IGxpc3RlbmVycyBhdHRhY2hlZC5cbiAgICBpZiAodGhpcy5lbC5zY2VuZUVsLmlzKFwidnItbW9kZVwiKSkge1xuICAgICAgdGhpcy5vbkVudGVyVlIoKTtcbiAgICB9XG4gIH0sXG5cbiAgc2V0dXBNYWdpY1dpbmRvd0NvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1hZ2ljV2luZG93Q29udHJvbHM7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICAvLyBPbmx5IG9uIG1vYmlsZSBkZXZpY2VzIGFuZCBvbmx5IGVuYWJsZWQgaWYgRGV2aWNlT3JpZW50YXRpb24gcGVybWlzc2lvbiBoYXMgYmVlbiBncmFudGVkLlxuICAgIGlmIChBRlJBTUUudXRpbHMuZGV2aWNlLmlzTW9iaWxlKCkpIHtcbiAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMgPSB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMgPVxuICAgICAgICBuZXcgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHModGhpcy5tYWdpY1dpbmRvd09iamVjdCk7XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb25cbiAgICAgICkge1xuICAgICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5jb21wb25lbnRzW1wiZGV2aWNlLW9yaWVudGF0aW9uLXBlcm1pc3Npb24tdWlcIl1cbiAgICAgICAgICAgIC5wZXJtaXNzaW9uR3JhbnRlZFxuICAgICAgICApIHtcbiAgICAgICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBkYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkZXZpY2VvcmllbnRhdGlvbnBlcm1pc3Npb25ncmFudGVkXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChvbGREYXRhKSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICAvLyBEaXNhYmxlIGdyYWIgY3Vyc29yIGNsYXNzZXMgaWYgbm8gbG9uZ2VyIGVuYWJsZWQuXG4gICAgaWYgKGRhdGEuZW5hYmxlZCAhPT0gb2xkRGF0YS5lbmFibGVkKSB7XG4gICAgICB0aGlzLnVwZGF0ZUdyYWJDdXJzb3IoZGF0YS5lbmFibGVkKTtcbiAgICB9XG5cbiAgICAvLyBSZXNldCBtYWdpYyB3aW5kb3cgZXVsZXJzIGlmIHRyYWNraW5nIGlzIGRpc2FibGVkLlxuICAgIGlmIChcbiAgICAgIG9sZERhdGEgJiZcbiAgICAgICFkYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkICYmXG4gICAgICBvbGREYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci5zZXQoMCwgMCwgMCk7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci5zZXQoMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgLy8gUGFzcyBvbiBtYWdpYyB3aW5kb3cgdHJhY2tpbmcgc2V0dGluZyB0byBtYWdpY1dpbmRvd0NvbnRyb2xzLlxuICAgIGlmICh0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMpIHtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy5zbW9vdGhpbmdGYWN0b3IgPSBkYXRhLnNtb290aGluZ0ZhY3RvcjtcbiAgICB9XG5cbiAgICBpZiAob2xkRGF0YSAmJiAhZGF0YS5wb2ludGVyTG9ja0VuYWJsZWQgIT09IG9sZERhdGEucG9pbnRlckxvY2tFbmFibGVkKSB7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7XG4gICAgICAgIHRoaXMuZXhpdFBvaW50ZXJMb2NrKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICh0KSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgaWYgKCFkYXRhLmVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVPcmllbnRhdGlvbigpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkge1xuICAgICAgdGhpcy5leGl0UG9pbnRlckxvY2soKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHtcbiAgICAgIHRoaXMuZXhpdFBvaW50ZXJMb2NrKCk7XG4gICAgfVxuICB9LFxuXG4gIGJpbmRNZXRob2RzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5vbk1vdXNlRG93biA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Nb3VzZURvd24sIHRoaXMpO1xuICAgIHRoaXMub25Nb3VzZU1vdmUgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uTW91c2VNb3ZlLCB0aGlzKTtcbiAgICB0aGlzLm9uTW91c2VVcCA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Nb3VzZVVwLCB0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Ub3VjaFN0YXJ0LCB0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hNb3ZlID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblRvdWNoTW92ZSwgdGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblRvdWNoRW5kLCB0aGlzKTtcbiAgICB0aGlzLm9uRW50ZXJWUiA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25FbnRlclZSLCB0aGlzKTtcbiAgICB0aGlzLm9uRXhpdFZSID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbkV4aXRWUiwgdGhpcyk7XG4gICAgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlID0gQUZSQU1FLnV0aWxzLmJpbmQoXG4gICAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsXG4gICAgICB0aGlzXG4gICAgKTtcbiAgICB0aGlzLm9uUG9pbnRlckxvY2tFcnJvciA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Qb2ludGVyTG9ja0Vycm9yLCB0aGlzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0IHVwIHN0YXRlcyBhbmQgT2JqZWN0M0RzIG5lZWRlZCB0byBzdG9yZSByb3RhdGlvbiBkYXRhLlxuICAgKi9cbiAgc2V0dXBNb3VzZUNvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLnBpdGNoT2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgdGhpcy55YXdPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICB0aGlzLnlhd09iamVjdC5wb3NpdGlvbi55ID0gMTA7XG4gICAgdGhpcy55YXdPYmplY3QuYWRkKHRoaXMucGl0Y2hPYmplY3QpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgbW91c2UgYW5kIHRvdWNoIGV2ZW50IGxpc3RlbmVycyB0byBjYW52YXMuXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIHZhciBjYW52YXNFbCA9IHNjZW5lRWwuY2FudmFzO1xuXG4gICAgLy8gV2FpdCBmb3IgY2FudmFzIHRvIGxvYWQuXG4gICAgaWYgKCFjYW52YXNFbCkge1xuICAgICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcInJlbmRlci10YXJnZXQtbG9hZGVkXCIsXG4gICAgICAgIEFGUkFNRS51dGlscy5iaW5kKHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMsIHRoaXMpXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1vdXNlIGV2ZW50cy5cbiAgICBjYW52YXNFbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMub25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwLCBmYWxzZSk7XG5cbiAgICAvLyBUb3VjaCBldmVudHMuXG4gICAgY2FudmFzRWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy5vblRvdWNoRW5kKTtcblxuICAgIC8vIHNjZW5lRWwgZXZlbnRzLlxuICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcihcImVudGVyLXZyXCIsIHRoaXMub25FbnRlclZSKTtcbiAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJleGl0LXZyXCIsIHRoaXMub25FeGl0VlIpO1xuXG4gICAgLy8gUG9pbnRlciBMb2NrIGV2ZW50cy5cbiAgICBpZiAodGhpcy5kYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJwb2ludGVybG9ja2NoYW5nZVwiLFxuICAgICAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJtb3pwb2ludGVybG9ja2NoYW5nZVwiLFxuICAgICAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJwb2ludGVybG9ja2Vycm9yXCIsXG4gICAgICAgIHRoaXMub25Qb2ludGVyTG9ja0Vycm9yLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtb3VzZSBhbmQgdG91Y2ggZXZlbnQgbGlzdGVuZXJzIGZyb20gY2FudmFzLlxuICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICB2YXIgY2FudmFzRWwgPSBzY2VuZUVsICYmIHNjZW5lRWwuY2FudmFzO1xuXG4gICAgaWYgKCFjYW52YXNFbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1vdXNlIGV2ZW50cy5cbiAgICBjYW52YXNFbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMub25Nb3VzZURvd24pO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm9uTW91c2VVcCk7XG5cbiAgICAvLyBUb3VjaCBldmVudHMuXG4gICAgY2FudmFzRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy5vblRvdWNoRW5kKTtcblxuICAgIC8vIHNjZW5lRWwgZXZlbnRzLlxuICAgIHNjZW5lRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVudGVyLXZyXCIsIHRoaXMub25FbnRlclZSKTtcbiAgICBzY2VuZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJleGl0LXZyXCIsIHRoaXMub25FeGl0VlIpO1xuXG4gICAgLy8gUG9pbnRlciBMb2NrIGV2ZW50cy5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJwb2ludGVybG9ja2NoYW5nZVwiLFxuICAgICAgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcIm1venBvaW50ZXJsb2NrY2hhbmdlXCIsXG4gICAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicG9pbnRlcmxvY2tlcnJvclwiLFxuICAgICAgdGhpcy5vblBvaW50ZXJMb2NrRXJyb3IsXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBvcmllbnRhdGlvbiBmb3IgbW9iaWxlLCBtb3VzZSBkcmFnLCBhbmQgaGVhZHNldC5cbiAgICogTW91c2UtZHJhZyBvbmx5IGVuYWJsZWQgaWYgSE1EIGlzIG5vdCBhY3RpdmUuXG4gICAqL1xuICB1cGRhdGVPcmllbnRhdGlvbjogKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9zZU1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9iamVjdDNEID0gdGhpcy5lbC5vYmplY3QzRDtcbiAgICAgIHZhciBwaXRjaE9iamVjdCA9IHRoaXMucGl0Y2hPYmplY3Q7XG4gICAgICB2YXIgeWF3T2JqZWN0ID0gdGhpcy55YXdPYmplY3Q7XG4gICAgICB2YXIgcG9zZTtcbiAgICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuXG4gICAgICAvLyBJbiBWUiBtb2RlLCBUSFJFRSBpcyBpbiBjaGFyZ2Ugb2YgdXBkYXRpbmcgdGhlIGNhbWVyYSBwb3NlLlxuICAgICAgaWYgKHNjZW5lRWwuaXMoXCJ2ci1tb2RlXCIpICYmIHNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpIHtcbiAgICAgICAgLy8gV2l0aCBXZWJYUiBUSFJFRSBhcHBsaWVzIGhlYWRzZXQgcG9zZSB0byB0aGUgb2JqZWN0M0QgbWF0cml4V29ybGQgaW50ZXJuYWxseS5cbiAgICAgICAgLy8gUmVmbGVjdCB2YWx1ZXMgYmFjayBvbiBwb3NpdGlvbiwgcm90YXRpb24sIHNjYWxlIGZvciBnZXRBdHRyaWJ1dGUgdG8gcmV0dXJuIHRoZSBleHBlY3RlZCB2YWx1ZXMuXG4gICAgICAgIGlmIChzY2VuZUVsLmhhc1dlYlhSKSB7XG4gICAgICAgICAgcG9zZSA9IHNjZW5lRWwucmVuZGVyZXIueHIuZ2V0Q2FtZXJhUG9zZSgpO1xuICAgICAgICAgIGlmIChwb3NlKSB7XG4gICAgICAgICAgICBwb3NlTWF0cml4LmVsZW1lbnRzID0gcG9zZS50cmFuc2Zvcm0ubWF0cml4O1xuICAgICAgICAgICAgcG9zZU1hdHJpeC5kZWNvbXBvc2UoXG4gICAgICAgICAgICAgIG9iamVjdDNELnBvc2l0aW9uLFxuICAgICAgICAgICAgICBvYmplY3QzRC5yb3RhdGlvbixcbiAgICAgICAgICAgICAgb2JqZWN0M0Quc2NhbGVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGVNYWdpY1dpbmRvd09yaWVudGF0aW9uKCk7XG5cbiAgICAgIC8vIE9uIG1vYmlsZSwgZG8gY2FtZXJhIHJvdGF0aW9uIHdpdGggdG91Y2ggZXZlbnRzIGFuZCBzZW5zb3JzLlxuICAgICAgb2JqZWN0M0Qucm90YXRpb24ueCA9XG4gICAgICAgIHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLnggKyBwaXRjaE9iamVjdC5yb3RhdGlvbi54O1xuICAgICAgb2JqZWN0M0Qucm90YXRpb24ueSA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLnkgKyB5YXdPYmplY3Qucm90YXRpb24ueTtcbiAgICAgIG9iamVjdDNELnJvdGF0aW9uLnogPSB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci56O1xuICAgIH07XG4gIH0pKCksXG5cbiAgdXBkYXRlTWFnaWNXaW5kb3dPcmllbnRhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIgPSB0aGlzLm1hZ2ljV2luZG93QWJzb2x1dGVFdWxlcjtcbiAgICB2YXIgbWFnaWNXaW5kb3dEZWx0YUV1bGVyID0gdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXI7XG4gICAgLy8gQ2FsY3VsYXRlIG1hZ2ljIHdpbmRvdyBITUQgcXVhdGVybmlvbi5cbiAgICBpZiAodGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzICYmIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkKSB7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMudXBkYXRlKCk7XG4gICAgICBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIuc2V0RnJvbVF1YXRlcm5pb24oXG4gICAgICAgIHRoaXMubWFnaWNXaW5kb3dPYmplY3QucXVhdGVybmlvbixcbiAgICAgICAgXCJZWFpcIlxuICAgICAgKTtcbiAgICAgIGlmICghdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ICYmIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55ICE9PSAwKSB7XG4gICAgICAgIHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdyA9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdykge1xuICAgICAgICBtYWdpY1dpbmRvd0RlbHRhRXVsZXIueCA9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci54O1xuICAgICAgICBtYWdpY1dpbmRvd0RlbHRhRXVsZXIueSArPVxuICAgICAgICAgIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55IC0gdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3O1xuICAgICAgICBtYWdpY1dpbmRvd0RlbHRhRXVsZXIueiA9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci56O1xuICAgICAgICB0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXcgPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSBtb3VzZSBkcmFnIGludG8gcm90YXRpb24uXG4gICAqXG4gICAqIERyYWdnaW5nIHVwIGFuZCBkb3duIHJvdGF0ZXMgdGhlIGNhbWVyYSBhcm91bmQgdGhlIFgtYXhpcyAoeWF3KS5cbiAgICogRHJhZ2dpbmcgbGVmdCBhbmQgcmlnaHQgcm90YXRlcyB0aGUgY2FtZXJhIGFyb3VuZCB0aGUgWS1heGlzIChwaXRjaCkuXG4gICAqL1xuICBvbk1vdXNlTW92ZTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgdmFyIG1vdmVtZW50WDtcbiAgICB2YXIgbW92ZW1lbnRZO1xuICAgIHZhciBwaXRjaE9iamVjdCA9IHRoaXMucGl0Y2hPYmplY3Q7XG4gICAgdmFyIHByZXZpb3VzTW91c2VFdmVudCA9IHRoaXMucHJldmlvdXNNb3VzZUV2ZW50O1xuICAgIHZhciB5YXdPYmplY3QgPSB0aGlzLnlhd09iamVjdDtcblxuICAgIC8vIE5vdCBkcmFnZ2luZyBvciBub3QgZW5hYmxlZC5cbiAgICBpZiAoIXRoaXMuZGF0YS5lbmFibGVkIHx8ICghdGhpcy5tb3VzZURvd24gJiYgIXRoaXMucG9pbnRlckxvY2tlZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDYWxjdWxhdGUgZGVsdGEuXG4gICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkge1xuICAgICAgbW92ZW1lbnRYID0gZXZ0Lm1vdmVtZW50WCB8fCBldnQubW96TW92ZW1lbnRYIHx8IDA7XG4gICAgICBtb3ZlbWVudFkgPSBldnQubW92ZW1lbnRZIHx8IGV2dC5tb3pNb3ZlbWVudFkgfHwgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgbW92ZW1lbnRYID0gZXZ0LnNjcmVlblggLSBwcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWDtcbiAgICAgIG1vdmVtZW50WSA9IGV2dC5zY3JlZW5ZIC0gcHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblk7XG4gICAgfVxuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblggPSBldnQuc2NyZWVuWDtcbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5ZID0gZXZ0LnNjcmVlblk7XG5cbiAgICAvLyBDYWxjdWxhdGUgcm90YXRpb24uXG4gICAgZGlyZWN0aW9uID0gdGhpcy5kYXRhLnJldmVyc2VNb3VzZURyYWcgPyAxIDogLTE7XG4gICAgeWF3T2JqZWN0LnJvdGF0aW9uLnkgKz0gbW92ZW1lbnRYICogMC4wMDIgKiBkaXJlY3Rpb247XG4gICAgcGl0Y2hPYmplY3Qucm90YXRpb24ueCArPSBtb3ZlbWVudFkgKiAwLjAwMiAqIGRpcmVjdGlvbjtcbiAgICBwaXRjaE9iamVjdC5yb3RhdGlvbi54ID0gTWF0aC5tYXgoXG4gICAgICAtUElfMixcbiAgICAgIE1hdGgubWluKFBJXzIsIHBpdGNoT2JqZWN0LnJvdGF0aW9uLngpXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgbW91c2UgZG93biB0byBkZXRlY3QgbW91c2UgZHJhZy5cbiAgICovXG4gIG9uTW91c2VEb3duOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuZGF0YS5lbmFibGVkIHx8XG4gICAgICAoc2NlbmVFbC5pcyhcInZyLW1vZGVcIikgJiYgc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSlcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gSGFuZGxlIG9ubHkgcHJpbWFyeSBidXR0b24uXG4gICAgaWYgKGV2dC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY2FudmFzRWwgPSBzY2VuZUVsICYmIHNjZW5lRWwuY2FudmFzO1xuXG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblggPSBldnQuc2NyZWVuWDtcbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5ZID0gZXZ0LnNjcmVlblk7XG4gICAgdGhpcy5zaG93R3JhYmJpbmdDdXJzb3IoKTtcblxuICAgIGlmICh0aGlzLmRhdGEucG9pbnRlckxvY2tFbmFibGVkICYmICF0aGlzLnBvaW50ZXJMb2NrZWQpIHtcbiAgICAgIGlmIChjYW52YXNFbC5yZXF1ZXN0UG9pbnRlckxvY2spIHtcbiAgICAgICAgY2FudmFzRWwucmVxdWVzdFBvaW50ZXJMb2NrKCk7XG4gICAgICB9IGVsc2UgaWYgKGNhbnZhc0VsLm1velJlcXVlc3RQb2ludGVyTG9jaykge1xuICAgICAgICBjYW52YXNFbC5tb3pSZXF1ZXN0UG9pbnRlckxvY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNob3dzIGdyYWJiaW5nIGN1cnNvciBvbiBzY2VuZVxuICAgKi9cbiAgc2hvd0dyYWJiaW5nQ3Vyc29yOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zY2VuZUVsLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImdyYWJiaW5nXCI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEhpZGVzIGdyYWJiaW5nIGN1cnNvciBvbiBzY2VuZVxuICAgKi9cbiAgaGlkZUdyYWJiaW5nQ3Vyc29yOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zY2VuZUVsLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcIlwiO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBtb3VzZSB1cCB0byBkZXRlY3QgcmVsZWFzZSBvZiBtb3VzZSBkcmFnLlxuICAgKi9cbiAgb25Nb3VzZVVwOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVHcmFiYmluZ0N1cnNvcigpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0b3VjaCBkb3duIHRvIGRldGVjdCB0b3VjaCBkcmFnLlxuICAgKi9cbiAgb25Ub3VjaFN0YXJ0OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKFxuICAgICAgZXZ0LnRvdWNoZXMubGVuZ3RoICE9PSAxIHx8XG4gICAgICAhdGhpcy5kYXRhLnRvdWNoRW5hYmxlZCB8fFxuICAgICAgdGhpcy5lbC5zY2VuZUVsLmlzKFwidnItbW9kZVwiKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnRvdWNoU3RhcnQgPSB7XG4gICAgICB4OiBldnQudG91Y2hlc1swXS5wYWdlWCxcbiAgICAgIHk6IGV2dC50b3VjaGVzWzBdLnBhZ2VZLFxuICAgIH07XG4gICAgdGhpcy50b3VjaFN0YXJ0ZWQgPSB0cnVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgdG91Y2ggbW92ZSB0byBZLWF4aXMgcm90YXRpb24uXG4gICAqL1xuICBvblRvdWNoTW92ZTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgdmFyIGNhbnZhcyA9IHRoaXMuZWwuc2NlbmVFbC5jYW52YXM7XG4gICAgdmFyIGRlbHRhWTtcbiAgICB2YXIgeWF3T2JqZWN0ID0gdGhpcy55YXdPYmplY3Q7XG5cbiAgICBpZiAoIXRoaXMudG91Y2hTdGFydGVkIHx8ICF0aGlzLmRhdGEudG91Y2hFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGVsdGFZID1cbiAgICAgICgyICogTWF0aC5QSSAqIChldnQudG91Y2hlc1swXS5wYWdlWCAtIHRoaXMudG91Y2hTdGFydC54KSkgL1xuICAgICAgY2FudmFzLmNsaWVudFdpZHRoO1xuXG4gICAgZGlyZWN0aW9uID0gdGhpcy5kYXRhLnJldmVyc2VUb3VjaERyYWcgPyAxIDogLTE7XG4gICAgLy8gTGltaXQgdG91Y2ggb3JpZW50YWlvbiB0byB0byB5YXcgKHkgYXhpcykuXG4gICAgeWF3T2JqZWN0LnJvdGF0aW9uLnkgLT0gZGVsdGFZICogMC41ICogZGlyZWN0aW9uO1xuICAgIHRoaXMudG91Y2hTdGFydCA9IHtcbiAgICAgIHg6IGV2dC50b3VjaGVzWzBdLnBhZ2VYLFxuICAgICAgeTogZXZ0LnRvdWNoZXNbMF0ucGFnZVksXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgdG91Y2ggZW5kIHRvIGRldGVjdCByZWxlYXNlIG9mIHRvdWNoIGRyYWcuXG4gICAqL1xuICBvblRvdWNoRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50b3VjaFN0YXJ0ZWQgPSBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZSBwb3NlLlxuICAgKi9cbiAgb25FbnRlclZSOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgaWYgKCFzY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2F2ZUNhbWVyYVBvc2UoKTtcbiAgICB0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLmVsLm9iamVjdDNELnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgICBpZiAoc2NlbmVFbC5oYXNXZWJYUikge1xuICAgICAgdGhpcy5lbC5vYmplY3QzRC5tYXRyaXhBdXRvVXBkYXRlID0gZmFsc2U7XG4gICAgICB0aGlzLmVsLm9iamVjdDNELnVwZGF0ZU1hdHJpeCgpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVzdG9yZSB0aGUgcG9zZS5cbiAgICovXG4gIG9uRXhpdFZSOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsLnNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZXN0b3JlQ2FtZXJhUG9zZSgpO1xuICAgIHRoaXMucHJldmlvdXNITURQb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgdGhpcy5lbC5vYmplY3QzRC5tYXRyaXhBdXRvVXBkYXRlID0gdHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIFBvaW50ZXIgTG9jayBzdGF0ZS5cbiAgICovXG4gIG9uUG9pbnRlckxvY2tDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBvaW50ZXJMb2NrZWQgPSAhIShcbiAgICAgIGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCB8fCBkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnRcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWNvdmVyIGZyb20gUG9pbnRlciBMb2NrIGVycm9yLlxuICAgKi9cbiAgb25Qb2ludGVyTG9ja0Vycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gZmFsc2U7XG4gIH0sXG5cbiAgLy8gRXhpdHMgcG9pbnRlci1sb2NrZWQgbW9kZS5cbiAgZXhpdFBvaW50ZXJMb2NrOiBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgZmVhdHVyZSBvZiBzaG93aW5nL2hpZGluZyB0aGUgZ3JhYiBjdXJzb3IuXG4gICAqL1xuICB1cGRhdGVHcmFiQ3Vyc29yOiBmdW5jdGlvbiAoZW5hYmxlZCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuXG4gICAgZnVuY3Rpb24gZW5hYmxlR3JhYkN1cnNvcigpIHtcbiAgICAgIHNjZW5lRWwuY2FudmFzLmNsYXNzTGlzdC5hZGQoXCJhLWdyYWItY3Vyc29yXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkaXNhYmxlR3JhYkN1cnNvcigpIHtcbiAgICAgIHNjZW5lRWwuY2FudmFzLmNsYXNzTGlzdC5yZW1vdmUoXCJhLWdyYWItY3Vyc29yXCIpO1xuICAgIH1cblxuICAgIGlmICghc2NlbmVFbC5jYW52YXMpIHtcbiAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcihcInJlbmRlci10YXJnZXQtbG9hZGVkXCIsIGVuYWJsZUdyYWJDdXJzb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKFwicmVuZGVyLXRhcmdldC1sb2FkZWRcIiwgZGlzYWJsZUdyYWJDdXJzb3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlbmFibGVkKSB7XG4gICAgICBlbmFibGVHcmFiQ3Vyc29yKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRpc2FibGVHcmFiQ3Vyc29yKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmUgY2FtZXJhIHBvc2UgYmVmb3JlIGVudGVyaW5nIFZSIHRvIHJlc3RvcmUgbGF0ZXIgaWYgZXhpdGluZy5cbiAgICovXG4gIHNhdmVDYW1lcmFQb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcblxuICAgIHRoaXMuc2F2ZWRQb3NlLnBvc2l0aW9uLmNvcHkoZWwub2JqZWN0M0QucG9zaXRpb24pO1xuICAgIHRoaXMuc2F2ZWRQb3NlLnJvdGF0aW9uLmNvcHkoZWwub2JqZWN0M0Qucm90YXRpb24pO1xuICAgIHRoaXMuaGFzU2F2ZWRQb3NlID0gdHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgICogUmVzZXQgY2FtZXJhIHBvc2UgdG8gYmVmb3JlIGVudGVyaW5nIFZSLlxuICAgKi9cbiAgcmVzdG9yZUNhbWVyYVBvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuICAgIHZhciBzYXZlZFBvc2UgPSB0aGlzLnNhdmVkUG9zZTtcblxuICAgIGlmICghdGhpcy5oYXNTYXZlZFBvc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXNldCBjYW1lcmEgb3JpZW50YXRpb24uXG4gICAgZWwub2JqZWN0M0QucG9zaXRpb24uY29weShzYXZlZFBvc2UucG9zaXRpb24pO1xuICAgIGVsLm9iamVjdDNELnJvdGF0aW9uLmNvcHkoc2F2ZWRQb3NlLnJvdGF0aW9uKTtcbiAgICB0aGlzLmhhc1NhdmVkUG9zZSA9IGZhbHNlO1xuICB9LFxufSk7XG4iLCJpbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImFyanMtd2ViY2FtLXRleHR1cmVcIiwge1xuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zY2VuZSA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICB0aGlzLnRleENhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEoLTAuNSwgMC41LCAwLjUsIC0wLjUsIDAsIDEwKTtcbiAgICB0aGlzLnRleFNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJhdXRvcGxheVwiLCB0cnVlKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcInBsYXlzaW5saW5lXCIsIHRydWUpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnZpZGVvKTtcbiAgICB0aGlzLmdlb20gPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgpO1xuICAgIHRoaXMudGV4dHVyZSA9IG5ldyBUSFJFRS5WaWRlb1RleHR1cmUodGhpcy52aWRlbyk7XG4gICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGhpcy50ZXh0dXJlIH0pO1xuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLmdlb20sIHRoaXMubWF0ZXJpYWwpO1xuICAgIHRoaXMudGV4U2NlbmUuYWRkKG1lc2gpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICAgIHZpZGVvOiB7XG4gICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgICAgLmdldFVzZXJNZWRpYShjb25zdHJhaW50cylcbiAgICAgICAgLnRoZW4oKHN0cmVhbSkgPT4ge1xuICAgICAgICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgYFdlYmNhbSBlcnJvcjogJHtlfWBcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgXCJzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWRcIlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2xlYXIoKTtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLnJlbmRlcih0aGlzLnRleFNjZW5lLCB0aGlzLnRleENhbWVyYSk7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZpZGVvLnNyY09iamVjdC5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgdHJhY2suc3RvcCgpO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XG4gICAgdGhpcy5nZW9tLmRpc3Bvc2UoKTtcbiAgfSxcbn0pO1xuIiwiLypcbiAqIFVQREFURVMgMjgvMDgvMjA6XG4gKlxuICogLSBhZGQgZ3BzTWluRGlzdGFuY2UgYW5kIGdwc1RpbWVJbnRlcnZhbCBwcm9wZXJ0aWVzIHRvIGNvbnRyb2wgaG93XG4gKiBmcmVxdWVudGx5IEdQUyB1cGRhdGVzIGFyZSBwcm9jZXNzZWQuIEFpbSBpcyB0byBwcmV2ZW50ICdzdHV0dGVyaW5nJ1xuICogZWZmZWN0cyB3aGVuIGNsb3NlIHRvIEFSIGNvbnRlbnQgZHVlIHRvIGNvbnRpbnVvdXMgc21hbGwgY2hhbmdlcyBpblxuICogbG9jYXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtY2FtZXJhXCIsIHtcbiAgX3dhdGNoUG9zaXRpb25JZDogbnVsbCxcbiAgb3JpZ2luQ29vcmRzOiBudWxsLFxuICBjdXJyZW50Q29vcmRzOiBudWxsLFxuICBsb29rQ29udHJvbHM6IG51bGwsXG4gIGhlYWRpbmc6IG51bGwsXG4gIHNjaGVtYToge1xuICAgIHNpbXVsYXRlTGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVMb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVBbHRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBwb3NpdGlvbk1pbkFjY3VyYWN5OiB7XG4gICAgICB0eXBlOiBcImludFwiLFxuICAgICAgZGVmYXVsdDogMTAwLFxuICAgIH0sXG4gICAgYWxlcnQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBtaW5EaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJpbnRcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBtYXhEaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJpbnRcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBncHNNaW5EaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDUsXG4gICAgfSxcbiAgICBncHNUaW1lSW50ZXJ2YWw6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcblxuICAgICAgLy8gcmUtdHJpZ2dlciBpbml0aWFsaXphdGlvbiBmb3IgbmV3IG9yaWdpblxuICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSBudWxsO1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wiYXJqcy1sb29rLWNvbnRyb2xzXCJdICYmXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFBvc2l0aW9uID0ge1xuICAgICAgbGF0aXR1ZGU6IDAsXG4gICAgICBsb25naXR1ZGU6IDAsXG4gICAgfTtcblxuICAgIHRoaXMubG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICB0aGlzLmxvYWRlci5jbGFzc0xpc3QuYWRkKFwiYXJqcy1sb2FkZXJcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmxvYWRlcik7XG5cbiAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCA9IHRoaXMuX29uR3BzRW50aXR5UGxhY2VBZGRlZC5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsXG4gICAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZFxuICAgICk7XG5cbiAgICB0aGlzLmxvb2tDb250cm9scyA9XG4gICAgICB0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWxvb2stY29udHJvbHNcIl0gfHxcbiAgICAgIHRoaXMuZWwuY29tcG9uZW50c1tcImxvb2stY29udHJvbHNcIl07XG5cbiAgICAvLyBsaXN0ZW4gdG8gZGV2aWNlb3JpZW50YXRpb24gZXZlbnRcbiAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWUoKTtcbiAgICB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uID0gdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbi5iaW5kKHRoaXMpO1xuXG4gICAgLy8gaWYgU2FmYXJpXG4gICAgaWYgKCEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcL1tcXGQuXSsuKlNhZmFyaS8pKSB7XG4gICAgICAvLyBpT1MgMTMrXG4gICAgICBpZiAodHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3RpbmcgZGV2aWNlIG9yaWVudGF0aW9uIHBlcm1pc3Npb25zLi4uXCIpO1xuICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcInRvdWNoZW5kXCIsXG4gICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgIFwiQWZ0ZXIgY2FtZXJhIHBlcm1pc3Npb24gcHJvbXB0LCBwbGVhc2UgdGFwIHRoZSBzY3JlZW4gdG8gYWN0aXZhdGUgZ2VvbG9jYXRpb24uXCJcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIFwiUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuXCJcbiAgICAgICAgICApO1xuICAgICAgICB9LCA3NTApO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSB7XG4gICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudENvb3JkcyB8fCB7fSk7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxhdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGU7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gdGhpcy5faW5pdFdhdGNoR1BTKFxuICAgICAgICBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIGxhdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICBhbHRpdHVkZTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlLFxuICAgICAgICAgICAgYWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSxcbiAgICAgICAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgICAgIHZhciBkaXN0TW92ZWQgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KFxuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24sXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHNcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGRpc3RNb3ZlZCA+PSB0aGlzLmRhdGEuZ3BzTWluRGlzdGFuY2UgfHwgIXRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5oZWFkaW5nID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3VwZGF0ZVJvdGF0aW9uKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgIH1cbiAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIixcbiAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGRldmljZSBvcmllbnRhdGlvbiBldmVudCBuYW1lLCBkZXBlbmRzIG9uIGJyb3dzZXIgaW1wbGVtZW50YXRpb24uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGV2ZW50IG5hbWVcbiAgICovXG4gIF9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChcIm9uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiIGluIHdpbmRvdykge1xuICAgICAgdmFyIGV2ZW50TmFtZSA9IFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiO1xuICAgIH0gZWxzZSBpZiAoXCJvbmRldmljZW9yaWVudGF0aW9uXCIgaW4gd2luZG93KSB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJcIjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb21wYXNzIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV2ZW50TmFtZTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgdXNlciBwb3NpdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25TdWNjZXNzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uRXJyb3JcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBfaW5pdFdhdGNoR1BTOiBmdW5jdGlvbiAob25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgaWYgKCFvbkVycm9yKSB7XG4gICAgICBjb25zdCB0aGF0ID0gdGhpc1xuICAgICAgb25FcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiRVJST1IoXCIgKyBlcnIuY29kZSArIFwiKTogXCIgKyBlcnIubWVzc2FnZSk7XG5cbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAxKSB7XG4gICAgICAgICAgLy8gVXNlciBkZW5pZWQgR2VvTG9jYXRpb24sIGxldCB0aGVpciBrbm93IHRoYXRcbiAgICAgICAgICB0aGF0LmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgXCJQbGVhc2UgYWN0aXZhdGUgR2VvbG9jYXRpb24gYW5kIHJlZnJlc2ggdGhlIHBhZ2UuIElmIGl0IGlzIGFscmVhZHkgYWN0aXZlLCBwbGVhc2UgY2hlY2sgcGVybWlzc2lvbnMgZm9yIHRoaXMgd2Vic2l0ZS5cIlxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAzKSB7XG4gICAgICAgICAgdGhhdC5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIFwiQ2Fubm90IHJldHJpZXZlIEdQUyBwb3NpdGlvbi4gU2lnbmFsIGlzIGFic2VudC5cIlxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yID09PSBmYWxzZSkge1xuICAgICAgb25FcnJvcih7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIG1lc3NhZ2U6IFwiR2VvbG9jYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXJcIixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9HZW9sb2NhdGlvbi93YXRjaFBvc2l0aW9uXG4gICAgcmV0dXJuIG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKG9uU3VjY2Vzcywgb25FcnJvciwge1xuICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgbWF4aW11bUFnZTogdGhpcy5kYXRhLmdwc1RpbWVJbnRlcnZhbCxcbiAgICAgIHRpbWVvdXQ6IDI3MDAwLFxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlciBwb3NpdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBfdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBkb24ndCB1cGRhdGUgaWYgYWNjdXJhY3kgaXMgbm90IGdvb2QgZW5vdWdoXG4gICAgaWYgKHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA+IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5KSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmFsZXJ0ICYmICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXBvcHVwXCIpKSB7XG4gICAgICAgIHZhciBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHBvcHVwLmlubmVySFRNTCA9XG4gICAgICAgICAgXCJHUFMgc2lnbmFsIGlzIHZlcnkgcG9vci4gVHJ5IG1vdmUgb3V0ZG9vciBvciB0byBhbiBhcmVhIHdpdGggYSBiZXR0ZXIgc2lnbmFsLlwiO1xuICAgICAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImFsZXJ0LXBvcHVwXCIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvcHVwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWxlcnRQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtcG9wdXBcIik7XG4gICAgaWYgKFxuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzLmFjY3VyYWN5IDw9IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5ICYmXG4gICAgICBhbGVydFBvcHVwXG4gICAgKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGFsZXJ0UG9wdXApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgIC8vIGZpcnN0IGNhbWVyYSBpbml0aWFsaXphdGlvblxuICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSB0aGlzLmN1cnJlbnRDb29yZHM7XG4gICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuXG4gICAgICB2YXIgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hcmpzLWxvYWRlclwiKTtcbiAgICAgIGlmIChsb2FkZXIpIHtcbiAgICAgICAgbG9hZGVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcbiAgICB9XG4gIH0sXG4gIF9zZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XG5cbiAgICAvLyBjb21wdXRlIHBvc2l0aW9uLnhcbiAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgbG9uZ2l0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlLFxuICAgICAgbGF0aXR1ZGU6IHRoaXMub3JpZ2luQ29vcmRzLmxhdGl0dWRlLFxuICAgIH07XG5cbiAgICBwb3NpdGlvbi54ID0gdGhpcy5jb21wdXRlRGlzdGFuY2VNZXRlcnModGhpcy5vcmlnaW5Db29yZHMsIGRzdENvb3Jkcyk7XG4gICAgcG9zaXRpb24ueCAqPVxuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSA+IHRoaXMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSA/IDEgOiAtMTtcblxuICAgIC8vIGNvbXB1dGUgcG9zaXRpb24uelxuICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICBsb25naXR1ZGU6IHRoaXMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSxcbiAgICAgIGxhdGl0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsXG4gICAgfTtcblxuICAgIHBvc2l0aW9uLnogPSB0aGlzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyh0aGlzLm9yaWdpbkNvb3JkcywgZHN0Q29vcmRzKTtcbiAgICBwb3NpdGlvbi56ICo9XG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUgPiB0aGlzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSA/IC0xIDogMTtcblxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvblxuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwicG9zaXRpb25cIiwgcG9zaXRpb24pO1xuXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCB7XG4gICAgICAgIGRldGFpbDogeyBwb3NpdGlvbjogdGhpcy5jdXJyZW50Q29vcmRzLCBvcmlnaW46IHRoaXMub3JpZ2luQ29vcmRzIH0sXG4gICAgICB9KVxuICAgICk7XG4gIH0sXG4gIC8qKlxuICAgKiBSZXR1cm5zIGRpc3RhbmNlIGluIG1ldGVycyBiZXR3ZWVuIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gaW5wdXRzLlxuICAgKlxuICAgKiAgQ2FsY3VsYXRlIGRpc3RhbmNlLCBiZWFyaW5nIGFuZCBtb3JlIGJldHdlZW4gTGF0aXR1ZGUvTG9uZ2l0dWRlIHBvaW50c1xuICAgKiAgRGV0YWlsczogaHR0cHM6Ly93d3cubW92YWJsZS10eXBlLmNvLnVrL3NjcmlwdHMvbGF0bG9uZy5odG1sXG4gICAqXG4gICAqIEBwYXJhbSB7UG9zaXRpb259IHNyY1xuICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBkZXN0XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNQbGFjZVxuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBkaXN0YW5jZSB8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAqL1xuICBjb21wdXRlRGlzdGFuY2VNZXRlcnM6IGZ1bmN0aW9uIChzcmMsIGRlc3QsIGlzUGxhY2UpIHtcbiAgICB2YXIgZGlzdGFuY2UgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KHNyYywgZGVzdCk7XG5cbiAgICAvLyBpZiBmdW5jdGlvbiBoYXMgYmVlbiBjYWxsZWQgZm9yIGEgcGxhY2UsIGFuZCBpZiBpdCdzIHRvbyBuZWFyIGFuZCBhIG1pbiBkaXN0YW5jZSBoYXMgYmVlbiBzZXQsXG4gICAgLy8gcmV0dXJuIG1heCBkaXN0YW5jZSBwb3NzaWJsZSAtIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGNhbGxlclxuICAgIGlmIChcbiAgICAgIGlzUGxhY2UgJiZcbiAgICAgIHRoaXMuZGF0YS5taW5EaXN0YW5jZSAmJlxuICAgICAgdGhpcy5kYXRhLm1pbkRpc3RhbmNlID4gMCAmJlxuICAgICAgZGlzdGFuY2UgPCB0aGlzLmRhdGEubWluRGlzdGFuY2VcbiAgICApIHtcbiAgICAgIHJldHVybiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG5cbiAgICAvLyBpZiBmdW5jdGlvbiBoYXMgYmVlbiBjYWxsZWQgZm9yIGEgcGxhY2UsIGFuZCBpZiBpdCdzIHRvbyBmYXIgYW5kIGEgbWF4IGRpc3RhbmNlIGhhcyBiZWVuIHNldCxcbiAgICAvLyByZXR1cm4gbWF4IGRpc3RhbmNlIHBvc3NpYmxlIC0gdG8gYmUgaGFuZGxlZCBieSB0aGUgY2FsbGVyXG4gICAgaWYgKFxuICAgICAgaXNQbGFjZSAmJlxuICAgICAgdGhpcy5kYXRhLm1heERpc3RhbmNlICYmXG4gICAgICB0aGlzLmRhdGEubWF4RGlzdGFuY2UgPiAwICYmXG4gICAgICBkaXN0YW5jZSA+IHRoaXMuZGF0YS5tYXhEaXN0YW5jZVxuICAgICkge1xuICAgICAgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIH1cblxuICAgIHJldHVybiBkaXN0YW5jZTtcbiAgfSxcblxuICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24gKHNyYywgZGVzdCkge1xuICAgIHZhciBkbG9uZ2l0dWRlID0gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XG4gICAgdmFyIGRsYXRpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgIHZhciBhID1cbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xuICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcbiAgICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgIHZhciBhbmdsZSA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcbiAgfSxcblxuICAvKipcbiAgICogQ29tcHV0ZSBjb21wYXNzIGhlYWRpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxuICAgKiBAcGFyYW0ge251bWJlcn0gYmV0YVxuICAgKiBAcGFyYW0ge251bWJlcn0gZ2FtbWFcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gY29tcGFzcyBoZWFkaW5nXG4gICAqL1xuICBfY29tcHV0ZUNvbXBhc3NIZWFkaW5nOiBmdW5jdGlvbiAoYWxwaGEsIGJldGEsIGdhbW1hKSB7XG4gICAgLy8gQ29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnNcbiAgICB2YXIgYWxwaGFSYWQgPSBhbHBoYSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB2YXIgYmV0YVJhZCA9IGJldGEgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgdmFyIGdhbW1hUmFkID0gZ2FtbWEgKiAoTWF0aC5QSSAvIDE4MCk7XG5cbiAgICAvLyBDYWxjdWxhdGUgZXF1YXRpb24gY29tcG9uZW50c1xuICAgIHZhciBjQSA9IE1hdGguY29zKGFscGhhUmFkKTtcbiAgICB2YXIgc0EgPSBNYXRoLnNpbihhbHBoYVJhZCk7XG4gICAgdmFyIHNCID0gTWF0aC5zaW4oYmV0YVJhZCk7XG4gICAgdmFyIGNHID0gTWF0aC5jb3MoZ2FtbWFSYWQpO1xuICAgIHZhciBzRyA9IE1hdGguc2luKGdhbW1hUmFkKTtcblxuICAgIC8vIENhbGN1bGF0ZSBBLCBCLCBDIHJvdGF0aW9uIGNvbXBvbmVudHNcbiAgICB2YXIgckEgPSAtY0EgKiBzRyAtIHNBICogc0IgKiBjRztcbiAgICB2YXIgckIgPSAtc0EgKiBzRyArIGNBICogc0IgKiBjRztcblxuICAgIC8vIENhbGN1bGF0ZSBjb21wYXNzIGhlYWRpbmdcbiAgICB2YXIgY29tcGFzc0hlYWRpbmcgPSBNYXRoLmF0YW4ockEgLyByQik7XG5cbiAgICAvLyBDb252ZXJ0IGZyb20gaGFsZiB1bml0IGNpcmNsZSB0byB3aG9sZSB1bml0IGNpcmNsZVxuICAgIGlmIChyQiA8IDApIHtcbiAgICAgIGNvbXBhc3NIZWFkaW5nICs9IE1hdGguUEk7XG4gICAgfSBlbHNlIGlmIChyQSA8IDApIHtcbiAgICAgIGNvbXBhc3NIZWFkaW5nICs9IDIgKiBNYXRoLlBJO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzXG4gICAgY29tcGFzc0hlYWRpbmcgKj0gMTgwIC8gTWF0aC5QSTtcblxuICAgIHJldHVybiBjb21wYXNzSGVhZGluZztcbiAgfSxcblxuICAvKipcbiAgICogSGFuZGxlciBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF9vbkRldmljZU9yaWVudGF0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeSA8IDUwKSB7XG4gICAgICAgIHRoaXMuaGVhZGluZyA9IGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwid2Via2l0Q29tcGFzc0FjY3VyYWN5IGlzIGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGV2ZW50LmFscGhhICE9PSBudWxsKSB7XG4gICAgICBpZiAoZXZlbnQuYWJzb2x1dGUgPT09IHRydWUgfHwgZXZlbnQuYWJzb2x1dGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmhlYWRpbmcgPSB0aGlzLl9jb21wdXRlQ29tcGFzc0hlYWRpbmcoXG4gICAgICAgICAgZXZlbnQuYWxwaGEsXG4gICAgICAgICAgZXZlbnQuYmV0YSxcbiAgICAgICAgICBldmVudC5nYW1tYVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiZXZlbnQuYWJzb2x1dGUgPT09IGZhbHNlXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJldmVudC5hbHBoYSA9PT0gbnVsbFwiKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyIHJvdGF0aW9uIGRhdGEuXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgX3VwZGF0ZVJvdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhlYWRpbmcgPSAzNjAgLSB0aGlzLmhlYWRpbmc7XG4gICAgdmFyIGNhbWVyYVJvdGF0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJyb3RhdGlvblwiKS55O1xuICAgIHZhciB5YXdSb3RhdGlvbiA9IFRIUkVFLk1hdGhVdGlscy5yYWRUb0RlZyhcbiAgICAgIHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55XG4gICAgKTtcbiAgICB2YXIgb2Zmc2V0ID0gKGhlYWRpbmcgLSAoY2FtZXJhUm90YXRpb24gLSB5YXdSb3RhdGlvbikpICUgMzYwO1xuICAgIHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55ID0gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKG9mZnNldCk7XG4gIH0sXG5cbiAgX29uR3BzRW50aXR5UGxhY2VBZGRlZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGlmIHBsYWNlcyBhcmUgYWRkZWQgYWZ0ZXIgY2FtZXJhIGluaXRpYWxpemF0aW9uIGlzIGZpbmlzaGVkXG4gICAgaWYgKHRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIikpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2FkZXIgJiYgdGhpcy5sb2FkZXIucGFyZW50RWxlbWVudCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmxvYWRlcik7XG4gICAgfVxuICB9LFxufSk7XG4iLCJpbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtZW50aXR5LXBsYWNlXCIsIHtcbiAgX2NhbWVyYUdwczogbnVsbCxcbiAgc2NoZW1hOiB7XG4gICAgbG9uZ2l0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIGxhdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBjbGVhbmluZyBsaXN0ZW5lcnMgd2hlbiB0aGUgZW50aXR5IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiLFxuICAgICAgdGhpcy5jb29yZFNldExpc3RlbmVyXG4gICAgKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIixcbiAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lclxuICAgICk7XG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICB2YXIgY2FtZXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltncHMtY2FtZXJhXVwiKTtcbiAgICAgICAgaWYgKCFjYW1lcmEuY29tcG9uZW50c1tcImdwcy1jYW1lcmFcIl0pIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZ3BzLWNhbWVyYSBub3QgaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLWNhbWVyYVwiXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lciA9IChldikgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRhdGEgfHwgIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICAgIGxvbmdpdHVkZTogdGhpcy5kYXRhLmxvbmdpdHVkZSxcbiAgICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5sYXRpdHVkZSxcbiAgICAgIH07XG5cbiAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAgdmFyIGRpc3RhbmNlRm9yTXNnID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhcbiAgICAgICAgZXYuZGV0YWlsLnBvc2l0aW9uLFxuICAgICAgICBkc3RDb29yZHNcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiZGlzdGFuY2VcIiwgZGlzdGFuY2VGb3JNc2cpO1xuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJkaXN0YW5jZU1zZ1wiLCB0aGlzLl9mb3JtYXREaXN0YW5jZShkaXN0YW5jZUZvck1zZykpO1xuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtZW50aXR5LXBsYWNlLXVwZGF0ZS1wb3NpdGlvblwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7IGRpc3RhbmNlOiBkaXN0YW5jZUZvck1zZyB9LFxuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgdmFyIGFjdHVhbERpc3RhbmNlID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhcbiAgICAgICAgZXYuZGV0YWlsLnBvc2l0aW9uLFxuICAgICAgICBkc3RDb29yZHMsXG4gICAgICAgIHRydWVcbiAgICAgICk7XG5cbiAgICAgIGlmIChhY3R1YWxEaXN0YW5jZSA9PT0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGVGb3JNaW5EaXN0YW5jZSh0aGlzLmVsLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIixcbiAgICAgIHRoaXMuY29vcmRTZXRMaXN0ZW5lclxuICAgICk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsXG4gICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXJcbiAgICApO1xuXG4gICAgdGhpcy5fcG9zaXRpb25YRGVidWcgPSAwO1xuXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsIHtcbiAgICAgICAgZGV0YWlsOiB7IGNvbXBvbmVudDogdGhpcy5lbCB9LFxuICAgICAgfSlcbiAgICApO1xuICB9LFxuICAvKipcbiAgICogSGlkZSBlbnRpdHkgYWNjb3JkaW5nIHRvIG1pbkRpc3RhbmNlIHByb3BlcnR5XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgaGlkZUZvck1pbkRpc3RhbmNlOiBmdW5jdGlvbiAoZWwsIGhpZGVFbnRpdHkpIHtcbiAgICBpZiAoaGlkZUVudGl0eSkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwidmlzaWJsZVwiLCBcImZhbHNlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJ2aXNpYmxlXCIsIFwidHJ1ZVwiKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBVcGRhdGUgcGxhY2UgcG9zaXRpb25cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBfdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9zaXRpb24gPSB7IHg6IDAsIHk6IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIikueSB8fCAwLCB6OiAwIH07XG5cbiAgICAvLyB1cGRhdGUgcG9zaXRpb24ueFxuICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZTogdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSxcbiAgICB9O1xuXG4gICAgcG9zaXRpb24ueCA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoXG4gICAgICB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLFxuICAgICAgZHN0Q29vcmRzXG4gICAgKTtcblxuICAgIHRoaXMuX3Bvc2l0aW9uWERlYnVnID0gcG9zaXRpb24ueDtcblxuICAgIHBvc2l0aW9uLnggKj1cbiAgICAgIHRoaXMuZGF0YS5sb25naXR1ZGUgPiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSA/IDEgOiAtMTtcblxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvbi56XG4gICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLmxhdGl0dWRlLFxuICAgIH07XG5cbiAgICBwb3NpdGlvbi56ID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhcbiAgICAgIHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMsXG4gICAgICBkc3RDb29yZHNcbiAgICApO1xuXG4gICAgcG9zaXRpb24ueiAqPVxuICAgICAgdGhpcy5kYXRhLmxhdGl0dWRlID4gdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSA/IC0xIDogMTtcblxuICAgIGlmIChwb3NpdGlvbi55ICE9PSAwKSB7XG4gICAgICB2YXIgYWx0aXR1ZGUgPVxuICAgICAgICB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmFsdGl0dWRlICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMuYWx0aXR1ZGVcbiAgICAgICAgICA6IDA7XG4gICAgICBwb3NpdGlvbi55ID0gcG9zaXRpb24ueSAtIGFsdGl0dWRlO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBlbGVtZW50J3MgcG9zaXRpb24gaW4gM0Qgd29ybGRcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIsIHBvc2l0aW9uKTtcbiAgfSxcblxuICAvKipcbiAgICogRm9ybWF0IGRpc3RhbmNlcyBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRpc3RhbmNlXG4gICAqL1xuXG4gIF9mb3JtYXREaXN0YW5jZTogZnVuY3Rpb24gKGRpc3RhbmNlKSB7XG4gICAgZGlzdGFuY2UgPSBkaXN0YW5jZS50b0ZpeGVkKDApO1xuXG4gICAgaWYgKGRpc3RhbmNlID49IDEwMDApIHtcbiAgICAgIHJldHVybiBkaXN0YW5jZSAvIDEwMDAgKyBcIiBraWxvbWV0ZXJzXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3RhbmNlICsgXCIgbWV0ZXJzXCI7XG4gIH0sXG59KTtcbiIsIi8qKiBncHMtcHJvamVjdGVkLWNhbWVyYVxuICpcbiAqIGJhc2VkIG9uIHRoZSBvcmlnaW5hbCBncHMtY2FtZXJhLCBtb2RpZmllZCBieSBuaWNrdyAwMi8wNC8yMFxuICpcbiAqIFJhdGhlciB0aGFuIGtlZXBpbmcgdHJhY2sgb2YgcG9zaXRpb24gYnkgY2FsY3VsYXRpbmcgdGhlIGRpc3RhbmNlIG9mXG4gKiBlbnRpdGllcyBvciB0aGUgY3VycmVudCBsb2NhdGlvbiB0byB0aGUgb3JpZ2luYWwgbG9jYXRpb24sIHRoaXMgdmVyc2lvblxuICogbWFrZXMgdXNlIG9mIHRoZSBcIkdvb2dsZVwiIFNwaGVyaWNhbCBNZXJjYWN0b3IgcHJvamVjdGlvbiwgYWthIGVwc2c6Mzg1Ny5cbiAqXG4gKiBUaGUgb3JpZ2luYWwgcG9zaXRpb24gKGxhdC9sb24pIGlzIHByb2plY3RlZCBpbnRvIFNwaGVyaWNhbCBNZXJjYXRvciBhbmRcbiAqIHN0b3JlZC5cbiAqXG4gKiBUaGVuLCB3aGVuIHdlIHJlY2VpdmUgYSBuZXcgcG9zaXRpb24gKGxhdC9sb24pLCB0aGlzIG5ldyBwb3NpdGlvbiBpc1xuICogcHJvamVjdGVkIGludG8gU3BoZXJpY2FsIE1lcmNhdG9yIGFuZCB0aGVuIGl0cyB3b3JsZCBwb3NpdGlvbiBjYWxjdWxhdGVkXG4gKiBieSBjb21wYXJpbmcgYWdhaW5zdCB0aGUgb3JpZ2luYWwgcG9zaXRpb24uXG4gKlxuICogVGhlIHNhbWUgaXMgYWxzbyB0aGUgY2FzZSBmb3IgJ2VudGl0eS1wbGFjZXMnOyB3aGVuIHRoZXNlIGFyZSBhZGRlZCwgdGhlaXJcbiAqIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZHMgYXJlIGNhbGN1bGF0ZWQgKHNlZSBncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZSkuXG4gKlxuICogU3BoZXJpY2FsIE1lcmNhdG9yIHVuaXRzIGFyZSBjbG9zZSB0bywgYnV0IG5vdCBleGFjdGx5LCBtZXRyZXMsIGFuZCBhcmVcbiAqIGhlYXZpbHkgZGlzdG9ydGVkIG5lYXIgdGhlIHBvbGVzLiBOb25ldGhlbGVzcyB0aGV5IGFyZSBhIGdvb2QgYXBwcm94aW1hdGlvblxuICogZm9yIG1hbnkgYXJlYXMgb2YgdGhlIHdvcmxkIGFuZCBhcHBlYXIgbm90IHRvIGNhdXNlIHVuYWNjZXB0YWJsZSBkaXN0b3J0aW9uc1xuICogd2hlbiB1c2VkIGFzIHRoZSB1bml0cyBmb3IgQVIgYXBwcy5cbiAqXG4gKiBVUERBVEVTIDI4LzA4LzIwOlxuICpcbiAqIC0gYWRkIGdwc01pbkRpc3RhbmNlIGFuZCBncHNUaW1lSW50ZXJ2YWwgcHJvcGVydGllcyB0byBjb250cm9sIGhvd1xuICogZnJlcXVlbnRseSBHUFMgdXBkYXRlcyBhcmUgcHJvY2Vzc2VkLiBBaW0gaXMgdG8gcHJldmVudCAnc3R1dHRlcmluZydcbiAqIGVmZmVjdHMgd2hlbiBjbG9zZSB0byBBUiBjb250ZW50IGR1ZSB0byBjb250aW51b3VzIHNtYWxsIGNoYW5nZXMgaW5cbiAqIGxvY2F0aW9uLlxuICovXG5cbmltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1wcm9qZWN0ZWQtY2FtZXJhXCIsIHtcbiAgX3dhdGNoUG9zaXRpb25JZDogbnVsbCxcbiAgb3JpZ2luQ29vcmRzOiBudWxsLCAvLyBvcmlnaW5hbCBjb29yZHMgbm93IGluIFNwaGVyaWNhbCBNZXJjYXRvclxuICBjdXJyZW50Q29vcmRzOiBudWxsLFxuICBsb29rQ29udHJvbHM6IG51bGwsXG4gIGhlYWRpbmc6IG51bGwsXG4gIHNjaGVtYToge1xuICAgIHNpbXVsYXRlTGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVMb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVBbHRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBwb3NpdGlvbk1pbkFjY3VyYWN5OiB7XG4gICAgICB0eXBlOiBcImludFwiLFxuICAgICAgZGVmYXVsdDogMTAwLFxuICAgIH0sXG4gICAgYWxlcnQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBtaW5EaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJpbnRcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBncHNNaW5EaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBncHNUaW1lSW50ZXJ2YWw6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcblxuICAgICAgLy8gcmUtdHJpZ2dlciBpbml0aWFsaXphdGlvbiBmb3IgbmV3IG9yaWdpblxuICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSBudWxsO1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wiYXJqcy1sb29rLWNvbnRyb2xzXCJdICYmXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFBvc2l0aW9uID0ge1xuICAgICAgbGF0aXR1ZGU6IDAsXG4gICAgICBsb25naXR1ZGU6IDAsXG4gICAgfTtcblxuICAgIHRoaXMubG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICB0aGlzLmxvYWRlci5jbGFzc0xpc3QuYWRkKFwiYXJqcy1sb2FkZXJcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmxvYWRlcik7XG5cbiAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCA9IHRoaXMuX29uR3BzRW50aXR5UGxhY2VBZGRlZC5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsXG4gICAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZFxuICAgICk7XG5cbiAgICB0aGlzLmxvb2tDb250cm9scyA9XG4gICAgICB0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWxvb2stY29udHJvbHNcIl0gfHxcbiAgICAgIHRoaXMuZWwuY29tcG9uZW50c1tcImxvb2stY29udHJvbHNcIl07XG5cbiAgICAvLyBsaXN0ZW4gdG8gZGV2aWNlb3JpZW50YXRpb24gZXZlbnRcbiAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWUoKTtcbiAgICB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uID0gdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbi5iaW5kKHRoaXMpO1xuXG4gICAgLy8gaWYgU2FmYXJpXG4gICAgaWYgKCEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcL1tcXGQuXSsuKlNhZmFyaS8pKSB7XG4gICAgICAvLyBpT1MgMTMrXG4gICAgICBpZiAodHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3RpbmcgZGV2aWNlIG9yaWVudGF0aW9uIHBlcm1pc3Npb25zLi4uXCIpO1xuICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcInRvdWNoZW5kXCIsXG4gICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgIFwiQWZ0ZXIgY2FtZXJhIHBlcm1pc3Npb24gcHJvbXB0LCBwbGVhc2UgdGFwIHRoZSBzY3JlZW4gdG8gYWN0aXZhdGUgZ2VvbG9jYXRpb24uXCJcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIFwiUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuXCJcbiAgICAgICAgICApO1xuICAgICAgICB9LCA3NTApO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSB7XG4gICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudENvb3JkcyB8fCB7fSk7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxhdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGU7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gdGhpcy5faW5pdFdhdGNoR1BTKFxuICAgICAgICBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIGxhdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICBhbHRpdHVkZTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlLFxuICAgICAgICAgICAgYWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSxcbiAgICAgICAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgICAgIHZhciBkaXN0TW92ZWQgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KFxuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24sXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHNcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGRpc3RNb3ZlZCA+PSB0aGlzLmRhdGEuZ3BzTWluRGlzdGFuY2UgfHwgIXRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5oZWFkaW5nID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3VwZGF0ZVJvdGF0aW9uKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgIH1cbiAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsXG4gICAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZFxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQgbmFtZSwgZGVwZW5kcyBvbiBicm93c2VyIGltcGxlbWVudGF0aW9uLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBldmVudCBuYW1lXG4gICAqL1xuICBfZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoXCJvbmRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIiBpbiB3aW5kb3cpIHtcbiAgICAgIHZhciBldmVudE5hbWUgPSBcImRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIjtcbiAgICB9IGVsc2UgaWYgKFwib25kZXZpY2VvcmllbnRhdGlvblwiIGluIHdpbmRvdykge1xuICAgICAgdmFyIGV2ZW50TmFtZSA9IFwiZGV2aWNlb3JpZW50YXRpb25cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGV2ZW50TmFtZSA9IFwiXCI7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ29tcGFzcyBub3Qgc3VwcG9ydGVkXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBldmVudE5hbWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHVzZXIgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uU3VjY2Vzc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkVycm9yXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgX2luaXRXYXRjaEdQUzogZnVuY3Rpb24gKG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgIGlmICghb25FcnJvcikge1xuICAgICAgb25FcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiRVJST1IoXCIgKyBlcnIuY29kZSArIFwiKTogXCIgKyBlcnIubWVzc2FnZSk7XG5cbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAxKSB7XG4gICAgICAgICAgLy8gVXNlciBkZW5pZWQgR2VvTG9jYXRpb24sIGxldCB0aGVpciBrbm93IHRoYXRcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgXCJQbGVhc2UgYWN0aXZhdGUgR2VvbG9jYXRpb24gYW5kIHJlZnJlc2ggdGhlIHBhZ2UuIElmIGl0IGlzIGFscmVhZHkgYWN0aXZlLCBwbGVhc2UgY2hlY2sgcGVybWlzc2lvbnMgZm9yIHRoaXMgd2Vic2l0ZS5cIlxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAzKSB7XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIFwiQ2Fubm90IHJldHJpZXZlIEdQUyBwb3NpdGlvbi4gU2lnbmFsIGlzIGFic2VudC5cIlxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yID09PSBmYWxzZSkge1xuICAgICAgb25FcnJvcih7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIG1lc3NhZ2U6IFwiR2VvbG9jYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXJcIixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9HZW9sb2NhdGlvbi93YXRjaFBvc2l0aW9uXG4gICAgcmV0dXJuIG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKG9uU3VjY2Vzcywgb25FcnJvciwge1xuICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgbWF4aW11bUFnZTogdGhpcy5kYXRhLmdwc1RpbWVJbnRlcnZhbCxcbiAgICAgIHRpbWVvdXQ6IDI3MDAwLFxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlciBwb3NpdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBfdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBkb24ndCB1cGRhdGUgaWYgYWNjdXJhY3kgaXMgbm90IGdvb2QgZW5vdWdoXG4gICAgaWYgKHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA+IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5KSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmFsZXJ0ICYmICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXBvcHVwXCIpKSB7XG4gICAgICAgIHZhciBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHBvcHVwLmlubmVySFRNTCA9XG4gICAgICAgICAgXCJHUFMgc2lnbmFsIGlzIHZlcnkgcG9vci4gVHJ5IG1vdmUgb3V0ZG9vciBvciB0byBhbiBhcmVhIHdpdGggYSBiZXR0ZXIgc2lnbmFsLlwiO1xuICAgICAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImFsZXJ0LXBvcHVwXCIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvcHVwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWxlcnRQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtcG9wdXBcIik7XG4gICAgaWYgKFxuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzLmFjY3VyYWN5IDw9IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5ICYmXG4gICAgICBhbGVydFBvcHVwXG4gICAgKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGFsZXJ0UG9wdXApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgIC8vIGZpcnN0IGNhbWVyYSBpbml0aWFsaXphdGlvblxuICAgICAgLy8gTm93IHN0b3JlIG9yaWdpbkNvb3JkcyBhcyBQUk9KRUNURUQgb3JpZ2luYWwgbGF0L2xvbiwgc28gdGhhdFxuICAgICAgLy8gd2UgY2FuIHNldCB0aGUgd29ybGQgb3JpZ2luIHRvIHRoZSBvcmlnaW5hbCBwb3NpdGlvbiBpbiBcIm1ldHJlc1wiXG4gICAgICB0aGlzLm9yaWdpbkNvb3JkcyA9IHRoaXMuX3Byb2plY3QoXG4gICAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZVxuICAgICAgKTtcbiAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XG5cbiAgICAgIHZhciBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFyanMtbG9hZGVyXCIpO1xuICAgICAgaWYgKGxvYWRlcikge1xuICAgICAgICBsb2FkZXIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFNldCB0aGUgY3VycmVudCBwb3NpdGlvbiAoaW4gd29ybGQgY29vcmRzLCBiYXNlZCBvbiBTcGhlcmljYWwgTWVyY2F0b3IpXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgX3NldFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKTtcblxuICAgIHZhciB3b3JsZENvb3JkcyA9IHRoaXMubGF0TG9uVG9Xb3JsZChcbiAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcbiAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGVcbiAgICApO1xuXG4gICAgcG9zaXRpb24ueCA9IHdvcmxkQ29vcmRzWzBdO1xuICAgIHBvc2l0aW9uLnogPSB3b3JsZENvb3Jkc1sxXTtcblxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvblxuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwicG9zaXRpb25cIiwgcG9zaXRpb24pO1xuXG4gICAgLy8gYWRkIHRoZSBzcGhtZXJjIHBvc2l0aW9uIHRvIHRoZSBldmVudCAoZm9yIHRlc3Rpbmcgb25seSlcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsIHtcbiAgICAgICAgZGV0YWlsOiB7IHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRDb29yZHMsIG9yaWdpbjogdGhpcy5vcmlnaW5Db29yZHMgfSxcbiAgICAgIH0pXG4gICAgKTtcbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgZGlzdGFuY2UgaW4gbWV0ZXJzIGJldHdlZW4gY2FtZXJhIGFuZCBkZXN0aW5hdGlvbiBpbnB1dC5cbiAgICpcbiAgICogQXNzdW1lIHdlIGFyZSB1c2luZyBhIG1ldHJlLWJhc2VkIHByb2plY3Rpb24uIE5vdCBhbGwgJ21ldHJlLWJhc2VkJ1xuICAgKiBwcm9qZWN0aW9ucyBnaXZlIGV4YWN0IG1ldHJlcywgZS5nLiBTcGhlcmljYWwgTWVyY2F0b3IsIGJ1dCBpdCBhcHBlYXJzXG4gICAqIGNsb3NlIGVub3VnaCB0byBiZSB1c2VkIGZvciBBUiBhdCBsZWFzdCBpbiBtaWRkbGUgdGVtcGVyYXRlXG4gICAqIGxhdGl0dWRlcyAoNDAgLSA1NSkuIEl0IGlzIGhlYXZpbHkgZGlzdG9ydGVkIG5lYXIgdGhlIHBvbGVzLCBob3dldmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBkZXN0XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNQbGFjZVxuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBkaXN0YW5jZSB8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAqL1xuICBjb21wdXRlRGlzdGFuY2VNZXRlcnM6IGZ1bmN0aW9uIChkZXN0LCBpc1BsYWNlKSB7XG4gICAgdmFyIHNyYyA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XG4gICAgdmFyIGR4ID0gZGVzdC54IC0gc3JjLng7XG4gICAgdmFyIGR6ID0gZGVzdC56IC0gc3JjLno7XG4gICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeiAqIGR6KTtcblxuICAgIC8vIGlmIGZ1bmN0aW9uIGhhcyBiZWVuIGNhbGxlZCBmb3IgYSBwbGFjZSwgYW5kIGlmIGl0J3MgdG9vIG5lYXIgYW5kIGEgbWluIGRpc3RhbmNlIGhhcyBiZWVuIHNldCxcbiAgICAvLyByZXR1cm4gbWF4IGRpc3RhbmNlIHBvc3NpYmxlIC0gdG8gYmUgaGFuZGxlZCBieSB0aGUgIG1ldGhvZCBjYWxsZXJcbiAgICBpZiAoXG4gICAgICBpc1BsYWNlICYmXG4gICAgICB0aGlzLmRhdGEubWluRGlzdGFuY2UgJiZcbiAgICAgIHRoaXMuZGF0YS5taW5EaXN0YW5jZSA+IDAgJiZcbiAgICAgIGRpc3RhbmNlIDwgdGhpcy5kYXRhLm1pbkRpc3RhbmNlXG4gICAgKSB7XG4gICAgICByZXR1cm4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3RhbmNlO1xuICB9LFxuICAvKipcbiAgICogQ29udmVydHMgbGF0aXR1ZGUvbG9uZ2l0dWRlIHRvIE9wZW5HTCB3b3JsZCBjb29yZGluYXRlcy5cbiAgICpcbiAgICogRmlyc3QgcHJvamVjdHMgbGF0L2xvbiB0byBhYnNvbHV0ZSBTcGhlcmljYWwgTWVyY2F0b3IgYW5kIHRoZW5cbiAgICogY2FsY3VsYXRlcyB0aGUgd29ybGQgY29vcmRpbmF0ZXMgYnkgY29tcGFyaW5nIHRoZSBTcGhlcmljYWwgTWVyY2F0b3JcbiAgICogY29vcmRpbmF0ZXMgd2l0aCB0aGUgU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkaW5hdGVzIG9mIHRoZSBvcmlnaW4gcG9pbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsYXRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxvblxuICAgKlxuICAgKiBAcmV0dXJucyB7YXJyYXl9IHdvcmxkIGNvb3JkaW5hdGVzXG4gICAqL1xuICBsYXRMb25Ub1dvcmxkOiBmdW5jdGlvbiAobGF0LCBsb24pIHtcbiAgICB2YXIgcHJvamVjdGVkID0gdGhpcy5fcHJvamVjdChsYXQsIGxvbik7XG4gICAgLy8gU2lnbiBvZiB6IG5lZWRzIHRvIGJlIHJldmVyc2VkIGNvbXBhcmVkIHRvIHByb2plY3RlZCBjb29yZGluYXRlc1xuICAgIHJldHVybiBbXG4gICAgICBwcm9qZWN0ZWRbMF0gLSB0aGlzLm9yaWdpbkNvb3Jkc1swXSxcbiAgICAgIC0ocHJvamVjdGVkWzFdIC0gdGhpcy5vcmlnaW5Db29yZHNbMV0pLFxuICAgIF07XG4gIH0sXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBsYXRpdHVkZS9sb25naXR1ZGUgdG8gU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkaW5hdGVzLlxuICAgKiBBbGdvcml0aG0gaXMgdXNlZCBpbiBzZXZlcmFsIE9wZW5TdHJlZXRNYXAtcmVsYXRlZCBhcHBsaWNhdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsYXRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxvblxuICAgKlxuICAgKiBAcmV0dXJucyB7YXJyYXl9IFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlc1xuICAgKi9cbiAgX3Byb2plY3Q6IGZ1bmN0aW9uIChsYXQsIGxvbikge1xuICAgIGNvbnN0IEhBTEZfRUFSVEggPSAyMDAzNzUwOC4zNDtcblxuICAgIC8vIENvbnZlcnQgdGhlIHN1cHBsaWVkIGNvb3JkcyB0byBTcGhlcmljYWwgTWVyY2F0b3IgKEVQU0c6Mzg1NyksIGFsc29cbiAgICAvLyBrbm93biBhcyAnR29vZ2xlIFByb2plY3Rpb24nLCB1c2luZyB0aGUgYWxnb3JpdGhtIHVzZWQgZXh0ZW5zaXZlbHlcbiAgICAvLyBpbiB2YXJpb3VzIE9wZW5TdHJlZXRNYXAgc29mdHdhcmUuXG4gICAgdmFyIHkgPVxuICAgICAgTWF0aC5sb2coTWF0aC50YW4oKCg5MCArIGxhdCkgKiBNYXRoLlBJKSAvIDM2MC4wKSkgLyAoTWF0aC5QSSAvIDE4MC4wKTtcbiAgICByZXR1cm4gWyhsb24gLyAxODAuMCkgKiBIQUxGX0VBUlRILCAoeSAqIEhBTEZfRUFSVEgpIC8gMTgwLjBdO1xuICB9LFxuICAvKipcbiAgICogQ29udmVydHMgU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkaW5hdGVzIHRvIGxhdGl0dWRlL2xvbmdpdHVkZS5cbiAgICogQWxnb3JpdGhtIGlzIHVzZWQgaW4gc2V2ZXJhbCBPcGVuU3RyZWV0TWFwLXJlbGF0ZWQgYXBwbGljYXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3BoZXJpY2FsIG1lcmNhdG9yIGVhc3RpbmdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNwaGVyaWNhbCBtZXJjYXRvciBub3J0aGluZ1xuICAgKlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSBsb24vbGF0XG4gICAqL1xuICBfdW5wcm9qZWN0OiBmdW5jdGlvbiAoZSwgbikge1xuICAgIGNvbnN0IEhBTEZfRUFSVEggPSAyMDAzNzUwOC4zNDtcbiAgICB2YXIgeXAgPSAobiAvIEhBTEZfRUFSVEgpICogMTgwLjA7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvbmdpdHVkZTogKGUgLyBIQUxGX0VBUlRIKSAqIDE4MC4wLFxuICAgICAgbGF0aXR1ZGU6XG4gICAgICAgICgxODAuMCAvIE1hdGguUEkpICpcbiAgICAgICAgKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoKHlwICogTWF0aC5QSSkgLyAxODAuMCkpIC0gTWF0aC5QSSAvIDIpLFxuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDb21wdXRlIGNvbXBhc3MgaGVhZGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZXRhXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBnYW1tYVxuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjb21wYXNzIGhlYWRpbmdcbiAgICovXG4gIF9jb21wdXRlQ29tcGFzc0hlYWRpbmc6IGZ1bmN0aW9uIChhbHBoYSwgYmV0YSwgZ2FtbWEpIHtcbiAgICAvLyBDb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xuICAgIHZhciBhbHBoYVJhZCA9IGFscGhhICogKE1hdGguUEkgLyAxODApO1xuICAgIHZhciBiZXRhUmFkID0gYmV0YSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB2YXIgZ2FtbWFSYWQgPSBnYW1tYSAqIChNYXRoLlBJIC8gMTgwKTtcblxuICAgIC8vIENhbGN1bGF0ZSBlcXVhdGlvbiBjb21wb25lbnRzXG4gICAgdmFyIGNBID0gTWF0aC5jb3MoYWxwaGFSYWQpO1xuICAgIHZhciBzQSA9IE1hdGguc2luKGFscGhhUmFkKTtcbiAgICB2YXIgc0IgPSBNYXRoLnNpbihiZXRhUmFkKTtcbiAgICB2YXIgY0cgPSBNYXRoLmNvcyhnYW1tYVJhZCk7XG4gICAgdmFyIHNHID0gTWF0aC5zaW4oZ2FtbWFSYWQpO1xuXG4gICAgLy8gQ2FsY3VsYXRlIEEsIEIsIEMgcm90YXRpb24gY29tcG9uZW50c1xuICAgIHZhciByQSA9IC1jQSAqIHNHIC0gc0EgKiBzQiAqIGNHO1xuICAgIHZhciByQiA9IC1zQSAqIHNHICsgY0EgKiBzQiAqIGNHO1xuXG4gICAgLy8gQ2FsY3VsYXRlIGNvbXBhc3MgaGVhZGluZ1xuICAgIHZhciBjb21wYXNzSGVhZGluZyA9IE1hdGguYXRhbihyQSAvIHJCKTtcblxuICAgIC8vIENvbnZlcnQgZnJvbSBoYWxmIHVuaXQgY2lyY2xlIHRvIHdob2xlIHVuaXQgY2lyY2xlXG4gICAgaWYgKHJCIDwgMCkge1xuICAgICAgY29tcGFzc0hlYWRpbmcgKz0gTWF0aC5QSTtcbiAgICB9IGVsc2UgaWYgKHJBIDwgMCkge1xuICAgICAgY29tcGFzc0hlYWRpbmcgKz0gMiAqIE1hdGguUEk7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXNcbiAgICBjb21wYXNzSGVhZGluZyAqPSAxODAgLyBNYXRoLlBJO1xuXG4gICAgcmV0dXJuIGNvbXBhc3NIZWFkaW5nO1xuICB9LFxuXG4gIC8qKlxuICAgKiBIYW5kbGVyIGZvciBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgX29uRGV2aWNlT3JpZW50YXRpb246IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzSGVhZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5IDwgNTApIHtcbiAgICAgICAgdGhpcy5oZWFkaW5nID0gZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJ3ZWJraXRDb21wYXNzQWNjdXJhY3kgaXMgZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5XCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZXZlbnQuYWxwaGEgIT09IG51bGwpIHtcbiAgICAgIGlmIChldmVudC5hYnNvbHV0ZSA9PT0gdHJ1ZSB8fCBldmVudC5hYnNvbHV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuaGVhZGluZyA9IHRoaXMuX2NvbXB1dGVDb21wYXNzSGVhZGluZyhcbiAgICAgICAgICBldmVudC5hbHBoYSxcbiAgICAgICAgICBldmVudC5iZXRhLFxuICAgICAgICAgIGV2ZW50LmdhbW1hXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJldmVudC5hYnNvbHV0ZSA9PT0gZmFsc2VcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcImV2ZW50LmFscGhhID09PSBudWxsXCIpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIHVzZXIgcm90YXRpb24gZGF0YS5cbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBfdXBkYXRlUm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGVhZGluZyA9IDM2MCAtIHRoaXMuaGVhZGluZztcbiAgICB2YXIgY2FtZXJhUm90YXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInJvdGF0aW9uXCIpLnk7XG4gICAgdmFyIHlhd1JvdGF0aW9uID0gVEhSRUUuTWF0aFV0aWxzLnJhZFRvRGVnKFxuICAgICAgdGhpcy5sb29rQ29udHJvbHMueWF3T2JqZWN0LnJvdGF0aW9uLnlcbiAgICApO1xuICAgIHZhciBvZmZzZXQgPSAoaGVhZGluZyAtIChjYW1lcmFSb3RhdGlvbiAtIHlhd1JvdGF0aW9uKSkgJSAzNjA7XG4gICAgdGhpcy5sb29rQ29udHJvbHMueWF3T2JqZWN0LnJvdGF0aW9uLnkgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQob2Zmc2V0KTtcbiAgfSxcblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGhhdmVyc2luZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBsYXQvbG9uIHBhaXJzLlxuICAgKlxuICAgKiBUYWtlbiBmcm9tIGdwcy1jYW1lcmFcbiAgICovXG4gIF9oYXZlcnNpbmVEaXN0OiBmdW5jdGlvbiAoc3JjLCBkZXN0KSB7XG4gICAgdmFyIGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sb25naXR1ZGUgLSBzcmMubG9uZ2l0dWRlKTtcbiAgICB2YXIgZGxhdGl0dWRlID0gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUgLSBzcmMubGF0aXR1ZGUpO1xuXG4gICAgdmFyIGEgPVxuICAgICAgTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgKiBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSArXG4gICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKlxuICAgICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSkpICpcbiAgICAgICAgKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XG4gICAgdmFyIGFuZ2xlID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMSAtIGEpKTtcbiAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICB9LFxuXG4gIF9vbkdwc0VudGl0eVBsYWNlQWRkZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBpZiBwbGFjZXMgYXJlIGFkZGVkIGFmdGVyIGNhbWVyYSBpbml0aWFsaXphdGlvbiBpcyBmaW5pc2hlZFxuICAgIGlmICh0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyICYmIHRoaXMubG9hZGVyLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5sb2FkZXIpO1xuICAgIH1cbiAgfSxcbn0pO1xuIiwiLyoqIGdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlXG4gKlxuICogYmFzZWQgb24gdGhlIG9yaWdpbmFsIGdwcy1lbnRpdHktcGxhY2UsIG1vZGlmaWVkIGJ5IG5pY2t3IDAyLzA0LzIwXG4gKlxuICogUmF0aGVyIHRoYW4ga2VlcGluZyB0cmFjayBvZiBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGUgZGlzdGFuY2Ugb2ZcbiAqIGVudGl0aWVzIG9yIHRoZSBjdXJyZW50IGxvY2F0aW9uIHRvIHRoZSBvcmlnaW5hbCBsb2NhdGlvbiwgdGhpcyB2ZXJzaW9uXG4gKiBtYWtlcyB1c2Ugb2YgdGhlIFwiR29vZ2xlXCIgU3BoZXJpY2FsIE1lcmNhY3RvciBwcm9qZWN0aW9uLCBha2EgZXBzZzozODU3LlxuICpcbiAqIFRoZSBvcmlnaW5hbCBsb2NhdGlvbiBvbiBzdGFydHVwIChsYXQvbG9uKSBpcyBwcm9qZWN0ZWQgaW50byBTcGhlcmljYWxcbiAqIE1lcmNhdG9yIGFuZCBzdG9yZWQuXG4gKlxuICogV2hlbiAnZW50aXR5LXBsYWNlcycgYXJlIGFkZGVkLCB0aGVpciBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRzIGFyZVxuICogY2FsY3VsYXRlZCBhbmQgY29udmVydGVkIGludG8gd29ybGQgY29vcmRpbmF0ZXMsIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5hbFxuICogcG9zaXRpb24sIHVzaW5nIHRoZSBTcGhlcmljYWwgTWVyY2F0b3IgcHJvamVjdGlvbiBjYWxjdWxhdGlvbiBpblxuICogZ3BzLXByb2plY3RlZC1jYW1lcmEuXG4gKlxuICogU3BoZXJpY2FsIE1lcmNhdG9yIHVuaXRzIGFyZSBjbG9zZSB0bywgYnV0IG5vdCBleGFjdGx5LCBtZXRyZXMsIGFuZCBhcmVcbiAqIGhlYXZpbHkgZGlzdG9ydGVkIG5lYXIgdGhlIHBvbGVzLiBOb25ldGhlbGVzcyB0aGV5IGFyZSBhIGdvb2QgYXBwcm94aW1hdGlvblxuICogZm9yIG1hbnkgYXJlYXMgb2YgdGhlIHdvcmxkIGFuZCBhcHBlYXIgbm90IHRvIGNhdXNlIHVuYWNjZXB0YWJsZSBkaXN0b3J0aW9uc1xuICogd2hlbiB1c2VkIGFzIHRoZSB1bml0cyBmb3IgQVIgYXBwcy5cbiAqL1xuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2VcIiwge1xuICBfY2FtZXJhR3BzOiBudWxsLFxuICBzY2hlbWE6IHtcbiAgICBsb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgbGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIC8vIGNsZWFuaW5nIGxpc3RlbmVycyB3aGVuIHRoZSBlbnRpdHkgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET01cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIixcbiAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lclxuICAgICk7XG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBVc2VkIG5vdyB0byBnZXQgdGhlIEdQUyBjYW1lcmEgd2hlbiBpdCdzIGJlZW4gc2V0dXBcbiAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICB2YXIgY2FtZXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltncHMtcHJvamVjdGVkLWNhbWVyYV1cIik7XG4gICAgICAgIGlmICghY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtcHJvamVjdGVkLWNhbWVyYVwiXSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJncHMtcHJvamVjdGVkLWNhbWVyYSBub3QgaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLXByb2plY3RlZC1jYW1lcmFcIl07XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvbiBuZWVkcyB0byB3b3JyeSBhYm91dCBkaXN0YW5jZSBidXQgbm90aGluZyBlbHNlP1xuICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lciA9IChldikgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRhdGEgfHwgIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkc3RDb29yZHMgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIpO1xuXG4gICAgICAvLyBpdCdzIGFjdHVhbGx5IGEgJ2Rpc3RhbmNlIHBsYWNlJywgYnV0IHdlIGRvbid0IGNhbGwgaXQgd2l0aCBsYXN0IHBhcmFtLCBiZWNhdXNlIHdlIHdhbnQgdG8gcmV0cmlldmUgZGlzdGFuY2UgZXZlbiBpZiBpdCdzIDwgbWluRGlzdGFuY2UgcHJvcGVydHlcbiAgICAgIC8vIF9jb21wdXRlRGlzdGFuY2VNZXRlcnMgaXMgbm93IGdvaW5nIHRvIHVzZSB0aGUgcHJvamVjdGVkXG4gICAgICB2YXIgZGlzdGFuY2VGb3JNc2cgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKGRzdENvb3Jkcyk7XG5cbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiZGlzdGFuY2VcIiwgZGlzdGFuY2VGb3JNc2cpO1xuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJkaXN0YW5jZU1zZ1wiLCB0aGlzLl9mb3JtYXREaXN0YW5jZShkaXN0YW5jZUZvck1zZykpO1xuXG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChcImdwcy1lbnRpdHktcGxhY2UtdXBkYXRlLXBvc2l0aW9uXCIsIHtcbiAgICAgICAgICBkZXRhaWw6IHsgZGlzdGFuY2U6IGRpc3RhbmNlRm9yTXNnIH0sXG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICB2YXIgYWN0dWFsRGlzdGFuY2UgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKFxuICAgICAgICBkc3RDb29yZHMsXG4gICAgICAgIHRydWVcbiAgICAgICk7XG5cbiAgICAgIGlmIChhY3R1YWxEaXN0YW5jZSA9PT0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGVGb3JNaW5EaXN0YW5jZSh0aGlzLmVsLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFJldGFpbiBhcyB0aGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIEdQUyBjYW1lcmEgaXMgc2V0IHVwXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiLFxuICAgICAgdGhpcy5jb29yZFNldExpc3RlbmVyXG4gICAgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIixcbiAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lclxuICAgICk7XG5cbiAgICB0aGlzLl9wb3NpdGlvblhEZWJ1ZyA9IDA7XG5cbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIiwge1xuICAgICAgICBkZXRhaWw6IHsgY29tcG9uZW50OiB0aGlzLmVsIH0sXG4gICAgICB9KVxuICAgICk7XG4gIH0sXG4gIC8qKlxuICAgKiBIaWRlIGVudGl0eSBhY2NvcmRpbmcgdG8gbWluRGlzdGFuY2UgcHJvcGVydHlcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBoaWRlRm9yTWluRGlzdGFuY2U6IGZ1bmN0aW9uIChlbCwgaGlkZUVudGl0eSkge1xuICAgIGlmIChoaWRlRW50aXR5KSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJ2aXNpYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcInZpc2libGVcIiwgXCJ0cnVlXCIpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFVwZGF0ZSBwbGFjZSBwb3NpdGlvblxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG5cbiAgLy8gc2V0IHBvc2l0aW9uIHRvIHdvcmxkIGNvb3JkcyB1c2luZyB0aGUgbGF0L2xvblxuICBfdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgd29ybGRQb3MgPSB0aGlzLl9jYW1lcmFHcHMubGF0TG9uVG9Xb3JsZChcbiAgICAgIHRoaXMuZGF0YS5sYXRpdHVkZSxcbiAgICAgIHRoaXMuZGF0YS5sb25naXR1ZGVcbiAgICApO1xuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XG5cbiAgICAvLyB1cGRhdGUgZWxlbWVudCdzIHBvc2l0aW9uIGluIDNEIHdvcmxkXG4gICAgLy90aGlzLmVsLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBwb3NpdGlvbik7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiLCB7XG4gICAgICB4OiB3b3JsZFBvc1swXSxcbiAgICAgIHk6IHBvc2l0aW9uLnksXG4gICAgICB6OiB3b3JsZFBvc1sxXSxcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRm9ybWF0IGRpc3RhbmNlcyBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRpc3RhbmNlXG4gICAqL1xuXG4gIF9mb3JtYXREaXN0YW5jZTogZnVuY3Rpb24gKGRpc3RhbmNlKSB7XG4gICAgZGlzdGFuY2UgPSBkaXN0YW5jZS50b0ZpeGVkKDApO1xuXG4gICAgaWYgKGRpc3RhbmNlID49IDEwMDApIHtcbiAgICAgIHJldHVybiBkaXN0YW5jZSAvIDEwMDAgKyBcIiBraWxvbWV0ZXJzXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3RhbmNlICsgXCIgbWV0ZXJzXCI7XG4gIH0sXG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9hZnJhbWVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9hcmpzLWxvb2stY29udHJvbHNcIjtcbmltcG9ydCBcIi4vYXJqcy13ZWJjYW0tdGV4dHVyZVwiO1xuaW1wb3J0IFwiLi9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9sc1wiO1xuaW1wb3J0IFwiLi9ncHMtY2FtZXJhXCI7XG5pbXBvcnQgXCIuL2dwcy1lbnRpdHktcGxhY2VcIjtcbmltcG9ydCBcIi4vZ3BzLXByb2plY3RlZC1jYW1lcmFcIjtcbmltcG9ydCBcIi4vZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2VcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==