// frontend/src/App.js
import React, { useEffect, useState } from 'react';

function Userregist() {
    const [householdSize, setHouseholdSize] = useState(0);  /*setHouseholdSizeは世帯人数を更新するための関数 */
    const handleHouseholdSizechange = (size) => {   /*世帯人数が変更されたときに呼び出される*/
        setHouseholdSize(size);
    };

    return (
        <div className="ask">
            <h1>あなたの世帯人数を教えてください</h1>
        <div className="household_size_selector">
            <h2>{householdSize > 0 ? `${householdSize}人住んでいます` : '世帯人数を入力してください'}</h2>
        </div>
        <div className="buttons">
            {[...Array(9)].map((_, i) => (
                <button
                    key={i + 1}
                    className={householdSize === i + 1 ? 'selected' : ''}
                    onClick={() => handleHouseholdSizechange(i + 1)}
                >
                    {i + 1}
                </button>
            ))}
        </div>
            {householdSize > 0 && <HouseholdForm householdSize={householdSize} />}
        
        </div>
    );
}

function HouseholdForm({householdSize}){
    
}

export default Userregist;