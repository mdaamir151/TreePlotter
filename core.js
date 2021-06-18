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
