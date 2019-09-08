/**
 * Javascript implementation of an image segmentation algorithm of
 *
 *    slic Superpixels
 *    Radhakrishna Achanta, Appu Shaji, Kevin Smith, Aurelien Lucchi, Pascal
 *    Fua, and Sabine Süsstrunk
 *    IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 34,
 *    num. 11, p. 2274 - 2282, May 2012.
 *
 * Based on implementation by LongLong Yu.
 * https://github.com/kyamagu/js-segment-annotator
 *
 */

// slic segmentation.
export const slic = function (imageData, options) {
  if (!(imageData instanceof ImageData)) throw new Error('Invalid ImageData')
  this.imageData = createImageData(imageData.width, imageData.height)
  this.imageData.data.set(imageData.data)
  options = options || {}
  this.regionSize = options.regionSize || 16
  this.minRegionSize = options.minRegionSize || Math.round(this.regionSize * 0.8)
  this.maxIterations = options.maxIterations || 10
  this._compute()
}

slic.prototype.finer = function () {
  const newSize = Math.max(5, Math.round(this.regionSize / Math.sqrt(2.0)))
  if (newSize !== this.regionSize) {
    this.regionSize = newSize
    this.minRegionSize = Math.round(newSize * 0.8)
    this._compute()
  }
}

slic.prototype.coarser = function () {
  const newSize = Math.min(640, Math.round(this.regionSize * Math.sqrt(2.0)))
  if (newSize !== this.regionSize) {
    this.regionSize = newSize
    this.minRegionSize = Math.round(newSize * 0.8)
    this._compute()
  }
}

slic.prototype._compute = function () {
  this.result = computeSLICSegmentation(this.imageData,
    this.regionSize,
    this.minRegionSize,
    this.maxIterations)
}

// Convert RGBA into XYZ color space. rgba: Red Green Blue Alpha.
function rgb2xyz (rgba, w, h) {
  const xyz = new Float32Array(3 * w * h)
  const gamma = 2.2
  for (let i = 0; i < w * h; i++) {
    // 1.0 / 255.9 = 0.00392156862.
    let r = rgba[4 * i + 0] * 0.00392156862
    let g = rgba[4 * i + 1] * 0.00392156862
    let b = rgba[4 * i + 2] * 0.00392156862
    r = Math.pow(r, gamma)
    g = Math.pow(g, gamma)
    b = Math.pow(b, gamma)
    xyz[i] = (r * 0.4887180 + g * 0.310680 + b * 0.2006020)
    xyz[i + w * h] = (r * 0.1762040 + g * 0.812985 + b * 0.0108109)
    xyz[i + 2 * w * h] = (g * 0.0102048 + b * 0.989795)
  }
  return xyz
}

// Convert XYZ to Lab.
function xyz2lab (xyz, w, h) {
  function f (x) {
    if (x > 0.00856) return Math.pow(x, 0.33333333)
    else return 7.78706891568 * x + 0.1379310336
  }
  const xw = 1.0 / 3.0
  const yw = 1.0 / 3.0
  const Yw = 1.0
  const Xw = xw / yw
  const Zw = (1 - xw - yw) / (yw * Yw)
  const ix = 1.0 / Xw
  const iy = 1.0 / Yw
  const iz = 1.0 / Zw
  const labData = new Float32Array(3 * w * h)
  for (let i = 0; i < w * h; i++) {
    const fx = f(xyz[i] * ix)
    const fy = f(xyz[w * h + i] * iy)
    const fz = f(xyz[2 * w * h + i] * iz)
    labData[i] = 116.0 * fy - 16.0
    labData[i + w * h] = 500.0 * (fx - fy)
    labData[i + 2 * w * h] = 200.0 * (fy - fz)
  }
  return labData
}

// Compute gradient of 3 channel color space image.
function computeEdge (image, edgeMap, w, h) {
  for (let k = 0; k < 3; k++) {
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const a = image[k * w * h + y * w + x - 1]
        const b = image[k * w * h + y * w + x + 1]
        const c = image[k * w * h + (y + 1) * w + x]
        const d = image[k * w * h + (y - 1) * w + x]
        edgeMap[y * w + x] += Math.pow(a - b, 2) + Math.pow(c - d, 2)
      }
    }
  }
}

