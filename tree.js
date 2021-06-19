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

  constructTree() {
    const [head, tMap] = core.getHeadAndTreeMap(this.tree)
    const root = core.constructTree(head, tMap)
    return root
  }

  measure (root, margin, hSeparation, vSeparation) {
    console.log(margin, hSeparation, vSeparation)
    console.log(root)
    core.positionNodes(root, hSeparation >>> 1)
    const bounds = core.calcExactPositions(root, 0, -vSeparation, vSeparation)
    core.applyOffset(root, -bounds.left + margin, -bounds.top + margin)
    return { cv_width: bounds.right - bounds.left + 2 * margin, cv_height: bounds.bottom - bounds.top + 2 * margin }
  }

  getContext(canv) {
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

  findMaxTextSize(canv, root) {
    if (!root) return 0
    const ctx = this.getContext(canv)
    ctx.font = '20px serif'
    let tSize = ctx.measureText(root.value)
    return Math.max(tSize.width, this.findMaxTextSize(root.left), this.findMaxTextSize(root.right))
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

  setMargin(margin) {
    this.margin = margin
    return this
  }

  setHSeparation(hSeparation) {
    this.hSeparation = hSeparation
    return this
  }

  setVSeparation(vSeparation) {
    this.vSeparation = vSeparation
    return this
  }

  setStrokeWidth(width) {
    this.strokeWidth = width
    return this
  }

  setStyle(ctx) {
    ctx.lineWidth = this.strokeWidth
  }

  plot (canv) {
    if (!canv || !canv.getContext) throw Error('Wrong canvas passed or canvas is not supported!')
    let root = this.constructTree()
    let maxTextSize = this.findMaxTextSize(canv, root)
    let radius = Math.min((maxTextSize >>> 1) + 8, MAX_RADIUS)
    let [mar, vsep, hsep] = [this.margin, this.hSeparation, this.vSeparation].map((x)=> x + 2 * radius)
    const measurements = this.measure(root, mar, hsep, vsep)
    console.log(measurements.cv_width, measurements.cv_height)
    console.log(measurements)
    canv.width = measurements.cv_width
    canv.height = measurements.cv_height
    this.drawTree(canv, root, radius)
  }
}

module.exports = Tree
