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
outline the concepts important to my implementation, show images of what
using the application is like, and conclude with shortcomings
and potential modifications.
The associated codebase can be found
[on Github](https://github.com/philliptee/label_driven_subdivision).
Some figures in the post are *animations*.
Click on them to freeze and and unfreeze. When a figure is not
frozen, horizonal mouseover movements will scroll through the frames.
If you don't have desktop scaling you may notice that curves
in the figures are aliased. If you want to see the figures unaliased
then zoom in 200% :)

* Do not remove this line (it will not be displayed)
{:toc}

# Introduction

<!-- FIGURE 1 -->
{% include dropboxVideo.html 
  fileid="7657o4zyx8qarl8/smooth_surface.mp4"
  caption="Figure 1: Smoothing a mesh via three <br /> iterations of Catmull-Clark subdivision." 
%}
<script>
smooth = new DropboxVideo(fileid="7657o4zyx8qarl8/smooth_surface.mp4", start=0, width=300, pos="right");
video_players.video_players.push(smooth);
</script>

Most real world objects are smooth. In computer graphics, shading models that
interpolate mesh face normals can only get you so far in simulating surface smoothness.
Mesh subdivision addresses
the issue of reproducing the smoothness of real world objects. 
A subdivision algorithm takes an input mesh,
splits faces, moves vertices, and returns a modified mesh such that
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
  is composed of only u-curves and v-curves. The pig head <br />
  on the right is a different beast; u-curves and v-curves would disappear into irregular vertices." 
%}
<script>
mesh_curves = new DropboxVideo(fileid="oqsnkw9hg6f8ein/mesh_curves.mp4", start=3, width=540, pos="center");
video_players.video_players.push(mesh_curves);
</script>


<!-- FIGURE 3 -->
{% include dropboxVideo.html 
  fileid="4zdjl0rrclnkphk/split.mp4"
  caption="Figure 3: Catmull-Clark face splitting."
%}
<script>
usual_split = new DropboxVideo(fileid="4zdjl0rrclnkphk/split.mp4", start=0, width=260, pos="left");
video_players.video_players.push(usual_split);
</script>

There now exist a handful of popular and useful subdivision
schemes for arbitrary polygon meshes. One popular scheme is
Catmull-Clark subdivision.
In our modeling course it is presented as face splits followed by
vertex repositioning. Figure 3 visualizes face splitting.
Note that the new vertices have an overline. To distinguish
between the types of new vertices we'll refer
to $$v_1,v_2,v_3,$$ and $$v_4$$ as vertex-vertices, $$v_5,v_6,v_7,$$
and $$v_8$$ as edge-vertices, and $$v_9$$ as the face-vertex.
Figure 4 visualizes the vertices and associated weights used in
the new position calculation for the three types of
new vertices. I use different notation for edge-vertices and
face-vertices in this figure to better orient the vertex
that is having its new position calculated.

The repeated application of this basic Catmull-Clark subdivision
scheme, and most other schemes, sharply increases the number
of faces.
More precisely, for Catmull-Clark subdivision:
<details>
<summary> 
<i>More precisely, for Catmull-Clark subdivision: </i> 
</summary> 
<p>$$ \text{face_count_final} = \text{face_count_initial} \times 4^{lvl}.$$ </p> 
</details> 

$$ \text{face_count_final} = \text{face_count_initial} \times 4^{lvl}.$$

<!-- FIGURE 4 -->
{% include dropboxVideo.html 
  fileid="8mjrvapyjdrury7/reposition.mp4"
  caption="Figure 4: Catmull-Clark vertex position calculations."
%}
<script>
positions = new DropboxVideo(fileid="8mjrvapyjdrury7/reposition.mp4", start=0, width=410, pos="right");
video_players.video_players.push(positions);
</script>

Note that computational resources are distributed
uniformly across the mesh surface.
In practice only a fraction of the mesh is visible and
noticeably too coarse.
This means that achieving the desired amount of smoothness
in regions of interest can require paying the steep
computational cost of unnecessarily subdividing other regions.

