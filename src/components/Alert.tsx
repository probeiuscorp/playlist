import { conditional } from '@client/util';
import React from 'react';
import './Alert.scss';

export interface AlertProps {
    variant: 'error' | 'warn' | 'ok',
    children: React.ReactChildren | string
}

export default function Alert(props: AlertProps) {
    return (
        <div className={conditional({
            "alert": true,
            "error": props.variant === 'error',
            "warn": props.variant === 'warn',
            "ok": props.variant === 'ok'
        })}>
            <i className={conditional({
                "bi": true,
                "bi-x-circle-fill": props.variant === 'error',
                "bi-exclamation-circle-fill": props.variant === 'warn',
                "bi-check-circle-fill": props.variant === 'ok'
            })}/>
            {props.children}
        </div>
    )    
}