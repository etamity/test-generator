/* jshint esnext: true */
'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ToggleButton, ToggleButtonGroup, FormControl, Alert, Panel } from 'react-bootstrap';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
class StaticScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            venture: 'jackpotjoy-content',
            folder: null,
            date: moment(),
            focused: false
        };
        this._doVentureClick = this._doVentureClick.bind(this);
        this._onFolderChange = this._onFolderChange.bind(this);
    }
    _doVentureClick(data) {
        this.setState({ venture: data.props.value });
    }
    _onFolderChange(e) {
        this.setState({ folder: e.target.value });
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

            const promotionsInfo = <div className="form">
                <FormControl type="text"
                    placeholder="Enter promotion folder name" onChange={this._onFolderChange}></FormControl>
                <SingleDatePicker
                date={this.state.date} 
                onDateChange={date => this.setState({ date: date})} 
                focused={this.state.focused} 
                onFocusChange={({ focused }) => this.setState({ focused })}
                />
            </div>;

            let output = <Alert bsStyle="danger">
                <strong>Missing Information!</strong> Please Fill Folder Name and Date</Alert>;
            if (this.state.folder && this.state.folder.length > 0 && this.state.date) {
                const ventureItem = config[this.state.venture];
                const testUsers = ventureItem.testUsers.join(', ').toString();
                const date = this.state.date.format('DD-MM-YYYY');
                const folder = this.state.folder.toLowerCase();
                const desktopUrl = `https://${ventureItem.desktopUrl}/api/content/promotions/${folder}/?previewDate=${date}&m=${ventureItem.testUsers[0]}`;
                const unicornUrlPreview = `https://${ventureItem.url}/api/content/promotions?previewDate=${date}`;
                const unicornUrl = `https://${ventureItem.url}/api/content/promotions/detailedpromotionstory/${folder}/?previewDate=${date}&m=${ventureItem.testUsers[0]}`;
                output = <Panel>
                    <span>Desktop Link:</span>
                    <p><a href={desktopUrl}>{desktopUrl}</a></p>
                    <span>Unicorn Link:</span>
                    <p><a href={unicornUrlPreview}>{unicornUrlPreview}</a></p>
                    <p><a href={unicornUrl}>{unicornUrl}</a></p>
                    <span>Test Users:</span>
                    <p>{testUsers}</p>
                    </Panel>;
            }
            thePartial = <div className="container">
                <h2>Test Instructions Generator</h2>
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
