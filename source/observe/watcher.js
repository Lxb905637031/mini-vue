import { pushTarget, popTarget } from './dep'
import { getValue } from '../utils'

let id = 0

class Watcher {
    constructor(vm, exprOrFn, cb = () => {}, opts = {}) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        } else {
            this.getter = function() {
                // exprOrFn为watch的key
                return getValue(exprOrFn, vm)
            }
        }

        if (opts.user) {
            this.user = true
        }

        this.cb = cb
        this.opts = opts
        this.deps = []
        this.depsId = new Set()
        this.id = id++;

        this.value = this.get()
    }

    get() {
        // Dep.target = watcher
        pushTarget(this)
        let value = this.getter()
        popTarget()
        return value
    }

    update() {
        queueWatcher(this)
    }

    run() {
        let value = this.get()
        if (this.value !== value) {
            this.cb(value, this.value)
        }
    }

    // watcher 和 dep 互相依赖
    addDep(dep) {
        let id = dep.id

        if (!this.depsId.has(id)) {
            this.depsId.add(id);
            // dep存入到watcher中
            this.deps.push(dep);
            // watcher存入到dep中
            dep.addSub(this)
        }
    }
}


let has = {};
// 存储watcher队列
let queue = [];
// 存储回调队列
let callbacks = []


function flushCallbacks() {
    callbacks.forEach(cb => cb())
}

function queueWatcher(watcher) {
    let id = watcher.id
    if (has[id] == null) {
        has[id] = true
        queue.push(watcher)
            // 延迟清空队列
        nextTick(flushQueue, 0)
    }
}

function flushQueue() {
    // 执行watcher的实例的run
    queue.forEach(watcher => watcher.run());
    // 重置
    has = {}
    queue = []
}

function nextTick(cb) {
    callbacks.push(cb)

    let timerFunction = () => {
        flushCallbacks()
    }

    if (Promise) {
        return Promise.resolve().then(timerFunction)
    }

    setTimeout(timerFunction, 0)
}

export default Watcher