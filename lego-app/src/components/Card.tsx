import React from "react";
import "./Card.css";

interface CardProps {
    name: string;
    id: string;
    theme: string;
    releaseYear: string;
    state: string;
    amount: number;
    price: number;
}

const Card: React.FC<CardProps> = ({
    name,
    id,
    theme,
    releaseYear,
    state,
    amount,
    price,
}) => {
    return (
        <div className="lego-card">
            {/* Image container */}
            <div className="image-container">
                <img
                    src={`/images/${id}.png`}
                    alt={name}
                    className="card-image"
                    onError={(e) => {
                        // Fallback to default image if specific image is missing
                        (e.target as HTMLImageElement).src =
                            "/images/default.jpg";
                    }}
                />
            </div>
            {/* Text container */}
            <div className="text-container">
                <h3>{name}</h3>
                <p>
                    <strong>Theme:</strong> {theme}
                </p>
                <p>
                    <strong>Release Year:</strong> {releaseYear}
                </p>
                <p>
                    <strong>State:</strong> {state}
                </p>
                <p>
                    <strong>Amount:</strong> {amount}
                </p>
                <p>
                    <strong>Price:</strong> {price} Kč
                </p>
            </div>
        </div>
    );
};

export default Card;
