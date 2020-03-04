import { declare } from "@babel/helper-plugin-utils";

const ignore = Symbol("no-preserve-to-string");

function makePath(node) {
    if (node.type === "MemberExpression") {
        const path = `${makePath(node.object)}_${node.property.name}`;
        return path;
    } else if (node.type === "Identifier") {
        return node.name;
    }
}

export default declare(api => {
    api.assertVersion(7);
    const { types: t } = api;
    return {
        name: "preserve-arrow-function-to-string",
        visitor: {
            ArrowFunctionExpression(path, state) {
                if (!path.isArrowFunctionExpression()) return;
                if (path.node[ignore]) return;
                const desc = path.toString();
                const id = path.scope.generateUidIdentifier("fn");
                const selectorPath = makePath(path.node.body);

                path.replaceWith(
                    t.callExpression(
                        t.functionExpression(
                            null,
                            [],
                            t.blockStatement([
                                // t.returnStatement(selectorPath)
                            ])
                        ),
                        []
                    )
                );
            },
            VariableDeclarator(path, state) {
                const bindingName = t.isImportDeclaration(path.node)
                    ? path.node.specifiers[0].local.name
                    : path.node.id.name;
                const idxBinding = path.scope.getOwnBinding(bindingName);

                idxBinding.constantViolations.forEach(refPath => {
                    throw state.file.buildCodeFrameError(
                        refPath.node,
                        "`idx` cannot be redefined."
                    );
                });

                let didTransform = false;
                let didSkip = false;

                idxBinding.referencePaths
                    .slice()
                    .reverse()
                    .forEach(refPath => {
                        if (refPath.node === idxBinding.node) {
                            // Do nothing...
                        } else if (refPath.parentPath.isCallExpression()) {
                            // visitIdxCallExpression(refPath.parentPath, state);
                            didTransform = true;
                        } else {
                            // Should this throw?
                            didSkip = true;
                        }
                    });

                if (!path.isArrowFunctionExpression()) return;
                if (path.node[ignore]) return;
                const desc = path.toString();
                const id = path.scope.generateUidIdentifier("fn");
                const node = {
                    ...path.node,
                    [ignore]: true
                };
                const toString = t.functionExpression(
                    null,
                    [],
                    t.blockStatement([t.returnStatement(t.stringLiteral(desc))])
                );
                const all = t.functionExpression(
                    null,
                    [],
                    t.blockStatement([
                        t.variableDeclaration("const", [
                            t.variableDeclarator(id, node)
                        ]),
                        t.expressionStatement(
                            t.assignmentExpression(
                                "=",
                                t.identifier(`${id.name}.toString`),
                                toString
                            )
                        ),
                        t.returnStatement(id)
                    ])
                );
                path.replaceWith(t.callExpression(all, []));
            }
        }
    };
});
