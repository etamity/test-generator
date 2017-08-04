/* jshint esnext: true */

import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import promoStates from './constants/promoStates';
import StaticScreen from './screens/StaticScreen';

class Promo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentScreen: promoStates.STATIC_SCREEN,
            config: null
        };
    }

    componentDidMount() {
        fetch('https://github.gamesys.co.uk/pages/joey-etamity/test-info-generator/config.json')
        .then(response => response.json())
        .then(json => {
            this.setState({config: json});
        });
    }

    // Remove listener for PromoStore state changes
    componentWillUnmount() {

    }

    // Check PromoStore baseState and get all other states
    _onChangeState() {


    }

    // React JS function to render components to screen
    render() {

        // All promo partials
        const promoPartials = {
            [promoStates.STATIC_SCREEN]:
                <StaticScreen config={this.state.config} />
        };

        // Load the correct promo partial
        const thePartial =
            <div>
                {promoPartials[this.state.currentScreen]}
            </div>;

        return (
            <div>
                { thePartial }
            </div>
        );
    }
}

ReactDOM.render((<Promo/>), document.getElementById('promotion'));
