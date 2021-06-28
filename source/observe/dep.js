let id = 0
let stack = []

class Dep {
    constructor() {
        this.id = id++;
        this.subs = []
    }

    // 订阅
    addSub(watcher) {
        this.subs.push(watcher)
    }

    // 发布
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }

    // 将watcher存到dep中， dep存入watcher中
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

}

export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

export default Dep