Schemes that address this shortcoming are called "adaptive," 
referring to the idea of subdivision depths being non-uniformly
adapted to local surface properties; for example, high levels of subdivision on
regions of high curvature and low levels in flat regions.
Adaptivity of a subdivision scheme introduces at least two additional requirements
to be useful. These are the crack-free requirement and the
consistency of the limit
surface with the uniform scheme requirement. These become obvious when 
you analyze naive adaptive subdivision schemes. For example,
the surface in Figure 5 would have cracks
if only the center blue face were subdivided because the new
edge-vertices are repositioned away from the edges of the adjacent
faces.

The limit surface of any adaptive scheme should be the same as
the uniform scheme, otherwise it would be difficult to call
the original mesh a *control mesh*, as is customary.

My application is centered around the implementation of an
adaptive Catmull-Clark subdivision scheme presented in [(Yong and Cheng 2005)].
It addresses the above mentioned shortcomings.

<!-- FIGURE 5 -->
{% include dropboxVideo.html 
  fileid="rdx4jn6f3st1ec7/cracking.mp4"
  caption="Figure 5: Cracks."
%}
<script>
cracks = new DropboxVideo(fileid="rdx4jn6f3st1ec7/cracking.mp4", start=0, width=410, pos="center");
video_players.video_players.push(cracks);
</script>


# Related Work
When using the scheme from [(Yong and Cheng 2005)], regions of interest on the mesh
need to have their faces *painted* with a depth value before
subdividing.
Higher depth values will correspond to smoother regions
in the resulting mesh.
In their paper, the results show the number of faces in the output mesh
of their
adaptive scheme can be one order of magnitude lower than that of the
uniform scheme when using their limit surface error metric
to guide painting.
This reduction translates to efficiency in mesh data transfers,
surface operations, rendering, and simulation.

With my application the user can paint faces with the mouse,
paint all visible faces, or paint all faces
that have a maximum dihedral angle that is greater than some
user defined threshold (an approximation of curvature).
Beyond these simple methods of specifying regions of interest,
[(Isenberg et al. 2003)] provides a exposition of other
methods as well as a comprehensive categorization.

Yong's scheme borrows from  [(Kobbelt 1996)] in its use
of *Y elements* (see Figure 9) to avoid generating any new edge-vertices
that create cracks in the mesh. Furthermore, there is a control
mesh preprocessing step that applies a simple vertex 
labelling function to every vertex:

$$L(v) = \max(d_f ~|~ f \text{ is a bordering face})$$

Where $$d_f$$ is the painted face depth. Figure 6
presents a simple example.

<!-- FIGURE 6 -->
{% include dropboxVideo.html 
  fileid="2zga70gihq7d05i/labeling.mp4"
  caption="Figure 6: Setting vertex labels from painted face<br /> depths. Vertex  labels are set to the maximum <br />of
surrounding face depths."
%}
<script>
depth2labels = new DropboxVideo(fileid="2zga70gihq7d05i/labeling.mp4", start=0, width=340, pos="right");
video_players.video_players.push(depth2labels);
</script>

An explanation of why the limit surface is consistent with the
uniform scheme is provided in [(Yong and Cheng 2005)]. It amounts to proving
that any vertex that has its position updated does so using weights
consistent with the uniform scheme, and that the vertices associated
with those weights are valid. By valid I mean they are from
the correct iteration, one before the current,
and have also used the correct weights and vertices
in updating their position.

# Implementation
My application is written in C++ using features
from no later than C++11.

Source code is separated as specified in the table below.

Filename | Functionality 
--- | --- |
`App.cpp` | Coordinates the creation of other objects to create a coherent application for the user. |
`Object {.cpp/.h}` |Contains mesh and mesh operations.|
`LabelSubdivision {.cpp/.h}` |Implements label-driven subdivision and removal of illegal vertices.|

