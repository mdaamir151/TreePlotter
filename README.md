# TreePlotter
Plot trees on browser easily. Check example.html and example.js for example.
Use browserify to generate bundle.js after making changes in any other js file

# Usage Example

const t1 = [  
  { id: 1, value: 1, l: 2, r: 3 }, // head  
  { id: 2, value: 2, l: 4, r: 5 },  
  { id: 3, value: 3, l: 6, r: 7 },  
  { id: 4, value: 4 },  
  { id: 5, value: 5 },  
  { id: 6, value: 6 },  
  { id: 7, value: 7 }  
]

const t2 = [  
  { id: 1, value: 1, l: 2 }, // head  
  { id: 2, value: 2, l: 4, r: 3 },  
  { id: 3, value: 3, l: 6, r: 7 },  
  { id: 4, value: 4, l: 5 },  
  { id: 5, value: 5 },  
  { id: 6, value: 6 },  
  { id: 7, value: 7 }  
]

const t3 = [  
  { id: 1, value: 'A', r: 2, l: 8 }, // head  
  { id: 2, value: 'B', r: 4, l: 3 },  
  { id: 3, value: 'C', r: 6, l: 7 },  
  { id: 4, value: 'D', r: 5 },  
  { id: 5, value: 'E' },  
  { id: 6, value: 'F' },  
  { id: 7, value: 'G' },  
  { id: 8, value: 'H' }  
]

const canvas1 = document.getElementById('tree-canv1')  
const tree1 = new Tree(t1)  
tree1.plot(canvas1)  

const canvas2 = document.getElementById('tree-canv2')  
const tree2 = new Tree(t2)  
tree2.plot(canvas2)  

const canvas3 = document.getElementById('tree-canv3')  
const tree3 = new Tree(t3)  
tree3.plot(canvas3)  

Above trees are rendered as:  
![alt Image](https://github.com/mdaamir151/TreePlotter/blob/main/image.png?raw=true)

