---
layout: post
title: Label Driven Subdivision Painting
tags: [Modeling, Subdivision]
author: Phil
---


In this post I describe some of the ideas and details that went into the
subdivision application I have created for my CPSC 689 course project.
In particular, I provide motivation for an adaptive subdivision scheme,
highlight where the ideas for implementation came from, 
outline the important concepts important to my implementation, show images of what
using the application is like, and conclude with shortcomings
and potential modifications.
The associated codebase can be found
[on Github](https://github.com/philliptee/label_driven_subdivision).
Also note that some figures in the post are **_animations_**.
Click on them to freeze and and unfreeze. When a figure is not
frozen, horizonal mouseover movements will scroll through the frames.

## Introduction

<!-- FIGURE 1 -->
{% include dropboxVideo.html 
  fileid="7657o4zyx8qarl8/smooth_surface.mp4"
  caption="Figure 1: Smoothing a mesh via three <br /> iterations of Catmull-Clark subdivision" 
%}
<script>
smooth = new DropboxVideo(fileid="7657o4zyx8qarl8/smooth_surface.mp4", start=0, width=300, pos="right");
video_players.video_players.push(smooth);
</script>

Most real world objects are smooth. In computer graphics, shading models that
interpolate mesh face normals can only get you so far in simulating surface smoothness.
Mesh subdivision addresses
the issue of reproducing the smoothness of real world objects. 
A subdivision algorithm takes an input mesh and
splits faces, moves vertices, returning a modified mesh such that
the mesh better approximates a smooth surface version of the original.
The mesh of a surface in Figure 1 gets progressively smoother after each iteration of
subdivision.

While the subdivision of tensor product surfaces
can use the algorithms of B-spline curves, it
does not suffice for subdividing meshes with arbitrary topology,
i.e., polygon meshes that cannot be completely decomposed 
into u-curves and v-curves.
The surface on the left of Figure 2 is a tensor product surface with
visible u-curves and v-curves. On the right, the mesh does
not have this kind of regular structure.

<!-- FIGURE 2 -->
{% include dropboxVideo.html 
  fileid="oqsnkw9hg6f8ein/mesh_curves.mp4"
  caption="Figure 2: The tensor-product surface on the left  
  is composed of only u-curves and v-curves, and the pig head
  on the right is a different beast; u-curves and v-curves would disappear into irregular vertices" 
%}
<script>
mesh_curves = new DropboxVideo(fileid="oqsnkw9hg6f8ein/mesh_curves.mp4", start=3, width=640, pos="center");
video_players.video_players.push(mesh_curves);
</script>

There now exist a handful of popular and useful subdivision
schemes for arbitrary polygon meshes. One popular scheme is
Catmull-Clark subdivision.
In our modeling course it is presented as face splits followed by
vertex repositioning. Figure 3 visualizes face splitting.
Note that the new vertices have an overline. To distinguish
between the types of new vertices we'll refer
to $$v_1,v_2,v_3,$$ and $v_4$ as vertex-vertices, $v_5,v_6,v_7,$
and $v_8$ as edge-vertices, and $v_9$ as the face-vertex.
\cref{fig:pos_update} visualizes the vertices and associated weights used in
the new position calculation for the three types of
new vertices. I use different notation for edge-vertices and
face-vertices in this figure to better orient the vertex
that is having it's new position calculated.

## Related Work

## Implementation

## Results

## Conclusion