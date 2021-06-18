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
