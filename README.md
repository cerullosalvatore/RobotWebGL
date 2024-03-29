# RobotGL
![alt text](https://github.com/cerullosalvatore/RobotWebGL/blob/master/ImgReadme/1.png)
The application consists of a 3D game made with WebGL using Threejs.The game consists of moving an animated robot within an infinite world and capturing some "crystals". Each crystal will increase the total score by one point. To view a demo of the application click [here](https://cerullosalvatore.github.io/RobotWebGL/). In the following I will give a brief summary of how the game was structured.

## The World
The world that I thought of implementing is a **procedural world** and therefore will change every time the game starts. Besides this it is also **infinite**.

### Initial World
When the game starts, the function **createInitialFloor()** implemented in the [terrain.js](https://github.com/cerullosalvatore/RobotWebGL/blob/master/js/terrain.js) file will be called in the [application.js](https://github.com/cerullosalvatore/RobotWebGL/blob/master/js/application.js) script. This function will create 9 blocks of land placed in a 3x3 grid. The character will initially be placed in the (0,0,0) position which coincides with the center of the generated world. 

### The Blocks
As mentioned, the world consists of a 3x3 grid of 9 blocks. Each block consists of a geometric square plan in which some objects as Trees, Stones and Crystal will all be inserted with random positions. 

### Infinite World
To generate an infinite world I have adopted the following approach:

Whenever the character is moved within the world i control that is within the central block of our 3x3 grid.

If it goes outside of this block by entering one of the other 8, it is necessary to generate new blocks in the direction in which it is moving and eliminate those further away. In other words, I'm going to move the grid.

The code that performs these operations is located within the [terrains.js](https://github.com/cerullosalvatore/RobotWebGL/blob/master/js/terrain.js)  file.

### SkyDome
To simulate the sky I used object sphere. To achieve the shaded effect of the sky I made some personal shaders inserted and recalled inside the [index.html](https://github.com/cerullosalvatore/RobotWebGL/blob/master/index.html) file.

### Crystals
The crystals have been implemented thanks to the threejs function that allows to make extrusions with respect to a main form. Each crystal is composed of two fundamental elements:
* Internal element: it is the solid part of our crystal, it consists of the real crystal;
* External element: it has the same shape as the crystal but a little wider and will have the task of emulating light reflections. In order to achieve this effect, I created some personal shaders contained in file  [index.html](https://github.com/cerullosalvatore/RobotWebGL/blob/master/index.html).

### Trees and Stones
As mentioned above, each block will contain different trees and stones. These elements have been found from site  [poly.google.com](https://poly.google.com/). In particular we will have two types of trees and one type of stones:
* [Tree 1](https://poly.google.com/view/6pwiq7hSrHr);
* [Tree 2](https://poly.google.com/view/7rTNpk6j01O);
* [Stones](https://poly.google.com/view/3FmsLxIx8Lc).

## Cameras

The game was designed to work with 3 different cameras:
* First Person Camera: this camera is placed immediately in front of the character so as to simulate the movement in first person inside the world;
* Third Person Camera: this camera is placed behind the character and allows to visualize then the movements of the same one in the world;
* Free Camera: the last vamera allows us to visualize the world without affecting the movement of the character.

To change the type of camera, you can press the **C** button.

## Player Controls

### Camera Rotation

In order to simulate the rotation of the character within the scene, I used the PointerLockControls provided by Threejs. This allows me to move the camera direction in the direction of the mouse pointer.

### Character movement
For movements within the world I have used the classic buttons of most PC games:
* **W** o **up arrow** to move the character forward;
* **S** o **down arrow** to move the character backword;
* **A** o **left arrow** to move the character left;
* **D** o **right arrow** to move the character right;

### Change the type of camera
By initializing the game the video camera will be type 1, so it will be set to First Person mode. To change the camera mode, simply press the **C** button.
The order in which the camera will be confirmed by pressing C is as follows:

 **First Person Camera** --> **Third Person Camera** --> **Free Camera** .
 
### Night and day mode
Another effect inserted is to set the day and night. To make this switch, just press the **V** button.

### Sounds Controls
Within this application two audio elements have been inserted. A track will be played in a loop while another track will be played back only when a crystal is captured. 

Initially the sound mode is set to **Mute** so no sound will be played. To change the mode just press the **M** button.

## Collision management
An element of fundamental importance is to manage the collisions between the character and the elements within the world. There are  alot of objects that can collide with the character: **trees**, **stones** and **crystals**.

In each cases I assumed that the character can collide with the only elements present in the central block so I will not control all collisions with all the objects in the world but only those of the current block.

### Collisions with trees and stones
To handle the collision with the trees and stones I used an element made available by threejs called a **raycaster**.
The raycaster can be seen as a sort of "laser pointer" that allows us to visualize the distance with respect to an object.
The constructor of this object requires two elements:
* The starting position: in my case is the character position;
* The direction to which the beam will point: in my case I used a for loop to cover a large area of cast.

If the result of the intersections of the raycaster is less than a maximum distance the character will be set back by the same value with which he wants to follow. This allows us to simulate the collision with the object.
The code is implemented in the [collision.js](https://github.com/cerullosalvatore/RobotWebGL/blob/master/js/collision.js) file and in particular in the **checkCollisionTree()** function.

### Collisions with crystals
To detect collisions with crystals I used another element of threejs called Box3. A Box3 is a three-dimensional cube that can be built around an object and has a method that returns intersections with another Box3.

In my case I make a block for the character and 3 blocks for the crystals. If I identify an intersection then I will proceed with the removal of the crystal from the scene. The code is implemented in the [collision.js](https://github.com/cerullosalvatore/RobotWebGL/blob/master/js/collision.js) file and in particular in the **checkCollisionCrystal()** function.

Crystal removal involves an animation implemented in function **animationRemotionCrystal()** in the file [collision.js](https://github.com/cerullosalvatore/RobotWebGL/blob/master/js/application.js).

## Top Bar
![alt text](https://github.com/cerullosalvatore/RobotWebGL/blob/master/ImgReadme/0.png)
A key element to support the player during the game is the top bar. This is written in html in the  [index.html](https://github.com/cerullosalvatore/RobotWebGL/blob/master/index.html) file. The style is implemented in the [bar.css](https://github.com/cerullosalvatore/RobotWebGL/blob/master/styles/bar.css) file.
The bar informs us of some editable parameters within the game:
* Score: In the central part we find an icon of a diamond that allows us to view the accumulated score;
* Video camera: the second icon indicates which room we are using (1 - First person; 2 -
  Third Person; 3 - Free Camera);
* Audio: indicates if the sounds are enabled or disabled;
* Night / Day: inform us if we are playing in night or day mode.

