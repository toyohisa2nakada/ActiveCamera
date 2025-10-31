import * as THREE from "three";
import { PlaneGeometry, ShaderChunk as ShaderChunk$1, Object3D, Layers, MeshBasicMaterial, DoubleSide, AdditiveBlending, ObjectLoader, Bone, Group, Sprite, Points, LineSegments, LineLoop, Line, LOD, BatchedMesh, Box3, Sphere, InstancedMesh, InstancedBufferAttribute, Mesh, SkinnedMesh, LightProbe, HemisphereLight, SpotLight, RectAreaLight, PointLight, DirectionalLight, AmbientLight, OrthographicCamera, PerspectiveCamera, Scene, Color, Fog, FogExp2, DynamicDrawUsage, InstancedBufferGeometry, Uniform, ShaderMaterial, BufferGeometry, BufferAttribute, Clock, AnimationMixer, LoopOnce, MeshStandardMaterial, MeshPhysicalMaterial, Triangle, Vector3 as Vector3$1 } from "three";
const _lut = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let _seed = 1234567;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
function generateUUID() {
  const d0 = Math.random() * 4294967295 | 0;
  const d1 = Math.random() * 4294967295 | 0;
  const d2 = Math.random() * 4294967295 | 0;
  const d3 = Math.random() * 4294967295 | 0;
  const uuid = _lut[d0 & 255] + _lut[d0 >> 8 & 255] + _lut[d0 >> 16 & 255] + _lut[d0 >> 24 & 255] + "-" + _lut[d1 & 255] + _lut[d1 >> 8 & 255] + "-" + _lut[d1 >> 16 & 15 | 64] + _lut[d1 >> 24 & 255] + "-" + _lut[d2 & 63 | 128] + _lut[d2 >> 8 & 255] + "-" + _lut[d2 >> 16 & 255] + _lut[d2 >> 24 & 255] + _lut[d3 & 255] + _lut[d3 >> 8 & 255] + _lut[d3 >> 16 & 255] + _lut[d3 >> 24 & 255];
  return uuid.toLowerCase();
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function euclideanModulo(n, m) {
  return (n % m + m) % m;
}
function mapLinear(x, a1, a2, b1, b2) {
  return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}
function inverseLerp(x, y, value) {
  if (x !== y) {
    return (value - x) / (y - x);
  } else {
    return 0;
  }
}
function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}
function damp(x, y, lambda, dt) {
  return lerp(x, y, 1 - Math.exp(-lambda * dt));
}
function pingpong(x, length = 1) {
  return length - Math.abs(euclideanModulo(x, length * 2) - length);
}
function smoothstep(x, min, max) {
  if (x <= min)
    return 0;
  if (x >= max)
    return 1;
  x = (x - min) / (max - min);
  return x * x * (3 - 2 * x);
}
function smootherstep(x, min, max) {
  if (x <= min)
    return 0;
  if (x >= max)
    return 1;
  x = (x - min) / (max - min);
  return x * x * x * (x * (x * 6 - 15) + 10);
}
function randInt(low, high) {
  return low + Math.floor(Math.random() * (high - low + 1));
}
function randFloat(low, high) {
  return low + Math.random() * (high - low);
}
function randFloatSpread(range) {
  return range * (0.5 - Math.random());
}
function seededRandom(s) {
  if (s !== void 0)
    _seed = s;
  let t = _seed += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function degToRad(degrees) {
  return degrees * DEG2RAD;
}
function radToDeg(radians) {
  return radians * RAD2DEG;
}
function isPowerOfTwo(value) {
  return (value & value - 1) === 0 && value !== 0;
}
function ceilPowerOfTwo(value) {
  return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}
function floorPowerOfTwo(value) {
  return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}
function setQuaternionFromProperEuler(q, a, b, c, order) {
  const cos = Math.cos;
  const sin = Math.sin;
  const c2 = cos(b / 2);
  const s2 = sin(b / 2);
  const c13 = cos((a + c) / 2);
  const s13 = sin((a + c) / 2);
  const c1_3 = cos((a - c) / 2);
  const s1_3 = sin((a - c) / 2);
  const c3_1 = cos((c - a) / 2);
  const s3_1 = sin((c - a) / 2);
  switch (order) {
    case "XYX":
      q.set(c2 * s13, s2 * c1_3, s2 * s1_3, c2 * c13);
      break;
    case "YZY":
      q.set(s2 * s1_3, c2 * s13, s2 * c1_3, c2 * c13);
      break;
    case "ZXZ":
      q.set(s2 * c1_3, s2 * s1_3, c2 * s13, c2 * c13);
      break;
    case "XZX":
      q.set(c2 * s13, s2 * s3_1, s2 * c3_1, c2 * c13);
      break;
    case "YXY":
      q.set(s2 * c3_1, c2 * s13, s2 * s3_1, c2 * c13);
      break;
    case "ZYZ":
      q.set(s2 * s3_1, s2 * c3_1, c2 * s13, c2 * c13);
      break;
    default:
      console.warn("../math.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + order);
  }
}
function denormalize(value, array) {
  switch (array.constructor) {
    case Float32Array:
      return value;
    case Uint32Array:
      return value / 4294967295;
    case Uint16Array:
      return value / 65535;
    case Uint8Array:
      return value / 255;
    case Int32Array:
      return Math.max(value / 2147483647, -1);
    case Int16Array:
      return Math.max(value / 32767, -1);
    case Int8Array:
      return Math.max(value / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function normalize(value, array) {
  switch (array.constructor) {
    case Float32Array:
      return value;
    case Uint32Array:
      return Math.round(value * 4294967295);
    case Uint16Array:
      return Math.round(value * 65535);
    case Uint8Array:
      return Math.round(value * 255);
    case Int32Array:
      return Math.round(value * 2147483647);
    case Int16Array:
      return Math.round(value * 32767);
    case Int8Array:
      return Math.round(value * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const MathUtils = {
  DEG2RAD,
  RAD2DEG,
  generateUUID,
  clamp,
  euclideanModulo,
  mapLinear,
  inverseLerp,
  lerp,
  damp,
  pingpong,
  smoothstep,
  smootherstep,
  randInt,
  randFloat,
  randFloatSpread,
  seededRandom,
  degToRad,
  radToDeg,
  isPowerOfTwo,
  ceilPowerOfTwo,
  floorPowerOfTwo,
  setQuaternionFromProperEuler,
  normalize,
  denormalize
};
class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.isQuaternion = true;
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }
  static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
    let x0 = src0[srcOffset0 + 0], y0 = src0[srcOffset0 + 1], z0 = src0[srcOffset0 + 2], w0 = src0[srcOffset0 + 3];
    const x1 = src1[srcOffset1 + 0], y1 = src1[srcOffset1 + 1], z1 = src1[srcOffset1 + 2], w1 = src1[srcOffset1 + 3];
    if (t === 0) {
      dst[dstOffset + 0] = x0;
      dst[dstOffset + 1] = y0;
      dst[dstOffset + 2] = z0;
      dst[dstOffset + 3] = w0;
      return;
    }
    if (t === 1) {
      dst[dstOffset + 0] = x1;
      dst[dstOffset + 1] = y1;
      dst[dstOffset + 2] = z1;
      dst[dstOffset + 3] = w1;
      return;
    }
    if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
      let s = 1 - t;
      const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1, dir = cos >= 0 ? 1 : -1, sqrSin = 1 - cos * cos;
      if (sqrSin > Number.EPSILON) {
        const sin = Math.sqrt(sqrSin), len = Math.atan2(sin, cos * dir);
        s = Math.sin(s * len) / sin;
        t = Math.sin(t * len) / sin;
      }
      const tDir = t * dir;
      x0 = x0 * s + x1 * tDir;
      y0 = y0 * s + y1 * tDir;
      z0 = z0 * s + z1 * tDir;
      w0 = w0 * s + w1 * tDir;
      if (s === 1 - t) {
        const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
        x0 *= f;
        y0 *= f;
        z0 *= f;
        w0 *= f;
      }
    }
    dst[dstOffset] = x0;
    dst[dstOffset + 1] = y0;
    dst[dstOffset + 2] = z0;
    dst[dstOffset + 3] = w0;
  }
  static multiplyQuaternionsFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1) {
    const x0 = src0[srcOffset0];
    const y0 = src0[srcOffset0 + 1];
    const z0 = src0[srcOffset0 + 2];
    const w0 = src0[srcOffset0 + 3];
    const x1 = src1[srcOffset1];
    const y1 = src1[srcOffset1 + 1];
    const z1 = src1[srcOffset1 + 2];
    const w1 = src1[srcOffset1 + 3];
    dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
    dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
    dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
    dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
    return dst;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
    this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(value) {
    this._w = value;
    this._onChangeCallback();
  }
  set(x, y, z, w) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this._onChangeCallback();
    return this;
  }
  clone() {
    return new Quaternion(this._x, this._y, this._z, this._w);
  }
  copy(quaternion) {
    this._x = quaternion.x;
    this._y = quaternion.y;
    this._z = quaternion.z;
    this._w = quaternion.w;
    this._onChangeCallback();
    return this;
  }
  setFromEuler(euler, update = true) {
    const x = euler._x, y = euler._y, z = euler._z, order = euler._order;
    const cos = Math.cos;
    const sin = Math.sin;
    const c1 = cos(x / 2);
    const c2 = cos(y / 2);
    const c3 = cos(z / 2);
    const s1 = sin(x / 2);
    const s2 = sin(y / 2);
    const s3 = sin(z / 2);
    switch (order) {
      case "XYZ":
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "YXZ":
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "ZXY":
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "ZYX":
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "YZX":
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "XZY":
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      default:
        console.warn("../math.Quaternion: .setFromEuler() encountered an unknown order: " + order);
    }
    if (update === true)
      this._onChangeCallback();
    return this;
  }
  setFromAxisAngle(axis, angle) {
    const halfAngle = angle / 2, s = Math.sin(halfAngle);
    this._x = axis.x * s;
    this._y = axis.y * s;
    this._z = axis.z * s;
    this._w = Math.cos(halfAngle);
    this._onChangeCallback();
    return this;
  }
  setFromRotationMatrix(m) {
    const te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33;
    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1);
      this._w = 0.25 / s;
      this._x = (m32 - m23) * s;
      this._y = (m13 - m31) * s;
      this._z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      this._w = (m32 - m23) / s;
      this._x = 0.25 * s;
      this._y = (m12 + m21) / s;
      this._z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      this._w = (m13 - m31) / s;
      this._x = (m12 + m21) / s;
      this._y = 0.25 * s;
      this._z = (m23 + m32) / s;
    } else {
      const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      this._w = (m21 - m12) / s;
      this._x = (m13 + m31) / s;
      this._y = (m23 + m32) / s;
      this._z = 0.25 * s;
    }
    this._onChangeCallback();
    return this;
  }
  setFromUnitVectors(vFrom, vTo) {
    let r = vFrom.dot(vTo) + 1;
    if (r < Number.EPSILON) {
      r = 0;
      if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
        this._x = -vFrom.y;
        this._y = vFrom.x;
        this._z = 0;
        this._w = r;
      } else {
        this._x = 0;
        this._y = -vFrom.z;
        this._z = vFrom.y;
        this._w = r;
      }
    } else {
      this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
      this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
      this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
      this._w = r;
    }
    return this.normalize();
  }
  angleTo(q) {
    return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
  }
  rotateTowards(q, step) {
    const angle = this.angleTo(q);
    if (angle === 0)
      return this;
    const t = Math.min(1, step / angle);
    this.slerp(q, t);
    return this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    this._x *= -1;
    this._y *= -1;
    this._z *= -1;
    this._onChangeCallback();
    return this;
  }
  dot(v) {
    return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let l = this.length();
    if (l === 0) {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    } else {
      l = 1 / l;
      this._x = this._x * l;
      this._y = this._y * l;
      this._z = this._z * l;
      this._w = this._w * l;
    }
    this._onChangeCallback();
    return this;
  }
  multiply(q) {
    return this.multiplyQuaternions(this, q);
  }
  premultiply(q) {
    return this.multiplyQuaternions(q, this);
  }
  multiplyQuaternions(a, b) {
    const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
    const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
    this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    this._onChangeCallback();
    return this;
  }
  slerp(qb, t) {
    if (t === 0)
      return this;
    if (t === 1)
      return this.copy(qb);
    const x = this._x, y = this._y, z = this._z, w = this._w;
    let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
    if (cosHalfTheta < 0) {
      this._w = -qb._w;
      this._x = -qb._x;
      this._y = -qb._y;
      this._z = -qb._z;
      cosHalfTheta = -cosHalfTheta;
    } else {
      this.copy(qb);
    }
    if (cosHalfTheta >= 1) {
      this._w = w;
      this._x = x;
      this._y = y;
      this._z = z;
      return this;
    }
    const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;
      this._w = s * w + t * this._w;
      this._x = s * x + t * this._x;
      this._y = s * y + t * this._y;
      this._z = s * z + t * this._z;
      this.normalize();
      return this;
    }
    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    this._w = w * ratioA + this._w * ratioB;
    this._x = x * ratioA + this._x * ratioB;
    this._y = y * ratioA + this._y * ratioB;
    this._z = z * ratioA + this._z * ratioB;
    this._onChangeCallback();
    return this;
  }
  slerpQuaternions(qa, qb, t) {
    return this.copy(qa).slerp(qb, t);
  }
  random() {
    const theta1 = 2 * Math.PI * Math.random();
    const theta2 = 2 * Math.PI * Math.random();
    const x0 = Math.random();
    const r1 = Math.sqrt(1 - x0);
    const r2 = Math.sqrt(x0);
    return this.set(r1 * Math.sin(theta1), r1 * Math.cos(theta1), r2 * Math.sin(theta2), r2 * Math.cos(theta2));
  }
  equals(quaternion) {
    return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
  }
  fromArray(array, offset = 0) {
    this._x = array[offset];
    this._y = array[offset + 1];
    this._z = array[offset + 2];
    this._w = array[offset + 3];
    this._onChangeCallback();
    return this;
  }
  toArray(array = [], offset = 0) {
    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._w;
    return array;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(callback) {
    this._onChangeCallback = callback;
    return this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._w;
  }
}
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.isVector3 = true;
    Vector3.prototype.isVector3 = true;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x, y, z) {
    if (z === void 0)
      z = this.z;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  setScalar(scalar) {
    this.x = scalar;
    this.y = scalar;
    this.z = scalar;
    return this;
  }
  setX(x) {
    this.x = x;
    return this;
  }
  setY(y) {
    this.y = y;
    return this;
  }
  setZ(z) {
    this.z = z;
    return this;
  }
  setComponent(index, value) {
    switch (index) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      case 2:
        this.z = value;
        break;
      default:
        throw new Error("index is out of range: " + index);
    }
    return this;
  }
  getComponent(index) {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + index);
    }
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  addScalar(s) {
    this.x += s;
    this.y += s;
    this.z += s;
    return this;
  }
  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }
  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  subScalar(s) {
    this.x -= s;
    this.y -= s;
    this.z -= s;
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  multiplyVectors(a, b) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;
    return this;
  }
  applyEuler(euler) {
    return this.applyQuaternion(_quaternion$1.setFromEuler(euler));
  }
  applyAxisAngle(axis, angle) {
    return this.applyQuaternion(_quaternion$1.setFromAxisAngle(axis, angle));
  }
  applyMatrix3(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    this.x = e[0] * x + e[3] * y + e[6] * z;
    this.y = e[1] * x + e[4] * y + e[7] * z;
    this.z = e[2] * x + e[5] * y + e[8] * z;
    return this;
  }
  applyNormalMatrix(m) {
    return this.applyMatrix3(m).normalize();
  }
  applyMatrix4(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    return this;
  }
  applyQuaternion(q) {
    const vx = this.x, vy = this.y, vz = this.z;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    const tx = 2 * (qy * vz - qz * vy);
    const ty = 2 * (qz * vx - qx * vz);
    const tz = 2 * (qx * vy - qy * vx);
    this.x = vx + qw * tx + qy * tz - qz * ty;
    this.y = vy + qw * ty + qz * tx - qx * tz;
    this.z = vz + qw * tz + qx * ty - qy * tx;
    return this;
  }
  transformDirection(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;
    return this.normalize();
  }
  divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
  }
  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  }
  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);
    return this;
  }
  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);
    return this;
  }
  clamp(min, max) {
    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    this.z = Math.max(min.z, Math.min(max.z, this.z));
    return this;
  }
  clampScalar(minVal, maxVal) {
    this.x = Math.max(minVal, Math.min(maxVal, this.x));
    this.y = Math.max(minVal, Math.min(maxVal, this.y));
    this.z = Math.max(minVal, Math.min(maxVal, this.z));
    return this;
  }
  clampLength(min, max) {
    const length = this.length();
    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
  }
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }
  roundToZero() {
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);
    this.z = Math.trunc(this.z);
    return this;
  }
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(length) {
    return this.normalize().multiplyScalar(length);
  }
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    return this;
  }
  lerpVectors(v1, v2, alpha) {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    return this;
  }
  cross(v) {
    return this.crossVectors(this, v);
  }
  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }
  projectOnVector(v) {
    const denominator = v.lengthSq();
    if (denominator === 0)
      return this.set(0, 0, 0);
    const scalar = v.dot(this) / denominator;
    return this.copy(v).multiplyScalar(scalar);
  }
  projectOnPlane(planeNormal) {
    _vector.copy(this).projectOnVector(planeNormal);
    return this.sub(_vector);
  }
  reflect(normal) {
    return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));
  }
  angleTo(v) {
    const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (denominator === 0)
      return Math.PI / 2;
    const theta = this.dot(v) / denominator;
    return Math.acos(clamp(theta, -1, 1));
  }
  distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v));
  }
  distanceToSquared(v) {
    const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }
  manhattanDistanceTo(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
  }
  setFromSphericalCoords(radius, phi, theta) {
    const sinPhiRadius = Math.sin(phi) * radius;
    this.x = sinPhiRadius * Math.sin(theta);
    this.y = Math.cos(phi) * radius;
    this.z = sinPhiRadius * Math.cos(theta);
    return this;
  }
  setFromCylindricalCoords(radius, theta, y) {
    this.x = radius * Math.sin(theta);
    this.y = y;
    this.z = radius * Math.cos(theta);
    return this;
  }
  setFromMatrixPosition(m) {
    const e = m.elements;
    this.x = e[12];
    this.y = e[13];
    this.z = e[14];
    return this;
  }
  setFromMatrixScale(m) {
    const sx = this.setFromMatrixColumn(m, 0).length();
    const sy = this.setFromMatrixColumn(m, 1).length();
    const sz = this.setFromMatrixColumn(m, 2).length();
    this.x = sx;
    this.y = sy;
    this.z = sz;
    return this;
  }
  setFromMatrixColumn(m, index) {
    return this.fromArray(m.elements, index * 4);
  }
  setFromMatrix3Column(m, index) {
    return this.fromArray(m.elements, index * 3);
  }
  setFromEuler(e) {
    this.x = e._x;
    this.y = e._y;
    this.z = e._z;
    return this;
  }
  equals(v) {
    return v.x === this.x && v.y === this.y && v.z === this.z;
  }
  fromArray(array, offset = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    return this;
  }
  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    return array;
  }
  random() {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    return this;
  }
  randomDirection() {
    const theta = Math.random() * Math.PI * 2;
    const u = Math.random() * 2 - 1;
    const c = Math.sqrt(1 - u * u);
    this.x = c * Math.cos(theta);
    this.y = u;
    this.z = c * Math.sin(theta);
    return this;
  }
  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  }
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
}
const _vector = new Vector3();
const _quaternion$1 = new Quaternion();
const WebGLCoordinateSystem = 2e3;
const WebGPUCoordinateSystem = 2001;
class Matrix4 {
  constructor(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    this.isMatrix4 = true;
    Matrix4.prototype.isMatrix4 = true;
    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    if (n11 !== void 0) {
      this.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
    }
  }
  extractPosition(m) {
    console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().");
    return this.copyPosition(m);
  }
  multiplyToArray(a, b, r) {
    console.error("THREE.Matrix4: .multiplyToArray() has been removed.");
    return this;
  }
  setRotationFromQuaternion(q) {
    return this.makeRotationFromQuaternion(q);
  }
  set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    const te = this.elements;
    te[0] = n11;
    te[4] = n12;
    te[8] = n13;
    te[12] = n14;
    te[1] = n21;
    te[5] = n22;
    te[9] = n23;
    te[13] = n24;
    te[2] = n31;
    te[6] = n32;
    te[10] = n33;
    te[14] = n34;
    te[3] = n41;
    te[7] = n42;
    te[11] = n43;
    te[15] = n44;
    return this;
  }
  identity() {
    this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    return this;
  }
  clone() {
    return new Matrix4().fromArray(this.elements);
  }
  copy(m) {
    const te = this.elements;
    const me = m.elements;
    te[0] = me[0];
    te[1] = me[1];
    te[2] = me[2];
    te[3] = me[3];
    te[4] = me[4];
    te[5] = me[5];
    te[6] = me[6];
    te[7] = me[7];
    te[8] = me[8];
    te[9] = me[9];
    te[10] = me[10];
    te[11] = me[11];
    te[12] = me[12];
    te[13] = me[13];
    te[14] = me[14];
    te[15] = me[15];
    return this;
  }
  copyPosition(m) {
    const te = this.elements, me = m.elements;
    te[12] = me[12];
    te[13] = me[13];
    te[14] = me[14];
    return this;
  }
  setFromMatrix3(m) {
    const me = m.elements;
    this.set(me[0], me[3], me[6], 0, me[1], me[4], me[7], 0, me[2], me[5], me[8], 0, 0, 0, 0, 1);
    return this;
  }
  extractBasis(xAxis, yAxis, zAxis) {
    xAxis.setFromMatrixColumn(this, 0);
    yAxis.setFromMatrixColumn(this, 1);
    zAxis.setFromMatrixColumn(this, 2);
    return this;
  }
  makeBasis(xAxis, yAxis, zAxis) {
    this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);
    return this;
  }
  extractRotation(m) {
    const te = this.elements;
    const me = m.elements;
    const scaleX = 1 / _v1.setFromMatrixColumn(m, 0).length();
    const scaleY = 1 / _v1.setFromMatrixColumn(m, 1).length();
    const scaleZ = 1 / _v1.setFromMatrixColumn(m, 2).length();
    te[0] = me[0] * scaleX;
    te[1] = me[1] * scaleX;
    te[2] = me[2] * scaleX;
    te[3] = 0;
    te[4] = me[4] * scaleY;
    te[5] = me[5] * scaleY;
    te[6] = me[6] * scaleY;
    te[7] = 0;
    te[8] = me[8] * scaleZ;
    te[9] = me[9] * scaleZ;
    te[10] = me[10] * scaleZ;
    te[11] = 0;
    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;
    return this;
  }
  makeRotationFromEuler(euler) {
    const te = this.elements;
    const x = euler.x, y = euler.y, z = euler.z;
    const a = Math.cos(x), b = Math.sin(x);
    const c = Math.cos(y), d = Math.sin(y);
    const e = Math.cos(z), f = Math.sin(z);
    if (euler.order === "XYZ") {
      const ae = a * e, af = a * f, be = b * e, bf = b * f;
      te[0] = c * e;
      te[4] = -c * f;
      te[8] = d;
      te[1] = af + be * d;
      te[5] = ae - bf * d;
      te[9] = -b * c;
      te[2] = bf - ae * d;
      te[6] = be + af * d;
      te[10] = a * c;
    } else if (euler.order === "YXZ") {
      const ce = c * e, cf = c * f, de = d * e, df = d * f;
      te[0] = ce + df * b;
      te[4] = de * b - cf;
      te[8] = a * d;
      te[1] = a * f;
      te[5] = a * e;
      te[9] = -b;
      te[2] = cf * b - de;
      te[6] = df + ce * b;
      te[10] = a * c;
    } else if (euler.order === "ZXY") {
      const ce = c * e, cf = c * f, de = d * e, df = d * f;
      te[0] = ce - df * b;
      te[4] = -a * f;
      te[8] = de + cf * b;
      te[1] = cf + de * b;
      te[5] = a * e;
      te[9] = df - ce * b;
      te[2] = -a * d;
      te[6] = b;
      te[10] = a * c;
    } else if (euler.order === "ZYX") {
      const ae = a * e, af = a * f, be = b * e, bf = b * f;
      te[0] = c * e;
      te[4] = be * d - af;
      te[8] = ae * d + bf;
      te[1] = c * f;
      te[5] = bf * d + ae;
      te[9] = af * d - be;
      te[2] = -d;
      te[6] = b * c;
      te[10] = a * c;
    } else if (euler.order === "YZX") {
      const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
      te[0] = c * e;
      te[4] = bd - ac * f;
      te[8] = bc * f + ad;
      te[1] = f;
      te[5] = a * e;
      te[9] = -b * e;
      te[2] = -d * e;
      te[6] = ad * f + bc;
      te[10] = ac - bd * f;
    } else if (euler.order === "XZY") {
      const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
      te[0] = c * e;
      te[4] = -f;
      te[8] = d * e;
      te[1] = ac * f + bd;
      te[5] = a * e;
      te[9] = ad * f - bc;
      te[2] = bc * f - ad;
      te[6] = b * e;
      te[10] = bd * f + ac;
    }
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;
    return this;
  }
  makeRotationFromQuaternion(q) {
    return this.compose(_zero, q, _one);
  }
  lookAt(eye, target, up) {
    const te = this.elements;
    _z.subVectors(eye, target);
    if (_z.lengthSq() === 0) {
      _z.z = 1;
    }
    _z.normalize();
    _x.crossVectors(up, _z);
    if (_x.lengthSq() === 0) {
      if (Math.abs(up.z) === 1) {
        _z.x += 1e-4;
      } else {
        _z.z += 1e-4;
      }
      _z.normalize();
      _x.crossVectors(up, _z);
    }
    _x.normalize();
    _y.crossVectors(_z, _x);
    te[0] = _x.x;
    te[4] = _y.x;
    te[8] = _z.x;
    te[1] = _x.y;
    te[5] = _y.y;
    te[9] = _z.y;
    te[2] = _x.z;
    te[6] = _y.z;
    te[10] = _z.z;
    return this;
  }
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  premultiply(m) {
    return this.multiplyMatrices(m, this);
  }
  multiplyMatrices(a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;
    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
  }
  multiplyScalar(s) {
    const te = this.elements;
    te[0] *= s;
    te[4] *= s;
    te[8] *= s;
    te[12] *= s;
    te[1] *= s;
    te[5] *= s;
    te[9] *= s;
    te[13] *= s;
    te[2] *= s;
    te[6] *= s;
    te[10] *= s;
    te[14] *= s;
    te[3] *= s;
    te[7] *= s;
    te[11] *= s;
    te[15] *= s;
    return this;
  }
  determinant() {
    const te = this.elements;
    const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
    const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
    const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
    const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
    return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
  }
  transpose() {
    const te = this.elements;
    let tmp;
    tmp = te[1];
    te[1] = te[4];
    te[4] = tmp;
    tmp = te[2];
    te[2] = te[8];
    te[8] = tmp;
    tmp = te[6];
    te[6] = te[9];
    te[9] = tmp;
    tmp = te[3];
    te[3] = te[12];
    te[12] = tmp;
    tmp = te[7];
    te[7] = te[13];
    te[13] = tmp;
    tmp = te[11];
    te[11] = te[14];
    te[14] = tmp;
    return this;
  }
  setPosition(x, y, z) {
    const te = this.elements;
    if (x.isVector3) {
      te[12] = x.x;
      te[13] = x.y;
      te[14] = x.z;
    } else {
      te[12] = x;
      te[13] = y;
      te[14] = z;
    }
    return this;
  }
  invert() {
    const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3], n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7], n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11], n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15], t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44, t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44, t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44, t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if (det === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const detInv = 1 / det;
    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
    return this;
  }
  scale(v) {
    const te = this.elements;
    const x = v.x, y = v.y, z = v.z;
    te[0] *= x;
    te[4] *= y;
    te[8] *= z;
    te[1] *= x;
    te[5] *= y;
    te[9] *= z;
    te[2] *= x;
    te[6] *= y;
    te[10] *= z;
    te[3] *= x;
    te[7] *= y;
    te[11] *= z;
    return this;
  }
  getMaxScaleOnAxis() {
    const te = this.elements;
    const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
    const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
    const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  }
  makeTranslation(x, y, z) {
    if (x.isVector3) {
      this.set(1, 0, 0, x.x, 0, 1, 0, x.y, 0, 0, 1, x.z, 0, 0, 0, 1);
    } else {
      this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    }
    return this;
  }
  makeRotationX(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
    return this;
  }
  makeRotationY(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
    return this;
  }
  makeRotationZ(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    return this;
  }
  makeRotationAxis(axis, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const x = axis.x, y = axis.y, z = axis.z;
    const tx = t * x, ty = t * y;
    this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
    return this;
  }
  makeScale(x, y, z) {
    this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    return this;
  }
  makeShear(xy, xz, yx, yz, zx, zy) {
    this.set(1, yx, zx, 0, xy, 1, zy, 0, xz, yz, 1, 0, 0, 0, 0, 1);
    return this;
  }
  compose(position, quaternion, scale) {
    const te = this.elements;
    const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;
    const sx = scale.x, sy = scale.y, sz = scale.z;
    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;
    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;
    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;
    te[12] = position.x;
    te[13] = position.y;
    te[14] = position.z;
    te[15] = 1;
    return this;
  }
  decompose(position, quaternion, scale) {
    const te = this.elements;
    let sx = _v1.set(te[0], te[1], te[2]).length();
    const sy = _v1.set(te[4], te[5], te[6]).length();
    const sz = _v1.set(te[8], te[9], te[10]).length();
    const det = this.determinant();
    if (det < 0)
      sx = -sx;
    position.x = te[12];
    position.y = te[13];
    position.z = te[14];
    _m1.copy(this);
    const invSX = 1 / sx;
    const invSY = 1 / sy;
    const invSZ = 1 / sz;
    _m1.elements[0] *= invSX;
    _m1.elements[1] *= invSX;
    _m1.elements[2] *= invSX;
    _m1.elements[4] *= invSY;
    _m1.elements[5] *= invSY;
    _m1.elements[6] *= invSY;
    _m1.elements[8] *= invSZ;
    _m1.elements[9] *= invSZ;
    _m1.elements[10] *= invSZ;
    quaternion.setFromRotationMatrix(_m1);
    scale.x = sx;
    scale.y = sy;
    scale.z = sz;
    return this;
  }
  makePerspective(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
    const te = this.elements;
    const x = 2 * near / (right - left);
    const y = 2 * near / (top - bottom);
    const a = (right + left) / (right - left);
    const b = (top + bottom) / (top - bottom);
    let c, d;
    if (coordinateSystem === WebGLCoordinateSystem) {
      c = -(far + near) / (far - near);
      d = -2 * far * near / (far - near);
    } else if (coordinateSystem === WebGPUCoordinateSystem) {
      c = -far / (far - near);
      d = -far * near / (far - near);
    } else {
      throw new Error("Matrix4.makePerspective(): Invalid coordinate system: " + coordinateSystem);
    }
    te[0] = x;
    te[4] = 0;
    te[8] = a;
    te[12] = 0;
    te[1] = 0;
    te[5] = y;
    te[9] = b;
    te[13] = 0;
    te[2] = 0;
    te[6] = 0;
    te[10] = c;
    te[14] = d;
    te[3] = 0;
    te[7] = 0;
    te[11] = -1;
    te[15] = 0;
    return this;
  }
  makeOrthographic(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
    const te = this.elements;
    const w = 1 / (right - left);
    const h = 1 / (top - bottom);
    const p = 1 / (far - near);
    const x = (right + left) * w;
    const y = (top + bottom) * h;
    let z, zInv;
    if (coordinateSystem === WebGLCoordinateSystem) {
      z = (far + near) * p;
      zInv = -2 * p;
    } else if (coordinateSystem === WebGPUCoordinateSystem) {
      z = near * p;
      zInv = -1 * p;
    } else {
      throw new Error("../math.Matrix4.makeOrthographic(): Invalid coordinate system: " + coordinateSystem);
    }
    te[0] = 2 * w;
    te[4] = 0;
    te[8] = 0;
    te[12] = -x;
    te[1] = 0;
    te[5] = 2 * h;
    te[9] = 0;
    te[13] = -y;
    te[2] = 0;
    te[6] = 0;
    te[10] = zInv;
    te[14] = -z;
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[15] = 1;
    return this;
  }
  equals(matrix) {
    const te = this.elements;
    const me = matrix.elements;
    for (let i = 0; i < 16; i++) {
      if (te[i] !== me[i])
        return false;
    }
    return true;
  }
  fromArray(array, offset = 0) {
    for (let i = 0; i < 16; i++) {
      this.elements[i] = array[i + offset];
    }
    return this;
  }
  toArray(array = [], offset = 0) {
    const te = this.elements;
    array[offset] = te[0];
    array[offset + 1] = te[1];
    array[offset + 2] = te[2];
    array[offset + 3] = te[3];
    array[offset + 4] = te[4];
    array[offset + 5] = te[5];
    array[offset + 6] = te[6];
    array[offset + 7] = te[7];
    array[offset + 8] = te[8];
    array[offset + 9] = te[9];
    array[offset + 10] = te[10];
    array[offset + 11] = te[11];
    array[offset + 12] = te[12];
    array[offset + 13] = te[13];
    array[offset + 14] = te[14];
    array[offset + 15] = te[15];
    return array;
  }
}
const _v1 = new Vector3();
const _m1 = new Matrix4();
const _zero = new Vector3(0, 0, 0);
const _one = new Vector3(1, 1, 1);
const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();
const _matrix = new Matrix4();
const _quaternion = new Quaternion();
class Euler {
  constructor(x = 0, y = 0, z = 0, order = Euler.DEFAULT_ORDER) {
    this.isEuler = true;
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
    this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(value) {
    this._order = value;
    this._onChangeCallback();
  }
  set(x, y, z, order = this._order) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
    this._onChangeCallback();
    return this;
  }
  clone() {
    return new Euler(this._x, this._y, this._z, this._order);
  }
  copy(euler) {
    this._x = euler._x;
    this._y = euler._y;
    this._z = euler._z;
    this._order = euler._order;
    this._onChangeCallback();
    return this;
  }
  setFromRotationMatrix(m, order = this._order, update = true) {
    const te = m.elements;
    const m11 = te[0], m12 = te[4], m13 = te[8];
    const m21 = te[1], m22 = te[5], m23 = te[9];
    const m31 = te[2], m32 = te[6], m33 = te[10];
    switch (order) {
      case "XYZ":
        this._y = Math.asin(clamp(m13, -1, 1));
        if (Math.abs(m13) < 0.9999999) {
          this._x = Math.atan2(-m23, m33);
          this._z = Math.atan2(-m12, m11);
        } else {
          this._x = Math.atan2(m32, m22);
          this._z = 0;
        }
        break;
      case "YXZ":
        this._x = Math.asin(-clamp(m23, -1, 1));
        if (Math.abs(m23) < 0.9999999) {
          this._y = Math.atan2(m13, m33);
          this._z = Math.atan2(m21, m22);
        } else {
          this._y = Math.atan2(-m31, m11);
          this._z = 0;
        }
        break;
      case "ZXY":
        this._x = Math.asin(clamp(m32, -1, 1));
        if (Math.abs(m32) < 0.9999999) {
          this._y = Math.atan2(-m31, m33);
          this._z = Math.atan2(-m12, m22);
        } else {
          this._y = 0;
          this._z = Math.atan2(m21, m11);
        }
        break;
      case "ZYX":
        this._y = Math.asin(-clamp(m31, -1, 1));
        if (Math.abs(m31) < 0.9999999) {
          this._x = Math.atan2(m32, m33);
          this._z = Math.atan2(m21, m11);
        } else {
          this._x = 0;
          this._z = Math.atan2(-m12, m22);
        }
        break;
      case "YZX":
        this._z = Math.asin(clamp(m21, -1, 1));
        if (Math.abs(m21) < 0.9999999) {
          this._x = Math.atan2(-m23, m22);
          this._y = Math.atan2(-m31, m11);
        } else {
          this._x = 0;
          this._y = Math.atan2(m13, m33);
        }
        break;
      case "XZY":
        this._z = Math.asin(-clamp(m12, -1, 1));
        if (Math.abs(m12) < 0.9999999) {
          this._x = Math.atan2(m32, m22);
          this._y = Math.atan2(m13, m11);
        } else {
          this._x = Math.atan2(-m23, m33);
          this._y = 0;
        }
        break;
      default:
        console.warn("../math.Euler: .setFromRotationMatrix() encountered an unknown order: " + order);
    }
    this._order = order;
    if (update === true)
      this._onChangeCallback();
    return this;
  }
  setFromQuaternion(q, order, update) {
    _matrix.makeRotationFromQuaternion(q);
    return this.setFromRotationMatrix(_matrix, order, update);
  }
  setFromVector3(v, order = this._order) {
    return this.set(v.x, v.y, v.z, order);
  }
  reorder(newOrder) {
    _quaternion.setFromEuler(this);
    return this.setFromQuaternion(_quaternion, newOrder);
  }
  equals(euler) {
    return euler._x === this._x && euler._y === this._y && euler._z === this._z && euler._order === this._order;
  }
  fromArray(array) {
    this._x = array[0];
    this._y = array[1];
    this._z = array[2];
    if (array[3] !== void 0)
      this._order = array[3];
    this._onChangeCallback();
    return this;
  }
  toArray(array = [], offset = 0) {
    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._order;
    return array;
  }
  _onChange(callback) {
    this._onChangeCallback = callback;
    return this;
  }
  _onChangeCallback(euler) {
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._order;
  }
}
Euler.DEFAULT_ORDER = "XYZ";
class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get width() {
    return this.x;
  }
  set width(value) {
    this.x = value;
  }
  get height() {
    return this.y;
  }
  set height(value) {
    this.y = value;
  }
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  setScalar(scalar) {
    this.x = scalar;
    this.y = scalar;
    return this;
  }
  setX(x) {
    this.x = x;
    return this;
  }
  setY(y) {
    this.y = y;
    return this;
  }
  setComponent(index, value) {
    switch (index) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      default:
        throw new Error("index is out of range: " + index);
    }
    return this;
  }
  getComponent(index) {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + index);
    }
  }
  clone() {
    return new Vector2(this.x, this.y);
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  addScalar(s) {
    this.x += s;
    this.y += s;
    return this;
  }
  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  }
  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  subScalar(s) {
    this.x -= s;
    this.y -= s;
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }
  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
  divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }
  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  }
  applyMatrix3(m) {
    const x = this.x, y = this.y;
    const e = m.elements;
    this.x = e[0] * x + e[3] * y + e[6];
    this.y = e[1] * x + e[4] * y + e[7];
    return this;
  }
  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    return this;
  }
  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    return this;
  }
  clamp(min, max) {
    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    return this;
  }
  clampScalar(minVal, maxVal) {
    this.x = Math.max(minVal, Math.min(maxVal, this.x));
    this.y = Math.max(minVal, Math.min(maxVal, this.y));
    return this;
  }
  clampLength(min, max) {
    const length = this.length();
    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
  }
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  roundToZero() {
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);
    return this;
  }
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    const angle = Math.atan2(-this.y, -this.x) + Math.PI;
    return angle;
  }
  angleTo(v) {
    const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (denominator === 0)
      return Math.PI / 2;
    const theta = this.dot(v) / denominator;
    return Math.acos(clamp(theta, -1, 1));
  }
  distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v));
  }
  distanceToSquared(v) {
    const dx = this.x - v.x, dy = this.y - v.y;
    return dx * dx + dy * dy;
  }
  manhattanDistanceTo(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  }
  setLength(length) {
    return this.normalize().multiplyScalar(length);
  }
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    return this;
  }
  lerpVectors(v1, v2, alpha) {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    return this;
  }
  equals(v) {
    return v.x === this.x && v.y === this.y;
  }
  fromArray(array, offset = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];
    return this;
  }
  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    return array;
  }
  rotateAround(center, angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    const x = this.x - center.x;
    const y = this.y - center.y;
    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;
    return this;
  }
  random() {
    this.x = Math.random();
    this.y = Math.random();
    return this;
  }
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }
}
Vector2.isVector2 = true;
class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    Vector4.prototype.isVector4 = true;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  get width() {
    return this.z;
  }
  set width(value) {
    this.z = value;
  }
  get height() {
    return this.w;
  }
  set height(value) {
    this.w = value;
  }
  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  setScalar(scalar) {
    this.x = scalar;
    this.y = scalar;
    this.z = scalar;
    this.w = scalar;
    return this;
  }
  setX(x) {
    this.x = x;
    return this;
  }
  setY(y) {
    this.y = y;
    return this;
  }
  setZ(z) {
    this.z = z;
    return this;
  }
  setW(w) {
    this.w = w;
    return this;
  }
  setComponent(index, value) {
    switch (index) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      case 2:
        this.z = value;
        break;
      case 3:
        this.w = value;
        break;
      default:
        throw new Error("index is out of range: " + index);
    }
    return this;
  }
  getComponent(index) {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + index);
    }
  }
  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }
  addScalar(scalar) {
    this.x += scalar;
    this.y += scalar;
    this.z += scalar;
    this.w += scalar;
    return this;
  }
  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    this.w = a.w + b.w;
    return this;
  }
  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    this.w += v.w * s;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  }
  subScalar(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    this.z -= scalar;
    this.w -= scalar;
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    this.w = a.w - b.w;
    return this;
  }
  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    this.w *= v.w;
    return this;
  }
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }
  applyMatrix4(m) {
    const x = this.x, y = this.y, z = this.z, w = this.w;
    const e = m.elements;
    this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
    this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
    this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
    return this;
  }
  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  }
  setAxisAngleFromQuaternion(q) {
    this.w = 2 * Math.acos(q.w);
    const s = Math.sqrt(1 - q.w * q.w);
    if (s < 1e-4) {
      this.x = 1;
      this.y = 0;
      this.z = 0;
    } else {
      this.x = q.x / s;
      this.y = q.y / s;
      this.z = q.z / s;
    }
    return this;
  }
  setAxisAngleFromRotationMatrix(m) {
    let angle, x, y, z;
    const epsilon = 0.01, epsilon2 = 0.1, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10];
    if (Math.abs(m12 - m21) < epsilon && Math.abs(m13 - m31) < epsilon && Math.abs(m23 - m32) < epsilon) {
      if (Math.abs(m12 + m21) < epsilon2 && Math.abs(m13 + m31) < epsilon2 && Math.abs(m23 + m32) < epsilon2 && Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
        this.set(1, 0, 0, 0);
        return this;
      }
      angle = Math.PI;
      const xx = (m11 + 1) / 2;
      const yy = (m22 + 1) / 2;
      const zz = (m33 + 1) / 2;
      const xy = (m12 + m21) / 4;
      const xz = (m13 + m31) / 4;
      const yz = (m23 + m32) / 4;
      if (xx > yy && xx > zz) {
        if (xx < epsilon) {
          x = 0;
          y = 0.707106781;
          z = 0.707106781;
        } else {
          x = Math.sqrt(xx);
          y = xy / x;
          z = xz / x;
        }
      } else if (yy > zz) {
        if (yy < epsilon) {
          x = 0.707106781;
          y = 0;
          z = 0.707106781;
        } else {
          y = Math.sqrt(yy);
          x = xy / y;
          z = yz / y;
        }
      } else {
        if (zz < epsilon) {
          x = 0.707106781;
          y = 0.707106781;
          z = 0;
        } else {
          z = Math.sqrt(zz);
          x = xz / z;
          y = yz / z;
        }
      }
      this.set(x, y, z, angle);
      return this;
    }
    let s = Math.sqrt((m32 - m23) * (m32 - m23) + (m13 - m31) * (m13 - m31) + (m21 - m12) * (m21 - m12));
    if (Math.abs(s) < 1e-3)
      s = 1;
    this.x = (m32 - m23) / s;
    this.y = (m13 - m31) / s;
    this.z = (m21 - m12) / s;
    this.w = Math.acos((m11 + m22 + m33 - 1) / 2);
    return this;
  }
  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);
    this.w = Math.min(this.w, v.w);
    return this;
  }
  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);
    this.w = Math.max(this.w, v.w);
    return this;
  }
  clamp(min, max) {
    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    this.z = Math.max(min.z, Math.min(max.z, this.z));
    this.w = Math.max(min.w, Math.min(max.w, this.w));
    return this;
  }
  clampScalar(minVal, maxVal) {
    this.x = Math.max(minVal, Math.min(maxVal, this.x));
    this.y = Math.max(minVal, Math.min(maxVal, this.y));
    this.z = Math.max(minVal, Math.min(maxVal, this.z));
    this.w = Math.max(minVal, Math.min(maxVal, this.w));
    return this;
  }
  clampLength(min, max) {
    const length = this.length();
    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
  }
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    this.w = Math.floor(this.w);
    return this;
  }
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    this.w = Math.ceil(this.w);
    return this;
  }
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);
    return this;
  }
  roundToZero() {
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);
    this.z = Math.trunc(this.z);
    this.w = Math.trunc(this.w);
    return this;
  }
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(length) {
    return this.normalize().multiplyScalar(length);
  }
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    this.w += (v.w - this.w) * alpha;
    return this;
  }
  lerpVectors(v1, v2, alpha) {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    this.w = v1.w + (v2.w - v1.w) * alpha;
    return this;
  }
  equals(v) {
    return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
  }
  fromArray(array, offset = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.w = array[offset + 3];
    return this;
  }
  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.w;
    return array;
  }
  random() {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    this.w = Math.random();
    return this;
  }
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
    yield this.w;
  }
}
class Matrix3 {
  constructor(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
    Matrix3.prototype.isMatrix3 = true;
    this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    if (n11 !== void 0) {
      this.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
    }
  }
  set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
    const te = this.elements;
    te[0] = n11;
    te[1] = n21;
    te[2] = n31;
    te[3] = n12;
    te[4] = n22;
    te[5] = n32;
    te[6] = n13;
    te[7] = n23;
    te[8] = n33;
    return this;
  }
  identity() {
    this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    return this;
  }
  copy(m) {
    const te = this.elements;
    const me = m.elements;
    te[0] = me[0];
    te[1] = me[1];
    te[2] = me[2];
    te[3] = me[3];
    te[4] = me[4];
    te[5] = me[5];
    te[6] = me[6];
    te[7] = me[7];
    te[8] = me[8];
    return this;
  }
  extractBasis(xAxis, yAxis, zAxis) {
    xAxis.setFromMatrix3Column(this, 0);
    yAxis.setFromMatrix3Column(this, 1);
    zAxis.setFromMatrix3Column(this, 2);
    return this;
  }
  setFromMatrix4(m) {
    const me = m.elements;
    this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]);
    return this;
  }
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  premultiply(m) {
    return this.multiplyMatrices(m, this);
  }
  multiplyMatrices(a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;
    const a11 = ae[0], a12 = ae[3], a13 = ae[6];
    const a21 = ae[1], a22 = ae[4], a23 = ae[7];
    const a31 = ae[2], a32 = ae[5], a33 = ae[8];
    const b11 = be[0], b12 = be[3], b13 = be[6];
    const b21 = be[1], b22 = be[4], b23 = be[7];
    const b31 = be[2], b32 = be[5], b33 = be[8];
    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;
    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;
    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;
    return this;
  }
  multiplyScalar(s) {
    const te = this.elements;
    te[0] *= s;
    te[3] *= s;
    te[6] *= s;
    te[1] *= s;
    te[4] *= s;
    te[7] *= s;
    te[2] *= s;
    te[5] *= s;
    te[8] *= s;
    return this;
  }
  determinant() {
    const te = this.elements;
    const a = te[0], b = te[1], c = te[2], d = te[3], e = te[4], f = te[5], g = te[6], h = te[7], i = te[8];
    return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
  }
  invert() {
    const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n12 = te[3], n22 = te[4], n32 = te[5], n13 = te[6], n23 = te[7], n33 = te[8], t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
    if (det === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const detInv = 1 / det;
    te[0] = t11 * detInv;
    te[1] = (n31 * n23 - n33 * n21) * detInv;
    te[2] = (n32 * n21 - n31 * n22) * detInv;
    te[3] = t12 * detInv;
    te[4] = (n33 * n11 - n31 * n13) * detInv;
    te[5] = (n31 * n12 - n32 * n11) * detInv;
    te[6] = t13 * detInv;
    te[7] = (n21 * n13 - n23 * n11) * detInv;
    te[8] = (n22 * n11 - n21 * n12) * detInv;
    return this;
  }
  transpose() {
    let tmp;
    const m = this.elements;
    tmp = m[1];
    m[1] = m[3];
    m[3] = tmp;
    tmp = m[2];
    m[2] = m[6];
    m[6] = tmp;
    tmp = m[5];
    m[5] = m[7];
    m[7] = tmp;
    return this;
  }
  getNormalMatrix(matrix4) {
    return this.setFromMatrix4(matrix4).invert().transpose();
  }
  transposeIntoArray(r) {
    const m = this.elements;
    r[0] = m[0];
    r[1] = m[3];
    r[2] = m[6];
    r[3] = m[1];
    r[4] = m[4];
    r[5] = m[7];
    r[6] = m[2];
    r[7] = m[5];
    r[8] = m[8];
    return this;
  }
  setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
    const c = Math.cos(rotation);
    const s = Math.sin(rotation);
    this.set(sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx, -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty, 0, 0, 1);
    return this;
  }
  scale(sx, sy) {
    this.premultiply(_m3.makeScale(sx, sy));
    return this;
  }
  rotate(theta) {
    this.premultiply(_m3.makeRotation(-theta));
    return this;
  }
  translate(tx, ty) {
    this.premultiply(_m3.makeTranslation(tx, ty));
    return this;
  }
  makeTranslation(x, y) {
    if (x.isVector2) {
      this.set(1, 0, x.x, 0, 1, x.y, 0, 0, 1);
    } else {
      this.set(1, 0, x, 0, 1, y, 0, 0, 1);
    }
    return this;
  }
  makeRotation(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    this.set(c, -s, 0, s, c, 0, 0, 0, 1);
    return this;
  }
  makeScale(x, y) {
    this.set(x, 0, 0, 0, y, 0, 0, 0, 1);
    return this;
  }
  equals(matrix) {
    const te = this.elements;
    const me = matrix.elements;
    for (let i = 0; i < 9; i++) {
      if (te[i] !== me[i])
        return false;
    }
    return true;
  }
  fromArray(array, offset = 0) {
    for (let i = 0; i < 9; i++) {
      this.elements[i] = array[i + offset];
    }
    return this;
  }
  toArray(array = [], offset = 0) {
    const te = this.elements;
    array[offset] = te[0];
    array[offset + 1] = te[1];
    array[offset + 2] = te[2];
    array[offset + 3] = te[3];
    array[offset + 4] = te[4];
    array[offset + 5] = te[5];
    array[offset + 6] = te[6];
    array[offset + 7] = te[7];
    array[offset + 8] = te[8];
    return array;
  }
  clone() {
    return new Matrix3().fromArray(this.elements);
  }
}
const _m3 = new Matrix3();
var EmitterMode;
(function(EmitterMode2) {
  EmitterMode2[EmitterMode2["Random"] = 0] = "Random";
  EmitterMode2[EmitterMode2["Loop"] = 1] = "Loop";
  EmitterMode2[EmitterMode2["PingPong"] = 2] = "PingPong";
  EmitterMode2[EmitterMode2["Burst"] = 3] = "Burst";
})(EmitterMode || (EmitterMode = {}));
function getValueFromEmitterMode(mode, currentValue, spread, emissionState) {
  let u;
  if (EmitterMode.Random === mode) {
    currentValue = Math.random();
  } else if (EmitterMode.Burst === mode && emissionState.isBursting) {
    currentValue = emissionState.burstParticleIndex / emissionState.burstParticleCount;
  }
  if (spread > 0) {
    u = Math.floor(currentValue / spread) * spread;
  } else {
    u = currentValue;
  }
  switch (mode) {
    case EmitterMode.Loop:
      u = u % 1;
      break;
    case EmitterMode.PingPong:
      u = Math.abs(u % 2 - 1);
      break;
  }
  return u;
}
class Bezier {
  constructor(p1, p2, p3, p4) {
    this.p = [p1, p2, p3, p4];
  }
  genValue(t) {
    const t2 = t * t;
    const t3 = t * t * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    return this.p[0] * mt3 + this.p[1] * mt2 * t * 3 + this.p[2] * mt * t2 * 3 + this.p[3] * t3;
  }
  derivativeCoefficients(points) {
    const dpoints = [];
    for (let p = points, c = p.length - 1; c > 0; c--) {
      const list = [];
      for (let j = 0; j < c; j++) {
        const dpt = c * (p[j + 1] - p[j]);
        list.push(dpt);
      }
      dpoints.push(list);
      p = list;
    }
    return dpoints;
  }
  getSlope(t) {
    const p = this.derivativeCoefficients(this.p)[0];
    const mt = 1 - t;
    const a = mt * mt;
    const b = mt * t * 2;
    const c = t * t;
    return a * p[0] + b * p[1] + c * p[2];
  }
  controlCurve(d0, d1) {
    this.p[1] = d0 / 3 + this.p[0];
    this.p[2] = this.p[3] - d1 / 3;
  }
  hull(t) {
    let p = this.p;
    let _p = [], pt, idx = 0, i = 0, l = 0;
    const q = [];
    q[idx++] = p[0];
    q[idx++] = p[1];
    q[idx++] = p[2];
    q[idx++] = p[3];
    while (p.length > 1) {
      _p = [];
      for (i = 0, l = p.length - 1; i < l; i++) {
        pt = t * p[i] + (1 - t) * p[i + 1];
        q[idx++] = pt;
        _p.push(pt);
      }
      p = _p;
    }
    return q;
  }
  split(t) {
    const q = this.hull(t);
    const result = {
      left: new Bezier(q[0], q[4], q[7], q[9]),
      right: new Bezier(q[9], q[8], q[6], q[3]),
      span: q
    };
    return result;
  }
  clone() {
    return new Bezier(this.p[0], this.p[1], this.p[2], this.p[3]);
  }
  toJSON() {
    return {
      p0: this.p[0],
      p1: this.p[1],
      p2: this.p[2],
      p3: this.p[3]
    };
  }
  static fromJSON(json) {
    return new Bezier(json.p0, json.p1, json.p2, json.p3);
  }
}
const ColorToJSON = (color) => {
  return { r: color.x, g: color.y, b: color.z, a: color.w };
};
const JSONToColor = (json) => {
  return new Vector4(json.r, json.g, json.b, json.a);
};
const JSONToValue = (json, type) => {
  switch (type) {
    case "Vector3":
      return new Vector3(json.x, json.y, json.z);
    case "Vector4":
      return new Vector4(json.x, json.y, json.z, json.w);
    case "Color":
      return new Vector3(json.r, json.g, json.b);
    case "Number":
      return json;
    default:
      return json;
  }
};
const ValueToJSON = (value, type) => {
  switch (type) {
    case "Vector3":
      return { x: value.x, y: value.y, z: value.z };
    case "Vector4":
      return { x: value.x, y: value.y, z: value.z, w: value.w };
    case "Color":
      return { r: value.x, g: value.y, b: value.z };
    case "Number":
      return value;
    default:
      return value;
  }
};
class RandomColor {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.type = "value";
  }
  startGen(memory) {
  }
  genColor(memory, color) {
    const rand = Math.random();
    return color.copy(this.a).lerp(this.b, rand);
  }
  toJSON() {
    return {
      type: "RandomColor",
      a: ColorToJSON(this.a),
      b: ColorToJSON(this.b)
    };
  }
  static fromJSON(json) {
    return new RandomColor(JSONToColor(json.a), JSONToColor(json.b));
  }
  clone() {
    return new RandomColor(this.a.clone(), this.b.clone());
  }
}
class ColorRange {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.indexCount = -1;
    this.type = "value";
  }
  startGen(memory) {
    this.indexCount = memory.length;
    memory.push(Math.random());
  }
  genColor(memory, color) {
    if (this.indexCount === -1) {
      this.startGen(memory);
    }
    return color.copy(this.a).lerp(this.b, memory[this.indexCount]);
  }
  toJSON() {
    return {
      type: "ColorRange",
      a: ColorToJSON(this.a),
      b: ColorToJSON(this.b)
    };
  }
  static fromJSON(json) {
    return new ColorRange(JSONToColor(json.a), JSONToColor(json.b));
  }
  clone() {
    return new ColorRange(this.a.clone(), this.b.clone());
  }
}
class ContinuousLinearFunction {
  constructor(keys, subType) {
    this.subType = subType;
    this.type = "function";
    this.keys = keys;
  }
  findKey(t) {
    let mid = 0;
    let left = 0, right = this.keys.length - 1;
    while (left + 1 < right) {
      mid = Math.floor((left + right) / 2);
      if (t < this.getStartX(mid))
        right = mid - 1;
      else if (t > this.getEndX(mid))
        left = mid + 1;
      else
        return mid;
    }
    for (let i = left; i <= right; i++) {
      if (t >= this.getStartX(i) && t <= this.getEndX(i))
        return i;
    }
    return -1;
  }
  getStartX(index) {
    return this.keys[index][1];
  }
  getEndX(index) {
    if (index + 1 < this.keys.length)
      return this.keys[index + 1][1];
    return 1;
  }
  genValue(value, t) {
    const index = this.findKey(t);
    if (this.subType === "Number") {
      if (index === -1) {
        return this.keys[0][0];
      } else if (index + 1 >= this.keys.length) {
        return this.keys[this.keys.length - 1][0];
      }
      return (this.keys[index + 1][0] - this.keys[index][0]) * ((t - this.getStartX(index)) / (this.getEndX(index) - this.getStartX(index))) + this.keys[index][0];
    } else {
      if (index === -1) {
        return value.copy(this.keys[0][0]);
      }
      if (index + 1 >= this.keys.length) {
        return value.copy(this.keys[this.keys.length - 1][0]);
      }
      return value.copy(this.keys[index][0]).lerp(this.keys[index + 1][0], (t - this.getStartX(index)) / (this.getEndX(index) - this.getStartX(index)));
    }
  }
  toJSON() {
    this.keys[0][0].constructor.name;
    return {
      type: "CLinearFunction",
      subType: this.subType,
      keys: this.keys.map(([color, pos]) => ({ value: ValueToJSON(color, this.subType), pos }))
    };
  }
  static fromJSON(json) {
    return new ContinuousLinearFunction(json.keys.map((pair) => [JSONToValue(pair.value, json.subType), pair.pos]), json.subType);
  }
  clone() {
    if (this.subType === "Number") {
      return new ContinuousLinearFunction(this.keys.map(([value, pos]) => [value, pos]), this.subType);
    } else {
      return new ContinuousLinearFunction(this.keys.map(([value, pos]) => [value.clone(), pos]), this.subType);
    }
  }
}
const tempVec3 = new Vector3();
class Gradient {
  constructor(color = [
    [new Vector3(0, 0, 0), 0],
    [new Vector3(1, 1, 1), 0]
  ], alpha = [
    [1, 0],
    [1, 1]
  ]) {
    this.type = "function";
    this.color = new ContinuousLinearFunction(color, "Color");
    this.alpha = new ContinuousLinearFunction(alpha, "Number");
  }
  genColor(memory, color, t) {
    this.color.genValue(tempVec3, t);
    return color.set(tempVec3.x, tempVec3.y, tempVec3.z, this.alpha.genValue(1, t));
  }
  toJSON() {
    return {
      type: "Gradient",
      color: this.color.toJSON(),
      alpha: this.alpha.toJSON()
    };
  }
  static fromJSON(json) {
    if (json.functions) {
      const keys = json.functions.map((func) => [ColorRange.fromJSON(func.function).a, func.start]);
      if (json.functions.length > 0) {
        keys.push([ColorRange.fromJSON(json.functions[json.functions.length - 1].function).b, 1]);
      }
      return new Gradient(keys.map((key) => [new Vector3(key[0].x, key[0].y, key[0].z), key[1]]), keys.map((key) => [key[0].w, key[1]]));
    } else {
      const gradient = new Gradient();
      gradient.alpha = ContinuousLinearFunction.fromJSON(json.alpha);
      gradient.color = ContinuousLinearFunction.fromJSON(json.color);
      return gradient;
    }
  }
  clone() {
    const gradient = new Gradient();
    gradient.alpha = this.alpha.clone();
    gradient.color = this.color.clone();
    return gradient;
  }
  startGen(memory) {
  }
}
const tempColor = new Vector4();
class RandomColorBetweenGradient {
  constructor(gradient1, gradient2) {
    this.indexCount = 0;
    this.type = "function";
    this.gradient1 = gradient1;
    this.gradient2 = gradient2;
  }
  startGen(memory) {
    this.indexCount = memory.length;
    memory.push(Math.random());
  }
  genColor(memory, color, t) {
    this.gradient1.genColor(memory, color, t);
    this.gradient2.genColor(memory, tempColor, t);
    if (memory && memory[this.indexCount] !== void 0) {
      color.lerp(tempColor, memory[this.indexCount]);
    } else {
      color.lerp(tempColor, Math.random());
    }
    return color;
  }
  toJSON() {
    return {
      type: "RandomColorBetweenGradient",
      gradient1: this.gradient1.toJSON(),
      gradient2: this.gradient2.toJSON()
    };
  }
  static fromJSON(json) {
    return new RandomColorBetweenGradient(Gradient.fromJSON(json.gradient1), Gradient.fromJSON(json.gradient2));
  }
  clone() {
    return new RandomColorBetweenGradient(this.gradient1.clone(), this.gradient2.clone());
  }
}
class ConstantColor {
  constructor(color) {
    this.color = color;
    this.type = "value";
  }
  startGen(memory) {
  }
  genColor(memoryGenerator, color) {
    return color.copy(this.color);
  }
  toJSON() {
    return {
      type: "ConstantColor",
      color: ColorToJSON(this.color)
    };
  }
  static fromJSON(json) {
    return new ConstantColor(JSONToColor(json.color));
  }
  clone() {
    return new ConstantColor(this.color.clone());
  }
}
function ColorGeneratorFromJSON(json) {
  switch (json.type) {
    case "ConstantColor":
      return ConstantColor.fromJSON(json);
    case "ColorRange":
      return ColorRange.fromJSON(json);
    case "RandomColor":
      return RandomColor.fromJSON(json);
    case "Gradient":
      return Gradient.fromJSON(json);
    case "RandomColorBetweenGradient":
      return RandomColorBetweenGradient.fromJSON(json);
    default:
      return new ConstantColor(new Vector4(1, 1, 1, 1));
  }
}
class ConstantValue {
  constructor(value) {
    this.value = value;
    this.type = "value";
  }
  startGen(memory) {
  }
  genValue(memory) {
    return this.value;
  }
  toJSON() {
    return {
      type: "ConstantValue",
      value: this.value
    };
  }
  static fromJSON(json) {
    return new ConstantValue(json.value);
  }
  clone() {
    return new ConstantValue(this.value);
  }
}
class IntervalValue {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.indexCount = -1;
    this.type = "value";
  }
  startGen(memory) {
    this.indexCount = memory.length;
    memory.push(Math.random());
  }
  genValue(memory) {
    if (this.indexCount === -1) {
      this.startGen(memory);
    }
    return MathUtils.lerp(this.a, this.b, memory[this.indexCount]);
  }
  toJSON() {
    return {
      type: "IntervalValue",
      a: this.a,
      b: this.b
    };
  }
  static fromJSON(json) {
    return new IntervalValue(json.a, json.b);
  }
  clone() {
    return new IntervalValue(this.a, this.b);
  }
}
class PiecewiseFunction {
  constructor() {
    this.functions = new Array();
  }
  findFunction(t) {
    let mid = 0;
    let left = 0, right = this.functions.length - 1;
    while (left + 1 < right) {
      mid = Math.floor((left + right) / 2);
      if (t < this.getStartX(mid))
        right = mid - 1;
      else if (t > this.getEndX(mid))
        left = mid + 1;
      else
        return mid;
    }
    for (let i = left; i <= right; i++) {
      if (t >= this.functions[i][1] && t <= this.getEndX(i))
        return i;
    }
    return -1;
  }
  getStartX(index) {
    return this.functions[index][1];
  }
  setStartX(index, x) {
    if (index > 0)
      this.functions[index][1] = x;
  }
  getEndX(index) {
    if (index + 1 < this.functions.length)
      return this.functions[index + 1][1];
    return 1;
  }
  setEndX(index, x) {
    if (index + 1 < this.functions.length)
      this.functions[index + 1][1] = x;
  }
  insertFunction(t, func) {
    const index = this.findFunction(t);
    this.functions.splice(index + 1, 0, [func, t]);
  }
  removeFunction(index) {
    return this.functions.splice(index, 1)[0][0];
  }
  getFunction(index) {
    return this.functions[index][0];
  }
  setFunction(index, func) {
    this.functions[index][0] = func;
  }
  get numOfFunctions() {
    return this.functions.length;
  }
}
class PiecewiseBezier extends PiecewiseFunction {
  constructor(curves = [[new Bezier(0, 1 / 3, 1 / 3 * 2, 1), 0]]) {
    super();
    this.type = "function";
    this.functions = curves;
  }
  genValue(memory, t = 0) {
    const index = this.findFunction(t);
    if (index === -1) {
      return 0;
    }
    return this.functions[index][0].genValue((t - this.getStartX(index)) / (this.getEndX(index) - this.getStartX(index)));
  }
  toSVG(length, segments) {
    if (segments < 1)
      return "";
    let result = ["M", 0, this.functions[0][0].p[0]].join(" ");
    for (let i = 1 / segments; i <= 1; i += 1 / segments) {
      result = [result, "L", i * length, this.genValue(void 0, i)].join(" ");
    }
    return result;
  }
  toJSON() {
    return {
      type: "PiecewiseBezier",
      functions: this.functions.map(([bezier, start]) => ({ function: bezier.toJSON(), start }))
    };
  }
  static fromJSON(json) {
    return new PiecewiseBezier(json.functions.map((piecewiseFunction) => [
      Bezier.fromJSON(piecewiseFunction.function),
      piecewiseFunction.start
    ]));
  }
  clone() {
    return new PiecewiseBezier(this.functions.map(([bezier, start]) => [bezier.clone(), start]));
  }
  startGen(memory) {
  }
}
function ValueGeneratorFromJSON(json) {
  switch (json.type) {
    case "ConstantValue":
      return ConstantValue.fromJSON(json);
    case "IntervalValue":
      return IntervalValue.fromJSON(json);
    case "PiecewiseBezier":
      return PiecewiseBezier.fromJSON(json);
    default:
      return new ConstantValue(0);
  }
}
class RandomQuatGenerator {
  constructor() {
    this.indexCount = 0;
    this.type = "rotation";
  }
  startGen(memory) {
    this.indexCount = memory.length;
    memory.push(new Quaternion());
    let x, y, z, u, v, w;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = x * x + y * y;
    } while (z > 1);
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      w = u * u + v * v;
    } while (w > 1);
    const s = Math.sqrt((1 - z) / w);
    memory[this.indexCount].set(x, y, s * u, s * v);
  }
  genValue(memory, quat, delta, t) {
    if (this.indexCount === -1) {
      this.startGen(memory);
    }
    quat.copy(memory[this.indexCount]);
    return quat;
  }
  toJSON() {
    return {
      type: "RandomQuat"
    };
  }
  static fromJSON(json) {
    return new RandomQuatGenerator();
  }
  clone() {
    return new RandomQuatGenerator();
  }
}
class AxisAngleGenerator {
  constructor(axis, angle) {
    this.axis = axis;
    this.angle = angle;
    this.type = "rotation";
  }
  startGen(memory) {
    this.angle.startGen(memory);
  }
  genValue(memory, quat, delta, t) {
    return quat.setFromAxisAngle(this.axis, this.angle.genValue(memory, t) * delta);
  }
  toJSON() {
    return {
      type: "AxisAngle",
      axis: { x: this.axis.x, y: this.axis.y, z: this.axis.z },
      angle: this.angle.toJSON()
    };
  }
  static fromJSON(json) {
    return new AxisAngleGenerator(new Vector3(json.axis.x, json.axis.y, json.axis.z), ValueGeneratorFromJSON(json.angle));
  }
  clone() {
    return new AxisAngleGenerator(this.axis.clone(), this.angle.clone());
  }
}
class EulerGenerator {
  constructor(angleX, angleY, angleZ, eulerOrder) {
    this.angleX = angleX;
    this.angleY = angleY;
    this.angleZ = angleZ;
    this.type = "rotation";
    this.eular = new Euler(0, 0, 0, eulerOrder);
  }
  startGen(memory) {
    this.angleX.startGen(memory);
    this.angleY.startGen(memory);
    this.angleZ.startGen(memory);
  }
  genValue(memory, quat, delta, t) {
    this.eular.set(this.angleX.genValue(memory, t) * delta, this.angleY.genValue(memory, t) * delta, this.angleZ.genValue(memory, t) * delta);
    return quat.setFromEuler(this.eular);
  }
  toJSON() {
    return {
      type: "Euler",
      angleX: this.angleX.toJSON(),
      angleY: this.angleY.toJSON(),
      angleZ: this.angleZ.toJSON(),
      eulerOrder: this.eular.order
    };
  }
  static fromJSON(json) {
    return new EulerGenerator(ValueGeneratorFromJSON(json.angleX), ValueGeneratorFromJSON(json.angleY), ValueGeneratorFromJSON(json.angleZ), json.eulerOrder);
  }
  clone() {
    return new EulerGenerator(this.angleX, this.angleY, this.angleZ, this.eular.order);
  }
}
function RotationGeneratorFromJSON(json) {
  switch (json.type) {
    case "AxisAngle":
      return AxisAngleGenerator.fromJSON(json);
    case "Euler":
      return EulerGenerator.fromJSON(json);
    case "RandomQuat":
      return RandomQuatGenerator.fromJSON(json);
    default:
      return new RandomQuatGenerator();
  }
}
class Vector3Function {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = "vec3function";
  }
  startGen(memory) {
    this.x.startGen(memory);
    this.y.startGen(memory);
    this.z.startGen(memory);
  }
  genValue(memory, vec, t) {
    return vec.set(this.x.genValue(memory, t), this.y.genValue(memory, t), this.z.genValue(memory, t));
  }
  toJSON() {
    return {
      type: "Vector3Function",
      x: this.x.toJSON(),
      y: this.y.toJSON(),
      z: this.z.toJSON()
    };
  }
  static fromJSON(json) {
    return new Vector3Function(ValueGeneratorFromJSON(json.x), ValueGeneratorFromJSON(json.y), ValueGeneratorFromJSON(json.z));
  }
  clone() {
    return new Vector3Function(this.x, this.y, this.z);
  }
}
function Vector3GeneratorFromJSON(json) {
  switch (json.type) {
    case "Vector3Function":
      return Vector3Function.fromJSON(json);
    default:
      return new Vector3Function(new ConstantValue(0), new ConstantValue(0), new ConstantValue(0));
  }
}
function GeneratorFromJSON(json) {
  switch (json.type) {
    case "ConstantValue":
    case "IntervalValue":
    case "PiecewiseBezier":
      return ValueGeneratorFromJSON(json);
    case "AxisAngle":
    case "RandomQuat":
    case "Euler":
      return RotationGeneratorFromJSON(json);
    case "Vector3Function":
      return Vector3GeneratorFromJSON(json);
    default:
      return new ConstantValue(0);
  }
}
class ConeEmitter {
  constructor(parameters = {}) {
    this.type = "cone";
    this.currentValue = 0;
    this.radius = parameters.radius ?? 10;
    this.arc = parameters.arc ?? 2 * Math.PI;
    this.thickness = parameters.thickness ?? 1;
    this.angle = parameters.angle ?? Math.PI / 6;
    this.mode = parameters.mode ?? EmitterMode.Random;
    this.spread = parameters.spread ?? 0;
    this.speed = parameters.speed ?? new ConstantValue(1);
    this.memory = [];
  }
  update(system, delta) {
    if (EmitterMode.Random != this.mode) {
      this.currentValue += this.speed.genValue(this.memory, system.emissionState.time / system.duration) * delta;
    }
  }
  initialize(p, emissionState) {
    const u = getValueFromEmitterMode(this.mode, this.currentValue, this.spread, emissionState);
    const rand = MathUtils.lerp(1 - this.thickness, 1, Math.random());
    const theta = u * this.arc;
    const r = Math.sqrt(rand);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    p.position.x = r * cosTheta;
    p.position.y = r * sinTheta;
    p.position.z = 0;
    const angle = this.angle * r;
    p.velocity.set(0, 0, Math.cos(angle)).addScaledVector(p.position, Math.sin(angle)).multiplyScalar(p.startSpeed);
    p.position.multiplyScalar(this.radius);
  }
  toJSON() {
    return {
      type: "cone",
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      angle: this.angle,
      mode: this.mode,
      spread: this.spread,
      speed: this.speed.toJSON()
    };
  }
  static fromJSON(json) {
    return new ConeEmitter({
      radius: json.radius,
      arc: json.arc,
      thickness: json.thickness,
      angle: json.angle,
      mode: json.mode,
      speed: json.speed ? ValueGeneratorFromJSON(json.speed) : void 0,
      spread: json.spread
    });
  }
  clone() {
    return new ConeEmitter({
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      angle: this.angle,
      mode: this.mode,
      speed: this.speed.clone(),
      spread: this.spread
    });
  }
}
class CircleEmitter {
  constructor(parameters = {}) {
    this.type = "circle";
    this.currentValue = 0;
    this.radius = parameters.radius ?? 10;
    this.arc = parameters.arc ?? 2 * Math.PI;
    this.thickness = parameters.thickness ?? 1;
    this.mode = parameters.mode ?? EmitterMode.Random;
    this.spread = parameters.spread ?? 0;
    this.speed = parameters.speed ?? new ConstantValue(1);
    this.memory = [];
  }
  update(system, delta) {
    this.currentValue += this.speed.genValue(this.memory, system.emissionState.time / system.duration) * delta;
  }
  initialize(p, emissionState) {
    const u = getValueFromEmitterMode(this.mode, this.currentValue, this.spread, emissionState);
    const r = MathUtils.lerp(1 - this.thickness, 1, Math.random());
    const theta = u * this.arc;
    p.position.x = Math.cos(theta);
    p.position.y = Math.sin(theta);
    p.position.z = 0;
    p.velocity.copy(p.position).multiplyScalar(p.startSpeed);
    p.position.multiplyScalar(this.radius * r);
  }
  toJSON() {
    return {
      type: "circle",
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      mode: this.mode,
      spread: this.spread,
      speed: this.speed.toJSON()
    };
  }
  static fromJSON(json) {
    return new CircleEmitter({
      radius: json.radius,
      arc: json.arc,
      thickness: json.thickness,
      mode: json.mode,
      speed: json.speed ? ValueGeneratorFromJSON(json.speed) : void 0,
      spread: json.spread
    });
  }
  clone() {
    return new CircleEmitter({
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      mode: this.mode,
      speed: this.speed.clone(),
      spread: this.spread
    });
  }
}
function randomInt(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}
const UP_VEC3 = new Vector3(0, 1, 0);
const ZERO_VEC3 = new Vector3(0, 0, 0);
const ONE_VEC3 = new Vector3(1, 1, 1);
const Z_VEC3 = new Vector3(0, 0, 1);
class DonutEmitter {
  constructor(parameters = {}) {
    this.type = "donut";
    this.currentValue = 0;
    this.radius = parameters.radius ?? 10;
    this.arc = parameters.arc ?? 2 * Math.PI;
    this.thickness = parameters.thickness ?? 1;
    this.donutRadius = parameters.donutRadius ?? this.radius * 0.2;
    this.mode = parameters.mode ?? EmitterMode.Random;
    this.spread = parameters.spread ?? 0;
    this.speed = parameters.speed ?? new ConstantValue(1);
    this.memory = [];
    this._m1 = new Matrix4();
  }
  update(system, delta) {
    if (EmitterMode.Random != this.mode) {
      this.currentValue += this.speed.genValue(this.memory, system.emissionState.time / system.duration) * delta;
    }
  }
  initialize(p, emissionState) {
    const u = getValueFromEmitterMode(this.mode, this.currentValue, this.spread, emissionState);
    const v = Math.random();
    const rand = MathUtils.lerp(1 - this.thickness, 1, Math.random());
    const theta = u * this.arc;
    const phi = v * Math.PI * 2;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    p.position.x = this.radius * cosTheta;
    p.position.y = this.radius * sinTheta;
    p.position.z = 0;
    p.velocity.z = this.donutRadius * rand * Math.sin(phi);
    p.velocity.x = this.donutRadius * rand * Math.cos(phi) * cosTheta;
    p.velocity.y = this.donutRadius * rand * Math.cos(phi) * sinTheta;
    p.position.add(p.velocity);
    p.velocity.normalize().multiplyScalar(p.startSpeed);
    if (p.rotation instanceof Quaternion) {
      this._m1.lookAt(ZERO_VEC3, p.velocity, UP_VEC3);
      p.rotation.setFromRotationMatrix(this._m1);
    }
  }
  toJSON() {
    return {
      type: "donut",
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      donutRadius: this.donutRadius,
      mode: this.mode,
      spread: this.spread,
      speed: this.speed.toJSON()
    };
  }
  static fromJSON(json) {
    return new DonutEmitter({
      radius: json.radius,
      arc: json.arc,
      thickness: json.thickness,
      donutRadius: json.donutRadius,
      mode: json.mode,
      speed: json.speed ? ValueGeneratorFromJSON(json.speed) : void 0,
      spread: json.spread
    });
  }
  clone() {
    return new DonutEmitter({
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      donutRadius: this.donutRadius,
      mode: this.mode,
      speed: this.speed.clone(),
      spread: this.spread
    });
  }
}
class PointEmitter {
  constructor() {
    this.type = "point";
    this._m1 = new Matrix4();
  }
  update(system, delta) {
  }
  initialize(p) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random());
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    p.velocity.x = r * sinPhi * cosTheta;
    p.velocity.y = r * sinPhi * sinTheta;
    p.velocity.z = r * cosPhi;
    p.velocity.multiplyScalar(p.startSpeed);
    p.position.setScalar(0);
    if (p.rotation instanceof Quaternion) {
      this._m1.lookAt(ZERO_VEC3, p.position, UP_VEC3);
      p.rotation.setFromRotationMatrix(this._m1);
    }
  }
  toJSON() {
    return {
      type: "point"
    };
  }
  static fromJSON(json) {
    return new PointEmitter();
  }
  clone() {
    return new PointEmitter();
  }
}
class SphereEmitter {
  constructor(parameters = {}) {
    this.type = "sphere";
    this.currentValue = 0;
    this.radius = parameters.radius ?? 10;
    this.arc = parameters.arc ?? 2 * Math.PI;
    this.thickness = parameters.thickness ?? 1;
    this.mode = parameters.mode ?? EmitterMode.Random;
    this.spread = parameters.spread ?? 0;
    this.speed = parameters.speed ?? new ConstantValue(1);
    this.memory = [];
    this._m1 = new Matrix4();
  }
  update(system, delta) {
    if (EmitterMode.Random != this.mode) {
      this.currentValue += this.speed.genValue(this.memory, system.emissionState.time / system.duration) * delta;
    }
  }
  initialize(p, emissionState) {
    const u = getValueFromEmitterMode(this.mode, this.currentValue, this.spread, emissionState);
    const v = Math.random();
    const rand = MathUtils.lerp(1 - this.thickness, 1, Math.random());
    const theta = u * this.arc;
    const phi = Math.acos(2 * v - 1);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    p.position.x = sinPhi * cosTheta;
    p.position.y = sinPhi * sinTheta;
    p.position.z = cosPhi;
    p.velocity.copy(p.position).multiplyScalar(p.startSpeed);
    p.position.multiplyScalar(this.radius * rand);
    if (p.rotation instanceof Quaternion) {
      this._m1.lookAt(ZERO_VEC3, p.position, UP_VEC3);
      p.rotation.setFromRotationMatrix(this._m1);
    }
  }
  toJSON() {
    return {
      type: "sphere",
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      mode: this.mode,
      spread: this.spread,
      speed: this.speed.toJSON()
    };
  }
  static fromJSON(json) {
    return new SphereEmitter({
      radius: json.radius,
      arc: json.arc,
      thickness: json.thickness,
      mode: json.mode,
      speed: json.speed ? ValueGeneratorFromJSON(json.speed) : void 0,
      spread: json.spread
    });
  }
  clone() {
    return new SphereEmitter({
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      mode: this.mode,
      speed: this.speed.clone(),
      spread: this.spread
    });
  }
}
class HemisphereEmitter {
  constructor(parameters = {}) {
    this.type = "hemisphere";
    this.currentValue = 0;
    this.radius = parameters.radius ?? 10;
    this.arc = parameters.arc ?? 2 * Math.PI;
    this.thickness = parameters.thickness ?? 1;
    this.mode = parameters.mode ?? EmitterMode.Random;
    this.spread = parameters.spread ?? 0;
    this.speed = parameters.speed ?? new ConstantValue(1);
    this.memory = [];
    this._m1 = new Matrix4();
  }
  update(system, delta) {
    if (EmitterMode.Random != this.mode) {
      this.currentValue += this.speed.genValue(this.memory, system.emissionState.time / system.duration) * delta;
    }
  }
  initialize(p, emissionState) {
    const u = getValueFromEmitterMode(this.mode, this.currentValue, this.spread, emissionState);
    const v = Math.random();
    const rand = MathUtils.lerp(1 - this.thickness, 1, Math.random());
    const theta = u * this.arc;
    const phi = Math.acos(v);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    p.position.x = sinPhi * cosTheta;
    p.position.y = sinPhi * sinTheta;
    p.position.z = cosPhi;
    p.velocity.copy(p.position).multiplyScalar(p.startSpeed);
    p.position.multiplyScalar(this.radius * rand);
    if (p.rotation instanceof Quaternion) {
      this._m1.lookAt(ZERO_VEC3, p.position, UP_VEC3);
      p.rotation.setFromRotationMatrix(this._m1);
    }
  }
  toJSON() {
    return {
      type: "hemisphere",
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      mode: this.mode,
      spread: this.spread,
      speed: this.speed.toJSON()
    };
  }
  static fromJSON(json) {
    return new HemisphereEmitter({
      radius: json.radius,
      arc: json.arc,
      thickness: json.thickness,
      mode: json.mode,
      speed: json.speed ? ValueGeneratorFromJSON(json.speed) : void 0,
      spread: json.spread
    });
  }
  clone() {
    return new HemisphereEmitter({
      radius: this.radius,
      arc: this.arc,
      thickness: this.thickness,
      mode: this.mode,
      speed: this.speed.clone(),
      spread: this.spread
    });
  }
}
class GridEmitter {
  constructor(parameters = {}) {
    this.type = "grid";
    this.width = parameters.width ?? 1;
    this.height = parameters.height ?? 1;
    this.column = parameters.column ?? 10;
    this.row = parameters.row ?? 10;
  }
  initialize(p) {
    const r = Math.floor(Math.random() * this.row);
    const c = Math.floor(Math.random() * this.column);
    p.position.x = c * this.width / this.column - this.width / 2;
    p.position.y = r * this.height / this.row - this.height / 2;
    p.position.z = 0;
    p.velocity.set(0, 0, p.startSpeed);
  }
  toJSON() {
    return {
      type: "grid",
      width: this.width,
      height: this.height,
      column: this.column,
      row: this.row
    };
  }
  static fromJSON(json) {
    return new GridEmitter(json);
  }
  clone() {
    return new GridEmitter({
      width: this.width,
      height: this.height,
      column: this.column,
      row: this.row
    });
  }
  update(system, delta) {
  }
}
class RectangleEmitter {
  constructor(parameters = {}) {
    this.type = "rectangle";
    this.currentValue = 0;
    this.width = parameters.width ?? 10;
    this.height = parameters.height ?? 10;
    this.thickness = parameters.thickness ?? 1;
    this.mode = parameters.mode ?? EmitterMode.Random;
    this.spread = parameters.spread ?? 0;
    this.speed = parameters.speed ?? new ConstantValue(1);
    this.memory = [];
    this._m1 = new Matrix4();
  }
  update(system, delta) {
    this.currentValue += this.speed.genValue(this.memory, system.emissionState.time / system.duration) * delta;
  }
  initialize(p, emissionState) {
    const u = getValueFromEmitterMode(this.mode, this.currentValue, this.spread, emissionState);
    const totalPerimeter = 2 * (this.width + this.height);
    const point = u * totalPerimeter;
    let x, y;
    if (point < this.width) {
      x = point - this.width / 2;
      y = -this.height / 2;
    } else if (point < this.width + this.height) {
      x = this.width / 2;
      y = point - this.width - this.height / 2;
    } else if (point < 2 * this.width + this.height) {
      x = this.width / 2 - (point - this.width - this.height);
      y = this.height / 2;
    } else {
      x = -this.width / 2;
      y = this.height / 2 - (point - 2 * this.width - this.height);
    }
    const rand = Math.random();
    const thicknessScale = 1 - this.thickness * rand;
    p.position.x = x * thicknessScale;
    p.position.y = y * thicknessScale;
    p.position.z = 0;
    p.velocity.x = x;
    p.velocity.y = y;
    p.velocity.z = 0;
    p.velocity.normalize().multiplyScalar(p.startSpeed);
    if (p.rotation instanceof Quaternion) {
      this._m1.lookAt(ZERO_VEC3, p.velocity, UP_VEC3);
      p.rotation.setFromRotationMatrix(this._m1);
    }
  }
  toJSON() {
    return {
      type: "rectangle",
      width: this.width,
      height: this.height,
      thickness: this.thickness,
      mode: this.mode,
      spread: this.spread,
      speed: this.speed.toJSON()
    };
  }
  static fromJSON(json) {
    return new RectangleEmitter({
      width: json.width,
      height: json.height,
      thickness: json.thickness,
      mode: json.mode,
      speed: json.speed ? ValueGeneratorFromJSON(json.speed) : void 0,
      spread: json.spread
    });
  }
  clone() {
    return new RectangleEmitter({
      width: this.width,
      height: this.height,
      thickness: this.thickness,
      mode: this.mode,
      speed: this.speed.clone(),
      spread: this.spread
    });
  }
}
const EmitterShapes = {
  circle: {
    type: "circle",
    params: [
      ["radius", ["number"]],
      ["arc", ["radian"]],
      ["thickness", ["number"]],
      ["mode", ["emitterMode"]],
      ["spread", ["number"]],
      ["speed", ["valueFunc", "value"]]
    ],
    constructor: CircleEmitter,
    loadJSON: CircleEmitter.fromJSON
  },
  cone: {
    type: "cone",
    params: [
      ["radius", ["number"]],
      ["arc", ["radian"]],
      ["thickness", ["number"]],
      ["angle", ["radian"]],
      ["mode", ["emitterMode"]],
      ["spread", ["number"]],
      ["speed", ["valueFunc", "value"]]
    ],
    constructor: ConeEmitter,
    loadJSON: ConeEmitter.fromJSON
  },
  donut: {
    type: "donut",
    params: [
      ["radius", ["number"]],
      ["arc", ["radian"]],
      ["thickness", ["number"]],
      ["donutRadius", ["number"]],
      ["mode", ["emitterMode"]],
      ["spread", ["number"]],
      ["speed", ["valueFunc", "value"]]
    ],
    constructor: DonutEmitter,
    loadJSON: DonutEmitter.fromJSON
  },
  point: { type: "point", params: [], constructor: PointEmitter, loadJSON: PointEmitter.fromJSON },
  sphere: {
    type: "sphere",
    params: [
      ["radius", ["number"]],
      ["arc", ["radian"]],
      ["thickness", ["number"]],
      ["angle", ["radian"]],
      ["mode", ["emitterMode"]],
      ["spread", ["number"]],
      ["speed", ["valueFunc", "value"]]
    ],
    constructor: SphereEmitter,
    loadJSON: SphereEmitter.fromJSON
  },
  hemisphere: {
    type: "hemisphere",
    params: [
      ["radius", ["number"]],
      ["arc", ["radian"]],
      ["thickness", ["number"]],
      ["angle", ["radian"]],
      ["mode", ["emitterMode"]],
      ["spread", ["number"]],
      ["speed", ["valueFunc", "value"]]
    ],
    constructor: HemisphereEmitter,
    loadJSON: HemisphereEmitter.fromJSON
  },
  grid: {
    type: "grid",
    params: [
      ["width", ["number"]],
      ["height", ["number"]],
      ["rows", ["number"]],
      ["column", ["number"]]
    ],
    constructor: GridEmitter,
    loadJSON: GridEmitter.fromJSON
  },
  rectangle: {
    type: "rectangle",
    params: [
      ["width", ["number"]],
      ["height", ["number"]],
      ["thickness", ["number"]],
      ["mode", ["emitterMode"]],
      ["spread", ["number"]],
      ["speed", ["valueFunc", "value"]]
    ],
    constructor: RectangleEmitter,
    loadJSON: RectangleEmitter.fromJSON
  }
};
function EmitterFromJSON(json, meta) {
  return EmitterShapes[json.type].loadJSON(json, meta);
}
class ColorOverLife {
  constructor(color) {
    this.color = color;
    this.type = "ColorOverLife";
  }
  initialize(particle) {
    this.color.startGen(particle.memory);
  }
  update(particle, delta) {
    this.color.genColor(particle.memory, particle.color, particle.age / particle.life);
    particle.color.x *= particle.startColor.x;
    particle.color.y *= particle.startColor.y;
    particle.color.z *= particle.startColor.z;
    particle.color.w *= particle.startColor.w;
  }
  frameUpdate(delta) {
  }
  toJSON() {
    return {
      type: this.type,
      color: this.color.toJSON()
    };
  }
  static fromJSON(json) {
    return new ColorOverLife(ColorGeneratorFromJSON(json.color));
  }
  clone() {
    return new ColorOverLife(this.color.clone());
  }
  reset() {
  }
}
class RotationOverLife {
  constructor(angularVelocity) {
    this.angularVelocity = angularVelocity;
    this.type = "RotationOverLife";
  }
  initialize(particle) {
    if (typeof particle.rotation === "number") {
      this.angularVelocity.startGen(particle.memory);
    }
  }
  update(particle, delta) {
    if (typeof particle.rotation === "number") {
      particle.rotation += delta * this.angularVelocity.genValue(particle.memory, particle.age / particle.life);
    }
  }
  toJSON() {
    return {
      type: this.type,
      angularVelocity: this.angularVelocity.toJSON()
    };
  }
  static fromJSON(json) {
    return new RotationOverLife(ValueGeneratorFromJSON(json.angularVelocity));
  }
  frameUpdate(delta) {
  }
  clone() {
    return new RotationOverLife(this.angularVelocity.clone());
  }
  reset() {
  }
}
class Rotation3DOverLife {
  constructor(angularVelocity) {
    this.angularVelocity = angularVelocity;
    this.type = "Rotation3DOverLife";
    this.tempQuat = new Quaternion();
    this.tempQuat2 = new Quaternion();
  }
  initialize(particle) {
    if (particle.rotation instanceof Quaternion) {
      particle.angularVelocity = new Quaternion();
      this.angularVelocity.startGen(particle.memory);
    }
  }
  update(particle, delta) {
    if (particle.rotation instanceof Quaternion) {
      this.angularVelocity.genValue(particle.memory, this.tempQuat, delta, particle.age / particle.life);
      particle.rotation.multiply(this.tempQuat);
    }
  }
  toJSON() {
    return {
      type: this.type,
      angularVelocity: this.angularVelocity.toJSON()
    };
  }
  static fromJSON(json) {
    return new Rotation3DOverLife(RotationGeneratorFromJSON(json.angularVelocity));
  }
  frameUpdate(delta) {
  }
  clone() {
    return new Rotation3DOverLife(this.angularVelocity.clone());
  }
  reset() {
  }
}
class ForceOverLife {
  initialize(particle, particleSystem) {
    this.ps = particleSystem;
    this.x.startGen(particle.memory);
    this.y.startGen(particle.memory);
    this.z.startGen(particle.memory);
  }
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = "ForceOverLife";
    this._temp = new Vector3();
    this._tempScale = new Vector3();
    this._tempQ = new Quaternion();
  }
  update(particle, delta) {
    this._temp.set(this.x.genValue(particle.memory, particle.age / particle.life), this.y.genValue(particle.memory, particle.age / particle.life), this.z.genValue(particle.memory, particle.age / particle.life));
    if (this.ps.worldSpace) {
      particle.velocity.addScaledVector(this._temp, delta);
    } else {
      this._temp.multiply(this._tempScale).applyQuaternion(this._tempQ);
      particle.velocity.addScaledVector(this._temp, delta);
    }
  }
  toJSON() {
    return {
      type: this.type,
      x: this.x.toJSON(),
      y: this.y.toJSON(),
      z: this.z.toJSON()
    };
  }
  static fromJSON(json) {
    return new ForceOverLife(ValueGeneratorFromJSON(json.x), ValueGeneratorFromJSON(json.y), ValueGeneratorFromJSON(json.z));
  }
  frameUpdate(delta) {
    if (this.ps && !this.ps.worldSpace) {
      const translation = this._temp;
      const quaternion = this._tempQ;
      const scale = this._tempScale;
      this.ps.emitter.matrixWorld.decompose(translation, quaternion, scale);
      quaternion.invert();
      scale.set(1 / scale.x, 1 / scale.y, 1 / scale.z);
    }
  }
  clone() {
    return new ForceOverLife(this.x.clone(), this.y.clone(), this.z.clone());
  }
  reset() {
  }
}
class SizeOverLife {
  initialize(particle) {
    this.size.startGen(particle.memory);
  }
  constructor(size) {
    this.size = size;
    this.type = "SizeOverLife";
  }
  update(particle) {
    if (this.size instanceof Vector3Function) {
      this.size.genValue(particle.memory, particle.size, particle.age / particle.life).multiply(particle.startSize);
    } else {
      particle.size.copy(particle.startSize).multiplyScalar(this.size.genValue(particle.memory, particle.age / particle.life));
    }
  }
  toJSON() {
    return {
      type: this.type,
      size: this.size.toJSON()
    };
  }
  static fromJSON(json) {
    return new SizeOverLife(GeneratorFromJSON(json.size));
  }
  frameUpdate(delta) {
  }
  clone() {
    return new SizeOverLife(this.size.clone());
  }
  reset() {
  }
}
class SpeedOverLife {
  initialize(particle) {
    this.speed.startGen(particle.memory);
  }
  constructor(speed) {
    this.speed = speed;
    this.type = "SpeedOverLife";
  }
  update(particle) {
    particle.speedModifier = this.speed.genValue(particle.memory, particle.age / particle.life);
  }
  toJSON() {
    return {
      type: this.type,
      speed: this.speed.toJSON()
    };
  }
  static fromJSON(json) {
    return new SpeedOverLife(ValueGeneratorFromJSON(json.speed));
  }
  frameUpdate(delta) {
  }
  clone() {
    return new SpeedOverLife(this.speed.clone());
  }
  reset() {
  }
}
class FrameOverLife {
  constructor(frame) {
    this.frame = frame;
    this.type = "FrameOverLife";
  }
  initialize(particle) {
    this.frame.startGen(particle.memory);
  }
  update(particle, delta) {
    if (this.frame instanceof PiecewiseBezier) {
      particle.uvTile = this.frame.genValue(particle.memory, particle.age / particle.life);
    }
  }
  frameUpdate(delta) {
  }
  toJSON() {
    return {
      type: this.type,
      frame: this.frame.toJSON()
    };
  }
  static fromJSON(json) {
    return new FrameOverLife(ValueGeneratorFromJSON(json.frame));
  }
  clone() {
    return new FrameOverLife(this.frame.clone());
  }
  reset() {
  }
}
class OrbitOverLife {
  constructor(orbitSpeed, axis = new Vector3(0, 1, 0)) {
    this.orbitSpeed = orbitSpeed;
    this.axis = axis;
    this.type = "OrbitOverLife";
    this.temp = new Vector3();
    this.rotation = new Quaternion();
  }
  initialize(particle) {
    this.orbitSpeed.startGen(particle.memory);
  }
  update(particle, delta) {
    this.temp.copy(particle.position).projectOnVector(this.axis);
    this.rotation.setFromAxisAngle(this.axis, this.orbitSpeed.genValue(particle.memory, particle.age / particle.life) * delta);
    particle.position.sub(this.temp);
    particle.position.applyQuaternion(this.rotation);
    particle.position.add(this.temp);
  }
  frameUpdate(delta) {
  }
  toJSON() {
    return {
      type: this.type,
      orbitSpeed: this.orbitSpeed.toJSON(),
      axis: [this.axis.x, this.axis.y, this.axis.z]
    };
  }
  static fromJSON(json) {
    return new OrbitOverLife(ValueGeneratorFromJSON(json.orbitSpeed), json.axis ? new Vector3(json.axis[0], json.axis[1], json.axis[2]) : void 0);
  }
  clone() {
    return new OrbitOverLife(this.orbitSpeed.clone());
  }
  reset() {
  }
}
class LinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
  hasPrev() {
    return this.prev !== null;
  }
  hasNext() {
    return this.next !== null;
  }
}
class LinkedList {
  constructor() {
    this.length = 0;
    this.head = this.tail = null;
  }
  isEmpty() {
    return this.head === null;
  }
  clear() {
    this.length = 0;
    this.head = this.tail = null;
  }
  front() {
    if (this.head === null)
      return null;
    return this.head.data;
  }
  back() {
    if (this.tail === null)
      return null;
    return this.tail.data;
  }
  dequeue() {
    if (this.head) {
      const value = this.head.data;
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null;
      } else {
        this.head.prev = null;
      }
      this.length--;
      return value;
    }
    return void 0;
  }
  pop() {
    if (this.tail) {
      const value = this.tail.data;
      this.tail = this.tail.prev;
      if (!this.tail) {
        this.head = null;
      } else {
        this.tail.next = null;
      }
      this.length--;
      return value;
    }
    return void 0;
  }
  queue(data) {
    const node = new LinkedListNode(data);
    if (!this.tail) {
      this.tail = node;
    }
    if (this.head) {
      this.head.prev = node;
      node.next = this.head;
    }
    this.head = node;
    this.length++;
  }
  push(data) {
    const node = new LinkedListNode(data);
    if (!this.head) {
      this.head = node;
    }
    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
    }
    this.tail = node;
    this.length++;
  }
  insertBefore(node, data) {
    const newNode = new LinkedListNode(data);
    newNode.next = node;
    newNode.prev = node.prev;
    if (newNode.prev !== null) {
      newNode.prev.next = newNode;
    }
    newNode.next.prev = newNode;
    if (node == this.head) {
      this.head = newNode;
    }
    this.length++;
  }
  remove(data) {
    if (this.head === null || this.tail === null) {
      return;
    }
    let tempNode = this.head;
    if (data === this.head.data) {
      this.head = this.head.next;
    }
    if (data === this.tail.data) {
      this.tail = this.tail.prev;
    }
    while (tempNode.next !== null && tempNode.data !== data) {
      tempNode = tempNode.next;
    }
    if (tempNode.data === data) {
      if (tempNode.prev !== null)
        tempNode.prev.next = tempNode.next;
      if (tempNode.next !== null)
        tempNode.next.prev = tempNode.prev;
      this.length--;
    }
  }
  *values() {
    let current = this.head;
    while (current !== null) {
      yield current.data;
      current = current.next;
    }
  }
}
class SpriteParticle {
  constructor() {
    this.startSpeed = 0;
    this.startColor = new Vector4();
    this.startSize = new Vector3(1, 1, 1);
    this.position = new Vector3();
    this.velocity = new Vector3();
    this.age = 0;
    this.life = 1;
    this.size = new Vector3(1, 1, 1);
    this.speedModifier = 1;
    this.rotation = 0;
    this.color = new Vector4();
    this.uvTile = 0;
    this.memory = [];
  }
  get died() {
    return this.age >= this.life;
  }
  reset() {
    this.memory.length = 0;
  }
}
class RecordState {
  constructor(position, size, color) {
    this.position = position;
    this.size = size;
    this.color = color;
  }
}
class TrailParticle {
  constructor() {
    this.startSpeed = 0;
    this.startColor = new Vector4();
    this.startSize = new Vector3(1, 1, 1);
    this.position = new Vector3();
    this.velocity = new Vector3();
    this.age = 0;
    this.life = 1;
    this.size = new Vector3(1, 1, 1);
    this.length = 100;
    this.speedModifier = 1;
    this.color = new Vector4();
    this.previous = new LinkedList();
    this.uvTile = 0;
    this.memory = [];
  }
  update() {
    if (this.age <= this.life) {
      this.previous.push(new RecordState(this.position.clone(), this.size.x, this.color.clone()));
    } else {
      if (this.previous.length > 0) {
        this.previous.dequeue();
      }
    }
    while (this.previous.length > this.length) {
      this.previous.dequeue();
    }
  }
  get died() {
    return this.age >= this.life;
  }
  reset() {
    this.memory.length = 0;
    this.previous.clear();
  }
}
class WidthOverLength {
  initialize(particle) {
    this.width.startGen(particle.memory);
  }
  constructor(width) {
    this.width = width;
    this.type = "WidthOverLength";
  }
  update(particle) {
    if (particle instanceof TrailParticle) {
      const iter = particle.previous.values();
      for (let i = 0; i < particle.previous.length; i++) {
        const cur = iter.next();
        cur.value.size = this.width.genValue(particle.memory, (particle.previous.length - i) / particle.length);
      }
    }
  }
  frameUpdate(delta) {
  }
  toJSON() {
    return {
      type: this.type,
      width: this.width.toJSON()
    };
  }
  static fromJSON(json) {
    return new WidthOverLength(ValueGeneratorFromJSON(json.width));
  }
  clone() {
    return new WidthOverLength(this.width.clone());
  }
  reset() {
  }
}
class ApplyForce {
  constructor(direction, magnitude) {
    this.direction = direction;
    this.magnitude = magnitude;
    this.type = "ApplyForce";
    this.memory = {
      data: [],
      dataCount: 0
    };
    this.magnitudeValue = this.magnitude.genValue(this.memory);
  }
  initialize(particle) {
  }
  update(particle, delta) {
    particle.velocity.addScaledVector(this.direction, this.magnitudeValue * delta);
  }
  frameUpdate(delta) {
    this.magnitudeValue = this.magnitude.genValue(this.memory);
  }
  toJSON() {
    return {
      type: this.type,
      direction: [this.direction.x, this.direction.y, this.direction.z],
      magnitude: this.magnitude.toJSON()
    };
  }
  static fromJSON(json) {
    return new ApplyForce(new Vector3(json.direction[0], json.direction[1], json.direction[2]), ValueGeneratorFromJSON(json.magnitude ?? json.force));
  }
  clone() {
    return new ApplyForce(this.direction.clone(), this.magnitude.clone());
  }
  reset() {
  }
}
class GravityForce {
  constructor(center, magnitude) {
    this.center = center;
    this.magnitude = magnitude;
    this.type = "GravityForce";
    this.temp = new Vector3();
  }
  initialize(particle) {
  }
  update(particle, delta) {
    this.temp.copy(this.center).sub(particle.position).normalize();
    particle.velocity.addScaledVector(this.temp, this.magnitude / particle.position.distanceToSquared(this.center) * delta);
  }
  frameUpdate(delta) {
  }
  toJSON() {
    return {
      type: this.type,
      center: [this.center.x, this.center.y, this.center.z],
      magnitude: this.magnitude
    };
  }
  static fromJSON(json) {
    return new GravityForce(new Vector3(json.center[0], json.center[1], json.center[2]), json.magnitude);
  }
  clone() {
    return new GravityForce(this.center.clone(), this.magnitude);
  }
  reset() {
  }
}
class ChangeEmitDirection {
  constructor(angle) {
    this.angle = angle;
    this.type = "ChangeEmitDirection";
    this._temp = new Vector3();
    this._q = new Quaternion();
    this.memory = { data: [], dataCount: 0 };
  }
  initialize(particle) {
    const len = particle.velocity.length();
    if (len == 0)
      return;
    particle.velocity.normalize();
    if (particle.velocity.x === 0 && particle.velocity.y === 0) {
      this._temp.set(0, particle.velocity.z, 0);
    } else {
      this._temp.set(-particle.velocity.y, particle.velocity.x, 0);
    }
    this.angle.startGen(this.memory);
    this._q.setFromAxisAngle(this._temp.normalize(), this.angle.genValue(this.memory));
    this._temp.copy(particle.velocity);
    particle.velocity.applyQuaternion(this._q);
    this._q.setFromAxisAngle(this._temp, Math.random() * Math.PI * 2);
    particle.velocity.applyQuaternion(this._q);
    particle.velocity.setLength(len);
  }
  update(particle, delta) {
  }
  frameUpdate(delta) {
  }
  toJSON() {
    return {
      type: this.type,
      angle: this.angle.toJSON()
    };
  }
  static fromJSON(json) {
    return new ChangeEmitDirection(ValueGeneratorFromJSON(json.angle));
  }
  clone() {
    return new ChangeEmitDirection(this.angle);
  }
  reset() {
  }
}
var SubParticleEmitMode;
(function(SubParticleEmitMode2) {
  SubParticleEmitMode2[SubParticleEmitMode2["Death"] = 0] = "Death";
  SubParticleEmitMode2[SubParticleEmitMode2["Birth"] = 1] = "Birth";
  SubParticleEmitMode2[SubParticleEmitMode2["Frame"] = 2] = "Frame";
})(SubParticleEmitMode || (SubParticleEmitMode = {}));
class EmitSubParticleSystem {
  constructor(particleSystem, useVelocityAsBasis, subParticleSystem, mode = SubParticleEmitMode.Frame, emitProbability = 1) {
    this.particleSystem = particleSystem;
    this.useVelocityAsBasis = useVelocityAsBasis;
    this.subParticleSystem = subParticleSystem;
    this.mode = mode;
    this.emitProbability = emitProbability;
    this.type = "EmitSubParticleSystem";
    this.q_ = new Quaternion();
    this.v_ = new Vector3();
    this.v2_ = new Vector3();
    this.subEmissions = new Array();
    if (this.subParticleSystem && this.subParticleSystem.system) {
      this.subParticleSystem.system.onlyUsedByOther = true;
    }
  }
  initialize(particle) {
  }
  update(particle, delta) {
    if (this.mode === SubParticleEmitMode.Frame) {
      this.emit(particle, delta);
    } else if (this.mode === SubParticleEmitMode.Birth && particle.age === 0) {
      this.emit(particle, delta);
    } else if (this.mode === SubParticleEmitMode.Death && particle.age + delta >= particle.life) {
      this.emit(particle, delta);
    }
  }
  emit(particle, delta) {
    if (!this.subParticleSystem)
      return;
    if (Math.random() > this.emitProbability) {
      return;
    }
    const m = new Matrix4();
    this.setMatrixFromParticle(m, particle);
    this.subEmissions.push({
      burstParticleCount: 0,
      burstParticleIndex: 0,
      isBursting: false,
      burstIndex: 0,
      burstWaveIndex: 0,
      time: 0,
      waitEmiting: 0,
      matrix: m,
      travelDistance: 0,
      particle
    });
  }
  frameUpdate(delta) {
    if (!this.subParticleSystem)
      return;
    for (let i = 0; i < this.subEmissions.length; i++) {
      if (this.subEmissions[i].time >= this.subParticleSystem.system.duration) {
        this.subEmissions[i] = this.subEmissions[this.subEmissions.length - 1];
        this.subEmissions.length = this.subEmissions.length - 1;
        i--;
      } else {
        const subEmissionState = this.subEmissions[i];
        if (subEmissionState.particle && subEmissionState.particle.age < subEmissionState.particle.life) {
          this.setMatrixFromParticle(subEmissionState.matrix, subEmissionState.particle);
        } else {
          subEmissionState.particle = void 0;
        }
        this.subParticleSystem.system.emit(delta, subEmissionState, subEmissionState.matrix);
      }
    }
  }
  toJSON() {
    return {
      type: this.type,
      subParticleSystem: this.subParticleSystem ? this.subParticleSystem.uuid : "",
      useVelocityAsBasis: this.useVelocityAsBasis,
      mode: this.mode,
      emitProbability: this.emitProbability
    };
  }
  static fromJSON(json, particleSystem) {
    return new EmitSubParticleSystem(particleSystem, json.useVelocityAsBasis, json.subParticleSystem, json.mode, json.emitProbability);
  }
  clone() {
    return new EmitSubParticleSystem(this.particleSystem, this.useVelocityAsBasis, this.subParticleSystem, this.mode, this.emitProbability);
  }
  reset() {
  }
  setMatrixFromParticle(m, particle) {
    let rotation;
    if (particle.rotation === void 0 || this.useVelocityAsBasis) {
      if (particle.velocity.x === 0 && particle.velocity.y === 0 && (particle.velocity.z === 1 || particle.velocity.z === 0)) {
        m.set(1, 0, 0, particle.position.x, 0, 1, 0, particle.position.y, 0, 0, 1, particle.position.z, 0, 0, 0, 1);
      } else {
        this.v_.copy(Z_VEC3).cross(particle.velocity);
        this.v2_.copy(particle.velocity).cross(this.v_);
        const len = this.v_.length();
        const len2 = this.v2_.length();
        m.set(this.v_.x / len, this.v2_.x / len2, particle.velocity.x, particle.position.x, this.v_.y / len, this.v2_.y / len2, particle.velocity.y, particle.position.y, this.v_.z / len, this.v2_.z / len2, particle.velocity.z, particle.position.z, 0, 0, 0, 1);
      }
    } else {
      if (particle.rotation instanceof Quaternion) {
        rotation = particle.rotation;
      } else {
        this.q_.setFromAxisAngle(Z_VEC3, particle.rotation);
        rotation = this.q_;
      }
      m.compose(particle.position, rotation, ONE_VEC3);
    }
    if (!this.particleSystem.worldSpace) {
      m.multiplyMatrices(this.particleSystem.emitter.matrixWorld, m);
    }
  }
}
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const F3 = 1 / 3;
const G3 = 1 / 6;
const F4 = (Math.sqrt(5) - 1) / 4;
const G4 = (5 - Math.sqrt(5)) / 20;
const grad3 = new Float32Array([
  1,
  1,
  0,
  -1,
  1,
  0,
  1,
  -1,
  0,
  -1,
  -1,
  0,
  1,
  0,
  1,
  -1,
  0,
  1,
  1,
  0,
  -1,
  -1,
  0,
  -1,
  0,
  1,
  1,
  0,
  -1,
  1,
  0,
  1,
  -1,
  0,
  -1,
  -1
]);
const grad4 = new Float32Array([
  0,
  1,
  1,
  1,
  0,
  1,
  1,
  -1,
  0,
  1,
  -1,
  1,
  0,
  1,
  -1,
  -1,
  0,
  -1,
  1,
  1,
  0,
  -1,
  1,
  -1,
  0,
  -1,
  -1,
  1,
  0,
  -1,
  -1,
  -1,
  1,
  0,
  1,
  1,
  1,
  0,
  1,
  -1,
  1,
  0,
  -1,
  1,
  1,
  0,
  -1,
  -1,
  -1,
  0,
  1,
  1,
  -1,
  0,
  1,
  -1,
  -1,
  0,
  -1,
  1,
  -1,
  0,
  -1,
  -1,
  1,
  1,
  0,
  1,
  1,
  1,
  0,
  -1,
  1,
  -1,
  0,
  1,
  1,
  -1,
  0,
  -1,
  -1,
  1,
  0,
  1,
  -1,
  1,
  0,
  -1,
  -1,
  -1,
  0,
  1,
  -1,
  -1,
  0,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  -1,
  0,
  1,
  -1,
  1,
  0,
  1,
  -1,
  -1,
  0,
  -1,
  1,
  1,
  0,
  -1,
  1,
  -1,
  0,
  -1,
  -1,
  1,
  0,
  -1,
  -1,
  -1,
  0
]);
class SimplexNoise {
  constructor(randomOrSeed = Math.random) {
    const random = typeof randomOrSeed == "function" ? randomOrSeed : alea(randomOrSeed);
    this.p = buildPermutationTable(random);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }
  noise2D(x, y) {
    const permMod12 = this.permMod12;
    const perm = this.perm;
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const gi0 = permMod12[ii + perm[jj]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      const gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
    }
    return 70 * (n0 + n1 + n2);
  }
  noise3D(x, y, z) {
    const permMod12 = this.permMod12;
    const perm = this.perm;
    let n0, n1, n2, n3;
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    const z0 = z - Z0;
    let i1, j1, k1;
    let i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      }
    }
    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0)
      n0 = 0;
    else {
      const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0)
      n1 = 0;
    else {
      const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0)
      n2 = 0;
    else {
      const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0)
      n3 = 0;
    else {
      const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      t3 *= t3;
      n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
    }
    return 32 * (n0 + n1 + n2 + n3);
  }
  noise4D(x, y, z, w) {
    const perm = this.perm;
    let n0, n1, n2, n3, n4;
    const s = (x + y + z + w) * F4;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const l = Math.floor(w + s);
    const t = (i + j + k + l) * G4;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const W0 = l - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    const z0 = z - Z0;
    const w0 = w - W0;
    let rankx = 0;
    let ranky = 0;
    let rankz = 0;
    let rankw = 0;
    if (x0 > y0)
      rankx++;
    else
      ranky++;
    if (x0 > z0)
      rankx++;
    else
      rankz++;
    if (x0 > w0)
      rankx++;
    else
      rankw++;
    if (y0 > z0)
      ranky++;
    else
      rankz++;
    if (y0 > w0)
      ranky++;
    else
      rankw++;
    if (z0 > w0)
      rankz++;
    else
      rankw++;
    const i1 = rankx >= 3 ? 1 : 0;
    const j1 = ranky >= 3 ? 1 : 0;
    const k1 = rankz >= 3 ? 1 : 0;
    const l1 = rankw >= 3 ? 1 : 0;
    const i2 = rankx >= 2 ? 1 : 0;
    const j2 = ranky >= 2 ? 1 : 0;
    const k2 = rankz >= 2 ? 1 : 0;
    const l2 = rankw >= 2 ? 1 : 0;
    const i3 = rankx >= 1 ? 1 : 0;
    const j3 = ranky >= 1 ? 1 : 0;
    const k3 = rankz >= 1 ? 1 : 0;
    const l3 = rankw >= 1 ? 1 : 0;
    const x1 = x0 - i1 + G4;
    const y1 = y0 - j1 + G4;
    const z1 = z0 - k1 + G4;
    const w1 = w0 - l1 + G4;
    const x2 = x0 - i2 + 2 * G4;
    const y2 = y0 - j2 + 2 * G4;
    const z2 = z0 - k2 + 2 * G4;
    const w2 = w0 - l2 + 2 * G4;
    const x3 = x0 - i3 + 3 * G4;
    const y3 = y0 - j3 + 3 * G4;
    const z3 = z0 - k3 + 3 * G4;
    const w3 = w0 - l3 + 3 * G4;
    const x4 = x0 - 1 + 4 * G4;
    const y4 = y0 - 1 + 4 * G4;
    const z4 = z0 - 1 + 4 * G4;
    const w4 = w0 - 1 + 4 * G4;
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const ll = l & 255;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
    if (t0 < 0)
      n0 = 0;
    else {
      const gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32 * 4;
      t0 *= t0;
      n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
    if (t1 < 0)
      n1 = 0;
    else {
      const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32 * 4;
      t1 *= t1;
      n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
    if (t2 < 0)
      n2 = 0;
    else {
      const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32 * 4;
      t2 *= t2;
      n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
    if (t3 < 0)
      n3 = 0;
    else {
      const gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32 * 4;
      t3 *= t3;
      n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
    }
    let t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
    if (t4 < 0)
      n4 = 0;
    else {
      const gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32 * 4;
      t4 *= t4;
      n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
    }
    return 27 * (n0 + n1 + n2 + n3 + n4);
  }
}
function buildPermutationTable(random) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }
  for (let i = 0; i < 255; i++) {
    const r = i + ~~(random() * (256 - i));
    const aux = p[i];
    p[i] = p[r];
    p[r] = aux;
  }
  return p;
}
function alea(seed) {
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let c = 1;
  const mash = masher();
  s0 = mash(" ");
  s1 = mash(" ");
  s2 = mash(" ");
  s0 -= mash(seed);
  if (s0 < 0) {
    s0 += 1;
  }
  s1 -= mash(seed);
  if (s1 < 0) {
    s1 += 1;
  }
  s2 -= mash(seed);
  if (s2 < 0) {
    s2 += 1;
  }
  return function() {
    const t = 2091639 * s0 + c * 23283064365386963e-26;
    s0 = s1;
    s1 = s2;
    return s2 = t - (c = t | 0);
  };
}
function masher() {
  let n = 4022871197;
  return function(data) {
    data = data.toString();
    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 4294967296;
    }
    return (n >>> 0) * 23283064365386963e-26;
  };
}
class TurbulenceField {
  constructor(scale, octaves, velocityMultiplier, timeScale) {
    this.scale = scale;
    this.octaves = octaves;
    this.velocityMultiplier = velocityMultiplier;
    this.timeScale = timeScale;
    this.type = "TurbulenceField";
    this.generator = new SimplexNoise();
    this.timeOffset = new Vector3();
    this.temp = new Vector3();
    this.temp2 = new Vector3();
    this.timeOffset.x = Math.random() / this.scale.x * this.timeScale.x;
    this.timeOffset.y = Math.random() / this.scale.y * this.timeScale.y;
    this.timeOffset.z = Math.random() / this.scale.z * this.timeScale.z;
  }
  initialize(particle) {
  }
  update(particle, delta) {
    const x = particle.position.x / this.scale.x;
    const y = particle.position.y / this.scale.y;
    const z = particle.position.z / this.scale.z;
    this.temp.set(0, 0, 0);
    let lvl = 1;
    for (let i = 0; i < this.octaves; i++) {
      this.temp2.set(this.generator.noise4D(x * lvl, y * lvl, z * lvl, this.timeOffset.x * lvl) / lvl, this.generator.noise4D(x * lvl, y * lvl, z * lvl, this.timeOffset.y * lvl) / lvl, this.generator.noise4D(x * lvl, y * lvl, z * lvl, this.timeOffset.z * lvl) / lvl);
      this.temp.add(this.temp2);
      lvl *= 2;
    }
    this.temp.multiply(this.velocityMultiplier);
    particle.velocity.addScaledVector(this.temp, delta);
  }
  toJSON() {
    return {
      type: this.type,
      scale: [this.scale.x, this.scale.y, this.scale.z],
      octaves: this.octaves,
      velocityMultiplier: [this.velocityMultiplier.x, this.velocityMultiplier.y, this.velocityMultiplier.z],
      timeScale: [this.timeScale.x, this.timeScale.y, this.timeScale.z]
    };
  }
  frameUpdate(delta) {
    this.timeOffset.x += delta * this.timeScale.x;
    this.timeOffset.y += delta * this.timeScale.y;
    this.timeOffset.z += delta * this.timeScale.z;
  }
  static fromJSON(json) {
    return new TurbulenceField(new Vector3(json.scale[0], json.scale[1], json.scale[2]), json.octaves, new Vector3(json.velocityMultiplier[0], json.velocityMultiplier[1], json.velocityMultiplier[2]), new Vector3(json.timeScale[0], json.timeScale[1], json.timeScale[2]));
  }
  clone() {
    return new TurbulenceField(this.scale.clone(), this.octaves, this.velocityMultiplier.clone(), this.timeScale.clone());
  }
  reset() {
  }
}
const generators = [];
const tempV$1 = new Vector3();
const tempQ$1 = new Quaternion();
class Noise {
  constructor(frequency, power, positionAmount = new ConstantValue(1), rotationAmount = new ConstantValue(0)) {
    this.frequency = frequency;
    this.power = power;
    this.positionAmount = positionAmount;
    this.rotationAmount = rotationAmount;
    this.type = "Noise";
    this.duration = 0;
    if (generators.length === 0) {
      for (let i = 0; i < 100; i++) {
        generators.push(new SimplexNoise());
      }
    }
  }
  initialize(particle) {
    particle.lastPosNoise = new Vector3();
    if (typeof particle.rotation === "number") {
      particle.lastRotNoise = 0;
    } else {
      particle.lastRotNoise = new Quaternion();
    }
    particle.generatorIndex = [randomInt(0, 100), randomInt(0, 100), randomInt(0, 100), randomInt(0, 100)];
    this.positionAmount.startGen(particle.memory);
    this.rotationAmount.startGen(particle.memory);
    this.frequency.startGen(particle.memory);
    this.power.startGen(particle.memory);
  }
  update(particle, _) {
    let frequency = this.frequency.genValue(particle.memory, particle.age / particle.life);
    let power = this.power.genValue(particle.memory, particle.age / particle.life);
    let positionAmount = this.positionAmount.genValue(particle.memory, particle.age / particle.life);
    let rotationAmount = this.rotationAmount.genValue(particle.memory, particle.age / particle.life);
    if (positionAmount > 0 && particle.lastPosNoise !== void 0) {
      particle.position.sub(particle.lastPosNoise);
      tempV$1.set(generators[particle.generatorIndex[0]].noise2D(0, particle.age * frequency) * power * positionAmount, generators[particle.generatorIndex[1]].noise2D(0, particle.age * frequency) * power * positionAmount, generators[particle.generatorIndex[2]].noise2D(0, particle.age * frequency) * power * positionAmount);
      particle.position.add(tempV$1);
      particle.lastPosNoise.copy(tempV$1);
    }
    if (rotationAmount > 0 && particle.lastRotNoise !== void 0) {
      if (typeof particle.rotation === "number") {
        particle.rotation -= particle.lastRotNoise;
        particle.rotation += generators[particle.generatorIndex[3]].noise2D(0, particle.age * frequency) * Math.PI * power * rotationAmount;
      } else {
        particle.lastRotNoise.invert();
        particle.rotation.multiply(particle.lastRotNoise);
        tempQ$1.set(generators[particle.generatorIndex[0]].noise2D(0, particle.age * frequency) * power * rotationAmount, generators[particle.generatorIndex[1]].noise2D(0, particle.age * frequency) * power * rotationAmount, generators[particle.generatorIndex[2]].noise2D(0, particle.age * frequency) * power * rotationAmount, generators[particle.generatorIndex[3]].noise2D(0, particle.age * frequency) * power * rotationAmount).normalize();
        particle.rotation.multiply(tempQ$1);
        particle.lastRotNoise.copy(tempQ$1);
      }
    }
  }
  toJSON() {
    return {
      type: this.type,
      frequency: this.frequency.toJSON(),
      power: this.power.toJSON(),
      positionAmount: this.positionAmount.toJSON(),
      rotationAmount: this.rotationAmount.toJSON()
    };
  }
  frameUpdate(delta) {
    this.duration += delta;
  }
  static fromJSON(json) {
    return new Noise(ValueGeneratorFromJSON(json.frequency), ValueGeneratorFromJSON(json.power), ValueGeneratorFromJSON(json.positionAmount), ValueGeneratorFromJSON(json.rotationAmount));
  }
  clone() {
    return new Noise(this.frequency.clone(), this.power.clone(), this.positionAmount.clone(), this.rotationAmount.clone());
  }
  reset() {
  }
}
class ColorBySpeed {
  constructor(color, speedRange) {
    this.color = color;
    this.speedRange = speedRange;
    this.type = "ColorBySpeed";
  }
  initialize(particle) {
    this.color.startGen(particle.memory);
  }
  update(particle, delta) {
    const t = (particle.startSpeed - this.speedRange.a) / (this.speedRange.b - this.speedRange.a);
    this.color.genColor(particle.memory, particle.color, t);
    particle.color.x *= particle.startColor.x;
    particle.color.y *= particle.startColor.y;
    particle.color.z *= particle.startColor.z;
    particle.color.w *= particle.startColor.w;
  }
  frameUpdate(delta) {
  }
  toJSON() {
    return {
      type: this.type,
      color: this.color.toJSON(),
      speedRange: this.speedRange.toJSON()
    };
  }
  static fromJSON(json) {
    return new ColorBySpeed(ColorGeneratorFromJSON(json.color), IntervalValue.fromJSON(json.speedRange));
  }
  clone() {
    return new ColorBySpeed(this.color.clone(), this.speedRange.clone());
  }
  reset() {
  }
}
class SizeBySpeed {
  initialize(particle) {
    this.size.startGen(particle.memory);
  }
  constructor(size, speedRange) {
    this.size = size;
    this.speedRange = speedRange;
    this.type = "SizeBySpeed";
  }
  update(particle) {
    const t = (particle.startSpeed - this.speedRange.a) / (this.speedRange.b - this.speedRange.a);
    if (this.size instanceof Vector3Function) {
      this.size.genValue(particle.memory, particle.size, t).multiply(particle.startSize);
    } else {
      particle.size.copy(particle.startSize).multiplyScalar(this.size.genValue(particle.memory, t));
    }
  }
  toJSON() {
    return {
      type: this.type,
      size: this.size.toJSON(),
      speedRange: this.speedRange.toJSON()
    };
  }
  static fromJSON(json) {
    return new SizeBySpeed(GeneratorFromJSON(json.size), IntervalValue.fromJSON(json.speedRange));
  }
  frameUpdate(delta) {
  }
  clone() {
    return new SizeBySpeed(this.size.clone(), this.speedRange.clone());
  }
  reset() {
  }
}
class RotationBySpeed {
  constructor(angularVelocity, speedRange) {
    this.angularVelocity = angularVelocity;
    this.speedRange = speedRange;
    this.type = "RotationBySpeed";
    this.tempQuat = new Quaternion();
  }
  initialize(particle) {
    if (typeof particle.rotation === "number") {
      this.angularVelocity.startGen(particle.memory);
    }
  }
  update(particle, delta) {
    if (typeof particle.rotation === "number") {
      const t = (particle.startSpeed - this.speedRange.a) / (this.speedRange.b - this.speedRange.a);
      particle.rotation += delta * this.angularVelocity.genValue(particle.memory, t);
    }
  }
  toJSON() {
    return {
      type: this.type,
      angularVelocity: this.angularVelocity.toJSON(),
      speedRange: this.speedRange.toJSON()
    };
  }
  static fromJSON(json) {
    return new RotationBySpeed(ValueGeneratorFromJSON(json.angularVelocity), IntervalValue.fromJSON(json.speedRange));
  }
  frameUpdate(delta) {
  }
  clone() {
    return new RotationBySpeed(this.angularVelocity.clone(), this.speedRange.clone());
  }
  reset() {
  }
}
class LimitSpeedOverLife {
  initialize(particle) {
    this.speed.startGen(particle.memory);
  }
  constructor(speed, dampen) {
    this.speed = speed;
    this.dampen = dampen;
    this.type = "LimitSpeedOverLife";
  }
  update(particle, delta) {
    let speed = particle.velocity.length();
    let limit = this.speed.genValue(particle.memory, particle.age / particle.life);
    if (speed > limit) {
      const percent = (speed - limit) / speed;
      particle.velocity.multiplyScalar(1 - percent * this.dampen * delta * 20);
    }
  }
  toJSON() {
    return {
      type: this.type,
      speed: this.speed.toJSON(),
      dampen: this.dampen
    };
  }
  static fromJSON(json) {
    return new LimitSpeedOverLife(ValueGeneratorFromJSON(json.speed), json.dampen);
  }
  frameUpdate(delta) {
  }
  clone() {
    return new LimitSpeedOverLife(this.speed.clone(), this.dampen);
  }
  reset() {
  }
}
const BehaviorTypes = {
  ApplyForce: {
    type: "ApplyForce",
    constructor: ApplyForce,
    params: [
      ["direction", ["vec3"]],
      ["magnitude", ["value"]]
    ],
    loadJSON: ApplyForce.fromJSON
  },
  Noise: {
    type: "Noise",
    constructor: Noise,
    params: [
      ["frequency", ["value"]],
      ["power", ["value"]],
      ["positionAmount", ["value"]],
      ["rotationAmount", ["value"]]
    ],
    loadJSON: Noise.fromJSON
  },
  TurbulenceField: {
    type: "TurbulenceField",
    constructor: TurbulenceField,
    params: [
      ["scale", ["vec3"]],
      ["octaves", ["number"]],
      ["velocityMultiplier", ["vec3"]],
      ["timeScale", ["vec3"]]
    ],
    loadJSON: TurbulenceField.fromJSON
  },
  GravityForce: {
    type: "GravityForce",
    constructor: GravityForce,
    params: [
      ["center", ["vec3"]],
      ["magnitude", ["number"]]
    ],
    loadJSON: GravityForce.fromJSON
  },
  ColorOverLife: {
    type: "ColorOverLife",
    constructor: ColorOverLife,
    params: [["color", ["colorFunc"]]],
    loadJSON: ColorOverLife.fromJSON
  },
  RotationOverLife: {
    type: "RotationOverLife",
    constructor: RotationOverLife,
    params: [["angularVelocity", ["value", "valueFunc"]]],
    loadJSON: RotationOverLife.fromJSON
  },
  Rotation3DOverLife: {
    type: "Rotation3DOverLife",
    constructor: Rotation3DOverLife,
    params: [["angularVelocity", ["rotationFunc"]]],
    loadJSON: Rotation3DOverLife.fromJSON
  },
  SizeOverLife: {
    type: "SizeOverLife",
    constructor: SizeOverLife,
    params: [["size", ["value", "valueFunc", "vec3Func"]]],
    loadJSON: SizeOverLife.fromJSON
  },
  ColorBySpeed: {
    type: "ColorBySpeed",
    constructor: ColorBySpeed,
    params: [
      ["color", ["colorFunc"]],
      ["speedRange", ["range"]]
    ],
    loadJSON: ColorBySpeed.fromJSON
  },
  RotationBySpeed: {
    type: "RotationBySpeed",
    constructor: RotationBySpeed,
    params: [
      ["angularVelocity", ["value", "valueFunc"]],
      ["speedRange", ["range"]]
    ],
    loadJSON: RotationBySpeed.fromJSON
  },
  SizeBySpeed: {
    type: "SizeBySpeed",
    constructor: SizeBySpeed,
    params: [
      ["size", ["value", "valueFunc", "vec3Func"]],
      ["speedRange", ["range"]]
    ],
    loadJSON: SizeBySpeed.fromJSON
  },
  SpeedOverLife: {
    type: "SpeedOverLife",
    constructor: SpeedOverLife,
    params: [["speed", ["value", "valueFunc"]]],
    loadJSON: SpeedOverLife.fromJSON
  },
  FrameOverLife: {
    type: "FrameOverLife",
    constructor: FrameOverLife,
    params: [["frame", ["value", "valueFunc"]]],
    loadJSON: FrameOverLife.fromJSON
  },
  ForceOverLife: {
    type: "ForceOverLife",
    constructor: ForceOverLife,
    params: [
      ["x", ["value", "valueFunc"]],
      ["y", ["value", "valueFunc"]],
      ["z", ["value", "valueFunc"]]
    ],
    loadJSON: ForceOverLife.fromJSON
  },
  OrbitOverLife: {
    type: "OrbitOverLife",
    constructor: OrbitOverLife,
    params: [
      ["orbitSpeed", ["value", "valueFunc"]],
      ["axis", ["vec3"]]
    ],
    loadJSON: OrbitOverLife.fromJSON
  },
  WidthOverLength: {
    type: "WidthOverLength",
    constructor: WidthOverLength,
    params: [["width", ["value", "valueFunc"]]],
    loadJSON: WidthOverLength.fromJSON
  },
  ChangeEmitDirection: {
    type: "ChangeEmitDirection",
    constructor: ChangeEmitDirection,
    params: [["angle", ["value"]]],
    loadJSON: ChangeEmitDirection.fromJSON
  },
  EmitSubParticleSystem: {
    type: "EmitSubParticleSystem",
    constructor: EmitSubParticleSystem,
    params: [
      ["particleSystem", ["self"]],
      ["useVelocityAsBasis", ["boolean"]],
      ["subParticleSystem", ["particleSystem"]],
      ["mode", ["number"]],
      ["emitProbability", ["number"]]
    ],
    loadJSON: EmitSubParticleSystem.fromJSON
  },
  LimitSpeedOverLife: {
    type: "LimitSpeedOverLife",
    constructor: LimitSpeedOverLife,
    params: [
      ["speed", ["value", "valueFunc"]],
      ["dampen", ["number"]]
    ],
    loadJSON: LimitSpeedOverLife.fromJSON
  }
};
function BehaviorFromJSON(json, particleSystem) {
  if (BehaviorTypes[json.type]) {
    return BehaviorTypes[json.type].loadJSON(json, particleSystem);
  }
  return null;
}
const Plugins = [];
function loadPlugin(plugin) {
  const existing = Plugins.find((item) => item.id === plugin.id);
  if (!existing) {
    for (const emitterShape of plugin.emitterShapes) {
      if (!EmitterShapes[emitterShape.type]) {
        EmitterShapes[emitterShape.type] = emitterShape;
      }
    }
    for (const behavior of plugin.behaviors) {
      if (!BehaviorTypes[behavior.type]) {
        BehaviorTypes[behavior.type] = behavior;
      }
    }
  }
}
class MeshSurfaceEmitter {
  get geometry() {
    return this._geometry;
  }
  set geometry(geometry) {
    this._geometry = geometry;
    if (geometry === void 0) {
      return;
    }
    if (typeof geometry === "string") {
      return;
    }
    const tri = new Triangle();
    this._triangleIndexToArea.length = 0;
    let area = 0;
    if (!geometry.getIndex()) {
      return;
    }
    const array = geometry.getIndex().array;
    const triCount = array.length / 3;
    this._triangleIndexToArea.push(0);
    for (let i = 0; i < triCount; i++) {
      tri.setFromAttributeAndIndices(geometry.getAttribute("position"), array[i * 3], array[i * 3 + 1], array[i * 3 + 2]);
      area += tri.getArea();
      this._triangleIndexToArea.push(area);
    }
    geometry.userData.triangleIndexToArea = this._triangleIndexToArea;
  }
  constructor(geometry) {
    this.type = "mesh_surface";
    this._triangleIndexToArea = [];
    this._tempA = new Vector3$1();
    this._tempB = new Vector3$1();
    this._tempC = new Vector3$1();
    if (!geometry) {
      return;
    }
    this.geometry = geometry;
  }
  initialize(p) {
    const geometry = this._geometry;
    if (!geometry || geometry.getIndex() === null) {
      p.position.set(0, 0, 0);
      p.velocity.set(0, 0, 1).multiplyScalar(p.startSpeed);
      return;
    }
    const triCount = this._triangleIndexToArea.length - 1;
    let left = 0, right = triCount;
    const target = Math.random() * this._triangleIndexToArea[triCount];
    while (left + 1 < right) {
      const mid = Math.floor((left + right) / 2);
      if (target < this._triangleIndexToArea[mid]) {
        right = mid;
      } else {
        left = mid;
      }
    }
    let u1 = Math.random();
    let u2 = Math.random();
    if (u1 + u2 > 1) {
      u1 = 1 - u1;
      u2 = 1 - u2;
    }
    const index1 = geometry.getIndex().array[left * 3];
    const index2 = geometry.getIndex().array[left * 3 + 1];
    const index3 = geometry.getIndex().array[left * 3 + 2];
    const positionBuffer = geometry.getAttribute("position");
    this._tempA.fromBufferAttribute(positionBuffer, index1);
    this._tempB.fromBufferAttribute(positionBuffer, index2);
    this._tempC.fromBufferAttribute(positionBuffer, index3);
    this._tempB.sub(this._tempA);
    this._tempC.sub(this._tempA);
    this._tempA.addScaledVector(this._tempB, u1).addScaledVector(this._tempC, u2);
    p.position.copy(this._tempA);
    this._tempA.copy(this._tempB).cross(this._tempC).normalize();
    p.velocity.copy(this._tempA).normalize().multiplyScalar(p.startSpeed);
  }
  toJSON() {
    return {
      type: "mesh_surface",
      mesh: this._geometry ? this._geometry.uuid : ""
    };
  }
  static fromJSON(json, meta) {
    return new MeshSurfaceEmitter(meta.geometries[json.geometry]);
  }
  clone() {
    return new MeshSurfaceEmitter(this._geometry);
  }
  update(system, delta) {
  }
}
const MeshSurfaceEmitterPlugin = {
  id: "three.quarks",
  emitterShapes: [{
    type: "mesh_surface",
    params: [["geometry", ["geometry"]]],
    constructor: MeshSurfaceEmitter,
    loadJSON: MeshSurfaceEmitter.fromJSON
  }],
  behaviors: []
};
var soft_fragment = `
#ifdef SOFT_PARTICLES

    /* #ifdef LOGDEPTH
    float distSample = linearize_depth_log(sampleDepth, near, far);
    #else
    float distSample = ortho ? linearize_depth_ortho(sampleDepth, near, far) : linearize_depth(sampleDepth, near, far);
    #endif */

    vec2 p2 = projPosition.xy / projPosition.w;
    
    p2 = 0.5 * p2 + 0.5;

    float readDepth = texture2D(depthTexture, p2.xy).r;
    float viewDepth = linearize_depth(readDepth);

    float softParticlesFade = saturate(SOFT_INV_FADE_DISTANCE * ((viewDepth - SOFT_NEAR_FADE) - linearDepth));
    
    gl_FragColor *= softParticlesFade;

    //gl_FragColor = vec4(softParticlesFade , 0, 0, 1);
#endif
`;
var soft_pars_fragment = `
#ifdef SOFT_PARTICLES

    uniform sampler2D depthTexture;
    uniform vec4 projParams;
    uniform vec2 softParams;

    varying vec4 projPosition;
    varying float linearDepth;

    #define SOFT_NEAR_FADE softParams.x
    #define SOFT_INV_FADE_DISTANCE softParams.y

    #define zNear projParams.x
    #define zFar projParams.y

    float linearize_depth(float d)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }

#endif
`;
var soft_pars_vertex = `
#ifdef SOFT_PARTICLES
    varying vec4 projPosition;
    varying float linearDepth;
#endif
`;
var soft_vertex = `
#ifdef SOFT_PARTICLES
    projPosition = gl_Position;
    linearDepth = -mvPosition.z;
#endif
`;
var tile_fragment = `
#ifdef USE_MAP
    vec4 texelColor = texture2D( map, vUv);
    #ifdef TILE_BLEND
        texelColor = mix( texelColor, texture2D( map, vUvNext ), vUvBlend );
    #endif
    diffuseColor *= texelColor;
#endif
`;
var tile_pars_fragment = `
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;
#ifdef TILE_BLEND
    varying vec2 vUvNext;
    varying float vUvBlend;
#endif

#endif
#ifdef USE_MAP

	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#ifdef TILE_BLEND
    varying vec2 vMapUvNext;
#endif

#endif
#ifdef USE_ALPHAMAP

	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;

#endif
#ifdef USE_LIGHTMAP

	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;

#endif
#ifdef USE_AOMAP

	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;

#endif
#ifdef USE_BUMPMAP

	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;

#endif
#ifdef USE_NORMALMAP

	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;

#endif
#ifdef USE_DISPLACEMENTMAP

	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;

#endif
#ifdef USE_EMISSIVEMAP

	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;

#endif
#ifdef USE_METALNESSMAP

	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;

#endif
#ifdef USE_ROUGHNESSMAP

	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;

#endif
#ifdef USE_ANISOTROPYMAP

	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;

#endif
#ifdef USE_CLEARCOATMAP

	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;

#endif
#ifdef USE_SHEEN_COLORMAP

	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;

#endif
#ifdef USE_IRIDESCENCEMAP

	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;

#endif
#ifdef USE_SPECULARMAP

	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;

#endif
#ifdef USE_SPECULAR_COLORMAP

	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;

#endif
#ifdef USE_TRANSMISSIONMAP

	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;

#endif
#ifdef USE_THICKNESSMAP

	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;

#endif
`;
var tile_pars_vertex = `
#ifdef UV_TILE
    attribute float uvTile;
    uniform vec2 tileCount;
    
    mat3 makeTileTransform(float uvTile) {
        float col = mod(uvTile, tileCount.x);
        float row = (tileCount.y - floor(uvTile / tileCount.x) - 1.0);
        
        return mat3(
          1.0 / tileCount.x, 0.0, 0.0,
          0.0, 1.0 / tileCount.y, 0.0, 
          col / tileCount.x, row / tileCount.y, 1.0);
    }
#else
    mat3 makeTileTransform(float uvTile) {
        return mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
    }
#endif

#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;
#ifdef TILE_BLEND
    varying vec2 vUvNext;
    varying float vUvBlend;
#endif

#endif
#ifdef USE_MAP

	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#ifdef TILE_BLEND
    varying vec2 vMapUvNext;
#endif

#endif
#ifdef USE_ALPHAMAP

	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;

#endif
#ifdef USE_LIGHTMAP

	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;

#endif
#ifdef USE_AOMAP

	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;

#endif
#ifdef USE_BUMPMAP

	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;

#endif
#ifdef USE_NORMALMAP

	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;

#endif
#ifdef USE_DISPLACEMENTMAP

	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;

#endif
#ifdef USE_EMISSIVEMAP

	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;

#endif
#ifdef USE_METALNESSMAP

	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;

#endif
#ifdef USE_ROUGHNESSMAP

	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;

#endif
#ifdef USE_ANISOTROPYMAP

	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;

#endif
#ifdef USE_CLEARCOATMAP

	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;

#endif
#ifdef USE_SHEEN_COLORMAP

	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;

#endif
#ifdef USE_IRIDESCENCEMAP

	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;

#endif
#ifdef USE_SPECULARMAP

	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;

#endif
#ifdef USE_SPECULAR_COLORMAP

	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;

#endif
#ifdef USE_TRANSMISSIONMAP

	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;

#endif
#ifdef USE_THICKNESSMAP

	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;

#endif
`;
var tile_vertex = `
#ifdef UV_TILE
    mat3 tileTransform = makeTileTransform(floor(uvTile));
    #ifdef TILE_BLEND
        mat3 nextTileTransform = makeTileTransform(ceil(uvTile));
        vUvBlend = fract(uvTile);
    #endif
#else
    mat3 tileTransform = makeTileTransform(0.0);
#endif

#if defined( USE_UV ) || defined( USE_ANISOTROPY )

vUv = (tileTransform *vec3( uv, 1 )).xy;
#if defined( TILE_BLEND ) && defined( UV_TILE )
    vUvNext = (nextTileTransform *vec3( uv, 1 )).xy;
#endif

#endif
#ifdef USE_MAP

vMapUv = ( tileTransform * (mapTransform * vec3( MAP_UV, 1 ) )).xy;
#if defined( TILE_BLEND ) && defined( UV_TILE )
    vMapUvNext = (nextTileTransform * (mapTransform * vec3( MAP_UV, 1 ))).xy;
#endif

#endif
#ifdef USE_ALPHAMAP

vAlphaMapUv = ( tileTransform * (alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) )).xy;
    
#endif
#ifdef USE_LIGHTMAP

vLightMapUv = ( tileTransform * (lightMapTransform * vec3( LIGHTMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_AOMAP

vAoMapUv = ( tileTransform * (aoMapTransform * vec3( AOMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_BUMPMAP

vBumpMapUv = ( tileTransform * (bumpMapTransform * vec3( BUMPMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_NORMALMAP

vNormalMapUv = ( tileTransform * (normalMapTransform * vec3( NORMALMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_DISPLACEMENTMAP

vDisplacementMapUv = ( tileTransform * (displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_EMISSIVEMAP

vEmissiveMapUv = ( tileTransform * (emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_METALNESSMAP

vMetalnessMapUv = ( tileTransform * (metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_ROUGHNESSMAP

vRoughnessMapUv = ( tileTransform * (roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_ANISOTROPYMAP

vAnisotropyMapUv = ( tileTransform * (anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOATMAP

vClearcoatMapUv = ( tileTransform * (clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

vClearcoatNormalMapUv = ( tileTransform * (clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

vClearcoatRoughnessMapUv = ( tileTransform * (clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_IRIDESCENCEMAP

vIridescenceMapUv = ( tileTransform * (iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

vIridescenceThicknessMapUv = ( tileTransform * (iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SHEEN_COLORMAP

vSheenColorMapUv = ( tileTransform * (sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

vSheenRoughnessMapUv = ( tileTransform * (sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULARMAP

vSpecularMapUv = ( tileTransform * (specularMapTransform * vec3( SPECULARMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULAR_COLORMAP

vSpecularColorMapUv = ( tileTransform * (specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

vSpecularIntensityMapUv = ( tileTransform * (specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_TRANSMISSIONMAP

vTransmissionMapUv = ( tileTransform * transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_THICKNESSMAP

vThicknessMapUv = ( tileTransform * thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) )).xy;

#endif

`;
const ShaderChunk = ShaderChunk$1;
function registerShaderChunks() {
  ShaderChunk["tile_pars_vertex"] = tile_pars_vertex;
  ShaderChunk["tile_vertex"] = tile_vertex;
  ShaderChunk["tile_pars_fragment"] = tile_pars_fragment;
  ShaderChunk["tile_fragment"] = tile_fragment;
  ShaderChunk["soft_pars_vertex"] = soft_pars_vertex;
  ShaderChunk["soft_vertex"] = soft_vertex;
  ShaderChunk["soft_pars_fragment"] = soft_pars_fragment;
  ShaderChunk["soft_fragment"] = soft_fragment;
}
class ParticleEmitter extends Object3D {
  constructor(system) {
    super();
    this.type = "ParticleEmitter";
    this.system = system;
  }
  clone() {
    const system = this.system.clone();
    system.emitter.copy(this, true);
    return system.emitter;
  }
  dispose() {
  }
  extractFromCache(cache) {
    const values = [];
    for (const key in cache) {
      const data = cache[key];
      delete data.metadata;
      values.push(data);
    }
    return values;
  }
  toJSON(meta, options = {}) {
    const children = this.children;
    this.children = this.children.filter((child) => child.type !== "ParticleSystemPreview");
    const data = super.toJSON(meta);
    this.children = children;
    if (this.system !== null)
      data.object.ps = this.system.toJSON(meta, options);
    return data;
  }
}
var RenderMode;
(function(RenderMode2) {
  RenderMode2[RenderMode2["BillBoard"] = 0] = "BillBoard";
  RenderMode2[RenderMode2["StretchedBillBoard"] = 1] = "StretchedBillBoard";
  RenderMode2[RenderMode2["Mesh"] = 2] = "Mesh";
  RenderMode2[RenderMode2["Trail"] = 3] = "Trail";
  RenderMode2[RenderMode2["HorizontalBillBoard"] = 4] = "HorizontalBillBoard";
  RenderMode2[RenderMode2["VerticalBillBoard"] = 5] = "VerticalBillBoard";
})(RenderMode || (RenderMode = {}));
class VFXBatch extends Mesh {
  constructor(settings) {
    super();
    this.type = "VFXBatch";
    this.maxParticles = 1e3;
    this.systems = /* @__PURE__ */ new Set();
    const layers = new Layers();
    layers.mask = settings.layers.mask;
    const newMat = settings.material.clone();
    newMat.defines = {};
    Object.assign(newMat.defines, settings.material.defines);
    this.settings = {
      instancingGeometry: settings.instancingGeometry,
      renderMode: settings.renderMode,
      renderOrder: settings.renderOrder,
      material: newMat,
      uTileCount: settings.uTileCount,
      vTileCount: settings.vTileCount,
      blendTiles: settings.blendTiles,
      softParticles: settings.softParticles,
      softNearFade: settings.softNearFade,
      softFarFade: settings.softFarFade,
      layers
    };
    this.frustumCulled = false;
    this.renderOrder = this.settings.renderOrder;
  }
  addSystem(system) {
    this.systems.add(system);
  }
  removeSystem(system) {
    this.systems.delete(system);
  }
  applyDepthTexture(depthTexture) {
    const uniform = this.material.uniforms["depthTexture"];
    if (uniform) {
      if (uniform.value !== depthTexture) {
        uniform.value = depthTexture;
        this.material.needsUpdate = true;
      }
    }
  }
  getVisibleSystems() {
    return Array.from(this.systems).filter((system) => system.emitter.visible);
  }
}
const UP = new Vector3(0, 0, 1);
const tempQ = new Quaternion();
const tempV = new Vector3();
const tempV2 = new Vector3();
new Vector3();
const PREWARM_FPS = 60;
const DEFAULT_GEOMETRY = new PlaneGeometry(1, 1, 1, 1);
class ParticleSystem {
  set time(time) {
    this.emissionState.time = time;
  }
  get time() {
    return this.emissionState.time;
  }
  get layers() {
    return this.rendererSettings.layers;
  }
  get texture() {
    return this.rendererSettings.material.map;
  }
  set texture(texture) {
    this.rendererSettings.material.map = texture;
    this.neededToUpdateRender = true;
  }
  get material() {
    return this.rendererSettings.material;
  }
  set material(material) {
    this.rendererSettings.material = material;
    this.neededToUpdateRender = true;
  }
  get uTileCount() {
    return this.rendererSettings.uTileCount;
  }
  set uTileCount(u) {
    this.rendererSettings.uTileCount = u;
    this.neededToUpdateRender = true;
  }
  get vTileCount() {
    return this.rendererSettings.vTileCount;
  }
  set vTileCount(v) {
    this.rendererSettings.vTileCount = v;
    this.neededToUpdateRender = true;
  }
  get blendTiles() {
    return this.rendererSettings.blendTiles;
  }
  set blendTiles(v) {
    this.rendererSettings.blendTiles = v;
    this.neededToUpdateRender = true;
  }
  get softParticles() {
    return this.rendererSettings.softParticles;
  }
  set softParticles(v) {
    this.rendererSettings.softParticles = v;
    this.neededToUpdateRender = true;
  }
  get softNearFade() {
    return this.rendererSettings.softNearFade;
  }
  set softNearFade(v) {
    this.rendererSettings.softNearFade = v;
    this.neededToUpdateRender = true;
  }
  get softFarFade() {
    return this.rendererSettings.softFarFade;
  }
  set softFarFade(v) {
    this.rendererSettings.softFarFade = v;
    this.neededToUpdateRender = true;
  }
  get instancingGeometry() {
    return this.rendererSettings.instancingGeometry;
  }
  set instancingGeometry(geometry) {
    this.restart();
    this.particles.length = 0;
    this.rendererSettings.instancingGeometry = geometry;
    this.neededToUpdateRender = true;
  }
  get renderMode() {
    return this.rendererSettings.renderMode;
  }
  set renderMode(renderMode) {
    if (this.rendererSettings.renderMode !== renderMode) {
      let needRestart = false;
      if (this.rendererSettings.renderMode === RenderMode.Trail) {
        needRestart = true;
      }
      if (this.rendererSettings.renderMode === RenderMode.Mesh) {
        this.startRotation = new ConstantValue(0);
      }
      switch (renderMode) {
        case RenderMode.Trail:
          this.rendererEmitterSettings = {
            startLength: new ConstantValue(30),
            followLocalOrigin: false
          };
          needRestart = true;
          break;
        case RenderMode.Mesh:
          this.rendererEmitterSettings = {
            geometry: DEFAULT_GEOMETRY
          };
          this.startRotation = new AxisAngleGenerator(new Vector3(0, 1, 0), new ConstantValue(0));
          break;
        case RenderMode.StretchedBillBoard:
          this.rendererEmitterSettings = { speedFactor: 0, lengthFactor: 2 };
          this.rendererSettings.instancingGeometry = DEFAULT_GEOMETRY;
          break;
        case RenderMode.BillBoard:
        case RenderMode.VerticalBillBoard:
        case RenderMode.HorizontalBillBoard:
          this.rendererEmitterSettings = {};
          this.rendererSettings.instancingGeometry = DEFAULT_GEOMETRY;
          break;
      }
      this.rendererSettings.renderMode = renderMode;
      if (needRestart) {
        this.restart();
        this.particles.length = 0;
      }
      this.neededToUpdateRender = true;
    }
  }
  get renderOrder() {
    return this.rendererSettings.renderOrder;
  }
  set renderOrder(renderOrder) {
    this.rendererSettings.renderOrder = renderOrder;
    this.neededToUpdateRender = true;
  }
  get blending() {
    return this.rendererSettings.material.blending;
  }
  set blending(blending) {
    this.rendererSettings.material.blending = blending;
    this.neededToUpdateRender = true;
  }
  constructor(parameters) {
    this.temp = new Vector3();
    this.travelDistance = 0;
    this.normalMatrix = new Matrix3();
    this.memory = [];
    this.listeners = {};
    this.firstTimeUpdate = true;
    this.autoDestroy = parameters.autoDestroy === void 0 ? false : parameters.autoDestroy;
    this.duration = parameters.duration ?? 1;
    this.looping = parameters.looping === void 0 ? true : parameters.looping;
    this.prewarm = parameters.prewarm === void 0 ? false : parameters.prewarm;
    this.startLife = parameters.startLife ?? new ConstantValue(5);
    this.startSpeed = parameters.startSpeed ?? new ConstantValue(0);
    this.startRotation = parameters.startRotation ?? new ConstantValue(0);
    this.startSize = parameters.startSize ?? new ConstantValue(1);
    this.startColor = parameters.startColor ?? new ConstantColor(new Vector4(1, 1, 1, 1));
    this.emissionOverTime = parameters.emissionOverTime ?? new ConstantValue(10);
    this.emissionOverDistance = parameters.emissionOverDistance ?? new ConstantValue(0);
    this.emissionBursts = parameters.emissionBursts ?? [];
    this.onlyUsedByOther = parameters.onlyUsedByOther ?? false;
    this.emitterShape = parameters.shape ?? new SphereEmitter();
    this.behaviors = parameters.behaviors ?? new Array();
    this.worldSpace = parameters.worldSpace ?? false;
    this.rendererEmitterSettings = parameters.rendererEmitterSettings ?? {};
    if (parameters.renderMode === RenderMode.StretchedBillBoard) {
      const stretchedBillboardSettings = this.rendererEmitterSettings;
      if (parameters.speedFactor !== void 0) {
        stretchedBillboardSettings.speedFactor = parameters.speedFactor;
      }
      stretchedBillboardSettings.speedFactor = stretchedBillboardSettings.speedFactor ?? 0;
      stretchedBillboardSettings.lengthFactor = stretchedBillboardSettings.lengthFactor ?? 0;
    }
    this.rendererSettings = {
      instancingGeometry: parameters.instancingGeometry ?? DEFAULT_GEOMETRY,
      renderMode: parameters.renderMode ?? RenderMode.BillBoard,
      renderOrder: parameters.renderOrder ?? 0,
      material: parameters.material,
      uTileCount: parameters.uTileCount ?? 1,
      vTileCount: parameters.vTileCount ?? 1,
      blendTiles: parameters.blendTiles ?? false,
      softParticles: parameters.softParticles ?? false,
      softNearFade: parameters.softNearFade ?? 0,
      softFarFade: parameters.softFarFade ?? 0,
      layers: parameters.layers ?? new Layers()
    };
    this.neededToUpdateRender = true;
    this.particles = new Array();
    this.startTileIndex = parameters.startTileIndex || new ConstantValue(0);
    this.emitter = new ParticleEmitter(this);
    this.paused = false;
    this.particleNum = 0;
    this.emissionState = {
      isBursting: false,
      burstParticleIndex: 0,
      burstParticleCount: 0,
      burstIndex: 0,
      burstWaveIndex: 0,
      time: 0,
      waitEmiting: 0,
      travelDistance: 0
    };
    this.emissionBursts.forEach((burst) => burst.count.startGen(this.memory));
    this.emissionOverDistance.startGen(this.memory);
    this.emitEnded = false;
    this.markForDestroy = false;
    this.prewarmed = false;
  }
  pause() {
    this.paused = true;
  }
  play() {
    this.paused = false;
  }
  stop() {
    this.restart();
    this.pause();
  }
  spawn(count, emissionState, matrix) {
    tempQ.setFromRotationMatrix(matrix);
    const translation = tempV;
    const quaternion = tempQ;
    const scale = tempV2;
    matrix.decompose(translation, quaternion, scale);
    for (let i = 0; i < count; i++) {
      emissionState.burstParticleIndex = i;
      this.particleNum++;
      while (this.particles.length < this.particleNum) {
        if (this.rendererSettings.renderMode === RenderMode.Trail) {
          this.particles.push(new TrailParticle());
        } else {
          this.particles.push(new SpriteParticle());
        }
      }
      const particle = this.particles[this.particleNum - 1];
      particle.reset();
      particle.speedModifier = 1;
      this.startColor.startGen(particle.memory);
      this.startColor.genColor(particle.memory, particle.startColor, this.emissionState.time);
      particle.color.copy(particle.startColor);
      this.startSpeed.startGen(particle.memory);
      particle.startSpeed = this.startSpeed.genValue(particle.memory, emissionState.time / this.duration);
      this.startLife.startGen(particle.memory);
      particle.life = this.startLife.genValue(particle.memory, emissionState.time / this.duration);
      particle.age = 0;
      this.startSize.startGen(particle.memory);
      if (this.startSize.type === "vec3function") {
        this.startSize.genValue(particle.memory, particle.startSize, emissionState.time / this.duration);
      } else {
        const size = this.startSize.genValue(particle.memory, emissionState.time / this.duration);
        particle.startSize.set(size, size, size);
      }
      this.startTileIndex.startGen(particle.memory);
      particle.uvTile = this.startTileIndex.genValue(particle.memory);
      particle.size.copy(particle.startSize);
      if (this.rendererSettings.renderMode === RenderMode.Mesh || this.rendererSettings.renderMode === RenderMode.BillBoard || this.rendererSettings.renderMode === RenderMode.VerticalBillBoard || this.rendererSettings.renderMode === RenderMode.HorizontalBillBoard || this.rendererSettings.renderMode === RenderMode.StretchedBillBoard) {
        const sprite = particle;
        this.startRotation.startGen(particle.memory);
        if (this.rendererSettings.renderMode === RenderMode.Mesh) {
          if (!(sprite.rotation instanceof Quaternion)) {
            sprite.rotation = new Quaternion();
          }
          if (this.startRotation.type === "rotation") {
            this.startRotation.genValue(particle.memory, sprite.rotation, 1, emissionState.time / this.duration);
          } else {
            sprite.rotation.setFromAxisAngle(UP, this.startRotation.genValue(sprite.memory, emissionState.time / this.duration));
          }
        } else {
          if (this.startRotation.type === "rotation") {
            sprite.rotation = 0;
          } else {
            sprite.rotation = this.startRotation.genValue(sprite.memory, emissionState.time / this.duration);
          }
        }
      } else if (this.rendererSettings.renderMode === RenderMode.Trail) {
        const trail = particle;
        this.rendererEmitterSettings.startLength.startGen(trail.memory);
        trail.length = this.rendererEmitterSettings.startLength.genValue(trail.memory, emissionState.time / this.duration);
      }
      this.emitterShape.initialize(particle, emissionState);
      if (this.rendererSettings.renderMode === RenderMode.Trail && this.rendererEmitterSettings.followLocalOrigin) {
        const trail = particle;
        trail.localPosition = new Vector3().copy(trail.position);
      }
      if (this.worldSpace) {
        particle.position.applyMatrix4(matrix);
        particle.startSize.multiply(scale).abs();
        particle.size.copy(particle.startSize);
        particle.velocity.multiply(scale).applyMatrix3(this.normalMatrix);
        if (particle.rotation && particle.rotation instanceof Quaternion) {
          particle.rotation.multiplyQuaternions(tempQ, particle.rotation);
        }
      } else {
        if (this.onlyUsedByOther) {
          particle.parentMatrix = matrix;
        }
      }
      for (let j = 0; j < this.behaviors.length; j++) {
        this.behaviors[j].initialize(particle, this);
      }
    }
  }
  endEmit() {
    this.emitEnded = true;
    if (this.autoDestroy) {
      this.markForDestroy = true;
    }
    this.fire({ type: "emitEnd", particleSystem: this });
  }
  dispose() {
    if (this._renderer)
      this._renderer.deleteSystem(this);
    this.emitter.dispose();
    if (this.emitter.parent)
      this.emitter.parent.remove(this.emitter);
    this.fire({ type: "destroy", particleSystem: this });
  }
  restart() {
    this.memory.length = 0;
    this.paused = false;
    this.particleNum = 0;
    this.emissionState.isBursting = false;
    this.emissionState.burstIndex = 0;
    this.emissionState.burstWaveIndex = 0;
    this.emissionState.time = 0;
    this.emissionState.waitEmiting = 0;
    this.behaviors.forEach((behavior) => {
      behavior.reset();
    });
    this.emitEnded = false;
    this.markForDestroy = false;
    this.prewarmed = false;
    this.emissionBursts.forEach((burst) => burst.count.startGen(this.memory));
    this.emissionOverDistance.startGen(this.memory);
  }
  update(delta) {
    if (this.paused)
      return;
    let currentParent = this.emitter;
    while (currentParent.parent) {
      currentParent = currentParent.parent;
    }
    if (currentParent.type !== "Scene") {
      this.dispose();
      return;
    }
    if (this.firstTimeUpdate) {
      this.firstTimeUpdate = false;
      this.emitter.updateWorldMatrix(true, false);
    }
    if (this.emitEnded && this.particleNum === 0) {
      if (this.markForDestroy && this.emitter.parent)
        this.dispose();
      return;
    }
    if (this.looping && this.prewarm && !this.prewarmed) {
      this.prewarmed = true;
      for (let i = 0; i < this.duration * PREWARM_FPS; i++) {
        this.update(1 / PREWARM_FPS);
      }
    }
    if (delta > 0.1) {
      delta = 0.1;
    }
    if (this.neededToUpdateRender) {
      if (this._renderer)
        this._renderer.updateSystem(this);
      this.neededToUpdateRender = false;
    }
    if (!this.onlyUsedByOther) {
      this.emit(delta, this.emissionState, this.emitter.matrixWorld);
    }
    this.emitterShape.update(this, delta);
    for (let j = 0; j < this.behaviors.length; j++) {
      this.behaviors[j].frameUpdate(delta);
      for (let i = 0; i < this.particleNum; i++) {
        if (!this.particles[i].died) {
          this.behaviors[j].update(this.particles[i], delta);
        }
      }
    }
    for (let i = 0; i < this.particleNum; i++) {
      if (this.rendererEmitterSettings.followLocalOrigin && this.particles[i].localPosition) {
        this.particles[i].position.copy(this.particles[i].localPosition);
        if (this.particles[i].parentMatrix) {
          this.particles[i].position.applyMatrix4(this.particles[i].parentMatrix);
        } else {
          this.particles[i].position.applyMatrix4(this.emitter.matrixWorld);
        }
      } else {
        this.particles[i].position.addScaledVector(this.particles[i].velocity, delta * this.particles[i].speedModifier);
      }
      this.particles[i].age += delta;
    }
    if (this.rendererSettings.renderMode === RenderMode.Trail) {
      for (let i = 0; i < this.particleNum; i++) {
        const particle = this.particles[i];
        particle.update();
      }
    }
    for (let i = 0; i < this.particleNum; i++) {
      const particle = this.particles[i];
      if (particle.died && (!(particle instanceof TrailParticle) || particle.previous.length === 0)) {
        this.particles[i] = this.particles[this.particleNum - 1];
        this.particles[this.particleNum - 1] = particle;
        this.particleNum--;
        i--;
        this.fire({ type: "particleDied", particleSystem: this, particle });
      }
    }
  }
  emit(delta, emissionState, emitterMatrix) {
    if (emissionState.time > this.duration) {
      if (this.looping) {
        emissionState.time -= this.duration;
        emissionState.burstIndex = 0;
        this.behaviors.forEach((behavior) => {
          behavior.reset();
        });
      } else {
        if (!this.emitEnded && !this.onlyUsedByOther) {
          this.endEmit();
        }
      }
    }
    this.normalMatrix.getNormalMatrix(emitterMatrix);
    const totalSpawn = Math.ceil(emissionState.waitEmiting);
    this.spawn(totalSpawn, emissionState, emitterMatrix);
    emissionState.waitEmiting -= totalSpawn;
    while (emissionState.burstIndex < this.emissionBursts.length && this.emissionBursts[emissionState.burstIndex].time <= emissionState.time) {
      if (Math.random() < this.emissionBursts[emissionState.burstIndex].probability) {
        const count = this.emissionBursts[emissionState.burstIndex].count.genValue(this.memory, this.time);
        emissionState.isBursting = true;
        emissionState.burstParticleCount = count;
        this.spawn(count, emissionState, emitterMatrix);
        emissionState.isBursting = false;
      }
      emissionState.burstIndex++;
    }
    if (!this.emitEnded) {
      emissionState.waitEmiting += delta * this.emissionOverTime.genValue(this.memory, emissionState.time / this.duration);
      if (emissionState.previousWorldPos != void 0) {
        this.temp.set(emitterMatrix.elements[12], emitterMatrix.elements[13], emitterMatrix.elements[14]);
        emissionState.travelDistance += emissionState.previousWorldPos.distanceTo(this.temp);
        const emitPerMeter = this.emissionOverDistance.genValue(this.memory, emissionState.time / this.duration);
        if (emissionState.travelDistance * emitPerMeter > 0) {
          const count = Math.floor(emissionState.travelDistance * emitPerMeter);
          emissionState.travelDistance -= count / emitPerMeter;
          emissionState.waitEmiting += count;
        }
      }
    }
    if (emissionState.previousWorldPos === void 0)
      emissionState.previousWorldPos = new Vector3();
    emissionState.previousWorldPos.set(emitterMatrix.elements[12], emitterMatrix.elements[13], emitterMatrix.elements[14]);
    emissionState.time += delta;
  }
  toJSON(meta, options = {}) {
    const isRootObject = meta === void 0 || typeof meta === "string";
    if (isRootObject) {
      meta = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {},
        skeletons: {},
        animations: {},
        nodes: {}
      };
    }
    meta.materials[this.rendererSettings.material.uuid] = this.rendererSettings.material.toJSON(meta);
    if (options.useUrlForImage) {
      if (this.texture?.source !== void 0) {
        const image = this.texture.source;
        meta.images[image.uuid] = {
          uuid: image.uuid,
          url: this.texture.image.url
        };
      }
    }
    let rendererSettingsJSON;
    if (this.renderMode === RenderMode.Trail) {
      rendererSettingsJSON = {
        startLength: this.rendererEmitterSettings.startLength.toJSON(),
        followLocalOrigin: this.rendererEmitterSettings.followLocalOrigin
      };
    } else if (this.renderMode === RenderMode.Mesh) {
      rendererSettingsJSON = {};
    } else if (this.renderMode === RenderMode.StretchedBillBoard) {
      rendererSettingsJSON = {
        speedFactor: this.rendererEmitterSettings.speedFactor,
        lengthFactor: this.rendererEmitterSettings.lengthFactor
      };
    } else {
      rendererSettingsJSON = {};
    }
    const geometry = this.rendererSettings.instancingGeometry;
    if (meta.geometries && !meta.geometries[geometry.uuid]) {
      meta.geometries[geometry.uuid] = geometry.toJSON();
    }
    return {
      version: "3.0",
      autoDestroy: this.autoDestroy,
      looping: this.looping,
      prewarm: this.prewarm,
      duration: this.duration,
      shape: this.emitterShape.toJSON(),
      startLife: this.startLife.toJSON(),
      startSpeed: this.startSpeed.toJSON(),
      startRotation: this.startRotation.toJSON(),
      startSize: this.startSize.toJSON(),
      startColor: this.startColor.toJSON(),
      emissionOverTime: this.emissionOverTime.toJSON(),
      emissionOverDistance: this.emissionOverDistance.toJSON(),
      emissionBursts: this.emissionBursts.map((burst) => ({
        time: burst.time,
        count: burst.count.toJSON(),
        probability: burst.probability,
        interval: burst.interval,
        cycle: burst.cycle
      })),
      onlyUsedByOther: this.onlyUsedByOther,
      instancingGeometry: this.rendererSettings.instancingGeometry.uuid,
      renderOrder: this.renderOrder,
      renderMode: this.renderMode,
      rendererEmitterSettings: rendererSettingsJSON,
      material: this.rendererSettings.material.uuid,
      layers: this.layers.mask,
      startTileIndex: this.startTileIndex.toJSON(),
      uTileCount: this.uTileCount,
      vTileCount: this.vTileCount,
      blendTiles: this.blendTiles,
      softParticles: this.rendererSettings.softParticles,
      softFarFade: this.rendererSettings.softFarFade,
      softNearFade: this.rendererSettings.softNearFade,
      behaviors: this.behaviors.map((behavior) => behavior.toJSON()),
      worldSpace: this.worldSpace
    };
  }
  static fromJSON(json, meta, dependencies) {
    const shape = EmitterFromJSON(json.shape, meta);
    let rendererEmitterSettings;
    if (json.renderMode === RenderMode.Trail) {
      const trailSettings = json.rendererEmitterSettings;
      rendererEmitterSettings = {
        startLength: trailSettings.startLength != void 0 ? ValueGeneratorFromJSON(trailSettings.startLength) : new ConstantValue(30),
        followLocalOrigin: trailSettings.followLocalOrigin
      };
    } else if (json.renderMode === RenderMode.Mesh) {
      rendererEmitterSettings = {};
    } else if (json.renderMode === RenderMode.StretchedBillBoard) {
      rendererEmitterSettings = json.rendererEmitterSettings;
      if (json.speedFactor != void 0) {
        rendererEmitterSettings.speedFactor = json.speedFactor;
      }
    } else {
      rendererEmitterSettings = {};
    }
    const layers = new Layers();
    if (json.layers) {
      layers.mask = json.layers;
    }
    const ps = new ParticleSystem({
      autoDestroy: json.autoDestroy,
      looping: json.looping,
      prewarm: json.prewarm,
      duration: json.duration,
      shape,
      startLife: ValueGeneratorFromJSON(json.startLife),
      startSpeed: ValueGeneratorFromJSON(json.startSpeed),
      startRotation: GeneratorFromJSON(json.startRotation),
      startSize: GeneratorFromJSON(json.startSize),
      startColor: ColorGeneratorFromJSON(json.startColor),
      emissionOverTime: ValueGeneratorFromJSON(json.emissionOverTime),
      emissionOverDistance: ValueGeneratorFromJSON(json.emissionOverDistance),
      emissionBursts: json.emissionBursts?.map((burst) => ({
        time: burst.time,
        count: typeof burst.count === "number" ? new ConstantValue(burst.count) : ValueGeneratorFromJSON(burst.count),
        probability: burst.probability ?? 1,
        interval: burst.interval ?? 0.1,
        cycle: burst.cycle ?? 1
      })),
      onlyUsedByOther: json.onlyUsedByOther,
      instancingGeometry: meta.geometries[json.instancingGeometry],
      renderMode: json.renderMode,
      rendererEmitterSettings,
      renderOrder: json.renderOrder,
      layers,
      material: json.material ? meta.materials[json.material] : json.texture ? new MeshBasicMaterial({
        map: meta.textures[json.texture],
        transparent: json.transparent ?? true,
        blending: json.blending,
        side: DoubleSide
      }) : new MeshBasicMaterial({
        color: 16777215,
        transparent: true,
        blending: AdditiveBlending,
        side: DoubleSide
      }),
      startTileIndex: typeof json.startTileIndex === "number" ? new ConstantValue(json.startTileIndex) : ValueGeneratorFromJSON(json.startTileIndex),
      uTileCount: json.uTileCount,
      vTileCount: json.vTileCount,
      blendTiles: json.blendTiles,
      softParticles: json.softParticles,
      softFarFade: json.softFarFade,
      softNearFade: json.softNearFade,
      behaviors: [],
      worldSpace: json.worldSpace
    });
    ps.behaviors = json.behaviors.map((behaviorJson) => {
      const behavior = BehaviorFromJSON(behaviorJson, ps);
      if (behavior && behavior.type === "EmitSubParticleSystem") {
        dependencies[behaviorJson.subParticleSystem] = behavior;
      }
      return behavior;
    }).filter((behavior) => behavior !== null);
    return ps;
  }
  addBehavior(behavior) {
    this.behaviors.push(behavior);
  }
  getRendererSettings() {
    return this.rendererSettings;
  }
  addEventListener(event, callback) {
    if (!this.listeners[event])
      this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  removeAllEventListeners(event) {
    if (this.listeners[event])
      this.listeners[event] = [];
  }
  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback);
      if (index !== -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }
  fire(event) {
    if (this.listeners[event.type]) {
      this.listeners[event.type].forEach((callback) => callback(event));
    }
  }
  clone() {
    const newEmissionBursts = [];
    for (const emissionBurst of this.emissionBursts) {
      const newEmissionBurst = {};
      Object.assign(newEmissionBurst, emissionBurst);
      newEmissionBursts.push(newEmissionBurst);
    }
    const newBehaviors = [];
    for (const behavior of this.behaviors) {
      newBehaviors.push(behavior.clone());
    }
    let rendererEmitterSettings;
    if (this.renderMode === RenderMode.Trail) {
      rendererEmitterSettings = {
        startLength: this.rendererEmitterSettings.startLength.clone(),
        followLocalOrigin: this.rendererEmitterSettings.followLocalOrigin
      };
    } else if (this.renderMode === RenderMode.StretchedBillBoard) {
      rendererEmitterSettings = {
        lengthFactor: this.rendererEmitterSettings.lengthFactor,
        speedFactor: this.rendererEmitterSettings.speedFactor
      };
    } else {
      rendererEmitterSettings = {};
    }
    const layers = new Layers();
    layers.mask = this.layers.mask;
    return new ParticleSystem({
      autoDestroy: this.autoDestroy,
      looping: this.looping,
      duration: this.duration,
      shape: this.emitterShape.clone(),
      startLife: this.startLife.clone(),
      startSpeed: this.startSpeed.clone(),
      startRotation: this.startRotation.clone(),
      startSize: this.startSize.clone(),
      startColor: this.startColor.clone(),
      emissionOverTime: this.emissionOverTime.clone(),
      emissionOverDistance: this.emissionOverDistance.clone(),
      emissionBursts: newEmissionBursts,
      onlyUsedByOther: this.onlyUsedByOther,
      instancingGeometry: this.rendererSettings.instancingGeometry,
      renderMode: this.renderMode,
      renderOrder: this.renderOrder,
      rendererEmitterSettings,
      material: this.rendererSettings.material,
      startTileIndex: this.startTileIndex,
      uTileCount: this.uTileCount,
      vTileCount: this.vTileCount,
      blendTiles: this.blendTiles,
      softParticles: this.softParticles,
      softFarFade: this.softFarFade,
      softNearFade: this.softNearFade,
      behaviors: newBehaviors,
      worldSpace: this.worldSpace,
      layers
    });
  }
}
var particle_frag = `

#include <common>
#include <color_pars_fragment>
#include <map_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <alphatest_pars_fragment>

#include <tile_pars_fragment>
#include <soft_pars_fragment>

void main() {

    #include <clipping_planes_fragment>
    
    vec3 outgoingLight = vec3( 0.0 );
    vec4 diffuseColor = vColor;
    
    #include <logdepthbuf_fragment>
    
    #include <tile_fragment>
    #include <alphatest_fragment>

    outgoingLight = diffuseColor.rgb;
    
    #ifdef USE_COLOR_AS_ALPHA
    gl_FragColor = vec4( outgoingLight, diffuseColor.r );
    #else
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
    #endif
    
    #include <soft_fragment>
    #include <tonemapping_fragment>
}
`;
var particle_physics_frag = `
#define STANDARD

#ifdef PHYSICAL
#define IOR
#define USE_SPECULAR
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef IOR
uniform float ior;
#endif

#ifdef USE_SPECULAR
uniform float specularIntensity;
uniform vec3 specularColor;

#ifdef USE_SPECULAR_COLORMAP
uniform sampler2D specularColorMap;
#endif

#ifdef USE_SPECULAR_INTENSITYMAP
uniform sampler2D specularIntensityMap;
#endif
#endif

#ifdef USE_CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif

#ifdef USE_DISPERSION
uniform float dispersion;
#endif

#ifdef USE_IRIDESCENCE
uniform float iridescence;
uniform float iridescenceIOR;
uniform float iridescenceThicknessMinimum;
uniform float iridescenceThicknessMaximum;
#endif

#ifdef USE_SHEEN
uniform vec3 sheenColor;
uniform float sheenRoughness;

#ifdef USE_SHEEN_COLORMAP
uniform sampler2D sheenColorMap;
#endif

#ifdef USE_SHEEN_ROUGHNESSMAP
uniform sampler2D sheenRoughnessMap;
#endif
#endif

#ifdef USE_ANISOTROPY
uniform vec2 anisotropyVector;

#ifdef USE_ANISOTROPYMAP
uniform sampler2D anisotropyMap;
#endif
#endif

varying vec3 vViewPosition;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>

ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
vec3 totalEmissiveRadiance = emissive;

#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <roughnessmap_fragment>
#include <metalnessmap_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
#include <clearcoat_normal_fragment_begin>
#include <clearcoat_normal_fragment_maps>
#include <emissivemap_fragment>

// accumulation
#include <lights_physical_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>

// modulation
#include <aomap_fragment>

vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

#include <transmission_fragment>

vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

#ifdef USE_SHEEN

// Sheen energy compensation approximation calculation can be found at the end of
// https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );

outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;

#endif

#ifdef USE_CLEARCOAT

float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );

vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;

#endif

#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}`;
var particle_vert = `
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute float rotation;
attribute vec3 size;

void main() {
	
    vec2 alignedPosition = position.xy * size.xy;
    
    vec2 rotatedPosition;
    rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
    rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
#ifdef HORIZONTAL
    vec4 mvPosition = modelMatrix * vec4( offset, 1.0 );
    mvPosition.x += rotatedPosition.x;
    mvPosition.z -= rotatedPosition.y;
    mvPosition = viewMatrix * mvPosition;
#elif defined(VERTICAL)
    vec4 mvPosition = modelMatrix * vec4( offset, 1.0 );
    mvPosition.y += rotatedPosition.y;
    mvPosition = viewMatrix * mvPosition;
    mvPosition.x += rotatedPosition.x;
#else
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    mvPosition.xy += rotatedPosition;
#endif

	vColor = color;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>

	#include <clipping_planes_vertex>

	#include <tile_vertex>
	#include <soft_vertex>
}
`;
var local_particle_vert = `
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute vec4 rotation;
attribute vec3 size;
// attribute vec4 color;

void main() {

    float x2 = rotation.x + rotation.x, y2 = rotation.y + rotation.y, z2 = rotation.z + rotation.z;
    float xx = rotation.x * x2, xy = rotation.x * y2, xz = rotation.x * z2;
    float yy = rotation.y * y2, yz = rotation.y * z2, zz = rotation.z * z2;
    float wx = rotation.w * x2, wy = rotation.w * y2, wz = rotation.w * z2;
    float sx = size.x, sy = size.y, sz = size.z;
    
    mat4 matrix = mat4(( 1.0 - ( yy + zz ) ) * sx, ( xy + wz ) * sx, ( xz - wy ) * sx, 0.0,  // 1. column
                      ( xy - wz ) * sy, ( 1.0 - ( xx + zz ) ) * sy, ( yz + wx ) * sy, 0.0,  // 2. column
                      ( xz + wy ) * sz, ( yz - wx ) * sz, ( 1.0 - ( xx + yy ) ) * sz, 0.0,  // 3. column
                      offset.x, offset.y, offset.z, 1.0);
    
    vec4 mvPosition = modelViewMatrix * (matrix * vec4( position, 1.0 ));

	vColor = color;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
    #include <tile_vertex>
    #include <soft_vertex>
}
`;
var local_particle_physics_vert = `
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>

attribute vec3 offset;
attribute vec4 rotation;
attribute vec3 size;
#include <tile_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

    #include <tile_vertex>
    float x2 = rotation.x + rotation.x, y2 = rotation.y + rotation.y, z2 = rotation.z + rotation.z;
    float xx = rotation.x * x2, xy = rotation.x * y2, xz = rotation.x * z2;
    float yy = rotation.y * y2, yz = rotation.y * z2, zz = rotation.z * z2;
    float wx = rotation.w * x2, wy = rotation.w * y2, wz = rotation.w * z2;
    float sx = size.x, sy = size.y, sz = size.z;

    mat4 particleMatrix = mat4(( 1.0 - ( yy + zz ) ) * sx, ( xy + wz ) * sx, ( xz - wy ) * sx, 0.0,  // 1. column
                      ( xy - wz ) * sy, ( 1.0 - ( xx + zz ) ) * sy, ( yz + wx ) * sy, 0.0,  // 2. column
                      ( xz + wy ) * sz, ( yz - wx ) * sz, ( 1.0 - ( xx + yy ) ) * sz, 0.0,  // 3. column
                      offset.x, offset.y, offset.z, 1.0);

#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>

#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>

	// replace defaultnormal_vertex
	vec3 transformedNormal = objectNormal;
    mat3 m = mat3( particleMatrix );
    transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
    transformedNormal = m * transformedNormal;
    transformedNormal = normalMatrix * transformedNormal;
    #ifdef FLIP_SIDED
        transformedNormal = - transformedNormal;
    #endif
    #ifdef USE_TANGENT
        vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
        #ifdef FLIP_SIDED
        transformedTangent = - transformedTangent;
        #endif
    #endif

	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>

	// replace include <project_vertex>
  vec4 mvPosition = vec4( transformed, 1.0 );
  mvPosition = modelViewMatrix * (particleMatrix * mvPosition);
	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	
	vViewPosition = - mvPosition.xyz;
	
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
    vWorldPosition = worldPosition.xyz;
#endif
}
`;
var stretched_bb_particle_vert = `
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute float rotation;
attribute vec3 size;
attribute vec4 velocity;

uniform float speedFactor;

void main() {
    float lengthFactor = velocity.w;
    float avgSize = (size.x + size.y) * 0.5;
#ifdef USE_SKEW
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    vec3 viewVelocity = normalMatrix * velocity.xyz;

    vec3 scaledPos = vec3(position.xy * size.xy, position.z);
    float vlength = length(viewVelocity);
    vec3 projVelocity =  dot(scaledPos, viewVelocity) * viewVelocity / vlength;
    mvPosition.xyz += scaledPos + projVelocity * (speedFactor / avgSize + lengthFactor / vlength);
#else
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    vec3 viewVelocity = normalMatrix * velocity.xyz;
    float vlength = length(viewVelocity); 
    mvPosition.xyz += position.y * normalize(cross(mvPosition.xyz, viewVelocity)) * avgSize; // switch the cross to  match unity implementation
    mvPosition.xyz -= (position.x + 0.5) * viewVelocity * (1.0 + lengthFactor / vlength) * avgSize; // minus position.x to match unity implementation
#endif
	vColor = color;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <tile_vertex>
	#include <soft_vertex>
}
`;
function getMaterialUVChannelName(value) {
  if (value === 0)
    return "uv";
  return `uv${value}`;
}
class ParticleMeshStandardMaterial extends MeshStandardMaterial {
  constructor(parameters) {
    super(parameters);
  }
  onBeforeCompile(parameters, renderer) {
    super.onBeforeCompile(parameters, renderer);
    parameters.vertexShader = local_particle_physics_vert;
    parameters.fragmentShader = particle_physics_frag;
  }
}
class ParticleMeshPhysicsMaterial extends MeshPhysicalMaterial {
  constructor(parameters) {
    super(parameters);
  }
  onBeforeCompile(parameters, renderer) {
    super.onBeforeCompile(parameters, renderer);
    parameters.vertexShader = local_particle_physics_vert;
    parameters.fragmentShader = particle_physics_frag;
  }
}
class SpriteBatch extends VFXBatch {
  constructor(settings) {
    super(settings);
    this.vector_ = new Vector3();
    this.vector2_ = new Vector3();
    this.vector3_ = new Vector3();
    this.quaternion_ = new Quaternion();
    this.quaternion2_ = new Quaternion();
    this.quaternion3_ = new Quaternion();
    this.rotationMat_ = new Matrix3();
    this.rotationMat2_ = new Matrix3();
    this.maxParticles = 1e3;
    this.setupBuffers();
    this.rebuildMaterial();
  }
  buildExpandableBuffers() {
    this.offsetBuffer = new InstancedBufferAttribute(new Float32Array(this.maxParticles * 3), 3);
    this.offsetBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("offset", this.offsetBuffer);
    this.colorBuffer = new InstancedBufferAttribute(new Float32Array(this.maxParticles * 4), 4);
    this.colorBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("color", this.colorBuffer);
    if (this.settings.renderMode === RenderMode.Mesh) {
      this.rotationBuffer = new InstancedBufferAttribute(new Float32Array(this.maxParticles * 4), 4);
      this.rotationBuffer.setUsage(DynamicDrawUsage);
      this.geometry.setAttribute("rotation", this.rotationBuffer);
    } else if (this.settings.renderMode === RenderMode.BillBoard || this.settings.renderMode === RenderMode.HorizontalBillBoard || this.settings.renderMode === RenderMode.VerticalBillBoard || this.settings.renderMode === RenderMode.StretchedBillBoard) {
      this.rotationBuffer = new InstancedBufferAttribute(new Float32Array(this.maxParticles), 1);
      this.rotationBuffer.setUsage(DynamicDrawUsage);
      this.geometry.setAttribute("rotation", this.rotationBuffer);
    }
    this.sizeBuffer = new InstancedBufferAttribute(new Float32Array(this.maxParticles * 3), 3);
    this.sizeBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("size", this.sizeBuffer);
    this.uvTileBuffer = new InstancedBufferAttribute(new Float32Array(this.maxParticles), 1);
    this.uvTileBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("uvTile", this.uvTileBuffer);
    if (this.settings.renderMode === RenderMode.StretchedBillBoard) {
      this.velocityBuffer = new InstancedBufferAttribute(new Float32Array(this.maxParticles * 4), 4);
      this.velocityBuffer.setUsage(DynamicDrawUsage);
      this.geometry.setAttribute("velocity", this.velocityBuffer);
    }
  }
  setupBuffers() {
    if (this.geometry)
      this.geometry.dispose();
    this.geometry = new InstancedBufferGeometry();
    this.geometry.setIndex(this.settings.instancingGeometry.getIndex());
    if (this.settings.instancingGeometry.hasAttribute("normal")) {
      this.geometry.setAttribute("normal", this.settings.instancingGeometry.getAttribute("normal"));
    }
    this.geometry.setAttribute("position", this.settings.instancingGeometry.getAttribute("position"));
    if (this.settings.instancingGeometry.hasAttribute("uv")) {
      this.geometry.setAttribute("uv", this.settings.instancingGeometry.getAttribute("uv"));
    }
    this.buildExpandableBuffers();
  }
  expandBuffers(target) {
    while (target >= this.maxParticles) {
      this.maxParticles *= 2;
    }
    this.setupBuffers();
  }
  rebuildMaterial() {
    this.layers.mask = this.settings.layers.mask;
    const uniforms = {};
    const defines = {};
    if (this.settings.material.type !== "MeshStandardMaterial" && this.settings.material.type !== "MeshPhysicalMaterial") {
      uniforms["map"] = new Uniform(this.settings.material.map);
    }
    if (this.settings.material.alphaTest) {
      defines["USE_ALPHATEST"] = "";
      uniforms["alphaTest"] = new Uniform(this.settings.material.alphaTest);
    }
    defines["USE_UV"] = "";
    const uTileCount = this.settings.uTileCount;
    const vTileCount = this.settings.vTileCount;
    if (uTileCount > 1 || vTileCount > 1) {
      defines["UV_TILE"] = "";
      uniforms["tileCount"] = new Uniform(new Vector2(uTileCount, vTileCount));
    }
    if (this.settings.material.defines && this.settings.material.defines["USE_COLOR_AS_ALPHA"] !== void 0) {
      defines["USE_COLOR_AS_ALPHA"] = "";
    }
    if (this.settings.material.normalMap) {
      defines["USE_NORMALMAP"] = "";
      defines["NORMALMAP_UV"] = getMaterialUVChannelName(this.settings.material.normalMap.channel);
      uniforms["normalMapTransform"] = new Uniform(new Matrix3().copy(this.settings.material.normalMap.matrix));
    }
    if (this.settings.material.map) {
      defines["USE_MAP"] = "";
      if (this.settings.blendTiles)
        defines["TILE_BLEND"] = "";
      defines["MAP_UV"] = getMaterialUVChannelName(this.settings.material.map.channel);
      uniforms["mapTransform"] = new Uniform(new Matrix3().copy(this.settings.material.map.matrix));
    }
    defines["USE_COLOR_ALPHA"] = "";
    let onBeforeRender;
    if (this.settings.softParticles) {
      defines["SOFT_PARTICLES"] = "";
      const nearFade = this.settings.softNearFade;
      const invFadeDistance = 1 / (this.settings.softFarFade - this.settings.softNearFade);
      uniforms["softParams"] = new Uniform(new Vector2(nearFade, invFadeDistance));
      uniforms["depthTexture"] = new Uniform(null);
      const projParams = uniforms["projParams"] = new Uniform(new Vector4());
      onBeforeRender = (_renderer, _scene, camera) => {
        projParams.value.set(camera.near, camera.far, 0, 0);
      };
    }
    let needLights = false;
    if (this.settings.renderMode === RenderMode.BillBoard || this.settings.renderMode === RenderMode.VerticalBillBoard || this.settings.renderMode === RenderMode.HorizontalBillBoard || this.settings.renderMode === RenderMode.Mesh) {
      let vertexShader;
      let fragmentShader;
      if (this.settings.renderMode === RenderMode.Mesh) {
        if (this.settings.material.type === "MeshStandardMaterial" || this.settings.material.type === "MeshPhysicalMaterial") {
          defines["USE_COLOR"] = "";
          vertexShader = local_particle_physics_vert;
          fragmentShader = particle_physics_frag;
          needLights = true;
        } else {
          vertexShader = local_particle_vert;
          fragmentShader = particle_frag;
        }
      } else {
        vertexShader = particle_vert;
        fragmentShader = particle_frag;
      }
      if (this.settings.renderMode === RenderMode.VerticalBillBoard) {
        defines["VERTICAL"] = "";
      } else if (this.settings.renderMode === RenderMode.HorizontalBillBoard) {
        defines["HORIZONTAL"] = "";
      }
      let specialMats = false;
      if (this.settings.renderMode === RenderMode.Mesh) {
        if (this.settings.material.type === "MeshStandardMaterial") {
          this.material = new ParticleMeshStandardMaterial({});
          this.material.copy(this.settings.material);
          this.material.uniforms = uniforms;
          this.material.defines = defines;
          specialMats = true;
        } else if (this.settings.material.type === "MeshPhysicalMaterial") {
          this.material = new ParticleMeshPhysicsMaterial({});
          this.material.copy(this.settings.material);
          this.material.uniforms = uniforms;
          this.material.defines = defines;
          specialMats = true;
        }
      }
      if (!specialMats) {
        this.material = new ShaderMaterial({
          uniforms,
          defines,
          vertexShader,
          fragmentShader,
          transparent: this.settings.material.transparent,
          depthWrite: !this.settings.material.transparent,
          blending: this.settings.material.blending,
          blendDst: this.settings.material.blendDst,
          blendSrc: this.settings.material.blendSrc,
          blendEquation: this.settings.material.blendEquation,
          premultipliedAlpha: this.settings.material.premultipliedAlpha,
          side: this.settings.material.side,
          alphaTest: this.settings.material.alphaTest,
          depthTest: this.settings.material.depthTest,
          lights: needLights
        });
      }
    } else if (this.settings.renderMode === RenderMode.StretchedBillBoard) {
      uniforms["speedFactor"] = new Uniform(1);
      this.material = new ShaderMaterial({
        uniforms,
        defines,
        vertexShader: stretched_bb_particle_vert,
        fragmentShader: particle_frag,
        transparent: this.settings.material.transparent,
        depthWrite: !this.settings.material.transparent,
        blending: this.settings.material.blending,
        blendDst: this.settings.material.blendDst,
        blendSrc: this.settings.material.blendSrc,
        blendEquation: this.settings.material.blendEquation,
        premultipliedAlpha: this.settings.material.premultipliedAlpha,
        side: this.settings.material.side,
        alphaTest: this.settings.material.alphaTest,
        depthTest: this.settings.material.depthTest
      });
    } else {
      throw new Error("render mode unavailable");
    }
    if (this.material && onBeforeRender) {
      this.material.onBeforeRender = onBeforeRender;
    }
  }
  update() {
    let index = 0;
    let particleCount = 0;
    const visibleSystems = this.getVisibleSystems();
    for (const system of visibleSystems) {
      particleCount += system.particleNum;
    }
    if (particleCount > this.maxParticles) {
      this.expandBuffers(particleCount);
    }
    for (const system of visibleSystems) {
      if (system.emitter.updateMatrixWorld) {
        system.emitter.updateWorldMatrix(true, false);
        system.emitter.updateMatrixWorld(true);
      }
      const particles = system.particles;
      const particleNum = system.particleNum;
      const rotation = this.quaternion2_;
      const translation = this.vector2_;
      const scale = this.vector3_;
      system.emitter.matrixWorld.decompose(translation, rotation, scale);
      this.rotationMat_.setFromMatrix4(system.emitter.matrixWorld);
      for (let j = 0; j < particleNum; j++, index++) {
        const particle = particles[j];
        if (this.settings.renderMode === RenderMode.Mesh) {
          let q;
          if (system.worldSpace) {
            q = particle.rotation;
          } else {
            let parentQ;
            if (particle.parentMatrix) {
              parentQ = this.quaternion3_.setFromRotationMatrix(particle.parentMatrix);
            } else {
              parentQ = rotation;
            }
            q = this.quaternion_;
            q.copy(parentQ).multiply(particle.rotation);
          }
          this.rotationBuffer.setXYZW(index, q.x, q.y, q.z, q.w);
        } else if (this.settings.renderMode === RenderMode.StretchedBillBoard || this.settings.renderMode === RenderMode.VerticalBillBoard || this.settings.renderMode === RenderMode.HorizontalBillBoard || this.settings.renderMode === RenderMode.BillBoard) {
          this.rotationBuffer.setX(index, particle.rotation);
        }
        let vec;
        if (system.worldSpace) {
          vec = particle.position;
        } else {
          vec = this.vector_;
          if (particle.parentMatrix) {
            vec.copy(particle.position).applyMatrix4(particle.parentMatrix);
          } else {
            vec.copy(particle.position).applyMatrix4(system.emitter.matrixWorld);
          }
        }
        this.offsetBuffer.setXYZ(index, vec.x, vec.y, vec.z);
        this.colorBuffer.setXYZW(index, particle.color.x, particle.color.y, particle.color.z, particle.color.w);
        if (system.worldSpace) {
          this.sizeBuffer.setXYZ(index, particle.size.x, particle.size.y, particle.size.z);
        } else {
          if (particle.parentMatrix) {
            this.sizeBuffer.setXYZ(index, particle.size.x, particle.size.y, particle.size.z);
          } else {
            this.sizeBuffer.setXYZ(index, particle.size.x * Math.abs(scale.x), particle.size.y * Math.abs(scale.y), particle.size.z * Math.abs(scale.z));
          }
        }
        this.uvTileBuffer.setX(index, particle.uvTile);
        if (this.settings.renderMode === RenderMode.StretchedBillBoard && this.velocityBuffer) {
          let speedFactor = system.rendererEmitterSettings.speedFactor;
          if (speedFactor === 0)
            speedFactor = 1e-3;
          const lengthFactor = system.rendererEmitterSettings.lengthFactor;
          let vec2;
          if (system.worldSpace) {
            vec2 = particle.velocity;
          } else {
            vec2 = this.vector_;
            if (particle.parentMatrix) {
              this.rotationMat2_.setFromMatrix4(particle.parentMatrix);
              vec2.copy(particle.velocity).applyMatrix3(this.rotationMat2_);
            } else {
              vec2.copy(particle.velocity).applyMatrix3(this.rotationMat_);
            }
          }
          this.velocityBuffer.setXYZW(index, vec2.x * speedFactor, vec2.y * speedFactor, vec2.z * speedFactor, lengthFactor);
        }
      }
    }
    this.geometry.instanceCount = index;
    if (index > 0) {
      this.offsetBuffer.clearUpdateRanges();
      this.offsetBuffer.addUpdateRange(0, index * 3);
      this.offsetBuffer.needsUpdate = true;
      this.sizeBuffer.clearUpdateRanges();
      this.sizeBuffer.addUpdateRange(0, index * 3);
      this.sizeBuffer.needsUpdate = true;
      this.colorBuffer.clearUpdateRanges();
      this.colorBuffer.addUpdateRange(0, index * 4);
      this.colorBuffer.needsUpdate = true;
      this.uvTileBuffer.clearUpdateRanges();
      this.uvTileBuffer.addUpdateRange(0, index);
      this.uvTileBuffer.needsUpdate = true;
      if (this.settings.renderMode === RenderMode.StretchedBillBoard && this.velocityBuffer) {
        this.velocityBuffer.clearUpdateRanges();
        this.velocityBuffer.addUpdateRange(0, index * 4);
        this.velocityBuffer.needsUpdate = true;
      }
      if (this.settings.renderMode === RenderMode.Mesh) {
        this.rotationBuffer.clearUpdateRanges();
        this.rotationBuffer.addUpdateRange(0, index * 4);
        this.rotationBuffer.needsUpdate = true;
      } else if (this.settings.renderMode === RenderMode.StretchedBillBoard || this.settings.renderMode === RenderMode.HorizontalBillBoard || this.settings.renderMode === RenderMode.VerticalBillBoard || this.settings.renderMode === RenderMode.BillBoard) {
        this.rotationBuffer.clearUpdateRanges();
        this.rotationBuffer.addUpdateRange(0, index);
        this.rotationBuffer.needsUpdate = true;
      }
    }
  }
  dispose() {
    this.geometry.dispose();
  }
}
var trail_frag = `

#include <common>
#include <tile_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform sampler2D alphaMap;
uniform float useAlphaMap;
uniform float visibility;
uniform float alphaTest;

varying vec4 vColor;
    
void main() {
    #include <clipping_planes_fragment>
    #include <logdepthbuf_fragment>

    vec4 diffuseColor = vColor;
    
    #ifdef USE_MAP
    #include <tile_fragment>
    #ifndef USE_COLOR_AS_ALPHA
    #endif
    #endif
    if( useAlphaMap == 1. ) diffuseColor.a *= texture2D( alphaMap, vUv).a;
    if( diffuseColor.a < alphaTest ) discard;
    gl_FragColor = diffuseColor;

    #include <fog_fragment>
    #include <tonemapping_fragment>
}`;
var trail_vert = `
#include <common>
#include <tile_pars_vertex>
#include <color_pars_vertex>
#include <clipping_planes_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <fog_pars_vertex>

attribute vec3 previous;
attribute vec3 next;
attribute float side;
attribute float width;

uniform vec2 resolution;
uniform float lineWidth;
uniform float sizeAttenuation;
    
vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
}
    
void main() {

    #include <tile_vertex>
    
    float aspect = resolution.x / resolution.y;

    vColor = color;

    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4( position, 1.0 );
    vec4 prevPos = m * vec4( previous, 1.0 );
    vec4 nextPos = m * vec4( next, 1.0 );

    vec2 currentP = fix( finalPosition, aspect );
    vec2 prevP = fix( prevPos, aspect );
    vec2 nextP = fix( nextPos, aspect );

    float w = lineWidth * width;

    vec2 dir;
    if( nextP == currentP ) dir = normalize( currentP - prevP );
    else if( prevP == currentP ) dir = normalize( nextP - currentP );
    else {
        vec2 dir1 = normalize( currentP - prevP );
        vec2 dir2 = normalize( nextP - currentP );
        dir = normalize( dir1 + dir2 );

        vec2 perp = vec2( -dir1.y, dir1.x );
        vec2 miter = vec2( -dir.y, dir.x );
        //w = clamp( w / dot( miter, perp ), 0., 4., * lineWidth * width );

    }

    //vec2 normal = ( cross( vec3( dir, 0. ) vec3( 0., 0., 1. ) ) ).xy;
    vec4 normal = vec4( -dir.y, dir.x, 0., 1. );
    normal.xy *= .5 * w;
    normal *= projectionMatrix;
    if( sizeAttenuation == 0. ) {
        normal.xy *= finalPosition.w;
        normal.xy /= ( vec4( resolution, 0., 1. ) * projectionMatrix ).xy;
    }

    finalPosition.xy += normal.xy * side;

    gl_Position = finalPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
	#include <fog_vertex>
}`;
class TrailBatch extends VFXBatch {
  constructor(settings) {
    super(settings);
    this.vector_ = new Vector3();
    this.vector2_ = new Vector3();
    this.vector3_ = new Vector3();
    this.quaternion_ = new Quaternion();
    this.maxParticles = 1e4;
    this.setupBuffers();
    this.rebuildMaterial();
  }
  setupBuffers() {
    if (this.geometry)
      this.geometry.dispose();
    this.geometry = new BufferGeometry();
    this.indexBuffer = new BufferAttribute(new Uint32Array(this.maxParticles * 6), 1);
    this.indexBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setIndex(this.indexBuffer);
    this.positionBuffer = new BufferAttribute(new Float32Array(this.maxParticles * 6), 3);
    this.positionBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("position", this.positionBuffer);
    this.previousBuffer = new BufferAttribute(new Float32Array(this.maxParticles * 6), 3);
    this.previousBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("previous", this.previousBuffer);
    this.nextBuffer = new BufferAttribute(new Float32Array(this.maxParticles * 6), 3);
    this.nextBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("next", this.nextBuffer);
    this.widthBuffer = new BufferAttribute(new Float32Array(this.maxParticles * 2), 1);
    this.widthBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("width", this.widthBuffer);
    this.sideBuffer = new BufferAttribute(new Float32Array(this.maxParticles * 2), 1);
    this.sideBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("side", this.sideBuffer);
    this.uvBuffer = new BufferAttribute(new Float32Array(this.maxParticles * 4), 2);
    this.uvBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("uv", this.uvBuffer);
    this.colorBuffer = new BufferAttribute(new Float32Array(this.maxParticles * 8), 4);
    this.colorBuffer.setUsage(DynamicDrawUsage);
    this.geometry.setAttribute("color", this.colorBuffer);
  }
  expandBuffers(target) {
    while (target >= this.maxParticles) {
      this.maxParticles *= 2;
    }
    this.setupBuffers();
  }
  rebuildMaterial() {
    this.layers.mask = this.settings.layers.mask;
    const uniforms = {
      lineWidth: { value: 1 },
      map: { value: null },
      useMap: { value: 0 },
      alphaMap: { value: null },
      useAlphaMap: { value: 0 },
      resolution: { value: new Vector2(1, 1) },
      sizeAttenuation: { value: 1 },
      visibility: { value: 1 },
      alphaTest: { value: 0 }
    };
    const defines = {};
    defines["USE_UV"] = "";
    defines["USE_COLOR_ALPHA"] = "";
    if (this.settings.material.map) {
      defines["USE_MAP"] = "";
      defines["MAP_UV"] = getMaterialUVChannelName(this.settings.material.map.channel);
      uniforms["map"] = new Uniform(this.settings.material.map);
      uniforms["mapTransform"] = new Uniform(new Matrix3().copy(this.settings.material.map.matrix));
    }
    if (this.settings.material.defines && this.settings.material.defines["USE_COLOR_AS_ALPHA"] !== void 0) {
      defines["USE_COLOR_AS_ALPHA"] = "";
    }
    if (this.settings.renderMode === RenderMode.Trail) {
      this.material = new ShaderMaterial({
        uniforms,
        defines,
        vertexShader: trail_vert,
        fragmentShader: trail_frag,
        transparent: this.settings.material.transparent,
        depthWrite: !this.settings.material.transparent,
        side: this.settings.material.side,
        blending: this.settings.material.blending || AdditiveBlending,
        blendDst: this.settings.material.blendDst,
        blendSrc: this.settings.material.blendSrc,
        blendEquation: this.settings.material.blendEquation,
        premultipliedAlpha: this.settings.material.premultipliedAlpha
      });
    } else {
      throw new Error("render mode unavailable");
    }
  }
  update() {
    let index = 0;
    let triangles = 0;
    let particleCount = 0;
    const visibleSystems = this.getVisibleSystems();
    for (const system of visibleSystems) {
      for (let j = 0; j < system.particleNum; j++) {
        particleCount += system.particles[j].previous.length * 2;
      }
    }
    if (particleCount > this.maxParticles) {
      this.expandBuffers(particleCount);
    }
    for (const system of visibleSystems) {
      if (system.emitter.updateMatrixWorld) {
        system.emitter.updateWorldMatrix(true, false);
        system.emitter.updateMatrixWorld(true);
      }
      const rotation = this.quaternion_;
      const translation = this.vector2_;
      const scale = this.vector3_;
      system.emitter.matrixWorld.decompose(translation, rotation, scale);
      const particles = system.particles;
      const particleNum = system.particleNum;
      const uTileCount = this.settings.uTileCount;
      const vTileCount = this.settings.vTileCount;
      const tileWidth = 1 / uTileCount;
      const tileHeight = 1 / vTileCount;
      for (let j = 0; j < particleNum; j++) {
        const particle = particles[j];
        const col = particle.uvTile % vTileCount;
        const row = Math.floor(particle.uvTile / vTileCount + 1e-3);
        const iter = particle.previous.values();
        let curIter = iter.next();
        let previous = curIter.value;
        let current = previous;
        if (!curIter.done)
          curIter = iter.next();
        let next;
        if (curIter.value !== void 0) {
          next = curIter.value;
        } else {
          next = current;
        }
        for (let i = 0; i < particle.previous.length; i++, index += 2) {
          this.positionBuffer.setXYZ(index, current.position.x, current.position.y, current.position.z);
          this.positionBuffer.setXYZ(index + 1, current.position.x, current.position.y, current.position.z);
          if (system.worldSpace) {
            this.positionBuffer.setXYZ(index, current.position.x, current.position.y, current.position.z);
            this.positionBuffer.setXYZ(index + 1, current.position.x, current.position.y, current.position.z);
          } else {
            if (particle.parentMatrix) {
              this.vector_.copy(current.position).applyMatrix4(particle.parentMatrix);
            } else {
              this.vector_.copy(current.position).applyMatrix4(system.emitter.matrixWorld);
            }
            this.positionBuffer.setXYZ(index, this.vector_.x, this.vector_.y, this.vector_.z);
            this.positionBuffer.setXYZ(index + 1, this.vector_.x, this.vector_.y, this.vector_.z);
          }
          if (system.worldSpace) {
            this.previousBuffer.setXYZ(index, previous.position.x, previous.position.y, previous.position.z);
            this.previousBuffer.setXYZ(index + 1, previous.position.x, previous.position.y, previous.position.z);
          } else {
            if (particle.parentMatrix) {
              this.vector_.copy(previous.position).applyMatrix4(particle.parentMatrix);
            } else {
              this.vector_.copy(previous.position).applyMatrix4(system.emitter.matrixWorld);
            }
            this.previousBuffer.setXYZ(index, this.vector_.x, this.vector_.y, this.vector_.z);
            this.previousBuffer.setXYZ(index + 1, this.vector_.x, this.vector_.y, this.vector_.z);
          }
          if (system.worldSpace) {
            this.nextBuffer.setXYZ(index, next.position.x, next.position.y, next.position.z);
            this.nextBuffer.setXYZ(index + 1, next.position.x, next.position.y, next.position.z);
          } else {
            if (particle.parentMatrix) {
              this.vector_.copy(next.position).applyMatrix4(particle.parentMatrix);
            } else {
              this.vector_.copy(next.position).applyMatrix4(system.emitter.matrixWorld);
            }
            this.nextBuffer.setXYZ(index, this.vector_.x, this.vector_.y, this.vector_.z);
            this.nextBuffer.setXYZ(index + 1, this.vector_.x, this.vector_.y, this.vector_.z);
          }
          this.sideBuffer.setX(index, 1);
          this.sideBuffer.setX(index + 1, -1);
          if (system.worldSpace) {
            this.widthBuffer.setX(index, current.size);
            this.widthBuffer.setX(index + 1, current.size);
          } else {
            if (particle.parentMatrix) {
              this.widthBuffer.setX(index, current.size);
              this.widthBuffer.setX(index + 1, current.size);
            } else {
              const objectScale = (Math.abs(scale.x) + Math.abs(scale.y) + Math.abs(scale.z)) / 3;
              this.widthBuffer.setX(index, current.size * objectScale);
              this.widthBuffer.setX(index + 1, current.size * objectScale);
            }
          }
          this.uvBuffer.setXY(index, (i / particle.previous.length + col) * tileWidth, (vTileCount - row - 1) * tileHeight);
          this.uvBuffer.setXY(index + 1, (i / particle.previous.length + col) * tileWidth, (vTileCount - row) * tileHeight);
          this.colorBuffer.setXYZW(index, current.color.x, current.color.y, current.color.z, current.color.w);
          this.colorBuffer.setXYZW(index + 1, current.color.x, current.color.y, current.color.z, current.color.w);
          if (i + 1 < particle.previous.length) {
            this.indexBuffer.setX(triangles * 3, index);
            this.indexBuffer.setX(triangles * 3 + 1, index + 1);
            this.indexBuffer.setX(triangles * 3 + 2, index + 2);
            triangles++;
            this.indexBuffer.setX(triangles * 3, index + 2);
            this.indexBuffer.setX(triangles * 3 + 1, index + 1);
            this.indexBuffer.setX(triangles * 3 + 2, index + 3);
            triangles++;
          }
          previous = current;
          current = next;
          if (!curIter.done) {
            curIter = iter.next();
            if (curIter.value !== void 0) {
              next = curIter.value;
            }
          }
        }
      }
    }
    this.positionBuffer.clearUpdateRanges();
    this.positionBuffer.addUpdateRange(0, index * 3);
    this.positionBuffer.needsUpdate = true;
    this.previousBuffer.clearUpdateRanges();
    this.previousBuffer.addUpdateRange(0, index * 3);
    this.previousBuffer.needsUpdate = true;
    this.nextBuffer.clearUpdateRanges();
    this.nextBuffer.addUpdateRange(0, index * 3);
    this.nextBuffer.needsUpdate = true;
    this.sideBuffer.clearUpdateRanges();
    this.sideBuffer.addUpdateRange(0, index);
    this.sideBuffer.needsUpdate = true;
    this.widthBuffer.clearUpdateRanges();
    this.widthBuffer.addUpdateRange(0, index);
    this.widthBuffer.needsUpdate = true;
    this.uvBuffer.clearUpdateRanges();
    this.uvBuffer.addUpdateRange(0, index * 2);
    this.uvBuffer.needsUpdate = true;
    this.colorBuffer.clearUpdateRanges();
    this.colorBuffer.addUpdateRange(0, index * 4);
    this.colorBuffer.needsUpdate = true;
    this.indexBuffer.clearUpdateRanges();
    this.indexBuffer.addUpdateRange(0, triangles * 3);
    this.indexBuffer.needsUpdate = true;
    this.geometry.setDrawRange(0, triangles * 3);
  }
  dispose() {
    this.geometry.dispose();
  }
}
class BatchedRenderer extends Object3D {
  constructor() {
    super();
    this.batches = [];
    this.systemToBatchIndex = /* @__PURE__ */ new Map();
    this.type = "BatchedRenderer";
    this.depthTexture = null;
  }
  static equals(a, b) {
    return a.material.side === b.material.side && a.material.blending === b.material.blending && a.material.blendSrc === b.material.blendSrc && a.material.blendDst === b.material.blendDst && a.material.blendEquation === b.material.blendEquation && a.material.premultipliedAlpha === b.material.premultipliedAlpha && a.material.transparent === b.material.transparent && a.material.depthTest === b.material.depthTest && a.material.type === b.material.type && a.material.alphaTest === b.material.alphaTest && a.material.map === b.material.map && a.renderMode === b.renderMode && a.blendTiles === b.blendTiles && a.softParticles === b.softParticles && a.softFarFade === b.softFarFade && a.softNearFade === b.softNearFade && a.uTileCount === b.uTileCount && a.vTileCount === b.vTileCount && a.instancingGeometry === b.instancingGeometry && a.renderOrder === b.renderOrder && a.layers.mask === b.layers.mask;
  }
  addSystem(system) {
    system._renderer = this;
    const settings = system.getRendererSettings();
    for (let i = 0; i < this.batches.length; i++) {
      if (BatchedRenderer.equals(this.batches[i].settings, settings)) {
        this.batches[i].addSystem(system);
        this.systemToBatchIndex.set(system, i);
        return;
      }
    }
    let batch;
    switch (settings.renderMode) {
      case RenderMode.Trail:
        batch = new TrailBatch(settings);
        break;
      case RenderMode.Mesh:
      case RenderMode.BillBoard:
      case RenderMode.VerticalBillBoard:
      case RenderMode.HorizontalBillBoard:
      case RenderMode.StretchedBillBoard:
        batch = new SpriteBatch(settings);
        break;
    }
    if (this.depthTexture) {
      batch.applyDepthTexture(this.depthTexture);
    }
    batch.addSystem(system);
    this.batches.push(batch);
    this.systemToBatchIndex.set(system, this.batches.length - 1);
    this.add(batch);
  }
  deleteSystem(system) {
    const batchIndex = this.systemToBatchIndex.get(system);
    if (batchIndex != void 0) {
      this.batches[batchIndex].removeSystem(system);
      this.systemToBatchIndex.delete(system);
    }
  }
  setDepthTexture(depthTexture) {
    this.depthTexture = depthTexture;
    for (const batch of this.batches) {
      batch.applyDepthTexture(depthTexture);
    }
  }
  updateSystem(system) {
    this.deleteSystem(system);
    this.addSystem(system);
  }
  update(delta) {
    this.systemToBatchIndex.forEach((value, ps) => {
      ps.update(delta);
    });
    for (let i = 0; i < this.batches.length; i++) {
      this.batches[i].update();
    }
  }
}
class QuarksPrefab extends Group {
  constructor() {
    super();
    this.type = "QuarksPrefab";
    this.animationData = [];
    this.isPlaying = false;
    this.currentTime = -1e-5;
    this.timeScale = 1;
    this.duration = 0;
    this._mixers = /* @__PURE__ */ new Map();
    this._tempAnimationJSON = [];
    this._clock = new Clock(true);
  }
  registerBatchedRenderer(renderer) {
    this._batchedRenderer = renderer;
  }
  getOrCreateMixer(target) {
    if (!this._mixers.has(target)) {
      const mixer = new AnimationMixer(target);
      this._mixers.set(target, mixer);
    }
    return this._mixers.get(target);
  }
  addThreeAnimation(target, clip, startTime = 0, duration = clip.duration, loop = false) {
    const mixer = this.getOrCreateMixer(target);
    const action = mixer.clipAction(clip);
    if (!loop) {
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
    }
    const data = {
      startTime,
      duration,
      type: "three",
      loop,
      target,
      clip,
      mixer,
      action
    };
    this.animationData.push(data);
    this.updateDuration();
    return data;
  }
  addParticleSystemAnimation(emitter, startTime = 0, duration = 0, loop = false) {
    if (duration <= 0) {
      duration = emitter.system.duration;
    }
    const data = {
      startTime,
      duration,
      type: "ps",
      loop,
      target: emitter
    };
    this.animationData.push(data);
    this.pause();
    this.updateDuration();
    return data;
  }
  removeAnimation(index) {
    this.animationData.splice(index, 1);
    this.updateDuration();
  }
  play() {
    if (this.isPlaying)
      return;
    this.isPlaying = true;
  }
  pause() {
    if (!this.isPlaying)
      return;
    this.isPlaying = false;
    this.animationData.forEach((anim) => {
      if (anim.target) {
        if (anim.type === "ps" && !anim.target.system.paused) {
          anim.target.system.pause();
        } else if (anim.type === "three" && anim.action && anim.action.isRunning()) {
          anim.action.paused = true;
        }
      }
    });
  }
  stop() {
    this.pause();
    this.currentTime = -1e-5;
    this.animationData.forEach((anim) => {
      if (anim.type === "ps" && anim.target) {
        anim.target.system.stop();
      } else if (anim.type === "three" && anim.mixer && anim.action) {
        anim.action.reset();
      }
    });
  }
  update(forceDelta) {
    if (!this.isPlaying)
      return;
    const delta = forceDelta !== void 0 ? forceDelta : this._clock.getDelta();
    this.currentTime += delta * this.timeScale;
    if (this.currentTime > this.duration) {
      this.stop();
    }
    const currentMixers = /* @__PURE__ */ new Set();
    this.animationData.forEach((anim) => {
      const { startTime, duration, type, loop, target, action, mixer } = anim;
      const animationEndTime = startTime + duration;
      const isTimeToStart = this.currentTime >= startTime;
      const isTimeToEnd = this.currentTime > animationEndTime;
      const isStartFrame = Math.abs(this.currentTime - startTime) < delta;
      if (type === "three" && action && mixer) {
        if (isTimeToStart && !isTimeToEnd) {
          if (isStartFrame) {
            action.reset();
            action.play();
          } else {
            if (action.paused) {
              action.paused = false;
              action.play();
            }
          }
          this.currentTime - startTime;
          currentMixers.add(mixer);
        } else if (isTimeToEnd) {
          action.paused = true;
        }
      } else if (type === "ps" && target) {
        if (isTimeToStart && !isTimeToEnd) {
          if (isStartFrame) {
            anim.target.system.restart();
          }
        } else if (isTimeToEnd) {
          anim.target.system.endEmit();
        }
      }
    });
    currentMixers.forEach((mixer) => {
      mixer.update(delta);
    });
  }
  setTime(time) {
    const previousTime = this.currentTime;
    this.currentTime = time;
    this.animationData.forEach((anim) => {
      const { startTime, duration, type, target, action, mixer } = anim;
      if (type === "three" && action && mixer) {
        action.reset();
        if (time >= startTime && time < startTime + duration) {
          const localTime = time - startTime;
          action.time = localTime;
          action.play();
          mixer.update(0);
          action.paused = !this.isPlaying;
        }
      } else if (type === "ps" && target) {
        if (time >= startTime && time < startTime + duration) {
          if (previousTime < startTime || previousTime >= startTime + duration) {
            target.system.restart();
          }
        } else {
          target.system.endEmit();
        }
      }
    });
  }
  getDuration() {
    return this.duration;
  }
  updateDuration() {
    let maxDuration = 0;
    this.animationData.forEach((anim) => {
      const endTime = anim.startTime + anim.duration;
      if (endTime > maxDuration) {
        maxDuration = endTime;
      }
    });
    this.duration = maxDuration;
  }
  resolveReferences(root) {
    this._tempAnimationJSON.forEach((animJson) => {
      let target;
      root.traverse((object) => {
        if (object.uuid === animJson.targetUUID) {
          target = object;
        }
      });
      if (target) {
        if (animJson.type === "three" && animJson.clipUUID) {
          let clip;
          if (target.animations) {
            clip = target.animations.find((c) => c.uuid === animJson.clipUUID);
          }
          if (clip) {
            this.addThreeAnimation(target, clip, animJson.startTime, animJson.duration, animJson.loop);
          }
        } else if (animJson.type === "ps") {
          this.addParticleSystemAnimation(target, animJson.startTime, animJson.duration, animJson.loop);
        }
      }
    });
    this.updateDuration();
    this._tempAnimationJSON = [];
  }
  toJSON() {
    const json = super.toJSON();
    json.object.animationData = this.animationData.map((anim) => ({
      startTime: anim.startTime,
      duration: anim.duration,
      type: anim.type,
      targetUUID: anim.target.uuid,
      clipUUID: anim.clip?.uuid,
      loop: anim.loop
    }));
    return json;
  }
  static fromJSON(json) {
    const prefab = new QuarksPrefab();
    if (json.animationData) {
      prefab._tempAnimationJSON = json.animationData;
    }
    return prefab;
  }
}
class QuarksLoader extends ObjectLoader {
  constructor(manager) {
    super(manager);
  }
  linkReference(object) {
    const objectsMap = {};
    object.traverse(function(child) {
      objectsMap[child.uuid] = child;
    });
    object.traverse(function(child) {
      if (child.type === "ParticleEmitter") {
        const system = child.system;
        system.emitterShape;
        for (let i = 0; i < system.behaviors.length; i++) {
          if (system.behaviors[i] instanceof EmitSubParticleSystem) {
            system.behaviors[i].subParticleSystem = objectsMap[system.behaviors[i].subParticleSystem];
          }
        }
      }
    });
  }
  parse(json, onLoad) {
    const object = super.parse(json, onLoad);
    this.linkReference(object);
    return object;
  }
  parseObject(data, geometries, materials, textures, animations) {
    let object;
    function getGeometry(name) {
      if (geometries[name] === void 0) {
        console.warn("THREE.ObjectLoader: Undefined geometry", name);
      }
      return geometries[name];
    }
    function getMaterial(name) {
      if (name === void 0)
        return void 0;
      if (Array.isArray(name)) {
        const array = [];
        for (let i = 0, l = name.length; i < l; i++) {
          const uuid = name[i];
          if (materials[uuid] === void 0) {
            console.warn("THREE.ObjectLoader: Undefined material", uuid);
          }
          array.push(materials[uuid]);
        }
        return array;
      }
      if (materials[name] === void 0) {
        console.warn("THREE.ObjectLoader: Undefined material", name);
      }
      return materials[name];
    }
    function getTexture(uuid) {
      if (textures[uuid] === void 0) {
        console.warn("THREE.ObjectLoader: Undefined texture", uuid);
      }
      return textures[uuid];
    }
    let geometry, material;
    const meta = {
      textures,
      geometries,
      materials
    };
    const dependencies = {};
    switch (data.type) {
      case "QuarksPrefab":
        object = QuarksPrefab.fromJSON(data);
        break;
      case "ParticleEmitter":
        object = ParticleSystem.fromJSON(data.ps, meta, dependencies).emitter;
        break;
      case "Scene":
        object = new Scene();
        if (data.background !== void 0) {
          if (Number.isInteger(data.background)) {
            object.background = new Color(data.background);
          } else {
            object.background = getTexture(data.background);
          }
        }
        if (data.environment !== void 0) {
          object.environment = getTexture(data.environment);
        }
        if (data.fog !== void 0) {
          if (data.fog.type === "Fog") {
            object.fog = new Fog(data.fog.color, data.fog.near, data.fog.far);
          } else if (data.fog.type === "FogExp2") {
            object.fog = new FogExp2(data.fog.color, data.fog.density);
          }
          if (data.fog.name !== "") {
            object.fog.name = data.fog.name;
          }
        }
        if (data.backgroundBlurriness !== void 0)
          object.backgroundBlurriness = data.backgroundBlurriness;
        if (data.backgroundIntensity !== void 0)
          object.backgroundIntensity = data.backgroundIntensity;
        if (data.backgroundRotation !== void 0)
          object.backgroundRotation.fromArray(data.backgroundRotation);
        if (data.environmentIntensity !== void 0)
          object.environmentIntensity = data.environmentIntensity;
        if (data.environmentRotation !== void 0)
          object.environmentRotation.fromArray(data.environmentRotation);
        break;
      case "PerspectiveCamera":
        object = new PerspectiveCamera(data.fov, data.aspect, data.near, data.far);
        if (data.focus !== void 0)
          object.focus = data.focus;
        if (data.zoom !== void 0)
          object.zoom = data.zoom;
        if (data.filmGauge !== void 0)
          object.filmGauge = data.filmGauge;
        if (data.filmOffset !== void 0)
          object.filmOffset = data.filmOffset;
        if (data.view !== void 0)
          object.view = Object.assign({}, data.view);
        break;
      case "OrthographicCamera":
        object = new OrthographicCamera(data.left, data.right, data.top, data.bottom, data.near, data.far);
        if (data.zoom !== void 0)
          object.zoom = data.zoom;
        if (data.view !== void 0)
          object.view = Object.assign({}, data.view);
        break;
      case "AmbientLight":
        object = new AmbientLight(data.color, data.intensity);
        break;
      case "DirectionalLight":
        object = new DirectionalLight(data.color, data.intensity);
        break;
      case "PointLight":
        object = new PointLight(data.color, data.intensity, data.distance, data.decay);
        break;
      case "RectAreaLight":
        object = new RectAreaLight(data.color, data.intensity, data.width, data.height);
        break;
      case "SpotLight":
        object = new SpotLight(data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay);
        break;
      case "HemisphereLight":
        object = new HemisphereLight(data.color, data.groundColor, data.intensity);
        break;
      case "LightProbe":
        object = new LightProbe().fromJSON(data);
        break;
      case "SkinnedMesh":
        geometry = getGeometry(data.geometry);
        material = getMaterial(data.material);
        object = new SkinnedMesh(geometry, material);
        if (data.bindMode !== void 0)
          object.bindMode = data.bindMode;
        if (data.bindMatrix !== void 0)
          object.bindMatrix.fromArray(data.bindMatrix);
        if (data.skeleton !== void 0)
          object.skeleton = data.skeleton;
        break;
      case "Mesh":
        geometry = getGeometry(data.geometry);
        material = getMaterial(data.material);
        object = new Mesh(geometry, material);
        break;
      case "InstancedMesh": {
        geometry = getGeometry(data.geometry);
        material = getMaterial(data.material);
        const count = data.count;
        const instanceMatrix = data.instanceMatrix;
        const instanceColor = data.instanceColor;
        object = new InstancedMesh(geometry, material, count);
        object.instanceMatrix = new InstancedBufferAttribute(new Float32Array(instanceMatrix.array), 16);
        if (instanceColor !== void 0)
          object.instanceColor = new InstancedBufferAttribute(new Float32Array(instanceColor.array), instanceColor.itemSize);
        break;
      }
      case "BatchedMesh":
        geometry = getGeometry(data.geometry);
        material = getMaterial(data.material);
        object = new BatchedMesh(data.maxGeometryCount, data.maxVertexCount, data.maxIndexCount, material);
        object.geometry = geometry;
        object.perObjectFrustumCulled = data.perObjectFrustumCulled;
        object.sortObjects = data.sortObjects;
        object._drawRanges = data.drawRanges;
        object._reservedRanges = data.reservedRanges;
        object._visibility = data.visibility;
        object._active = data.active;
        object._bounds = data.bounds.map((bound) => {
          const box = new Box3();
          box.min.fromArray(bound.boxMin);
          box.max.fromArray(bound.boxMax);
          const sphere = new Sphere();
          sphere.radius = bound.sphereRadius;
          sphere.center.fromArray(bound.sphereCenter);
          return {
            boxInitialized: bound.boxInitialized,
            box,
            sphereInitialized: bound.sphereInitialized,
            sphere
          };
        });
        object._maxGeometryCount = data.maxGeometryCount;
        object._maxVertexCount = data.maxVertexCount;
        object._maxIndexCount = data.maxIndexCount;
        object._geometryInitialized = data.geometryInitialized;
        object._geometryCount = data.geometryCount;
        object._matricesTexture = getTexture(data.matricesTexture.uuid);
        break;
      case "LOD":
        object = new LOD();
        break;
      case "Line":
        object = new Line(getGeometry(data.geometry), getMaterial(data.material));
        break;
      case "LineLoop":
        object = new LineLoop(getGeometry(data.geometry), getMaterial(data.material));
        break;
      case "LineSegments":
        object = new LineSegments(getGeometry(data.geometry), getMaterial(data.material));
        break;
      case "PointCloud":
      case "Points":
        object = new Points(getGeometry(data.geometry), getMaterial(data.material));
        break;
      case "Sprite":
        object = new Sprite(getMaterial(data.material));
        break;
      case "Group":
        object = new Group();
        break;
      case "Bone":
        object = new Bone();
        break;
      default:
        object = new Object3D();
    }
    object.uuid = data.uuid;
    if (data.name !== void 0)
      object.name = data.name;
    if (data.matrix !== void 0) {
      object.matrix.fromArray(data.matrix);
      if (data.matrixAutoUpdate !== void 0)
        object.matrixAutoUpdate = data.matrixAutoUpdate;
      if (object.matrixAutoUpdate) {
        object.matrix.decompose(object.position, object.quaternion, object.scale);
        if (isNaN(object.quaternion.x)) {
          object.quaternion.set(0, 0, 0, 1);
        }
      }
    } else {
      if (data.position !== void 0)
        object.position.fromArray(data.position);
      if (data.rotation !== void 0)
        object.rotation.fromArray(data.rotation);
      if (data.quaternion !== void 0)
        object.quaternion.fromArray(data.quaternion);
      if (data.scale !== void 0)
        object.scale.fromArray(data.scale);
    }
    if (data.up !== void 0)
      object.up.fromArray(data.up);
    if (data.castShadow !== void 0)
      object.castShadow = data.castShadow;
    if (data.receiveShadow !== void 0)
      object.receiveShadow = data.receiveShadow;
    if (data.shadow) {
      if (data.shadow.bias !== void 0)
        object.shadow.bias = data.shadow.bias;
      if (data.shadow.normalBias !== void 0)
        object.normalBias = data.shadow.normalBias;
      if (data.shadow.radius !== void 0)
        object.radius = data.shadow.radius;
      if (data.shadow.mapSize !== void 0)
        object.mapSize.fromArray(data.shadow.mapSize);
      if (data.shadow.camera !== void 0) {
        object.camera = this.parseObject(data.shadow.camera);
      }
    }
    if (data.visible !== void 0)
      object.visible = data.visible;
    if (data.frustumCulled !== void 0)
      object.frustumCulled = data.frustumCulled;
    if (data.renderOrder !== void 0)
      object.renderOrder = data.renderOrder;
    if (data.userData !== void 0)
      object.userData = data.userData;
    if (data.layers !== void 0)
      object.layers.mask = data.layers;
    if (data.children !== void 0) {
      const children = data.children;
      for (let i = 0; i < children.length; i++) {
        object.add(this.parseObject(children[i], geometries, materials, textures, animations));
      }
    }
    if (data.animations !== void 0) {
      const objectAnimations = data.animations;
      for (let i = 0; i < objectAnimations.length; i++) {
        const uuid = objectAnimations[i];
        object.animations.push(animations[uuid]);
      }
    }
    if (data.type === "LOD") {
      if (data.autoUpdate !== void 0)
        object.autoUpdate = data.autoUpdate;
      const levels = data.levels;
      for (let l = 0; l < levels.length; l++) {
        const level = levels[l];
        const child = object.getObjectByProperty("uuid", level.object);
        if (child !== void 0) {
          object.addLevel(child, level.distance);
        }
      }
    } else if (data.type === "QuarksPrefab") {
      object.resolveReferences(object);
    }
    return object;
  }
}
class QuarksUtil {
  static runOnAllParticleEmitters(obj, func) {
    obj.traverse((child) => {
      if (child.type === "ParticleEmitter") {
        func(child);
      }
    });
    if (obj.type === "ParticleEmitter") {
      func(obj);
    }
  }
  static addToBatchRenderer(obj, batchRenderer) {
    QuarksUtil.runOnAllParticleEmitters(obj, (ps) => {
      batchRenderer.addSystem(ps.system);
    });
  }
  static play(obj) {
    QuarksUtil.runOnAllParticleEmitters(obj, (ps) => {
      ps.system.play();
    });
  }
  static stop(obj) {
    QuarksUtil.runOnAllParticleEmitters(obj, (ps) => {
      ps.system.stop();
    });
  }
  static setAutoDestroy(obj, value) {
    QuarksUtil.runOnAllParticleEmitters(obj, (ps) => {
      ps.system.autoDestroy = value;
    });
  }
  static endEmit(obj) {
    QuarksUtil.runOnAllParticleEmitters(obj, (ps) => {
      ps.system.endEmit();
    });
  }
  static restart(obj) {
    QuarksUtil.runOnAllParticleEmitters(obj, (ps) => {
      ps.system.restart();
    });
  }
  static pause(obj) {
    QuarksUtil.runOnAllParticleEmitters(obj, (ps) => {
      ps.system.pause();
    });
  }
}
registerShaderChunks();
loadPlugin(MeshSurfaceEmitterPlugin);
console.log("%c Particle system powered by three.quarks. https://quarks.art/", "font-size: 14px; font-weight: bold;");
class libQuarks {
  constructor(scene) {
    this.scene = scene;
    this.batchRenderer = new BatchedRenderer();
    this.clock = new THREE.Clock();
    scene.add(this.batchRenderer);
  }
  /**
   * scene, rendererに追加
   * @param {*} obj 
   */
  add(obj) {
    if (obj instanceof THREE.Group) {
      QuarksUtil.addToBatchRenderer(obj, this.batchRenderer);
      this.scene.add(obj);
    } else if (obj instanceof ParticleSystem) {
      this.batchRenderer.addSystem(obj);
      this.scene.add(obj.emitter);
    }
  }
  /**
   * scene, rendererから削除
   */
  remove(obj) {
    if (obj instanceof THREE.Group) {
      this.batchRenderer.deleteSystem(obj);
      this.scene.remove(obj);
    } else if (obj instanceof ParticleSystem) {
      this.batchRenderer.deleteSystem(obj);
      this.scene.remove(obj.emitter);
    }
  }
  /**
   * jsonの読み込み
   * json_url (htmlファイルからの相対位置)
   */
  async loadJson(json_url, options = {}) {
    const loader = new QuarksLoader();
    return new Promise((resolve, reject) => {
      loader.load(json_url, (obj) => {
        if (obj.type === "Scene") {
          const group = new THREE.Group();
          while (obj.children.length > 0) {
            group.add(obj.children[0]);
          }
          obj = group;
        }
        if (options.position) {
          obj.position.copy(options.position);
        }
        resolve(obj);
      });
    });
  }
  /**
   * 爆発エフェクトを作成
   * @param {THREE.Vector3} position - 爆発位置
   * @param {Object} options - オプション設定
   */
  createExplosion(position, options = {}) {
    const config = {
      duration: options.duration || 3,
      particleCount: options.particleCount || 50,
      speed: options.speed || [0.5, 2],
      size: options.size || [5e-3, 0.02],
      ...options
    };
    const explosionConfig = {
      duration: config.duration,
      looping: false,
      startLife: new IntervalValue(0.8, 1),
      startSpeed: new IntervalValue(config.speed[0], config.speed[1]),
      startSize: new IntervalValue(config.size[0], config.size[1]),
      // startColor: new ConstantColor(config.color),
      worldSpace: true,
      maxParticle: config.particleCount,
      emissionOverTime: new ConstantValue(0),
      emissionBursts: [{
        time: 0,
        count: new ConstantValue(config.particleCount),
        cycle: 1,
        interval: 0,
        probability: 1
      }],
      shape: new PointEmitter(),
      material: new THREE.MeshBasicMaterial({
        color: 16777215,
        transparent: true,
        blending: THREE.NormalBlending
        //THREE.AdditiveBlending
      }),
      renderMode: RenderMode.Billboard
    };
    const explosion = new ParticleSystem(explosionConfig);
    const rgba = options.rgba ?? [1, 0, 0, 1];
    const slide_rgba = (rgba2, offset) => {
      return rgba2.map((e, i) => i === 3 ? e : Math.max(0, Math.min(1, e + offset)));
    };
    explosion.addBehavior(new ColorOverLife(
      new ColorRange(
        new THREE.Vector4(...slide_rgba(rgba, 0.2)),
        new THREE.Vector4(...slide_rgba(rgba, -0.2))
      )
    ));
    explosion.addBehavior(new SizeOverLife(
      new PiecewiseBezier([[new Bezier(0.3, 1.5, 2, 0), 0]])
    ));
    explosion.emitter.position.copy(position);
    return explosion;
  }
  /**
   * オブジェクトを爆発させる
   * @param {THREE.Mesh} mesh - 爆発させるメッシュ
   * @param {Object} options - 爆発オプション
   */
  explodeObject(mesh, options = {}) {
    const particles = this.createExplosion(mesh.position, options);
    this.add(particles);
    this.scene.remove(mesh);
    return particles;
  }
  /**
   * 毎フレーム呼び出し必須
   */
  update() {
    this.batchRenderer.update(this.clock.getDelta());
  }
}
export {
  libQuarks
};
