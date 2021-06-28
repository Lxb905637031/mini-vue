const reg = /\{\{((?:.|\r?\n)+?)\}\}/g

export function compiler(node, vm) {
    // 获取子节点
    let childNodes = node.childNodes
    let childNodesArr = [...childNodes]
    childNodesArr.forEach(child => {
        // 元素节点
        if (child.nodeType === 1) {
            compiler(child, vm)
        } else if (child.nodeType === 3) { // 文本节点
            compileText(child, vm)
        }
    })
}

export function compileText(node, vm) {
    // 存储副本,避免操作原始值
    if (!node.expr) {
        node.expr = node.textContent
    }
    // 编译文本节点，将插值{{}}的内容编译
    node.textContent = node.expr.replace(reg, function(...args) {
        let key = trimSpace(args[1])
        return getValue(key, vm)
    })
}

export function getValue(expr, vm) {
    // vm.person.age
    let keys = expr.split('.')
    return keys.reduce((prevValue, curValue) => {
        prevValue = prevValue[curValue]
        return prevValue
    }, vm)
}

export function trimSpace(str) {
    return str.replace(/\s+/g, '')
}