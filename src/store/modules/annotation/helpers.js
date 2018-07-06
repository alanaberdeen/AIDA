// Helper functions for managing annotation state
export default {
  // Function that, given a paperJS path item, return the segments in the
  // format specified by the AIDA annotation schema
  getSegments (item) {
    let segments = []
    item.segments.forEach(segment => {
      segments.push({
        point: {
          x: segment.point.x,
          y: segment.point.y
        },
        handleIn: {
          x: segment.handleIn.x,
          y: segment.handleIn.y
        },
        handleOut: {
          x: segment.handleOut.x,
          y: segment.handleOut.y
        }
      })
    })

    return segments
  },

  // Function that, given a paperJS path item, returns the stroke and fill color
  // as an object
  getColor (item) {
    return {
      fill: item.fillColor !== null ? {
        hue: item.fillColor.hue,
        saturation: item.fillColor.saturation,
        lightness: item.fillColor.lightness,
        alpha: item.fillColor.alpha
      } : null,
      stroke: item.strokeColor !== null ? {
        hue: item.strokeColor.hue,
        saturation: item.strokeColor.saturation,
        lightness: item.strokeColor.lightness,
        alpha: item.strokeColor.alpha
      } : null
    }
  },

  // Function that returns default set of colors
  defaultColors () {
    return [{
      fill: {
        hue: 170,
        saturation: 0.44,
        lightness: 0.69,
        alpha: 0.7
      },
      stroke: {
        hue: 170,
        saturation: 0.44,
        lightness: 0.69,
        alpha: 1
      }
    }, {
      fill: {
        hue: 60,
        saturation: 1,
        lightness: 0.85,
        alpha: 0.7
      },
      stroke: {
        hue: 60,
        saturation: 1,
        lightness: 0.85,
        alpha: 1
      }
    }, {
      fill: {
        hue: 248,
        saturation: 0.3,
        lightness: 0.79,
        alpha: 0.7
      },
      stroke: {
        hue: 248,
        saturation: 0.3,
        lightness: 0.79,
        alpha: 1
      }
    }, {
      fill: {
        hue: 6,
        saturation: 0.94,
        lightness: 0.72,
        alpha: 0.7
      },
      stroke: {
        hue: 6,
        saturation: 0.94,
        lightness: 0.72,
        alpha: 1
      }
    }, {
      fill: {
        hue: 205,
        saturation: 0.49,
        lightness: 0.66,
        alpha: 0.7
      },
      stroke: {
        hue: 205,
        saturation: 0.49,
        lightness: 0.66,
        alpha: 1
      }
    }, {
      fill: {
        hue: 32,
        saturation: 0.97,
        lightness: 0.69,
        alpha: 0.7
      },
      stroke: {
        hue: 32,
        saturation: 0.97,
        lightness: 0.69,
        alpha: 1
      }
    }, {
      fill: {
        hue: 82,
        saturation: 0.64,
        lightness: 0.64,
        alpha: 0.7
      },
      stroke: {
        hue: 82,
        saturation: 0.64,
        lightness: 0.64,
        alpha: 1
      }
    }, {
      fill: {
        hue: 329,
        saturation: 0.89,
        lightness: 0.9,
        alpha: 0.7
      },
      stroke: {
        hue: 329,
        saturation: 0.89,
        lightness: 0.9,
        alpha: 1
      }
    }, {
      fill: {
        hue: 0,
        saturation: 0,
        lightness: 0.85,
        alpha: 0.7
      },
      stroke: {
        hue: 0,
        saturation: 0,
        lightness: 0.85,
        alpha: 1
      }
    }, {
      fill: {
        hue: 299,
        saturation: 0.32,
        lightness: 0.62,
        alpha: 0.7
      },
      stroke: {
        hue: 299,
        saturation: 0.32,
        lightness: 0.62,
        alpha: 1
      }
    }]
  }
}