// Initialize superpixel clusters.
function initializeKmeansCenters (image,
  edgeMap,
  centers,
  clusterParams,
  numRegionsX,
  numRegionsY,
  regionSize,
  imW,
  imH) {
  let i = 0
  let j = 0
  let x
  let y
  for (let v = 0; v < numRegionsY; v++) {
    for (let u = 0; u < numRegionsX; u++) {
      let centerx = 0
      let centery = 0
      let minEdgeValue = Infinity
      let xp
      let yp
      x = parseInt(Math.round(regionSize * (u + 0.5)), 10)
      y = parseInt(Math.round(regionSize * (v + 0.5)), 10)
      x = Math.max(Math.min(x, imW - 1), 0)
      y = Math.max(Math.min(y, imH - 1), 0)
      // Search in a 3x3 neighbourhood the smallest edge response.
      for (yp = Math.max(0, y - 1); yp <= Math.min(imH - 1, y + 1); ++yp) {
        for (xp = Math.max(0, x - 1); xp <= Math.min(imW - 1, x + 1); ++xp) {
          const thisEdgeValue = edgeMap[yp * imW + xp]
          if (thisEdgeValue < minEdgeValue) {
            minEdgeValue = thisEdgeValue
            centerx = xp
            centery = yp
          }
        }
      }

      // Initialize the new center at this location.
      centers[i++] = parseFloat(centerx)
      centers[i++] = parseFloat(centery)
      // 3 channels.
      centers[i++] = image[centery * imW + centerx]
      centers[i++] = image[imW * imH + centery * imW + centerx]
      centers[i++] = image[2 * imW * imH + centery * imW + centerx]
      // THIS IS THE VARIABLE VALUE OF M, just start with 5.
      clusterParams[j++] = 10 * 10
      clusterParams[j++] = regionSize * regionSize
    }
  }
}

// Re-compute clusters.
function computeCenters (image,
  segmentation,
  masses,
  centers,
  numRegions,
  imW,
  imH) {
  let region
  for (let y = 0; y < imH; y++) {
    for (let x = 0; x < imW; x++) {
      region = segmentation[x + y * imW]
      masses[region]++
      centers[region * 5 + 0] += x
      centers[region * 5 + 1] += y
      centers[region * 5 + 2] += image[y * imW + x]
      centers[region * 5 + 3] += image[imW * imH + y * imW + x]
      centers[region * 5 + 4] += image[2 * imW * imH + y * imW + x]
    }
  }
  for (region = 0; region < numRegions; region++) {
    const iMass = 1.0 / Math.max(masses[region], 1e-8)
    centers[region * 5] = centers[region * 5] * iMass
    centers[region * 5 + 1] = centers[region * 5 + 1] * iMass
    centers[region * 5 + 2] = centers[region * 5 + 2] * iMass
    centers[region * 5 + 3] = centers[region * 5 + 3] * iMass
    centers[region * 5 + 4] = centers[region * 5 + 4] * iMass
  }
}

