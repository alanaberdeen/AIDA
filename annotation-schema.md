---
description: Details of the proposed annotation markup schema for digital pathology.
---

# Annotation Schema

## Concept

We propose a standard schema to describe annotation markup in pathology imaging. By establishing a consistent standard for annotation we hope to make it easier to share different tools and algorithms between people and workflows.

##  Structure

For now, the schema is restrained to a simple case -  the **annotation markup in a single image**. The data is stored hierarchically in the following structure, each of the parts can be explored in detail below: 

* [`project`](annotation-schema.md#project) 
  * `layers`
    * [`layer`](annotation-schema.md#layer)
      * `items`
        * [`rectangle`](annotation-schema.md#rectangle)
        * [`circle`](annotation-schema.md#circle)
        * [`path`](annotation-schema.md#path)
          * `segments`
            * [`segment`](annotation-schema.md#segment)

### `project`

The top level object that holds all the items contained in the annotation project.  

| **Property** | **Type** | **Details** |
| --- | --- | --- |
| `name` | `string` | A descriptive name for the annotation project. |
| `layers` | `array` | An array of [`layer`](annotation-schema.md#layer) objects.  |

### `layer`

An object describing a layer in the project. It is often useful to separate different parts of image annotation into groups that can be independently controlled in the view.  

| **Property** | **Type** | **Details** |
| --- | --- | --- | --- |
| `name` | `string` | A descriptive name for the layer.  |
| `opacity` | `number` | The opacity of the layer as a value between `0` and `1`.  |
| `items` | `array` | An array of [`item`](annotation-schema.md#item) objects describing the annotation marks in the layer.  |

### `item`

The annotation item.  This object describes a mark in the annotation project. There are some properties that are common between all item types and further properties that are dependent on the item subtype. 

There are three different subtypes: 

1. [`rectangle`](annotation-schema.md#rectangle)
2. [`circle`](annotation-schema.md#circle)
3. [`path`](annotation-schema.md#path)  

| **Property** | **Type** | **Details** |
| --- | --- | --- |
| `class` | `string` | The item class. |
| `subType` | `string` | The item subtype. This defines how the item will be drawn. There are currently three different options; `rectangle,` `circle, path.`   |

#### `rectangle`

A rectangular`item`. Commonly used to describe a _region of interest_ or the _bounding box_ around a particular element. The properties defined below are additional to those in the base [`item`](annotation-schema.md#item). 

| **Property** | **Type** | **Details** |
| --- | --- | --- |
| `from` | [`point`](annotation-schema.md#point) | The first point defining the rectangle.  |
| `to` | [`point`](annotation-schema.md#point) | The second point defining the rectangle. |

#### `circle`

A circular `item`. The properties defined below are additional to those in the base [`item`](annotation-schema.md#item). 

| **Property** | **Type** | **Details** |
| --- | --- | --- |
| `center` | [`point`](annotation-schema.md#point) | The center point of the circle |
| `radius` | `number` | The radius of the circle |

#### `path`

A path `item`. The path is the most flexible annotation item, it is defined by a sequence of segments: points and handles that define the shape of the path. The properties defined below are additional to those in the base [`item`](annotation-schema.md#item).

| **Property** | **Type** | **Details** |
| --- | --- | --- |
| `segments` | `array` | An array of [`segment`](annotation-schema.md#segment) objects that define the path. |
| `closed` | `boolean` | Specifies whether the path is closed. If it is closed, the first and last segments are connected. |

#### `segment`

The points through which the `path` object passes. Each `segment` has an `anchorPoint` and **optional** `handleIn` and `handleOut` that describe the tangents to the path at either side of the anchor. 

| **Property** | **Type** | **Details** |
| --- | --- | --- | --- |
| `anchorPoint` | [`point`](annotation-schema.md#point) | The anchor point of the segment. |
| `handleIn` | [`point`](annotation-schema.md#point) | The handle point **relative** to the anchor point of the segment that describes the tangent **in** to the segment. |
| `handleOut` | [`point`](annotation-schema.md#point) | The handle point **relative** to the anchor point of the segment that describes the tangent **out** of the segment. |



#### `point`

The point object represents a point in the two dimensional space.

| **Property** | **Type** | **Details** |
| --- | --- | --- |
| `x` | `number` | The x coordinate of the point |
| `y` | `number` | The y coordinate of the point |

## File Format

JSON: a lightweight data format consisting of attribute-value pairs. It is easy for humans to read, language independent and simple for machines to parse and generate.



