# TreePlotter
Plot trees on browser easily. Check example.html and example.js for example.
Use browserify to generate bundle.js after making changes in any other js file

# Usage Example

const t1 = [
  { id: 1, value: 1, children: [2, 3] }, // head  
  { id: 2, value: 2, children: [4, 5] },  
  { id: 3, value: 3, children: [6, 7] },  
  { id: 4, value: 4 },  
  { id: 5, value: 5 },  
  { id: 6, value: 6 },  
  { id: 7, value: 7 }  
]

const t2 = [
  { id: 1, value: 1, children: [2] }, // head  
  { id: 2, value: 2, children: [4, 3] },  
  { id: 3, value: 3, children: [6, 7] },  
  { id: 4, value: 4, children: [5] },  
  { id: 5, value: 5 },  
  { id: 6, value: 6 },  
  { id: 7, value: 7 }  
]

let canvas1 = document.getElementById('tree-canv1')  
let tree1 = new Tree(t1)  
tree1.plot(canvas1)  

let canvas2 = document.getElementById('tree-canv2')  
let tree2 = new Tree(t2)  
tree2.plot(canvas2)  

Above trees are rendered as:  
![alt Image](https://github.com/mdaamir151/TreePlotter/blob/main/image.jpg?raw=true)