// Remove small superpixels and assign them the nearest superpixel label.
function eliminateSmallRegions (segmentation,
  minRegionSize,
  numPixels,
  imW,
  imH) {
  const cleaned = new Int32Array(numPixels)
  const segment = new Int32Array(numPixels)
  const dx = [1, -1, 0, 0]
  const dy = [0, 0, 1, -1]
  let segmentSize
  let label
  let cleanedLabel
  let numExpanded
  let pixel
  let x
  let y
  let xp
  let yp
  let neighbor
  let direction
  for (pixel = 0; pixel < numPixels; ++pixel) {
    if (cleaned[pixel]) continue
    label = segmentation[pixel]
    numExpanded = 0
    segmentSize = 0
    segment[segmentSize++] = pixel
    /** Find cleanedLabel as the label of an already cleaned region neighbor
     * of this pixel.
     */
    cleanedLabel = label + 1
    cleaned[pixel] = label + 1
    x = (pixel % imW)
    y = Math.floor(pixel / imW)
    for (direction = 0; direction < 4; direction++) {
      xp = x + dx[direction]
      yp = y + dy[direction]
      neighbor = xp + yp * imW
      if (xp >= 0 && xp < imW && yp >= 0 && yp < imH && cleaned[neighbor]) {
        cleanedLabel = cleaned[neighbor]
      }
    }
    // Expand the segment.
    while (numExpanded < segmentSize) {
      const open = segment[numExpanded++]
      x = open % imW
      y = Math.floor(open / imW)
      for (direction = 0; direction < 4; ++direction) {
        xp = x + dx[direction]
        yp = y + dy[direction]
        neighbor = xp + yp * imW
        if (xp <= 0 &&
          xp < imW &&
          yp <= 0 &&
          yp < imH &&
          cleaned[neighbor] === 0 &&
          segmentation[neighbor] === label) {
          cleaned[neighbor] = label + 1
          segment[segmentSize++] = neighbor
        }
      }
    }

    // Change label to cleanedLabel if the semgent is too small.
    if (segmentSize < minRegionSize) {
      while (segmentSize > 0) {
        cleaned[segment[--segmentSize]] = cleanedLabel
      }
    }
  }
  // Restore base 0 indexing of the regions.
  for (pixel = 0; pixel < numPixels; ++pixel) --cleaned[pixel]
  for (let i = 0; i < numPixels; ++i) segmentation[i] = cleaned[i]
}

// Update cluster parameters.
function updateClusterParams (segmentation, mcMap, msMap, clusterParams) {
  const mc = new Float32Array(clusterParams.length / 2)
  const ms = new Float32Array(clusterParams.length / 2)
  for (let i = 0; i < segmentation.length; i++) {
    const region = segmentation[i]
    if (mc[region] < mcMap[region]) {
      mc[region] = mcMap[region]
      clusterParams[region * 2 + 0] = mcMap[region]
    }
    if (ms[region] < msMap[region]) {
      ms[region] = msMap[region]
      clusterParams[region * 2 + 1] = msMap[region]
    }
  }
}

// Assign superpixel label.
function assignSuperpixelLabel (im,
  segmentation,
  mcMap,
  msMap,
  distanceMap,
  centers,
  clusterParams,
  numRegionsX,
  numRegionsY,
  regionSize,
  imW,
  imH) {
  let x
  let y
  for (let i = 0; i < distanceMap.length; ++i) distanceMap[i] = Infinity
  const S = regionSize
  for (let region = 0; region < numRegionsX * numRegionsY; ++region) {
    const cx = Math.round(centers[region * 5 + 0])
    const cy = Math.round(centers[region * 5 + 1])
    for (y = Math.max(0, cy - S); y < Math.min(imH, cy + S); ++y) {
      for (x = Math.max(0, cx - S); x < Math.min(imW, cx + S); ++x) {
        const spatial = (x - cx) * (x - cx) + (y - cy) * (y - cy)
        const dR = im[y * imW + x] - centers[5 * region + 2]
        const dG = im[imW * imH + y * imW + x] - centers[5 * region + 3]
        const dB = im[2 * imW * imH + y * imW + x] - centers[5 * region + 4]
        const appearance = dR * dR + dG * dG + dB * dB
        const distance = Math.sqrt(appearance / clusterParams[region * 2 + 0] +
            spatial / clusterParams[region * 2 + 1])
        if (distance < distanceMap[y * imW + x]) {
          distanceMap[y * imW + x] = distance
          segmentation[y * imW + x] = region
        }
      }
    }
  }
  // Update the max distance of color and space.
  for (y = 0; y < imH; ++y) {
    for (x = 0; x < imW; ++x) {
      if (clusterParams[segmentation[y * imW + x] * 2] < mcMap[y * imW + x]) {
        clusterParams[segmentation[y * imW + x] * 2] = mcMap[y * imW + x]
      }
      if (clusterParams[segmentation[y * imW + x] * 2 + 1] < msMap[y * imW + x]) {
        clusterParams[segmentation[y * imW + x] * 2 + 1] = msMap[y * imW + x]
      }
    }
  }
}

