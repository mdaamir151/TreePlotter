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
