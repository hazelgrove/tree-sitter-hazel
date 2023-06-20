;keywords
"fun" @keyword.function
"let" @keyword
"in" @keyword
"if" @conditional
"then" @conditional
"else" @conditional
"case" @conditional
"end" @conditional
"as" @keyword

;symbols
"->" @symbol

;comments
(comment) @comment

;punctation
[ ":" "," ] @punctuation.delimiter

[ "(" ")" "[" "]"] @punctuation.bracket

;literals
(int_lit) @number
(float_lit) @number
(string) @string
(bool_lit) @booleans
(infix_exp) @operator

;expression
(var) @variable

;types
(type) @type
