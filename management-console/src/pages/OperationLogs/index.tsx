import { IOperationLog } from "@staticdeploy/core";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";

import { withData } from "../../components/DataFetcher";
import OperationLogsList from "../../components/OperationLogsList";
import Page from "../../components/Page";

interface IProps {
    result: IOperationLog[];
    refetch: () => void;
}

class OperationLogs extends React.Component<IProps> {
    render() {
        return (
            <Page title="Operation logs list">
                <Row gutter={32}>
                    <Col span={18}>
                        <OperationLogsList
                            title="Operation logs"
                            operationLogs={this.props.result}
                        />
                    </Col>
                </Row>
            </Page>
        );
    }
}

export default withData({
    fetchData: staticdeploy => staticdeploy.operationLogs.getAll(),
    spinnerSize: "large",
    spinnerTip: "Fetching operation logs...",
    Component: OperationLogs
});
