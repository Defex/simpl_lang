`use strict`

var ohm = require('ohm-js');
var fs = require('fs');
var Scope = require('./ast').Scope
var MSymbol = require('./ast').MSymbol
var grammar = ohm.grammar(fs.readFileSync('grammar.ohm').toString());

class Simpl {
    constructor() {
        this.globalScope = new Scope(null);
        this.globalScope.setSymbol( new MSymbol('print'), function(arg) {
            console.log(arg.val)
        })
    }
    run(code) {
        var semantics = grammar.createSemantics();
        var match = grammar.match(code);
        if(match.failed()) {
            throw Error(`Syntax error: ${match.message}`)
        }
        var ASTBuilder = require('./semantics').make(semantics).ASTBuilder;
        var ast = ASTBuilder(match).toAST();
        var result = ast.resolve(this.globalScope);
        return result
    }
}

module.exports = Simpl