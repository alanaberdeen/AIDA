---
description: Manual annotation Tools currently available in AIDA.
---

# Tools

## Lock-view 

The **Lock-view Tool** allows you to toggle the controls for pan and zoom. The image and annotation content are synced and adjusted together.

{% hint style="info" %}
Tool shortcut key: **L**
{% endhint %}

## Move 

The **Move Tool** allows you to select objects on your page. Once selected, you can move and resize the object.

To select multiple objects, do one of the following:

* With the **Move Tool** selected, shift-click each object on the page in turn to select them.
* With the **Move Tool** selected, drag to draw a marquee around the object\(s\).

{% hint style="info" %}
Tool shortcut key: **V**
{% endhint %}

## Node

The **Node Tool** is used to edit existing curves and shapes. 

First, select an object with the node tool, the anchor nodes defining the path or shape will be displayed. You can either adjust the anchor node itself by dragging it to a different position or, alternatively adjust the node's handles by selecting the anchor and pulling the displayed handles. 

{% hint style="info" %}
Tool shortcut key: **A**
{% endhint %}

## Circle

The **Circle Tool** is used to draw circular objects. 

Circles are dropped into the current active annotation layer when the mouse is clicked. The default circle size can be adjusted by dragging the tool. 

{% hint style="info" %}
Tool shortcut key: **C**
{% endhint %}

## Rectangle

The **Rectangle Tool** is commonly used to define regions of interest or bounding boxes around objects in an image. 

Click and drag to define the size of the shape. The anchor points can then be manually adjusted using the [Node Tool](tools.md#node). 

{% hint style="info" %}
Tool shortcut key: **R**
{% endhint %}

## Path

The **Path Tool** is used to precisely draw paths and shapes. 

To plot a path, click to drop an anchor point. To finish drawing a path click once more on the final node. To finish and close the path click on the first node. 

The path is _smoothed_ after each anchor point is added. 

{% hint style="info" %}
Tool shortcut key: **P**
{% endhint %}

## Pencil

The **Pencil Tool** is use to draw free-hand paths. 

As you draw, nodes are automatically created. They can be adjusted with the [Node Tool](tools.md#node). 

To finish drawing the path release the mouse. To draw a closed path, release the mouse at the first node in the path. 

{% hint style="info" %}
Tool shortcut key: **M**
{% endhint %}

## Count

The **Count Tool** is used to count the number of objects in a region. It is currently restricted to counting circular objects created using the [Circle Tool](tools.md#circle). 

## Delete

The **Delete Tool** is used to delete objects via clicking on them. Objects are removed from the annotation markup project. 

