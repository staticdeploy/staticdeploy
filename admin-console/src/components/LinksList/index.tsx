import Icon from "antd/lib/icon";
import React from "react";
import { NavLink } from "react-router-dom";

import "./index.css";

interface IItem {
    id: string;
}

interface IProps<Item extends IItem> {
    title?: React.ReactNode;
    items: Item[];
    getDescription: (item: Item) => React.ReactNode;
    getHref: (item: Item) => string;
}

export default class LinksList<Item extends IItem> extends React.PureComponent<
    IProps<Item>
> {
    renderTitle() {
        return this.props.title ? <h4>{this.props.title}</h4> : null;
    }
    renderLinks = (item: Item) => {
        const href = this.props.getHref(item);
        return (
            <NavLink key={item.id} className="c-LinksList-item" to={href}>
                <div className="c-LinksList-item-description">
                    {this.props.getDescription(item)}
                </div>
                <Icon type="right" />
            </NavLink>
        );
    };
    render() {
        return (
            <div className="c-LinksList">
                {this.renderTitle()}
                {this.props.items.map(this.renderLinks)}
            </div>
        );
    }
}
