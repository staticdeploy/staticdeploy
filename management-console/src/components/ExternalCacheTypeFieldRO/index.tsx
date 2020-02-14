import { IExternalCache, IExternalCacheType } from "@staticdeploy/core";
import find from "lodash/find";
import React from "react";

import "./index.css";

interface IProps {
    title: React.ReactNode;
    externalCacheType: IExternalCache["type"];
    supportedExternalCacheTypes: IExternalCacheType[];
}

export default class ExternalCacheTypeFieldRO extends React.Component<IProps> {
    render() {
        const {
            title,
            externalCacheType,
            supportedExternalCacheTypes
        } = this.props;
        return (
            <div className="c-ExternalCacheTypeFieldRO">
                <h4>{title}</h4>
                {
                    find(supportedExternalCacheTypes, {
                        name: externalCacheType
                    })!.label
                }
            </div>
        );
    }
}
