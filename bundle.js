(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

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
  if (!root.l && !root.r) return root
  if (root.l) root.left = constructTree(tMap[root.l], tMap)
  if (root.r) root.right = constructTree(tMap[root.r], tMap)
  return root
}

const findShortestDistance = function (root1, root2) {

  if (!root1 || !root2) return 0
  let d = Number.MAX_SAFE_INTEGER
  let ls = root1; let rs = root2
  let lspX = 0, rspX = 0
  while (ls && rs) {
    d = Math.min(d, (rs.x + rspX) - (ls.x + lspX))
    lspX += ls.x
    rspX += rs.x
    ls = ls.right || ls.left
    rs = rs.left || rs.right
  }
  return d
}

const positionNodes = function (root, minHalfDistance) {
  if (!root) return
  root.x = 0
  if (!root.left && !root.right) return
  positionNodes(root.left, minHalfDistance)
  positionNodes(root.right, minHalfDistance)
  const d = findShortestDistance(root.left, root.right)
  if (root.left) root.left.x = -(minHalfDistance - d / 2)
  if (root.right) root.right.x = (minHalfDistance - d / 2)
}

const calcExactPositions = function (root, parentX, parentY, nodeToNodeHeight) {
  if (!root) return { left: parentX, right: parentX, top: 0, bottom: parentY }
  root.x += parentX
  root.y = parentY + nodeToNodeHeight
  const l = calcExactPositions(root.left, root.x, root.y, nodeToNodeHeight)
  const r = calcExactPositions(root.right, root.x, root.y, nodeToNodeHeight)
  return { left: Math.min(l.left, r.left), right: Math.max(l.right, r.right), top: 0, bottom: Math.max(l.bottom, r.bottom) }
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

/*const t1 = [
  { id: 1, value: 1, l: 2, r: 3 }, // head
  { id: 2, value: 2, l: 4, r: 5 },
  { id: 3, value: 3, l: 6, r: 7 },
  { id: 4, value: 4, l: 8, r: 9 },
  { id: 5, value: 5, l:10, r: 11 },
  { id: 6, value: 6, l: 12, r: 13 },
  { id: 7, value: 7, l: 14, r: 15 },
  { id: 8, value: 8 },
  { id: 9, value: 9 },
  { id: 10, value: 10 },
  { id: 11, value: 11, r: 16 },
  { id: 12, value: 12, l: 17 },
  { id: 13, value: 13, r: 18 },
  { id: 14, value: 14, l: 19 },
  { id: 15, value: 15 },
  { id: 16, value: 16 },
  { id: 17, value: 17 },
  { id: 18, value: 18 },
  { id: 19, value: 19 },
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
*/
const draw = function() {
    const treeText = document.getElementById('tree-text')
    const treeDiv = document.getElementById('trees')
    let text = treeText.innerText || ''
    if (text === '') return
    let formattedText = text.replace(/[^:\s{},\[\]]+/g, (match) => {
        return '"' + match + '"'
    })
    let treeArray = ''
    try {
        treeArray = JSON.parse(formattedText)
    } catch (e) {
        console.log(e)
        alert('Invalid value found!')
    }
    let t = treeArray[0]
    if (t instanceof Array) {
        treeArray.forEach((tree) => {
            let tr = new Tree(tree)
            console.log(tree)
            let canv = document.createElement('canvas')
            treeDiv.append(canv)
            tr.plot(canv)
        })
    } else {
        let tr = new Tree(treeArray)
        let canv = document.createElement('canvas')
        treeDiv.append(canv)
        tr.plot(canv)
    }
}

draw()

document.getElementById('draw').addEventListener('click', ()=>{
  draw()
})

},{"./tree":3}],3:[function(require,module,exports){
const core = require('./core')
const DEFAULT_MARGIN = 5
const DEFAULT_HSEP = 30
const DEFAULT_VSEP = 40
const MAX_RADIUS = 30
const DEFAULT_STROKE_WIDTH = 1

class Tree {
  constructor (tree) {
    const isArr = tree instanceof Array
    if (!isArr) throw Error('Tree must be array of nodes')
    if (tree.length === 0) throw Error('Tree must have atleast one node')
    this.tree = tree
    this.margin = DEFAULT_MARGIN
    this.hSeparation = DEFAULT_HSEP
    this.vSeparation = DEFAULT_VSEP
    this.strokeWidth = DEFAULT_STROKE_WIDTH
  }

  constructTree () {
    const [head, tMap] = core.getHeadAndTreeMap(this.tree)
    const root = core.constructTree(head, tMap)
    return root
  }

  measure (root, margin, hSeparation, vSeparation) {
    core.positionNodes(root, hSeparation >>> 1)
    const bounds = core.calcExactPositions(root, 0, -vSeparation, vSeparation)
    core.applyOffset(root, -bounds.left + margin, -bounds.top + margin)
    return { cv_width: bounds.right - bounds.left + 2 * margin, cv_height: bounds.bottom - bounds.top + 2 * margin }
  }

  getContext (canv) {
    const ctx = canv.getContext('2d')
    this.setStyle(ctx)
    return ctx
  }

  setDrawingColor (strokeColor, fillColor) {

  }

  drawCircle (canv, x, y, r) {
    const ctx = this.getContext(canv)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2, true)
    ctx.stroke()
  }

  drawText (canv, x, y, text) {
    const ctx = this.getContext(canv)
    ctx.font = '20px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y)
  }

  drawLine (canv, x0, y0, x1, y1) {
    const ctx = this.getContext(canv)
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

  findMaxTextSize (canv, root) {
    if (!root) return 0
    const ctx = this.getContext(canv)
    ctx.font = '20px serif'
    const tSize = ctx.measureText(root.value)
    return Math.max(tSize.width, this.findMaxTextSize(canv, root.left), this.findMaxTextSize(canv, root.right))
  }

  drawTree (canv, root, radius) {
    if (!root) return
    this.drawCircle(canv, root.x, root.y, radius)
    this.drawText(canv, root.x, root.y, root.value)
    if (root.left) this.drawLineWithOffset(canv, root.x, root.y, root.left.x, root.left.y, radius)
    if (root.right) this.drawLineWithOffset(canv, root.x, root.y, root.right.x, root.right.y, radius)
    this.drawTree(canv, root.left, radius)
    this.drawTree(canv, root.right, radius)
  }

  setMargin (margin) {
    this.margin = margin
    return this
  }

  setHSeparation (hSeparation) {
    this.hSeparation = hSeparation
    return this
  }

  setVSeparation (vSeparation) {
    this.vSeparation = vSeparation
    return this
  }

  setStrokeWidth (width) {
    this.strokeWidth = width
    return this
  }

  setStyle (ctx) {
    ctx.lineWidth = this.strokeWidth
  }

  plot (canv) {
    if (!canv || !canv.getContext) throw Error('Wrong canvas passed or canvas is not supported!')
    const root = this.constructTree()
    const maxTextSize = this.findMaxTextSize(canv, root)
    const radius = Math.min((maxTextSize >>> 1) + 8, MAX_RADIUS)
    const [mar, vsep, hsep] = [this.margin, this.hSeparation, this.vSeparation].map((x) => x + 2 * radius)
    const measurements = this.measure(root, mar, hsep, vsep)
    canv.width = measurements.cv_width
    canv.height = measurements.cv_height
    this.drawTree(canv, root, radius)
  }
}

module.exports = Tree

},{"./core":1}]},{},[2]);
