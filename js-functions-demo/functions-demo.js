let obj = {
    name: 'testObj',
    func: function() {
        function innerFunc() {
            console.log(`\nInner function\nShould return window object: ${this}`);
        }
        let innerArrowOfStandard = () => {
            console.log(`\nInnerArrow inside STANDARD function\nShould return testObj: ${this.name}`);
        };

        console.log(`\nStandard function\nShould return testObj: ${this.name}`);
        innerFunc();
        innerArrowOfStandard();

    },
    arrow: () => {
        let innerArrow = () => {
            console.log(`\nInnerArrow function\nShould return undefined: ${this.name}`);
        };

        console.log(`\nArrow function\nShould return undefined: ${this.name}`);
        innerArrow();
    },

};

class testClass {
    constructor() {
        this.name = 'testClassNAME' +
            '';
    }

    func() {
        function innerFunc() {
            console.log(`\n--CLASS--Inner function\nShould return window object: ${this}`);
        }
        let innerArrowOfStandard = () => {
            console.log(`\n--CLASS--InnerArrow inside STANDARD function\nShould return undefined: ${this.name}`);
        };

        console.log(`\n--CLASS--Standard function\nShould return undefined: ${this.name}`);
        innerFunc();
        innerArrowOfStandard();
    }
}

obj.func();
obj.arrow();

let test = new testClass();
test.func();