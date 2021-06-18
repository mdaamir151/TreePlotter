(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const MIN_HD = 45 // min half distance between siblings
const LINE_H = 50 // vertical distance between parent and children
const INT_MAX = 1000000

const getHeadAndTreeMap = function (treeArray) {
  const head = treeArray[0]
  const tMap = {}
  treeArray.forEach((node) => {
    tMap[node.id] = node
  })
  return [head, tMap]
}

const constructTree = function (root, tMap) {
  if (!root) throw Error('Invalid Node!')
  const children = root.children
  if (!children) return root
  if (children.length > 0) root.left = constructTree(tMap[children[0]], tMap)
  if (children.length > 1) root.right = constructTree(tMap[children[1]], tMap)
  return root
}

const findShortestDistance = function (root1, root2) {
  if (!root1 || !root2) return 0
  let d = INT_MAX
  let ls = root1; let rs = root2
  while (ls && rs) {
    d = Math.min(d, rs.x - ls.x)
    ls = ls.right || ls.left
    rs = rs.left || rs.right
  }
  return d
}

const positionNodes = function (root) {
  if (!root) return
  root.x = 0
  if (!root.left && !root.right) return
  positionNodes(root.left)
  positionNodes(root.right)
  const d = findShortestDistance(root.left, root.right)
  if (root.left) root.left.x = -(MIN_HD - d / 2)
  if (root.right) root.right.x = (MIN_HD - d / 2)
}

const calcExactPositions = function (root, parentX = 0, parentY = -LINE_H) {
  if (!root) return {left: parentX, right: parentX, top: 0, bottom: parentY}
  root.x += parentX
  root.y = parentY + LINE_H
  const l = calcExactPositions(root.left, root.x, root.y)
  const r = calcExactPositions(root.right, root.x, root.y)
  return {left: Math.min(l.left, r.left), right: Math.max(l.right, r.right), top: 0, bottom: Math.max(l.bottom, r.bottom)}
}

const applyOffset = function (root, offsetX, offsetY) {
  if (!root) return
  root.x += offsetX
  root.y += offsetY
  applyOffset(root.left, offsetX, offsetY)
  applyOffset(root.right, offsetX, offsetY)
}

module.exports = {
  getHeadAndTreeMap,
  constructTree,
  findShortestDistance,
  positionNodes,
  calcExactPositions,
  applyOffset
}

},{}],2:[function(require,module,exports){
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
},{"./tree":3}],3:[function(require,module,exports){
const core = require('./core')
const DEFAULT_RADIUS = 20

class Tree {
  constructor (tree) {
    const isArr = tree instanceof Array
    if (!isArr) throw Error('Tree must be array of nodes')
    if (tree.length === 0) throw Error('Tree must have atleast one node')
    this.tree = tree
  }

  build (margin = 50) {
    margin += DEFAULT_RADIUS
    const [head, tMap] = core.getHeadAndTreeMap(this.tree)
    const root = core.constructTree(head, tMap)
    core.positionNodes(root)
    const bounds = core.calcExactPositions(root)
    console.log(bounds)
    core.applyOffset(root, -bounds.left + margin, -bounds.top + margin)
    return { root, cv_width: bounds.right - bounds.left + 2 * margin, cv_height: bounds.bottom - bounds.top + 2 * margin }
  }

  setDrawingColor (strokeColor, fillColor) {

  }

  drawCircle (canv, x, y, r) {
    const ctx = canv.getContext('2d')
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2, true)
    ctx.stroke()
  }

  drawText (canv, x, y, text) {
    const ctx = canv.getContext('2d')
    ctx.font = '20px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y)
  }

  drawLine (canv, x0, y0, x1, y1) {
    const ctx = canv.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }

  drawLineWithOffset (canv, x0, y0, x1, y1, r) {
    const den = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0))
    const p0 = [x0 + r * (x1 - x0) / den, y0 + r * (y1 - y0) / den]
    const p1 = [x1 + r * (x0 - x1) / den, y1 + r * (y0 - y1) / den]
    this.drawLine(canv, p0[0], p0[1], p1[0], p1[1])
  }

  drawTree (canv, root) {
    if (!root) return
    this.drawCircle(canv, root.x, root.y, DEFAULT_RADIUS)
    this.drawText(canv, root.x, root.y, root.value)
    if (root.left) this.drawLineWithOffset(canv, root.x, root.y, root.left.x, root.left.y, DEFAULT_RADIUS)
    if (root.right) this.drawLineWithOffset(canv, root.x, root.y, root.right.x, root.right.y, DEFAULT_RADIUS)
    this.drawTree(canv, root.left)
    this.drawTree(canv, root.right)
  }

  plot (canv) {
    if (!canv || !canv.getContext) throw Error('Wrong canvas passed or canvas is not supported!')
    const tree = this.build()
    console.log(tree.cv_width, tree.cv_height)
    console.log(tree)
    canv.width = tree.cv_width
    canv.height = tree.cv_height
    this.drawTree(canv, tree.root)
  }
}

module.exports = Tree

},{"./core":1}]},{},[2]);
