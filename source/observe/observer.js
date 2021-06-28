import { observe } from './index'
import { newArrayProtoMethods, observeArray, dependArray } from "./array";
import Dep from './dep'

class Observer {
    constructor(data) {

        this.dep = new Dep();
        // 新增__ob__属性，用于数组的依赖收集
        Object.defineProperty(data, '__ob__', {
            get: () => this
        })

        if (Array.isArray(data)) {
            data.__proto__ = newArrayProtoMethods
            observeArray(data)
        } else {
            this.walk(data)
        }

    }
    walk(data) {

        let keys = Object.keys(data)

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let value = data[key]
                // 对数据进行劫持
            defineReactive(data, key, value)
        }
    }
}

export default Observer

export function defineReactive(data, key, value) {
    let dep = new Dep()
        // 获取子项
    let childOb = observe(value)

    // 不兼容IE8及以下
    Object.defineProperty(data, key, {
        get() {
            console.log('调用了get')
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    // 数组的依赖收集
                    childOb.dep.depend()
                        // [[1, 2], 3, 4]
                    dependArray(value)
                }
            }
            return value
        },
        set(newValue) {
            console.log('调用了set')
            observe(newValue)
            if (value !== newValue) {
                value = newValue
            }
            dep.notify()
        }
    })
}