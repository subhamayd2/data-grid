import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { IntlProvider } from 'react-intl';
import App from './App';
import messages from './messages.json';

ReactDOM.render(
    <IntlProvider locale="en" messages={messages}>
        <App />
    </IntlProvider>,
    document.getElementById('root'),
);
