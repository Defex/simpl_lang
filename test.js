var Simpl = require('./simpl')
var assert = require('assert');

var simpl = new Simpl()

function test(input, answer) {
    var result = simpl.run(input)
    try {
        assert.deepEqual(result.jsEquals(answer), true);
        console.log('success = ', result, answer);
    } catch(e) {
        console.log(input)
        console.log(e);
    }
}

test("123",123);
test("999",999);
// test("abc",999);
test('123.456',123.456);
test('0.123',0.123);
// test('.123',0.123);
test('0x456',0x456);
test('0xFF',255);
test('4.8e10',4.8e10);
test('4.8e-10',4.8e-10);
test('0o77',7*8+7);
test('0o23',0o23);
test('10',10);
test('x = 10',10);
test('x',10);
test('x * 2',20);
test('x * 0x2',20);
test('4==4',true);
test('4==4',true);
test('4!=5',true);
test('4<5',true);
test('4>5',false);
test('4<=5',true);
test('4>=5',false);
test('if {4==2+2} {1}',1);
test('if{4==2+2}{1}else{2}',1);
test('if{4==2+3}{1}else{2}',2);
//while loop
test('{ x=0  while { x < 5 } { x = x+1 } } ',5);
test('{ x=4  while { x < 5 } { x = x+1 } } ',5);
test('{ x=8  while { x < 5 } { x = x+1 } } ',null);
test(' "foo" ',"foo");
test(' "foo" + "bar" ', "foobar");

//native function calls
test("print(4)",4); //returns 4, prints 4
test("max(4,5)",5); // returns 5
test('print("foo") ', 'foo');
// compound tests
// function returns value to math expression
test('6*max(4,5)',30);
test('max(4,5)*6',30);
test('4*max(4,5)',20);
test('4*max(5,4)',20);
// function returns value to function
test('max(4,max(6,5))',6);
test('max(max(6,5),4)',6);
test('{ x=5  fun plus1(z){ 1+z }   plus1(x)  }', 6);
