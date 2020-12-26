import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './store';
import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { fetcher } from './lib/fetcher';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const store = configureStore({
    reducer: rootReducer
});

ReactDOM.render(
    <Provider store={store}>
        <SWRConfig value={{fetcher: fetcher}}>
            <App/>
        </SWRConfig>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
