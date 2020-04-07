import React from "react";
import {
    ConfigProps,
    FormErrors,
    FormInstance,
    InjectedFormProps,
    reduxForm as wrappedReduxForm,
} from "redux-form";

const identity = (thing: any) => thing;

interface IProps<ExternalValues> {
    onSubmit?: (values: ExternalValues) => void;
    initialValues?: Partial<ExternalValues>;
}

interface IConfig<ExternalValues, InternalValues> {
    form: string;
    touchOnBlur?: boolean;
    validate?: (values: InternalValues) => FormErrors<InternalValues>;
    toInternal?: (values: any) => InternalValues;
    toExternal?: (values: InternalValues) => ExternalValues;
}

export interface IConverterForm<ExternalValues> {
    submit: () => Promise<any>;
    isValid: () => boolean;
    getValues: () => ExternalValues;
}

export function reduxForm<ExternalValues, InternalValues, AdditionalProps = {}>(
    config: IConfig<ExternalValues, InternalValues>
) {
    const toInternal: any = config.toInternal || identity;
    const toExternal: any = config.toExternal || identity;
    return (
        Form: React.ComponentType<
            InjectedFormProps<InternalValues> & AdditionalProps
        >
    ) => {
        const DecoratedForm = wrappedReduxForm({
            form: config.form,
            validate: config.validate,
            touchOnBlur: config.touchOnBlur !== false,
        })(Form as any);
        return class ConverterForm
            extends React.Component<IProps<ExternalValues> & AdditionalProps>
            implements IConverterForm<ExternalValues> {
            private form!: FormInstance<
                InternalValues,
                Partial<ConfigProps<InternalValues, {}>>,
                string
            >;
            submit(): Promise<any> {
                return this.form.submit();
            }
            isValid(): boolean {
                return this.form.valid;
            }
            getValues(): ExternalValues {
                return toExternal(this.form.values);
            }
            render() {
                const { initialValues, onSubmit, ...rest } = this.props;
                return (
                    <DecoratedForm
                        {...rest}
                        ref={(form) => (this.form = form!)}
                        initialValues={toInternal(initialValues)}
                        onSubmit={(values) =>
                            onSubmit && onSubmit(toExternal(values))
                        }
                    />
                );
            }
        };
    };
}
