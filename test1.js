`use strict`

var ohm = require('ohm-js');
var fs = require('fs');
var assert = require('assert');
var Scope = require('./ast').Scope
var MSymbol = require('./ast').MSymbol

var grammar = ohm.grammar(fs.readFileSync('grammar.ohm').toString());
var semantics = grammar.createSemantics();

var ASTBuilder = require('./semantics').make(semantics).ASTBuilder;

var GLOBAL = new Scope(null);
GLOBAL.setSymbol(new MSymbol("print"),function(arg1){
    console.log("print:",arg1.val);
    return arg1;
});
GLOBAL.setSymbol(new MSymbol("max"), function(A,B) {
    if(A.val > B.val) return A;
    return B;
});
function test(input, answer) {
    var match = grammar.match(input);
    if(match.failed()) return console.log("input failed to match " + input + match.message);
    var ast = ASTBuilder(match).toAST();
    var result = ast.resolve(GLOBAL);
    console.log('result = ', result);
    try {
        assert.deepEqual(result.jsEquals(answer), true);
        console.log('success = ', result, answer);
    } catch(e) {
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
test('if{4==2+2}{1}',1);
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
test('{fun fib(z){if{z<2}{z}else{fib(z-1)+fib(z-2)}} fib(20)}', 6765);