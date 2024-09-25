import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({
                    children,
                    className = '',
                    style = {},
                    disabled,
                    to,
                    state,
                    onClick,
                    type = 'button'
                }) => {
    const combinedClassName = useMemo(() => {
        const hasTextColor = className.includes('text-') || style.color;
        const hasShadow = className.includes('shadow-') || style.boxShadow;
        const hasHover = className.includes('hover:') || style.hover;
        return `
          button
          ${className}
          hover:text-buttons
          ${!hasHover ? 'hover:text-buttons hover:shadow-button-hover hover:scale-98' : ''}
          ${!hasTextColor ? 'text-titles' : ''}
          ${!hasShadow ? 'shadow-outer-custom' : ''}
        `.trim();
    }, [className, style.color, style.boxShadow]);

    const commonProps = {
        className: combinedClassName,
        style,
        onClick: !disabled ? onClick : undefined,
        'aria-disabled': disabled
    };

    if (to) {
        return (
            <Link to={to} state={state} {...commonProps}>
                {children}
            </Link>
        );
    }

    return (
        <button {...commonProps} disabled={disabled} type={type}>
            {children}
        </button>
    );
};

export default Button;