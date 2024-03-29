import { IBundle } from "@staticdeploy/core";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { InjectedFormProps } from "redux-form";

import { fromKVPairs, toKVPairs } from "../../common/configurationUtils";
import {
    IConverterForm,
    reduxForm,
} from "../../common/formWithValuesConverter";
import StaticdeployClientContext from "../../common/StaticdeployClientContext";
import BundleIdField from "../BundleIdField";
import ConfigurationField from "../ConfigurationField";
import TextField from "../TextField";
import { IExternalFormValues, IInternalFormValues } from "./IFormValues";
import validate from "./validate";

interface IProps {
    isEditForm?: boolean;
}

interface IState {
    bundles: Pick<IBundle, "id" | "name" | "tag" | "createdAt">[];
    loadingBundles: boolean;
    errorLoadingBundles: Error | null;
}

class EntrypointForm extends React.Component<
    IProps & InjectedFormProps<IInternalFormValues>,
    IState
> {
    static contextType = StaticdeployClientContext;
    context!: React.ContextType<typeof StaticdeployClientContext>;
    state = { bundles: [], loadingBundles: false, errorLoadingBundles: null };

    async componentDidMount() {
        this.setState({
            bundles: [],
            loadingBundles: true,
            errorLoadingBundles: null,
        });
        try {
            const staticdeploy = this.context!;
            const bundles = await staticdeploy.bundles.getAll();
            this.setState({
                bundles: bundles,
                loadingBundles: false,
                errorLoadingBundles: null,
            });
        } catch (err) {
            this.setState({
                bundles: [],
                loadingBundles: false,
                errorLoadingBundles: err as Error,
            });
        }
    }

    render() {
        const { isEditForm } = this.props;
        const { bundles, loadingBundles, errorLoadingBundles } = this.state;
        return (
            <form onSubmit={this.props.handleSubmit}>
                <TextField
                    label="Url matcher"
                    name="urlMatcher"
                    placeholder="sub.example.com/path/"
                    inlineError={true}
                    disabled={isEditForm}
                />
                <TextField
                    label="Redirect to"
                    name="redirectTo"
                    placeholder="https://example.com/"
                    inlineError={true}
                />
                <BundleIdField
                    bundles={bundles}
                    label="Bundle"
                    name="bundleId"
                    placeholder="No bundle selected"
                    disabled={loadingBundles || !!errorLoadingBundles}
                />
                <ConfigurationField
                    label="Configuration"
                    name="configuration"
                />
            </form>
        );
    }
}

export interface IEntrypointFormInstance
    extends IConverterForm<IExternalFormValues> {}

export default reduxForm<IExternalFormValues, IInternalFormValues, IProps>({
    form: "EntrypointForm",
    validate: validate,
    toInternal: (initialValues = {}) => ({
        bundleId: initialValues.bundleId,
        redirectTo: initialValues.redirectTo || "",
        urlMatcher: initialValues.urlMatcher || "",
        configuration: toKVPairs(initialValues.configuration || {}),
    }),
    toExternal: (values) => ({
        bundleId: values.bundleId,
        redirectTo: values.redirectTo || null,
        urlMatcher: values.urlMatcher,
        configuration: !isEmpty(values.configuration)
            ? fromKVPairs(values.configuration)
            : null,
    }),
})(EntrypointForm);
