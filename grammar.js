//helpers:
function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)))
}

function commaSep(rule) {
    return optional(commaSep1(rule))
}


module.exports = grammar({
    name: 'hazel',
    conflicts: $ => [[$.expression, $.pat], [$.tuple_pat, $.tuple_exp], [$.list_exp, $.list_pat], [$.nil_exp, $.nil_pat]],

    extras: $ => [
        /\s/,
        $.comment,
    ],

    rules: {
        program: $ => ($.expression),

        ident: $ => /[A-Za-z][A-Za-z0-9_']*/,

        //basic structures:

        expression: $ => choice(
            $.let,
            $.int_lit,
            $.float_lit,
            $.bool_lit,
            $.string_lit,
            $.tuple_exp,
            $.infix_exp,
            $.fun,
            $.if,
            $.ap,
            $.case,
            $.test,
            $.list_exp,
            $.ident,
            $.nil_exp,
        ),

        pat: $ => choice(
            $.typeann,
            $.wildcard,
            $.int_lit,
            $.float_lit,
            $.bool_lit,
            $.string_lit,
            $.tuple_pat,
            $.list_pat,
            $.as_pat,
            $.ident,
            $.cons_pat,
            $.nil_pat
        ),

        type: $ => choice(
            'Int',
            'String',
            'Float',
            'Bool',
            $.tuple_type,
            $.arrow_type,
            $.array_type,
        ),

        comment: $ =>
            token(seq("#", /.*/)),

        //types:
        tuple_type: $ => seq(
            '(',
            commaSep($.type),
            ')',
        ),

        arrow_type: $ => prec.left(seq(
            $.type,
            '->',
            $.type,
        )),

        array_type: $ => seq(
            '[',
            $.type,
            ']',
        ),

        //expressions

        test: $ => seq(
            'test',
            $.expression,
            'end',
        ),

        list_exp: $ => seq(
            '[',
            commaSep($.expression),
            ']',
        ),

        //literals:

        int_lit: $ => /[0-9]+/,

        float_lit: $ => /[0-9]+\.[0-9]+/,

        bool_lit: $ => choice(
            'true',
            'false',
        ),

        string_lit: $ => seq(
            '"',
            repeat(choice(
                /[^"\\]/,
                /\\./
            )),
            '"'
        ),

        nil_exp: $ => 'nil',

        //infix expressions:

        infix_exp: $ => choice(
            $.plus,
            $.minus,
            $.times,
            $.divide,
            $.pow,
            $.assign,
            $.equals,
            $.string_lit_equals,
            $.less_than,
            $.greater_than,
            $.greater_than_equals,
            $.less_than_equals,
            $.fplus,
            $.fminus,
            $.ftimes,
            $.fdivide,
            $.fpow,
            $.fequals,
            $.float_greater_than,
            $.float_less_than,
            $.float_greater_than_equals,
            $.float_less_than_equals,
            $.substr1,
            $.bitwise_and,
            $.logical_and,
            $.bitwise_or,
            $.logical_or,
            $.cons_exp,
        ),

        plus: $ => prec.left(5, seq(
            $.expression,
            '+',
            $.expression,
        )),

        minus: $ => prec.left(5, seq(
            $.expression,
            '-',
            $.expression,
        )),

        times: $ => prec.left(4, seq(
            $.expression,
            '*',
            $.expression,
        )),

        divide: $ => prec.left(4, seq(
            $.expression,
            '/',
            $.expression,
        )),

        pow: $ => prec.right(3, seq(
            $.expression,
            '**',
            $.expression,
        )),

        fpow: $ => prec.right(3, seq(
            $.expression,
            '**.',
            $.expression,
        )),

        assign: $ => prec.right(8, seq(
            $.expression,
            '=',
            $.expression,
        )),

        equals: $ => prec.right(8, seq(
            $.expression,
            '==',
            $.expression,
        )),

        string_lit_equals: $ => prec.right(8, choice(
            seq(
                $.expression,
                '$==',
                $.expression,
            ),
            seq(
                $.expression,
                '$=',
                $.expression,
            ),
            seq(
                $.expression,
                '$',
                $.expression,
            ),
        )),

        less_than: $ => prec.right(5, seq(
            $.expression,
            '<',
            $.expression,
        )),

        greater_than: $ => prec.right(5, seq(
            $.expression,
            '>',
            $.expression,
        )),

        greater_than_equals: $ => prec.right(8, seq(
            $.expression,
            '>=',
            $.expression,
        )),

        less_than_equals: $ => prec.right(8, seq(
            $.expression,
            '<=',
            $.expression,
        )),

        fplus: $ => prec.left(5, seq(
            $.expression,
            '+.',
            $.expression,
        )),

        fminus: $ => prec.left(5, seq(
            $.expression,
            '-.',
            $.expression,
        )),

        ftimes: $ => prec.left(4, seq(
            $.expression,
            '*.',
            $.expression,
        )),

        fdivide: $ => prec.left(4, seq(
            $.expression,
            '/.',
            $.expression,
        )),

        fequals: $ => prec.right(8, seq(
            $.expression,
            '==.',
            $.expression,
        )),

        float_greater_than: $ => prec.right(5, seq(
            $.expression,
            '>.',
            $.expression,
        )),

        float_less_than: $ => prec.right(5, seq(
            $.expression,
            '<.',
            $.expression,
        )),

        float_greater_than_equals: $ => prec.right(8, seq(
            $.expression,
            '>=.',
            $.expression,
        )),

        float_less_than_equals: $ => prec.right(8, seq(
            $.expression,
            '<=.',
            $.expression,
        )),

        substr1: $ => prec.left(8, seq(
            $.expression,
            '=.',
            $.expression,
        )),

        bitwise_and: $ => prec.left(9, seq(
            $.expression,
            '&',
            $.expression,
        )),

        logical_and: $ => prec.left(9, seq(
            $.expression,
            '&&',
            $.expression,
        )),

        bitwise_or: $ => prec.left(5, seq(
            $.expression,
            '|',
            $.expression,
        )),

        logical_or: $ => prec.left(10, seq(
            $.expression,
            '||',
            $.expression,
        )),

        cons_exp: $ => prec.right(6, seq(
            $.expression,
            '::',
            $.expression,
        )),

        //tuple expressions:
        tuple_exp: $ => seq(
            '(',
            commaSep($.expression),
            ')',
        ),

        //let expressions & related:

        let: $ => seq(
            'let',
            $.pat,
            '=',
            $.expression,
            'in',
            $.expression,
        ),

        //ifs and realted:
        if: $ => seq(
            'if',
            $.expression,
            'then',
            $.expression,
            'else',
            $.expression,
        ),

        //functions and related
        fun: $ => seq(
            'fun',
            $.pat,
            '->',
            $.expression,
        ),

        //application
        ap: $ => prec.left(1, seq(
            field("func", $.expression),
            '(',
            commaSep($.expression),
            ')'
        )),

        //cases and rules

        case: $ => seq(
            'case',
            $.expression,
            repeat1($.rule),
            'end'
        ),

        rule: $ => seq(
            '|',
            $.pat,
            $.rule_exp_op,
            $.expression,
            "\n",
        ),

        rule_exp_op: $ => token('=>'),

        //patterns:

        typeann: $ => prec(11, seq(
            $.pat,
            ':',
            $.type,
        )),

        as_pat: $ => prec.left(6, seq(
            $.pat,
            'as',
            $.pat,
        )),

        tuple_pat: $ => seq(
            '(',
            commaSep($.pat),
            ')',
        ),

        list_pat: $ => seq(
            '[',
            commaSep($.pat),
            ']',
        ),

        cons_pat: $ => prec.right(6, seq(
            $.pat,
            '::',
            $.pat,
        )),

        wildcard: $ => '_',

        nil_pat: $ => 'nil',
    }
});
