import React from 'react';
import ReactDom from 'react-dom';
import MapView from './components/MapView';

import './style/app.scss';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Hello World
                <MapView />
            </div>
        )
    }

}

ReactDom.render(<App/>, document.getElementById('root'));