`use strict`

var AST = require('./ast')
var MNumber = AST.MNumber
var MSymbol = AST.MSymbol
var Scope = AST.Scope
var BinOp = AST.BinOp
var Assignment = AST.Assignment
var Block = AST.Block
var IfCondition = AST.IfCondition

module.exports.make = function(semantics) {
    var Calculator = semantics.addOperation('calc', {
        MathOp: function(a) {
            return a.calc();
        },
        Add: function(a, _, b) {
            return a.calc() + b.calc();
        },
        Sub: function(a, _, b) {
            return a.calc() + b.calc();
        },
        Mul: function(a, _, b) {
            return a.calc() * b.calc();
        },
        Div: function(a, _, b) {
            return a.calc() / b.calc();
        },
        Number: function(a) {
            return a.toJS();
        },
        int: function(a) {
            return parseInt(this.sourceString, 10);
        },
        float: function(a, b, c, d) {
            return parseFloat(this.sourceString);
        },
        hex: function(a, b) {
            return parseInt(this.sourceString.substring(2), 16);
        },
        oct: function(a, b) {
            return parseInt(this.sourceString.substring(2), 8);
        }
    });

    var ASTBuilder = semantics.addOperation('toAST', {
        Add: (a, _, b) => new BinOp('add', a.toAST(), b.toAST()),
        Sub: (a, _, b) => new BinOp('sub', a.toAST(), b.toAST()),
        Mul: (a, _, b) => new BinOp('mul', a.toAST(), b.toAST()),
        Div: (a, _, b) => ('div', a.toAST(), b.toAST()),
        Group: (_, a, __) => a.toAST(),
        Assign: (a, _, b) => new Assignment(a.toAST(), b.toAST()),
        Number: function(a) { return new MNumber(a.calc()); },
        //reuse the number literal parsing code from `calc` operation
        identifier: function(a, b) {return new MSymbol(this.sourceString, null)},
        Eq: (a, _, b) => new BinOp('eq', a.toAST(), b.toAST()),
        Neq: (a, _, b) => new BinOp('neq', a.toAST(), b.toAST()),
        Lt: (a, _, b) => new BinOp('lt', a.toAST(), b.toAST()),
        Lte: (a, _, b) => new BinOp('lte', a.toAST(), b.toAST()),
        Gt: (a, _, b) => new BinOp('gt', a.toAST(), b.toAST()),
        Gte: (a, _, b) => new BinOp('gte', a.toAST(), b.toAST()),
        Block: (_, a, __) => new Block(a.toAST()),
        IfExpr: (_, cond, thenBlock, __, elseBlock) => {
            var thenBody = thenBlock.toAST();
            var elseBody = elseBlock ? elseBlock.toAST()[0] : null;
            return new IfCondition(cond.toAST(), thenBody, elseBody)
        },
        WhileExpr: (_, cond, body) => new AST.WhileLoop(cond.toAST(), body.toAST()),
        String: (a, text, b) => new MNumber(text.sourceString),
        FunCall: (funName, _1, args, _2) => new AST.FunctionCall(funName.toAST(), args.toAST()),
        Arguments: (a) => a.asIteration().toAST(),
        FunDef: (_1, name, _2, params, _3, block) => new AST.FunctionDef(name.toAST(), params.toAST(), block.toAST()),
        Parameters: (a) => a.asIteration().toAST(),
    })
    return {
        Calculator,
        ASTBuilder,
    }
}