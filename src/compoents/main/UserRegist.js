// frontend/src/App.js
import React, { useEffect, useState } from 'react';

function Userregist() {
    const [householdSize, setHouseholdSize] = useState(0);  /*setHouseholdSizeは世帯人数を更新するための関数 */
    const [members, setMembers] = useState([]);     //メンバーの情報を格納する配列
    const [showConfirmation, setShowConfirmation] = useState(false);    //確認画面を表示するかどうか
    
    const handleHouseholdSizechange = (size) => {   /*世帯人数が変更されたときに呼び出される*/
        setHouseholdSize(size);     //householdSizeを更新し、members配列をsizeの要素数で初期化する
        setMembers(Array(size).fill({gender:'', ageGroup:''}));
        setShowConfirmation(false);
    };

    const handleMemberChange = (index, field, value) => {   //メンバーの情報が変更されたときに呼び出される関数
        const newMembers = [...members];    //index: 変更するメンバー,field: 変更する情報,value: 新しい値
        newMembers[index][field] = value;
        setMembers(newMembers);
    }

    const handleConfirmation = () => {  //確認ボタンがクリックされたとき呼び出される
        setShowConfirmation(true);
    }

    return (
        <div className="membernum">
            <h1>あなたと、一緒に住んでいる人のそれぞれの性別・年代を教えてください</h1>
            <div>
                <h2>{householdSize > 0 ? `${householdSize}人住んでいます` : '世帯人数を入力してください'}</h2>
                <div className="householdbuttons">
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
            </div>
            {householdSize > 0 && (
                <div>
                    {members.map((member, index) => (
                        <HouseholdMemberForm
                            key={index}
                            index={index}
                            member={member}
                            hendleMemberChange={handleMemberChange}
                        />
                    ))}
                    <button onClick={handleConfirmation}>確認</button>
                </div>
            )}
            {showConfirmation && (
                <div>
                    <h3>これでよろしいですか？</h3>
                    <u1>
                        {members.map((member, index) => (
                            <li key={index}>
                                {index + 1}人目：性別 - {member.gender}, 世代 - {member.ageGroup}
                            </li>
                        ))}
                    </u1>
                </div>
            )}
        </div>
    );
}


function HouseholdMemberForm({index, member, handleMemberChange}){
    const genderOptions = ['男性', '女性'];
    const ageGroups = [
        '乳幼児（0~2歳）',
        '子供（3歳～小6）',
        '子供（中学生以上）',
        '成人（18歳以上）',
        '高齢者（65歳以上）'
    ];

    return (
        <div>
            <h2>{index + 1}人目の性別・年代</h2>
            <div className="button-group">
                <h3>性別</h3>
                {genderOptions.map((option) => (
                    <button
                        key={option}
                        className={member.gender ===option ? 'selected' : ''}
                        onClick={() => handleMemberChange(index, 'gender', option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <div className="button-group">
                <h3>世代</h3>
                {ageGroups.map((group) => (
                    <button
                        key={group}
                        className={member.ageGroup === group ? 'selected' : ''}
                        onClick={() => handleMemberChange(index, 'ageGroup', group)}
                    >
                        {group}
                    </button>
                ))}
            </div>
        </div>
    )
}



export default Userregist;