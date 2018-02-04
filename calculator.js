function_names = ['sin','cos','tg','ctg','abs'];
numString = "0123456789.";
litString = "abcdefghijklmnopqrstuvwxyz";
piString = "3.141592653589793";
eString = "2.7182818284590451828459045";

function addSymbol(el1,el2) {
    document.getElementById(el1).innerHTML += document.getElementById(el2).innerHTML.trim();
}

function clearSymbol(el) {
    var s = document.getElementById(el).innerHTML;
    if (s !== "") {
        document.getElementById(el).innerHTML = s.slice(0,s.length-1);
    }
}

function getResult(el) {
    var s = document.getElementById(el).innerHTML;
    document.getElementById(el).innerHTML = parse_expression(s);
}

function clearScreen(screen) {
    document.getElementById(screen).innerHTML = "";
}

function convert(s) {
    var s1 = [];
    var l = s.length;
    var i = 0;
    if (s[0] === "-") {
        s = ["0"].concat(s);
    }
    if (s[0] === ""&&s[1]==="-") {
        s[0] = "0";
    }
    while (i<l) {
        if (s[i]=="pi") {
            if (i>0&&consists(s[i-1],numString+")")){
                s1 = s1.concat(["*",piString]);
            }
            else {
                if (i<l-1&&consists(s[i+1],numString+"(")) {
                    s1 = s1.concat([piString,"^"]);
                }
                else {
                    s1.push(piString);
                }
            }
        }
        else {
            if (s[i]=="e") {
                if (i>0&&consists(s[i-1],numString+")")){
                    s1 = s1.concat(["*",eString]);
                }
                else {
                    if (i<l-1&&consists(s[i+1],numString+"(")) {
                        s1 = s1.concat([eString,"^"]);
                    }
                    else {
                        s1.push(eString);
                    }
                }
            }
            else {
                if ((s[i]==="-")&&consists(s1[s1.length-1],numString+")")==false){
                    s1 = s1.concat(["0","-"]);
                }
                else {
                    if (s[i]=="%") {
                        s1 = s1.concat(["*","0.01"]);
                    }
                    else {
                        s1.push(s[i]);
                    }
                }
            }
        }
        i++;
    }
    return s1;
}

function tokenize_expression(s) {
    var tokenized=[""];
    var i;
    for (i in s) {
        if ((contains(numString,s[i])&&consists(tokenized[tokenized.length-1],numString))||tokenized===[""]) {
            tokenized[tokenized.length-1] += s[i];
        }
        else {
            if ((contains(litString,s[i])&&consists(tokenized[tokenized.length-1],litString))||tokenized===[""]) {
                tokenized[tokenized.length-1] += s[i];
            }
            else {
                tokenized.push(s[i]);
            }
        }
    }
    return tokenized;
}

function consists(s1,s2) {
    var i;
    for (i in s1) {
        if (contains(s2,s1[i]) === false) {
            return false;
        }
    }
    return true;
}

function contains(s,c) {
    var i;
    for (i in s) {
        if (s[i]==c) {
            return true;
        }
    }
    return false;
}

function convert_to_polish_notation(s) {
    s = convert(tokenize_expression(s));
    var output = [];
    var stack = [];
    var tokenIndex;
    for (tokenIndex in s) {
        if (is_operator(s[tokenIndex])) {
            while (stack.length>0&&precedence(stack[stack.length-1])>=precedence(s[tokenIndex])&&is_left_associative(s[tokenIndex])&&stack[stack.length-1]!=="(") {
                output.push(stack.pop());
            }
            stack.push(s[tokenIndex]);
        }
        else {
            if (s[tokenIndex]==="(") {
                stack.push(s[tokenIndex]);
            }
            else {
                if (s[tokenIndex]===")") {
                    while (stack.length>0&&stack[stack.length-1]!=="(") {
                        output.push(stack.pop());
                    }
                    if (stack[stack.length-1]==="(") {
                        stack.pop();
                    }
                    else {
                        return "Error: Missing parenthesis";
                    }
                }
                else {
                    output.push(s[tokenIndex]);
                }
            }
        }
    }

    while (stack.length>0) {
        if (stack[stack.length-1]==="(" || stack[stack.length-1]==="(") {
            return "Error: Missing parenthesis";
        }
        else {
            output.push(stack.pop());
        }
    }
    console.log(output);
    return output;
}

function is_left_associative(operator) {
    return contains("*+",operator);
}

function is_operator(token) {
    return contains("+*-/^%",token)||contains(function_names,token);
}

function precedence(operator) {
    if (operator==="("||operator===")") {
        return 4;
    }
    if (contains(function_names,operator)) {
        return 3;
    }
    if (operator==="^") {
        return 2;
    }
    if (operator==="*"||operator==="/") {
        return 1;
    }
    if (operator==="+"||operator==="-") {
        return 0;
    }
    else {
        return -1;
    }
}

function parse_expression(expression) {
    return parse_polish_notation(convert_to_polish_notation(expression));
}

function parse_polish_notation(expression) {
    if (expression[0] === "") expression.shift();
    var l = [];
    var i;
    var k;
    for (i in expression) {
        try {
            if (expression[i] === "+") {
                k = l.pop();
                l[l.length - 1] += k;
            } else if (expression[i] === "*") {
                k = l.pop();
                l[l.length - 1] *= k;
            } else if (expression[i] === "-") {
                k = l.pop();
                l[l.length - 1] -= k;
            } else if (expression[i] === "/") {
                k = l.pop();
                l[l.length - 1] /= k;
            } else if (expression[i] === "^") {
                k = l.pop();
                l[l.length - 1] = Math.pow(l[l.length - 1], k);
            } else if (expression[i] === "abs") {
                l[l.length - 1] = Math.abs(l[l.length - 1]);
            } else if (expression[i] === "sin") {
                l[l.length - 1] = Math.sin(l[l.length - 1]);
            } else if (expression[i] === "cos") {
                l[l.length - 1] = Math.cos(l[l.length - 1]);
            } else if (expression[i] === "tg") {
                l[l.length - 1] = Math.sin(l[l.length - 1]) / Math.cos(l[l.length - 1]);
            } else if (expression[i] === "ctg") {
                l[l.length - 1] = Math.cos(l[l.length - 1]) / Math.sin(l[l.length - 1]);
            } else {
                l.push(expression[i] - 0);
            }
        } catch(err) {
            return "Incorrect input!";
        }
    }
    if (l.length===1) {
        return l.pop();
    }
    else {
        return "Input error - More 1 in stack!";
    }
}