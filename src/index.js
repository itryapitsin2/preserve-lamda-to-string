import {declare} from "@babel/helper-plugin-utils";
import * as types from "@babel/types";

const ignore = Symbol("no-preserve-to-string");

/**
 * Return property navigation path by from lambda expression for member expression or node name for identifier
 * @param node
 * @returns {string|undefined}
 */
function getPathFromLambda(node) {
    switch (node.type) {
        case "MemberExpression":
            return `${getPathFromLambda(node.object)}_${node.property.name}`;
        case "Identifier":
            return node.name;
        default:
            return undefined;
    }
}

export default declare(api => {
    api.assertVersion(7);
    const {types: t} = api;
    return {
        name: "preserve-arrow-function-to-string",
        visitor: {
            ArrowFunctionExpression(path, state) {
                if (!path.isArrowFunctionExpression()) {
                    return;
                }
                const isIgnore = path.node.leadingComments
                    ? path.node.leadingComments.filter(comment => comment.value.indexOf("preserve-to-string") !== -1).length === 0
                    : true;
                if (isIgnore) {
                    return;
                }
                const selectorPath = getPathFromLambda(path.node.body);
                if (!selectorPath) return;

                path.replaceWith(
                    types.functionExpression(
                        null,
                        [],
                        types.blockStatement([
                            types.returnStatement(types.stringLiteral(selectorPath))
                        ])
                    ),
                    []
                );
            }
        }
    };
});
