import { initState } from '../observe/index'
import Watcher from '../observe/watcher'
import { compiler } from '../utils'

function Vue(options) {
    this._init(options)
}

Vue.prototype._init = function(options) {
    let vm = this
    vm.$options = options

    // 初始化状态
    initState(vm)

    if (vm.$options.el) {
        vm.$mount()
    }
}

// 挂载
Vue.prototype.$mount = function() {
    let vm = this
    let el = vm.$options.el
    el = vm.$el = query(el)

    // 更新组件
    let updataComponent = () => {
        vm._update()
    }

    // 渲染Watcher
    new Watcher(vm, updataComponent)
}

Vue.prototype._update = function() {
    let vm = this
    let el = vm.$el
        // 创建文档碎片
    let node = document.createDocumentFragment(el)

    let firstChild

    while (firstChild = el.firstChild) {
        node.appendChild(firstChild)
    }

    compiler(node, vm)

    el.appendChild(node)
}

Vue.prototype.$watch = function(expr, handler) {
    let vm = this
    new Watcher(vm, expr, handler, { user: true })
}

function query(el) {
    if (typeof el === 'string') {
        return document.querySelector(el)
    }
    return el
}

export default Vue