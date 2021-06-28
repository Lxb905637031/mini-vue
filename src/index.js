import Vue from 'vue'

let vm = new Vue({
    el: '#app',
    data() {
        return {
            message: 'hello vue',
            person: {
                name: 'Mike',
                age: 18
            },
            nums: [
                [1, 2], 3, 5, { num: 7 }
            ]
        }
    },
    watch: {
        message(newVal, oldVal) {
            console.log(oldVal)
            console.log(newVal)
        }
    }
})

// setTimeout(() => {
//     // vm.nums.push(9)
//     vm.message = 'hi vue'
// }, 3000)

// vm.message = 'hi vue'