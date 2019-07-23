import { IBundle } from "@staticdeploy/core";
import Cascader, { CascaderOptionType, CascaderProps } from "antd/lib/cascader";
import Form, { FormItemProps } from "antd/lib/form";
import classnames from "classnames";
import distanceInWords from "date-fns/distance_in_words";
import find from "lodash/find";
import keys from "lodash/keys";
import map from "lodash/map";
import setWith from "lodash/setWith";
import sortBy from "lodash/sortBy";
import values from "lodash/values";
import React from "react";
import { Field, WrappedFieldProps } from "redux-form";

interface IIntermediateMap {
    [bundleName: string]: {
        [bundleTag: string]: {
            [bundleId: string]: IBundle;
        };
    };
}

interface IProps {
    name: string;
    bundles: IBundle[];
    className?: string;
    label?: FormItemProps["label"];
    disabled?: CascaderProps["disabled"];
    placeholder?: CascaderProps["placeholder"];
}

export class WrappedBundleIdField extends React.Component<
    WrappedFieldProps & IProps
> {
    /*
     *  This method transforms an array of IBundle-s into a tree like the
     *  following:
     *
     *  [
     *    // Sorted alphabetically
     *    {
     *      value: "bundleName",
     *      label: "bundleName",
     *      children: [
     *        // Sorted alphabetically
     *        {
     *          value: "bundleTag",
     *          label: "bundleTag",
     *          children: [
     *            // Sorted chronologically
     *            {
     *              value: "bundleId",
     *              label: "bundleId (bundle age)",
     *            }
     *          ]
     *        }
     *      ]
     *    }
     *  ]
     */
    getOptions(): CascaderOptionType[] {
        const intermediateMap: IIntermediateMap = {};
        this.props.bundles.forEach(bundle =>
            setWith(
                intermediateMap,
                [bundle.name, bundle.tag, bundle.id],
                bundle,
                Object
            )
        );
        const bundleNames = keys(intermediateMap).sort();
        return bundleNames.map(bundleName => {
            const bundleTags = keys(intermediateMap[bundleName]).sort();
            return {
                value: bundleName,
                label: bundleName,
                children: bundleTags.map(bundleTag => {
                    const bundles = sortBy(
                        values(intermediateMap[bundleName][bundleTag]),
                        "createdAt"
                    ).reverse();
                    return {
                        value: bundleTag,
                        label: bundleTag,
                        children: bundles.map(bundle => ({
                            value: bundle.id,
                            label: `${bundle.id} (${distanceInWords(
                                new Date(),
                                bundle.createdAt
                            )})`
                        }))
                    };
                })
            };
        });
    }

    // From the selected bundle id, get the corresponding array of node values
    getValue() {
        const selectedBundle = find(this.props.bundles, {
            id: this.props.input.value
        }) as IBundle | undefined;
        return selectedBundle
            ? [selectedBundle.name, selectedBundle.tag, selectedBundle.id]
            : undefined;
    }

    render() {
        const error = this.props.meta.error;
        const displayError = this.props.meta.touched && error;
        return (
            <Form.Item
                label={this.props.label}
                className={classnames("c-BundleIdField", this.props.className)}
                validateStatus={displayError ? "error" : undefined}
                help={displayError ? error : undefined}
            >
                <Cascader
                    options={this.getOptions()}
                    value={this.getValue()}
                    onChange={([, , bundleId]) =>
                        // On user select, the Cascader calls onChange with the
                        // array of node values selected by the user. We are
                        // only interested in the last node, which is the bundle
                        // id
                        this.props.input.onChange(bundleId || null)
                    }
                    // onBlur is not typed, but accepted
                    {...{ onBlur: this.props.input.onBlur }}
                    disabled={this.props.disabled}
                    placeholder={this.props.placeholder}
                    displayRender={(_lables, selectedOptions) => {
                        const [bundleName, bundleTag, bundleId] = map(
                            selectedOptions,
                            "value"
                        );
                        return bundleName
                            ? `${bundleName}:${bundleTag} (${bundleId})`
                            : null;
                    }}
                />
            </Form.Item>
        );
    }
}

export default class BundleIdField extends React.Component<IProps> {
    render() {
        return (
            <Field
                name={this.props.name}
                // Untyped as typing it only complicates the code for no benefit
                component={WrappedBundleIdField as any}
                props={this.props as any}
            />
        );
    }
}
