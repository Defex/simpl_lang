`use strict`
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
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
//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('static'))
app.use(bodyParser.json())

//app.use(express.bodyParser());

app.post('/parse', function(req, res) {
  var input = req.body.input
  console.log('got parse request ' + input);
  var match = grammar.match(input);
  var result;
  if(match.failed()) {
  	result = "input failed to match " + input + match.message;
  	console.log("input failed to match " + input + match.message);
  } else {
	var ast = ASTBuilder(match).toAST();
	result = ast.resolve(GLOBAL);
    console.log('result = ', result);
  }
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end(JSON.stringify({'results': result}));
});

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});