import React from "react";

export default function intersperseNodes(
    nodes: React.ReactNode[],
    wedge: React.ReactNode
): React.ReactNode[] {
    return nodes.map((node, index) => (
        <React.Fragment key={index}>
            {node}
            {index !== nodes.length - 1 ? wedge : null}
        </React.Fragment>
    ));
}