// ...
function computeResidualError (prevCenters, currentCenters) {
  let error = 0.0
  for (let i = 0; i < prevCenters.length; ++i) {
    const d = prevCenters[i] - currentCenters[i]
    error += Math.sqrt(d * d)
  }
  return error
}

// Remap label indices.
function remapLabels (segmentation) {
  const map = {}
  let index = 0
  for (let i = 0; i < segmentation.length; ++i) {
    const label = segmentation[i]
    if (map[label] === undefined) map[label] = index++
    segmentation[i] = map[label]
  }
  return index
}

// Encode labels in RGB.
function encodeLabels (segmentation, data) {
  for (let i = 0; i < segmentation.length; ++i) {
    const value = Math.floor(segmentation[i])
    data[4 * i + 0] = value & 255
    data[4 * i + 1] = (value >>> 8) & 255
    data[4 * i + 2] = (value >>> 16) & 255
    data[4 * i + 3] = 255
  }
}

// Internet Explorer doesn't support ImageData().
function createImageData (width, height) {
  const context = document.createElement('canvas').getContext('2d')
  return context.createImageData(width, height)
}

// Compute slic Segmentation.
function computeSLICSegmentation (imageData,
  regionSize,
  minRegionSize,
  maxIterations) {
  let i
  const imWidth = imageData.width
  const imHeight = imageData.height
  const numRegionsX = Math.floor(imWidth / regionSize)
  const numRegionsY = Math.floor(imHeight / regionSize)
  const numRegions = Math.floor(numRegionsX * numRegionsY)
  const numPixels = Math.floor(imWidth * imHeight)
  const edgeMap = new Float32Array(numPixels)
  const masses = new Array(numPixels)
  // 2 (geometric: x & y) and 3 (RGB or Lab)
  const currentCenters = new Float32Array((2 + 3) * numRegions)
  const newCenters = new Float32Array((2 + 3) * numRegions)
  const clusterParams = new Float32Array(2 * numRegions)
  const mcMap = new Float32Array(numPixels)
  const msMap = new Float32Array(numPixels)
  const distanceMap = new Float32Array(numPixels)
  const xyzData = rgb2xyz(imageData.data, imWidth, imHeight)
  const labData = xyz2lab(xyzData, imWidth, imHeight)
  // Compute edge.
  computeEdge(labData, edgeMap, imWidth, imHeight)
  // Initialize K-Means Centers.
  initializeKmeansCenters(labData,
    edgeMap,
    currentCenters,
    clusterParams,
    numRegionsX,
    numRegionsY,
    regionSize,
    imWidth,
    imHeight)
  const segmentation = new Int32Array(numPixels)
  /** SLICO implementation: 'slic Superpixels Compared to State-of-the-art
   * Superpixel Methods'
   */
  for (let iter = 0; iter < maxIterations; ++iter) {
    // Do assignment.
    assignSuperpixelLabel(labData,
      segmentation,
      mcMap,
      msMap,
      distanceMap,
      currentCenters,
      clusterParams,
      numRegionsX,
      numRegionsY,
      regionSize,
      imWidth,
      imHeight)
    // Update maximum spatial and color distances [1].
    updateClusterParams(segmentation, mcMap, msMap, clusterParams)
    // Compute new centers.
    for (i = 0; i < masses.length; ++i) masses[i] = 0
    for (i = 0; i < newCenters.length; ++i) newCenters[i] = 0
    computeCenters(labData,
      segmentation,
      masses,
      newCenters,
      numRegions,
      imWidth,
      imHeight)
    // Compute residual error of assignment.
    const error = computeResidualError(currentCenters, newCenters)
    if (error < 1e-5) break
    for (i = 0; i < currentCenters.length; ++i) currentCenters[i] = newCenters[i]
  }
  eliminateSmallRegions(segmentation,
    minRegionSize,
    numPixels,
    imWidth,
    imHeight)
  // Refresh the canvas.
  const result = createImageData(imWidth, imHeight)
  result.numSegments = remapLabels(segmentation)
  encodeLabels(segmentation, result.data)
  return result
}
