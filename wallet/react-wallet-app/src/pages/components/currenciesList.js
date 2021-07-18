import React from 'react'
import Button from "./button";
import CurrencyItem from "./currencyItem";


const CurrenciesList = ({ data, goToCreateWallet }) => {
    return (
        <div className='currencyItem'>
            <div className='assetCaption'>
                <h3>Your Assets</h3>
                <p>Here you can safely store, send and receive assets</p>
            </div>
            {
                data.map((row, index) => <CurrencyItem key={index} item={row}/>)
            }
            <div className='actionContainer'>
                <Button id="addAssetBtn" onClick={goToCreateWallet} className="w-full col-blue">Add currency</Button>
            </div>
        </div>
    );
};

export default CurrenciesList;
