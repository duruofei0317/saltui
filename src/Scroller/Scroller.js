/**
 * Scroller Component for tingle
 * @author gbk
 *
 * Copyright 2014-2016, Tingle Team.
 * All rights reserved.
 */
const React = require('react');
const classnames = require('classnames');
const IScroll = require('./iscroll');
const Context = require('../Context');

class Scroller extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let t = this;

        // 根节点的dom引用
        t.el = ReactDOM.findDOMNode(t.refs.root);

        // 初始化 iscroll
        t.initScroll();
    }

    componentDidUnMount() {

        // 销毁 iscroll
        this.scroller.destroy();
    }

    componentDidUpdate() {
        let t = this;

        // 避免很频繁的调用
        clearTimeout(t._timeout);
        t._timeout = setTimeout(function () {

            // 有些场景下不需要刷新
            if (t.props.autoRefresh) {

                // 更新 iscroll
                t.scroller && t.scroller.refresh()
            }
        }, 10);
    }

    render() {
        let t = this;

        // iscroll 需要一个 wrapper，所以里面多加了一层 div
        return (
            <div className={classnames(Context.prefixClass('scroller'), {
                [t.props.className]: !!t.props.className
            })} ref="root">
                <div className={Context.prefixClass('DIB')}
                     style={{minWidth: t.props.minWidth}}>{this.props.children}</div>
            </div>
        );
    }

    initScroll() {
        let t = this;

        // 参数过滤，onXxx 是事件，否则是配置参数
        let options = {};
        let events = {};
        for (let key in t.props) {
            let matches = /^on([A-Z]\w*)$/.exec(key);
            if (matches) { // 事件
                let evtName = matches[1].replace(/./, function (p) {
                    return p.toLowerCase();
                });
                events[evtName] = t.props[key];
            } else if (key !== 'className' && key !== 'autoRefresh' &&
                key !== 'minWidth') { // 配置
                options[key] = t.props[key];
            }
        }

        // iscroll 实例化
        t.scroller = new IScroll(t.el, options);

        // 事件挂载
        for (let key in events) {
            t.scroller.on(key, events[key].bind(null, t.scroller));
        }
    }
}

// 更多配置参数，详见 http://iscrolljs.com/ ，事件用 onXxx 的格式，例如 scrollEnd 事件对应的参数是 onScrollEnd
Scroller.defaultProps = {
    click: /chrome/i.test(navigator.userAgent), //iscroll 默认屏蔽内部的 click 事件，考虑到在 chrome 中调试没开模拟器的场景，允许响应 click 点击。 http://iscrolljs.com/#basic-features
    disablePointer: true,
    autoRefresh: true,
    minWidth: '100%'
};

// http://facebook.github.io/react/docs/reusable-components.html
Scroller.propTypes = {
    autoRefresh: React.PropTypes.bool,
    className: React.PropTypes.string,
    disablePointer: React.PropTypes.bool,
};

module.exports = Scroller;