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
["->" ":"] @symbol
(rule_exp_op) @symbol

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

;operators (Milan Lustig - I am not sure if I can just do infix_exp and have it work. I believe that I need to do this)
["|" "+" "-" "*" "/" "**" "**." "=" "==" "$==" "$=" "$" "<" ">" "<=" ">=" "+." "-." "*." "/." "==." "<." ">." ">=." "<=." "=." "&" "&&" "||"] @operator

;expression
(ident) @variable

;types
(type) @type

;function calling
(ap 
  func: (expression (ident) @function.call)) 
