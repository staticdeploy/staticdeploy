import React from "react";

export default function emphasizeString(str: string) {
    return (
        <strong>
            <code>{str}</code>
        </strong>
    );
}
