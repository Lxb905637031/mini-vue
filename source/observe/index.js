import Observer from './observer'

export function initState(vm) {
    let options = vm.$options

    if (options.data) {
        initData(vm)
    }

    if (options.computed) {
        initComputed()
    }

    if (options.watch) {
        initWatch(vm)
    }
}

// 初始化data
function initData(vm) {
    let data = vm.$options.data
        // 存储一个副本_data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

    for (let key in data) {
        // 对属性进行代理
        proxy(vm, '_data', key)
    }

    // 观察数据
    observe(vm._data)
}

// 初始化computed
function initComputed() {}

// 初始化watch
function initWatch(vm) {
    let watch = vm.$options.watch
    for (let key in watch) {
        let handler = watch[key]
        createWatcher(vm, key, handler)
    }
}

function createWatcher(vm, key, handler) {
    return vm.$watch(key, handler)
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            // vm.message -> vm.data.message
            return vm[source][key]
        },
        set(newValue) {
            return vm[source][key] = newValue
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data === null) {
        return
    }

    if (data.__ob__) {
        return data.__ob__
    }

    return new Observer(data)
}