The logical organization is largely inspired by examples in
[*OpenGL Superbible*](https://github.com/openglsuperbible/sb7code).
I use a modified version of their mesh, application, and shader classes
in my own application.

## Mesh Data Structures
I chose to use the [*OpenMesh*](http://www.openmesh.org/) library to
represent meshes in a half-edge data structure. This representation
is advantageous over flat representations for accessing neighboring
primitives as well as
adding *auxiliary data* to the entire mesh or individual primitives
to assist algorithm control. The OpenMesh library, as well as my
source code, refers to this auxiliary data as *custom attributes*.
Using OpenMesh I add and remove custom attributes as needed. A
complete list of custom attributes are in the table below.

Mesh | Faces | Edges | Vertices
--- | --- | --- | --- |
**_map<FaceHandle, int>_** face_depths | **_Point_** centroid | **_Point_** mid_pos | **_bool_** v_update|
**_set\<VertexHandle\>_** positive_label_set | **_VertexHandle_** pos_vert_id |  | **_Point_** new_pos|
**_bool_** quad_mesh | **_bool_** face_updates | | **_int_** vertex_label|
| | | **_int_** potential_new_illegal_count|
| | | **_int_** illegal_valence|

## Face Depth Assignment
I used the color picking technique described in our course notes
to allow a user to paint an increase or decrease of depth onto faces of their choice.
Users may also add depth to every visible face. This is accomplished
with the same color picking technique but uses the entire
framebuffer instead of pixels located around the cursor.
Using the `DrawID` shader variable and a shader storage
buffer object, I am able to recolor mesh faces to indicate
their face depth value even when a non-triangle face had to be triangulated
for OpenGL rendering.

One distinct option presented to the user is that of
increasing the face depth on all faces with a maximum dihedral angle
greater than a user set threshold. This is meant
to approximate local curvature. An example of a face's dihedral angle
with an adjacent face is depicted in Figure 7.

<!-- FIGURE 7 -->
<div style="float: left;
    margin: 5px 20px 20px;">
<img src="https://dl.dropboxusercontent.com/s/t25mcuyni9es172/dihedral.png" 
alt="Figure 7: One of the four dihedral angles associated with the
top face is labeled as θ."
width="500"/>
</div>

## Removing Illegal Vertices
Crack free output meshes can be guaranteed by subdivision
of a quad face in two particular cases described in 
The next section. By preprocessing a mesh to ensure all faces are quads
and have 0, 1, 3, or 4 vertices with a positive vertex label,
we can guarantee every face falls into one of the two
cases. Moreover, the rules for assigning vertex labels to vertices
after subdividing a face guarantee that condition holds for
every sub-face.

In describing this preprocessing phase, I use the terminology
of [(Yong and Cheng 2005)]: a quad face with
exactly two bordering vertices labelled 0 is called an *illegal face*
and those bordering vertices labelled 0 are called *illegal vertices*.

The first condition is that every face on the mesh is a quad.
If that isn't the case, every vertex label gets increased by 1
and there are no illegal vertices: go straight to subdivision.
This way the first iteration of subdivision is uniform, produces
a mesh with all quad faces, and has a limit surface that is the
same as the original. Subsequent subdivision iterations may be non-uniform
according to the remaining positive vertex labels.

The goal of the processing step is to change vertex labels such that
there are no illegal vertices. One way to accomplish this is using the greedy
algorithm presented in [(Yong and Cheng 2005)]. This algorithm takes each 
illegal vertex, computes auxiliary data, and relabels
the *best* illegal vertex (based on auxiliary data) to a 1.
The process is then repeated with the new set of illegal vertices until
there are none left.

This auxiliary data is composed of two values for each illegal vertex:
the illegal vertex valence (within the connected graph of illegal vertices)
and the number of illegal vertices that would be introduced
if that vertex were to be relabelled a 1.

The best illegal vertex is the the most
connected (highest illegal vertex valence)
that introduces the smallest number of illegal vertices.
The exception is if there are illegal vertices with an illegal
vertex valence of 1. In this case we create a pool
of candidate vertices that are both illegal and
adjacent to any illegal vertices with an illegal vertex valence of 1. From
those candidates we again select the most connected
that introduces the smallest number of illegal vertices.

## Subdivision
Once there are no illegal vertices, every face that will be
subdivided (has at least one positive vertex label)
falls into one of two cases.

In the case of a face with three or four positive vertex labels,
the face undergoes Catmull-Clark subdivision exactly as
described in Figure 3 and 4.
In addition, each vertex gets
the follow vertex labelling function applied:

$$L(\overline{v}_i) = 
\begin{cases} \max(0, L(v_i)-1), & \text{ if } i= 1,2,3,4, \\
\min(L(\overline{v}_{i-4}), L(\overline{v}_{i-4})), & \text{ if } i= 5,6,7,8,\\
0, & \text{ if } i=9 \text{ and } L(\overline{v}_5)=L(\overline{v}_6)=L(\overline{v}_5)=L(\overline{v}_5)=0, \\
\min(L(\overline{v}) ~|~ \overline{v} \in \{ \overline{v}_5, \overline{v}_6, \overline{v}_7, \overline{v}_8\}\setminus \{0\} ), & \text{ otherwise. }
            \end{cases}$$

Where the overline indicates vertices after subdivision. 
An example of this function being applied to all vertices
after a face split is in Figure 8.


<!-- FIGURE 8 -->
{% include dropboxVideo.html 
  fileid="3h1ukxrow14ofp7/new_labels.mp4"
  caption="Figure 8: An example of new vertex label assignment."
%}
<script>
new_labels = new DropboxVideo(fileid="3h1ukxrow14ofp7/new_labels.mp4", start=0, width=410, pos="center");
video_players.video_players.push(new_labels);
</script>

In the case of a face with exactly one positive vertex label,
the same splitting, repositioning, and label calculations are performed
except $$\overline{v}_6$$ and $$\overline{v}_7$$ are never explicitly created and
$$v_3$$ is not re-positioned in the case of $$v_1$$ having the positive vertex label (as 
in Figure 9).

<!-- FIGURE 9 -->
{% include dropboxVideo.html 
  fileid="eur6zdb9s3kv36b/y_element.mp4"
  caption="Figure 9: The case where only one
vertex has a positive label."
%}
<script>
y_element = new DropboxVideo(fileid="eur6zdb9s3kv36b/y_element.mp4", start=0, width=410, pos="center");
video_players.video_players.push(y_element);
</script>

For ease of understanding it is useful to make the distinction
between these cases explicit. 
For ease of implementation I generate auxiliary data for
every vertex, edge, and face then only make
that distinction by control statements within a unified 
subdivision algorithm. Pseudocode summarizing that 
algorithm can be found in Algorithm 1.

<!-- FIGURE SKIP -->
<img src="https://dl.dropboxusercontent.com/s/ff3hrdff7nf8n92/algorithm.png" 
width="400" style="float:right;
    margin: 5px 20px 20px;"/>

Each function called within this *subdivide function* performs
the subdivision computation you would expect from its name.
In addition, `split_edge()` performs case 2 of the label function
$$L(\overline{v}_i)$$ and `split_face()` performs case 3 and 4.
Case 1 is handled within the main loop. Also whenever
new vertex labels are assigned, the set of positive vertex labels
$$P_V$$ is adjusted if needed. This adjustment ensures the loop condition
test is accurate.

Finally, `set_update_flags()` sets the  update flag custom
attribute on every face and their vertices. Here a face is
marked for update only if at least one of its vertices has
a positive label. Vertices are marked for update if they
have a positive label or are one edge away from a positive
labelled vertex.

# Results
Using my application is easy. I have a straightforward
control menu (see  Figure 11, 12, and 13) with text explaining functionality.
Beyond clicking on elements of the control menu.
The user can rotate, pan, and dolly with mouse buttons
while holding down the left alt key. When
the user clicks or drags without holding down
the left alt key, they are increasing face depths.
The user can also decrease face depths by holding
left shift while clicking or dragging.

The algorithm successfully avoids creating mesh cracks.
This is demonstrated in Figure 11. Here a basic
cube mesh has exactly one of the face depths set to 5
and all others left at 0. Then the vertex labels are set,
illegal vertices are removed, and the mesh undergoes
label-driven, adaptive subdividing until
all vertex labels are 0. The result is a wireframe
and faceted surface with a gradual transition between
the highly subdivided region and the rest of the mesh.

With the click of a button the user can paint an increase
in face depth on all visible faces. In Figure 12
I painted all visible faces on the bunny mesh.
The resulting mesh is clearly dense on one side and not on the other.

Another good example is depicted in Figure 13 where
the control mesh on has faces with a high
maximum dihedral angle painted automatically.
The mesh density (and smoothness) is clearly non-uniform.

<!-- FIGURE 10 -->
{% include dropboxVideo.html 
  fileid="nc1d6fcbmxxtbms/cube_face.mp4"
  caption="Figure 10: A cube with only one side painted and subdivided."
%}
<script>
cube = new DropboxVideo(fileid="nc1d6fcbmxxtbms/cube_face.mp4", start=0, width=720, pos="center");
video_players.video_players.push(cube);
</script>

<!-- FIGURE 11 -->
{% include dropboxVideo.html 
  fileid="zhs3vwnigws27ft/bunny_visible.mp4"
  caption="Figure 11: A bunny mesh with face depths increased only on
faces visible from the viewing perspective."
%}
<script>
bunny = new DropboxVideo(fileid="zhs3vwnigws27ft/bunny_visible.mp4", start=0, width=720, pos="center");
video_players.video_players.push(bunny);
</script>

<!-- FIGURE 12 -->
{% include dropboxVideo.html 
  fileid="jcyknxyknnfp6va/car_curvature.mp4"
  caption="Figure 12: A car mesh with high curvature regions targeted for subdivision."
%}
<script>
car = new DropboxVideo(fileid="jcyknxyknnfp6va/car_curvature.mp4", start=0, width=720, pos="center");
video_players.video_players.push(car);
</script>


# Conclusion
Vertex labelling allows for parallelism of many parts of
the scheme. I have vertices being labelled but do not take advantage
of this in my application.

Experimentally, I found removing illegal vertices using the greedy algorithm
presented in [(Yong and Cheng 2005)] is the dominating run time factor;
there is too much computation used for the elimination
of at most three illegal vertices at a time.
The removal of illegal vertices is parallelized in [(Cheng et al. 1989)].
This could be a useful extension that
permits my application to work on meshes with
larger numbers of primitives and disjoint vertex label regions.

[(Yong and Cheng 2005)] assume that their entire subdivision process,
from face depth assignment to subdivision, is done only once.
Limiting the entire process to a single iteration allows
us to guarantee the limit surface is consistent with
uniform subdivision. Any further iterations will have a
different limit surface than the original mesh. This is
likely not what a user wants. Perhaps there is a 
way to keep and reuse auxiliary data such that the
limit surface remains the same after several complete
iterations of the whole scheme.


<!-- REFERENCES -->

[(Yong and Cheng 2005)]: https://doi.org/10.1080/16864360.2005.10738373 "Yong, J. H., & Cheng, F. (Frank). (2005). Adaptive Subdivision of Catmull-Clark Subdivision Surfaces."

[(Cheng et al. 1989)]: https://doi.org/10.1002/nme.1620280613 "Cheng, F., Jaromczyk, J. W., Lin, J.-R., Chang, S.-S., & Lu, J.-Y. (1989). A parallel mesh generation algorithm based on the vertex label assignment scheme."

[(Kobbelt 1996)]: https://doi.org/10.1111/1467-8659.1530409 "Kobbelt, L. (1996). Interpolatory Subdivision on Open Quadrilateral Nets with Arbitrary Topology."

[(Isenberg et al. 2003)]: http://www.simvis.org/tagung2003/abstract/isenberg.pdf "Isenberg, T., Hartmann, K., & König, H. (2003). Interest Value Driven Adaptive Subdivision."
