import React from "react";

const Button = (props) => {
    const {
        children,
        className,
        disabled,
        pending,
        onClick,
        id = '',
        dataTut,
    } = props

    return (
        <button
            data-tut={dataTut}
            className={className}
            onClick={onClick}
            id={id}
            disabled={disabled}
            data-for={id}
        >
            {pending ? (
                <span className="pending">Pending</span>
            ) : children
            }
        </button>
    )
}

export default Button;
