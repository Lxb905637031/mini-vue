import { observe } from './index'

let oldArrayProtoMethods = Array.prototype

export let newArrayProtoMethods = Object.create(oldArrayProtoMethods)

let methods = ['push', 'shift', 'unshift', 'pop', 'slice', 'sort', 'reverse']

methods.forEach(method => {
    newArrayProtoMethods[method] = function(...args) {
        let result = oldArrayProtoMethods[method].apply(this, args)

        let insertedElement

        switch (method) {
            case 'push':
            case 'pop':
                insertedElement = args
                break
            case 'splice':
                insertedElement = args.slice(2)
            default:
                break
        }

        // 新增数组的索引也要进行监听
        if (insertedElement) {
            observeArray(insertedElement)
        }

        this.__ob__.dep.notify()

        return result
    }
})

export function observeArray(insertedElement) {
    for (let i = 0; i < insertedElement.length; i++) {
        observe(insertedElement[i])
    }
}

// 数组依赖
export function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        let currentItem = value[i]
        currentItem.__ob__ && currentItem.__ob__.dep.depend()
        if (Array.isArray(currentItem)) {
            dependArray(currentItem)
        }
    }
}