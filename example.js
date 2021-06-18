const Tree = require('./tree')

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


let canvas = document.getElementById('tree-canv')
let tree = new Tree(t2)
tree.plot(canvas)