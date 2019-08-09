import Alert from "antd/lib/alert";
import Divider from "antd/lib/divider";
import Spin from "antd/lib/spin";
import React from "react";

import "./index.css";

interface IAddedProps<FecthDataResult> {
    result: FecthDataResult;
    refetch: () => void;
}

interface IProps<FecthDataResult, ProxiedProps> {
    fetchData: (proxiedProps: ProxiedProps) => Promise<FecthDataResult>;
    spinnerSize?: "small" | "default" | "large";
    spinnerTip?: string;
    shouldRefetch?: (
        oldProxiedProps: ProxiedProps,
        newProxiedProps: ProxiedProps
    ) => boolean;
    Component: React.ComponentType<ProxiedProps & IAddedProps<FecthDataResult>>;
    proxiedProps: ProxiedProps;
}

export enum FetchStatus {
    STARTED,
    SUCCEEDED,
    FAILED
}
interface IState<FecthDataResult> {
    status: FetchStatus;
    result: FecthDataResult | null;
    error: Error | null;
}

export default class DataFetcher<
    FecthDataResult,
    ProxiedProps
> extends React.Component<
    IProps<FecthDataResult, ProxiedProps>,
    IState<FecthDataResult>
> {
    state: IState<FecthDataResult> = {
        status: FetchStatus.STARTED,
        result: null,
        error: null
    };
    componentWillMount() {
        this.fetchData(this.props);
    }
    componentWillReceiveProps(
        nextProps: IProps<FecthDataResult, ProxiedProps>
    ) {
        if (
            nextProps.shouldRefetch &&
            nextProps.shouldRefetch(
                this.props.proxiedProps,
                nextProps.proxiedProps
            )
        ) {
            this.fetchData(nextProps);
        }
    }
    async fetchData(props: IProps<FecthDataResult, ProxiedProps>) {
        try {
            this.setState({
                status: FetchStatus.STARTED,
                result: null,
                error: null
            });
            const result = await props.fetchData(props.proxiedProps);
            this.setState({
                status: FetchStatus.SUCCEEDED,
                result: result,
                error: null
            });
        } catch (err) {
            this.setState({
                status: FetchStatus.FAILED,
                result: null,
                error: err
            });
        }
    }
    renderSpinner() {
        return (
            <div className="c-DataFetcher-spinner">
                <Spin
                    size={this.props.spinnerSize}
                    tip={this.props.spinnerTip}
                />
            </div>
        );
    }
    renderComponent() {
        return (
            <this.props.Component
                {...this.props.proxiedProps}
                result={this.state.result!}
                refetch={() => this.fetchData(this.props)}
            />
        );
    }
    renderError() {
        const description = (
            <div className="c-DataFetcher-error">
                {/* eslint-disable-next-line */}
                <a onClick={() => this.fetchData(this.props)}>{"Retry"}</a>
                <Divider type="vertical" />
                {/* eslint-disable-next-line */}
                <a onClick={() => window.location.reload()}>
                    {"Reload the page"}
                </a>
            </div>
        );
        return (
            <Alert
                message={this.state.error!.message}
                description={description}
                type="error"
                showIcon={true}
            />
        );
    }
    render() {
        switch (this.state.status) {
            case FetchStatus.STARTED:
                return this.renderSpinner();
            case FetchStatus.SUCCEEDED:
                return this.renderComponent();
            case FetchStatus.FAILED:
                return this.renderError();
        }
    }
}

export function withData<FecthDataResult, ProxiedProps>(
    options: Pick<
        IProps<FecthDataResult, ProxiedProps>,
        | "fetchData"
        | "spinnerSize"
        | "spinnerTip"
        | "shouldRefetch"
        | "Component"
    >
) {
    return (proxiedProps: ProxiedProps) => (
        <DataFetcher
            fetchData={options.fetchData}
            spinnerSize={options.spinnerSize}
            spinnerTip={options.spinnerTip}
            shouldRefetch={options.shouldRefetch}
            Component={options.Component}
            proxiedProps={proxiedProps}
        />
    );
}
