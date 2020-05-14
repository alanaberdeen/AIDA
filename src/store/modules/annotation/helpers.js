import paper from 'paper'

export default {
  // Default set of colors
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
  },

  // Input:  an AIDA item
  // Output: none (draws the item on the currently active layer in the paperJS
  //         instance)
  drawItem (item) {
    if (item) {
      let newPaperItem
      if (item.type === 'circle') {
        newPaperItem = new paper.Shape.Circle({
          center: item.center,
          radius: item.radius,
          data: {
            type: 'circle',
            countable: true,
            class: item.class,
            data: item.data
          },
          locked: item.locked
        })
        this.drawItemColor(newPaperItem, item)
      } else if (item.type === 'rectangle') {
        newPaperItem = new paper.Shape.Rectangle({
          point: [item.x, item.y],
          size: [item.width, item.height],
          data: {
            type: 'rectangle',
            class: item.class,
            data: item.data
          },
          locked: item.locked
        })
        this.drawItemColor(newPaperItem, item)
      } else if (item.type === 'path') {
        newPaperItem = new paper.Path({
          segments: item.segments,
          closed: item.closed ? item.closed : false,
          data: {
            type: 'path',
            class: item.class,
            data: item.data
          },
          locked: item.locked
        })
        this.drawItemColor(newPaperItem, item)
      } else if (item.type === 'cpath') {
        const childrenItems = []
        item.children.forEach(child => {
          const childItem = this.drawItem(child)
          const childItemPath = childItem.toPath()
          childItem.remove()
          childrenItems.push(childItemPath)
        })
        newPaperItem = new paper.CompoundPath({
          children: childrenItems,
          fillRule: 'evenodd',
          data: {
            type: 'cpath',
            class: item.class,
            data: item.data
          },
          locked: item.locked
        })
        this.drawItemColor(newPaperItem, item)
      } else if (item.type === 'raster') {
        const itemPosition = Object.prototype.hasOwnProperty.call(item, 'position') ? new paper.Point(item.position.x, item.position.y) : new paper.Point(0, 0)
        newPaperItem = new paper.Raster({
          crossOrigin: 'anonymous',
          source: item.source,
          position: itemPosition,
          data: {
            type: 'raster',
            countable: false,
            class: item.class,
            data: item.data
          },
          locked: item.locked
        })
      }
      newPaperItem.strokeScaling = false
      return newPaperItem
    }
  },

  getItemState (item) {
    if (item.data.type === 'circle') {
      return {
        class: item.data.class,
        type: 'circle',
        color: this.getColor(item),
        center: {
          x: item.position.x,
          y: item.position.y
        },
        radius: item.bounds.width / 2,
        locked: item.locked,
        data: item.data.data
      }
    } else if (item.data.type === 'rectangle') {
      return {
        ...item.data,
        color: this.getColor(item),
        x: item.bounds.x,
        y: item.bounds.y,
        width: item.bounds.width,
        height: item.bounds.height,
        locked: item.locked
      }
    } else if (item.data.type === 'path') {
      return {
        class: item.data.class,
        type: 'path',
        color: this.getColor(item),
        segments: this.getSegments(item),
        closed: item.closed,
        locked: item.locked,
        data: item.data.data
      }
    } else if (item.data.type === 'cpath') {
      const childrenItemsState = []
      item.children.forEach(child => { childrenItemsState.push(this.getItemState(child)) })
      return {
        class: item.data.class,
        type: 'cpath',
        color: this.getColor(item),
        children: childrenItemsState,
        locked: item.locked,
        data: item.data.data
      }
    // Check if the item is meant to represent an edit to an image. For
    // example when editing a segmentation mask that is tiled and overlayed
    // on the project image.
    } else if (item.data.type === 'imageEdit') {
      const rasterizedItem = item.rasterize()
      const itemDataURL = rasterizedItem.toDataURL()
      return {
        class: item.data.class,
        type: 'raster',
        source: itemDataURL,
        position: {
          x: item.position.x,
          y: item.position.y
        },
        data: item.data.data
      }
    // If the item is a raster, we need to incorporate edits to it.
    // Therefore, necessary to 'rasterise' this image and it's combined edits.
    } else if (item.data.type === 'raster') {
      const editItems = item.layer.getItems({
        match: item => { return item.locked },
        overlapping: item.bounds
      })

      // Add the original raster item to the array. Make sure to include
      // as the first child so that the edits are displayed above it in the
      // project hierarchy
      editItems.unshift(item)

      // When a new group is created the default behaviour is to place is at
      // the top of the active layer. Avoid this by explicitly sending it to
      // the back of the project hierarchy.
      const itemsToRaster = new paper.Group(editItems)
      itemsToRaster.sendToBack()

      // Rasterize the image and it's edits. Convert to a base64 encoded URL.
      const rasterizedGroup = itemsToRaster.rasterize(item.resolution.height, false)
      const rasterizedData = rasterizedGroup.toDataURL()

      return {
        class: item.data.class,
        type: 'raster',
        source: rasterizedData,
        position: {
          x: item.position.x,
          y: item.position.y
        },
        data: item.data.data
      }
    }
  },

  // Input: paperJS item
  // Output: Segments in the format specified by the AIDA annotation schema
  getSegments (item) {
    const segments = []
    for (let i = 0, len = item.segments.length; i < len; i++) {
      const segment = item.segments[i]
      if (segment.hasHandles()) {
        segments.push([
          [segment.point.x, segment.point.y],
          [segment.handleIn.x, segment.handleIn.y],
          [segment.handleOut.x, segment.handleOut.y]
        ])
      } else {
        segments.push([segment.point.x, segment.point.y])
      }
    }
    return segments
  },

  // Input: paperJS path item
  // Output: the stroke and fill color as an object
  getColor (item) {
    return {
      fill: item.fillColor ? {
        hue: item.fillColor.hue,
        saturation: item.fillColor.saturation,
        lightness: item.fillColor.lightness,
        alpha: item.fillColor.alpha
      } : null,
      stroke: item.strokeColor ? {
        hue: item.strokeColor.hue,
        saturation: item.strokeColor.saturation,
        lightness: item.strokeColor.lightness,
        alpha: item.strokeColor.alpha
      } : null
    }
  },

  drawItemColor (paperItem, stateItem) {
    const defaultColors = this.defaultColors()
    if (paperItem.closed || paperItem.className === 'Shape') {
      if (stateItem.color && stateItem.color.fill) {
        if (typeof stateItem.color.fill === 'string') {
          paperItem.fillColor = stateItem.color.fill
          paperItem.fillColor.alpha = 0.2
        } else {
          paperItem.fillColor = new paper.Color({
            hue: stateItem.color.fill.hue,
            saturation: stateItem.color.fill.saturation,
            lightness: stateItem.color.fill.lightness,
            alpha: stateItem.color.fill.alpha
          })
        }
      }
    }

    if (stateItem.color && stateItem.color.stroke) {
      if (typeof stateItem.color.stroke === 'string') {
        paperItem.strokeColor = stateItem.color.stroke
      } else {
        paperItem.strokeColor = new paper.Color({
          hue: stateItem.color.stroke.hue,
          saturation: stateItem.color.stroke.saturation,
          lightness: stateItem.color.stroke.lightness,
          alpha: stateItem.color.stroke.alpha
        })
      }
    } else {
      paperItem.strokeColor = defaultColors[paperItem.layer.index % defaultColors.length].stroke
    }
  }
}
