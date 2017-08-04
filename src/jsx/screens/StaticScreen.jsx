/* jshint esnext: true */
'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ToggleButton, Form, Col, ToggleButtonGroup, FormGroup, InputGroup, FormControl, Alert, Panel, Button } from 'react-bootstrap';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
class StaticScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            venture: 'jackpotjoy-content',
            folder: null,
            date: moment(),
            focused: false,
            user: null,
            vip: false
        };
        this._doVentureClick = this._doVentureClick.bind(this);
        this._onFolderChange = this._onFolderChange.bind(this);
        this._onMemberButtonClick = this._onMemberButtonClick.bind(this);
        this._onVipButtonClick = this._onVipButtonClick.bind(this);
    }
    _doVentureClick(data) {
        this.setState({ venture: data.props.value });
    }
    _onFolderChange(e) {
        this.setState({ folder: e.target.value });
        if (this.state.vip === false && e.target.value.includes('-vip-')) {
            this.setState({ vip: true });
        }
    }
    _onMemberButtonClick(id) {
        this.setState({ user: id });
    }
    _onVipButtonClick(){
        this.setState({ vip: !this.state.vip });
    }
    _copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return window.clipboardData.setData('Text', text);

        } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            var textarea = document.createElement('textarea');
            textarea.textContent = text;
            textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand('copy');  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
    render() {
        let thePartial = <div></div>;
        if (this.props.config) {
            const config = this.props.config;
            let ventureButtons = [];
            for (var key in config) {
                const venturesName = key.split('-')[0];
                const button = <ToggleButton bsSize="large" bsStyle={key === this.state.venture ? 'primary' : 'default'} value={key} key={`venture-${key}`} onClick={() => { this._doVentureClick(button); }}>
                    {venturesName}
                </ToggleButton>;
                ventureButtons.push(button);
            }
            const ventures = (
                <ButtonToolbar>
                    <ToggleButtonGroup justified type="radio" name="options" defaultValue={this.state.venture}>
                        {ventureButtons}
                    </ToggleButtonGroup>
                </ButtonToolbar>);

            const promotionsInfo = <Form horizontal>
                <FormGroup>
                <InputGroup className="form">
                    <Col>
                    <Button bsStyle={this.state.vip ? 'warning' : 'default'} onClick={this._onVipButtonClick}>VIP</Button>
                    </Col>
                    <Col lg={10}>
                        <FormControl type="text"
                        placeholder="Enter promotion folder name" onChange={this._onFolderChange}></FormControl>
                    </Col>
                    <Col>
                        <SingleDatePicker
                                displayFormat="DD-MM-YYYY"
                                date={this.state.date}
                                isOutsideRange={() => false}
                                onDateChange={date => this.setState({ date: date })}
                                focused={this.state.focused}
                                onFocusChange={({ focused }) => this.setState({ focused })}
                        />
                    </Col>
                </InputGroup>

            </FormGroup></Form>;

            let output = <Alert bsStyle="danger">
                <strong>Missing Information!</strong> Please Fill Folder Name and Date</Alert>;
            if (this.state.folder && this.state.folder.length > 0 && this.state.date) {
                const ventureItem = config[this.state.venture];
                const testUsers = ventureItem.testUsers.map((id, index) =>
                    <Button className="member-button" bsStyle={this.state.user === id ? 'warning' : 'success'} key={index} onClick={() => {
                        this._onMemberButtonClick(id);
                    }}>{id}</Button>);
                const date = this.state.date.format('DD-MM-YYYY');
                const vip = this.state.vip ? 'vip/' : '';
                const folder = this.state.folder.toLowerCase();
                const user = this.state.user ? this.state.user : ventureItem.testUsers[0];
                const unicornUrl= `https://${ventureItem.url}/promotions/detailedpromotionstory/${vip}${folder}/?previewDate=${date}&m=${user}`;
                const desktopUrl= `https://${ventureItem.desktopUrl}/api/content/promotions/${vip}${folder}/?previewDate=${date}&m=${user}`;
                const outputText = `Desktop: \n${desktopUrl}\n\nUnicorn: \n${unicornUrl}\n\nTest Users:\n${ventureItem.testUsers.join(', ').toString()}`;
                output = <Panel>
                    <Button bsStyle="info" block onClick={() => this._copyToClipboard(outputText)}>COPY TO CLIPBOARD</Button>
                    <br />
                    {this.state.vip ? <label className="vip-tag"><h3>VIP</h3></label> : null }
                    <span>Desktop Link:</span>
                    <p><a href={desktopUrl} target="_blank">{desktopUrl}</a></p>
                    <span>Unicorn Link:</span>
                    <p><a href={unicornUrl} target="_blank">{unicornUrl}</a></p>
                    <span>Test Users:</span>
                    <p>{testUsers}</p>
                    <Button bsStyle="info" block onClick={() => this._copyToClipboard(outputText)}>COPY TO CLIPBOARD</Button>
                </Panel>;

            }
            thePartial = <div className="container">
                <h3>Test Instructions Generator</h3>
                {ventures}
                {promotionsInfo}
                {output}
            </div>;
        }
        return thePartial;
    }
}

StaticScreen.propTypes = {
    config: PropTypes.object
};

export default StaticScreen;
