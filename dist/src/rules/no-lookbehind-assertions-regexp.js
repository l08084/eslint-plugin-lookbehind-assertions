"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noLookbehindAssertionsRegexp = void 0;
function getRegexpPattern(node) {
    if (node.regex) {
        return node.regex.pattern;
    }
    if (typeof node.value === 'string' &&
        (node.parent.type === 'NewExpression' ||
            node.parent.type === 'CallExpression') &&
        node.parent.callee.type === 'Identifier' &&
        node.parent.callee.name === 'RegExp' &&
        node.parent.arguments[0] === node) {
        return node.value;
    }
    return undefined;
}
function isLookbehindAssertions(pattern) {
    var positiveLookbehindAssertions = new RegExp('\\(\\?<=.+');
    var negativeLookbehindAssertions = new RegExp('\\(\\?<!.+');
    return (positiveLookbehindAssertions.test(pattern) ||
        negativeLookbehindAssertions.test(pattern));
}
exports.noLookbehindAssertionsRegexp = {
    meta: {
        type: 'problem',
        docs: {
            category: 'Possible Errors',
            description: 'disallow the use of lookbehind assertions((?<= ) and (?<! )) in regular expressions',
            recommended: 'error',
            url: '',
        },
        messages: {
            noLookbehindAssertionsRegexp: 'Unexpected lookbehind assertions((?<= ) and (?<! )) in regular expression: {{pattern}}.',
        },
        schema: [],
        fixable: 'code',
    },
    create: function (context) {
        return {
            Literal: function (node) {
                var pattern = getRegexpPattern(node);
                if (pattern) {
                    if (isLookbehindAssertions(pattern)) {
                        context.report({
                            node: node,
                            messageId: 'noLookbehindAssertionsRegexp',
                            data: {
                                pattern: pattern,
                            },
                        });
                    }
                }
            },
        };
    },
};
module.exports = exports.noLookbehindAssertionsRegexp;
